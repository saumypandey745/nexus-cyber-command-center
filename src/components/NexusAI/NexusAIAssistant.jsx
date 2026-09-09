import React, { useRef, useEffect, useState } from 'react';
import { Bot, Cpu, Sparkles, AlertCircle } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export function NexusAIAssistant() {
  const { logs, threatLevel } = useSimulation();
  const canvasRef = useRef(null);
  const [aiState, setAiState] = useState('MONITORING');

  // Filter AI specific logs or system logs
  const aiLogs = logs.filter((l) => l.type === 'NEXUS_AI' || l.type === 'SECURITY' || l.type === 'SYSTEM').slice(-3);

  // Animated Waveform Visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrame;
    let phase = 0;

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);

      const numBars = 24;
      const barWidth = width / numBars - 2;
      phase += 0.08;

      for (let i = 0; i < numBars; i++) {
        const barHeight = Math.abs(Math.sin(phase + i * 0.4)) * (height * 0.75) + 4;
        const x = i * (barWidth + 2);
        const y = (height - barHeight) / 2;

        const isHot = threatLevel === 'CRITICAL' || threatLevel === 'HIGH';
        ctx.fillStyle = isHot ? '#ff0055' : (i % 2 === 0 ? '#00f0ff' : '#00ff66');
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      animationFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrame);
  }, [threatLevel]);

  return (
    <div className="cyber-panel" style={{ padding: '10px 12px', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-header)', fontSize: '11px', color: 'var(--electric-cyan)', fontWeight: 700 }}>
          <Bot size={14} color="var(--electric-cyan)" />
          <span>NEXUS AI ASSISTANT</span>
        </div>
        <span className={`cyber-badge ${threatLevel === 'CRITICAL' ? 'cyber-badge-red' : 'cyber-badge-green'}`}>
          {threatLevel === 'CRITICAL' ? 'DEFENSE MODE' : 'MONITORING'}
        </span>
      </div>

      {/* AI Waveform Display */}
      <div style={{
        height: '36px',
        backgroundColor: 'rgba(2, 6, 12, 0.95)',
        borderRadius: '2px',
        border: '1px solid rgba(0, 240, 255, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 8px'
      }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      </div>

      {/* AI Commentary Stream */}
      <div style={{
        fontSize: '11px',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-secondary)',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        backgroundColor: 'rgba(3, 8, 16, 0.8)',
        padding: '6px 8px',
        borderRadius: '2px',
        border: '1px solid rgba(0, 240, 255, 0.1)'
      }}>
        <div style={{ color: 'var(--neon-green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={11} /> NEXUS AI: {aiLogs[aiLogs.length - 1]?.text || 'ANALYZING NETWORK PATTERNS...'}
        </div>
      </div>
    </div>
  );
}
