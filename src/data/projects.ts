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
 * What a screen reader says, before and after. Some defects have no visual
 * symptom at all, a label attached to nothing renders perfectly, so the
 * only way to show one on a page is to quote the speech.
 */
export type Spoken = {
  /** What the user did to hear it. */
  action: string;
  lines: { when: string; says: string }[];
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
  spoken?: Spoken;
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
      'The launch site and brand for a pre-product AI startup - accessibility written into the research criteria, two themes drawn separately, and a sign-up path that asked for more than it had earned.',
    contents: 'audit · 2 themes · 390px · contrast measured',
    headline: 'Putting accessibility in the brief before there was a product',
    meta: [
      ['Role', 'Product Designer (site & brand)'],
      ['Timeline', 'Feb – Aug 2023'],
      ['Team', '8 people'],
      ['Scope', 'Marketing site, brand, comms'],
    ],
    hero: {
      src: '/work/nibbit-ai/home-light.jpg',
      alt: "The nibbit home page in light theme: a white room with faint perspective lines, the headline 'Take on life a nibb at a time', a purple Create account button, an illustration of a woman sitting cross-legged with a tablet, and a speech bubble quoting the team about planning habits and goals.",
      w: 1444,
      h: 1278,
    },
    heroCaption: 'home, light - the page the work settled on',
    sections: [
      {
        heading: 'Problem',
        body: 'nibbit was building two things and neither existed yet. Habbit set out to gamify habit-building across different habits at once - build one, quit another, and have both feed the same streaks, levels and trophies, collected by an avatar you level up. Pebble was the AI companion you talked to about that progress. Gamification is a retention argument: it exists to make coming back worth something, which is where a habit app is won or lost. Both products were months out, so the site had one job - make that promise worth waiting for. The first direction spent the credit on a joke instead - "We are making an app for those who chicken out", and under it, in the same weight as the pitch, "Don\'t bother us. seriously. We get easily distracted." Funny in a room. On a page it is a shrug from a company asking strangers to trust it with their habits, and it never says what the product does. The pun was the brand and worth keeping. The shrug is what the rest of the work replaced.',
        shots: [
          {
            src: '/work/nibbit-ai/concept-chicken.jpg',
            alt: 'The first homepage concept in light theme, branded "Chicken." with a chicken-head logo: the headline "We are making an app for those who chicken out", then "Don\'t bother us. seriously. We get easily distracted." On the right, a cartoon egg cracking and a hatched chick stand on pale grey hexagons.',
            w: 1440,
            h: 1001,
            tag: 'first',
            caption: 'the opening concept - the pun lands, the promise never arrives',
          },
        ],
      },
      {
        heading: 'Accessibility',
        body: 'Accessibility was one of the sixteen columns in the competitive audit, which is to say it was a criterion before it was a decision - and the audit\'s own complaint against Microsoft, that unsuitable button heights hurt reach, is the sort of note that only turns up when somebody is looking for it. Three things followed from having that column. Light and dark were drawn as two designs rather than one inverted, so the illustration keeps its own value range instead of being dimmed along with the page behind it. The layout goes down to 390px with the reading order unchanged from desktop, so nothing reshuffles itself on the way to a phone. And the palette was measured rather than assumed, which is how I know the brand colours are not what makes the mark readable - the outline is.',
        shots: [
          {
            src: '/work/nibbit-ai/home-phone-light.jpg',
            alt: 'The nibbit home page at 390 pixels wide in light theme: the wordmark and a hamburger menu on one row, then the headline, the purple Create account button, the quote card, the illustration of the woman with a tablet, the subscribe block and the footer, each stacked full width.',
            w: 390,
            h: 1771,
            tag: '390 light',
            caption: 'the narrow width - one control for the nav, reading order unchanged',
            crop: true,
          },
          {
            src: '/work/nibbit-ai/home-phone-dark.jpg',
            alt: 'The same 390-pixel-wide home page in dark theme: near-black background and white text, with the illustration and the purple button keeping their own colour rather than being dimmed with the rest of the page.',
            w: 390,
            h: 1771,
            tag: '390 dark',
            caption: 'the same stack, second theme - the illustration keeps its values',
            crop: true,
          },
        ],
        table: {
          caption: 'the mark\'s palette, measured out of the SVG',
          head: ['Pairing', 'Ratio', 'What it means'],
          rows: [
            ['Outline on white', '16.3:1', 'The shape is legible with no colour at all'],
            ['Comb red on white', '3.38:1', 'Clears 3:1 for graphics, nowhere near 4.5:1 for text'],
            ['Beak yellow on white', '1.19:1', 'Invisible unaided - the outline is holding it up'],
          ],
        },
      },
      {
        heading: 'Potential',
        body: 'The information architecture is where the ambition shows, and where it costs. Twenty-five nodes, sixteen of them behind Account, with sign-up alone a five-screen chain - Create Account, Choose Name and Username, Add Contact Information, Set Password, Confirm Account - beside trophies, avatars and application details, all drawn for a product the same site called available soon. Read generously, that is a team mapping the thing it intends to build. Read plainly, it is five screens of effort charged to someone who has not been given a reason yet, and effort is what filters people out first: anyone tired, distracted, short on time or short on attention. The front page could not shorten the chain, so it did the next best thing - one button and one email field, and everything else kept behind them.',
      },
      {
        heading: 'Outcome',
        body: 'Delivered: home and about in two themes at three widths, six error screens, the mark and its letterhead, a welcome email, and the artwork that went out to hire an illustrator. Not all of it cleared - a commitments section was laid out and never approved, one of its five bullets still reading "Community:" with nothing after the colon, which is what a layout finished ahead of its content looks like when the content never arrives. And the site is gone: nibbit.ai today serves a seven-line poem about a species that grew confident enough to fly and is now falling. So this is evidence of judgement rather than of traffic - what it looks like when accessibility is a criterion at the research stage, on a project where nobody was checking.',
        shots: [
          {
            src: '/work/nibbit-ai/welcome-email.jpg',
            alt: 'The Welcome to habbit email: a headline, an illustration of three figures holding a Welcome sign, then three feature blocks paired with phone screenshots - building good habits and quitting bad ones, talking with Pebble the AI companion, and gamifying habit-building with a chick avatar and trophies.',
            w: 658,
            h: 2253,
            tag: 'email',
            caption: 'the welcome email - three promises, each with the screen that would keep it',
            crop: true,
          },
        ],
      },
    ],
    metrics: [
      ['2', 'themes drawn, not inverted'],
      ['390px', 'narrowest layout designed'],
      ['16 of 25', 'pages behind a sign-up'],
    ],
  },
  {
    slug: 'bookloop',
    title: 'bookloop',
    summary:
      'Audit and remediation of a live social book club app - form semantics, dark-mode contrast, and a keyboard defect that was quietly changing which books clubs read.',
    contents: 'audit · 110 controls · 14 findings · WCAG 2.2 AA',
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
    heroCaption: 'home, on seeded demo data captured locally - the clubs and cover art are seed content, not live users',
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
        spoken: {
          action: 'tabbing into the email field on the sign-in screen',
          lines: [
            { when: 'now', says: 'edit, blank' },
            { when: 'once linked', says: 'Email, edit, blank' },
          ],
        },
      },
      {
        heading: 'Process',
        body: 'Two passes, because the two kinds of defect hide from different tools. A static scan of every component file checked each control for an accessible name and each label for a real association - that is where the 73 came from, and the 30 labels attached to nothing at all. Then I ran the app locally against its own database and measured contrast on the rendered elements in both themes rather than reading it off the palette. That is how the dark-mode Search button turned up at 1.05:1, white on cream, from a hardcoded text-white sitting next to a background token that flips from navy to cream between themes - a pairing that appears 98 times. Both counts come from short scripts that re-run against the repo, so every figure on this page can be checked rather than taken on trust. The remaining four defects were found by using the product, not by scanning it.',
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
        body: 'The design system is real: semantic colour tokens, a full second set for dark, and shared Card, Avatar and Button primitives. It failed in two ways at once. Nine of its tokens are declared only inside the dark block and never in the theme block, so the build emits no utility class for them - including the near-black foreground that would give 8.7:1 where white currently gives 2.2:1. Those nine exist, they are correct, and no markup can reach them; every hover state written against them silently does nothing, in both themes. The other failure is adoption. A shared Button component was added specifically so this class of bug could be fixed in one place, and its own comment says so. Nothing ever imported it. Three decisions went the other way, and none of them were filed as accessibility work: the type is the system font stack, so OS text settings apply without a webfont overriding them; the datetime pickers are the native ones, kept rather than rebuilt, which keeps the platform behaviour nobody reimplements correctly - including native clear;. Small calls, both, and each one is a decision not to reinvent something the platform already does accessibly.',
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
        body: 'Four defects fixed. The one worth naming looked like a keyboard bug and was corrupting data: half-star ratings were chosen by cursor position, and keyboard activation reports a cursor position of zero, so keyboard users could set 2.5 stars but never 3. Club ballots are decided by average stars, so keyboard votes ran half a star low and could change which book a club read. The fix changed the design rather than the markup - five focusable stars became one slider with the stars decorative, five tab stops down to one, arrows previewing and Enter committing so a trip from 1 to 5 does not fire five writes at everyone watching the ballot. Contrast, focus order and modal keyboard handling were fixed across 15 files and 36 controls - and the focus work standardised on focus-visible rather than focus, so the ring stops appearing on mouse clicks and nobody is tempted to delete it again. An accessible option that fights the design gets removed eventually.',
      },
      {
        heading: 'Open',
        body: 'Ten findings are still unfixed, and a case study that only lists the wins is a brochure. The two Critical ones are the two described above; they are repeated here because an open list that quietly drops its worst items is not an open list. The live-region gap is the one that needs a decision rather than a patch: a club with eight active members would be unusable if every event announced itself, so some events should speak politely, some should stay visual, and some should batch. The last two were not in the original audit at all - both surfaced later, and the broken cover turned up only because someone looked closely at a screenshot. That is the best argument on this page for the last row of the table.',
        table: {
          caption: 'open findings, at the time of writing',
          head: ['Finding', 'Detail', 'Severity'],
          rows: [
            [
              'Labels that label nothing',
              '73 of 110 controls have no accessible name; 30 labels are attached to no control at all',
              'Critical',
            ],
            [
              'Dark-mode button contrast',
              'White on cream at 1.05:1, in 98 places. Light theme is fine, which is why it survived',
              'Critical',
            ],
            [
              'A live app that never speaks',
              'Two status regions, in a product whose posts, tallies and presence all stream over websockets',
              'Serious',
            ],
            [
              'One dialog still is not one',
              'The nominate-and-vote panel is marked as a dialog but never got the keyboard hook the other two use - no Escape, no focus trap',
              'Serious',
            ],
            [
              'Club covers are hotlinked, and one is gone',
              'Seed club avatars point at a third-party image host. One photo has since been deleted, and the card falls back only when the URL is missing, not when the image fails to load - so a dead URL is truthy, the img renders, and the browser paints its own broken-image glyph in the card',
              'Moderate',
            ],
            [
              'Recap cards are pictures of text',
              'The monthly and year-in-books cards are canvas-rendered, across five themes. Canvas text carries no accessible name, so a shared recap is unreadable to assistive technology unless it is described separately',
              'Serious',
            ],
            [
              'Dead token classes',
              'Nine tokens declared only for dark, generating no utilities. Every hover state written against them does nothing',
              'Moderate',
            ],
            [
              'No skip link',
              'Keyboard users tab the full nav on every page, though the landmarks already exist',
              'Moderate',
            ],
            [
              'Motion mostly unguarded',
              'One reduced-motion check in the whole app, in the celebration overlay',
              'Moderate',
            ],
            [
              'Nothing is watching',
              '90 test suites, no accessibility tests, no automated checks in CI. Every defect here was found by a person',
              'Moderate',
            ],
          ],
        },
      },
      {
        heading: 'Next',
        body: 'Ordered by impact per hour rather than by severity, because a plan sorted by severity puts the hardest thing first and stalls. The first item is ten minutes of work on the screen every single user meets, and the last is not a patch at all.',
        table: {
          caption: 'what I would do next, in this order',
          head: ['When', 'Do', 'Why this order'],
          rows: [
            [
              'First',
              'Link the sign-in labels to their inputs',
              'Two labels, two inputs, on the highest-traffic screen in the product',
            ],
            [
              'Same day',
              'Make the dark-mode button legible',
              'Swap the hardcoded white for the token that already exists - and promote that token so it compiles at all',
            ],
            [
              'Same day',
              'Add one automated check, failing only on unnamed controls',
              'Scoping to a single rule makes it adoptable today, and stops the other 72 coming back',
            ],
            [
              'This week',
              'Adopt the Button primitive, or delete it',
              '55 hand-written variants is why every fix costs 15 files. Either the abstraction earns its place or it stops implying safety it does not provide',
            ],
            [
              'This week',
              'Prefill the review from your own notes',
              'A read query and a prefill. It turns recall into recognition, and needs no new data',
            ],
            [
              'Design work',
              'Decide what realtime says out loud',
              'Which events announce, which stay visual, which batch. A product decision, not a patch',
            ],
          ],
        },
      },
      {
        heading: 'Strategy',
        body: 'The design-system lesson here is not "write a design system" - BookLoop did. It is that an unadopted primitive is worse than none, because it creates the belief that contrast is centralised when it is actually spread across 55 hand-written variants. The other lesson is the one I would defend hardest: cognitive accessibility is product strategy, not an accommodation bolted on afterwards. The product is built for someone who forgets the book, and the mechanisms below are shipped rather than proposed - which matters, because this is the argument people assume is aspirational. Every one of them is a reason someone is still in the club in week six.',
        table: {
          caption: 'interruption tolerance, as shipped',
          head: ['Decision', 'What it does', 'Who it protects'],
          rows: [
            [
              'Progress is a percent, not a page',
              'The only unit that means the same thing to a paperback, an ebook and a fourteen-hour audiobook',
              'Audiobook readers, whom a page count renders as nothing at all',
            ],
            [
              'Notes carry an anchor',
              'A note holds the place you had the thought, and anything anchored past your position stays sealed until you reach it',
              'Anyone opening a three-week-old thread who does not want it spoiled',
            ],
            [
              'Sealing fails closed',
              'When two anchors cannot be compared, the note stays hidden rather than leaking. Finishing the book unseals everything',
              'Everyone - a spoiler shown once cannot be taken back',
            ],
            [
              'Yesterday still holds the streak',
              'Reading days bucket in UTC, and yesterday sustains the streak until today ends',
              'Bursty readers, whom a strict streak punishes for the pattern they already have',
            ],
            [
              'Two taps to log progress',
              'Page logging sits on the home screen instead of behind the book',
              'Anyone for whom the logging tax is the first thing they stop paying',
            ],
            [
              'Capture without opening the app',
              'A bearer-token endpoint takes notes from Siri, Shortcuts or a Kobo',
              'Motor impairments, and anyone whose thought arrives mid-chapter',
            ],
            [
              'Abandoned setup resumes',
              'A resume link and a recovery email pick the wizard up where it stopped',
              'Interrupted attention - the case setup would otherwise lose outright',
            ],
          ],
        },
      },
    ],
    metrics: [
      ['73/110', 'controls with no accessible name'],
      ['1.05:1', 'the dark-mode Search button'],
      ['4', 'defects fixed - and 10 left open'],
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
