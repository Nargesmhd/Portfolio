/*
 * Link previews, the card a page turns into when someone pastes its URL into
 * Slack, LinkedIn, iMessage or a DM.
 *
 * With nothing in <head> a shared link renders as a bare domain and a grey
 * box, which is the one thing a portfolio link cannot afford: the moment it is
 * most likely to be seen by a stranger is the moment it says least.
 *
 * This file is the single source for both halves of the card, the picture in
 * public/og/ and the meta tags in the layout. Keeping them together is the
 * point: a card cannot end up describing a page differently from the page
 * itself, because both read the same entry.
 *
 * The pictures are drawn by `npm run share-cards` and committed. Edit an entry
 * here (or a project's headline) and run it again, or the image will still be
 * showing the old words.
 */

// Explicit .ts because tools/share-cards.mjs runs this file straight through
// node, which, unlike Vite, will not guess the extension.
import { projects } from '../data/projects.ts';

/*
 * The size every platform crops to, and the factor the picture is actually
 * drawn at so it stays sharp on a retina screen. The meta tags report the
 * file's real pixels, width times scale, because a scraper told the wrong
 * dimensions can crop the card on the strength of them.
 */
export const cardLayout = { width: 1200, height: 630, scale: 2 } as const;

export type ShareCard = {
  /** The route this card belongs to, with the trailing slash Astro serves. */
  path: string;
  /** Small mono line above the headline. Says what kind of page this is. */
  eyebrow: string;
  /** The headline, set in Newsreader under the yellow highlighter. */
  title: string;
  /**
   * One supporting sentence. The card gives it two lines, about 125
   * characters, and clips whatever runs past them, so write to the budget
   * rather than trusting the clip to land somewhere sensible.
   */
  sub?: string;
  /** Mono line along the bottom, counted things, never claims. */
  kicker?: string;
};

/*
 * The site pages. Copy is taken from the page it belongs to rather than
 * written fresh, so the card is a preview and not a second, competing pitch.
 */
const pages: ShareCard[] = [
  {
    path: '/',
    eyebrow: 'Product designer · Toronto',
    title: 'Hi, I am Narges.',
    sub: 'Behavioural research and WCAG standards, applied to things that work for everyone, including the people most products forget.',
    kicker: 'works · about · how i design',
  },
  {
    path: '/product-design/',
    eyebrow: 'Work',
    title: 'Product design',
    sub: 'Consumer flows rebuilt so the keyboard path, the screen-reader order and the visual order match.',
    kicker: `${projects.filter((p) => !p.draft).length} case studies · WCAG 2.2 AA`,
  },
  {
    path: '/about/',
    eyebrow: 'About',
    title: 'About me',
    sub: 'A product designer finishing an Honours BSc in Cognitive Science & Psychology at the University of Toronto.',
  },
  {
    path: '/how-i-design/',
    eyebrow: 'Practice',
    title: 'How I design',
    sub: 'Accessibility is not a checklist I run at the end. It is the brief itself.',
    kicker: 'honesty is an accessibility feature',
  },
  {
    path: '/accessibility/',
    eyebrow: 'Essay',
    title: 'Accessibility, after AI',
    sub: 'What product design has to do differently now that models write the interface, and where accessibility sits in that.',
  },
];

/** Two lines at 25px across 30em. Past this the card clamps the text away. */
const subBudget = 125;

/**
 * The opening of a project summary. A summary runs longer than a card can
 * hold, and a card that simply cuts it off stops mid-sentence, so this keeps
 * whole clauses up to the budget and lets the page carry the rest.
 *
 * Clauses are found by their commas, which is why the budget is a character
 * count rather than a delimiter: a summary that never reaches one falls back
 * to a hard cut on a word boundary, still punctuated, never mid-word.
 */
function opening(summary: string): string {
  const close = (text: string) =>
    /[.!?]$/.test(text) ? text : `${text.replace(/[,;:]$/, '')}.`;

  if (summary.length <= subBudget) return close(summary);

  const room = summary.slice(0, subBudget);
  const clause = room.lastIndexOf(', ');
  if (clause > 0) return close(room.slice(0, clause));

  const word = room.lastIndexOf(' ');
  return close(word > 0 ? room.slice(0, word) : room);
}

/*
 * One card per finished case study, built from the same fields the page reads.
 * Drafts are deliberately absent: they are noindex, their copy is a prompt
 * rather than a claim, and a card would give unwritten work a finished face.
 * They fall back to the site card.
 */
const caseStudies: ShareCard[] = projects
  .filter((project) => !project.draft)
  .map((project) => ({
    path: `/work/${project.slug}/`,
    eyebrow: `Case study · ${project.title}`,
    title: project.headline,
    sub: opening(project.summary),
    kicker: project.contents,
  }));

export const shareCards: ShareCard[] = [...pages, ...caseStudies];

/** The file a card is drawn to: '/work/bookloop/' becomes 'work-bookloop'. */
export function cardFile(path: string): string {
  const slug = path.replace(/^\/+|\/+$/g, '').replace(/\//g, '-');
  return slug || 'default';
}

/** The card for a route. Anything without one shares the site card. */
export function cardFor(path: string): ShareCard {
  const route = path.endsWith('/') ? path : `${path}/`;
  return shareCards.find((card) => card.path === route) ?? shareCards[0];
}

/**
 * What the card says, for someone who cannot see it. Built from the card
 * rather than written per page, so it cannot drift out of date, and never
 * omitted, since an image with no alt text on an accessibility portfolio
 * would undercut the page it is advertising.
 */
export function cardAlt(card: ShareCard): string {
  const title = /[.!?]$/.test(card.title) ? card.title : `${card.title}.`;
  const sub = card.sub ? ` ${card.sub}` : '';
  return `Share card: ${card.eyebrow}. ${title}${sub}`;
}
