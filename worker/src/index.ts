/*
 * The read side of the admin dashboard.
 *
 * It sits on nargesmirheydari.com/admin/api/* — deliberately *inside* the path
 * the Access application protects, so the same login that gates the dashboard
 * page gates its data, and the browser sends the Access cookie on a same-origin
 * fetch without any token handling in the page.
 *
 * The site itself stays a plain static build on GitHub Pages. This is the only
 * server-side piece, and it exists because the alternative — shipping a read
 * token to the browser — would put the analytics behind a lock whose key is
 * printed on the door.
 */

import { AccessError, verifyAccessJwt } from './access';
import { AnalyticsError, fetchStats, type Env } from './analytics';

/** Windows offered by the dashboard. Anything else is rejected rather than
    clamped, so a typo surfaces instead of silently returning the wrong range. */
const ALLOWED_DAYS = new Set([7, 30, 90]);

const REQUIRED: (keyof Env)[] = [
  'CF_API_TOKEN',
  'CF_ACCOUNT_ID',
  'CF_SITE_TAG',
  'ACCESS_TEAM_DOMAIN',
  'ACCESS_AUD',
];

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname !== '/admin/api/stats') {
      return json({ error: 'Not found' }, 404);
    }
    if (request.method !== 'GET') {
      return json({ error: 'Method not allowed' }, 405, { Allow: 'GET' });
    }

    /* A missing binding would otherwise surface as a confusing 401 or an
       opaque GraphQL error, so name the gap directly. */
    const missing = REQUIRED.filter((key) => !env[key]);
    if (missing.length) {
      return json(
        {
          error: `Worker is not configured: ${missing.join(', ')} not set.`,
          hint: 'See docs/analytics.md.',
        },
        500,
      );
    }

    try {
      await verifyAccessJwt(request, env.ACCESS_TEAM_DOMAIN, env.ACCESS_AUD);
    } catch (error) {
      if (error instanceof AccessError) {
        return json({ error: error.message }, 401);
      }
      throw error;
    }

    const raw = url.searchParams.get('days') ?? '30';
    const days = Number(raw);
    if (!ALLOWED_DAYS.has(days)) {
      return json(
        { error: `Unsupported range "${raw}". Use 7, 30 or 90.` },
        400,
      );
    }

    try {
      return json(await fetchStats(env, days), 200);
    } catch (error) {
      if (error instanceof AnalyticsError) {
        /* The message is written for the one person who can act on it, and
           only she can reach this endpoint, so it says what is actually
           wrong instead of a generic failure. */
        return json({ error: error.message }, 502);
      }
      throw error;
    }
  },
};

function json(
  body: unknown,
  status: number,
  headers: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      /* Private data: never let a shared cache or the browser's back-forward
         cache hold on to it. */
      'Cache-Control': 'no-store',
      ...headers,
    },
  });
}
