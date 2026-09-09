import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, Lock, Cpu, Terminal, Skull, Download, Globe, Radio, Search } from 'lucide-react';

/**
 * 1. ACCESS DENIED (Key 1)
 */
export function AccessDeniedWindow() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      height: '100%', padding: '20px', background: 'radial-gradient(circle, #2a0008 0%, #000 100%)',
      fontFamily: 'var(--font-header)', textAlign: 'center', color: '#ff0044',
      border: '2px solid #ff0044', boxShadow: 'inset 0 0 30px #ff0044, 0 0 40px #ff0044',
      animation: 'warningStrobe 1.5s infinite', position: 'relative', overflow: 'hidden',
    }}>
      <ShieldAlert size={56} color="#ff0044" style={{ filter: 'drop-shadow(0 0 20px #ff0044)' }} />
      <div style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '4px', marginTop: '12px', textShadow: '0 0 20px #ff0044' }}>
        🗙 ACCESS DENIED
      </div>
      <div style={{ fontSize: '10px', color: '#ffffff', letterSpacing: '2px', marginTop: '6px', opacity: 0.8 }}>
        SECURITY CLEARANCE LEVEL 9 REQUIRED // INTRUSION ALARM ACTIVATED
      </div>

      {/* Diagonal Stamp */}
      <div style={{
        position: 'absolute', transform: 'rotate(-25deg)', border: '4px solid #ff0044',
        padding: '6px 24px', color: '#ff0044', fontSize: '26px', fontWeight: 900, letterSpacing: '6px',
        opacity: 0.3, pointerEvents: 'none',
      }}>
        RESTRICTED
      </div>
    </div>
  );
}

/**
 * 2. PERMISSION GRANTED (Key 2)
 */
export function PermissionGrantedWindow() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      height: '100%', padding: '20px', background: 'radial-gradient(circle, #002a12 0%, #000 100%)',
      fontFamily: 'var(--font-header)', textAlign: 'center', color: '#00ff66',
      border: '2px solid #00ff66', boxShadow: 'inset 0 0 30px #00ff66, 0 0 40px #00ff66',
    }}>
      <CheckCircle2 size={56} color="#00ff66" style={{ filter: 'drop-shadow(0 0 20px #00ff66)' }} />
      <div style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '4px', marginTop: '12px', textShadow: '0 0 20px #00ff66' }}>
        ✅ PERMISSION GRANTED
      </div>
      <div style={{ fontSize: '10px', color: '#ffffff', letterSpacing: '2px', marginTop: '6px' }}>
        MAINFRAME ROOT ACCESS DECRYPTED // WELCOME AGENT
      </div>
    </div>
  );
}

/**
 * 3. SELF DESTRUCT SEQUENCE (Key 3)
 */
export function SelfDestructPassiveWindow() {
  const [timer, setTimer] = useState(600);

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      height: '100%', padding: '16px', background: '#0a0002', border: '2px solid #ff0044',
      color: '#ff0044', fontFamily: 'var(--font-mono)', textAlign: 'center',
    }}>
      <AlertTriangle size={36} color="#ff0044" style={{ animation: 'pulseRed 1s infinite' }} />
      <div style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '2px', marginTop: '6px' }}>
        ⚠️ SELF DESTRUCT SEQUENCE ENGAGED
      </div>
      <div style={{ fontSize: '38px', fontWeight: 900, color: '#ffffff', letterSpacing: '4px', margin: '10px 0', textShadow: '0 0 20px #ff0044' }}>
        00:{String(timer).padStart(3, '0')}
      </div>
      <div style={{ fontSize: '8px', color: 'var(--text-muted)' }}>PRESS SPACE TO ABORT PROTOCOL</div>
    </div>
  );
}

/**
 * 4. TOP SECRET / CLASSIFIED (Key 4)
 */
export function TopSecretWindow() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      height: '100%', padding: '20px', background: '#020712', border: '1px solid #00f0ff',
      position: 'relative', overflow: 'hidden', color: '#00f0ff', fontFamily: 'var(--font-header)',
    }}>
      <Lock size={42} color="#00f0ff" />
      <div style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '3px', marginTop: '8px' }}>
        ORBITAL DEFENSE ARCHITECTURE
      </div>
      <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '4px' }}>
        DOCUMENT ID: #NS-9041-CLASSIFIED
      </div>

      {/* Stamp */}
      <div style={{
        position: 'absolute', transform: 'rotate(-20deg)', border: '4px double #ff0044',
        padding: '8px 20px', color: '#ff0044', fontSize: '24px', fontWeight: 900, letterSpacing: '5px',
        boxShadow: '0 0 20px #ff0044', background: 'rgba(0,0,0,0.7)',
      }}>
        TOP SECRET
      </div>
    </div>
  );
}

/**
 * 5. NEURAL NETWORK TRACING (Key 5)
 */
export function NeuralTraceWindow() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%', padding: '12px',
      background: '#00040a', border: '1px solid #00ff66', fontFamily: 'var(--font-mono)',
    }}>
      <div style={{ fontSize: '10px', fontWeight: 800, color: '#00ff66', display: 'flex', justifyContent: 'space-between' }}>
        <span>NEURAL SYNAPSE TRACER</span>
        <span>SYNAPSE: 8,420/sec</span>
      </div>
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="100%" height="100%" viewBox="0 0 300 180">
          <line x1="50" y1="50" x2="150" y2="90" stroke="#00ff66" strokeWidth="1.5" strokeDasharray="4 2" />
          <line x1="150" y1="90" x2="250" y2="40" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="4 2" />
          <line x1="150" y1="90" x2="220" y2="140" stroke="#00ff66" strokeWidth="1.5" />
          <line x1="50" y1="130" x2="150" y2="90" stroke="#00f0ff" strokeWidth="1" />
          <circle cx="50" cy="50" r="8" fill="#00ff66" />
          <circle cx="150" cy="90" r="12" fill="#00f0ff" />
          <circle cx="250" cy="40" r="7" fill="#00ff66" />
          <circle cx="220" cy="140" r="9" fill="#ff0044" />
          <circle cx="50" cy="130" r="6" fill="#00ff66" />
        </svg>
      </div>
      <div style={{ fontSize: '8px', color: '#00ff66', textAlign: 'center' }}>● NEURAL MAP LOADED</div>
    </div>
  );
}

/**
 * 6. COMPILING CODE (Key 6)
 */
export function CompilingCodeWindow() {
  const [logs, setLogs] = useState(['[INIT] GCC Compiler v13.2.0...']);

  useEffect(() => {
    const list = [
      '[OK] Parsing AST syntax tree...',
      '[OK] Linking libpthread.so.0...',
      '[OK] Injecting ring-0 kernel bypass...',
      '[OK] Optimizing AVX-512 routines...',
      '[OK] Binary compilation complete. Output: /tmp/exploit.bin',
    ];
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < list.length) {
        setLogs(prev => [...prev, list[idx]]);
        idx++;
      }
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%', padding: '10px',
      background: '#000', border: '1px solid #00f0ff', color: '#00f0ff', fontFamily: 'var(--font-mono)', fontSize: '10px',
    }}>
      <div style={{ fontWeight: 800, borderBottom: '1px solid rgba(0,240,255,0.2)', paddingBottom: '4px', marginBottom: '6px' }}>
        BUILD TARGET: EXPLOIT_CORE.BIN
      </div>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {logs.map((l, i) => (
          <div key={i} style={{ color: l.includes('OK') ? '#00ff66' : '#00f0ff' }}>{l}</div>
        ))}
      </div>
    </div>
  );
}

/**
 * 7. INSTALLING MALWARE (Key 7)
 */
export function InstallingMalwareWindow() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 5;
      });
    }, 180);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      height: '100%', padding: '16px', background: '#080004', border: '1px solid #ff0044',
      color: '#ff0044', fontFamily: 'var(--font-mono)', textAlign: 'center',
    }}>
      <Skull size={40} color="#ff0044" style={{ filter: 'drop-shadow(0 0 10px #ff0044)' }} />
      <div style={{ fontSize: '12px', fontWeight: 900, marginTop: '8px' }}>
        {progress >= 100 ? '✅ MALWARE INSTALLED' : 'INSTALLING ROOTKIT TROJAN...'}
      </div>
      <div className="cyber-progress-track" style={{ width: '80%', margin: '12px 0' }}>
        <div className="cyber-progress-bar" style={{ width: `${progress}%`, background: '#ff0044' }} />
      </div>
      <div style={{ fontSize: '9px', color: '#ffffff' }}>PROGRESS: {progress}%</div>
    </div>
  );
}

/**
 * 8. DOWNLOADING CONFIDENTIAL DATA (Key 8)
 */
export function DownloadingDataWindow() {
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => setProgress(p => (p >= 100 ? 100 : p + 4)), 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%', padding: '12px',
      background: '#00040a', border: '1px solid #00ff66', fontFamily: 'var(--font-mono)', color: '#00ff66',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <Download size={16} color="#00ff66" />
        <span style={{ fontSize: '11px', fontWeight: 800 }}>EXFILTRATING VAULT DATA</span>
      </div>
      <div className="cyber-progress-track" style={{ marginBottom: '8px' }}>
        <div className="cyber-progress-bar" style={{ width: `${progress}%`, background: '#00ff66' }} />
      </div>
      <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
        FILE: <span style={{ color: '#ffffff' }}>cia_prism_telemetry_2026.tar.gz</span> ({progress}%)
      </div>
    </div>
  );
}

/**
 * 9. SATELLITE CONNECTION (Key 9)
 */
export function SatelliteConnectionWindow() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setStep(s => (s < 3 ? s + 1 : 3)), 800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      height: '100%', padding: '12px', background: '#00040a', border: '1px solid #00f0ff',
      color: '#00f0ff', fontFamily: 'var(--font-mono)', textAlign: 'center',
    }}>
      <Radio size={36} color="#00f0ff" style={{ animation: 'radarSweep 4s linear infinite' }} />
      <div style={{ fontSize: '12px', fontWeight: 900, marginTop: '8px' }}>
        {step < 3 ? 'ESTABLISHING ORBITAL LINK...' : '✅ SATELLITE KH-11 CONNECTED'}
      </div>
      <div style={{ fontSize: '9px', color: '#00ff66', marginTop: '6px' }}>
        SAT-01: {step >= 1 ? 'ONLINE' : 'SEARCHING'} • SAT-02: {step >= 2 ? 'ONLINE' : 'SEARCHING'} • SAT-03: {step >= 3 ? 'LOCKED' : 'SEARCHING'}
      </div>
    </div>
  );
}

/**
 * 10. LOCATING IP / TRACKING (Key 0)
 */
export function LocatingIPWindow() {
  const [status, setStatus] = useState('LOCATING TARGET NODE...');

  useEffect(() => {
    const t1 = setTimeout(() => setStatus('TRACKING IP: 185.220.101.47'), 1000);
    const t2 = setTimeout(() => setStatus('LOCATION FOUND: FRANKFURT, DE'), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      height: '100%', padding: '16px', background: '#000', border: '1px solid #ffcc00',
      color: '#ffcc00', fontFamily: 'var(--font-mono)', textAlign: 'center',
    }}>
      <Search size={36} color="#ffcc00" />
      <div style={{ fontSize: '12px', fontWeight: 900, marginTop: '10px', letterSpacing: '1px' }}>
        {status}
      </div>
      <div style={{ fontSize: '8px', color: 'var(--text-muted)', marginTop: '6px' }}>
        NODES TRAVERSED: 14 • LATENCY: 12ms
      </div>
    </div>
  );
}
