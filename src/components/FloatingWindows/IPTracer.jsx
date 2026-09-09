import React, { useEffect, useRef, useState } from 'react';

const IP_TARGETS = [
  { ip: '192.168.1.104', loc: 'NEW YORK, USA', lat: 40.71, lng: -74.00, type: 'MOBILE', threat: 'LOW' },
  { ip: '185.220.101.47', loc: 'FRANKFURT, DE', lat: 50.11, lng: 8.68, type: 'SERVER', threat: 'HIGH' },
  { ip: '92.118.160.22', loc: 'LONDON, UK', lat: 51.51, lng: -0.13, type: 'VPN NODE', threat: 'ELEVATED' },
  { ip: '103.21.244.0', loc: 'TOKYO, JP', lat: 35.68, lng: 139.69, type: 'PROXY', threat: 'MEDIUM' },
  { ip: '45.33.32.156', loc: 'SINGAPORE', lat: 1.35, lng: 103.82, type: 'C2 SERVER', threat: 'CRITICAL' },
  { ip: '66.220.149.32', loc: 'MOSCOW, RU', lat: 55.75, lng: 37.62, type: 'BOTNET', threat: 'CRITICAL' },
];

const THREAT_COLORS = {
  LOW: '#00ff88', MEDIUM: '#00e5ff', ELEVATED: '#ffb300', HIGH: '#ff6600', CRITICAL: '#ff003c'
};

export function IPTracer() {
  const canvasRef = useRef(null);
  const [tracing, setTracing] = useState(false);
  const [traced, setTraced] = useState([]);
  const [currentTrace, setCurrentTrace] = useState(null);
  const [progress, setProgress] = useState(0);
  const [selectedIP, setSelectedIP] = useState(null);
  const animFrameRef = useRef(null);
  const particles = useRef([]);
  const nodePos = useRef({});

  // Map world coords to canvas coords
  const toCanvas = (lat, lng, w, h) => ({
    x: ((lng + 180) / 360) * w,
    y: ((90 - lat) / 180) * h,
  });

  // Draw map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let frame = 0;

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, w, h);

      // World map silhouette (simplified grid)
      ctx.strokeStyle = 'rgba(0,229,255,0.04)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= 18; i++) {
        ctx.beginPath();
        ctx.moveTo((i / 18) * w, 0);
        ctx.lineTo((i / 18) * w, h);
        ctx.stroke();
      }
      for (let i = 0; i <= 9; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (i / 9) * h);
        ctx.lineTo(w, (i / 9) * h);
        ctx.stroke();
      }

      // Draw traced connections
      traced.forEach((t, idx) => {
        const from = toCanvas(0, 0, w, h); // Nexus origin center
        const fromX = w * 0.3; // Hardcode "your location"
        const fromY = h * 0.35;
        const to = toCanvas(t.lat, t.lng, w, h);
        nodePos.current[t.ip] = to;

        // Connection line
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        const cpx = (fromX + to.x) / 2;
        const cpy = Math.min(fromY, to.y) - 30;
        ctx.quadraticCurveTo(cpx, cpy, to.x, to.y);
        ctx.strokeStyle = `${THREAT_COLORS[t.threat]}60`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.lineDashOffset = -frame * 0.5;
        ctx.stroke();
        ctx.setLineDash([]);

        // Target node
        ctx.beginPath();
        ctx.arc(to.x, to.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = THREAT_COLORS[t.threat];
        ctx.shadowColor = THREAT_COLORS[t.threat];
        ctx.shadowBlur = selectedIP === t.ip ? 20 : 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Pulse ring
        const pulseR = 8 + Math.sin(frame * 0.05 + idx) * 3;
        ctx.beginPath();
        ctx.arc(to.x, to.y, pulseR, 0, Math.PI * 2);
        ctx.strokeStyle = `${THREAT_COLORS[t.threat]}40`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // IP label
        if (selectedIP === t.ip || traced.length <= 3) {
          ctx.font = '8px "Share Tech Mono"';
          ctx.fillStyle = THREAT_COLORS[t.threat];
          ctx.shadowColor = THREAT_COLORS[t.threat];
          ctx.shadowBlur = 4;
          ctx.fillText(t.ip, to.x + 7, to.y - 3);
          ctx.fillText(t.loc, to.x + 7, to.y + 8);
          ctx.shadowBlur = 0;
        }
      });

      // Origin node (You)
      ctx.beginPath();
      ctx.arc(w * 0.3, h * 0.35, 7, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(w * 0.3, h * 0.35, 0, w * 0.3, h * 0.35, 7);
      grad.addColorStop(0, '#fff');
      grad.addColorStop(1, '#00e5ff');
      ctx.fillStyle = grad;
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.font = '8px "Share Tech Mono"';
      ctx.fillStyle = '#00e5ff';
      ctx.fillText('NEXUS HQ', w * 0.3 + 10, h * 0.35 + 3);

      frame++;
      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [traced, selectedIP]);

  const traceNext = () => {
    const remaining = IP_TARGETS.filter(t => !traced.find(tr => tr.ip === t.ip));
    if (remaining.length === 0) return;
    const target = remaining[Math.floor(Math.random() * remaining.length)];
    setCurrentTrace(target);
    setProgress(0);
    setTracing(true);

    let prog = 0;
    const interval = setInterval(() => {
      prog += 2 + Math.random() * 4;
      setProgress(Math.min(prog, 100));
      if (prog >= 100) {
        clearInterval(interval);
        setTracing(false);
        setTraced(prev => [...prev, target]);
        setCurrentTrace(null);
      }
    }, 80);
  };

  const reset = () => { setTraced([]); setTracing(false); setCurrentTrace(null); setProgress(0); };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', fontFamily:'var(--font-mono)', fontSize:'11px', color:'#00e5ff', gap:'0' }}>
      {/* Map */}
      <div style={{ flex:1, position:'relative', background:'rgba(0,0,4,0.95)', minHeight:'150px' }}>
        <canvas ref={canvasRef} style={{ width:'100%', height:'100%', display:'block' }} />
        <div style={{ position:'absolute', top:'6px', left:'8px', fontSize:'8px', color:'rgba(0,229,255,0.4)', letterSpacing:'1px' }}>
          GLOBAL SIGNAL TRACE MAP
        </div>
      </div>

      {/* Controls */}
      <div style={{ padding:'8px', display:'flex', flexDirection:'column', gap:'6px', borderTop:'1px solid rgba(0,229,255,0.12)', background:'rgba(0,0,0,0.6)' }}>
        {/* Current trace progress */}
        {tracing && currentTrace && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'9px', marginBottom:'3px' }}>
              <span style={{ color:'var(--text-muted)' }}>TRACING: <span style={{ color:'#ffb300' }}>{currentTrace.ip}</span></span>
              <span style={{ color:'#ffb300' }}>{progress.toFixed(0)}%</span>
            </div>
            <div style={{ height:'3px', background:'rgba(255,179,0,0.1)', borderRadius:'2px' }}>
              <div style={{ width:`${progress}%`, height:'100%', background:'linear-gradient(90deg, #ffb300, #ff6600)', borderRadius:'2px', boxShadow:'0 0 8px #ffb300', transition:'width 0.1s linear' }} />
            </div>
          </div>
        )}

        {/* Traced list */}
        <div style={{ display:'flex', flexDirection:'column', gap:'2px', maxHeight:'80px', overflowY:'auto' }}>
          {traced.map(t => (
            <div
              key={t.ip}
              onClick={() => setSelectedIP(selectedIP === t.ip ? null : t.ip)}
              style={{
                display:'flex', justifyContent:'space-between', alignItems:'center',
                padding:'2px 6px', borderRadius:'2px', cursor:'pointer',
                background: selectedIP === t.ip ? `${THREAT_COLORS[t.threat]}15` : 'transparent',
                border: `1px solid ${selectedIP === t.ip ? THREAT_COLORS[t.threat] + '40' : 'transparent'}`,
                fontSize:'9px',
              }}
            >
              <span style={{ color:'#00e5ff' }}>{t.ip}</span>
              <span style={{ color:'rgba(255,255,255,0.5)' }}>{t.loc}</span>
              <span style={{ color: THREAT_COLORS[t.threat], fontSize:'8px', fontWeight:700 }}>{t.threat}</span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display:'flex', gap:'6px' }}>
          <button
            onClick={traceNext}
            disabled={tracing || traced.length >= IP_TARGETS.length}
            style={{
              flex:1, padding:'6px', fontFamily:'var(--font-header)', fontSize:'10px', letterSpacing:'1.5px',
              fontWeight:700, border:'1px solid rgba(255,179,0,0.4)', background:'rgba(255,179,0,0.08)',
              color:'#ffb300', borderRadius:'2px', cursor: tracing ? 'not-allowed' : 'pointer',
              opacity: tracing || traced.length >= IP_TARGETS.length ? 0.5 : 1,
            }}
          >
            ⚡ TRACE IP
          </button>
          <button
            onClick={reset}
            style={{
              padding:'6px 10px', fontFamily:'var(--font-mono)', fontSize:'10px',
              border:'1px solid rgba(255,0,60,0.3)', background:'rgba(255,0,60,0.06)',
              color:'rgba(255,0,60,0.7)', borderRadius:'2px', cursor:'pointer',
            }}
          >
            RESET
          </button>
        </div>

        <div style={{ fontSize:'9px', color:'var(--text-muted)', textAlign:'center' }}>
          TRACED: <span style={{ color:'#00e5ff' }}>{traced.length}</span> / {IP_TARGETS.length} TARGETS
        </div>
      </div>
    </div>
  );
}
