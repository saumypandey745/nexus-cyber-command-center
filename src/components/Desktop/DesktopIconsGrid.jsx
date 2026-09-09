import React, { useState } from 'react';
import { DesktopFolderModal } from './DesktopFolderModal';
import {
  Folder, Lock, Hash, Terminal, Globe, AlertTriangle, Video, ShieldCheck, FileCode, Cpu
} from 'lucide-react';

const DESKTOP_ITEMS = [
  {
    id: 'folder_exploits',
    type: 'folder',
    folderKey: 'EXPLOITS_VAULT',
    title: 'EXPLOITS_VAULT',
    icon: <Folder size={24} color="#00ff66" />,
    badge: '5 FILES',
    color: '#00ff66',
  },
  {
    id: 'folder_targets',
    type: 'folder',
    folderKey: 'TARGET_DATABASE',
    title: 'TARGET_DATABASE',
    icon: <Folder size={24} color="#00f0ff" />,
    badge: '4 FILES',
    color: '#00f0ff',
  },
  {
    id: 'folder_logs',
    type: 'folder',
    folderKey: 'SYSTEM_LOGS',
    title: 'SYSTEM_LOGS',
    icon: <Folder size={24} color="#ffcc00" />,
    badge: '3 LOGS',
    color: '#ffcc00',
  },
  {
    id: 'app_password',
    type: 'app',
    windowId: 'password_cracker',
    title: 'PASS_CRACKER.exe',
    icon: <Lock size={22} color="#ff0044" />,
    badge: 'TOOL',
    color: '#ff0044',
  },
  {
    id: 'app_miner',
    type: 'app',
    windowId: 'bitcoin_miner',
    title: 'BTC_MINER.exe',
    icon: <Hash size={22} color="#ffcc00" />,
    badge: 'CRYPTO',
    color: '#ffcc00',
  },
  {
    id: 'app_typer',
    type: 'app',
    windowId: 'hacker_typer',
    title: 'HACKER_TYPER.sh',
    icon: <Terminal size={22} color="#00ff66" />,
    badge: 'SHELL',
    color: '#00ff66',
  },
  {
    id: 'app_tracer',
    type: 'app',
    windowId: 'ip_tracer',
    title: 'IP_TRACER.bin',
    icon: <Globe size={22} color="#00f0ff" />,
    badge: 'NETWORK',
    color: '#00f0ff',
  },
  {
    id: 'app_surveillance',
    type: 'app',
    windowId: 'surveillance_feed',
    title: 'CCTV_GRID.live',
    icon: <Video size={22} color="#00ff66" />,
    badge: 'CAMERA',
    color: '#00ff66',
  },
  {
    id: 'app_nuclear',
    type: 'app',
    windowId: 'nuclear_control',
    title: 'REACTOR_04.sys',
    icon: <Cpu size={22} color="#ff0044" />,
    badge: 'NUCLEAR',
    color: '#ff0044',
  },
  {
    id: 'app_interpol',
    type: 'app',
    windowId: 'interpol_db',
    title: 'INTERPOL_RED.db',
    icon: <FileCode size={22} color="#00f0ff" />,
    badge: 'WANTED',
    color: '#00f0ff',
  },
  {
    id: 'app_self_destruct',
    type: 'app',
    windowId: 'self_destruct',
    title: 'SELF_DESTRUCT.exe',
    icon: <AlertTriangle size={22} color="#ff0044" />,
    badge: 'DANGER',
    color: '#ff0044',
  },
];

export function DesktopIconsGrid({ onOpenWindow }) {
  const [selectedId, setSelectedId] = useState(null);
  const [activeFolder, setActiveFolder] = useState(null);

  const handleClick = (item) => {
    setSelectedId(item.id);
  };

  const handleDoubleClick = (item) => {
    if (item.type === 'folder') {
      setActiveFolder(item);
    } else if (item.type === 'app' && onOpenWindow) {
      onOpenWindow(item.windowId);
    }
  };

  return (
    <>
      {/* Desktop Grid Layout */}
      <div style={{
        position: 'fixed',
        top: '48px', // Below header
        right: '16px',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        gap: '14px',
        zIndex: 50,
        pointerEvents: 'auto',
      }}>
        {DESKTOP_ITEMS.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <div
              key={item.id}
              onClick={() => handleClick(item)}
              onDoubleClick={() => handleDoubleClick(item)}
              style={{
                width: '100px',
                padding: '8px 6px',
                borderRadius: '4px',
                background: isSelected
                  ? `linear-gradient(135deg, ${item.color}25 0%, rgba(0,0,0,0.6) 100%)`
                  : 'rgba(0,4,12,0.4)',
                border: `1px solid ${isSelected ? item.color : 'rgba(0,240,255,0.12)'}`,
                backdropFilter: 'blur(10px)',
                boxShadow: isSelected
                  ? `0 0 15px ${item.color}40, inset 0 0 10px ${item.color}15`
                  : '0 2px 10px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                userSelect: 'none',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = item.color;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 0 12px ${item.color}30`;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'rgba(0,240,255,0.12)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
                }
              }}
            >
              {/* Icon Container with glowing drop-shadow */}
              <div style={{
                filter: `drop-shadow(0 0 8px ${item.color})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '28px',
              }}>
                {item.icon}
              </div>

              {/* Title */}
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.5px',
                color: isSelected ? '#ffffff' : item.color,
                textShadow: isSelected ? `0 0 8px ${item.color}` : 'none',
                textAlign: 'center',
                wordBreak: 'break-word',
                lineHeight: 1.2,
              }}>
                {item.title}
              </span>

              {/* Small Badge */}
              <span style={{
                fontSize: '7px',
                fontWeight: 800,
                color: item.color,
                background: `${item.color}15`,
                border: `1px solid ${item.color}40`,
                padding: '1px 4px',
                borderRadius: '2px',
                letterSpacing: '0.5px',
                fontFamily: 'var(--font-header)',
              }}>
                {item.badge}
              </span>
            </div>
          );
        })}
      </div>

      {/* Active Folder Modal */}
      {activeFolder && (
        <DesktopFolderModal
          folderKey={activeFolder.folderKey}
          folderName={activeFolder.title}
          onClose={() => setActiveFolder(null)}
        />
      )}
    </>
  );
}
