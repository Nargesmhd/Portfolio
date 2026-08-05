/*
 * The five wireframe sheets, reproduced as they were drawn.
 *
 * These are deliberately low-fidelity: they are evidence of the process, not
 * UI. The orange notes are the point - each one records the accessibility
 * reasoning behind a decision on that screen.
 *
 * Everything here is decorative-adjacent but readable, so it stays real text
 * rather than an image: a screen reader gets the reasoning too.
 */

export function HomeSheet() {
  return (
    <div className="wf-sheet">
      <div className="wf-crumb">Narges Mirheydari</div>
      <div className="wf-crumb">home · works · about · access · contact</div>

      <div className="wf-title wf-title--big">
        Works <span style={{ color: '#8a8a8a' }}>Archive</span>
      </div>

      <div className="wf-sub">
        Product designer in Toronto - behavioural research + WCAG, for the
        people most products forget
      </div>

      <p className="wf-note">
        19 words, real sentence - recruiters scan. plain language is an
        accessibility feature too (WCAG 3.1)
      </p>

      <div className="wf-row">
        <div className="wf-folder wf-folder--accent">
          01 accessibility
          <span>audits + remediation, freelance 2022– · 4 audits, 2 redesigns</span>
        </div>
        <div className="wf-folder">
          02 product
          <span>nibbit.ai 2023–24 · keyboard parity rebuild</span>
        </div>
        <div className="wf-folder">03 research</div>
        <div className="wf-folder">04 archive</div>
      </div>

      <p className="wf-note">
        folders = your 4 buckets, yellow first - it's the thesis. black-on-yellow
        ≈ 12:1 contrast, and each folder is ONE link (one tab stop, not five)
      </p>

      <div className="wf-sub">
        about strips: experiences / skillsets / profile ↓ (accordion)
      </div>

      <div className="wf-row">
        <div className="wf-strip">EXPERIENCES - tap to view</div>
        <div className="wf-strip wf-strip--accent">SKILLSETS - tap to view</div>
        <div className="wf-strip">PROFILE - open by default</div>
      </div>

      <p className="wf-note wf-note--right">
        reading tabs (Aa / ◐ / ≡) on the right edge - real buttons with
        aria-pressed, ≥44px, they remember your choice
      </p>
    </div>
  );
}

export function CaseSheet() {
  return (
    <div className="wf-sheet">
      <div className="wf-crumb">
        works / 01 accessibility /{' '}
        <span style={{ color: '#333', fontWeight: 600 }}>audit-01</span>
      </div>

      <div className="wf-title">
        nibbit.ai: giving keyboard users the same path as mouse users
      </div>

      <p className="wf-note">
        title = the outcome, not the project name - screen-reader users hear it
        out of context in a headings list
      </p>

      <div className="wf-row wf-row--4">
        <div className="wf-box">Product Designer (solo)</div>
        <div className="wf-box">Jan 2023 – Nov 2024</div>
        <div className="wf-box">early-stage startup</div>
        <div className="wf-box">WCAG 2.2 AA target</div>
      </div>

      <div className="wf-img" style={{ height: 120 }}>
        before/after of the core flow - with full alt text, not "image1"
      </div>

      <div className="wf-row">
        <div className="wf-bar">
          problem{' '}
          <span>
            - tab order followed the DOM, not the visual flow; keyboard users hit
            dead ends
          </span>
        </div>
        <div className="wf-bar">
          process{' '}
          <span>
            - audit every stop → rebuild in screen-reader order → test with
            VoiceOver + NVDA
          </span>
        </div>
        <div className="wf-bar">
          outcome{' '}
          <span>
            - every mouse path got a keyboard twin; shipped across the consumer
            app
          </span>
        </div>
      </div>

      <p className="wf-note">
        3 numbers max, all verifiable - inflated metrics read as
        inaccessible-to-truth. these are yours:
      </p>

      <div className="wf-metrics">
        <div>
          23 mo<span>on the product</span>
        </div>
        <div>
          100%<span>keyboard coverage</span>
        </div>
        <div>
          2<span>screen readers tested</span>
        </div>
      </div>

      <div className="wf-foot">
        <span>← back to folder</span>
        <span>next file →</span>
      </div>
    </div>
  );
}

export function AboutSheet() {
  return (
    <div className="wf-sheet">
      <div className="wf-title wf-title--big">
        About <span style={{ color: '#8a8a8a' }}>me</span>
      </div>

      <div className="wf-row wf-row--2">
        <div className="wf-img" style={{ height: 130 }}>
          photo
        </div>
        <div className="wf-sub">
          Honours BSc Cognitive Science &amp; Psychology, UofT. Solutions
          Consultant at Apple. Persian &amp; English. Product design diploma,
          Shomal University.
        </div>
      </div>

      <div className="wf-strip">EXPERIENCES</div>

      <div className="wf-row">
        <div className="wf-box">Apple · Solutions Consultant · 2026–</div>
        <div className="wf-box">nibbit.ai · Product Designer · 2023–24</div>
        <div className="wf-box">Freelance · Design + a11y · 2022–</div>
      </div>

      <div className="wf-strip wf-strip--accent">SKILLSETS</div>

      <div className="wf-box">
        01 WCAG conformance · 02 behavioural research · 03 road mapping · 04
        documentation
      </div>

      <div className="wf-crumb">
        narges.mirheydari@gmail.com · /in/nargesmirheydari · github/Nargesmhd
      </div>

      <p className="wf-note">
        ↑ same paper-strip pattern as home - consistent landmarks mean
        screen-reader users learn the layout once
      </p>
    </div>
  );
}

export function AccessSheet() {
  return (
    <div className="wf-sheet">
      <div className="wf-title">How this site is built</div>

      <div className="wf-sub">
        "This site targets WCAG 2.2 AA. Last self-audit: July 2026. Every page,
        both themes."
      </div>

      <p className="wf-note">
        this page IS your differentiator - a11y teams WILL check it. claim only
        what you measured
      </p>

      <div className="wf-row wf-row--2">
        <div className="wf-box">
          body contrast <b>11.4:1</b>
        </div>
        <div className="wf-box">
          hit targets <b>≥44px</b>
        </div>
        <div className="wf-box">
          keyboard path <b>complete</b>
        </div>
        <div className="wf-box">
          screen readers <b>VO · NVDA</b>
        </div>
      </div>

      <div className="wf-row wf-row--4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="wf-strip">Aa text</div>
        <div className="wf-strip">◐ contrast</div>
        <div className="wf-strip">≡ plain</div>
      </div>

      <p className="wf-note">
        ↑ live demo of the reading tabs - larger text bumps base size 18→22px,
        plain layout drops decoration, not content
      </p>

      <div className="wf-bar">
        "Found a barrier? Email me - I'll reply within 3 days." (mailto link)
      </div>

      <p className="wf-note">
        3 days is a promise you can keep - a broken a11y promise is worse than
        none
      </p>
    </div>
  );
}

export function PlaySheet() {
  return (
    <div className="wf-sheet">
      <div className="wf-title wf-title--big">Playground</div>

      <div className="wf-sub">
        explorations + concept shots · pins 1–4 = real tab order
      </div>

      <p className="wf-note">
        unfinished is fine - label each with what you learned. pins make focus
        order visible: the page teaches a11y by showing it
      </p>

      <div className="wf-pins">
        <div className="wf-pin">
          <b>1</b>contrast experiments - theme pairs
        </div>
        <div className="wf-pin">
          <b>2</b>nibbit onboarding, unshipped round
        </div>
        <div className="wf-pin">
          <b>3</b>cog-sci note: attention is a budget - every extra control
          spends it
        </div>
        <div className="wf-pin">
          <b>4</b>focus-order sketches, on paper
        </div>
      </div>

      <div className="wf-sub">start a convo:</div>

      <div className="wf-row wf-row--2">
        <div className="wf-strip">"how do you audit?"</div>
        <div className="wf-strip">"cog sci + design?"</div>
        <div className="wf-strip">"the nibbit rebuild"</div>
      </div>

      <p className="wf-note">
        chips open a pre-filled email - one action, no form to fail. forms are
        where accessibility usually breaks
      </p>
    </div>
  );
}
