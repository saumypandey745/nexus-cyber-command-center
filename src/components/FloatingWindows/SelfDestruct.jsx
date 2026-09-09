import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Shield } from 'lucide-react';

const SYSTEMS = [
  'MAINFRAME CORE', 'DATABASE CLUSTERS', 'SATELLITE UPLINKS',
  'NETWORK MATRIX', 'ENCRYPTION VAULTS', 'AGENT IDENTITIES',
  'QUANTUM SERVERS', 'NEXUS ARCHIVE',
];

export function SelfDestruct() {
  const [armed, setArmed] = useState(false);
  const [counting, setCounting] = useState(false);
  const [time, setTime] = useState(30);
  const [wiped, setWiped] = useState([]);
  const [aborted, setAborted] = useState(false);
  const [confirmCode, setConfirmCode] = useState('');
  const [requiredCode] = useState(() => Math.floor(1000 + Math.random() * 9000).toString());
  const [phase, setPhase] = useState(0); // 0=idle, 1=arm, 2=counting, 3=complete, 4=aborted
  const intervalRef = useRef(null);

  const arm = () => {
    if (confirmCode === requiredCode) {
      setPhase(2);
      setCounting(true);
      setArmed(true);
      setTime(30);
      setWiped([]);
      setAborted(false);
    }
  };

  useEffect(() => {
    if (!counting) return;
    intervalRef.current = setInterval(() => {
      setTime(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setCounting(false);
          setPhase(3);
          setWiped([...SYSTEMS]);
          return 0;
        }
        // Progressively wipe systems
        const elapsed = 30 - prev + 1;
        const toWipe = Math.floor((elapsed / 30) * SYSTEMS.length);
        setWiped(SYSTEMS.slice(0, toWipe));
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [counting]);

  const abort = () => {
    clearInterval(intervalRef.current);
    setCounting(false);
    setArmed(false);
    setPhase(4);
    setAborted(true);
    setTimeout(() => { setPhase(0); setConfirmCode(''); setWiped([]); }, 3000);
  };

  const reset = () => { setPhase(0); setArmed(false); setCounting(false); setTime(30); setWiped([]); setAborted(false); setConfirmCode(''); };

  const timeColor = time <= 10 ? '#ff003c' : time <= 20 ? '#ff6600' : '#ffb300';
  const progress = ((30 - time) / 30) * 100;

  return (
    <div style={{
      display:'flex', flexDirection:'column', height:'100%',
      fontFamily:'var(--font-mono)', fontSize:'11px',
      background: phase === 2 ? 'rgba(255,0,60,0.04)' : phase === 3 ? 'rgba(255,0,60,0.1)' : 'rgba(0,0,0,0.1)',
      padding:'12px', gap:'10px', overflowY:'auto',
      transition:'background 0.5s ease',
      animation: phase === 2 ? 'warningStrobe 1s ease-in-out infinite' : 'none',
    }}>
      {/* Status display */}
      <div style={{ textAlign:'center' }}>
        <div style={{
          fontFamily:'var(--font-header)',
          fontSize: phase === 2 ? '42px' : '32px',
          fontWeight:900,
          color: phase === 3 ? '#ff003c' : phase === 4 ? '#00ff88' : timeColor,
          textShadow: `0 0 30px ${phase === 4 ? '#00ff88' : '#ff003c'}, 0 0 60px ${phase === 4 ? 'rgba(0,255,136,0.3)' : 'rgba(255,0,60,0.3)'}`,
          letterSpacing:'4px',
          animation: phase === 2 ? 'pulseRed 0.8s ease-in-out infinite' : 'none',
          transition:'all 0.3s ease',
        }}>
          {phase === 0 && '-- : --'}
          {phase === 1 && '00 : 30'}
          {phase === 2 && `00 : ${String(time).padStart(2, '0')}`}
          {phase === 3 && 'WIPED'}
          {phase === 4 && 'ABORTED'}
        </div>
        <div style={{ fontSize:'10px', color: phase === 3 ? '#ff003c' : phase === 4 ? '#00ff88' : 'var(--text-muted)', letterSpacing:'3px', marginTop:'4px' }}>
          {phase === 0 && 'SYSTEM SELF-DESTRUCT'}
          {phase === 1 && 'ENTER AUTHORIZATION CODE'}
          {phase === 2 && '⚠ DESTRUCTION SEQUENCE ACTIVE'}
          {phase === 3 && '✓ ALL SYSTEMS PURGED'}
          {phase === 4 && '✓ ABORT SUCCESSFUL'}
        </div>
      </div>

      {/* Progress bar */}
      {phase === 2 && (
        <div style={{ height:'6px', background:'rgba(255,0,60,0.1)', borderRadius:'2px', overflow:'hidden' }}>
          <div style={{
            width:`${progress}%`, height:'100%',
            background:`linear-gradient(90deg, #ff003c, #ffb300)`,
            borderRadius:'2px',
            boxShadow:'0 0 12px #ff003c',
            transition:'width 1s linear',
            animation:'edgeFlow 1s linear infinite', backgroundSize:'200% 100%',
          }} />
        </div>
      )}

      {/* Systems list */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4px' }}>
        {SYSTEMS.map((sys, i) => {
          const isWiped = wiped.includes(sys);
          return (
            <div key={sys} style={{
              display:'flex', alignItems:'center', gap:'6px',
              padding:'5px 7px', borderRadius:'2px',
              background: isWiped ? 'rgba(255,0,60,0.12)' : 'rgba(0,0,0,0.3)',
              border: `1px solid ${isWiped ? 'rgba(255,0,60,0.3)' : 'rgba(0,229,255,0.08)'}`,
              transition:'all 0.3s ease',
            }}>
              <div style={{
                width:'6px', height:'6px', borderRadius:'50%', flexShrink:0,
                background: isWiped ? '#ff003c' : '#00ff88',
                boxShadow: isWiped ? '0 0 6px #ff003c' : '0 0 6px #00ff88',
                animation: phase === 2 && !isWiped ? 'pulseGreen 0.5s infinite' : 'none',
              }} />
              <span style={{ fontSize:'9px', color: isWiped ? 'rgba(255,0,60,0.7)' : 'var(--text-secondary)', textDecoration: isWiped ? 'line-through' : 'none', letterSpacing:'0.3px' }}>
                {sys}
              </span>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      {phase === 0 && (
        <button onClick={() => setPhase(1)} style={{
          padding:'8px', fontFamily:'var(--font-header)', fontSize:'11px', letterSpacing:'2px', fontWeight:700,
          border:'1px solid rgba(255,0,60,0.4)', background:'rgba(255,0,60,0.08)',
          color:'rgba(255,0,60,0.8)', borderRadius:'2px', cursor:'pointer',
        }}>
          ⚡ ARM SELF-DESTRUCT
        </button>
      )}

      {phase === 1 && (
        <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
          <div style={{ fontSize:'9px', color:'var(--text-muted)', textAlign:'center' }}>
            AUTHORIZATION CODE: <span style={{ color:'#ffb300', fontWeight:700, letterSpacing:'3px' }}>{requiredCode}</span>
          </div>
          <input
            type="text"
            value={confirmCode}
            onChange={e => setConfirmCode(e.target.value.slice(0, 4))}
            placeholder="ENTER CODE"
            maxLength={4}
            style={{
              background:'rgba(0,0,0,0.5)', border:'1px solid rgba(255,0,60,0.3)', borderRadius:'2px',
              color:'#ff003c', fontFamily:'var(--font-header)', fontSize:'18px', letterSpacing:'8px',
              textAlign:'center', padding:'8px', outline:'none', fontWeight:700,
            }}
          />
          <div style={{ display:'flex', gap:'6px' }}>
            <button onClick={arm} disabled={confirmCode.length !== 4} style={{
              flex:1, padding:'7px', fontFamily:'var(--font-header)', fontSize:'10px', letterSpacing:'2px', fontWeight:700,
              border:'1px solid #ff003c', background:'rgba(255,0,60,0.15)', color:'#ff003c',
              borderRadius:'2px', cursor: confirmCode.length !== 4 ? 'not-allowed' : 'pointer', opacity: confirmCode.length !== 4 ? 0.5 : 1,
            }}>CONFIRM ARM</button>
            <button onClick={() => setPhase(0)} style={{
              padding:'7px 12px', fontFamily:'var(--font-mono)', fontSize:'10px',
              border:'1px solid rgba(0,229,255,0.2)', background:'rgba(0,229,255,0.06)',
              color:'var(--text-muted)', borderRadius:'2px', cursor:'pointer',
            }}>CANCEL</button>
          </div>
        </div>
      )}

      {phase === 2 && (
        <button onClick={abort} style={{
          padding:'10px', fontFamily:'var(--font-header)', fontSize:'12px', letterSpacing:'3px', fontWeight:900,
          border:'2px solid #00ff88', background:'rgba(0,255,136,0.1)',
          color:'#00ff88', borderRadius:'2px', cursor:'pointer',
          textShadow:'0 0 12px #00ff88', boxShadow:'0 0 20px rgba(0,255,136,0.2)',
          animation:'glowPulseGreen 1s infinite',
        }}>
          ⬛ ABORT SEQUENCE
        </button>
      )}

      {(phase === 3 || phase === 4) && (
        <button onClick={reset} style={{
          padding:'8px', fontFamily:'var(--font-header)', fontSize:'10px', letterSpacing:'2px', fontWeight:700,
          border:'1px solid rgba(0,229,255,0.3)', background:'rgba(0,229,255,0.06)',
          color:'var(--electric-cyan)', borderRadius:'2px', cursor:'pointer',
        }}>RESET SYSTEM</button>
      )}
    </div>
  );
}
