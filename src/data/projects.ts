/*
 * One entry per product-design project. Each becomes a folder on
 * /product-design/ and a case study at /work/<slug>/ - adding a project here
 * is the whole job; no route or component needs touching.
 *
 * Entries marked `draft: true` are unfinished: the shape is real, the copy is
 * a prompt. They render with a DRAFT chip on the folder and a notice at the
 * top of the case study, so nothing unwritten can pass for a claim. Replace
 * the copy and delete the flag - or delete the entry.
 */

/**
 * An image file. `alt` is required and never decorative - a case study about
 * accessibility cannot ship an unlabelled image. `w`/`h` are the file's real
 * pixel dimensions, so the browser reserves the space before the image loads
 * and nothing below it jumps.
 */
export type Img = {
  /** Path under /public. */
  src: string;
  /** What the picture shows, written for someone who cannot see it. */
  alt: string;
  w: number;
  h: number;
};

/** An image inside a section, captioned in its own right. */
export type Shot = Img & {
  /** Short mono label at the head of the caption - 'light', 'dark'. */
  tag?: string;
  caption: string;
  /** A measured value printed beside the caption, e.g. a contrast ratio. */
  figure?: string;
  /** Whether that value meets the standard. Decides the chip. */
  pass?: boolean;
  /** Detail crops sit narrower than full screens. */
  crop?: boolean;
};

/** A small ruled table of counted things. Figures only, never estimates. */
export type Table = {
  caption: string;
  head: string[];
  rows: string[][];
};

/**
 * Evidence hangs off the section it belongs to, so the reading order is the
 * order in this array and a project with nothing to show just omits it.
 */
export type Section = {
  /** One word. [slug].astro lowercases it into an id for aria-labelledby, and
      an id with a space in it would break the reference. */
  heading: string;
  body: string;
  shots?: Shot[];
  table?: Table;
};

export type Project = {
  /** URL segment. Lowercase, hyphenated, stable - it is a public link. */
  slug: string;
  /** Folder title. Lowercase, matching the folders on the home page. */
  title: string;
  /** Folder-panel summary - what the project was, in one or two lines. */
  summary: string;
  /** The mono line under the summary, reading like a label on a real file. */
  contents: string;
  /** The case-study H1. Name the outcome: headings get read out of context. */
  headline: string;
  /** Four cells: role, timeline, team, standard. */
  meta: [label: string, value: string][];
  /** The opening image. Without one the slot renders a placeholder stripe. */
  hero?: Img;
  /** Caption for the hero - or, with no hero, what belongs in the slot. */
  heroCaption: string;
  sections: Section[];
  /** Three figures. Measured values only - the site claims nothing it has not counted. */
  metrics: [figure: string, label: string][];
  draft?: boolean;
};

export const projects: Project[] = [
  {
    slug: 'nibbit-ai',
    title: 'nibbit.ai',
    summary:
      'Core consumer flow rebuilt around screen-reader order and keyboard parity, then tested with VoiceOver and NVDA before it shipped.',
    contents: 'flows · before/after · 2 screen readers',
    headline: 'Giving keyboard users the same path as mouse users',
    meta: [
      ['Role', 'Product Designer (solo)'],
      ['Timeline', 'Jan 2023 – Nov 2024'],
      ['Team', 'Early-stage startup'],
      ['Standard', 'WCAG 2.2 AA'],
    ],
    heroCaption: 'before/after of the core flow - drop real screens here',
    sections: [
      {
        heading: 'Problem',
        body: 'Tab order followed the DOM, not the visual flow. Keyboard users hit dead ends in the core consumer flow - actions a mouse could reach had no keyboard route at all, and screen readers announced controls in an order that made no sense.',
      },
      {
        heading: 'Process',
        body: 'Audited every stop in the flow, rebuilt the layout in screen-reader order so the visual and programmatic sequence matched, then tested each round with VoiceOver and NVDA before shipping.',
      },
      {
        heading: 'Outcome',
        body: 'Every mouse path got a keyboard twin. The rebuilt flow shipped across the consumer app.',
      },
      {
        heading: 'Strategy',
        body: 'Tab order that follows the DOM instead of the layout is one problem written twice: the page ends up with two orders, the one you see and the one the browser reports, and only a sighted mouse user gets the good one. Rebuilding the flow so those two agree leaves a single sequence for everything else to read - keyboard focus, reading mode, translation, and any test that walks the page from top to bottom. Curb cuts get told as a happy accident that turned out to help people with strollers and delivery carts; in fact disabled activists poured their own concrete ramps in the seventies because cities would not, and the spillover arrived only because someone forced the design to exist first. Keyboard parity has the same shape. It gets built when someone treats it as the brief, and then it quietly serves everyone who is not holding a mouse.',
      },
    ],
    metrics: [
      ['23 mo', 'on the product'],
      ['100%', 'keyboard coverage'],
      ['2', 'screen readers tested'],
    ],
  },
  {
    slug: 'bookloop',
    title: 'bookloop',
    summary:
      'Audit and remediation of a live social book club app - form semantics, dark-mode contrast, and a keyboard defect that was quietly changing which books clubs read.',
    contents: 'audit · 110 controls · both themes · WCAG 2.2 AA',
    headline: 'An accessibility audit that changed the product, not just the markup',
    meta: [
      ['Role', 'Product Designer (solo)'],
      ['Timeline', '2026'],
      ['Team', 'Solo project'],
      ['Standard', 'WCAG 2.2 AA'],
    ],
    hero: {
      src: '/work/bookloop/home-light.jpg',
      alt: "BookLoop's home page in light theme: a cream background, the headline 'Your book club, in one loop', and a card showing Dune by Frank Herbert being read right now by the Sci-Fi Explorers club.",
      w: 1400,
      h: 765,
    },
    heroCaption: 'home - the club reading Dune this week',
    sections: [
      {
        heading: 'Problem',
        body: 'BookLoop is a book club app where progress, posts and votes update live. It had two accessibility problems and only one of them was visible. The first was ordinary and severe: 73 of its 110 form controls had no accessible name, because labels were written as siblings of their inputs rather than linked to them - including the Email and Password fields on the sign-in screen, the first thing anyone touches. The second was that the product assumed an uninterrupted reader. You read fifteen pages on a Tuesday, nothing for nine days, then an hour on a plane, and by the time you finish, the thing you wanted to say about chapter three is gone. That gap hits everyone, and it hits people with ADHD, brain fog or fluctuating capacity considerably harder.',
        shots: [
          {
            src: '/work/bookloop/home-dark.jpg',
            alt: 'The same BookLoop home page in dark theme: a near-black background with cream text, carrying the same Dune card and headline.',
            w: 1400,
            h: 765,
            tag: 'dark',
            caption:
              'the same page, second theme. Both were designed rather than inverted, and both render the label bug perfectly.',
          },
        ],
      },
      {
        heading: 'Process',
        body: 'Two passes, because the two kinds of defect hide from different tools. A static scan of every component file checked each control for an accessible name and each label for a real association - that is where the 73 came from, and the 30 labels attached to nothing at all. Then I ran the app locally against its own database and measured contrast on the rendered elements in both themes rather than reading it off the palette. That is how the dark-mode Search button turned up at 1.05:1, white on cream, from a hardcoded text-white sitting next to a background token that flips from navy to cream between themes - a pairing that appears 98 times. The remaining four defects were found by using the product, not by scanning it.',
        shots: [
          {
            src: '/work/bookloop/find-a-club-light.jpg',
            alt: "BookLoop's Find a club page in light theme: white cards on cream, six public book clubs with genre and pace chips, and a dark navy Search button.",
            w: 1400,
            h: 787,
            tag: 'light',
            caption: 'find a club',
          },
          {
            src: '/work/bookloop/find-a-club-dark.jpg',
            alt: 'The same Find a club page in dark theme: dark cards on near-black. The Search button is now a pale cream pill whose white label is barely readable.',
            w: 1400,
            h: 787,
            tag: 'dark',
            caption: 'the same page - look at the Search button',
          },
        ],
      },
      {
        heading: 'System',
        body: 'The design system is real: semantic colour tokens, a full second set for dark, and shared Card, Avatar and Button primitives. It failed in two ways at once. Nine of its tokens are declared only inside the dark block and never in the theme block, so the build emits no utility class for them - including the near-black foreground that would give 8.7:1 where white currently gives 2.2:1. Those nine exist, they are correct, and no markup can reach them; every hover state written against them silently does nothing, in both themes. The other failure is adoption. A shared Button component was added specifically so this class of bug could be fixed in one place, and its own comment says so. Nothing ever imported it.',
        shots: [
          {
            src: '/work/bookloop/search-button-light.png',
            alt: 'Close-up of the Search button in light theme: white text and a magnifier icon on a deep navy pill, clearly legible.',
            w: 504,
            h: 280,
            tag: 'light',
            caption: 'white on navy',
            figure: '15.3:1',
            pass: true,
            crop: true,
          },
          {
            src: '/work/bookloop/search-button-dark.png',
            alt: 'Close-up of the same Search button in dark theme: the pill is pale cream and the white label is almost invisible against it.',
            w: 504,
            h: 280,
            tag: 'dark',
            caption: 'white on cream',
            figure: '1.05:1',
            pass: false,
            crop: true,
          },
        ],
        table: {
          caption: 'design-system adoption, counted from the codebase',
          head: ['Primitive', 'Files importing it', 'Result'],
          rows: [
            ['Card', '26', 'Working as intended'],
            ['Button', '0', 'Dead code - every button is hand-styled'],
            ['Hand-styled buttons', '78 elements, 55 class signatures', 'No single place to fix contrast'],
          ],
        },
      },
      {
        heading: 'Outcome',
        body: 'Four defects fixed. The one worth naming looked like a keyboard bug and was corrupting data: half-star ratings were chosen by cursor position, and keyboard activation reports a cursor position of zero, so keyboard users could set 2.5 stars but never 3. Club ballots are decided by average stars, so keyboard votes ran half a star low and could change which book a club read. The fix changed the design rather than the markup - five focusable stars became one slider with the stars decorative, five tab stops down to one, arrows previewing and Enter committing so a trip from 1 to 5 does not fire five writes at everyone watching the ballot. Contrast, focus order and modal keyboard handling were fixed across 15 files and 36 controls. The open findings are documented with severity, WCAG criterion and a plan ordered by impact per hour.',
      },
      {
        heading: 'Strategy',
        body: 'That table is the whole lesson about design systems: an unadopted primitive is worse than none, because it creates the belief that contrast is centralised when it is actually spread across 55 hand-written variants. The other lesson is that cognitive accessibility is product strategy, not an accommodation bolted on afterwards. Progress is stored as a percent rather than a page, which is the only unit that means the same thing to a paperback, an ebook and a fourteen-hour audiobook, and it is also what lets a note anchor to a place in the book and stay sealed until you reach it - so you can open a three-week-old club thread without being spoiled. That is not a feature for a minority. It is the reason someone is still in the club in week six.',
      },
    ],
    metrics: [
      ['73/110', 'controls with no name'],
      ['1.05:1', 'dark-mode button contrast'],
      ['4', 'defects found and fixed'],
    ],
  },
  {
    slug: 'design-documentation',
    title: 'design documentation',
    draft: true,
    summary:
      'Draft. The docs that stop regressions - component notes, acceptance criteria, the checks that outlive the designer. Write up the set you are proudest of.',
    contents: 'draft · not written yet',
    headline: 'Name the outcome you delivered, not the work you did',
    meta: [
      ['Role', 'fill in'],
      ['Timeline', 'fill in'],
      ['Team', 'fill in'],
      ['Standard', 'WCAG 2.2 AA'],
    ],
    heroCaption: 'a page from the documentation - drop a real spread here',
    sections: [
      {
        heading: 'Problem',
        body: 'What kept breaking, and why the fix never held. Documentation case studies live or die on this section: without a regression to point at, the docs read as housekeeping.',
      },
      {
        heading: 'Process',
        body: 'What you wrote, who you wrote it for, and how it got into the build. Say where the docs sit - in the repo, in the design file, in the ticket template - because that is what decides whether anyone reads them.',
      },
      {
        heading: 'Outcome',
        body: 'What stopped regressing. If you have a before and after count of issues, this is where it goes.',
      },
    ],
    metrics: [
      ['-', 'fill in'],
      ['-', 'fill in'],
      ['-', 'fill in'],
    ],
  },
];

export function findProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
