import React, { useRef, useEffect } from 'react';
import { Radio, Wifi } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export function SatellitePanel() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrame;
    let angle = 0;

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const rx = width * 0.38;
      const ry = height * 0.35;

      // 1. Draw Central Node (Earth Satellite Uplink Hub)
      ctx.beginPath();
      ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // 2. Draw Elliptical Orbit Path
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, rx, ry, Math.PI / 8, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // 3. Draw Orbiting Satellite
      angle += 0.02;
      const satX = centerX + Math.cos(angle) * rx;
      const satY = centerY + Math.sin(angle) * ry;

      // Signal Beam from Satellite to Center
      ctx.beginPath();
      ctx.moveTo(satX, satY);
      ctx.lineTo(centerX, centerY);
      ctx.strokeStyle = 'rgba(0, 255, 102, 0.4)';
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Satellite Body
      ctx.beginPath();
      ctx.arc(satX, satY, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#00ff66';
      ctx.shadowColor = '#00ff66';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      animationFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="cyber-panel" style={{ padding: '10px 12px', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-header)', fontSize: '11px', color: 'var(--electric-cyan)', fontWeight: 700 }}>
          <Radio size={14} color="var(--electric-cyan)" />
          <span>SATELLITE DOWNLINK // NEXUS-SAT-04</span>
        </div>
        <span className="cyber-badge cyber-badge-green">
          LINK: ESTABLISHED
        </span>
      </div>

      {/* Orbit Canvas */}
      <div style={{
        height: '65px',
        backgroundColor: 'rgba(2, 6, 12, 0.95)',
        borderRadius: '2px',
        border: '1px solid rgba(0, 240, 255, 0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      </div>

      {/* Telemetry Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '6px',
        fontSize: '10px',
        color: 'var(--text-secondary)'
      }}>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>ALTITUDE: </span>
          <span style={{ color: '#fff' }}>35,786 KM</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>QUALITY: </span>
          <span style={{ color: 'var(--neon-green)' }}>94%</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>BAND: </span>
          <span style={{ color: 'var(--electric-cyan)' }}>KU-BAND</span>
        </div>
      </div>
    </div>
  );
}
