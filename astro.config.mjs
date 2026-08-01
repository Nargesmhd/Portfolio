// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// Served from the apex domain, so the site sits at the root — no `base`.
// The domain binding itself lives in public/CNAME, which GitHub Pages reads
// out of the build artifact on every deploy.
// https://astro.build/config
export default defineConfig({
  site: 'https://nargesmirheydari.com',
  integrations: [react()]
});
