# Handoff: Narges Mirheydari - accessibility-first portfolio site

## Overview
A personal portfolio for Narges Mirheydari (product designer, Toronto; Cognitive Science & Psychology at UofT; Solutions Consultant at Apple). The site's thesis is that accessibility is the design method, not a final audit. It has four pages plus a wireframe showcase, a paper "filing cabinet" visual metaphor, a real dark/light theme, and three user-facing reading controls (larger text, high contrast, plain layout).

Audience: hiring managers/recruiters and accessibility/inclusive-design teams. Primary goal: get people to reach out and stay in touch.

## About the Design Files
The files in this bundle are **design references created in HTML** - prototypes showing intended look and behaviour, not production code to copy directly. The task is to **recreate these designs in the target codebase's existing environment** (React, Next.js, Astro, Vue, etc.) using its established patterns, component library and styling approach. If no codebase exists yet, choose an appropriate framework (a static-first framework such as Astro or Next.js suits this content) and implement there.

Do not ship the HTML as-is: it is written as a single streaming component file with inline styles, which is a prototyping convention, not a production one.

## Fidelity
**High fidelity.** Colours, typography, spacing, motion timings and interaction states are final and specified below. Recreate pixel-faithfully using the codebase's own libraries. The wireframe sheets embedded inside the "How I design" page are *intentionally* low-fidelity artefacts - they are content (screenshots of process), and should be reproduced as shown, sketchy styling included.

---

## Screens / Views

### 1. Works (home) - default route `/`
**Purpose:** orient a visitor in ten seconds and let them open a body of work.

**Layout:** single column, `max-width: 1180px`, centred, `padding: 0 190px 0 48px` (the right padding reserves space for the fixed reading-settings rail - see Global chrome). Vertical rhythm below.

**Components, in order:**
1. **Page title** - "Works" in Newsreader 400, 88px, line-height .95, letter-spacing -.03em, colour `--ink`; beside it "Archive" in the same face/size at colour `--muted` (a nav affordance for a future archive route). Baseline-aligned flex row, gap 26px.
2. **Intro paragraph** - max-width 58ch, `font-size: calc(19px * var(--ts))`, line-height 1.6, colour `--body`, `text-wrap: pretty`. Copy: "Product designer in Toronto. I use behavioural research and WCAG standards to build things that work for everyone - including the people most products forget."
3. **Rotating statement** - "Designing for &lt; *word* &gt;" - Newsreader 34px for the static part; the bracketed word is IBM Plex Mono 26px, colour `--ink`, with a yellow highlighter underlay (`box-shadow: inset 0 -9px 0 var(--accent)`). The word cycles every 2600ms through: keyboard users → screen readers → low vision → everyone. Wrapped in `aria-live="polite"`. Cycling is disabled entirely under `prefers-reduced-motion: reduce`.
4. **Scroll cue** - "SCROLL ↓", IBM Plex Mono 11px, letter-spacing .16em, colour `--muted`; the arrow bobs 6px on a 1.8s ease-in-out infinite loop. `aria-hidden`.
5. **Marquee ticker** - full-width strip bounded top and bottom by 1px dotted `--line`, 12px vertical padding. Content is a repeated mono string: "CONTRAST · FOCUS ORDER · FORM SEMANTICS · KEYBOARD PARITY · SCREEN READER TESTING · PLAIN LANGUAGE · MOTION SETTINGS · ". Two identical spans side by side, animated `translateX(0 → -50%)` over 34s linear infinite. Pauses on mouse enter, resumes on leave; permanently paused when "plain layout" is on; `aria-hidden` (decorative - the same information is elsewhere).
6. **Folder stack** - the centrepiece. See "Folder stack" below.
7. **About accordion** - three paper strips, full-bleed within the column: "EXPERIENCES" (expandable), "SKILLSETS" (expandable, yellow), "PROFILE" (navigates to About). Strip: min-height 52px, padding 0 20px, IBM Plex Mono 12px, letter-spacing .16em, uppercase, background `--paper` (yellow `--accent` for Skillsets), 1px dotted `--line` top border. Right side shows "tap to view +" / "close −". Expanded Experiences is a three-column grid (180px / 1fr / 110px): Apple - Solutions Consultant - 2026–; nibbit.ai - Product Designer - 2023–24; Freelance - Product design & accessibility remediation - 2022–. Expanded Skillsets is an ordered list, 70px number column in mono + Newsreader 24px label: 01 WCAG 2.2 conformance, 02 Behavioural research, 03 Product road mapping, 04 Design documentation.

#### Folder stack
Four stacked manila-style folders, each overlapping the previous by 14px (`margin-top: -14px`), z-index ascending 1→4 so later folders sit in front. Above the stack, a mono caption at 12px `--muted`: "four folders, stacked. open one to see what is inside."

Each folder consists of:
- **Tab** - 186 × 28px, background = the folder colour, `clip-path: polygon(0 0, 88% 0, 100% 100%, 0 100%)` (right edge angles in), `border-radius: 5px 8px 0 0`. All four tabs are identical in shape and size; only `margin-left` differs, stepping 0 / 172 / 344 / 516px so the tabs form a staircase.
- **Body** - same background, `margin-top: -1px`, `border-radius: 0 6px 3px 3px`, wrapped in `filter: drop-shadow(0 -3px 8px rgba(23,24,26,.14))` so the pile reads as physical.
- **Header button** - the only always-visible content: number (mono 12px, letter-spacing .12em) + title (Newsreader 40px, letter-spacing -.02em) on the left, "OPEN +" / "CLOSE −" (mono 11px) on the right. Padding 16px 24px 18px. Hover and focus: `translateX(14px)`, 180ms ease.
- **Expanded panel** (hidden until opened) - 1px dotted separator, then description (`calc(16px * var(--ts))`, line-height 1.6, max-width 56ch), a mono "file contents" line at 11px, and a solid CTA button (min-height 46px, padding 0 22px, background = ink, text = folder colour, radius 3px). Panel fades/slides in over 250ms.

Folder content:
| # | Title | Description | File contents | CTA → |
|---|---|---|---|---|
| 01 | accessibility | Audits and remediation for small teams - contrast, focus order, form semantics, plus the docs that stop regressions. | 4 audits · 2 redesigns · checked against WCAG 2.2 | Open the case study → case study |
| 02 | product design | nibbit.ai, 2023-24. Core consumer flow rebuilt around screen-reader order and keyboard parity. | 1 case study · flows · before/after | Open the case study → case study |
| 03 | research | Cognitive science coursework applied to interfaces: attention, memory load, error recovery. | 3 notes · 1 study summary | See how I design → how I design |
| 04 | archive | Older explorations, drafting work, and side projects - kept because the thinking still counts. | drafting · retail years · misc | Open the archive → case study |

Closed folder colours, in stack order: `--f3`, `--f2`, `--f3`, `--f4`. **The open folder turns yellow (`--accent`)** with ink `#17181a`, body `#17181a`, meta `#43443c`; the background transitions over 250ms. Only one folder is open at a time; clicking an open folder closes it.

### 2. Case study - nibbit.ai
**Purpose:** the single deep proof of method.

Column max-width 820px. Breadcrumb (mono 13px, `--muted`, "works" is a link back home) → H1 in Newsreader 54px, line-height 1.05, `text-wrap: balance`: "Giving keyboard users the same path as mouse users" → a four-cell meta grid (1px solid `--line` boxes, mono 10px uppercase label + 15px value): Role "Product Designer (solo)", Timeline "Jan 2023 – Nov 2024", Team "Early-stage startup", Standard "WCAG 2.2 AA" → hero image slot, aspect-ratio 16/8, diagonal-stripe placeholder, caption "before/after of the core flow - drop real screens here" → three sections, each an H2 in Newsreader 32px with a yellow highlighter underlay (`inset 0 -10px 0 var(--accent)`) followed by a paragraph at `calc(17px * var(--ts))`, line-height 1.7:
- **Problem** - "Tab order followed the DOM, not the visual flow. Keyboard users hit dead ends in the core consumer flow - actions a mouse could reach had no keyboard route at all, and screen readers announced controls in an order that made no sense."
- **Process** - "Audited every stop in the flow, rebuilt the layout in screen-reader order so the visual and programmatic sequence matched, then tested each round with VoiceOver and NVDA before shipping."
- **Outcome** - "Every mouse path got a keyboard twin. The rebuilt flow shipped across the consumer app."

Then a three-up metric row (1px dashed boxes, Newsreader 34px figure + mono 12px label): 23 mo / on the product · 100% / keyboard coverage · 2 / screen readers tested. Footer row: "← back to folders" and "how I design →".

### 3. How I design
**Purpose:** the design philosophy, and the site's own making, as evidence.

H1 Newsreader 64px, "design" carries a yellow highlighter underlay. Intro: "Accessibility is not a checklist I run at the end. It is the brief itself: if someone cannot reach it, read it, or understand it, it is not designed yet."

**Philosophy list** - five rows, each a 200px/1fr grid with a 1px dotted top border and 24px vertical padding. Left: Newsreader 26px title with yellow highlighter underlay. Right: paragraph, `calc(17px * var(--ts))`, line-height 1.7, max-width 58ch. Deliberately **no numbering**.
1. *Everyone means everyone* - Most products are built for the person holding the mouse, in good light, with time to spare. I design for the person using a keyboard, a screen reader, a cracked phone on a moving bus. When it works for them, it works better for everyone else too.
2. *Behaviour before decoration* - Cognitive science taught me that attention is a budget and memory is unreliable. So structure comes first: what can be reached, in what order, with how much effort. Colour and type arrive only once the page makes sense in black and white.
3. *The path is the product* - A keyboard path is designed, not inherited. Every route a mouse can take gets a keyboard twin, every screen reads aloud in the order it appears, and nothing important hides behind a hover.
4. *Show the reasoning* - Every decision on this site has a why written next to it, in plain language. If I cannot explain a choice to someone outside design, the choice goes.
5. *Honesty is an accessibility feature* - I claim only what I have measured, promise only what I can keep, and leave the process visible - wireframes, margin notes and all.

**"How this website was made"** - H2 Newsreader 44px, intro paragraph, then a two-button view switcher (mono 12px pills, active = yellow with `#17181a` text, inactive = `--paper` with `--ink` text):
- **▶ prototype mode** - one wireframe sheet at a time (430px wide, white, 1.5px solid #333 border, 0 8px 18px shadow), a row of five page tabs (home / case study / about / a11y statement / playground), and beside the sheet a column of dashed "follow a link" chips that jump between sheets the way a visitor would move through the site.
- **▦ page by page** - all five sheets laid out in a wrapping row at 400px each, captioned 01–05.

The wireframe sheets themselves are low-fi artefacts: Caveat handwriting font, dashed/solid boxes, diagonal-stripe image placeholders, and orange margin notes explaining the accessibility reasoning (e.g. "folders = one tab stop each, black-on-yellow ≈ 12:1", "title = the outcome - headings get read out of context"). Orange note colour is themed: `#b03a08` on light backgrounds, `#ff9c73` on dark; notes printed *inside* the white sheets stay `#c2410c` (5.2:1 on white).

### 4. About
Two columns, 230px / 1fr, gap 36px, page max-width 900px. Left: portrait slot (aspect-ratio 3/4, stripe placeholder) plus a mono definition list - languages "Persian · English", base "Toronto, ON". Right: H1 "About me" ("me" in `--muted`), two paragraphs at `calc(18px * var(--ts))`, line-height 1.7, then a contact definition list (110px mono label column): email narges.mirheydari@gmail.com, linkedin /in/nargesmirheydari, github Nargesmhd.

Bio copy: "I'm a product designer finishing an Honours BSc in Cognitive Science & Psychology at the University of Toronto, working as a Solutions Consultant at Apple." / "Cognitive science taught me how attention and memory actually behave. WCAG taught me that most products ignore it. I design in the gap between the two."

### 5. Accessibility statement
Not in the primary nav (deliberate - it is reached from the footer). Max-width 820px. H1 "How this site is built", intro naming the target and audit date, then a bordered table of five rows (1px dotted separators): Body text contrast 11.4:1 · Minimum hit target 44 px · Keyboard path "complete - try Tab now" · Screen readers tested "VoiceOver · NVDA" · Motion "follows your system setting". Closing block with a 4px yellow left border: "Found a barrier? Email me - I'll reply within 3 days." (mailto with prefilled subject).

---

## Global chrome

**Skip link** - first focusable element, visually hidden off-screen until focused, then pinned 12px from the top left; ink background, background-coloured text, mono 13px. Targets `#main`.

**Header** - flex row, padding 20px 48px, 1px dotted bottom border. Left: name in mono 12px, letter-spacing .12em, uppercase. Right: nav + theme switch. Nav items are buttons (SPA routing), min-height 44px, mono 12px uppercase, letter-spacing .12em; the current page carries `aria-current="page"` and a yellow highlighter underlay (`inset 0 -8px 0 #f3e14f`). **Order: Works · About · How I design** (How I design sits last, at the far right). Theme switch is a `role="switch"` button with `aria-checked`, min-height 48px, yellow background, 2px ink border, pill radius, label "☀ LIGHT: ON" / "☾ DARK: ON" plus a 26px ink dot.

**Reading-settings rail** - `position: fixed; top: 150px; right: 0`, a vertical stack of three buttons docked to the right edge (min-height 46px, radius 8px 0 0 8px, 1px dotted border, no right border): "Aa larger text", "◐ high contrast", "≡ plain layout". Each is a real toggle with `aria-pressed`; when on, the button turns yellow with `#17181a` text. Page content reserves 190px of right padding so the rail never overlaps text at any viewport width. In a production build, dock this into the header below ~900px.

**Footer** - 1px dotted top border, padding 24px 48px, mono 12px `--muted`, split: left "Toronto, ON · email · linkedin · github"; right "Accessibility statement · Built and tested to WCAG 2.2 AA - in both themes".

---

## Interactions & Behavior

| Interaction | Behaviour |
|---|---|
| Nav / folder CTA / breadcrumb | Client-side route change, scroll to top. Use real `<a href>` links in production so URLs are shareable - the prototype uses buttons only because it is a single file. |
| Folder header click | Toggles that folder open, closes any other. Open folder shifts `translateX(52px)` and turns yellow. |
| Folder CTA click | Folder animates `translateX(240px) rotate(-1.4deg)` over 420ms cubic-bezier(.2,.85,.25,1) - "pulled from the pile" - then navigates. Under reduced motion, navigates immediately with no pull. |
| Folder hover / focus | `translateX(14px)`, 180ms ease. Focus mirrors hover so keyboard users get the same affordance. |
| Accordion strips | `aria-expanded` toggle; label switches "tap to view +" ⇄ "close −". |
| Marquee | Pauses on pointer enter, resumes on leave; paused whenever plain layout is on. |
| Rotating word | 2600ms interval, `aria-live="polite"`; interval never starts under reduced motion. |
| Page transitions | 250ms fade + 6px rise on the page container. |
| Larger text | Sets `--ts` to 1.22; every body size is authored as `calc(Npx * var(--ts))` so the whole page scales together. |
| High contrast | Swaps to a pure black/white variant of the active theme (see tokens). |
| Plain layout | Replaces the folder stack with a flat bordered list, hides the marquee. Content is never removed - only decoration. |
| Reduced motion | Global `@media (prefers-reduced-motion: reduce) { *{animation:none!important;transition:none!important} }`, plus JS guards on the rotating word and the folder pull. |

## State Management
Component-level state is enough; no data fetching.

- `page`: 'home' | 'case' | 'design' | 'about' | 'access' - in production this should be the router, not state.
- `dark`: boolean - theme. Persist to `localStorage` and initialise from `prefers-color-scheme`.
- `largerText`, `highContrast`, `plain`: booleans - persist all three; they are user accessibility preferences and must survive navigation and reload.
- `open`: folder key or null - which folder is expanded.
- `pulled`: folder key or null - transient, set for 420ms during the pull-out animation.
- `expOpen`, `skillsOpen`: booleans - accordion strips.
- `rot`: 0–3 - rotating word index, driven by an interval; clear on unmount.
- `ticker`: 'running' | 'paused' - marquee play state.
- `wfMode`: 'proto' | 'all', `wfPage`: which wireframe sheet is showing.

## Design Tokens

Themes are CSS custom properties set on a wrapper element. Four palettes ship; **ink & sky** is the default. The yellow accent `#f3e14f` is constant across all palettes and both themes.

**ink & sky (default)**
| Token | Light | Dark |
|---|---|---|
| `--bg` | #f2f5f8 | #101619 |
| `--ink` | #12181f | #e8eef3 |
| `--body` | #33404d | #bfcbd6 |
| `--muted` | #455462 | #9aa8b5 |
| `--paper` | #e4ebf2 | #182027 |
| `--f2` | #d5e0ea | #222d36 |
| `--f3` | #e9eff5 | #1b242b |
| `--f4` | #c0cfdd | #2c3944 |
| `--line` | rgba(23,24,26,.4) | rgba(235,236,238,.4) |
| `--accent` | #f3e14f | #f3e14f |

Alternate palettes (same token names): **cool white** - bg #f4f4f5 / #17181a, ink #17181a / #ebecee, body #3a3b40 / #c4c6cc, muted #4e5058 / #a3a5ad, paper #e9e9ec / #1e1f23, f2 #dcdde2 / #2e2f35, f3 #e7e8ec / #26272c, f4 #c8c9d1 / #383941. **ink & moss** - bg #f3f5f1 / #14170f, ink #161a15 / #eaeee6, body #3a423a / #c3cabd, muted #4b544a / #a0a89a, paper #e6ebe2 / #1c2018, f2 #d8e0d2 / #272d22, f3 #eaefe6 / #1f241a, f4 #c4cfbc / #333a2c. **ink & clay** - bg #f7f3f1 / #17130f, ink #1a1614 / #f0e9e5, body #443b37 / #cdc1ba, muted #584c47 / #a89a92, paper #efe6e2 / #211b17, f2 #e6d9d3 / #2e2620, f3 #f2eae6 / #241d19, f4 #d6c3bb / #3b312a.

**High contrast override** (applies on top of either theme): light → bg #ffffff, ink #000000, body #111111, muted #3d3a33, line #000000, paper #f0f0f0, f2 #e8e8e8, f3 #f2f2f2, f4 #d8d8d8. Dark → bg #000000, ink #ffffff, body #eeeeee, muted #cfcabb, line #ffffff, paper #161616, f2 #1e1e1e, f3 #161616, f4 #262626.

**Typography**
- Display/serif: **Newsreader** 400 - 88px page titles, 64px/54px page H1s, 44px folder titles, 40px folder headers, 34px metrics, 32px/26px section headings.
- UI/body: **IBM Plex Sans** 400/500/600 - 19px intro, 17px body, 16px folder body, 15px meta.
- Labels/mono: **IBM Plex Mono** 400/500 - 13px, 12px, 11px, 10px, letter-spacing .05em–.16em, frequently uppercase.
- Handwriting (wireframe sheets only): **Caveat** 500/600.
- Body copy uses `text-wrap: pretty`; large headlines use `text-wrap: balance`.
- Every scalable size is authored `calc(Npx * var(--ts))`.

**Scale & shape**
- Page padding 48px; content max-width 1180px (820–900px for reading pages).
- Radii: 3px buttons, 5px 8px 0 0 folder tabs, 0 6px 3px 3px folder bodies, 8px 0 0 8px rail buttons, 999px pills.
- Shadows: `drop-shadow(0 -3px 8px rgba(23,24,26,.14))` on folders; `0 8px 18px rgba(23,24,26,.18)` on wireframe sheets.
- Minimum hit target 44px (rail buttons 46px, theme switch 48px, folder CTAs 46px).
- Focus indicator: `outline: 3px solid #c2410c; outline-offset: 3px` on `:focus-visible`, globally.

**Motion**
- Folder pull 420ms cubic-bezier(.2,.85,.25,1); hover/focus shift 180ms ease; background transitions 250ms ease; page fade 250ms; marquee 34s linear infinite; scroll cue 1.8s ease-in-out infinite; word rotation 2600ms interval.

## Accessibility requirements (non-negotiable - this is the product)
- Target WCAG 2.2 AA on every page in **both** themes and in high-contrast mode. All four palettes were audited: every text/background pair used in the design measures ≥ 4.5:1 for body text and ≥ 3:1 for large text. Re-audit after any colour change.
- Semantic landmarks throughout: `header`, `nav[aria-label]`, `main#main`, `footer`, `article`, `section[aria-labelledby]`.
- Real toggle semantics: `aria-pressed` on the reading controls, `role="switch" aria-checked` on the theme toggle, `aria-expanded` on folders and accordions, `aria-current="page"` on nav.
- Keyboard path must be complete and match the visual order; every hover affordance is mirrored on focus.
- Decorative elements (marquee, scroll cue, folder tabs) are `aria-hidden`; no information exists only in decoration.
- Reading preferences persist across navigation and reload.
- Verify with VoiceOver and NVDA before launch, and keep the accessibility statement's numbers truthful - the claims are measured values, not marketing.

## Assets
No binary assets ship with this bundle. Image slots are diagonal-stripe placeholders with mono captions naming what belongs there:
- Case study hero: before/after of the nibbit.ai core flow (16:8).
- About: portrait photograph (3:4).
- Fonts: Newsreader, IBM Plex Sans, IBM Plex Mono, Caveat - all Google Fonts. Self-host in production.

## Files
- `Portfolio Prototype.dc.html` - the interactive prototype. This is the source of truth for layout, copy, colour, motion and interaction.
- `Portfolio Home Directions.dc.html` - the exploration canvas: five homepage directions, dark/light pairs, and the original wireframe set with the accessibility reasoning written in the margins. Useful context for *why* the final design looks the way it does; not something to implement.

Open either file directly in a browser.
