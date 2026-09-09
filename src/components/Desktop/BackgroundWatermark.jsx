import React, { useEffect, useRef } from 'react';

/**
 * BackgroundWatermark — Animated cyber OS background logo
 * Full-screen centered NEXUS emblem with rotating rings
 */
export function BackgroundWatermark() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame = 0;
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;

      ctx.clearRect(0, 0, W, H);

      const t = frame * 0.008;

      // Outer rotating dashed ring
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.3);
      ctx.strokeStyle = 'rgba(0, 255, 102, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([16, 10, 6, 10]);
      ctx.beginPath();
      ctx.arc(0, 0, 240, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Inner counter-rotating ring
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-t * 0.5);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.10)';
      ctx.lineWidth = 1;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.arc(0, 0, 190, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Middle ring static
      ctx.save();
      ctx.translate(cx, cy);
      ctx.strokeStyle = 'rgba(0, 255, 102, 0.07)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(0, 0, 150, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Crosshair lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.06)';
      ctx.lineWidth = 0.8;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(cx, cy - 260); ctx.lineTo(cx, cy + 260);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 260, cy); ctx.lineTo(cx + 260, cy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Diagonal crosshair
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(Math.PI / 4);
      ctx.strokeStyle = 'rgba(0, 255, 102, 0.04)';
      ctx.beginPath();
      ctx.moveTo(0, -200); ctx.lineTo(0, 200);
      ctx.moveTo(-200, 0); ctx.lineTo(200, 0);
      ctx.stroke();
      ctx.restore();

      // Radar sweep line
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 1.2);
      const grad = ctx.createLinearGradient(0, 0, 240, 0);
      grad.addColorStop(0, 'rgba(0, 255, 102, 0.18)');
      grad.addColorStop(1, 'transparent');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(240, 0);
      ctx.stroke();
      ctx.restore();

      // Center shield emblem
      ctx.save();
      ctx.translate(cx, cy);

      // Shield polygon
      const sp = [
        [0, -60], [50, -30], [50, 20], [0, 55], [-50, 20], [-50, -30]
      ];
      ctx.beginPath();
      ctx.moveTo(sp[0][0], sp[0][1]);
      for (let i = 1; i < sp.length; i++) ctx.lineTo(sp[i][0], sp[i][1]);
      ctx.closePath();
      ctx.strokeStyle = `rgba(0, 255, 102, ${0.15 + 0.05 * Math.sin(t * 2)})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner shield
      const scale = 0.75;
      ctx.beginPath();
      ctx.moveTo(sp[0][0] * scale, sp[0][1] * scale);
      for (let i = 1; i < sp.length; i++) ctx.lineTo(sp[i][0] * scale, sp[i][1] * scale);
      ctx.closePath();
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.10)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Eyes
      ctx.fillStyle = `rgba(0, 255, 102, ${0.18 + 0.06 * Math.sin(t * 3)})`;
      ctx.beginPath(); ctx.arc(-16, -12, 7, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(16, -12, 7, 0, Math.PI * 2); ctx.fill();

      // Nose triangle
      ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.beginPath();
      ctx.moveTo(0, -2); ctx.lineTo(-8, 14); ctx.lineTo(8, 14);
      ctx.closePath(); ctx.fill();

      // Teeth lines
      ctx.strokeStyle = 'rgba(0, 255, 102, 0.18)';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      [[-20, 20], [-8, 20], [4, 20], [16, 20]].forEach(([x]) => {
        ctx.beginPath();
        ctx.moveTo(x, 20); ctx.lineTo(x, 30);
        ctx.stroke();
      });
      ctx.restore();

      // Main title text
      ctx.textAlign = 'center';
      ctx.font = `bold 26px 'Orbitron', monospace`;
      ctx.letterSpacing = '8px';
      ctx.fillStyle = `rgba(0, 255, 102, ${0.08 + 0.03 * Math.sin(t)})`;
      ctx.shadowColor = '#00ff66';
      ctx.shadowBlur = 15;
      ctx.fillText('NEXUS CYBER COMMAND', cx, cy + 100);
      ctx.shadowBlur = 0;

      // Subtitle text
      ctx.font = `bold 10px 'Orbitron', monospace`;
      ctx.fillStyle = `rgba(0, 240, 255, ${0.06 + 0.02 * Math.sin(t * 1.5)})`;
      ctx.fillText('CLASSIFIED // OMEGA CLEARANCE REQUIRED', cx, cy + 122);

      // Corner markers
      const corners = [
        [cx - 300, cy - 180], [cx + 300, cy - 180],
        [cx - 300, cy + 180], [cx + 300, cy + 180]
      ];
      corners.forEach(([x, y], i) => {
        const flip = [1, -1, 1, -1];
        const fv = [1, 1, -1, -1];
        ctx.strokeStyle = `rgba(0, 240, 255, ${0.06 + 0.02 * Math.sin(t + i)})`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + flip[i] * 14, y);
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + fv[i] * 14);
        ctx.stroke();
      });

      frame++;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 1,
      }}
    />
  );
}
