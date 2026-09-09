import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, CornerDownLeft, Maximize2, Trash2 } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export function CommandTerminal() {
  const { 
    logs, addLog, clearLogs, triggerAreaScan, triggerDeepAnalysis, 
    triggerSystemOverride, setBootCompleted, setAutoDemo, autoDemo,
    toggleFx, setFocusedModule, focusedModule, setActiveMode, sound
  } = useSimulation();

  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom on log updates
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    sound.playTypingSound();

    // Add command to log & command history
    addLog(`> ${trimmed}`, 'command', 'INPUT');
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);
    setInputVal('');

    const args = trimmed.toLowerCase().split(' ');
    const mainCmd = args[0];

    switch (mainCmd) {
      case 'help':
      case '?':
        addLog('--- NEXUS COMMAND TERMINAL HELP ---', 'info', 'HELP');
        addLog('scan [radius]  - Run area signal scan (25, 50, 100, 250, 500)', 'info', 'HELP');
        addLog('analyze        - Initiate Deep Analysis Sequence', 'info', 'HELP');
        addLog('override       - Trigger System Override Simulation', 'info', 'HELP');
        addLog('radar          - Pulse Central Radar sweep', 'info', 'HELP');
        addLog('status         - Output complete system matrix status', 'info', 'HELP');
        addLog('clear          - Clear terminal viewport', 'info', 'HELP');
        addLog('boot           - Replay cinematic boot sequence', 'info', 'HELP');
        addLog('demo           - Toggle automated demo mode', 'info', 'HELP');
        addLog('matrix / crt   - Toggle Matrix Rain / CRT overlay', 'info', 'HELP');
        addLog('panic          - Toggle Minimal Display Mode', 'info', 'HELP');
        break;

      case 'clear':
        clearLogs();
        break;

      case 'scan':
        const radius = (args[1] || '100').toUpperCase() + (args[1]?.includes('m') ? '' : 'M');
        triggerAreaScan(radius);
        break;

      case 'analyze':
        triggerDeepAnalysis();
        break;

      case 'override':
        triggerSystemOverride();
        break;

      case 'radar':
        addLog('RADAR SWEEP PULSED // ACTIVE TARGET MATRIX RE-INDEXED', 'success', 'RADAR');
        sound.playRadarPing();
        break;

      case 'status':
        addLog('=== NEXUS SYSTEM DIAGNOSTICS ===', 'info', 'STATUS');
        addLog('CORE ENGINE: 100% OPERATIONAL', 'success', 'STATUS');
        addLog('ACTIVE NODES: 248 TRACKED', 'info', 'STATUS');
        addLog('DATA FLOW: 842 MB/s | LATENCY: 12ms', 'info', 'STATUS');
        addLog('ENCRYPTION MATRIX: QUANTUM-SHIELD ACTIVE', 'success', 'STATUS');
        break;

      case 'boot':
        setBootCompleted(false);
        break;

      case 'demo':
        setAutoDemo(!autoDemo);
        addLog(`AUTO-DEMO MODE ${!autoDemo ? 'ENABLED' : 'DISABLED'}`, 'warning', 'DEMO');
        break;

      case 'matrix':
        toggleFx('matrixRain');
        break;

      case 'crt':
        toggleFx('crtMode');
        break;

      case 'panic':
        setActiveMode('MINIMAL');
        break;

      default:
        // Simulated intelligent response for custom inputs
        const hex = Math.random().toString(16).substring(2, 8).toUpperCase();
        addLog(`> PARSING INPUT VECTOR: "${trimmed}"`, 'info', 'EXEC');
        addLog(`> VECTOR PARSED // HASH: 0x${hex} // MATRIX RESPONSE OK`, 'success', 'EXEC');
        break;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    }
  };

  const getLogColor = (level) => {
    switch (level) {
      case 'command': return '#ffffff';
      case 'success': return 'var(--neon-green)';
      case 'warning': return 'var(--warning-amber)';
      case 'critical': return 'var(--alert-red)';
      default: return 'var(--electric-cyan)';
    }
  };

  return (
    <div className="cyber-panel" style={{ height: '100%', flex: 1, minHeight: 0 }}>
      {/* Panel Header */}
      <div className="cyber-panel-header">
        <div className="panel-title">
          <TerminalIcon size={14} color="var(--electric-cyan)" />
          <span>COMMAND TERMINAL // NEXUS SHELL</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button 
            className="cyber-btn" 
            style={{ padding: '2px 6px', fontSize: '10px' }}
            onClick={clearLogs} 
            title="Clear logs"
          >
            <Trash2 size={11} />
          </button>
          <button 
            className="cyber-btn" 
            style={{ padding: '2px 6px', fontSize: '10px' }}
            onClick={() => setFocusedModule(focusedModule === 'terminal' ? null : 'terminal')}
            title="Focus Terminal [T]"
          >
            <Maximize2 size={11} />
          </button>
        </div>
      </div>

      {/* Terminal Viewport */}
      <div 
        style={{
          flex: 1,
          padding: '10px 12px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          backgroundColor: 'rgba(3, 8, 16, 0.9)'
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {logs.map((log) => (
          <div key={log.id} style={{ display: 'flex', gap: '8px', lineHeight: '1.4' }}>
            <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>[{log.timestamp}]</span>
            <span style={{ color: 'var(--text-secondary)', flexShrink: 0, fontWeight: 600 }}>
              [{log.type}]
            </span>
            <span style={{ color: getLogColor(log.level), wordBreak: 'break-all' }}>
              {log.text}
            </span>
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Input Bar */}
      <div style={{
        height: '34px',
        borderTop: '1px solid var(--border-cyan)',
        backgroundColor: 'rgba(6, 15, 28, 0.95)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
        gap: '8px'
      }}>
        <span style={{ color: 'var(--neon-green)', fontWeight: 700, fontSize: '12px' }}>
          NEXUS@CMD:~#
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type command ('help', 'scan 100', 'analyze')..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#fff',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px'
          }}
        />
        <CornerDownLeft size={13} color="var(--text-muted)" />
      </div>
    </div>
  );
}
