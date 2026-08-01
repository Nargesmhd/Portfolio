import { routes } from '../lib/routes';

export type Folder = {
  key: string;
  num: string;
  title: string;
  description: string;
  /** The mono line under the description — reads like a label on a real file. */
  contents: string;
  cta: string;
  href: string;
  /** Closed-state background token. The open folder always turns yellow. */
  tone: string;
  /** Tab offset, so the four tabs form a staircase. */
  tabOffset: number;
};

export const folders: Folder[] = [
  {
    key: 'accessibility',
    num: '01',
    title: 'accessibility',
    description:
      'Audits and remediation for small teams - contrast, focus order, form semantics, plus the docs that stop regressions.',
    contents: '4 audits · 2 redesigns · checked against WCAG 2.2',
    cta: 'Open the case study →',
    href: routes.caseStudy,
    tone: 'var(--f3)',
    tabOffset: 0,
  },
  {
    key: 'product',
    num: '02',
    title: 'product design',
    description:
      'nibbit.ai, 2023-24. Core consumer flow rebuilt around screen-reader order and keyboard parity.',
    contents: '1 case study · flows · before/after',
    cta: 'Open the case study →',
    href: routes.caseStudy,
    tone: 'var(--f2)',
    tabOffset: 172,
  },
  {
    key: 'research',
    num: '03',
    title: 'research',
    description:
      'Cognitive science coursework applied to interfaces: attention, memory load, error recovery.',
    contents: '3 notes · 1 study summary',
    cta: 'See how I design →',
    href: routes.design,
    tone: 'var(--f3)',
    tabOffset: 344,
  },
  {
    key: 'archive',
    num: '04',
    title: 'archive',
    description:
      'Older explorations, drafting work, and side projects - kept because the thinking still counts.',
    contents: 'drafting · retail years · misc',
    cta: 'Open the archive →',
    href: routes.caseStudy,
    tone: 'var(--f4)',
    tabOffset: 516,
  },
];
