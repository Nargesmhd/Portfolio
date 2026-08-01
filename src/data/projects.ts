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
    slug: 'freelance-remediation',
    title: 'freelance remediation',
    draft: true,
    summary:
      'Draft. Accessibility remediation for small teams, 2022 onward. Pick one engagement and write it up the way nibbit.ai is written up.',
    contents: 'draft · not written yet',
    headline: 'Name the outcome you delivered, not the work you did',
    meta: [
      ['Role', 'Freelance (fill in)'],
      ['Timeline', 'fill in'],
      ['Team', 'fill in'],
      ['Standard', 'WCAG 2.2 AA'],
    ],
    heroCaption: 'before/after of the screen you changed - drop real screens here',
    sections: [
      {
        heading: 'Problem',
        body: 'What was broken, and for whom. Name the barrier in plain language and say who hit it - a keyboard user, a screen-reader user, someone reading at 200% zoom. Two or three sentences is enough.',
      },
      {
        heading: 'Process',
        body: 'What you audited, what you rebuilt, and how you checked it. This is the section that proves the method, so keep the order you actually worked in rather than the order that sounds tidy.',
      },
      {
        heading: 'Outcome',
        body: 'What shipped and what it changed. Claim only what you measured - the numbers below should be countable, not estimated.',
      },
    ],
    metrics: [
      ['—', 'fill in'],
      ['—', 'fill in'],
      ['—', 'fill in'],
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
