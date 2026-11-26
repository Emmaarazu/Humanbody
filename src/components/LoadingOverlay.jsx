export default function LoadingOverlay({ progress = 0, error }) {
  if (error) {
    return (
      <div className="loading-overlay">
        <div className="loading-card">
          <div className="loading-title">Unable to load anatomy</div>
          <p className="loading-msg">{error}</p>
          <button
            className="loading-action"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-overlay">
      <div className="loading-card">
        <div className="loading-title">Initialising Human Machine</div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
        <div className="loading-msg">
          Loading anatomical geometry… {Math.round(progress * 100)}%
        </div>
      </div>
    </div>
  );
}