import { useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';

export function useKeyboardShortcuts() {
  const { 
    setFocusedModule, focusedModule, triggerAreaScan, toggleFx, 
    autoDemo, setAutoDemo, setActiveMode, activeMode 
  } = useSimulation();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore key shortcuts if focus is inside text input or textarea
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || document.activeElement?.isContentEditable) {
        return;
      }

      const key = e.key.toUpperCase();

      switch (key) {
        case 'F':
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          } else if (document.exitFullscreen) {
            document.exitFullscreen();
          }
          break;

        case 'T':
          setFocusedModule(focusedModule === 'terminal' ? null : 'terminal');
          break;

        case 'R':
          setFocusedModule(focusedModule === 'radar' ? null : 'radar');
          break;

        case 'A':
          triggerAreaScan('100M');
          break;

        case 'M':
          toggleFx('matrixRain');
          break;

        case 'G':
          toggleFx('glitchMode');
          break;

        case 'S':
          toggleFx('soundEnabled');
          break;

        case 'D':
          setAutoDemo(!autoDemo);
          break;

        case 'ESCAPE':
          setFocusedModule(null);
          if (activeMode !== 'NORMAL') {
            setActiveMode('NORMAL');
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedModule, setFocusedModule, triggerAreaScan, toggleFx, autoDemo, setAutoDemo, activeMode, setActiveMode]);
}
