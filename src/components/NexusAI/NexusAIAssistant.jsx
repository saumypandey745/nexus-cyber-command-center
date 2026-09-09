import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Bot, Cpu, Sparkles, Zap, RefreshCw, Target } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

const AI_RESPONSES = [
  'NETWORK TOPOLOGY APPEARS STABLE. NO INTRUSION SIGNATURES DETECTED.',
  'ANOMALY DETECTED ON PORT 4433 — MONITORING PACKET STREAM.',
  'SIGNAL STRENGTH OPTIMAL ACROSS ALL TRACKED NODES.',
  'QUANTUM ENCRYPTION HANDSHAKE VALIDATED // MATRIX SECURE.',
  'PASSIVE SCAN RUNNING — 248 NODES IN ACTIVE STATE.',
  'DEEP LEARNING MODEL: THREAT PROBABILITY AT 0.3%. SYSTEM CLEAN.',
  'SATELLITE LINK QUALITY: 98.7% — DATA STREAM SYNCHRONIZED.',
  'BIOMETRIC PROFILE PROCESSING — NO ANOMALIES FLAGGED.',
  'NEXUS CORE SELF-DIAGNOSTICS: ALL SUBSYSTEMS NOMINAL.',
  'PATTERN RECOGNITION ENGINE: NO HOSTILE SIGNATURES IN RANGE.',
];

const AI_QUICK_ACTIONS = [
  { label: 'DEEP SCAN', icon: Target, action: 'deepScan' },
  { label: 'ANALYZE', icon: Cpu, action: 'analyze' },
  { label: 'REFRESH AI', icon: RefreshCw, action: 'refresh' },
  { label: 'BOOST', icon: Zap, action: 'boost' },
];

export function NexusAIAssistant() {
  const { logs, threatLevel, triggerDeepAnalysis, triggerAreaScan, addLog, addNotification } = useSimulation();
  const canvasRef = useRef(null);
  const [aiMessage, setAiMessage] = useState(AI_RESPONSES[0]);
  const [isThinking, setIsThinking] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);

  const aiLogs = logs.filter((l) => l.type === 'NEXUS_AI' || l.type === 'SECURITY').slice(-2);

  // Cycle AI messages every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * AI_RESPONSES.length);
      setAiMessage(AI_RESPONSES[idx]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // AI Waveform Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrame;
    let phase = 0;

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);

      const numBars = 28;
      const barWidth = Math.floor(width / numBars) - 2;
      phase += isThinking ? 0.18 : 0.06;

      for (let i = 0; i < numBars; i++) {
        const amplitude = isThinking ? 0.9 : 0.65;
        const barHeight = Math.abs(Math.sin(phase + i * 0.4)) * (height * amplitude) + 3;
        const x = i * (barWidth + 2);
        const y = (height - barHeight) / 2;

        const isHot = threatLevel === 'CRITICAL' || threatLevel === 'HIGH';
        if (isHot) {
          ctx.fillStyle = i % 3 === 0 ? '#ff0055' : '#ff6600';
        } else if (isThinking) {
          ctx.fillStyle = i % 2 === 0 ? '#00f0ff' : '#a855f7';
        } else {
          ctx.fillStyle = i % 2 === 0 ? '#00f0ff' : '#00ff66';
        }
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      animationFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrame);
  }, [threatLevel, isThinking]);

  const handleAction = useCallback((action) => {
    setIsThinking(true);
    setPulseCount(c => c + 1);

    switch (action) {
      case 'deepScan':
        addLog('NEXUS AI: DEEP SCAN SEQUENCE INITIATED', 'info', 'NEXUS_AI');
        setAiMessage('DEEP SCAN RUNNING — ANALYZING ALL FREQUENCY BANDS...');
        triggerDeepAnalysis();
        setTimeout(() => {
          setAiMessage('DEEP SCAN COMPLETE — NETWORK INTEGRITY: 99.2%');
          setIsThinking(false);
        }, 6000);
        break;

      case 'analyze':
        addLog('NEXUS AI: FULL SPECTRUM ANALYSIS INITIATED', 'info', 'NEXUS_AI');
        setAiMessage('ANALYZING... CORRELATING BIOMETRIC SIGNATURES...');
        triggerAreaScan('100M');
        setTimeout(() => {
          const resp = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
          setAiMessage(resp);
          setIsThinking(false);
        }, 2000);
        break;

      case 'refresh':
        addLog('NEXUS AI: NEURAL ENGINE RESET — RECALIBRATING...', 'info', 'NEXUS_AI');
        setAiMessage('RESETTING NEURAL ENGINE...');
        addNotification('AI ENGINE RECALIBRATED', 'success');
        setTimeout(() => {
          setAiMessage('NEXUS AI ONLINE — ALL SYSTEMS NOMINAL.');
          setIsThinking(false);
        }, 1500);
        break;

      case 'boost':
        addLog('NEXUS AI: PERFORMANCE BOOST ENABLED // TURBO MODE', 'success', 'NEXUS_AI');
        setAiMessage('TURBO MODE ACTIVE — PROCESSING AT 8x SPEED...');
        addNotification('AI TURBO MODE ENABLED', 'info');
        setTimeout(() => {
          setAiMessage('BOOST COMPLETE — THREAT PREDICTION ACCURACY: 99.7%');
          setIsThinking(false);
        }, 2000);
        break;

      default:
        setIsThinking(false);
    }
  }, [addLog, addNotification, triggerDeepAnalysis, triggerAreaScan]);

  return (
    <div className="cyber-panel" style={{ padding: '10px 12px', gap: '8px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-header)', fontSize: '11px', color: 'var(--electric-cyan)', fontWeight: 700 }}>
          <Bot size={14} color="var(--electric-cyan)" />
          <span>NEXUS AI ASSISTANT</span>
        </div>
        <span className={`cyber-badge ${isThinking ? 'cyber-badge-amber' : (threatLevel === 'CRITICAL' ? 'cyber-badge-red' : 'cyber-badge-green')}`}>
          {isThinking ? 'PROCESSING' : (threatLevel === 'CRITICAL' ? 'DEFENSE' : 'ONLINE')}
        </span>
      </div>

      {/* Waveform Display */}
      <div style={{
        height: '32px',
        backgroundColor: 'rgba(2, 6, 12, 0.95)',
        borderRadius: '2px',
        border: `1px solid ${isThinking ? 'rgba(168, 85, 247, 0.4)' : 'rgba(0, 240, 255, 0.15)'}`,
        overflow: 'hidden',
        transition: 'border-color 0.3s ease'
      }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      </div>

      {/* AI Commentary */}
      <div style={{
        fontSize: '10px',
        fontFamily: 'var(--font-mono)',
        color: 'var(--neon-green)',
        backgroundColor: 'rgba(3, 8, 16, 0.8)',
        padding: '5px 8px',
        borderRadius: '2px',
        border: '1px solid rgba(0, 240, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        minHeight: '28px'
      }}>
        <Sparkles size={10} style={{ flexShrink: 0 }} />
        <span>{isThinking ? '...' : aiMessage}</span>
      </div>

      {/* Quick Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
        {AI_QUICK_ACTIONS.map(({ label, icon: Icon, action }) => (
          <button
            key={action}
            className="cyber-btn"
            onClick={() => handleAction(action)}
            disabled={isThinking}
            style={{
              justifyContent: 'center',
              padding: '4px 2px',
              fontSize: '9px',
              flexDirection: 'column',
              gap: '2px',
              opacity: isThinking ? 0.5 : 1,
              cursor: isThinking ? 'not-allowed' : 'pointer'
            }}
          >
            <Icon size={11} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
