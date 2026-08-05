/*
 * Draws the link-preview cards into public/og/.
 *
 *   npm run share-cards
 *
 * Run it after editing src/lib/share.ts or a project's headline - the images
 * are committed files, so until this runs again a shared link keeps showing
 * the old words.
 *
 * Why committed PNGs rather than generation at build time: the site is static
 * and deliberately thin on dependencies, and every library that renders text
 * to an image (satori, resvg, canvas) is a large one to carry for eight
 * pictures that change a few times a year. Chrome is already on the machine
 * that writes the copy, so it does the drawing, and the build stays a build.
 *
 * SVG is not an option here - Facebook, LinkedIn, Slack and iMessage all
 * refuse it - so these have to be raster files at 1200x630, drawn at 2x for
 * retina previews.
 */

import { spawn } from 'node:child_process';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { shareCards, cardFile, cardLayout } from '../src/lib/share.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = join(root, 'public', 'og');

// Shared with the meta tags, so the size the layout reports is by construction
// the size the picture was drawn at.
const { width: WIDTH, height: HEIGHT, scale: SCALE } = cardLayout;

/*
 * Chrome renders the card. It is not a dependency of the site - it is the
 * browser the author already has - so it is looked up rather than installed.
 */
const chrome =
  process.env.CHROME ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

/*
 * The fonts come from the same packages the site loads, inlined as data URIs.
 * A file:// page is its own opaque origin, so a font referenced by path would
 * be blocked by CORS and the card would silently fall back to Times.
 */
const fontFiles = {
  serif:
    'node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2',
  sans: 'node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2',
  mono: 'node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2',
};

function font(name) {
  const path = join(root, fontFiles[name]);
  try {
    return `url(data:font/woff2;base64,${readFileSync(path).toString('base64')}) format('woff2')`;
  } catch {
    throw new Error(
      `Missing ${fontFiles[name]}. Run npm install before drawing the cards.`,
    );
  }
}

const escape = (text) =>
  text.replace(
    /[&<>"]/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char],
  );

/*
 * Headlines run from three words to a full sentence, and a card cannot scroll:
 * whatever will not fit gets cropped by the platform, not wrapped. So the
 * display size steps down with length instead of being fixed.
 */
function titleSize(title) {
  if (title.length > 58) return 52;
  if (title.length > 34) return 62;
  return 76;
}

function html(card) {
  return `<meta charset="utf-8" />
<style>
  @font-face { font-family: 'Newsreader'; src: ${font('serif')}; font-weight: 200 800; }
  @font-face { font-family: 'Plex Sans'; src: ${font('sans')}; font-weight: 400; }
  @font-face { font-family: 'Plex Mono'; src: ${font('mono')}; font-weight: 400; }

  /* The site's own tokens: ink & sky, light theme, and the one yellow. */
  :root {
    --bg: #f2f5f8;
    --ink: #12181f;
    --body: #33404d;
    --muted: #455462;
    --line: rgba(23, 24, 26, 0.4);
    --accent: #f3e14f;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    background: var(--bg);
    color: var(--ink);
    font-family: 'Plex Sans', sans-serif;
    display: grid;
    grid-template-rows: auto 1fr auto;
    padding: 56px 72px;
    -webkit-font-smoothing: antialiased;
  }

  .rule {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-family: 'Plex Mono', monospace;
    font-size: 20px;
    color: var(--muted);
  }

  .top { border-bottom: 1px solid var(--line); padding-bottom: 18px; }
  .foot { border-top: 1px solid var(--line); padding-top: 18px; }

  .wordmark { color: var(--ink); letter-spacing: 0.01em; }

  .body { display: flex; flex-direction: column; justify-content: center; gap: 22px; }

  .eyebrow {
    font-family: 'Plex Mono', monospace;
    font-size: 19px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);
  }

  /* The site's highlighter: a yellow underlay behind the words, cloned onto
     every line so a headline that wraps is marked all the way through. */
  h1 {
    font-family: 'Newsreader', Georgia, serif;
    font-weight: 400;
    font-size: ${titleSize(card.title)}px;
    line-height: 1.16;
    letter-spacing: -0.01em;
    text-wrap: balance;
  }

  h1 span {
    box-shadow: inset 0 -0.13em 0 var(--accent);
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
  }

  .sub {
    font-size: 25px;
    line-height: 1.45;
    color: var(--body);
    max-width: 30em;
    /* Two lines is the card's budget; a third would crowd the rules. */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>

<div class="rule top">
  <span class="wordmark">Narges Mirheydari</span>
  <span>nargesmirheydari.com</span>
</div>

<div class="body">
  <p class="eyebrow">${escape(card.eyebrow)}</p>
  <h1><span>${escape(card.title)}</span></h1>
  ${card.sub ? `<p class="sub">${escape(card.sub)}</p>` : ''}
</div>

<div class="rule foot">
  <span>${escape(card.kicker ?? 'product design · accessibility')}</span>
</div>
`;
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Waits for a screenshot to be finished rather than merely started: the file
 * has to exist and hold its size across two looks, or a card could be read
 * while Chrome is still writing it.
 */
async function settled(path, timeout = 30_000) {
  const deadline = Date.now() + timeout;
  let last = -1;

  while (Date.now() < deadline) {
    await wait(150);
    let size = -1;
    try {
      size = statSync(path).size;
    } catch {
      continue;
    }
    if (size > 0 && size === last) return;
    last = size;
  }

  throw new Error(`Chrome never finished writing ${path}.`);
}

/*
 * One Chrome per card, all started together: a cold start costs far more than
 * the drawing does, so the set takes seconds rather than a minute.
 *
 * Chrome is watched rather than waited on. This version writes the screenshot
 * and then keeps running instead of exiting, so a script that waited for the
 * process to end would hang forever on a picture that is already finished.
 */
async function draw(card, work) {
  const file = cardFile(card.path);
  const page = join(work, `${file}.html`);
  const out = join(outDir, `${file}.png`);
  writeFileSync(page, html(card));
  // Cleared first, so a stale card from an earlier run can never be mistaken
  // for the one being drawn now.
  rmSync(out, { force: true });

  const child = spawn(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--no-first-run',
      '--no-default-browser-check',
      // A fresh profile per card, not one shared across the run: a second
      // Chrome pointed at a profile the first still holds hands its work to
      // that instance and exits without ever taking the picture, so the
      // script hangs on card two. It also keeps the author's own Chrome,
      // which may well be open, entirely out of this.
      `--user-data-dir=${join(work, `chrome-${file}`)}`,
      `--window-size=${WIDTH},${HEIGHT}`,
      `--force-device-scale-factor=${SCALE}`,
      // Fonts are inlined, so nothing is fetched - this only gives layout and
      // font loading a moment to settle before the capture.
      '--virtual-time-budget=1500',
      `--screenshot=${out}`,
      pathToFileURL(page).href,
    ],
    { stdio: 'ignore' },
  );

  const failed = new Promise((_, reject) => child.on('error', reject));

  try {
    await Promise.race([settled(out), failed]);
    console.log(`drew public/og/${file}.png  ${card.path}`);
  } finally {
    child.kill('SIGKILL');
  }
}

const work = mkdtempSync(join(tmpdir(), 'share-cards-'));
mkdirSync(outDir, { recursive: true });

try {
  await Promise.all(shareCards.map((card) => draw(card, work)));
  console.log(
    `\n${shareCards.length} cards at ${WIDTH * SCALE}x${HEIGHT * SCALE}.`,
  );
} catch (error) {
  if (error.code === 'ENOENT') {
    console.error(
      `Could not run Chrome at ${chrome}.\nSet CHROME=/path/to/chrome and try again.`,
    );
    process.exit(1);
  }
  throw error;
} finally {
  rmSync(work, { recursive: true, force: true });
}
