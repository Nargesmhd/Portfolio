/*
 * Reads Cloudflare Web Analytics through the GraphQL Analytics API.
 *
 * The dataset is `rumPageloadEventsAdaptiveGroups` — Real User Monitoring, the
 * numbers the beacon script reports. Two metrics matter and they are not the
 * same thing:
 *
 *   count         page views — one per page load
 *   sum { visits } visits — a page load that did not come from this same site,
 *                  i.e. someone arriving, not someone clicking through
 *
 * "How many people have visited" is closest to visits, so visits leads on the
 * page and page views sit beside it.
 *
 * No bot filter is applied. RUM only records when the beacon executes, and the
 * overwhelming majority of crawlers do not run JavaScript, so the dataset is
 * already close to human-only. Filtering further would trade a small gain in
 * precision for a query that breaks if Cloudflare renames the dimension.
 */

export interface Env {
  /** Secret. Scoped read-only token — see docs/analytics.md. */
  CF_API_TOKEN: string;
  CF_ACCOUNT_ID: string;
  /** The Web Analytics site tag, from the dashboard. */
  CF_SITE_TAG: string;
  /** e.g. "narges.cloudflareaccess.com" */
  ACCESS_TEAM_DOMAIN: string;
  /** The Access application's Application Audience (AUD) tag. */
  ACCESS_AUD: string;
}

export interface Stats {
  range: { days: number; start: string; end: string };
  totals: { visits: number; pageViews: number };
  daily: { date: string; visits: number; pageViews: number }[];
  pages: { path: string; pageViews: number }[];
  referrers: { host: string; pageViews: number }[];
  countries: { country: string; pageViews: number }[];
  generatedAt: string;
}

const ENDPOINT = 'https://api.cloudflare.com/client/v4/graphql';

/*
 * The filter is written inline rather than passed as one typed variable. The
 * generated name of the filter input object is long, dataset-specific, and easy
 * to get wrong; getting it wrong fails the entire query. Inlining means the only
 * type names here are Cloudflare's stable scalars, `string` and `Time`.
 */
const FILTER = `{ siteTag: $siteTag, datetime_geq: $start, datetime_leq: $end }`;

const QUERY = `
query AdminStats($accountTag: string!, $siteTag: string!, $start: Time!, $end: Time!) {
  viewer {
    accounts(filter: { accountTag: $accountTag }) {
      totals: rumPageloadEventsAdaptiveGroups(filter: ${FILTER}, limit: 1) {
        count
        sum { visits }
      }
      daily: rumPageloadEventsAdaptiveGroups(
        filter: ${FILTER}
        limit: 366
        orderBy: [date_ASC]
      ) {
        count
        sum { visits }
        dimensions { date }
      }
      pages: rumPageloadEventsAdaptiveGroups(
        filter: ${FILTER}
        limit: 10
        orderBy: [count_DESC]
      ) {
        count
        dimensions { requestPath }
      }
      referrers: rumPageloadEventsAdaptiveGroups(
        filter: ${FILTER}
        limit: 10
        orderBy: [count_DESC]
      ) {
        count
        dimensions { refererHost }
      }
      countries: rumPageloadEventsAdaptiveGroups(
        filter: ${FILTER}
        limit: 10
        orderBy: [count_DESC]
      ) {
        count
        dimensions { countryName }
      }
    }
  }
}`;

interface Group {
  count: number;
  sum?: { visits: number };
  dimensions?: {
    date?: string;
    requestPath?: string;
    refererHost?: string;
    countryName?: string;
  };
}

interface GraphQLResponse {
  data?: {
    viewer?: {
      accounts?: {
        totals: Group[];
        daily: Group[];
        pages: Group[];
        referrers: Group[];
        countries: Group[];
      }[];
    } | null;
  };
  errors?: { message: string }[] | null;
}

export class AnalyticsError extends Error {}

export async function fetchStats(env: Env, days: number): Promise<Stats> {
  const end = new Date();
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.CF_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: QUERY,
      variables: {
        accountTag: env.CF_ACCOUNT_ID,
        siteTag: env.CF_SITE_TAG,
        start: start.toISOString(),
        end: end.toISOString(),
      },
    }),
  });

  if (!response.ok) {
    throw new AnalyticsError(
      `Cloudflare Analytics API returned ${response.status}. ` +
        (response.status === 403
          ? 'The API token is probably missing the Account Analytics Read permission.'
          : 'Check CF_ACCOUNT_ID and the API token.'),
    );
  }

  const body = (await response.json()) as GraphQLResponse;

  /* GraphQL reports failures with a 200 and an errors array, so a bad query or
     a token without the right scope looks like success until you look here. */
  if (body.errors?.length) {
    throw new AnalyticsError(
      `Analytics query rejected: ${body.errors.map((e) => e.message).join('; ')}`,
    );
  }

  const account = body.data?.viewer?.accounts?.[0];
  if (!account) {
    throw new AnalyticsError(
      'No account came back from the Analytics API. Check CF_ACCOUNT_ID.',
    );
  }

  const totalRow = account.totals[0];

  return {
    range: { days, start: start.toISOString(), end: end.toISOString() },
    totals: {
      visits: totalRow?.sum?.visits ?? 0,
      pageViews: totalRow?.count ?? 0,
    },
    daily: fillGaps(
      account.daily.map((row) => ({
        date: row.dimensions?.date ?? '',
        visits: row.sum?.visits ?? 0,
        pageViews: row.count,
      })),
      start,
      end,
    ),
    pages: account.pages.map((row) => ({
      path: row.dimensions?.requestPath || '/',
      pageViews: row.count,
    })),
    referrers: account.referrers.map((row) => ({
      /* An empty referer host means the visitor typed the address, used a
         bookmark, or came from an app that strips the header. "Direct" is the
         honest label for that bucket — it is not a website. */
      host: row.dimensions?.refererHost || 'Direct',
      pageViews: row.count,
    })),
    countries: account.countries.map((row) => ({
      country: row.dimensions?.countryName || 'Unknown',
      pageViews: row.count,
    })),
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Days with no traffic are simply absent from the API's response. Left as-is
 * they would compress into the chart as though they never happened, which
 * quietly redraws a quiet week as a busy one. Zero-filling keeps the time axis
 * honest.
 */
function fillGaps(
  rows: { date: string; visits: number; pageViews: number }[],
  start: Date,
  end: Date,
): { date: string; visits: number; pageViews: number }[] {
  const byDate = new Map(rows.map((row) => [row.date, row]));
  const filled: { date: string; visits: number; pageViews: number }[] = [];

  const cursor = new Date(
    Date.UTC(
      start.getUTCFullYear(),
      start.getUTCMonth(),
      start.getUTCDate(),
    ),
  );
  const last = Date.UTC(
    end.getUTCFullYear(),
    end.getUTCMonth(),
    end.getUTCDate(),
  );

  while (cursor.getTime() <= last) {
    const key = cursor.toISOString().slice(0, 10);
    filled.push(byDate.get(key) ?? { date: key, visits: 0, pageViews: 0 });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return filled;
}
