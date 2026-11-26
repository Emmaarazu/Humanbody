import { useCallback, useState } from 'react';
import Viewport from './components/Viewport';
import TopNav from './components/TopNav';
import AnatomicalNav from './components/AnatomicalNav';
import LayerControls from './components/LayerControls';
import InspectionPanel from './components/InspectionPanel';
import LoadingOverlay from './components/LoadingOverlay';
import MobileBottomSheet from './components/MobileBottomSheet';
import { ALL_SYSTEMS, NAV_PRESETS } from './data/anatomyData';

export default function App() {
  const [engine, setEngine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const [selectedPart, setSelectedPart] = useState(null);
  const [activeNav, setActiveNav] = useState('overview');
  const [layers, setLayers] = useState(
    Object.fromEntries(ALL_SYSTEMS.map((s) => [s, true]))
  );
  
  // Mobile UI state
  const [uiOpen, setUiOpen] = useState(false);
  const [isIsolated, setIsIsolated] = useState(false);

  const handleReady = useCallback(() => setLoading(false), []);
  const handleProgress = useCallback((p) => setProgress(p), []);
  const handleError = useCallback((msg) => {
    setError(msg);
    setLoading(false);
  }, []);

  const handleSelect = useCallback((part) => {
    setSelectedPart(part || null);
  }, []);

  const handleReset = useCallback(() => {
    setSelectedPart(null);
    setIsIsolated(false);
    engine?.resetSelection();
  }, [engine]);

  const handleLayerToggle = useCallback(
    (system, visible) => {
      setLayers((prev) => ({ ...prev, [system]: visible }));
      engine?.setLayerVisible(system, visible);
    },
    [engine]
  );

  const applyPreset = useCallback(
    (systemIds) => {
      const set = new Set(systemIds);
      const next = Object.fromEntries(
        ALL_SYSTEMS.map((s) => [s, set.has(s)])
      );
      setLayers(next);
      ALL_SYSTEMS.forEach((s) => engine?.setLayerVisible(s, set.has(s)));
    },
    [engine]
  );

  const handleNavigate = useCallback(
    (id) => {
      setActiveNav(id);
      setIsIsolated(false);
      engine?.resetSelection();
      setSelectedPart(null);
      const preset = NAV_PRESETS[id];
      if (preset) applyPreset(preset());
    },
    [applyPreset, engine]
  );

  const toggleIsolate = useCallback(() => {
    const next = !isIsolated;
    setIsIsolated(next);
    engine?.setIsolationMode(next, selectedPart?.system);
  }, [engine, isIsolated, selectedPart]);

  return (
    <div className={`app ${uiOpen ? 'ui-open' : ''}`}>
      <TopNav 
        onToggleMenu={() => setUiOpen(!uiOpen)} 
        uiOpen={uiOpen} 
      />
      
      <div className="main">
        <Viewport
          onReady={handleReady}
          onProgress={handleProgress}
          onError={handleError}
          onSelect={handleSelect}
          onEngineReady={setEngine}
        />

        <div className="ui-panels">
          <AnatomicalNav active={activeNav} onNavigate={handleNavigate} />
          <LayerControls layers={layers} onToggle={handleLayerToggle} />
        </div>

        <InspectionPanel 
          part={selectedPart} 
          onReset={handleReset} 
          onIsolate={toggleIsolate}
          isIsolated={isIsolated}
        />

        <MobileBottomSheet 
          part={selectedPart} 
          onReset={handleReset} 
          onIsolate={toggleIsolate}
          isIsolated={isIsolated}
        />
      </div>

      {loading && <LoadingOverlay progress={progress} />}
      {error && <LoadingOverlay error={error} />}
    </div>
  );
}