import React, { useRef, useEffect } from 'react';
import { Eye, Video } from 'lucide-react';

const FEEDS = [
  { id: 'CAM-01', label: 'GRID ALPHA', status: 'ACTIVE' },
  { id: 'CAM-02', label: 'PERIMETER', status: 'STABLE' },
  { id: 'CAM-03', label: 'SERVER VAULT', status: 'ANALYZING' },
  { id: 'CAM-04', label: 'SATELLITE DOWNLINK', status: 'STANDBY' }
];

function CameraFeed({ feed }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrame;

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);

      // Digital static noise
      const imgData = ctx.createImageData(width, height);
      for (let i = 0; i < imgData.data.length; i += 4) {
        const val = Math.random() * 25;
        imgData.data[i] = val * 0.2;     // R
        imgData.data[i + 1] = val * 0.8; // G
        imgData.data[i + 2] = val * 1.0; // B
        imgData.data[i + 3] = 255;       // Alpha
      }
      ctx.putImageData(imgData, 0, 0);

      // Wireframe target box animation
      const time = Date.now() * 0.002;
      const bX = (Math.sin(time) * 0.25 + 0.5) * width - 20;
      const bY = (Math.cos(time * 0.7) * 0.2 + 0.5) * height - 20;

      ctx.strokeStyle = feed.status === 'ANALYZING' ? '#ffb700' : '#00ff66';
      ctx.lineWidth = 1;
      ctx.strokeRect(bX, bY, 40, 40);

      // Target Corner notches
      ctx.fillStyle = '#00ff66';
      ctx.font = '8px "Share Tech Mono"';
      ctx.fillText('TARGET_LOCK', bX, bY - 4);

      animationFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrame);
  }, [feed]);

  return (
    <div style={{
      position: 'relative',
      backgroundColor: '#020509',
      border: '1px solid rgba(0, 240, 255, 0.2)',
      borderRadius: '2px',
      overflow: 'hidden',
      height: '90px'
    }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

      {/* Feed Label Header */}
      <div style={{
        position: 'absolute',
        top: '4px',
        left: '6px',
        right: '6px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '9px',
        fontFamily: 'var(--font-mono)',
        color: '#fff',
        pointerEvents: 'none'
      }}>
        <span style={{ color: 'var(--electric-cyan)', fontWeight: 700 }}>{feed.id} // {feed.label}</span>
        <span style={{ color: feed.status === 'ACTIVE' ? 'var(--neon-green)' : 'var(--warning-amber)' }}>
          ● {feed.status}
        </span>
      </div>
    </div>
  );
}

export function CameraGrid() {
  return (
    <div className="cyber-panel" style={{ padding: '10px 12px', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-header)', fontSize: '11px', color: 'var(--electric-cyan)', fontWeight: 700 }}>
          <Video size={14} color="var(--electric-cyan)" />
          <span>SURVEILLANCE CAMERA MATRIX</span>
        </div>
        <span className="cyber-badge cyber-badge-cyan">
          4 FEEDS SYNCED
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
        {FEEDS.map((feed) => (
          <CameraFeed key={feed.id} feed={feed} />
        ))}
      </div>
    </div>
  );
}
