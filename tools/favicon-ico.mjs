/*
 * Packs public/favicon.ico from public/favicon.svg.
 *
 *   npm run favicon
 *
 * Run it after editing the SVG, or the two icons disagree about what the site
 * is called - the SVG is what every current browser puts in the address bar,
 * the .ico is the fallback that older ones and some link scrapers ask for by
 * name, and a stale .ico shows the previous mark to exactly the readers least
 * able to tell it is out of date.
 *
 * Chrome does the rasterising, the same borrowed-not-installed Chrome that
 * draws the share cards; see tools/share-cards.mjs for why the site does not
 * carry an image library for this.
 *
 * The .ico is monochrome black by construction. It cannot answer
 * prefers-color-scheme the way the SVG does, so it takes the light-mode
 * colour, which is the one a fallback is overwhelmingly rendered against.
 */

import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const svgPath = join(root, 'public', 'favicon.svg');
const icoPath = join(root, 'public', 'favicon.ico');

// The sizes Windows and the older browsers actually ask an .ico for.
const SIZES = [16, 32, 48];

const chrome =
  process.env.CHROME ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const work = mkdtempSync(join(tmpdir(), 'favicon-'));

try {
  const svg = readFileSync(svgPath, 'utf8');

  const pngs = SIZES.map((size) => {
    // A bare <img> at the target size, so Chrome's own SVG rasteriser does the
    // scaling and the window is the picture - no cropping, no padding.
    const page = join(work, `${size}.html`);
    const shot = join(work, `${size}.png`);
    writeFileSync(
      page,
      `<style>html,body{margin:0}img{display:block}</style>` +
        `<img width="${size}" height="${size}" src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}">`,
    );

    const run = spawnSync(
      chrome,
      [
        '--headless',
        '--disable-gpu',
        '--hide-scrollbars',
        '--default-background-color=00000000',
        `--window-size=${size},${size}`,
        `--screenshot=${shot}`,
        `file://${page}`,
      ],
      { stdio: 'ignore' },
    );
    if (run.error) throw run.error;

    return readFileSync(shot);
  });

  /*
   * ICO container: a 6-byte header, one 16-byte directory entry per image,
   * then the images themselves. The entries carry PNG payloads rather than
   * the old BMP ones, which every browser that still reads .ico supports.
   */
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(pngs.length, 4);

  let offset = header.length + pngs.length * 16;
  const entries = pngs.map((png, i) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(SIZES[i] === 256 ? 0 : SIZES[i], 0); // width, 0 means 256
    entry.writeUInt8(SIZES[i] === 256 ? 0 : SIZES[i], 1); // height
    entry.writeUInt8(0, 2); // palette size, 0 for truecolour
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });

  writeFileSync(icoPath, Buffer.concat([header, ...entries, ...pngs]));
  console.log(`favicon.ico written, ${SIZES.join('/')}px`);
} finally {
  rmSync(work, { recursive: true, force: true });
}
