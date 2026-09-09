import React, { useState, useEffect } from 'react';
import { Camera, Eye, RefreshCw, AlertCircle, ShieldAlert } from 'lucide-react';

const CAMERAS = [
  { id: 'CAM_01', name: 'MAIN VAULT - LEVEL 3', status: 'LIVE', location: 'ZURICH, CH', fps: 30, signal: '98%' },
  { id: 'CAM_02', name: 'SERVER RACK CORE', status: 'LIVE', location: 'TOKYO, JP', fps: 60, signal: '99%' },
  { id: 'CAM_03', name: 'SATELLITE DISH ARRAY', status: 'LIVE', location: 'NEVADA, US', fps: 24, signal: '94%' },
  { id: 'CAM_04', name: 'BIOMETRIC AIRLOCK', status: 'LIVE', location: 'LONDON, UK', fps: 30, signal: '96%' },
];

export function SurveillanceFeed() {
  const [activeCamIndex, setActiveCamIndex] = useState(0);
  const [glitch, setGlitch] = useState(false);
  const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const t = setInterval(() => setTimestamp(new Date().toLocaleTimeString()), 1000);
    const g = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
    }, 4000);
    return () => { clearInterval(t); clearInterval(g); };
  }, []);

  const cam = CAMERAS[activeCamIndex];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#000',
      fontFamily: 'var(--font-mono)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top Camera Controls */}
      <div style={{
        padding: '6px 10px',
        background: 'rgba(0, 255, 102, 0.08)',
        borderBottom: '1px solid rgba(0, 255, 102, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '9px',
      }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {CAMERAS.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => setActiveCamIndex(idx)}
              style={{
                padding: '2px 6px',
                background: activeCamIndex === idx ? '#00ff66' : 'rgba(0, 240, 255, 0.05)',
                border: `1px solid ${activeCamIndex === idx ? '#00ff66' : 'rgba(0, 240, 255, 0.2)'}`,
                color: activeCamIndex === idx ? '#000' : '#00f0ff',
                fontWeight: 800,
                fontSize: '8px',
                cursor: 'pointer',
                borderRadius: '2px',
              }}
            >
              {c.id}
            </button>
          ))}
        </div>
        <div style={{ color: '#00ff66', fontWeight: 800, textShadow: '0 0 8px #00ff66' }}>
          ● LIVE FEED ({cam.fps} FPS)
        </div>
      </div>

      {/* Camera Viewport Canvas Simulation */}
      <div style={{
        flex: 1,
        position: 'relative',
        background: 'radial-gradient(circle, #052614 0%, #00040a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        filter: glitch ? 'invert(0.8) hue-rotate(90deg)' : 'none',
      }}>
        {/* Night vision green scanlines */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'repeating-linear-gradient(0deg, rgba(0,255,102,0.06), rgba(0,255,102,0.06) 1px, transparent 1px, transparent 3px)',
          pointerEvents: 'none',
        }} />

        {/* HUD Crosshairs & Target Box */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(0,255,102,0.2)" strokeDasharray="4 4" />
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(0,255,102,0.2)" strokeDasharray="4 4" />
          <rect x="35%" y="30%" width="30%" height="40%" fill="none" stroke="#00ff66" strokeWidth="1" strokeDasharray="6 4" />
        </svg>

        {/* Camera overlay text */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          fontSize: '10px',
          color: '#00ff66',
          fontWeight: 800,
          textShadow: '0 0 10px #00ff66',
        }}>
          <div>REC 🔴 [{timestamp}]</div>
          <div style={{ color: '#00f0ff', marginTop: '2px' }}>{cam.name} • {cam.location}</div>
        </div>

        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          fontSize: '9px',
          color: 'var(--text-muted)',
          textAlign: 'right',
        }}>
          <div>SIGNAL STRENGTH: <span style={{ color: '#00ff66' }}>{cam.signal}</span></div>
          <div>ENCRYPTION: <span style={{ color: '#00f0ff' }}>AES-256-GCM</span></div>
        </div>

        {/* Center Target Lock Indicator */}
        <div style={{
          textAlign: 'center',
          color: '#00ff66',
          fontFamily: 'var(--font-header)',
          letterSpacing: '2px',
        }}>
          <div style={{ fontSize: '24px', animation: 'glowPulseGreen 1.5s infinite' }}>[ ⌖ ]</div>
          <div style={{ fontSize: '9px', fontWeight: 800, marginTop: '4px' }}>TARGET LOCKED // NO MOTION DETECTED</div>
        </div>
      </div>
    </div>
  );
}
