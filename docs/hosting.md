# Hosting

The site is a static Astro build deployed to **Cloudflare Pages** by
`.github/workflows/deploy.yml` on every push to `main`.

It used to be on GitHub Pages. That stopped working when the repository was
made private: GitHub Pages on a private repository requires a paid plan, so
GitHub disabled it and the site went dark. Cloudflare Pages has no such
restriction — the workflow uploads the built `dist/` directly, and Cloudflare
never reads the repository at all, so the repo can stay private for free.

```
push to main → GitHub Actions → npm run build → wrangler pages deploy dist
                                                          │
                        nargesmirheydari.com ←─────────────┘
                        /admin/api/*  → Worker (see analytics.md)
```

## Setup

These steps need your Cloudflare login and your registrar login, so they are
yours to run — I can't create accounts or handle credentials. The repository
side is already done and waiting on the two secrets in step 4.

### 1. Put the domain behind Cloudflare

Add `nargesmirheydari.com` to Cloudflare (**Add a site**, free plan is fine).
Cloudflare gives you two nameservers; set those at Namecheap, replacing
`dns1.registrar-servers.com` / `dns2.registrar-servers.com`.

This is the slow step — nameserver changes usually take under an hour but can
take up to 24. Nothing else works until Cloudflare reports the zone active.

> **Copy your email records across first.** Changing nameservers moves *all*
> DNS to Cloudflare, not just the website. This domain uses Namecheap email
> forwarding, and those records do not come with it. Recreate them in
> Cloudflare **before** flipping the nameservers, or mail to your domain stops
> being delivered:
>
> | Type | Name | Value | Priority |
> | --- | --- | --- | --- |
> | MX | `@` | `eforward1.registrar-servers.com` | 10 |
> | MX | `@` | `eforward2.registrar-servers.com` | 10 |
> | MX | `@` | `eforward3.registrar-servers.com` | 10 |
> | MX | `@` | `eforward4.registrar-servers.com` | 15 |
> | MX | `@` | `eforward5.registrar-servers.com` | 20 |
> | TXT | `@` | `v=spf1 include:spf.efwd.registrar-servers.com ~all` | — |
>
> Cloudflare's scan usually imports these automatically — check them against
> this list before you switch, rather than assuming.

The website records are a different matter: the four `A` records pointing at
GitHub's `185.199.x.x` addresses and the `www` CNAME to `nargesmhd.github.io`
can go. They point at a host that is no longer serving this site, and step 3
writes their replacements.

### 2. Create the Pages project

**Workers & Pages → Create → Pages → Use direct upload.** Name it `portfolio`
— the workflow passes `--project-name=portfolio`, so the name has to match.

You can skip its upload prompt; the first real deploy comes from CI.

### 3. Point the domain at it

In the project: **Custom domains → Set up a custom domain**, and add both
`nargesmirheydari.com` and `www.nargesmirheydari.com`. Cloudflare writes the
DNS records itself, proxied.

Keep them proxied (orange cloud). Access and Workers only apply to proxied
traffic, so the `/admin` lock in [analytics.md](analytics.md) depends on it.

### 4. Give CI a token

**My Profile → API Tokens → Create Token → Create Custom Token.**

- Permission: **Account · Cloudflare Pages · Edit**, and nothing else. It
  cannot touch DNS, read analytics, or change account settings.
- Account resources: your account only.

Add it to the repository as **Settings → Secrets and variables → Actions**:

| Secret | Value |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | the token you just created |
| `CLOUDFLARE_ACCOUNT_ID` | right-hand side of any zone's overview page |

This is a different token from the read-only analytics one in
[analytics.md](analytics.md). Keep them separate: this one can publish the
site but not read the numbers, and that one can read the numbers but not
publish. Neither can do the other's job if it leaks.

### 5. Deploy

Re-run the latest workflow from the **Actions** tab, or push anything to
`main`. Then check that the site is actually back:

```bash
for p in / /about/ /product-design/ /work/nibbit-ai/ /case-study/; do
  printf "%-24s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' "https://nargesmirheydari.com$p")"
done
```

Everything should be `200` except `/case-study/`, which should be `301`.

## Notes

**`public/_redirects`** holds the redirect from the old `/case-study/` URL.
Astro also emits a meta-refresh page for it, so the redirect survives even if
the file is lost; Cloudflare just answers with a real 301 first.

**No `CNAME` file.** That file was how GitHub Pages learned the custom domain.
Cloudflare takes the domain from the project's settings instead, so it was
deleted rather than left to rot as a thing that looks load-bearing.

**Deleting the GitHub Pages setup** is optional — it is already off. If you
ever make the repository public again, turn Pages off explicitly under
**Settings → Pages**, or it will start serving a second, stale copy of the
site at `nargesmhd.github.io`.
