import React, { useRef, useEffect } from 'react';
import { useSimulation } from '../../context/SimulationContext';

export function MatrixRainCanvas() {
  const { fxSettings } = useSimulation();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!fxSettings.matrixRain) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrame;

    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops = Array(columns).fill(1);

    const render = () => {
      // Semi-transparent black background to create trail effect
      ctx.fillStyle = 'rgba(2, 5, 9, 0.06)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#00ff66';
      ctx.font = `${fontSize}px "Share Tech Mono"`;

      for (let i = 0; i < drops.length; i++) {
        const char = katakana.charAt(Math.floor(Math.random() * katakana.length));
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [fxSettings.matrixRain]);

  if (!fxSettings.matrixRain) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.25
      }}
    />
  );
}
