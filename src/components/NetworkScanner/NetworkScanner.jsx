import React, { useRef, useEffect } from 'react';
import { Activity, Wifi, HardDrive, Shield } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export function NetworkScanner() {
  const { systemMetrics } = useSimulation();
  const canvasRef = useRef(null);

  // Real-time Traffic Waveform Canvas Sparkline
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrame;
    let points = Array(50).fill(25);

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);

      // Shift points left and add new sample point based on live bandwidth
      points.shift();
      const targetVal = (systemMetrics.dataFlow / 1200) * (height - 10) + 5;
      const noise = (Math.random() * 8 - 4);
      points.push(Math.max(5, Math.min(height - 5, targetVal + noise)));

      ctx.beginPath();
      ctx.moveTo(0, height - points[0]);
      const step = width / (points.length - 1);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(i * step, height - points[i]);
      }

      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 6;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Fill area under line
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      const fillGrad = ctx.createLinearGradient(0, 0, 0, height);
      fillGrad.addColorStop(0, 'rgba(0, 240, 255, 0.2)');
      fillGrad.addColorStop(1, 'rgba(0, 240, 255, 0.0)');
      ctx.fillStyle = fillGrad;
      ctx.fill();

      animationFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrame);
  }, [systemMetrics.dataFlow]);

  return (
    <div className="cyber-panel" style={{ padding: '10px 12px', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-header)', fontSize: '11px', color: 'var(--electric-cyan)', fontWeight: 700 }}>
          <Activity size={14} color="var(--electric-cyan)" />
          <span>NETWORK MATRIX SCANNER</span>
        </div>
        <span className="cyber-badge cyber-badge-cyan">
          STABILITY: {systemMetrics.stability}%
        </span>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '6px',
        fontSize: '11px'
      }}>
        <div style={{ background: 'rgba(3, 8, 16, 0.8)', padding: '6px', borderRadius: '2px', border: '1px solid rgba(0, 240, 255, 0.1)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '9px' }}>ACTIVE NODES</div>
          <div style={{ color: 'var(--electric-cyan)', fontWeight: 700 }}>{systemMetrics.activeNodes}</div>
        </div>
        <div style={{ background: 'rgba(3, 8, 16, 0.8)', padding: '6px', borderRadius: '2px', border: '1px solid rgba(0, 240, 255, 0.1)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '9px' }}>DATA FLOW</div>
          <div style={{ color: 'var(--neon-green)', fontWeight: 700 }}>{systemMetrics.dataFlow} MB/s</div>
        </div>
        <div style={{ background: 'rgba(3, 8, 16, 0.8)', padding: '6px', borderRadius: '2px', border: '1px solid rgba(0, 240, 255, 0.1)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '9px' }}>LATENCY</div>
          <div style={{ color: '#fff', fontWeight: 700 }}>{systemMetrics.latency}ms</div>
        </div>
        <div style={{ background: 'rgba(3, 8, 16, 0.8)', padding: '6px', borderRadius: '2px', border: '1px solid rgba(0, 240, 255, 0.1)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '9px' }}>PACKETS</div>
          <div style={{ color: 'var(--cyber-purple)', fontWeight: 700 }}>{(systemMetrics.packetCount / 1000).toFixed(1)}k</div>
        </div>
      </div>

      {/* Real-time Traffic Waveform */}
      <div style={{
        height: '42px',
        backgroundColor: 'rgba(2, 6, 12, 0.95)',
        borderRadius: '2px',
        border: '1px solid rgba(0, 240, 255, 0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      </div>
    </div>
  );
}
