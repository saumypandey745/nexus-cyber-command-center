import React, { useState, useEffect, useRef } from 'react';

const CHARSET_LOWER = 'abcdefghijklmnopqrstuvwxyz';
const CHARSET_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const CHARSET_NUM = '0123456789';
const CHARSET_SYM = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const CHARSET = CHARSET_LOWER + CHARSET_UPPER + CHARSET_NUM + CHARSET_SYM;

const TARGET_PASSWORD = 'Nx3#K@7pQ!';
const TARGETS = [
  { name: 'GOV.SECURE.SYS', ip: '185.220.101.47', db: 'USERS_ADMIN_TABLE', level: 'CRITICAL' },
  { name: 'INTERPOL.DATABASE', ip: '92.118.160.22', db: 'AGENT_CREDENTIALS', level: 'HIGH' },
  { name: 'NSA.MAINFRAME', ip: '66.220.149.32', db: 'CLASSIFIED_RECORDS', level: 'CRITICAL' },
];

const LOG_EVENTS = [
  'Initializing brute force engine...',
  'Loading rainbow tables (4.2GB)...',
  'Starting dictionary attack...',
  'Switching to hybrid mode...',
  'Bypassing 2FA layer...',
  'Cracking SHA-512 hash...',
  'Injecting SQL payload...',
  'Escalating privileges...',
  'Accessing root shell...',
];

export function PasswordCracker() {
  const [target, setTarget] = useState(TARGETS[0]);
  const [cracking, setCracking] = useState(false);
  const [cracked, setCracked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentAttempt, setCurrentAttempt] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [logs, setLogs] = useState([]);
  const [speed, setSpeed] = useState(0);
  const intervalRef = useRef(null);
  const logRef = useRef(null);

  const addLog = (msg, color = '#00e5ff') => {
    setLogs(prev => [...prev.slice(-20), { msg, color, id: Date.now() + Math.random() }]);
    setTimeout(() => { logRef.current?.scrollTo(0, logRef.current.scrollHeight); }, 50);
  };

  const startCracking = () => {
    setCracking(true);
    setCracked(false);
    setProgress(0);
    setAttempts(0);
    setLogs([]);
    addLog(`▸ TARGET: ${target.name} [${target.ip}]`, '#ffb300');
    addLog(`▸ DATABASE: ${target.db}`, '#ffb300');
    addLog(`▸ INITIATING BRUTE FORCE SEQUENCE...`, '#ff003c');

    let logIdx = 0;
    let prog = 0;
    let att = 0;

    intervalRef.current = setInterval(() => {
      prog += 0.4 + Math.random() * 0.6;
      att += Math.floor(Math.random() * 8000 + 2000);
      setSpeed(Math.floor(Math.random() * 50000 + 30000));
      setAttempts(att);
      setProgress(Math.min(prog, 99.9));

      // Random attempt string
      const len = Math.floor(Math.random() * 6) + 4;
      let attempt = '';
      for (let i = 0; i < len; i++) attempt += CHARSET[Math.floor(Math.random() * CHARSET.length)];
      setCurrentAttempt(attempt);

      // Periodic log events
      if (Math.random() < 0.04 && logIdx < LOG_EVENTS.length) {
        addLog(`▸ ${LOG_EVENTS[logIdx++]}`, '#00e5ff');
      }

      if (prog >= 100) {
        clearInterval(intervalRef.current);
        setProgress(100);
        setCurrentAttempt(TARGET_PASSWORD);
        setCracking(false);
        setCracked(true);
        addLog(`▸ PASSWORD CRACKED: ${TARGET_PASSWORD}`, '#00ff88');
        addLog(`▸ ACCESS GRANTED TO ${target.name}`, '#00ff88');
        addLog(`▸ PRIVILEGE ESCALATION: ROOT`, '#00ff88');
      }
    }, 40);
  };

  const stopCracking = () => {
    clearInterval(intervalRef.current);
    setCracking(false);
    addLog('▸ OPERATION ABORTED BY USER', '#ff003c');
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', fontFamily:'var(--font-mono)', fontSize:'11px', color:'#00e5ff', padding:'10px', gap:'8px', overflowY:'auto' }}>
      {/* Target selector */}
      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
        <span style={{ color:'var(--text-muted)', fontSize:'9px', letterSpacing:'1px', alignSelf:'center' }}>TARGET:</span>
        {TARGETS.map(t => (
          <button key={t.name} onClick={() => !cracking && setTarget(t)} style={{
            padding:'2px 8px', fontSize:'9px', fontFamily:'var(--font-mono)',
            background: target.name === t.name ? 'rgba(255,0,60,0.2)' : 'rgba(0,0,0,0.4)',
            border: `1px solid ${target.name === t.name ? '#ff003c' : 'rgba(0,229,255,0.15)'}`,
            color: target.name === t.name ? '#ff003c' : 'var(--text-muted)',
            borderRadius:'2px', cursor: cracking ? 'not-allowed' : 'pointer',
            letterSpacing:'0.5px',
          }}>{t.name}</button>
        ))}
      </div>

      {/* Target info */}
      <div style={{ background:'rgba(255,0,60,0.05)', border:'1px solid rgba(255,0,60,0.2)', borderRadius:'3px', padding:'8px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4px' }}>
        {[
          ['IP', target.ip],
          ['DATABASE', target.db],
          ['THREAT', target.level],
          ['PROTOCOL', 'BRUTE+DICT+SQL'],
        ].map(([k, v]) => (
          <div key={k}>
            <div style={{ color:'var(--text-muted)', fontSize:'8px' }}>{k}</div>
            <div style={{ color: k === 'THREAT' ? '#ff003c' : '#fff', fontWeight:700, fontSize:'10px' }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Current attempt */}
      <div style={{ background:'rgba(0,0,0,0.6)', border:'1px solid rgba(0,229,255,0.12)', borderRadius:'3px', padding:'8px', textAlign:'center' }}>
        <div style={{ color:'var(--text-muted)', fontSize:'8px', letterSpacing:'1px', marginBottom:'4px' }}>CURRENT ATTEMPT</div>
        <div style={{
          fontFamily:'var(--font-header)',
          fontSize:'18px',
          letterSpacing:'4px',
          color: cracked ? '#00ff88' : '#00e5ff',
          textShadow: cracked ? '0 0 20px #00ff88, 0 0 40px rgba(0,255,136,0.5)' : '0 0 15px rgba(0,229,255,0.8)',
          fontWeight: 900,
          minHeight:'24px',
          animation: cracked ? 'glowPulseGreen 1s infinite' : 'none',
        }}>
          {currentAttempt || '_ _ _ _ _ _'}
        </div>
      </div>

      {/* Progress */}
      <div>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'9px', marginBottom:'4px' }}>
          <span style={{ color:'var(--text-muted)' }}>CRACK PROGRESS</span>
          <span style={{ color: cracked ? '#00ff88' : '#ff003c', fontWeight:700 }}>{progress.toFixed(1)}%</span>
        </div>
        <div style={{ height:'6px', background:'rgba(255,0,60,0.08)', borderRadius:'2px', overflow:'hidden' }}>
          <div style={{
            width:`${progress}%`, height:'100%',
            background: cracked
              ? 'linear-gradient(90deg, #00ff88, #00e5ff)'
              : `linear-gradient(90deg, #ff003c, #ffb300, #ff003c)`,
            backgroundSize:'200% 100%',
            animation: cracking ? 'edgeFlow 1s linear infinite' : 'none',
            borderRadius:'2px',
            boxShadow: `0 0 10px ${cracked ? '#00ff88' : '#ff003c'}`,
            transition:'width 0.1s linear',
          }} />
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'flex', gap:'8px', justifyContent:'space-between', fontSize:'9px' }}>
        {[
          ['ATTEMPTS', attempts.toLocaleString()],
          ['SPEED', `${speed.toLocaleString()}/s`],
          ['STATUS', cracked ? 'CRACKED' : cracking ? 'RUNNING' : 'IDLE'],
        ].map(([k, v]) => (
          <div key={k} style={{ textAlign:'center', flex:1 }}>
            <div style={{ color:'var(--text-muted)' }}>{k}</div>
            <div style={{ color: k === 'STATUS' && cracked ? '#00ff88' : k === 'STATUS' && cracking ? '#ffb300' : '#00e5ff', fontWeight:700, fontSize:'10px' }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Log output */}
      <div ref={logRef} style={{ flex:1, background:'rgba(0,0,0,0.5)', border:'1px solid rgba(0,229,255,0.08)', borderRadius:'3px', padding:'6px', overflowY:'auto', minHeight:'60px', maxHeight:'100px', display:'flex', flexDirection:'column', gap:'2px' }}>
        {logs.map(l => (
          <div key={l.id} style={{ color: l.color, fontSize:'9px', letterSpacing:'0.3px' }}>{l.msg}</div>
        ))}
      </div>

      {/* Action button */}
      <button
        onClick={cracking ? stopCracking : startCracking}
        style={{
          padding:'8px',
          fontFamily:'var(--font-header)',
          fontSize:'11px',
          letterSpacing:'2px',
          fontWeight:700,
          border: `1px solid ${cracking ? '#ff003c' : cracked ? '#00ff88' : '#ff003c'}`,
          background: cracking ? 'rgba(255,0,60,0.15)' : cracked ? 'rgba(0,255,136,0.1)' : 'rgba(255,0,60,0.08)',
          color: cracking ? '#ff003c' : cracked ? '#00ff88' : '#ff003c',
          borderRadius:'2px',
          cursor:'pointer',
          textShadow: `0 0 8px ${cracking ? '#ff003c' : cracked ? '#00ff88' : '#ff003c'}`,
          animation: cracking ? 'pulseRed 1s infinite' : cracked ? 'glowPulseGreen 2s infinite' : 'none',
        }}
      >
        {cracking ? '⬛ ABORT OPERATION' : cracked ? '✓ SYSTEM COMPROMISED' : '⚡ INITIATE BRUTE FORCE'}
      </button>
    </div>
  );
}
