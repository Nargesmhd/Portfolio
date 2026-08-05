import { useCallback, useEffect, useId, useState } from 'react';

/*
 * The dashboard body. Everything here is client-side: the site is a static
 * build, so the numbers arrive from /admin/api/stats after load rather than
 * being baked into the HTML. That endpoint and this page sit behind the same
 * Cloudflare Access application, so the browser's session cookie authenticates
 * the fetch and there is no token to handle here.
 *
 * Charts are the usual place accessibility quietly gets dropped, and this is a
 * portfolio that claims otherwise on its own accessibility page. So the bars
 * are decorative and every number they encode is also available as text: the
 * headline figures in prose, the full series in a real table one disclosure
 * away.
 */

const RANGES = [7, 30, 90] as const;
type Range = (typeof RANGES)[number];

interface Stats {
  range: { days: number; start: string; end: string };
  totals: { visits: number; pageViews: number };
  daily: { date: string; visits: number; pageViews: number }[];
  pages: { path: string; pageViews: number }[];
  referrers: { host: string; pageViews: number }[];
  countries: { country: string; pageViews: number }[];
  generatedAt: string;
}

type State =
  | { status: 'loading' }
  | { status: 'ready'; stats: Stats; sample: boolean }
  | { status: 'error'; message: string };

const numberFormat = new Intl.NumberFormat('en-CA');

/* Dates from the API are calendar days in UTC. Formatting them in the local
   zone would slide them a day for anyone west of Greenwich - including here in
   Toronto - so the timezone is pinned to match the bucket. */
const dayFormat = new Intl.DateTimeFormat('en-CA', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

const longDayFormat = new Intl.DateTimeFormat('en-CA', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

const timeFormat = new Intl.DateTimeFormat('en-CA', {
  hour: 'numeric',
  minute: '2-digit',
});

export default function AdminStats() {
  const [range, setRange] = useState<Range>(30);
  const [state, setState] = useState<State>({ status: 'loading' });
  const [reloads, setReloads] = useState(0);
  const uid = useId();

  const load = useCallback(async (days: Range, signal: AbortSignal) => {
    try {
      const response = await fetch(`/admin/api/stats?days=${days}`, {
        signal,
        headers: { Accept: 'application/json' },
        /* The Access cookie is the credential; without this a cross-check on
           the endpoint would see an anonymous request. */
        credentials: 'same-origin',
      });

      const body = (await response.json().catch(() => null)) as
        | (Stats & { error?: string })
        | null;

      if (!response.ok) {
        throw new Error(
          body?.error ?? `The stats endpoint returned ${response.status}.`,
        );
      }
      if (!body) throw new Error('The stats endpoint returned no data.');

      setState({ status: 'ready', stats: body, sample: false });
    } catch (error) {
      if (signal.aborted) return;

      /* There is no Worker in front of `astro dev`, so locally this always
         fails. Rather than leaving the page undesignable offline, dev falls
         back to sample numbers - loudly labelled, and impossible in a
         production build because the branch is compiled out. */
      if (import.meta.env.DEV) {
        setState({ status: 'ready', stats: sampleStats(days), sample: true });
        return;
      }

      setState({
        status: 'error',
        message:
          error instanceof Error ? error.message : 'Could not load the stats.',
      });
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });
    void load(range, controller.signal);
    return () => controller.abort();
  }, [load, range, reloads]);

  return (
    <div className="admin">
      <div className="admin-controls">
        <fieldset className="admin-range">
          <legend className="sr-only">Time range</legend>
          {RANGES.map((days) => (
            <div key={days} className="admin-range-item">
              <input
                type="radio"
                className="admin-range-input sr-only"
                id={`${uid}-range-${days}`}
                name={`${uid}-range`}
                value={days}
                checked={range === days}
                onChange={() => setRange(days)}
              />
              <label htmlFor={`${uid}-range-${days}`}>{days} days</label>
            </div>
          ))}
        </fieldset>

        <button
          type="button"
          className="admin-refresh"
          onClick={() => setReloads((n) => n + 1)}
        >
          Refresh
        </button>
      </div>

      {/* Status changes are announced without stealing focus, so a refresh
          does not yank a screen reader back to the top of the page. */}
      <div role="status" aria-live="polite" className="admin-status">
        {state.status === 'loading' && <p>Loading visit data…</p>}
        {state.status === 'ready' && state.sample && (
          <p className="admin-sample">
            <strong>Sample data.</strong> The stats API only exists in
            production, so these numbers are invented to make the page
            designable locally.
          </p>
        )}
      </div>

      {state.status === 'error' && <ErrorPanel message={state.message} />}
      {state.status === 'ready' && <Report stats={state.stats} />}
    </div>
  );
}

function ErrorPanel({ message }: { message: string }) {
  return (
    <div className="admin-error" role="alert">
      <h2>The numbers didn’t load</h2>
      <p className="admin-error-message mono">{message}</p>
      <p>
        Usually one of: the Worker isn’t deployed yet, its route doesn’t match{' '}
        <code>/admin/api/*</code>, or the API token is missing the{' '}
        <em>Account Analytics Read</em> permission. The setup steps are in{' '}
        <code>docs/analytics.md</code>.
      </p>
    </div>
  );
}

function Report({ stats }: { stats: Stats }) {
  const { totals, daily, range } = stats;

  const busiest = daily.reduce<Stats['daily'][number] | null>(
    (best, day) => (best === null || day.visits > best.visits ? day : best),
    null,
  );

  /* An average over a window that includes today would be dragged down by a
     day that is still only partly over. */
  const complete = daily.slice(0, -1);
  const dailyAverage = complete.length
    ? complete.reduce((sum, day) => sum + day.visits, 0) / complete.length
    : 0;

  if (totals.pageViews === 0) {
    return (
      <div className="admin-empty">
        <h2>Nothing recorded yet</h2>
        <p>
          No page views in the last {range.days} days. If the site has had
          traffic, the analytics beacon may not be running - check that{' '}
          <code>PUBLIC_CF_BEACON_TOKEN</code> was set when the site was built.
        </p>
      </div>
    );
  }

  return (
    <>
      <dl className="admin-figures">
        <div>
          <dt>Visits</dt>
          <dd>{numberFormat.format(totals.visits)}</dd>
          <p>people arriving</p>
        </div>
        <div>
          <dt>Page views</dt>
          <dd>{numberFormat.format(totals.pageViews)}</dd>
          <p>pages opened</p>
        </div>
        <div>
          <dt>Busiest day</dt>
          <dd>{busiest ? numberFormat.format(busiest.visits) : '0'}</dd>
          <p>{busiest ? dayFormat.format(new Date(busiest.date)) : '-'}</p>
        </div>
        <div>
          <dt>Daily average</dt>
          <dd>{dailyAverage.toFixed(1)}</dd>
          <p>visits per full day</p>
        </div>
      </dl>

      <DailyChart daily={daily} busiest={busiest} />

      <div className="admin-tables">
        <BreakdownTable
          caption="Most-visited pages"
          heading="Page"
          rows={stats.pages.map((row) => ({
            label: row.path,
            value: row.pageViews,
          }))}
        />
        <BreakdownTable
          caption="Where people came from"
          heading="Source"
          rows={stats.referrers.map((row) => ({
            label: row.host,
            value: row.pageViews,
          }))}
        />
        <BreakdownTable
          caption="Countries"
          heading="Country"
          rows={stats.countries.map((row) => ({
            label: row.country,
            value: row.pageViews,
          }))}
        />
      </div>

      <p className="admin-footnote">
        Updated {timeFormat.format(new Date(stats.generatedAt))} · Cloudflare
        Web Analytics · no cookies, no cross-site tracking, nothing stored on
        anyone’s machine.
      </p>
    </>
  );
}

function DailyChart({
  daily,
  busiest,
}: {
  daily: Stats['daily'];
  busiest: Stats['daily'][number] | null;
}) {
  const peak = Math.max(1, ...daily.map((day) => day.visits));
  const first = daily[0];
  const last = daily[daily.length - 1];

  return (
    <figure className="admin-chart">
      <figcaption>
        <h2>Visits per day</h2>
        {/*
          A real description, not "chart of visits". Someone who cannot see the
          bars should finish this sentence knowing what the bars would have told
          them, which means the shape of the period and its peak - not a label.
        */}
        <p>
          {first && last
            ? `${dayFormat.format(new Date(first.date))} to ${dayFormat.format(
                new Date(last.date),
              )}. `
            : ''}
          {busiest && busiest.visits > 0
            ? `Busiest was ${longDayFormat.format(
                new Date(busiest.date),
              )} with ${numberFormat.format(busiest.visits)} ${
                busiest.visits === 1 ? 'visit' : 'visits'
              }. `
            : ''}
          Day-by-day numbers are in the table below.
        </p>
      </figcaption>

      {/* Decorative: it restates the table that follows, and a screen reader
          reading 90 unlabelled bars would be worse than silence. */}
      <div className="admin-bars" aria-hidden="true">
        {daily.map((day) => (
          <div
            key={day.date}
            className="admin-bar"
            style={{ height: `${Math.round((day.visits / peak) * 100)}%` }}
            data-empty={day.visits === 0 ? '' : undefined}
          />
        ))}
      </div>

      <details className="admin-details">
        <summary>Day-by-day numbers</summary>
        <div className="admin-scroll">
          <table className="admin-table">
            <caption className="sr-only">Visits and page views per day</caption>
            <thead>
              <tr>
                <th scope="col">Day</th>
                <th scope="col">Visits</th>
                <th scope="col">Page views</th>
              </tr>
            </thead>
            <tbody>
              {daily.map((day) => (
                <tr key={day.date}>
                  <th scope="row">
                    {longDayFormat.format(new Date(day.date))}
                  </th>
                  <td>{numberFormat.format(day.visits)}</td>
                  <td>{numberFormat.format(day.pageViews)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}

function BreakdownTable({
  caption,
  heading,
  rows,
}: {
  caption: string;
  heading: string;
  rows: { label: string; value: number }[];
}) {
  const peak = Math.max(1, ...rows.map((row) => row.value));

  return (
    <section className="admin-panel">
      <h2>{caption}</h2>
      {rows.length === 0 ? (
        <p className="admin-none">Nothing in this period.</p>
      ) : (
        <table className="admin-table admin-table--bars">
          <caption className="sr-only">{caption}, by page views</caption>
          <thead>
            <tr>
              <th scope="col">{heading}</th>
              <th scope="col">Views</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">
                  {/* The bar is a background on the cell, so the label stays
                      plain text and stays selectable and searchable. */}
                  <span
                    className="admin-rowbar"
                    style={{ width: `${(row.value / peak) * 100}%` }}
                  />
                  <span className="admin-rowlabel">{row.label}</span>
                </th>
                <td>{numberFormat.format(row.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

/** Plausible-looking numbers for local design work. Never runs in a build. */
function sampleStats(days: number): Stats {
  const end = new Date();
  const daily = Array.from({ length: days }, (_, index) => {
    const date = new Date(end.getTime() - (days - 1 - index) * 86400000);
    const weekend = [0, 6].includes(date.getUTCDay());
    const visits = Math.max(
      0,
      Math.round((weekend ? 4 : 11) + Math.sin(index / 3) * 4),
    );
    return {
      date: date.toISOString().slice(0, 10),
      visits,
      pageViews: Math.round(visits * 2.4),
    };
  });

  return {
    range: {
      days,
      start: new Date(end.getTime() - days * 86400000).toISOString(),
      end: end.toISOString(),
    },
    totals: {
      visits: daily.reduce((sum, day) => sum + day.visits, 0),
      pageViews: daily.reduce((sum, day) => sum + day.pageViews, 0),
    },
    daily,
    pages: [
      { path: '/', pageViews: 412 },
      { path: '/case-study/', pageViews: 233 },
      { path: '/about/', pageViews: 151 },
      { path: '/how-i-design/', pageViews: 96 },
      { path: '/accessibility/', pageViews: 38 },
    ],
    referrers: [
      { host: 'Direct', pageViews: 388 },
      { host: 'linkedin.com', pageViews: 241 },
      { host: 'google.com', pageViews: 174 },
      { host: 'github.com', pageViews: 61 },
    ],
    countries: [
      { country: 'Canada', pageViews: 470 },
      { country: 'United States', pageViews: 232 },
      { country: 'United Kingdom', pageViews: 88 },
      { country: 'Germany', pageViews: 44 },
      { country: 'Netherlands', pageViews: 30 },
    ],
    generatedAt: new Date().toISOString(),
  };
}
