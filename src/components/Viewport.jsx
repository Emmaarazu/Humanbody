import { useEffect, useRef } from 'react';
import { SceneManager } from '../engine/SceneManager';

export default function Viewport({
  onReady,
  onProgress,
  onError,
  onSelect,
  onEngineReady,
}) {
  const ref = useRef(null);
  const callbacksRef = useRef({ onReady, onProgress, onError, onSelect });
  callbacksRef.current = { onReady, onProgress, onError, onSelect };

  useEffect(() => {
    if (!ref.current) return;
    const engine = new SceneManager(ref.current, {
      onReady: () => callbacksRef.current.onReady?.(),
      onProgress: (p) => callbacksRef.current.onProgress?.(p),
      onError: (e) => callbacksRef.current.onError?.(e),
      onSelect: (part) => callbacksRef.current.onSelect?.(part),
    });
    onEngineReady?.(engine);
    engine.load();

    return () => {
      engine.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={ref} className="viewport" />;
}