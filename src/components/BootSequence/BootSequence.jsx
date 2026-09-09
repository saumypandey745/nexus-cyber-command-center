import React, { useState, useEffect } from 'react';
import { Shield, Terminal as TerminalIcon, Cpu, Zap } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

const BOOT_STAGES = [
  'INITIALIZING NEXUS CORE...',
  'LOADING SYSTEM MODULES...',
  'CALIBRATING VISUAL INTELLIGENCE ENGINE...',
  'STARTING SIGNAL ANALYSIS...',
  'CONNECTING SIMULATION NETWORK...',
  'LOADING THREAT MONITOR...',
  'ACTIVATING COMMAND TERMINAL...',
  'SYSTEM ONLINE'
];

export function BootSequence({ onComplete }) {
  const { sound, fxSettings } = useSimulation();
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [displayedLines, setDisplayedLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const [hexStream, setHexStream] = useState('');

  // Random hex stream generator
  useEffect(() => {
    const hexInterval = setInterval(() => {
      const chars = '0123456789ABCDEF';
      let str = '0x';
      for (let i = 0; i < 16; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
      }
      setHexStream(str);
    }, 80);
    return () => clearInterval(hexInterval);
  }, []);

  // Progression through boot stages
  useEffect(() => {
    if (currentStageIndex < BOOT_STAGES.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => [...prev, BOOT_STAGES[currentStageIndex]]);
        setCurrentStageIndex((prev) => prev + 1);
        setProgress(Math.round(((currentStageIndex + 1) / BOOT_STAGES.length) * 100));
        sound.playTypingSound();
      }, 350 + Math.random() * 250);

      return () => clearTimeout(timeout);
    } else {
      sound.playSuccessSound();
      const finishTimeout = setTimeout(() => {
        if (onComplete) onComplete();
      }, 800);
      return () => clearTimeout(finishTimeout);
    }
  }, [currentStageIndex, sound, onComplete]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: '#020509',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-mono)',
      color: 'var(--electric-cyan)',
      padding: '20px'
    }}>
      {/* Background glowing logo */}
      <div style={{
        marginBottom: '30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          position: 'relative',
          padding: '20px',
          borderRadius: '50%',
          border: '2px solid var(--electric-cyan)',
          boxShadow: '0 0 30px var(--electric-cyan-glow)',
          animation: 'pulse-green 2s infinite'
        }}>
          <Shield size={56} color="var(--electric-cyan)" />
        </div>
        <h1 style={{
          fontFamily: 'var(--font-header)',
          fontSize: '24px',
          letterSpacing: '4px',
          fontWeight: 900,
          color: '#fff',
          textShadow: '0 0 12px var(--electric-cyan-glow)'
        }}>
          NEXUS // CYBER COMMAND
        </h1>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', letterSpacing: '2px' }}>
          CYBER OPERATIONS OPERATING SYSTEM v4.9.0
        </div>
      </div>

      {/* Boot Terminal Box */}
      <div style={{
        width: '100%',
        maxWidth: '650px',
        height: '240px',
        backgroundColor: 'rgba(6, 15, 28, 0.95)',
        border: '1px solid var(--border-cyan)',
        boxShadow: '0 0 25px rgba(0, 240, 255, 0.15)',
        borderRadius: '4px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          {displayedLines.map((line, idx) => (
            <div key={idx} style={{
              fontSize: '13px',
              color: idx === displayedLines.length - 1 && currentStageIndex === BOOT_STAGES.length ? 'var(--neon-green)' : 'var(--electric-cyan)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ color: 'var(--text-muted)' }}>[SYS_INIT]</span>
              <span>{line}</span>
              {idx === displayedLines.length - 1 && <span className="blinking-cursor" />}
            </div>
          ))}
        </div>

        {/* Live Hex Stream Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: 'var(--text-muted)',
          borderTop: '1px solid var(--border-cyan)',
          paddingTop: '8px',
          marginTop: '8px'
        }}>
          <span>HASH: {hexStream}</span>
          <span>MEM: 64.0GB OK</span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div style={{
        width: '100%',
        maxWidth: '650px',
        marginTop: '20px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          marginBottom: '6px',
          color: 'var(--text-secondary)'
        }}>
          <span>CORE BOOT PROGRESS</span>
          <span style={{ color: 'var(--neon-green)', fontWeight: 700 }}>{progress}%</span>
        </div>

        <div style={{
          width: '100%',
          height: '10px',
          backgroundColor: 'rgba(0, 240, 255, 0.1)',
          border: '1px solid var(--border-cyan)',
          borderRadius: '2px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: progress === 100 ? 'var(--neon-green)' : 'var(--electric-cyan)',
            boxShadow: `0 0 10px ${progress === 100 ? 'var(--neon-green-glow)' : 'var(--electric-cyan-glow)'}`,
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>
    </div>
  );
}
