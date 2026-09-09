import React, { useRef, useEffect, useState } from 'react';
import { Radio, Maximize2, RefreshCw } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export function CentralRadar() {
  const { nodes, systemMetrics, setFocusedModule, focusedModule, triggerAreaScan } = useSimulation();
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let sweepAngle = 0;

    const render = () => {
      // Handle High-DPI Canvas resolution
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 2 - 25;

      if (radius <= 0) return;

      // 1. Draw Background Concentric Radar Rings
      ctx.lineWidth = 1;
      const ringSteps = [0.25, 0.5, 0.75, 1.0];
      ringSteps.forEach((step, idx) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * step, 0, Math.PI * 2);
        ctx.strokeStyle = idx === ringSteps.length - 1 ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 240, 255, 0.12)';
        ctx.stroke();
      });

      // 2. Draw Crosshairs & Degree Cardinal Lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.beginPath();
      ctx.moveTo(centerX - radius, centerY);
      ctx.lineTo(centerX + radius, centerY);
      ctx.moveTo(centerX, centerY - radius);
      ctx.lineTo(centerX, centerY + radius);
      ctx.stroke();

      // Diagonal cross lines
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.beginPath();
      ctx.moveTo(centerX - radius * 0.7, centerY - radius * 0.7);
      ctx.lineTo(centerX + radius * 0.7, centerY + radius * 0.7);
      ctx.moveTo(centerX - radius * 0.7, centerY + radius * 0.7);
      ctx.lineTo(centerX + radius * 0.7, centerY - radius * 0.7);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Draw Rotating Radar Sweep Gradient Beam
      sweepAngle = (sweepAngle + 0.025) % (Math.PI * 2);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, sweepAngle - 0.4, sweepAngle, false);
      ctx.closePath();

      const sweepGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      sweepGradient.addColorStop(0, 'rgba(0, 255, 102, 0.3)');
      sweepGradient.addColorStop(1, 'rgba(0, 255, 102, 0.01)');
      ctx.fillStyle = sweepGradient;
      ctx.fill();

      // Main Sweep Front Line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + Math.cos(sweepAngle) * radius, centerY + Math.sin(sweepAngle) * radius);
      ctx.strokeStyle = '#00ff66';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // 4. Draw Inter-Node Connection Lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1X = centerX + nodes[i].x * radius;
          const n1Y = centerY + nodes[i].y * radius;
          const n2X = centerX + nodes[j].x * radius;
          const n2Y = centerY + nodes[j].y * radius;

          const dist = Math.hypot(n1X - n2X, n1Y - n2Y);
          if (dist < radius * 0.5) {
            ctx.beginPath();
            ctx.moveTo(n1X, n1Y);
            ctx.lineTo(n2X, n2Y);
            ctx.stroke();
          }
        }
      }

      // 5. Draw Dynamic Nodes & Pulse Rings
      nodes.forEach((node) => {
        const nx = centerX + node.x * radius;
        const ny = centerY + node.y * radius;

        // Angle between sweep beam and node
        const nodeAngle = Math.atan2(ny - centerY, nx - centerX);
        let angleDiff = sweepAngle - nodeAngle;
        while (angleDiff < 0) angleDiff += Math.PI * 2;
        while (angleDiff > Math.PI * 2) angleDiff -= Math.PI * 2;

        const isBlipped = angleDiff < 0.5;

        // Node Glow Ring
        ctx.beginPath();
        ctx.arc(nx, ny, isBlipped ? 8 : 4, 0, Math.PI * 2);
        ctx.fillStyle = node.status === 'ANALYZING' ? '#ffb700' : (node.encryption === 'UNENCRYPTED' ? '#ff0055' : '#00ff66');
        ctx.shadowColor = node.status === 'ANALYZING' ? '#ffb700' : (node.encryption === 'UNENCRYPTED' ? '#ff0055' : '#00ff66');
        ctx.shadowBlur = isBlipped ? 12 : 4;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Target Label
        if (isBlipped || selectedNode?.id === node.id) {
          ctx.font = '10px "Share Tech Mono"';
          ctx.fillStyle = '#00f0ff';
          ctx.fillText(`${node.id} (${node.signal}%)`, nx + 8, ny - 6);
        }
      });

      // 6. Draw HUD Ring Markings & Coordinates
      ctx.font = '9px "Share Tech Mono"';
      ctx.fillStyle = 'rgba(0, 240, 255, 0.5)';
      ctx.fillText('N', centerX - 3, centerY - radius - 6);
      ctx.fillText('S', centerX - 3, centerY + radius + 12);
      ctx.fillText('E', centerX + radius + 6, centerY + 3);
      ctx.fillText('W', centerX - radius - 14, centerY + 3);

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [nodes, selectedNode]);

  return (
    <div className="cyber-panel" style={{ height: '100%', flex: 1, minHeight: 0, position: 'relative' }}>
      {/* Panel Header */}
      <div className="cyber-panel-header">
        <div className="panel-title">
          <Radio size={14} color="var(--electric-cyan)" />
          <span>CENTRAL NEXUS VISUALIZER // RADAR HUD</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button 
            className="cyber-btn" 
            style={{ padding: '2px 6px', fontSize: '10px' }}
            onClick={() => triggerAreaScan('100M')}
            title="Pulse Radar Scan"
          >
            <RefreshCw size={11} />
          </button>
          <button 
            className="cyber-btn" 
            style={{ padding: '2px 6px', fontSize: '10px' }}
            onClick={() => setFocusedModule(focusedModule === 'radar' ? null : 'radar')}
            title="Focus Radar [R]"
          >
            <Maximize2 size={11} />
          </button>
        </div>
      </div>

      {/* Main Canvas Radar Container */}
      <div style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(2, 6, 12, 0.95)',
        overflow: 'hidden'
      }}>
        <canvas 
          ref={canvasRef} 
          style={{ width: '100%', height: '100%', display: 'block' }} 
        />

        {/* HUD Top Left Stats */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          pointerEvents: 'none'
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>SIGNAL STRENGTH: </span>
            <span style={{ color: 'var(--neon-green)', fontWeight: 700 }}>98.4%</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>ACTIVE NODES: </span>
            <span style={{ color: 'var(--electric-cyan)', fontWeight: 700 }}>{nodes.length} TRACKED</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>DATA FLOW: </span>
            <span style={{ color: '#fff' }}>{systemMetrics.dataFlow} MB/s</span>
          </div>
        </div>

        {/* HUD Bottom Right Stats */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '14px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '4px',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          pointerEvents: 'none'
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>NETWORK INTEGRITY: </span>
            <span style={{ color: 'var(--electric-cyan)', fontWeight: 700 }}>99.8%</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>LATENCY: </span>
            <span style={{ color: 'var(--neon-green)' }}>{systemMetrics.latency}ms</span>
          </div>
          <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
            FREQ: 5.8GHz // BAND: QUANTUM-7
          </div>
        </div>
      </div>
    </div>
  );
}
