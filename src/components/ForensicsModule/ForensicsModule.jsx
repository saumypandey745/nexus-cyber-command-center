import React, { useState, useEffect, useRef } from 'react';
import { Search, FileCode, Check, Cpu, Binary, Hash, Fingerprint } from 'lucide-react';

const STAGES = [
  { id: 'DS', name: 'DATA STRUCTURE ANALYSIS', icon: '◈', color: '#00e5ff', detail: 'Parsing binary structure...' },
  { id: 'MD', name: 'METADATA PROCESSING', icon: '◉', color: '#3d6fff', detail: 'Extracting EXIF headers...' },
  { id: 'SC', name: 'SIGNATURE COMPARISON', icon: '◎', color: '#bf00ff', detail: 'Cross-referencing 4.2M signatures...' },
  { id: 'PR', name: 'PATTERN RECOGNITION', icon: '◆', color: '#00ff88', detail: 'Neural pattern matching...' },
  { id: 'AD', name: 'ANOMALY DETECTION', icon: '◇', color: '#ffb300', detail: 'Behavioral analysis running...' },
  { id: 'FR', name: 'FORENSIC REPORT GEN', icon: '✦', color: '#ff003c', detail: 'Compiling evidence chain...' },
];

const RANDOM_HASHES = () => {
  const chars = '0123456789abcdef';
  return Array.from({ length: 3 }, () =>
    Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  );
};

export function ForensicsModule() {
  const [currentStage, setCurrentStage] = useState(0);
  const [stageProgress, setStageProgress] = useState(0);
  const [hashes, setHashes] = useState(RANDOM_HASHES());
  const [scanCount, setScanCount] = useState(0);
  const [completedStages, setCompletedStages] = useState(new Set());
  const [flash, setFlash] = useState(false);
  const progressRef = useRef(0);

  // Stage progress within each stage
  useEffect(() => {
    progressRef.current = 0;
    setStageProgress(0);

    const prog = setInterval(() => {
      progressRef.current += 2 + Math.random() * 3;
      if (progressRef.current >= 100) {
        progressRef.current = 100;
        setStageProgress(100);
        clearInterval(prog);
      } else {
        setStageProgress(progressRef.current);
      }
    }, 60);

    return () => clearInterval(prog);
  }, [currentStage]);

  // Advance stages
  useEffect(() => {
    const timer = setInterval(() => {
      setFlash(true);
      setTimeout(() => setFlash(false), 150);
      setCompletedStages(prev => new Set([...prev, currentStage]));
      setCurrentStage(prev => {
        if (prev >= STAGES.length - 1) {
          setScanCount(c => c + 1);
          setCompletedStages(new Set());
          return 0;
        }
        return prev + 1;
      });
    }, 2400);
    return () => clearInterval(timer);
  }, [currentStage]);

  // Hash stream
  useEffect(() => {
    const h = setInterval(() => setHashes(RANDOM_HASHES()), 120);
    return () => clearInterval(h);
  }, []);

  const stage = STAGES[currentStage];

  return (
    <div className="cyber-panel" style={{ padding: '0', flex: '0 0 auto' }}>
      <div className="cyber-panel-corner-tl" />
      <div className="cyber-panel-corner-tr" />
      <div className="cyber-panel-corner-bl" />
      <div className="cyber-panel-corner-br" />

      {/* Header */}
      <div className="cyber-panel-header">
        <div className="panel-title">
          <FileCode size={12} color="var(--electric-cyan)" style={{ filter: 'drop-shadow(0 0 6px rgba(0,229,255,0.8))' }} />
          <span>FORENSICS ENGINE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>SCAN #{String(scanCount).padStart(4, '0')}</span>
          <span className="cyber-badge cyber-badge-cyan">
            {currentStage + 1}/{STAGES.length}
          </span>
        </div>
      </div>

      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative', zIndex: 2 }}>
        {/* Current stage display */}
        <div style={{
          background: `linear-gradient(135deg, rgba(0,0,0,0.6) 0%, ${stage.color}08 100%)`,
          border: `1px solid ${stage.color}30`,
          borderRadius: '3px',
          padding: '8px 10px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          filter: flash ? 'brightness(1.5)' : 'none',
        }}>
          {/* Scan beam */}
          <div className="scan-beam" />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              fontSize: '18px',
              color: stage.color,
              textShadow: `0 0 12px ${stage.color}`,
              lineHeight: 1,
              animation: 'glowPulse 1.5s infinite',
            }}>
              {stage.icon}
            </span>
            <div>
              <div style={{
                fontSize: '10px',
                color: stage.color,
                fontWeight: 700,
                letterSpacing: '1.5px',
                textShadow: `0 0 10px ${stage.color}`,
                fontFamily: 'var(--font-header)',
              }}>
                {stage.name}
              </div>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.5px', marginTop: '2px' }}>
                {stage.detail}
              </div>
            </div>
          </div>

          {/* Stage progress bar */}
          <div style={{
            height: '3px',
            background: 'rgba(0,0,0,0.4)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${stageProgress}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${stage.color}80, ${stage.color})`,
              borderRadius: '2px',
              boxShadow: `0 0 8px ${stage.color}`,
              transition: 'width 0.08s linear',
            }} />
          </div>
        </div>

        {/* Stages pipeline */}
        <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
          {STAGES.map((s, i) => (
            <React.Fragment key={s.id}>
              <div
                title={s.name}
                style={{
                  flex: 1,
                  height: '5px',
                  borderRadius: '2px',
                  background: completedStages.has(i)
                    ? s.color
                    : i === currentStage
                      ? `${s.color}60`
                      : 'rgba(0,229,255,0.06)',
                  boxShadow: completedStages.has(i)
                    ? `0 0 6px ${s.color}`
                    : i === currentStage
                      ? `0 0 4px ${s.color}50`
                      : 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  animation: i === currentStage ? 'progressPulse 1s ease-in-out infinite' : 'none',
                }}
              />
              {i < STAGES.length - 1 && (
                <div style={{
                  width: '2px', height: '5px',
                  background: completedStages.has(i) ? 'rgba(255,255,255,0.2)' : 'rgba(0,229,255,0.08)',
                }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Live hash stream */}
        <div style={{
          background: 'rgba(0,0,0,0.5)',
          border: '1px solid rgba(0,229,255,0.08)',
          borderRadius: '2px',
          padding: '6px 8px',
          fontSize: '9px',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.5px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '8px', letterSpacing: '1px', marginBottom: '2px' }}>
            ▸ LIVE HASH STREAM
          </div>
          {hashes.map((h, i) => (
            <div key={i} style={{
              color: i === 0 ? '#00ff88' : i === 1 ? '#00e5ff' : 'rgba(0,229,255,0.3)',
              transition: 'color 0.1s',
              fontSize: '9px',
            }}>
              <span style={{ color: 'var(--text-muted)', marginRight: '4px' }}>{['MD5', 'SHA', 'HEX'][i]}:</span>
              {h}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
