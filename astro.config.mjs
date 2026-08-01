// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// Deployed to GitHub Pages at https://nargesmhd.github.io/Portfolio/
// If a custom domain is added later, set `site` to it and drop `base`.
// https://astro.build/config
export default defineConfig({
  site: 'https://nargesmhd.github.io',
  base: '/Portfolio',
  integrations: [react()]
});
