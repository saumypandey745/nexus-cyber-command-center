import React from 'react';

/**
 * BackgroundWatermark — High-tech central logo watermark & classified system title
 * Inspired by GeekPrank & Cyberpunk HUDs
 */
export function BackgroundWatermark() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 0.18,
      userSelect: 'none',
    }}>
      {/* Animated rotating cyber ring & skull emblem */}
      <div style={{ position: 'relative', width: '380px', height: '380px' }}>
        {/* Outer rotating ring */}
        <svg
          width="380"
          height="380"
          viewBox="0 0 400 400"
          style={{
            position: 'absolute',
            inset: 0,
            animation: 'radarSweep 25s linear infinite',
          }}
        >
          <circle cx="200" cy="200" r="190" fill="none" stroke="#00ff66" strokeWidth="1.5" strokeDasharray="12 8 4 8" />
          <circle cx="200" cy="200" r="160" fill="none" stroke="#00f0ff" strokeWidth="1" strokeDasharray="40 10 10 10" />
          <circle cx="200" cy="200" r="130" fill="none" stroke="#00ff66" strokeWidth="0.8" strokeDasharray="6 6" />
          <line x1="200" y1="0" x2="200" y2="400" stroke="#00f0ff" strokeWidth="0.5" strokeDasharray="4 4" />
          <line x1="0" y1="200" x2="400" y2="200" stroke="#00f0ff" strokeWidth="0.5" strokeDasharray="4 4" />
        </svg>

        {/* Center Cyber Emblem (Shield/Skull outline) */}
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          style={{
            position: 'absolute',
            top: '100px',
            left: '100px',
            filter: 'drop-shadow(0 0 20px #00ff66)',
          }}
        >
          {/* Shield outline */}
          <polygon points="50,5 90,25 90,65 50,95 10,65 10,25" fill="none" stroke="#00ff66" strokeWidth="2.5" />
          <polygon points="50,12 83,30 83,62 50,88 17,62 17,30" fill="none" stroke="#00f0ff" strokeWidth="1" />

          {/* Cyber Skull / Core Eye */}
          <circle cx="35" cy="42" r="8" fill="#00ff66" />
          <circle cx="65" cy="42" r="8" fill="#00ff66" />
          <polygon points="50,48 42,62 58,62" fill="#00f0ff" />
          <line x1="32" y1="72" x2="32" y2="80" stroke="#00ff66" strokeWidth="2" />
          <line x1="44" y1="72" x2="44" y2="82" stroke="#00ff66" strokeWidth="2" />
          <line x1="56" y1="72" x2="56" y2="82" stroke="#00ff66" strokeWidth="2" />
          <line x1="68" y1="72" x2="68" y2="80" stroke="#00ff66" strokeWidth="2" />
        </svg>
      </div>

      {/* Large Glowing Text Watermark */}
      <div style={{
        marginTop: '20px',
        textAlign: 'center',
        fontFamily: 'var(--font-header)',
        letterSpacing: '8px',
        textTransform: 'uppercase',
      }}>
        <div style={{
          fontSize: '28px',
          fontWeight: 900,
          color: '#00ff66',
          textShadow: '0 0 25px rgba(0,255,102,0.8), 0 0 50px rgba(0,255,102,0.4)',
        }}>
          NEXUS CYBER COMMAND
        </div>
        <div style={{
          fontSize: '12px',
          fontWeight: 700,
          color: '#00f0ff',
          letterSpacing: '6px',
          marginTop: '6px',
          textShadow: '0 0 15px rgba(0,240,255,0.7)',
        }}>
          CLASSIFIED // TOP SECRET // OMEGA CLEARANCE REQUIRED
        </div>
      </div>
    </div>
  );
}
