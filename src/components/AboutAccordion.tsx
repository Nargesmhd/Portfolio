import { useId, useState } from 'react';
import { routes } from '../lib/routes';

const EXPERIENCES = [
  ['Apple', 'Solutions Consultant', '2026,'],
  ['Freelance', 'Product design & accessibility remediation', '2022,'],
  ['nibbit.ai', 'Product Designer', '2023,24'],
];

const SKILLS = [
  ['01', 'WCAG 2.2 conformance'],
  ['02', 'Behavioural research'],
  ['03', 'Product road mapping'],
  ['04', 'Design documentation'],
];

/**
 * Three paper strips. Two expand in place; the third is a link, so it is an
 * anchor rather than a button with a fake destination.
 */
export default function AboutAccordion() {
  const [expOpen, setExpOpen] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const base = useId();
  const expId = `${base}-exp`;
  const skillsId = `${base}-skills`;

  return (
    <div className="strips">
      <button
        type="button"
        className="strip"
        aria-expanded={expOpen}
        aria-controls={expId}
        onClick={() => setExpOpen((v) => !v)}
      >
        <span>Experiences</span>
        <span className="strip-hint">{expOpen ? 'close −' : 'tap to view +'}</span>
      </button>

      <div id={expId} className="strip-panel" hidden={!expOpen}>
        <dl className="exp-grid">
          {EXPERIENCES.map(([org, role, years]) => (
            <div key={org} className="exp-row">
              <dt>{org}</dt>
              <dd>{role}</dd>
              <dd className="exp-years mono">{years}</dd>
            </div>
          ))}
        </dl>
      </div>

      <button
        type="button"
        className="strip strip--accent"
        aria-expanded={skillsOpen}
        aria-controls={skillsId}
        onClick={() => setSkillsOpen((v) => !v)}
      >
        <span>Skillsets</span>
        <span className="strip-hint">
          {skillsOpen ? 'close −' : 'tap to view +'}
        </span>
      </button>

      <div id={skillsId} className="strip-panel" hidden={!skillsOpen}>
        <ol className="skills">
          {SKILLS.map(([num, label]) => (
            <li key={num}>
              <span className="skills-num mono">{num}</span>
              <span className="skills-label">{label}</span>
            </li>
          ))}
        </ol>
      </div>

      <a className="strip" href={routes.about}>
        <span>Profile</span>
        <span className="strip-hint">read more →</span>
      </a>
    </div>
  );
}
