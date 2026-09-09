import React, { useState } from 'react';
import { Search, UserCheck, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

const TARGETS = [
  { id: 'RED_091', alias: 'CYBER_PHANTOM', crime: 'GLOBAL MAINFRAME INFILTRATION', bounty: '$5,000,000', threat: 'RED NOTICE', location: 'EASTERN EUROPE' },
  { id: 'RED_042', alias: 'ZERO_DAY_ZERO', crime: 'CRYPTOGRAPHIC KEY THEFT', bounty: '$2,500,000', threat: 'HIGH RISK', location: 'SOUTHEAST ASIA' },
  { id: 'RED_108', alias: 'SATCOM_GHOST', crime: 'MILITARY SATELLITE HIJACK', bounty: '$10,000,000', threat: 'EXTREME', location: 'OFFSHORE GRID' },
];

export function InterpolDatabase() {
  const [selectedTarget, setSelectedTarget] = useState(TARGETS[0]);
  const [warrantIssued, setWarrantIssued] = useState(false);

  const handleIssueWarrant = () => {
    setWarrantIssued(true);
    setTimeout(() => setWarrantIssued(false), 3000);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'rgba(2, 6, 16, 0.95)',
      fontFamily: 'var(--font-mono)',
      padding: '12px',
      gap: '10px',
    }}>
      {/* Search Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 10px',
        background: 'rgba(0, 240, 255, 0.05)',
        border: '1px solid rgba(0, 240, 255, 0.2)',
        borderRadius: '3px',
      }}>
        <Search size={14} color="#00f0ff" />
        <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 800 }}>
          INTERPOL RED NOTICE DATABASE // 2,847 MATCHES
        </span>
      </div>

      {/* Target Selector List */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {TARGETS.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTarget(t)}
            style={{
              flex: 1,
              padding: '6px',
              background: selectedTarget.id === t.id ? 'rgba(255, 0, 68, 0.2)' : 'rgba(0,0,0,0.4)',
              border: `1px solid ${selectedTarget.id === t.id ? '#ff0044' : 'rgba(0, 240, 255, 0.15)'}`,
              color: selectedTarget.id === t.id ? '#ffffff' : '#00f0ff',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '9px',
              fontWeight: 800,
            }}
          >
            {t.alias}
          </button>
        ))}
      </div>

      {/* Target Profile Card */}
      <div style={{
        flex: 1,
        background: 'rgba(0, 0, 0, 0.6)',
        border: '1px solid rgba(0, 255, 102, 0.2)',
        borderRadius: '4px',
        padding: '12px',
        display: 'flex',
        gap: '12px',
      }}>
        {/* Silhouette Mugshot */}
        <div style={{
          width: '85px',
          height: '100px',
          background: 'linear-gradient(135deg, rgba(0,255,102,0.1) 0%, rgba(0,240,255,0.05) 100%)',
          border: '1px solid #00ff66',
          borderRadius: '3px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          boxShadow: '0 0 15px rgba(0,255,102,0.2)',
        }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#00ff66', opacity: 0.6 }} />
          <div style={{ width: '50px', height: '30px', borderRadius: '15px 15px 0 0', background: '#00ff66', opacity: 0.6 }} />
          <span style={{ fontSize: '7px', color: '#00ff66', fontWeight: 800 }}>CLASSIFIED</span>
        </div>

        {/* Profile Info */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 900, color: '#ff0044' }}>{selectedTarget.alias}</div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>ID: {selectedTarget.id}</div>
          </div>

          <div style={{ fontSize: '9px', color: '#00ff66', fontWeight: 700 }}>
            OFFENSE: <span style={{ color: '#ffffff' }}>{selectedTarget.crime}</span>
          </div>

          <div style={{ fontSize: '9px', color: '#00f0ff', fontWeight: 700 }}>
            BOUNTY: <span style={{ color: '#ffcc00', fontWeight: 900 }}>{selectedTarget.bounty}</span>
          </div>

          <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
            LAST SEEN: <span style={{ color: '#00ff66' }}>{selectedTarget.location}</span>
          </div>
        </div>
      </div>

      {warrantIssued && (
        <div style={{
          padding: '6px',
          background: 'rgba(0,255,102,0.15)',
          border: '1px solid #00ff66',
          color: '#00ff66',
          fontSize: '9px',
          fontWeight: 800,
          textAlign: 'center',
        }}>
          ✓ RED NOTICE ARREST WARRANT TRANSMITTED TO INTERPOL LIONNET
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleIssueWarrant}
        style={{
          padding: '8px',
          background: 'linear-gradient(135deg, rgba(255,0,68,0.3) 0%, rgba(255,0,68,0.1) 100%)',
          border: '1px solid #ff0044',
          borderRadius: '3px',
          color: '#ffffff',
          fontWeight: 900,
          fontSize: '10px',
          cursor: 'pointer',
          letterSpacing: '1px',
        }}
      >
        TRANSMIT RED NOTICE ARREST WARRANT
      </button>
    </div>
  );
}
