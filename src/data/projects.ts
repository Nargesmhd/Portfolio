/*
 * One entry per product-design project. Each becomes a folder on
 * /product-design/ and a case study at /work/<slug>/ — adding a project here
 * is the whole job; no route or component needs touching.
 *
 * Entries marked `draft: true` are unfinished: the shape is real, the copy is
 * a prompt. They render with a DRAFT chip on the folder and a notice at the
 * top of the case study, so nothing unwritten can pass for a claim. Replace
 * the copy and delete the flag — or delete the entry.
 */

export type Project = {
  /** URL segment. Lowercase, hyphenated, stable — it is a public link. */
  slug: string;
  /** Folder title. Lowercase, matching the folders on the home page. */
  title: string;
  /** Folder-panel summary — what the project was, in one or two lines. */
  summary: string;
  /** The mono line under the summary, reading like a label on a real file. */
  contents: string;
  /** The case-study H1. Name the outcome: headings get read out of context. */
  headline: string;
  /** Four cells: role, timeline, team, standard. */
  meta: [label: string, value: string][];
  /** What belongs in the hero image slot, until a real screen lands there. */
  heroCaption: string;
  sections: { heading: string; body: string }[];
  /** Three figures. Measured values only — the site claims nothing it has not counted. */
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
    heroCaption: 'the same Search button in both themes - 15.3:1 and 1.05:1',
    sections: [
      {
        heading: 'Problem',
        body: 'BookLoop is a book club app where progress, posts and votes update live. It had two accessibility problems and only one of them was visible. The first was ordinary and severe: 73 of its 110 form controls had no accessible name, because labels were written as siblings of their inputs rather than linked to them - including the Email and Password fields on the sign-in screen, the first thing anyone touches. The second was that the product assumed an uninterrupted reader. You read fifteen pages on a Tuesday, nothing for nine days, then an hour on a plane, and by the time you finish, the thing you wanted to say about chapter three is gone. That gap hits everyone, and it hits people with ADHD, brain fog or fluctuating capacity considerably harder.',
      },
      {
        heading: 'Process',
        body: 'Two passes, because the two kinds of defect hide from different tools. A static scan of every component file checked each control for an accessible name and each label for a real association - that is where the 73 came from, and the 30 labels attached to nothing at all. Then I ran the app locally against its own database and measured contrast on the rendered elements in both themes rather than reading it off the palette. That is how the dark-mode Search button turned up at 1.05:1, white on cream, from a hardcoded text-white sitting next to a background token that flips from navy to cream between themes - a pairing that appears 98 times. The remaining four defects were found by using the product, not by scanning it.',
      },
      {
        heading: 'Outcome',
        body: 'Four defects fixed. The one worth naming looked like a keyboard bug and was corrupting data: half-star ratings were chosen by cursor position, and keyboard activation reports a cursor position of zero, so keyboard users could set 2.5 stars but never 3. Club ballots are decided by average stars, so keyboard votes ran half a star low and could change which book a club read. The fix changed the design rather than the markup - five focusable stars became one slider with the stars decorative, five tab stops down to one, arrows previewing and Enter committing so a trip from 1 to 5 does not fire five writes at everyone watching the ballot. Contrast, focus order and modal keyboard handling were fixed across 15 files and 36 controls. The open findings are documented with severity, WCAG criterion and a plan ordered by impact per hour.',
      },
      {
        heading: 'Strategy',
        body: 'Two things this project taught me. An unadopted primitive is worse than none: BookLoop had a shared Button component added specifically so contrast could be fixed in one place, and nothing ever imported it - 78 hand-styled buttons across 55 class signatures instead, which is why every fix cost 15 files rather than one line. And cognitive accessibility is product strategy, not an accommodation bolted on. Progress is stored as a percent rather than a page, which is the only unit that means the same thing to a paperback, an ebook and a fourteen-hour audiobook, and it is also what lets notes anchor to a place in the book and stay sealed until you reach them - so you can open a three-week-old club thread without being spoiled. That is not a feature for a minority. It is the reason someone is still in the club in week six.',
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
      ['—', 'fill in'],
      ['—', 'fill in'],
      ['—', 'fill in'],
    ],
  },
];

export function findProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
