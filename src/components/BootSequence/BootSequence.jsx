import React, { useState, useEffect, useRef } from 'react';
import { Shield, Terminal as TerminalIcon, Cpu, Zap, Lock, Eye } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

const BOOT_STAGES = [
  { text: 'INITIALIZING NEXUS QUANTUM CORE...', type: 'system', duration: 400 },
  { text: 'LOADING ENCRYPTED KERNEL MODULES...', type: 'module', duration: 380 },
  { text: 'CALIBRATING VISUAL INTELLIGENCE ENGINE...', type: 'ai', duration: 420 },
  { text: 'ESTABLISHING SECURE NEURAL NETWORK...', type: 'network', duration: 350 },
  { text: 'SYNCING GLOBAL SIGNAL MATRIX...', type: 'signal', duration: 390 },
  { text: 'ACTIVATING THREAT MONITOR v7.4.1...', type: 'security', duration: 360 },
  { text: 'MOUNTING COMMAND TERMINAL INTERFACE...', type: 'terminal', duration: 340 },
  { text: '██ NEXUS COMMAND CENTER ONLINE ██', type: 'complete', duration: 600 },
];

const TYPE_COLORS = {
  system: '#00e5ff',
  module: '#00e5ff',
  ai: '#bf00ff',
  network: '#3d6fff',
  signal: '#00ff88',
  security: '#ffb300',
  terminal: '#00e5ff',
  complete: '#00ff88',
};

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 3}s`,
  duration: `${2 + Math.random() * 3}s`,
  size: `${1 + Math.random() * 2}px`,
  color: ['#00e5ff', '#00ff88', '#bf00ff', '#3d6fff'][Math.floor(Math.random() * 4)],
}));

export function BootSequence({ onComplete }) {
  const { sound, fxSettings } = useSimulation();
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [displayedLines, setDisplayedLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const [hexStream, setHexStream] = useState('');
  const [binaryRain, setBinaryRain] = useState('');
  const [glitch, setGlitch] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [logoPhase, setLogoPhase] = useState(0);
  const terminalRef = useRef(null);

  // Logo reveal phases
  useEffect(() => {
    const t1 = setTimeout(() => setLogoPhase(1), 200);
    const t2 = setTimeout(() => setLogoPhase(2), 600);
    const t3 = setTimeout(() => { setLogoPhase(3); setShowLogo(true); }, 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // Hex stream
  useEffect(() => {
    const chars = '0123456789ABCDEF';
    const hexInterval = setInterval(() => {
      let str = '';
      for (let i = 0; i < 32; i++) {
        if (i > 0 && i % 8 === 0) str += ' ';
        str += chars[Math.floor(Math.random() * chars.length)];
      }
      setHexStream(str);
    }, 60);
    return () => clearInterval(hexInterval);
  }, []);

  // Binary rain
  useEffect(() => {
    const binInterval = setInterval(() => {
      let str = '';
      for (let i = 0; i < 48; i++) str += Math.random() > 0.5 ? '1' : '0';
      setBinaryRain(str);
    }, 80);
    return () => clearInterval(binInterval);
  }, []);

  // Boot stage progression
  useEffect(() => {
    if (currentStageIndex < BOOT_STAGES.length) {
      const stage = BOOT_STAGES[currentStageIndex];
      const timeout = setTimeout(() => {
        if (Math.random() > 0.7) {
          setGlitch(true);
          setTimeout(() => setGlitch(false), 100);
        }
        setDisplayedLines(prev => [...prev, { ...stage, index: currentStageIndex }]);
        setCurrentStageIndex(prev => prev + 1);
        setProgress(Math.round(((currentStageIndex + 1) / BOOT_STAGES.length) * 100));
        sound.playTypingSound?.();
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      }, stage.duration + Math.random() * 150);
      return () => clearTimeout(timeout);
    } else {
      sound.playSuccessSound?.();
      const finishTimeout = setTimeout(() => {
        if (onComplete) onComplete();
      }, 900);
      return () => clearTimeout(finishTimeout);
    }
  }, [currentStageIndex, sound, onComplete]);

  const isComplete = currentStageIndex >= BOOT_STAGES.length;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'radial-gradient(ellipse 80% 60% at 50% 40%, #020814 0%, #00010a 100%)',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-mono)',
      color: 'var(--electric-cyan)',
      padding: '20px',
      overflow: 'hidden',
    }}>
      {/* Floating particles */}
      {PARTICLES.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: p.left,
          bottom: '-10px',
          width: p.size,
          height: p.size,
          borderRadius: '50%',
          background: p.color,
          boxShadow: `0 0 6px ${p.color}`,
          animation: `floatUp ${p.duration} ${p.delay} ease-in infinite`,
          pointerEvents: 'none',
          opacity: 0.6,
        }} />
      ))}

      {/* Grid background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,229,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,229,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      {/* Radial glow orb center */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        animation: 'ambientGlow 4s ease-in-out infinite alternate',
      }} />

      {/* ─── LOGO SECTION ─── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '32px',
        opacity: logoPhase >= 1 ? 1 : 0,
        transform: logoPhase >= 1 ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {/* Hexagonal shield emblem */}
        <div style={{
          position: 'relative',
          width: '100px',
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Outer ring */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '1px solid rgba(0,229,255,0.3)',
            animation: 'hexSpin 8s linear infinite',
            backgroundImage: 'conic-gradient(from 0deg, transparent 0%, rgba(0,229,255,0.4) 25%, transparent 50%, rgba(0,255,136,0.4) 75%, transparent 100%)',
          }} />
          {/* Middle ring */}
          <div style={{
            position: 'absolute',
            inset: '8px',
            borderRadius: '50%',
            border: '1px solid rgba(0,255,136,0.2)',
            animation: 'hexSpin 5s linear infinite reverse',
          }} />
          {/* Inner glow orb */}
          <div style={{
            position: 'absolute',
            inset: '20px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,229,255,0.15) 0%, transparent 70%)',
            boxShadow: '0 0 30px rgba(0,229,255,0.3), 0 0 60px rgba(0,229,255,0.1)',
          }} />
          <Shield
            size={40}
            color="#00e5ff"
            style={{
              filter: 'drop-shadow(0 0 12px rgba(0,229,255,0.8)) drop-shadow(0 0 25px rgba(0,229,255,0.4))',
              position: 'relative',
              zIndex: 2,
            }}
          />
        </div>

        {/* Title */}
        <div style={{
          opacity: logoPhase >= 2 ? 1 : 0,
          transform: logoPhase >= 2 ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.95)',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.3s',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontFamily: 'var(--font-header)',
            fontSize: '28px',
            letterSpacing: '6px',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #fff 0%, #00e5ff 40%, #00ff88 70%, #fff 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'edgeFlow 4s linear infinite',
            textShadow: 'none',
            marginBottom: '4px',
          }}>
            NEXUS
          </h1>
          <div style={{
            fontFamily: 'var(--font-header)',
            fontSize: '13px',
            letterSpacing: '8px',
            color: 'rgba(0, 229, 255, 0.7)',
            fontWeight: 400,
            textShadow: '0 0 15px rgba(0,229,255,0.5)',
          }}>
            // CYBER COMMAND //
          </div>
        </div>

        {/* Subtitle badge */}
        <div style={{
          opacity: logoPhase >= 3 ? 1 : 0,
          transition: 'opacity 0.5s ease 0.6s',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 16px',
          background: 'rgba(0,229,255,0.06)',
          border: '1px solid rgba(0,229,255,0.2)',
          borderRadius: '2px',
          fontSize: '10px',
          color: 'var(--text-secondary)',
          letterSpacing: '2px',
        }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 6px #00ff88', animation: 'pulseGreen 2s infinite' }} />
          QUANTUM SECURE OS v5.0.0
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 6px #00ff88', animation: 'pulseGreen 2s infinite' }} />
        </div>
      </div>

      {/* ─── TERMINAL BOOT BOX ─── */}
      <div style={{
        width: '100%',
        maxWidth: '700px',
        opacity: logoPhase >= 3 ? 1 : 0,
        transform: logoPhase >= 3 ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.8s',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(3,10,24,0.97) 0%, rgba(2,6,16,0.95) 100%)',
          border: '1px solid rgba(0,229,255,0.2)',
          borderRadius: '4px',
          overflow: 'hidden',
          boxShadow: '0 0 0 1px rgba(0,229,255,0.05), 0 20px 80px rgba(0,0,0,0.8), 0 0 40px rgba(0,229,255,0.06)',
          filter: glitch ? 'hue-rotate(90deg) brightness(1.5)' : 'none',
          transition: 'filter 0.05s',
        }}>
          {/* Terminal titlebar */}
          <div style={{
            height: '32px',
            background: 'linear-gradient(90deg, rgba(0,229,255,0.1) 0%, rgba(0,229,255,0.03) 100%)',
            borderBottom: '1px solid rgba(0,229,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TerminalIcon size={13} color="var(--electric-cyan)" />
              <span style={{ fontFamily: 'var(--font-header)', fontSize: '9px', letterSpacing: '2px', color: 'var(--electric-cyan)' }}>
                NEXUS_BOOT_SHELL
              </span>
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['#ff003c', '#ffb300', '#00ff88'].map((c, i) => (
                <div key={i} style={{
                  width: '9px', height: '9px', borderRadius: '50%',
                  background: c, boxShadow: `0 0 6px ${c}`,
                }} />
              ))}
            </div>
          </div>

          {/* Terminal body */}
          <div ref={terminalRef} style={{
            padding: '14px',
            minHeight: '200px',
            maxHeight: '240px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
          }}>
            {displayedLines.map((line, idx) => (
              <div key={idx} className="fade-slide-up" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '12px',
              }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '10px', flexShrink: 0, letterSpacing: '1px' }}>
                  [{String(idx + 1).padStart(2, '0')}]
                </span>
                <span style={{ color: 'rgba(0,229,255,0.4)', fontSize: '10px', flexShrink: 0 }}>
                  SYS:
                </span>
                <span style={{
                  color: line.type === 'complete' && isComplete
                    ? '#00ff88'
                    : TYPE_COLORS[line.type] || 'var(--electric-cyan)',
                  textShadow: `0 0 10px ${TYPE_COLORS[line.type] || 'rgba(0,229,255,0.5)'}`,
                  fontWeight: line.type === 'complete' ? 700 : 400,
                  letterSpacing: line.type === 'complete' ? '2px' : '0.5px',
                  animation: line.type === 'complete' ? 'glowPulseGreen 2s infinite' : 'none',
                }}>
                  {line.text}
                </span>
                {idx === displayedLines.length - 1 && !isComplete && (
                  <span className="blinking-cursor" />
                )}
                {line.type === 'complete' && isComplete && (
                  <span style={{
                    marginLeft: '6px',
                    color: '#00ff88',
                    fontSize: '10px',
                    animation: 'glowPulseGreen 1.5s infinite',
                  }}>✓</span>
                )}
              </div>
            ))}
          </div>

          {/* Bottom data stream */}
          <div style={{
            borderTop: '1px solid rgba(0,229,255,0.1)',
            padding: '6px 14px',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '9px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            background: 'rgba(0,0,0,0.3)',
            gap: '8px',
          }}>
            <span style={{ color: 'rgba(0,229,255,0.4)' }}>HEX: <span style={{ color: 'rgba(0,255,136,0.5)', letterSpacing: '1px' }}>{hexStream}</span></span>
            <span style={{ color: 'rgba(0,229,255,0.4)' }}>BIN: <span style={{ color: 'rgba(0,229,255,0.3)' }}>{binaryRain.slice(0, 20)}...</span></span>
            <span style={{ color: 'rgba(0,229,255,0.4)' }}>MEM: <span style={{ color: 'rgba(0,255,136,0.6)' }}>64.0GB OK</span></span>
          </div>
        </div>

        {/* ─── PROGRESS BAR ─── */}
        <div style={{ marginTop: '16px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '10px',
            marginBottom: '8px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', letterSpacing: '1.5px' }}>
              <Cpu size={11} color="var(--electric-cyan)" />
              BOOT SEQUENCE
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '9px' }}>
                STAGE {Math.min(currentStageIndex, BOOT_STAGES.length)}/{BOOT_STAGES.length}
              </span>
              <span style={{
                fontFamily: 'var(--font-header)',
                fontSize: '13px',
                fontWeight: 900,
                color: isComplete ? 'var(--neon-green)' : 'var(--electric-cyan)',
                textShadow: isComplete ? '0 0 12px var(--neon-green-glow)' : '0 0 12px var(--electric-cyan-glow)',
              }}>
                {progress}%
              </span>
            </div>
          </div>

          {/* Progress track */}
          <div style={{
            width: '100%',
            height: '6px',
            background: 'rgba(0,229,255,0.06)',
            border: '1px solid rgba(0,229,255,0.12)',
            borderRadius: '3px',
            overflow: 'visible',
            position: 'relative',
          }}>
            {/* Segmented ticks */}
            {BOOT_STAGES.map((_, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: `${((i + 1) / BOOT_STAGES.length) * 100}%`,
                top: '-2px',
                width: '1px',
                height: '10px',
                background: 'rgba(0,229,255,0.15)',
                zIndex: 2,
              }} />
            ))}
            {/* Fill */}
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: isComplete
                ? 'linear-gradient(90deg, #00ff88, #00e5ff)'
                : 'linear-gradient(90deg, #00e5ff, #3d6fff, #00ff88)',
              borderRadius: '3px',
              boxShadow: isComplete
                ? '0 0 16px var(--neon-green-glow), 0 0 30px rgba(0,255,136,0.2)'
                : '0 0 12px var(--electric-cyan-glow), 0 0 25px rgba(0,229,255,0.2)',
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              animation: 'progressPulse 1.5s ease-in-out infinite',
              position: 'relative',
            }}>
              {/* Leading sparkle */}
              <div style={{
                position: 'absolute',
                right: '-2px',
                top: '-4px',
                width: '4px',
                height: '14px',
                background: 'white',
                borderRadius: '2px',
                boxShadow: '0 0 10px white, 0 0 20px white',
                opacity: isComplete ? 0 : 0.9,
              }} />
            </div>
          </div>

          {/* Stage labels row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '6px',
            fontSize: '8px',
            color: 'var(--text-muted)',
            letterSpacing: '0.5px',
          }}>
            <span>INIT</span>
            <span>MODULES</span>
            <span>NETWORK</span>
            <span>THREAT</span>
            <span>ONLINE</span>
          </div>
        </div>

        {/* Completion message */}
        {isComplete && (
          <div className="fade-slide-up" style={{
            marginTop: '16px',
            textAlign: 'center',
            padding: '10px',
            background: 'rgba(0,255,136,0.06)',
            border: '1px solid rgba(0,255,136,0.2)',
            borderRadius: '3px',
            fontSize: '11px',
            color: 'var(--neon-green)',
            letterSpacing: '2px',
            fontWeight: 700,
            animation: 'glowPulseGreen 1.5s ease-in-out infinite',
          }}>
            <Zap size={12} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            ALL SYSTEMS NOMINAL — ENTERING COMMAND CENTER
            <Zap size={12} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
          </div>
        )}
      </div>
    </div>
  );
}
