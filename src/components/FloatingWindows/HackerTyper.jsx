import React, { useEffect, useRef, useState } from 'react';

/**
 * NEXUS Hacker Typer — Auto-types realistic code while you type anything
 * Press any key to "hack"
 */

const CODE_SNIPPETS = [
  `#!/usr/bin/env python3\nimport socket, struct, sys\nfrom scapy.all import *\n\nTARGET = "185.220.101.47"\nPORT = 22\n\ndef syn_flood(target, port):\n    ip = IP(dst=target)\n    tcp = TCP(sport=RandShort(), dport=port, flags="S")\n    pkt = ip/tcp\n    send(pkt, loop=1, verbose=0)\n\nprint("[*] Launching SYN flood...")\nsyn_flood(TARGET, PORT)\n`,
  `// NEXUS Neural Cracker v4.2\nconst crypto = require('crypto');\nconst { exec } = require('child_process');\n\nasync function crack(hash) {\n  const rainbow = await loadTable('./rainbow_128gb.db');\n  for (const entry of rainbow) {\n    if (crypto.createHash('sha512')\n      .update(entry).digest('hex') === hash) {\n      return entry;\n    }\n  }\n}\n`,
  `KERNEL BYPASS MODULE v3.7\n==========================\nProbing ring-0 access...\nPTI disabled: YES\nSMEP bypass: LOADED\nKASLR leak: 0xffffffff81200000\nPrivilege escalation: ROOT\nShell spawned: /bin/bash -i\n`,
  `SELECT u.username, u.password_hash, u.email,\n       a.clearance_level, a.access_token\nFROM users u\nINNER JOIN agent_credentials a ON u.id = a.user_id\nWHERE a.clearance_level >= 4\n  AND u.last_login > NOW() - INTERVAL 30 DAY\nORDER BY a.clearance_level DESC;\n-- Rows: 2,847 | Runtime: 0.003s | Status: 200 OK\n`,
  `[NEXUS] RSA-4096 DECRYPT\nKey: 0x4A3F891BC2E8D0F7\n>>> Factoring modulus...\n>>> p = 1099511627791 (prime)\n>>> q = 1099511627813 (prime)\n>>> phi = (p-1)*(q-1)\n>>> d = modular_inverse(e, phi)\n>>> PLAINTEXT: "QUANTUM_ACCESS_GRANTED"\n>>> Decryption complete in 0.847s\n`,
  `nmap -A -T4 -p- --script vuln 185.220.101.47\nStarting Nmap 7.94 ( https://nmap.org )\n22/tcp  open  ssh     OpenSSH 8.9p1\n80/tcp  open  http    nginx 1.22.1\n443/tcp open  https   nginx 1.22.1\n3306/tcp open  mysql  MySQL 8.0.35\n\nCVE-2023-20198 DETECTED: CRITICAL 10.0\nCVE-2023-44487 DETECTED: HIGH 7.5\nMSFVENOM payload injected: shell.php\n`,
];

export function HackerTyper() {
  const [displayedCode, setDisplayedCode] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [keyCount, setKeyCount] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [glitch, setGlitch] = useState(false);
  const outputRef = useRef(null);

  const fullCode = CODE_SNIPPETS[snippetIndex % CODE_SNIPPETS.length];

  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      setIsActive(true);
      setKeyCount(prev => prev + 1);
      setGlitch(true);
      setTimeout(() => setGlitch(false), 80);

      setCharIndex(prev => {
        const nextIdx = prev + Math.floor(Math.random() * 3) + 1;
        if (nextIdx >= fullCode.length) {
          setSnippetIndex(si => si + 1);
          setDisplayedCode('');
          return 0;
        }
        setDisplayedCode(fullCode.slice(0, nextIdx));
        return nextIdx;
      });
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [fullCode]);

  // Auto-scroll
  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [displayedCode]);

  return (
    <div style={{
      display:'flex', flexDirection:'column', height:'100%',
      fontFamily:'var(--font-mono)', fontSize:'12px',
      background:'rgba(0,0,0,0.9)',
    }}>
      {/* Top bar */}
      <div style={{
        padding:'6px 10px', borderBottom:'1px solid rgba(0,229,255,0.1)',
        display:'flex', justifyContent:'space-between', alignItems:'center',
        background:'rgba(0,229,255,0.04)', flexShrink:0,
      }}>
        <div style={{ display:'flex', gap:'12px', fontSize:'9px' }}>
          <span style={{ color:'var(--text-muted)' }}>KEYS: <span style={{ color:'#00e5ff' }}>{keyCount}</span></span>
          <span style={{ color:'var(--text-muted)' }}>FILE: <span style={{ color:'#00ff88' }}>{['nexus_exploit.py','cracker.js','kernel.c','sql_dump.sql','rsa_break.py','nmap_scan.sh'][snippetIndex % 6]}</span></span>
          <span style={{ color:'var(--text-muted)' }}>MODE: <span style={{ color:'#ffb300' }}>STEALTH</span></span>
        </div>
        <div style={{
          fontSize:'9px', color: isActive ? '#00ff88' : 'var(--text-muted)',
          animation: isActive ? 'glowPulseGreen 1s infinite' : 'none',
        }}>
          {isActive ? '● HACKING...' : '○ READY — PRESS ANY KEY'}
        </div>
      </div>

      {/* Code output */}
      <div
        ref={outputRef}
        style={{
          flex:1, padding:'12px', overflowY:'auto',
          whiteSpace:'pre-wrap', wordBreak:'break-all',
          lineHeight:1.6, fontSize:'12px',
          filter: glitch ? 'brightness(2) hue-rotate(60deg)' : 'none',
          transition:'filter 0.05s',
        }}
      >
        {displayedCode.split('\n').map((line, i) => (
          <div key={i} style={{
            color: line.startsWith('#') || line.startsWith('//') || line.startsWith('[')
              ? '#00ff88'
              : line.includes('ERROR') || line.includes('CRITICAL')
              ? '#ff0044'
              : line.includes('SUCCESS') || line.includes('GRANTED') || line.includes('open')
              ? '#00ff66'
              : line.match(/^\d/)
              ? '#ffcc00'
              : '#00f0ff',
            fontWeight: 700,
            textShadow: line.includes('GRANTED') || line.includes('CRITICAL') ? '0 0 10px currentColor' : '0 0 4px rgba(0,255,102,0.3)',
            minHeight: '1.6em',
          }}>
            {line}
          </div>
        ))}
        <span className="blinking-cursor" />
      </div>

      {/* Bottom hint */}
      {!isActive && (
        <div style={{ padding:'8px', textAlign:'center', fontSize:'10px', color:'rgba(0,229,255,0.3)', letterSpacing:'1px', borderTop:'1px solid rgba(0,229,255,0.06)' }}>
          ⌨ TYPE ANYTHING TO BEGIN HACKING
        </div>
      )}
    </div>
  );
}
