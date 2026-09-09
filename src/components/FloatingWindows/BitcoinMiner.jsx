import React, { useState, useEffect, useRef } from 'react';

const COINS = [
  { id: 'BTC', name: 'BITCOIN', color: '#ffb300', rate: 0.00000847, price: 67842.33 },
  { id: 'ETH', name: 'ETHEREUM', color: '#818cf8', rate: 0.000142, price: 3421.88 },
  { id: 'XMR', name: 'MONERO', color: '#ff6600', rate: 0.00218, price: 148.22 },
  { id: 'NXS', name: 'NEXUSCOIN', color: '#00e5ff', rate: 0.00842, price: 12.44 },
];

const POOL_SERVERS = [
  'pool.nexusminer.io:3333',
  'eu.hashpool.net:4444',
  'us-east.cryptomine.pw:8080',
];

export function BitcoinMiner() {
  const [mining, setMining] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(COINS[3]);
  const [hashrate, setHashrate] = useState(0);
  const [totalMined, setTotalMined] = useState(0);
  const [blocks, setBlocks] = useState(0);
  const [temp, setTemp] = useState(65);
  const [shares, setShares] = useState({ accepted: 0, rejected: 0 });
  const [gpuLoad, setGpuLoad] = useState([0, 0, 0, 0]);
  const [currentHash, setCurrentHash] = useState('');
  const [usdValue, setUsdValue] = useState(0);
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const miningRef = useRef(false);

  const hexStream = () => {
    const chars = '0123456789abcdef';
    return Array.from({ length: 64 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  useEffect(() => {
    miningRef.current = mining;
    if (!mining) {
      setHashrate(0);
      setGpuLoad([0, 0, 0, 0]);
      setTemp(65);
      return;
    }

    const interval = setInterval(() => {
      if (!miningRef.current) return;
      const hr = 480 + Math.random() * 80;
      setHashrate(hr.toFixed(1));
      setTemp(78 + Math.random() * 12);
      setGpuLoad([85 + Math.random() * 15, 80 + Math.random() * 18, 82 + Math.random() * 16, 78 + Math.random() * 20]);
      setCurrentHash(hexStream());
      setTotalMined(prev => {
        const newTotal = prev + selectedCoin.rate * (hr / 500) * 0.03;
        setUsdValue(newTotal * selectedCoin.price);
        return newTotal;
      });
      if (Math.random() < 0.15) {
        setBlocks(prev => prev + 1);
        setShares(prev => ({
          accepted: prev.accepted + Math.floor(Math.random() * 3 + 1),
          rejected: prev.rejected + (Math.random() < 0.05 ? 1 : 0),
        }));
      }
    }, 200);

    return () => clearInterval(interval);
  }, [mining, selectedCoin]);

  // Draw hashrate sparkline
  const hashrateHistory = useRef([]);
  useEffect(() => {
    if (!canvasRef.current) return;
    if (parseFloat(hashrate) > 0) hashrateHistory.current = [...hashrateHistory.current.slice(-59), parseFloat(hashrate)];
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const data = hashrateHistory.current;
    if (data.length < 2) return;
    const max = Math.max(...data) || 1;
    ctx.strokeStyle = selectedCoin.color;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = selectedCoin.color;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    data.forEach((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - (v / max) * h * 0.9 - 2;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
    // Fill under
    ctx.shadowBlur = 0;
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, `${selectedCoin.color}30`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fill();
  }, [hashrate, selectedCoin]);

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', fontFamily:'var(--font-mono)', fontSize:'11px', color:'#00e5ff', padding:'10px', gap:'8px', overflowY:'auto' }}>
      {/* Coin selector */}
      <div style={{ display:'flex', gap:'4px' }}>
        {COINS.map(c => (
          <button key={c.id} onClick={() => !mining && setSelectedCoin(c)} style={{
            flex:1, padding:'4px 0', fontSize:'9px', fontFamily:'var(--font-header)',
            background: selectedCoin.id === c.id ? `${c.color}20` : 'rgba(0,0,0,0.4)',
            border: `1px solid ${selectedCoin.id === c.id ? c.color : 'rgba(255,255,255,0.08)'}`,
            color: selectedCoin.id === c.id ? c.color : 'var(--text-muted)',
            borderRadius:'2px', cursor: mining ? 'not-allowed' : 'pointer',
            letterSpacing:'0.5px',
            boxShadow: selectedCoin.id === c.id ? `0 0 8px ${c.color}40` : 'none',
          }}>{c.id}</button>
        ))}
      </div>

      {/* Main stats */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px' }}>
        {[
          { label:'HASHRATE', value: mining ? `${hashrate} MH/s` : '0 MH/s', color: selectedCoin.color },
          { label:'TEMP', value: `${Math.round(temp)}°C`, color: temp > 85 ? '#ff003c' : '#ffb300' },
          { label:'MINED', value: totalMined.toFixed(6), color: '#00ff88' },
          { label:'USD VALUE', value: `$${usdValue.toFixed(4)}`, color: '#00ff88' },
          { label:'BLOCKS', value: blocks, color: '#00e5ff' },
          { label:'SHARES', value: `${shares.accepted}/${shares.rejected}`, color: '#00e5ff' },
        ].map(s => (
          <div key={s.label} style={{ background:'rgba(0,0,0,0.4)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'3px', padding:'6px 8px' }}>
            <div style={{ color:'var(--text-muted)', fontSize:'8px', letterSpacing:'1px' }}>{s.label}</div>
            <div style={{ color: s.color, fontWeight:700, fontSize:'12px', textShadow:`0 0 6px ${s.color}80`, marginTop:'1px' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Hashrate sparkline */}
      <div style={{ position:'relative', height:'40px', background:'rgba(0,0,0,0.4)', borderRadius:'3px', border:'1px solid rgba(255,255,255,0.06)', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'4px', left:'6px', fontSize:'8px', color:'var(--text-muted)', letterSpacing:'1px', zIndex:2 }}>HASHRATE GRAPH</div>
        <canvas ref={canvasRef} width={350} height={40} style={{ width:'100%', height:'100%', position:'absolute', top:0, left:0 }} />
      </div>

      {/* GPU loads */}
      <div>
        <div style={{ fontSize:'8px', color:'var(--text-muted)', letterSpacing:'1px', marginBottom:'4px' }}>GPU UTILIZATION</div>
        <div style={{ display:'flex', flexDirection:'column', gap:'3px' }}>
          {gpuLoad.map((load, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'9px' }}>
              <span style={{ color:'var(--text-muted)', minWidth:'28px' }}>GPU{i}</span>
              <div style={{ flex:1, height:'4px', background:'rgba(0,229,255,0.08)', borderRadius:'2px', overflow:'hidden' }}>
                <div style={{
                  width:`${mining ? load : 0}%`, height:'100%',
                  background:`linear-gradient(90deg, ${selectedCoin.color}80, ${selectedCoin.color})`,
                  borderRadius:'2px', transition:'width 0.3s ease',
                  boxShadow:`0 0 6px ${selectedCoin.color}60`,
                }} />
              </div>
              <span style={{ color: selectedCoin.color, minWidth:'32px', textAlign:'right' }}>{mining ? load.toFixed(0) : 0}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Current hash */}
      {mining && (
        <div style={{ background:'rgba(0,0,0,0.5)', padding:'4px 6px', borderRadius:'2px', fontSize:'8px', color:'rgba(0,229,255,0.3)', letterSpacing:'0.5px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          HASH: {currentHash}
        </div>
      )}

      {/* Pool */}
      <div style={{ fontSize:'9px', color:'var(--text-muted)' }}>
        POOL: <span style={{ color:'#00e5ff' }}>{POOL_SERVERS[0]}</span>
      </div>

      {/* Start/Stop */}
      <button
        onClick={() => setMining(!mining)}
        style={{
          padding:'8px',
          fontFamily:'var(--font-header)',
          fontSize:'11px',
          letterSpacing:'2px',
          fontWeight:700,
          border: `1px solid ${mining ? selectedCoin.color : selectedCoin.color + '60'}`,
          background: mining ? `${selectedCoin.color}18` : `${selectedCoin.color}08`,
          color: mining ? selectedCoin.color : `${selectedCoin.color}80`,
          borderRadius:'2px', cursor:'pointer',
          textShadow: mining ? `0 0 8px ${selectedCoin.color}` : 'none',
          animation: mining ? 'holoPulse 2s infinite' : 'none',
        }}
      >
        {mining ? `⬛ STOP MINING ${selectedCoin.id}` : `⚡ START MINING ${selectedCoin.id}`}
      </button>
    </div>
  );
}
