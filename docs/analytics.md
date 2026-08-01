# Visit analytics and the admin page

The site is a static build on GitHub Pages, which means it has no server, no
database, and no logs to read. Counting visitors and restricting a page to one
person both need something the static host cannot provide, so both come from
Cloudflare:

| Piece | What it does |
| --- | --- |
| Cloudflare Web Analytics | Counts visits from a cookie-less beacon in every page |
| Cloudflare Worker | Reads those numbers with a secret token and serves them to the dashboard |
| Cloudflare Access | Challenges anyone opening `/admin` and lets through one email |

The shape is deliberate: **the browser never holds a credential that can read
the analytics.** The only token that ships in the page is the write-only beacon
tag, which cannot read anything back.

> **The admin page is not published until you say so.** A static site serves
> every file in `dist/` to anyone who asks; there is no request-time check to
> refuse them. So until Cloudflare Access is actually in front of the path,
> `/admin` is left out of the build entirely and returns a 404 in production.
> It still works in `npm run dev`, where only localhost can reach it.
>
> Turn it on by building with `ENABLE_ADMIN=1` - step 6 below. Do that *after*
> step 4, not before.

```
visitor → beacon.min.js ──────────────→ Cloudflare Web Analytics
                                                 │
you → /admin (Access challenge) → dashboard      │ GraphQL + secret token
              └→ /admin/api/stats (Worker) ──────┘
```

## Setup

These steps need your Cloudflare login, so they are yours to run - I can't
create accounts or handle credentials. Everything in the repo is already
written and waiting on the five values you collect below.

### 1. Put the domain behind Cloudflare

Add `nargesmirheydari.com` to Cloudflare and change the nameservers at your
registrar (Namecheap) to the pair Cloudflare gives you. Make sure the record for
the apex is **proxied** (orange cloud) - Access and Workers only apply to
proxied traffic.

> **Copy your email records across first.** Changing nameservers moves *all*
> DNS to Cloudflare, not just the website. This domain currently uses Namecheap
> email forwarding, and those records do not come with it. Recreate them in
> Cloudflare before flipping the nameservers, or mail to your domain stops
> being delivered:
>
> | Type | Name | Value | Priority |
> | --- | --- | --- | --- |
> | MX | `@` | `eforward1.registrar-servers.com` | 10 |
> | MX | `@` | `eforward2.registrar-servers.com` | 10 |
> | MX | `@` | `eforward3.registrar-servers.com` | 10 |
> | MX | `@` | `eforward4.registrar-servers.com` | 15 |
> | MX | `@` | `eforward5.registrar-servers.com` | 20 |
> | TXT | `@` | `v=spf1 include:spf.efwd.registrar-servers.com ~all` | - |
>
> Also keep the four GitHub Pages A records (`185.199.108–111.153`) and the
> `www` CNAME to `nargesmhd.github.io`. Cloudflare's scan usually imports these
> automatically - check them against the list before you switch.

Nothing about the deploy changes. GitHub Pages stays the origin, and the
workflow is untouched.

### 2. Turn on Web Analytics

**Analytics & Logs → Web Analytics → Add a site.** Cloudflare gives you a
JavaScript snippet; the only part you need is the **token** inside it.

Add it as a repository secret named `PUBLIC_CF_BEACON_TOKEN`
(**Settings → Secrets and variables → Actions**), then add it to the build step
in `.github/workflows/deploy.yml`:

```yaml
      - run: npm run build
        env:
          PUBLIC_CF_BEACON_TOKEN: ${{ secrets.PUBLIC_CF_BEACON_TOKEN }}
```

The `PUBLIC_` prefix is Astro's marker for "safe to ship to the browser", which
this is - it can only write events, never read them. Leave it unset locally so
your own development never lands in the real numbers.

While you're on that screen, note the **site tag** (the `siteTag`, distinct from
the beacon token). The Worker needs it.

### 3. Create a read-only API token

**My Profile → API Tokens → Create Token → Create Custom Token.**

- Permission: **Account · Account Analytics · Read** - this one permission and
  nothing else. It cannot change settings, read email, or touch DNS.
- Account resources: your account only.
- Set a TTL if you want; you'll need to rotate it when it expires.

Copy the token once - Cloudflare won't show it again.

You also need your **Account ID**, on the right-hand side of any zone's overview
page.

### 4. Create the Access application

**Zero Trust → Access → Applications → Add an application → Self-hosted.**

- Application domain: `nargesmirheydari.com`, path `admin`
- Policy: **Allow**, with the rule **Emails** → your address
- Identity provider: One-time PIN is enough and needs no third-party account.
  Cloudflare emails you a code each time you sign in.

Covering the path `admin` protects the dashboard *and* `/admin/api/*` under it,
which is why the API lives at that path rather than `/api/`.

From the application's overview, copy the **Application Audience (AUD) tag**,
and from **Settings → Custom Pages** (or any Access URL) note your **team
domain**, which looks like `yourname.cloudflareaccess.com`.

### 5. Deploy the Worker

Fill the four non-secret values into `worker/wrangler.jsonc`:

```jsonc
"vars": {
  "CF_ACCOUNT_ID": "…",                              // step 3
  "CF_SITE_TAG": "…",                                // step 2
  "ACCESS_TEAM_DOMAIN": "yourname.cloudflareaccess.com", // step 4
  "ACCESS_AUD": "…"                                  // step 4
}
```

Then, from `worker/`:

```bash
npm install && npx wrangler secret put CF_API_TOKEN && npx wrangler deploy
```

`wrangler secret put` prompts for the token from step 3 and stores it encrypted
on Cloudflare. It never enters the repo.

### 6. Publish the page, then check it

Only now is it safe to put `/admin` on the live site. In
`.github/workflows/deploy.yml`, add `ENABLE_ADMIN` to the build step:

```yaml
      - run: npm run build
        env:
          PUBLIC_CF_BEACON_TOKEN: ${{ secrets.PUBLIC_CF_BEACON_TOKEN }}
          ENABLE_ADMIN: '1'
```

Push, and once the deploy finishes open `https://nargesmirheydari.com/admin`.
You should be asked for a one-time PIN, then see the dashboard. Data takes a few
minutes to first appear, and the page will honestly say it has nothing yet until
then.

Confirm the lock works by opening the same URL in a private window: it should
stop at the Cloudflare login and never reach the page. If it loads without
asking, the Access application is not matching the path - fix that before
leaving it up.

## How access is actually enforced

Two independent layers, because one of them is a configuration setting and
configuration drifts:

1. **Cloudflare Access** blocks unauthenticated requests at the edge, before
   they reach GitHub Pages or the Worker.
2. **The Worker verifies the Access JWT itself** - signature against your team's
   public keys, audience, issuer, and expiry (`worker/src/access.ts`). If the
   route were ever misconfigured so that Access didn't cover it, the data stays
   shut.

`workers_dev` is off, so the Worker has no `*.workers.dev` URL - that address
would sit outside the zone and therefore outside Access.

What is *not* security: the page being missing from the nav, and the `noindex`
tag. Those keep it tidy and out of search results. The admin HTML itself is a
static file, so treat its markup as public; only the numbers are protected. It
is deliberately absent from `robots.txt` too, since listing it there would
advertise the path to anyone who looked.

## Notes

- **Visits vs page views.** A visit is an arrival; a page view is any page
  opened. One person reading four pages is 1 visit, 4 page views.
- **No cookies.** Web Analytics sets nothing on the visitor's machine, which is
  why the site needs no cookie banner and why returning visitors can't be told
  apart from new ones. The dashboard says so rather than implying a precision it
  doesn't have.
- **Bots.** The beacon only fires when JavaScript runs, so most crawlers are
  absent from these numbers without any filtering.
- **Cost.** Web Analytics and Access (up to 50 users) are free. The Worker will
  sit far inside the free tier at one user refreshing a dashboard.
- **Rotating the token.** Re-run `npx wrangler secret put CF_API_TOKEN`. No
  redeploy needed.
