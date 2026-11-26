import { useEffect, useState } from 'react';
import { SYSTEM_DESCRIPTIONS, SYSTEM_LABELS } from '../data/anatomyData';

export default function MobileBottomSheet({ part, onReset, onIsolate, isIsolated }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!part) setOpen(false);
  }, [part]);

  if (!part) return null;

  const system = part.system;
  const description = SYSTEM_DESCRIPTIONS[system] || 'No description available.';

  return (
    <div className={`mobile-sheet ${open ? 'open' : ''}`}>
      <button className="sheet-handle" onClick={() => setOpen((v) => !v)}>
        {open ? 'Close' : `Inspect — ${part.name}`}
      </button>
      {open && (
        <div className="sheet-content">
          <div className="part-system">{SYSTEM_LABELS[system] || system}</div>
          <h2 className="part-name">{part.name}</h2>
          <p className="part-desc">{description}</p>
          
          <div className="panel-actions">
            <button 
              className={`action-btn ${isIsolated ? 'active' : ''}`} 
              onClick={onIsolate}
            >
              {isIsolated ? 'Show All' : 'Isolate'}
            </button>
            <button className="action-btn reset" onClick={onReset}>
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}