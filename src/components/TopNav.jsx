export default function TopNav({ onToggleMenu, uiOpen }) {
  return (
    <header className="top-nav">
      <div className="brand">
        <span className="brand-mark">H</span>
        <span className="brand-name">HUMAN MACHINE</span>
      </div>
      
      <button className="mobile-menu-btn" onClick={onToggleMenu}>
        {uiOpen ? 'Close UI' : 'Controls'}
      </button>

      <div className="top-nav-right">
        <span className="status-dot" />
        <span className="status-text">Anatomical Explorer</span>
      </div>
    </header>
  );
}