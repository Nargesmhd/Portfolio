// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

/*
 * The admin dashboard is routed in, not dropped in src/pages/, so that it can
 * be left out of a build entirely.
 *
 * This matters because the site is static. A page under src/pages/ becomes a
 * file in dist/, and every file in dist/ is served to anyone who asks - there
 * is no request-time check available to refuse them. So while the domain sits
 * on GitHub Pages with nothing in front of it, the only way to keep /admin
 * private is to not publish it.
 *
 * Set ENABLE_ADMIN=1 once Cloudflare Access is actually protecting the path.
 * Until then the route exists in development, where it is only ever reachable
 * from localhost, and nowhere else. See docs/analytics.md.
 */
// `process` has no types here: the project carries no @types/node, and taking on
// a dependency to read one environment variable is a poor trade. Narrowing
// globalThis rather than reaching for `any` keeps the rest of this file checked.
const env =
  /** @type {{ process?: { env: Record<string, string | undefined> } }} */ (
    globalThis
  ).process?.env ?? {};

/** @type {import('astro').AstroIntegration} */
const adminRoute = {
  name: 'admin-route',
  hooks: {
    'astro:config:setup': ({ command, injectRoute, logger }) => {
      if (command !== 'dev' && env.ENABLE_ADMIN !== '1') {
        logger.warn(
          '/admin is NOT in this build. Set ENABLE_ADMIN=1 once Cloudflare Access protects it.',
        );
        return;
      }

      injectRoute({
        pattern: '/admin',
        entrypoint: './src/admin/index.astro',
      });
    },
  },
};

// Served from the apex domain, so the site sits at the root - no `base`.
// The domain binding itself lives in public/CNAME, which GitHub Pages reads
// out of the build artifact on every deploy.
// https://astro.build/config
export default defineConfig({
  site: 'https://nargesmirheydari.com',
  integrations: [react(), adminRoute],
  // The nibbit.ai write-up used to be the site's only case study and lived at
  // its own route. It is now one project among several under /work/, so the
  // old link keeps working rather than 404ing on anyone who saved it.
  redirects: {
    '/case-study': '/work/nibbit-ai/'
  }
});
