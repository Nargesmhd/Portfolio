import { usePrefs } from '../lib/usePrefs';
import { setPrefs } from '../lib/prefs';

/**
 * role="switch" rather than a checkbox or a plain button: the control has an
 * on/off state that a screen reader should announce, and "light/dark" is a
 * state of the site, not a navigation action.
 */
export default function ThemeSwitch() {
  const { theme } = usePrefs();
  const dark = theme === 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      onClick={() => setPrefs({ theme: dark ? 'light' : 'dark' })}
      className="theme-switch"
    >
      {dark ? '☾ DARK: ON' : '☀ LIGHT: ON'}
      <span className="dot" aria-hidden="true" />
    </button>
  );
}
