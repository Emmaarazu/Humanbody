import { SYSTEM_DESCRIPTIONS, SYSTEM_LABELS } from '../data/anatomyData';

export default function InspectionPanel({ part, onReset }) {
  if (!part) {
    return (
      <aside className="inspection-panel empty">
        <div className="panel-title">Inspection</div>
        <p className="hint">Tap a structure on the body to inspect it.</p>
      </aside>
    );
  }

  const system = part.system;
  const description =
    SYSTEM_DESCRIPTIONS[system] || 'No description available.';

  return (
    <aside className="inspection-panel">
      <div className="panel-title">Inspection</div>
      <div className="part-system">{SYSTEM_LABELS[system] || system}</div>
      <h2 className="part-name">{part.name}</h2>
      <p className="part-desc">{description}</p>
      <div className="part-meta">
        <span>FMA {part.conceptId}</span>
      </div>
      <button className="reset-btn" onClick={onReset}>
        Reset selection
      </button>
    </aside>
  );
}