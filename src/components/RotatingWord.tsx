import { useEffect, useState } from 'react';

/*
 * Assistive tech first, then the ordinary conditions everyone designs around
 * badly, a tired brain, a split attention, a second language, bad signal -
 * then the thing the market is scrambling to get right. 'everyone' stays last
 * because it is the claim the rest of the list has to earn.
 */
const WORDS = [
  'keyboard users',
  'screen readers',
  'low vision',
  'tired brains',
  'divided attention',
  'second languages',
  'one bar of signal',
  'AI you can question',
  'everyone',
];
const INTERVAL_MS = 2600;

/**
 * "Designing for < word >", cycling.
 *
 * aria-live="polite" so the change is announced without interrupting, and the
 * interval is never scheduled at all under reduced motion, stopping the CSS
 * animation would not stop the text from changing underneath someone.
 */
export default function RotatingWord() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = window.setInterval(
      () => setI((n) => (n + 1) % WORDS.length),
      INTERVAL_MS,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <p className="rotator">
      Designing for{' '}
      <span className="rotator-brackets mono">
        &lt;
        <span className="rotator-word" aria-live="polite">
          {WORDS[i]}
        </span>
        &gt;
      </span>
    </p>
  );
}
