import { useState } from 'react';
import { usePrefs } from '../lib/usePrefs';

const STRIP =
  'CONTRAST · FOCUS ORDER · FORM SEMANTICS · KEYBOARD PARITY · SCREEN READER TESTING · PLAIN LANGUAGE · MOTION SETTINGS · ';

/**
 * Decorative ticker. aria-hidden because every term in it appears as real
 * content elsewhere on the site — nothing is only here.
 *
 * Two identical spans translate -50% together so the loop is seamless.
 */
export default function Marquee() {
  const { plain } = usePrefs();
  const [hovered, setHovered] = useState(false);

  // Plain layout removes decoration, so the strip goes entirely.
  if (plain) return null;

  const text = STRIP.repeat(2);

  return (
    <div
      className="marquee"
      aria-hidden="true"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="marquee-track"
        style={{ animationPlayState: hovered ? 'paused' : 'running' }}
      >
        <span className="marquee-run mono">{text}</span>
        <span className="marquee-run mono">{text}</span>
      </div>
    </div>
  );
}
