import { useEffect, useState } from 'react';

const WORDS = ['keyboard users', 'screen readers', 'low vision', 'everyone'];
const INTERVAL_MS = 2600;

/**
 * "Designing for < word >", cycling.
 *
 * aria-live="polite" so the change is announced without interrupting, and the
 * interval is never scheduled at all under reduced motion — stopping the CSS
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
