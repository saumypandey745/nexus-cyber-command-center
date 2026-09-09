import React, { useState } from 'react';
import { DesktopFolderModal } from './DesktopFolderModal';
import { useWindowContext } from '../../context/WindowContext';
import {
  Folder, Lock, Hash, Terminal, Globe, AlertTriangle, Video, FileCode, Cpu, Shield, Wifi, Radio
} from 'lucide-react';

const DESKTOP_ITEMS = [
  {
    id: 'folder_exploits',
    type: 'folder',
    folderKey: 'EXPLOITS_VAULT',
    title: 'EXPLOITS_VAULT',
    icon: '📁',
    iconColor: '#00ff66',
    badge: '5 FILES',
    color: '#00ff66',
  },
  {
    id: 'folder_targets',
    type: 'folder',
    folderKey: 'TARGET_DATABASE',
    title: 'TARGET_DATABASE',
    icon: '📁',
    iconColor: '#00f0ff',
    badge: '4 FILES',
    color: '#00f0ff',
  },
  {
    id: 'folder_logs',
    type: 'folder',
    folderKey: 'SYSTEM_LOGS',
    title: 'SYSTEM_LOGS',
    icon: '📁',
    iconColor: '#ffcc00',
    badge: '3 LOGS',
    color: '#ffcc00',
  },
  {
    id: 'folder_classified',
    type: 'folder',
    folderKey: 'CLASSIFIED_OPS',
    title: 'CLASSIFIED_OPS',
    icon: '📁',
    iconColor: '#ff0044',
    badge: '7 FILES',
    color: '#ff0044',
  },
  {
    id: 'app_password',
    type: 'app',
    windowId: 'password_cracker',
    title: 'PASS_CRACKER.exe',
    icon: '🔓',
    iconColor: '#ff0044',
    badge: 'TOOL',
    color: '#ff0044',
  },
  {
    id: 'app_miner',
    type: 'app',
    windowId: 'bitcoin_miner',
    title: 'BTC_MINER.exe',
    icon: '₿',
    iconColor: '#ffcc00',
    badge: 'CRYPTO',
    color: '#ffcc00',
  },
  {
    id: 'app_typer',
    type: 'app',
    windowId: 'hacker_typer',
    title: 'NEXUS_SHELL.sh',
    icon: '>_',
    iconColor: '#00ff66',
    badge: 'SHELL',
    color: '#00ff66',
  },
  {
    id: 'app_tracer',
    type: 'app',
    windowId: 'ip_tracer',
    title: 'IP_TRACER.bin',
    icon: '🌐',
    iconColor: '#00f0ff',
    badge: 'NETWORK',
    color: '#00f0ff',
  },
  {
    id: 'app_surveillance',
    type: 'app',
    windowId: 'surveillance_feed',
    title: 'CCTV_GRID.live',
    icon: '📹',
    iconColor: '#00ff66',
    badge: 'CAMERA',
    color: '#00ff66',
  },
  {
    id: 'app_nuclear',
    type: 'app',
    windowId: 'nuclear_control',
    title: 'REACTOR_04.sys',
    icon: '⚛',
    iconColor: '#ff0044',
    badge: 'NUCLEAR',
    color: '#ff0044',
  },
  {
    id: 'app_interpol',
    type: 'app',
    windowId: 'interpol_db',
    title: 'INTERPOL_RED.db',
    icon: '🎯',
    iconColor: '#00f0ff',
    badge: 'WANTED',
    color: '#00f0ff',
  },
  {
    id: 'app_self_destruct',
    type: 'app',
    windowId: 'self_destruct',
    title: 'SELF_DESTRUCT.exe',
    icon: '💣',
    iconColor: '#ff0044',
    badge: 'DANGER',
    color: '#ff0044',
  },
];

export function DesktopIconsGrid() {
  const [selectedId, setSelectedId] = useState(null);
  const [activeFolder, setActiveFolder] = useState(null);
  const { requestOpenWindow } = useWindowContext() || {};

  const handleClick = (item) => {
    setSelectedId(item.id);
  };

  const handleDoubleClick = (item) => {
    if (item.type === 'folder') {
      setActiveFolder(item);
    } else if (item.type === 'app' && requestOpenWindow) {
      requestOpenWindow(item.windowId);
    }
  };

  return (
    <>
      {/* Desktop Icon Grid — right side column, like geekprank */}
      <div style={{
        position: 'fixed',
        top: '52px',
        right: '8px',
        bottom: '72px',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        alignContent: 'flex-end',
        gap: '4px',
        padding: '6px 4px',
        zIndex: 50,
        pointerEvents: 'auto',
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollbarWidth: 'none',
        width: '88px',
      }}>
        {DESKTOP_ITEMS.map((item) => {
          const isSelected = selectedId === item.id;
          const isFolder = item.type === 'folder';
          return (
            <div
              key={item.id}
              onClick={() => handleClick(item)}
              onDoubleClick={() => handleDoubleClick(item)}
              style={{
                width: '76px',
                padding: '7px 4px 5px',
                borderRadius: '6px',
                background: isSelected
                  ? `${item.color}22`
                  : 'rgba(0,4,12,0.45)',
                border: `1px solid ${isSelected ? item.color : 'rgba(0,255,102,0.1)'}`,
                backdropFilter: 'blur(12px)',
                boxShadow: isSelected
                  ? `0 0 14px ${item.color}50, inset 0 0 8px ${item.color}12`
                  : '0 2px 8px rgba(0,0,0,0.4)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                userSelect: 'none',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = item.color;
                  e.currentTarget.style.transform = 'scale(1.06)';
                  e.currentTarget.style.boxShadow = `0 0 14px ${item.color}40`;
                  e.currentTarget.style.background = `${item.color}18`;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'rgba(0,255,102,0.1)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.4)';
                  e.currentTarget.style.background = 'rgba(0,4,12,0.45)';
                }
              }}
            >
              {/* Icon */}
              <div style={{
                fontSize: isFolder ? '26px' : '20px',
                lineHeight: 1,
                filter: `drop-shadow(0 0 6px ${item.color})`,
                color: item.iconColor,
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                textAlign: 'center',
              }}>
                {item.icon}
              </div>

              {/* Title */}
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '7.5px',
                fontWeight: 700,
                letterSpacing: '0.3px',
                color: isSelected ? '#fff' : item.color,
                textShadow: isSelected ? `0 0 6px ${item.color}` : `0 0 4px ${item.color}80`,
                textAlign: 'center',
                wordBreak: 'break-all',
                lineHeight: 1.15,
                maxWidth: '68px',
              }}>
                {item.title}
              </span>

              {/* Badge */}
              <span style={{
                fontSize: '6px',
                fontWeight: 800,
                color: item.color,
                background: `${item.color}15`,
                border: `1px solid ${item.color}35`,
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
