import React, { useRef, useEffect } from 'react';
import { useSimulation } from '../../context/SimulationContext';

export function CyberBackground() {
  const canvasRef = useRef(null);
  const { threatLevel } = useSimulation();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrame;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle system
    const PARTICLE_COUNT = 60;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.7 ? '#00ff88' : Math.random() > 0.5 ? '#00e5ff' : '#bf00ff',
      pulse: Math.random() * Math.PI * 2,
    }));

    // Data streams (diagonal lines that flow)
    const STREAM_COUNT = 8;
    const streams = Array.from({ length: STREAM_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: Math.random() * 120 + 40,
      speed: Math.random() * 1.5 + 0.5,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.12 + 0.04,
      color: Math.random() > 0.5 ? '#00e5ff' : '#00ff88',
    }));

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isCritical = threatLevel === 'CRITICAL' || threatLevel === 'HIGH';

      // Draw data streams
      streams.forEach((s) => {
        s.y += s.speed;
        s.x += s.speed * Math.cos(s.angle);
        if (s.y > canvas.height + 200 || s.x > canvas.width + 200) {
          s.x = Math.random() * canvas.width * 0.5;
          s.y = -50;
        }

        const grad = ctx.createLinearGradient(
          s.x, s.y,
          s.x + Math.cos(s.angle) * s.length,
          s.y + Math.sin(s.angle) * s.length
        );
        const col = isCritical ? '#ff003c' : s.color;
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.5, col + Math.round(s.opacity * 255).toString(16).padStart(2, '0'));
        grad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + Math.cos(s.angle) * s.length, s.y + Math.sin(s.angle) * s.length);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.03;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const pulsedOpacity = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse));
        const col = isCritical ? '#ff003c' : p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.globalAlpha = pulsedOpacity;
        ctx.shadowColor = col;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      });

      // Connect nearby particles
      ctx.lineWidth = 0.4;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const col = isCritical ? '#ff003c' : '#00e5ff';
            ctx.strokeStyle = col;
            ctx.globalAlpha = (1 - dist / 100) * 0.08;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      // Periodic scan line sweep (every 180 frames)
      if (frame % 240 < 120) {
        const progress = (frame % 240) / 120;
        const scanY = progress * canvas.height;
        const scanGrad = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 60);
        const scanCol = isCritical ? 'rgba(255,0,60,' : 'rgba(0,229,255,';
        scanGrad.addColorStop(0, scanCol + '0)');
        scanGrad.addColorStop(0.5, scanCol + '0.04)');
        scanGrad.addColorStop(1, scanCol + '0)');
        ctx.fillStyle = scanGrad;
        ctx.fillRect(0, scanY - 60, canvas.width, 120);
      }

      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, [threatLevel]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 1,
      }}
    />
  );
}
