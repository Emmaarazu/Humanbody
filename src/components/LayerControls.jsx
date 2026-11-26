import { SYSTEM_COLORS, SYSTEM_LABELS } from '../data/anatomyData';

export default function LayerControls({ layers, onToggle }) {
  return (
    <aside className="layer-controls">
      <div className="panel-title">Layers</div>
      <div className="layer-list">
        {Object.entries(layers).map(([system, visible]) => (
          <label key={system} className="layer-row">
            <input
              type="checkbox"
              checked={visible}
              onChange={(e) => onToggle(system, e.target.checked)}
            />
            <span
              className="layer-swatch"
              style={{ background: SYSTEM_COLORS[system] }}
            />
            <span className="layer-name">
              {SYSTEM_LABELS[system] || system}
            </span>
          </label>
        ))}
      </div>
      <div className="attribution">
        Anatomy: BodyParts3D &copy; DBCLS, CC BY 4.0
      </div>
    </aside>
  );
}