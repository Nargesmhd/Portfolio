import { useState } from 'react';
import {
  HomeSheet,
  CaseSheet,
  AboutSheet,
  AccessSheet,
  PlaySheet,
} from './wireframes/sheets';
import { contact } from '../lib/routes';

type SheetId = 'home' | 'case' | 'about' | 'access' | 'play';

type Chip = { label: string; to?: SheetId; href?: string };

const SHEETS: {
  id: SheetId;
  tab: string;
  caption: string;
  Sheet: () => React.JSX.Element;
  chips: Chip[];
}[] = [
  {
    id: 'home',
    tab: 'home',
    caption: '01, home',
    Sheet: HomeSheet,
    chips: [
      { label: 'tap a folder → case study', to: 'case' },
      { label: 'profile strip → about', to: 'about' },
    ],
  },
  {
    id: 'case',
    tab: 'case study',
    caption: '02, case study',
    Sheet: CaseSheet,
    chips: [
      { label: '← back to folders', to: 'home' },
      { label: 'next file → about', to: 'about' },
    ],
  },
  {
    id: 'about',
    tab: 'about',
    caption: '03, about',
    Sheet: AboutSheet,
    chips: [
      { label: '← home', to: 'home' },
      { label: 'next → a11y statement', to: 'access' },
    ],
  },
  {
    id: 'access',
    tab: 'a11y statement',
    caption: '04, accessibility statement',
    Sheet: AccessSheet,
    chips: [
      { label: '"found a barrier?" → email', href: `mailto:${contact.email}` },
      { label: 'next → playground', to: 'play' },
    ],
  },
  {
    id: 'play',
    tab: 'playground',
    caption: '05, playground',
    Sheet: PlaySheet,
    chips: [
      { label: 'convo chip → email', href: `mailto:${contact.email}` },
      { label: 'back to start', to: 'home' },
    ],
  },
];

/**
 * Two ways to read the same five sheets: walk them like a visitor would, or
 * lay them all out at once. Both are the same content, the switcher changes
 * presentation only, so nobody has to use the interactive mode to see it all.
 */
export default function Wireframes() {
  const [mode, setMode] = useState<'proto' | 'all'>('proto');
  const [page, setPage] = useState<SheetId>('home');

  const current = SHEETS.find((s) => s.id === page)!;
  const Current = current.Sheet;

  return (
    <div>
      <div className="wf-controls" role="group" aria-label="Wireframe view mode">
        <button
          type="button"
          className="wf-pill"
          aria-pressed={mode === 'proto'}
          onClick={() => setMode('proto')}
        >
          ▶ prototype mode
        </button>
        <button
          type="button"
          className="wf-pill"
          aria-pressed={mode === 'all'}
          onClick={() => setMode('all')}
        >
          ▦ page by page
        </button>
      </div>

      {mode === 'proto' ? (
        <>
          <div className="wf-tabs" role="group" aria-label="Wireframe pages">
            {SHEETS.map((s) => (
              <button
                key={s.id}
                type="button"
                className="wf-pill"
                aria-pressed={page === s.id}
                onClick={() => setPage(s.id)}
              >
                {s.tab}
              </button>
            ))}
          </div>

          <div className="wf-stage">
            <Current />

            <div className="wf-links">
              <p className="wf-links-title">follow a link, like a visitor would:</p>
              {current.chips.map((chip) =>
                chip.href ? (
                  <a key={chip.label} className="wf-chip" href={chip.href}>
                    {chip.label}
                  </a>
                ) : (
                  <button
                    key={chip.label}
                    type="button"
                    className="wf-chip"
                    onClick={() => setPage(chip.to!)}
                  >
                    {chip.label}
                  </button>
                ),
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="wf-all">
          {SHEETS.map(({ id, caption, Sheet }) => (
            <figure key={id}>
              <Sheet />
              <figcaption className="mono">{caption}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
