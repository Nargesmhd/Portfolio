import { usePrefs } from '../lib/usePrefs';
import { setPrefs, type Prefs } from '../lib/prefs';

/**
 * The three reading controls, docked to the right edge of the viewport.
 *
 * These are real toggles (aria-pressed), not links or menu items — the state
 * is the point, and it has to be announced. Page content reserves 190px of
 * right padding so the rail never sits on top of text; below 900px the rail
 * unpins and sits inline under the header instead.
 */

const CONTROLS: { key: keyof Prefs; label: string }[] = [
  { key: 'largerText', label: 'Aa larger text' },
  { key: 'highContrast', label: '◐ high contrast' },
  { key: 'plain', label: '≡ plain layout' },
];

export default function ReadingRail() {
  const prefs = usePrefs();

  return (
    <div className="rail" role="group" aria-label="Reading settings">
      {CONTROLS.map(({ key, label }) => {
        const on = Boolean(prefs[key]);
        return (
          <button
            key={key}
            type="button"
            aria-pressed={on}
            onClick={() => setPrefs({ [key]: !on })}
            className={on ? 'rail-btn is-on' : 'rail-btn'}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
