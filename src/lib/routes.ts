/*
 * Real URLs, not client-side page state. The prototype used buttons because it
 * was a single file; the handoff calls for shareable links here, which also
 * means the site works with JS disabled and back/forward behave correctly.
 */

const BASE = import.meta.env.BASE_URL;

/** Join the deploy base path with a route, tolerating slashes on either side. */
export function url(path: string): string {
  const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  const rest = path.startsWith('/') ? path : `/${path}`;
  return `${base}${rest}` || '/';
}

export const routes = {
  works: url('/'),
  caseStudy: url('/case-study/'),
  design: url('/how-i-design/'),
  about: url('/about/'),
  accessibility: url('/accessibility/'),
} as const;

/** Primary nav, in visual and tab order. How I design sits last. */
export const primaryNav = [
  { key: 'works', label: 'Works', href: routes.works },
  { key: 'about', label: 'About', href: routes.about },
  { key: 'design', label: 'How I design', href: routes.design },
] as const;

export const contact = {
  email: 'narges.mirheydari@gmail.com',
  linkedin: {
    label: '/in/nargesmirheydari',
    href: 'https://www.linkedin.com/in/nargesmirheydari',
  },
  github: { label: 'Nargesmhd', href: 'https://github.com/Nargesmhd' },
} as const;
