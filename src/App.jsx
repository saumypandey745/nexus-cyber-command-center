import React from 'react';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { BootSequence } from './components/BootSequence/BootSequence';
import { SystemHeader } from './components/Header/SystemHeader';
import { CommandTerminal } from './components/Terminal/CommandTerminal';
import { CentralRadar } from './components/Radar/CentralRadar';
import { AreaScanner } from './components/AreaScanner/AreaScanner';
import { DeviceMatrix } from './components/DeviceMatrix/DeviceMatrix';
import { NetworkScanner } from './components/NetworkScanner/NetworkScanner';
import { NexusAIAssistant } from './components/NexusAI/NexusAIAssistant';
import { ThreatMonitor } from './components/ThreatMonitor/ThreatMonitor';
import { SecurityMonitor } from './components/SecurityMonitor/SecurityMonitor';
import { GlobalSignalMap } from './components/GlobalMap/GlobalSignalMap';
import { SatellitePanel } from './components/SatellitePanel/SatellitePanel';
import { CameraGrid } from './components/CameraGrid/CameraGrid';
import { BiometricVisualizer } from './components/BiometricVisualizer/BiometricVisualizer';
import { ForensicsModule } from './components/ForensicsModule/ForensicsModule';
import { EncryptionVisualizer } from './components/EncryptionVisualizer/EncryptionVisualizer';
import { LiveEventFeed } from './components/EventFeed/LiveEventFeed';
import { NotificationCenter } from './components/Notifications/NotificationCenter';
import { MatrixRainCanvas } from './components/Overlays/MatrixRainCanvas';
import { DeepAnalysisModal } from './components/Modes/DeepAnalysisModal';
import { SystemOverrideModal } from './components/Modes/SystemOverrideModal';
import { MinimalModeView } from './components/Modes/MinimalModeView';
import { WindowManager } from './components/FloatingWindows/WindowManager';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

import './styles/globals.css';
import './styles/themes.css';
import './styles/crt.css';
import './styles/glitch.css';

function MainDashboard() {
  const { bootCompleted, setBootCompleted, fxSettings, glitchTrigger, focusedModule, currentTheme } = useSimulation();
  useKeyboardShortcuts();

  if (!bootCompleted) {
    return <BootSequence onComplete={() => setBootCompleted(true)} />;
  }

  return (
    <div 
      data-theme={currentTheme}
      className={glitchTrigger ? 'glitch-screen-active' : ''}
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-primary)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* === DECORATIVE OVERLAYS (pointer-events: none, never block clicks) === */}
      <MatrixRainCanvas />
      {/* CRT Scanline Effect - separate div, never parent of interactive content */}
      {fxSettings.crtMode && (
        <div
          className="crt-overlay crt-flicker"
          style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9990 }}
        />
      )}

      {/* === FUNCTIONAL OVERLAYS (high z-index, conditionally shown) === */}
      <NotificationCenter />
      <DeepAnalysisModal />
      <SystemOverrideModal />
      <MinimalModeView />

      {/* === FLOATING WINDOW SYSTEM (NEXUS OS) === */}
      <WindowManager />

      {/* 1. Header Bar */}
      <SystemHeader />

      {/* 2. Multi-Panel Main Grid Viewport */}
      <main style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: focusedModule ? '1fr' : '28% 44% 28%',
        gap: '8px',
        padding: '8px',
        minHeight: 0,
        overflow: 'hidden',
        position: 'relative',
        zIndex: 10
      }}>
        {/* LEFT COLUMN: Terminal & Area Scanner */}
        {(!focusedModule || focusedModule === 'terminal' || focusedModule === 'scanner') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '100%', minHeight: 0 }}>
            <AreaScanner />
            <CommandTerminal />
          </div>
        )}

        {/* CENTER COLUMN: Central Radar & Global Map */}
        {(!focusedModule || focusedModule === 'radar' || focusedModule === 'map') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '100%', minHeight: 0 }}>
            <CentralRadar />
            <div style={{ height: '36%', display: 'flex', gap: '8px' }}>
              <GlobalSignalMap />
              <SatellitePanel />
            </div>
          </div>
        )}

        {/* RIGHT COLUMN: Device Matrix & Visual Modules */}
        {(!focusedModule || focusedModule === 'matrix' || focusedModule === 'security') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '100%', minHeight: 0 }}>
            <ThreatMonitor />
            <NexusAIAssistant />
            <NetworkScanner />
            <DeviceMatrix />
          </div>
        )}
      </main>

      {/* 3. Live Bottom Event Feed */}
      <LiveEventFeed />
    </div>
  );
}

export default function App() {
  return (
    <SimulationProvider>
      <MainDashboard />
    </SimulationProvider>
  );
}
