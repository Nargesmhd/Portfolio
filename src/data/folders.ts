import type { FolderItem } from '../components/FolderStack';
import { projectUrl } from '../lib/routes';
import { findProject } from './projects';

export type Folder = FolderItem;

/*
 * The order below is the order of the pile, top folder first. The copy for the
 * two project folders is read out of projects.ts rather than retyped here, so a
 * folder and the case study it opens cannot drift apart; the number, colour and
 * tab position are decided below because they are layout, not work.
 */
function projectFolder(
  slug: string,
  num: string,
  tone: string,
  tabOffset: number,
): Folder {
  const project = findProject(slug);
  // Loud at build time, because a silently missing folder would just be a
  // hole in the stack.
  if (!project) throw new Error(`folders.ts names a project that does not exist: ${slug}`);

  return {
    key: project.slug,
    num,
    title: project.title,
    description: project.summary,
    contents: project.contents,
    cta: 'Open the case study →',
    href: projectUrl(project.slug),
    tone,
    tabOffset,
  };
}

export const folders: Folder[] = [
  {
    key: 'sandoq',
    num: '01',
    title: 'sandoq',
    description: 'More to come.',
    tone: 'var(--f2)',
    tabOffset: 0,
  },
  projectFolder('bookloop', '02', 'var(--f3)', 172),
  projectFolder('nibbit-ai', '03', 'var(--f2)', 344),
  {
    key: 'research',
    num: '04',
    title: 'research',
    description: 'More to come.',
    tone: 'var(--f3)',
    tabOffset: 516,
  },
  {
    key: 'archive',
    num: '05',
    title: 'archive',
    description: 'More to come.',
    tone: 'var(--f4)',
    tabOffset: 688,
  },
];
