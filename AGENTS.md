## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Share cards

The link-preview images in `public/og/` are committed files drawn from
`src/lib/share.ts` by headless Chrome. After adding a project, or editing a
card entry or a project's `headline`, `summary` or `contents`, redraw them:

```
npm run share-cards
```

Skipping it leaves the old words in the picture while the meta tags carry the
new ones.

## Favicon

`public/favicon.svg` is the NM monogram, and it is the source. `public/favicon.ico`
is packed from it for the browsers and scrapers that ask for that name instead,
so after editing the SVG, repack:

```
npm run favicon
```

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
