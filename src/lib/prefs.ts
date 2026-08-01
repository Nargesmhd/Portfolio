/*
 * Reading preferences.
 *
 * The DOM is the source of truth: every preference is an attribute on <html>,
 * and CSS reacts to those attributes alone. localStorage is only a mirror used
 * to replay the state on the next load. Keeping it this way means the inline
 * boot script (which runs before React exists) and the React controls are
 * reading and writing exactly the same thing, so they cannot disagree.
 *
 * These are accessibility settings, not cosmetic ones - they must survive
 * navigation and reload, so nothing here is component state.
 */

export const STORAGE_KEY = 'nm-prefs';

export type Theme = 'light' | 'dark';
export type Palette = 'sky' | 'white' | 'moss' | 'clay';

export type Prefs = {
  theme: Theme;
  palette: Palette;
  largerText: boolean;
  highContrast: boolean;
  plain: boolean;
};

export const PREFS_EVENT = 'nm:prefs';

const DEFAULTS: Prefs = {
  theme: 'light',
  palette: 'sky',
  largerText: false,
  highContrast: false,
  plain: false,
};

/** Read the current preferences back off <html>. */
export function readPrefs(): Prefs {
  if (typeof document === 'undefined') return DEFAULTS;
  const el = document.documentElement;
  return {
    theme: el.dataset.theme === 'dark' ? 'dark' : 'light',
    palette: (el.dataset.palette as Palette) || 'sky',
    largerText: el.dataset.text === 'large',
    highContrast: el.dataset.contrast === 'high',
    plain: el.dataset.plain === 'on',
  };
}

/** Write preferences to <html>, mirror to storage, and notify subscribers. */
export function setPrefs(patch: Partial<Prefs>): Prefs {
  const next = { ...readPrefs(), ...patch };
  const el = document.documentElement;

  el.dataset.theme = next.theme;
  el.dataset.palette = next.palette;
  toggleAttr(el, 'text', next.largerText, 'large');
  toggleAttr(el, 'contrast', next.highContrast, 'high');
  toggleAttr(el, 'plain', next.plain, 'on');

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private browsing or a full quota. The setting still applies for this
    // page view; only persistence is lost, which is not worth failing over.
  }

  window.dispatchEvent(new CustomEvent(PREFS_EVENT));
  return next;
}

function toggleAttr(
  el: HTMLElement,
  key: string,
  on: boolean,
  value: string,
): void {
  if (on) el.dataset[key] = value;
  else delete el.dataset[key];
}

export function subscribe(fn: () => void): () => void {
  window.addEventListener(PREFS_EVENT, fn);
  // Another tab changing a setting should move this one too.
  window.addEventListener('storage', fn);
  return () => {
    window.removeEventListener(PREFS_EVENT, fn);
    window.removeEventListener('storage', fn);
  };
}
