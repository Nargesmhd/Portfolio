import type { FolderItem } from '../components/FolderStack';
import { projectUrl, routes } from '../lib/routes';
import { projects } from './projects';

export type Folder = FolderItem;

export const folders: Folder[] = [
  {
    key: 'accessibility',
    num: '01',
    title: 'accessibility',
    description:
      'Audits and remediation for small teams - contrast, focus order, form semantics, plus the docs that stop regressions.',
    contents: '4 audits · 2 redesigns · checked against WCAG 2.2',
    cta: 'Open the case study →',
    href: projectUrl('nibbit-ai'),
    tone: 'var(--f3)',
    tabOffset: 0,
  },
  {
    key: 'product',
    num: '02',
    title: 'product design',
    description:
      'Consumer flows rebuilt so the keyboard path, the screen-reader order and the visual order are the same order. One folder per project inside.',
    // Counted from the data, so adding a project cannot leave this line lying.
    contents: `${projects.length} projects · flows · before/after`,
    cta: 'Open the projects →',
    href: routes.productDesign,
    tone: 'var(--f2)',
    tabOffset: 172,
  },
  {
    key: 'research',
    num: '03',
    title: 'research',
    description: 'More to come.',
    tone: 'var(--f3)',
    tabOffset: 344,
  },
  {
    key: 'archive',
    num: '04',
    title: 'archive',
    description: 'More to come.',
    tone: 'var(--f4)',
    tabOffset: 516,
  },
];
