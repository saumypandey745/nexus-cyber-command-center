import React, { useState } from 'react';
import { Folder, FileText, ShieldAlert, Download, Terminal, X, Check, Lock } from 'lucide-react';

const FOLDER_CONTENTS = {
  EXPLOITS_VAULT: [
    { name: 'zero_day_bypass_v4.py', size: '14.2 KB', type: 'PYTHON', status: 'READY', desc: 'Kernel Ring-0 privilege escalation payload' },
    { name: 'sql_injection_payloads.txt', size: '1.8 MB', type: 'TEXT', status: 'LOADED', desc: '14,000+ SQLi vectors for bypass' },
    { name: 'rsa_factorization_gpu.cl', size: '84.1 KB', type: 'OPENCL', status: 'READY', desc: 'OpenCL parallel prime factorizer' },
    { name: 'satellite_uplink_hijack.sh', size: '3.4 KB', type: 'SHELL', status: 'ACTIVE', desc: 'Orbital satcom intercept script' },
    { name: 'memdump_lsass.dmp', size: '42.8 MB', type: 'DUMP', status: 'PARSED', desc: 'NTLM hashes & Kerberos tickets' },
  ],
  TARGET_DATABASE: [
    { name: 'classified_targets.json', size: '89.4 KB', type: 'JSON', status: 'SYNCHRONIZED', desc: '1,420 high-value target IPs & telemetry' },
    { name: 'leaked_credentials_db.sqlite', size: '640.2 MB', type: 'SQLITE', status: 'INDEXED', desc: '84.2M email:pass combos from darknet dumps' },
    { name: 'defense_pentagon_grid.xml', size: '412.0 KB', type: 'XML', status: 'ENCRYPTED', desc: 'MILNET node topology map' },
    { name: 'swift_banking_matrix.csv', size: '12.5 MB', type: 'CSV', status: 'VERIFIED', desc: 'International wire routing paths' },
  ],
  SYSTEM_LOGS: [
    { name: 'auth_audit_2026.log', size: '8.4 MB', type: 'LOG', status: 'MONITORED', desc: 'SSH & PAM authentication logs' },
    { name: 'kernel_panic_dump.bin', size: '512.0 KB', type: 'BIN', status: 'COMPACTED', desc: 'Core crash dump analysis' },
    { name: 'threat_events_realtime.stream', size: '∞ KB', type: 'STREAM', status: 'LIVE', desc: 'Realtime SOC event packet captures' },
  ],
  CLASSIFIED_OPS: [
    { name: 'op_blackout_v7.enc', size: '256.0 KB', type: 'ENCRYPTED', status: 'CLASSIFIED', desc: 'Operation BLACKOUT mission parameters' },
    { name: 'agent_roster_omega.db', size: '4.8 MB', type: 'SQLITE', status: 'TOP SECRET', desc: 'Omega clearance agent identity matrix' },
    { name: 'satellite_vector_map.kml', size: '14.2 MB', type: 'KML', status: 'ACTIVE', desc: 'Global satellite coverage operational zones' },
    { name: 'cyberweapon_payload_x9.bin', size: '88.4 KB', type: 'BIN', status: 'ARMED', desc: 'Autonomous network disruption payload' },
    { name: 'communications_intercept.pcap', size: '2.1 GB', type: 'PCAP', status: 'ANALYZED', desc: 'Encrypted SIGINT packet capture 2026-Q3' },
    { name: 'protocol_17_override.sh', size: '3.2 KB', type: 'SHELL', status: 'STANDBY', desc: 'Emergency override of Protocol 17' },
    { name: 'biometric_id_spoof.py', size: '9.8 KB', type: 'PYTHON', status: 'READY', desc: 'Neural biometric ID spoofing module' },
  ],
};

export function DesktopFolderModal({ folderKey, folderName, onClose, onExecuteFile }) {
  const files = FOLDER_CONTENTS[folderKey] || FOLDER_CONTENTS.EXPLOITS_VAULT;
  const [selectedFile, setSelectedFile] = useState(files[0]);
  const [executing, setExecuting] = useState(false);
  const [logMessage, setLogMessage] = useState('');

  const handleRun = (file) => {
    setExecuting(true);
    setLogMessage(`Executing ${file.name}...`);
    setTimeout(() => {
      setLogMessage(`SUCCESS: ${file.name} injected into kernel space.`);
      setTimeout(() => {
        setExecuting(false);
      }, 1200);
    }, 1000);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(10px)',
      zIndex: 3000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div className="cyber-panel" style={{
        width: '680px',
        maxWidth: '95vw',
        height: '460px',
        maxHeight: '90vh',
        border: '1px solid #00ff66',
        boxShadow: '0 0 40px rgba(0,255,102,0.3)',
      }}>
        {/* Header */}
        <div className="cyber-panel-header" style={{ background: 'linear-gradient(90deg, rgba(0,255,102,0.2) 0%, transparent 100%)' }}>
          <div className="panel-title" style={{ color: '#00ff66', fontWeight: 800 }}>
            <Folder size={14} color="#00ff66" />
            <span>DIRECTORY // {folderName || folderKey}</span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#ff0044', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          {/* File list */}
          <div style={{
            width: '55%',
            borderRight: '1px solid rgba(0,240,255,0.15)',
            padding: '10px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            background: 'rgba(0,4,10,0.6)',
          }}>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '4px' }}>
              SELECT FILE TO INSPECT / EXECUTE:
            </div>
            {files.map((file, i) => {
              const isSel = selectedFile?.name === file.name;
              return (
                <div
                  key={i}
                  onClick={() => setSelectedFile(file)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '3px',
                    background: isSel
                      ? 'linear-gradient(90deg, rgba(0,255,102,0.25) 0%, rgba(0,240,255,0.1) 100%)'
                      : 'rgba(0,240,255,0.03)',
                    border: `1px solid ${isSel ? '#00ff66' : 'rgba(0,240,255,0.1)'}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={14} color={isSel ? '#00ff66' : '#00f0ff'} />
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: isSel ? '#ffffff' : '#00ff66' }}>
                        {file.name}
                      </div>
                      <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                        {file.size} • {file.type}
                      </div>
                    </div>
                  </div>
                  <span className="cyber-badge cyber-badge-green" style={{ fontSize: '8px' }}>
                    {file.status}
                  </span>
                </div>
              );
            })}
          </div>

          {/* File Inspector details */}
          <div style={{
            width: '45%',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            background: 'rgba(0,2,8,0.85)',
          }}>
            {selectedFile ? (
              <>
                <div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '1px' }}>FILE PROPERTIES</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#00ff66', marginTop: '2px' }}>
                    {selectedFile.name}
                  </div>
                </div>

                <div className="metric-card" style={{ background: 'rgba(0,255,102,0.04)' }}>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>DESCRIPTION</div>
                  <div style={{ fontSize: '11px', color: '#00f0ff', marginTop: '3px', fontWeight: 600 }}>
                    {selectedFile.desc}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div className="metric-card">
                    <div style={{ fontSize: '8px', color: 'var(--text-muted)' }}>FILE SIZE</div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#ffffff' }}>{selectedFile.size}</div>
                  </div>
                  <div className="metric-card">
                    <div style={{ fontSize: '8px', color: 'var(--text-muted)' }}>FORMAT</div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#00ff66' }}>{selectedFile.type}</div>
                  </div>
                </div>

                {logMessage && (
                  <div style={{
                    padding: '8px',
                    borderRadius: '3px',
                    background: 'rgba(0,255,102,0.1)',
                    border: '1px solid #00ff66',
                    fontSize: '10px',
                    color: '#00ff66',
                    fontWeight: 700,
                  }}>
                    {logMessage}
                  </div>
                )}

                <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                  <button
                    className="cyber-btn cyber-btn-active"
                    onClick={() => handleRun(selectedFile)}
                    disabled={executing}
                    style={{ flex: 1, justifyContent: 'center', background: '#00ff6622', borderColor: '#00ff66', color: '#00ff66', fontWeight: 800 }}
                  >
                    <Terminal size={12} />
                    <span>{executing ? 'RUNNING...' : 'EXECUTE FILE'}</span>
                  </button>
                </div>
              </>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '11px', textAlign: 'center', marginTop: '40px' }}>
                Select a file to inspect details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
