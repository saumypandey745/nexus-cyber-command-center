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
      const ringSteps = [0.25, 0.5, 0.75, 1.0];
      const ringColors = [
        'rgba(0, 229, 255, 0.08)',
        'rgba(0, 229, 255, 0.12)',
        'rgba(0, 229, 255, 0.18)',
        'rgba(0, 229, 255, 0.45)',
      ];
      ringSteps.forEach((step, idx) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * step, 0, Math.PI * 2);
        ctx.strokeStyle = ringColors[idx];
        ctx.lineWidth = idx === ringSteps.length - 1 ? 1.5 : 0.8;
        ctx.stroke();
        // Ring distance label
        if (idx < 3) {
          ctx.font = '8px "Share Tech Mono"';
          ctx.fillStyle = 'rgba(0, 229, 255, 0.3)';
          ctx.fillText(`${[25, 50, 75][idx]}M`, centerX + radius * step + 3, centerY - 3);
        }
      });

      // Hex grid overlay
      ctx.save();
      ctx.globalAlpha = 0.04;
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 0.5;
      const hSize = 18;
      for (let hx = centerX - radius; hx < centerX + radius; hx += hSize * 1.5) {
        for (let hy = centerY - radius; hy < centerY + radius; hy += hSize * Math.sqrt(3)) {
          const offset = ((Math.floor((hy - centerY + radius) / (hSize * Math.sqrt(3)))) % 2) * hSize * 0.75;
          ctx.beginPath();
          for (let a = 0; a < 6; a++) {
            const angle = (Math.PI / 3) * a - Math.PI / 6;
            const px = hx + offset + hSize * Math.cos(angle);
            const py = hy + hSize * Math.sin(angle);
            if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }
      ctx.restore();

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
      sweepAngle = (sweepAngle + 0.022) % (Math.PI * 2);
      ctx.save();

      // Wide sweep fan
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, sweepAngle - 1.1, sweepAngle, false);
      ctx.closePath();
      const wideFan = ctx.createConicalGradient
        ? ctx.createConicalGradient(centerX, centerY, sweepAngle - 1.1, sweepAngle)
        : null;
      const sweepFanGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      sweepFanGrad.addColorStop(0, 'rgba(0, 255, 100, 0.18)');
      sweepFanGrad.addColorStop(0.5, 'rgba(0, 255, 100, 0.07)');
      sweepFanGrad.addColorStop(1, 'rgba(0, 255, 100, 0.005)');
      ctx.fillStyle = sweepFanGrad;
      ctx.fill();

      // Bright narrow leading edge
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, sweepAngle - 0.12, sweepAngle, false);
      ctx.closePath();
      const sweepEdgeGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      sweepEdgeGrad.addColorStop(0, 'rgba(0, 255, 136, 0.5)');
      sweepEdgeGrad.addColorStop(1, 'rgba(0, 255, 136, 0.02)');
      ctx.fillStyle = sweepEdgeGrad;
      ctx.fill();

      // Main Sweep Front Line with glow
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + Math.cos(sweepAngle) * radius, centerY + Math.sin(sweepAngle) * radius);
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;
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

        const isBlipped = angleDiff < 0.6;
        const isUnknown = node.encryption === 'UNENCRYPTED';
        const isAnalyzing = node.status === 'ANALYZING';

        const dotColor = isUnknown ? '#ff003c'
          : isAnalyzing ? '#ffb300'
          : node.encryption === 'QUANTUM-SHIELD' ? '#bf00ff'
          : '#00ff88';

        const dotRadius = isBlipped ? 6 : 3.5;

        // Outer pulse ring (blip effect)
        if (isBlipped) {
          ctx.beginPath();
          ctx.arc(nx, ny, 14, 0, Math.PI * 2);
          ctx.strokeStyle = dotColor.replace(')', ', 0.3)');
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Node core dot
        ctx.beginPath();
        ctx.arc(nx, ny, dotRadius, 0, Math.PI * 2);
        const nodeGrad = ctx.createRadialGradient(nx, ny, 0, nx, ny, dotRadius);
        nodeGrad.addColorStop(0, '#ffffff');
        nodeGrad.addColorStop(0.4, dotColor);
        nodeGrad.addColorStop(1, `${dotColor}44`);
        ctx.fillStyle = nodeGrad;
        ctx.shadowColor = dotColor;
        ctx.shadowBlur = isBlipped ? 20 : 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Target Label
        if (isBlipped || selectedNode?.id === node.id) {
          ctx.font = '10px "Share Tech Mono"';
          ctx.fillStyle = '#00e5ff';
          ctx.shadowColor = '#00e5ff';
          ctx.shadowBlur = 6;
          ctx.fillText(`${node.id}`, nx + 9, ny - 5);
          ctx.font = '9px "Share Tech Mono"';
          ctx.fillStyle = 'rgba(0,229,255,0.6)';
          ctx.fillText(`${node.signal}% // ${node.ip}`, nx + 9, ny + 6);
          ctx.shadowBlur = 0;
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
      <div className="cyber-panel-corner-tl" />
      <div className="cyber-panel-corner-tr" />
      <div className="cyber-panel-corner-bl" />
      <div className="cyber-panel-corner-br" />
      {/* Panel Header */}
      <div className="cyber-panel-header">
        <div className="panel-title">
          <Radio size={13} color="var(--electric-cyan)" style={{ filter: 'drop-shadow(0 0 6px rgba(0,229,255,0.9))' }} />
          <span>NEXUS RADAR // SIGNAL VISUALIZER</span>
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
        background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0,229,255,0.025) 0%, rgba(2,6,12,0.98) 70%)',
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
