import React, { useEffect, useRef, useState } from 'react';
import { Activity, Zap, Shield, Radio, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

const STATUS_COLORS = {
  STABLE: '#00ff88',
  RUNNING: '#00e5ff',
  SYNCED: '#3d6fff',
  ACTIVE: '#00e5ff',
  HIGH: '#ff6600',
  SECURE: '#00ff88',
  PASS: '#00ff88',
  ERROR: '#ff003c',
};

const EVENT_ICONS = {
  'SIGNAL DETECTED': <Radio size={9} />,
  'FIREWALL SCAN': <Shield size={9} />,
  'AI MATRIX STABLE': <Activity size={9} />,
  'AREA SCAN COMPLETE': <Zap size={9} />,
  'DEEP ANALYSIS ACTIVE': <AlertTriangle size={9} />,
  'ANALYSIS COMPLETE': <CheckCircle2 size={9} />,
};

export function LiveEventFeed() {
  const { eventFeed } = useSimulation();
  const scrollRef = useRef(null);
  const [ticker, setTicker] = useState(0);

  // Auto scroll on new events
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [eventFeed]);

  // Subtle pulse ticker for the live indicator
  useEffect(() => {
    const t = setInterval(() => setTicker(prev => prev + 1), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      height: '34px',
      background: 'linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(2,6,16,0.97) 50%, rgba(0,0,0,0.95) 100%)',
      borderTop: '1px solid rgba(0,229,255,0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '0',
      fontSize: '10px',
      fontFamily: 'var(--font-mono)',
      overflow: 'hidden',
      zIndex: 90,
      flexShrink: 0,
      position: 'relative',
    }}>
      {/* Top highlight line */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.5), rgba(0,255,136,0.3), rgba(0,229,255,0.5), transparent)',
        animation: 'edgeFlowReverse 4s linear infinite',
        backgroundSize: '200% 100%',
      }} />

      {/* Left label badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '0 12px',
        borderRight: '1px solid rgba(0,229,255,0.12)',
        height: '100%',
        background: 'rgba(0,229,255,0.04)',
        flexShrink: 0,
      }}>
        {/* Live pulsing dot */}
        <div style={{
          width: '6px', height: '6px',
          borderRadius: '50%',
          background: ticker % 2 === 0 ? '#00ff88' : '#00e5ff',
          boxShadow: ticker % 2 === 0 ? '0 0 8px #00ff88' : '0 0 8px #00e5ff',
          transition: 'all 0.5s ease',
        }} />
        <span style={{
          fontFamily: 'var(--font-header)',
          fontSize: '9px',
          letterSpacing: '2px',
          color: 'var(--electric-cyan)',
          fontWeight: 700,
          whiteSpace: 'nowrap',
        }}>
          LIVE FEED
        </span>
      </div>

      {/* Scrolling event feed */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0',
          overflowX: 'auto',
          flex: 1,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        className="no-scrollbar"
      >
        {eventFeed.slice(0, 12).map((item, idx) => {
          const statusColor = STATUS_COLORS[item.status] || '#00e5ff';
          const icon = EVENT_ICONS[item.event];

          return (
            <React.Fragment key={item.id}>
              {/* Separator */}
              {idx > 0 && (
                <div style={{
                  width: '1px', height: '16px',
                  background: 'linear-gradient(180deg, transparent, rgba(0,229,255,0.2), transparent)',
                  flexShrink: 0,
                  margin: '0 10px',
                }} />
              )}

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0 8px',
                flexShrink: 0,
                animation: idx === 0 ? 'fadeSlideDown 0.3s ease' : 'none',
              }}>
                {/* Timestamp */}
                <span style={{ color: 'rgba(0,229,255,0.25)', fontSize: '9px' }}>
                  {item.timestamp}
                </span>

                {/* Event icon + name */}
                <span style={{
                  color: '#00e5ff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  opacity: 0.8,
                  fontSize: '9px',
                  letterSpacing: '0.5px',
                }}>
                  {icon && <span style={{ color: '#00e5ff' }}>{icon}</span>}
                  {item.event}
                </span>

                {/* Target */}
                <span style={{
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '10px',
                  textShadow: '0 0 6px rgba(255,255,255,0.3)',
                }}>
                  {item.target}
                </span>

                {/* Status badge */}
                <span style={{
                  fontSize: '8px',
                  padding: '1px 5px',
                  background: `${statusColor}10`,
                  border: `1px solid ${statusColor}30`,
                  borderRadius: '2px',
                  color: statusColor,
                  textShadow: `0 0 6px ${statusColor}`,
                  letterSpacing: '0.5px',
                  fontWeight: 700,
                }}>
                  {item.status}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Right: system data */}
      <div style={{
        padding: '0 12px',
        borderLeft: '1px solid rgba(0,229,255,0.12)',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexShrink: 0,
        background: 'rgba(0,255,136,0.02)',
      }}>
        <span style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
          EVENTS: <span style={{ color: '#00e5ff' }}>{eventFeed.length}</span>
        </span>
        <span style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
          STATUS: <span style={{ color: '#00ff88', textShadow: '0 0 6px rgba(0,255,136,0.6)' }}>SECURE</span>
        </span>
      </div>
    </div>
  );
}
