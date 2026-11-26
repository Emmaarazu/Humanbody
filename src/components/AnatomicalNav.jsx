import { NAV_SECTIONS } from '../data/anatomyData';

export default function AnatomicalNav({ active, onNavigate }) {
  return (
    <nav className="anatomical-nav">
      <div className="panel-title">Systems</div>
      <ul>
        {NAV_SECTIONS.map((s) => (
          <li key={s.id}>
            <button
              className={`nav-btn ${active === s.id ? 'active' : ''} ${
                !s.available ? 'disabled' : ''
              }`}
              onClick={() => s.available && onNavigate(s.id)}
              disabled={!s.available}
              title={s.comingSoon ? 'Coming soon' : s.label}
            >
              <span className="nav-dot" />
              <span className="nav-label-text">{s.label}</span>
              {s.comingSoon && <span className="badge">Soon</span>}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}