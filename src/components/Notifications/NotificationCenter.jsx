import React from 'react';
import { AlertCircle, CheckCircle2, Info, Bell } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export function NotificationCenter() {
  const { notifications } = useSimulation();

  if (!notifications.length) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '64px',
      right: '16px',
      zIndex: 9990,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      maxWidth: '340px',
      width: '100%',
      pointerEvents: 'none'
    }}>
      {notifications.map((notif) => {
        const isCritical = notif.type === 'critical' || notif.type === 'alert';
        const isSuccess = notif.type === 'success';

        return (
          <div
            key={notif.id}
            className="glitch-screen-active"
            style={{
              backgroundColor: isCritical ? 'rgba(255, 0, 85, 0.9)' : (isSuccess ? 'rgba(0, 51, 20, 0.95)' : 'rgba(6, 15, 28, 0.95)'),
              border: `1px solid ${isCritical ? 'var(--alert-red)' : (isSuccess ? 'var(--neon-green)' : 'var(--electric-cyan)')}`,
              boxShadow: `0 0 15px ${isCritical ? 'var(--alert-red-glow)' : 'var(--electric-cyan-glow)'}`,
              borderRadius: '3px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              color: '#fff',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              backdropFilter: 'blur(8px)',
              pointerEvents: 'auto'
            }}
          >
            {isCritical ? (
              <AlertCircle size={18} color="#fff" style={{ flexShrink: 0, marginTop: '1px' }} />
            ) : isSuccess ? (
              <CheckCircle2 size={18} color="var(--neon-green)" style={{ flexShrink: 0, marginTop: '1px' }} />
            ) : (
              <Bell size={18} color="var(--electric-cyan)" style={{ flexShrink: 0, marginTop: '1px' }} />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '2px' }}>
                [{notif.timestamp}] SYSTEM NOTIFICATION
              </div>
              <div style={{ fontWeight: 600 }}>{notif.text}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
