import React, { useRef, useEffect } from 'react';
import { UserCheck, ShieldCheck } from 'lucide-react';

export function BiometricVisualizer() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrame;
    let scanY = 0;

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

      // Draw Abstract Cyber Face Outline (wireframe head)
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 1.5;

      // Head Oval
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 30, 42, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Eye Box Crosshairs
      ctx.strokeStyle = '#00ff66';
      ctx.strokeRect(centerX - 18, centerY - 10, 12, 8);
      ctx.strokeRect(centerX + 6, centerY - 10, 12, 8);

      // Nose / Mouth Grid lines
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - 2);
      ctx.lineTo(centerX, centerY + 12);
      ctx.moveTo(centerX - 10, centerY + 22);
      ctx.lineTo(centerX + 10, centerY + 22);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
      ctx.stroke();

      // Animated Laser Scanner Line
      scanY = (scanY + 1.5) % height;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.strokeStyle = '#00ff66';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00ff66';
      ctx.shadowBlur = 8;
      ctx.stroke();
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
          <UserCheck size={14} color="var(--electric-cyan)" />
          <span>BIOMETRIC SCANNER // VERIFICATION</span>
        </div>
        <span className="cyber-badge cyber-badge-green">
          VERIFIED
        </span>
      </div>

      <div style={{
        height: '90px',
        backgroundColor: 'rgba(2, 6, 12, 0.95)',
        borderRadius: '2px',
        border: '1px solid rgba(0, 240, 255, 0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

        <div style={{
          position: 'absolute',
          bottom: '6px',
          left: '8px',
          right: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '9px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--neon-green)'
        }}>
          <span>ID: OPERATOR-991</span>
          <span>CLEARANCE: LEVEL 5</span>
        </div>
      </div>
    </div>
  );
}
