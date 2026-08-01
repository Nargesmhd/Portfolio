import { useSyncExternalStore } from 'react';
import { readPrefs, subscribe, type Prefs } from './prefs';

/*
 * useSyncExternalStore requires a referentially stable snapshot - returning a
 * fresh object from readPrefs() on every call would loop forever. So the
 * snapshot is cached and only re-read when a change event fires.
 */

let cache: Prefs | null = null;

function invalidate(): void {
  cache = null;
}

function getSnapshot(): Prefs {
  if (cache === null) cache = readPrefs();
  return cache;
}

// Server render always sees defaults; the inline boot script has already
// applied the real values to <html> by the time React hydrates, and the first
// client snapshot picks them up.
const SERVER_SNAPSHOT: Prefs = {
  theme: 'light',
  palette: 'sky',
  largerText: false,
  highContrast: false,
  plain: false,
};

function getServerSnapshot(): Prefs {
  return SERVER_SNAPSHOT;
}

function subscribeAndInvalidate(fn: () => void): () => void {
  return subscribe(() => {
    invalidate();
    fn();
  });
}

export function usePrefs(): Prefs {
  return useSyncExternalStore(
    subscribeAndInvalidate,
    getSnapshot,
    getServerSnapshot,
  );
}
