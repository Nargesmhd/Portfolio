import { useEffect, useRef, useState } from 'react';
import { folders } from '../data/folders';
import { usePrefs } from '../lib/usePrefs';

const PULL_MS = 420;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Four manila folders in a pile. Opening one closes the others; the open
 * folder turns yellow and slides out of the stack. Activating its CTA pulls
 * the folder from the pile before navigating.
 *
 * Under "plain layout" the same content renders as a flat bordered list -
 * the decoration goes, nothing else does.
 */
export default function FolderStack() {
  const { plain } = usePrefs();
  const [open, setOpen] = useState<string | null>(null);
  const [pulled, setPulled] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  // A pending navigation timer must not outlive the component.
  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  function handleCta(event: React.MouseEvent<HTMLAnchorElement>, key: string) {
    // Reduced motion gets the plain link: no pull, no delay, no interception.
    // Modified clicks (new tab, download) are left alone too.
    if (
      prefersReducedMotion() ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    const href = event.currentTarget.href;
    setPulled(key);
    timer.current = window.setTimeout(() => {
      window.location.href = href;
    }, PULL_MS);
  }

  if (plain) {
    return (
      <ul className="plain-list">
        {folders.map((f) => (
          <li key={f.key}>
            <span className="plain-num mono">{f.num}</span>
            <div>
              <h3 className="plain-title">{f.title}</h3>
              <p className="plain-desc">{f.description}</p>
              <p className="plain-meta mono">{f.contents}</p>
              <a className="plain-cta mono" href={f.href}>
                {f.cta}
              </a>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="stack">
      <p className="stack-caption mono">
        four folders, stacked. open one to see what is inside.
      </p>

      {/* A list rather than loose divs - the caption sits outside it so the
          list has only listitem children. */}
      <div role="list" aria-label="Work folders">
        {folders.map((f, i) => {
        const isOpen = open === f.key;
        const isPulled = pulled === f.key;
        const panelId = `folder-panel-${f.key}`;

        return (
          <div
            key={f.key}
            role="listitem"
            className={`folder${isOpen ? ' is-open' : ''}${
              isPulled ? ' is-pulled' : ''
            }`}
            style={
              {
                // The closed-state tone only. --folder-bg is derived from it
                // in CSS so the open state can override it - an inline
                // --folder-bg would outrank any stylesheet rule.
                '--folder-tone': f.tone,
                '--tab-offset': `${f.tabOffset}px`,
                zIndex: i + 1,
              } as React.CSSProperties
            }
          >
            {/* Purely a shape cue for the pile; the number and title below
                carry the same information in text. */}
            <div className="folder-tab" aria-hidden="true" />

            <div className="folder-body">
              <button
                type="button"
                className="folder-head"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : f.key)}
              >
                <span className="folder-head-left">
                  <span className="folder-num mono">{f.num}</span>
                  <span className="folder-title">{f.title}</span>
                </span>
                <span className="folder-state mono">
                  {isOpen ? 'CLOSE −' : 'OPEN +'}
                </span>
              </button>

              <div id={panelId} className="folder-panel" hidden={!isOpen}>
                <p className="folder-desc">{f.description}</p>
                <p className="folder-meta mono">{f.contents}</p>
                <a
                  className="folder-cta mono"
                  href={f.href}
                  onClick={(e) => handleCta(e, f.key)}
                >
                  {f.cta}
                </a>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}
