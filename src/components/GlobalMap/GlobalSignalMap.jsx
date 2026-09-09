import React, { useRef, useEffect } from 'react';
import { Globe, Maximize2 } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

const GLOBAL_HUBS = [
  { name: 'TOKYO', x: 0.82, y: 0.38, status: 'ONLINE', ping: '12ms' },
  { name: 'LONDON', x: 0.48, y: 0.30, status: 'ONLINE', ping: '24ms' },
  { name: 'NEW YORK', x: 0.28, y: 0.35, status: 'ONLINE', ping: '18ms' },
  { name: 'FRANKFURT', x: 0.52, y: 0.29, status: 'ONLINE', ping: '28ms' },
  { name: 'SINGAPORE', x: 0.76, y: 0.56, status: 'ONLINE', ping: '32ms' },
  { name: 'SYDNEY', x: 0.88, y: 0.78, status: 'ONLINE', ping: '45ms' },
  { name: 'SAO PAULO', x: 0.35, y: 0.72, status: 'ONLINE', ping: '52ms' }
];

export function GlobalSignalMap() {
  const { setFocusedModule, focusedModule } = useSimulation();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrame;
    let arcProgress = 0;

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Draw World Grid Lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw Arc Connection Lines between Hubs
      arcProgress = (arcProgress + 0.01) % 1;
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.lineWidth = 1.5;

      for (let i = 0; i < GLOBAL_HUBS.length - 1; i++) {
        const h1 = GLOBAL_HUBS[i];
        const h2 = GLOBAL_HUBS[i + 1];
        const x1 = h1.x * width;
        const y1 = h1.y * height;
        const x2 = h2.x * width;
        const y2 = h2.y * height;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo((x1 + x2) / 2, (y1 + y2) / 2 - 30, x2, y2);
        ctx.stroke();

        // Particle packet moving along arc
        const pX = (1 - arcProgress) * x1 + arcProgress * x2;
        const pY = (1 - arcProgress) * y1 + arcProgress * y2 - Math.sin(arcProgress * Math.PI) * 30;

        ctx.beginPath();
        ctx.arc(pX, pY, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#00ff66';
        ctx.shadowColor = '#00ff66';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 3. Draw Global Hub Points
      GLOBAL_HUBS.forEach((hub) => {
        const hX = hub.x * width;
        const hY = hub.y * height;

        // Pulse ring
        ctx.beginPath();
        ctx.arc(hX, hY, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label
        ctx.font = '9px "Share Tech Mono"';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(hub.name, hX + 8, hY + 3);
      });

      animationFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="cyber-panel" style={{ height: '100%', flex: 1, minHeight: 0 }}>
      {/* Panel Header */}
      <div className="cyber-panel-header">
        <div className="panel-title">
          <Globe size={14} color="var(--electric-cyan)" />
          <span>GLOBAL SIGNAL MAP // NETWORK ARCS</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button 
            className="cyber-btn" 
            style={{ padding: '2px 6px', fontSize: '10px' }}
            onClick={() => setFocusedModule(focusedModule === 'map' ? null : 'map')}
            title="Focus Global Map [M]"
          >
            <Maximize2 size={11} />
          </button>
        </div>
      </div>

      {/* Map Canvas Viewport */}
      <div style={{
        flex: 1,
        backgroundColor: 'rgba(2, 6, 12, 0.95)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '10px',
          fontSize: '9px',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)'
        }}>
          LAT: 35.6762° N | LON: 139.6503° E // MESH-NET: ONLINE
        </div>
      </div>
    </div>
  );
}
