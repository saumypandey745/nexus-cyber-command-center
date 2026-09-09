import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useSound } from '../hooks/useSound';

const SimulationContext = createContext(null);

const INITIAL_NODES = [
  { id: 'NODE-084', type: 'MOBILE NODE', signal: 94, encryption: 'AES-256', status: 'ACTIVE', x: 0.35, y: -0.42, distance: 42, ip: '192.168.1.104', mac: '0A:4F:9C:11' },
  { id: 'NODE-112', type: 'LAPTOP NODE', signal: 87, encryption: 'RSA-4096', status: 'TRANSMITTING', x: -0.55, y: 0.28, distance: 68, ip: '192.168.1.112', mac: 'BC:88:E3:4A' },
  { id: 'NODE-209', type: 'SMART DEVICE', signal: 76, encryption: 'WPA3-SEC', status: 'ACTIVE', x: 0.62, y: 0.51, distance: 81, ip: '192.168.1.209', mac: '77:A1:FE:99' },
  { id: 'NODE-311', type: 'UNKNOWN SIGNAL', signal: 61, encryption: 'UNENCRYPTED', status: 'ANALYZING', x: -0.22, y: -0.71, distance: 95, ip: '10.0.4.88', mac: 'FF:3C:90:02' },
  { id: 'NODE-418', type: 'WORKSTATION', signal: 98, encryption: 'QUANTUM-SHIELD', status: 'SECURE', x: 0.15, y: 0.35, distance: 38, ip: '192.168.1.5', mac: 'D4:E2:11:88' },
  { id: 'NODE-502', type: 'NETWORK TERMINAL', signal: 82, encryption: 'AES-256', status: 'TRANSMITTING', x: -0.68, y: -0.31, distance: 74, ip: '172.16.0.1', mac: '1C:44:99:FF' },
  { id: 'NODE-619', type: 'MOBILE NODE', signal: 55, encryption: 'AES-128', status: 'ACTIVE', x: 0.78, y: -0.22, distance: 110, ip: '192.168.1.19', mac: '88:77:66:55' }
];

const INITIAL_LOGS = [
  { id: '1', timestamp: '13:55:01', text: 'NEXUS CORE ENGINE LOADED IN SECURE MODE', level: 'info', type: 'SYSTEM' },
  { id: '2', timestamp: '13:55:02', text: 'QUANTUM ENCRYPTION LAYER INSTANTIATED', level: 'info', type: 'SECURITY' },
  { id: '3', timestamp: '13:55:04', text: 'RADAR SIGNAL MATRIX ONLINE - 7 NODES TRACKED', level: 'success', type: 'RADAR' },
  { id: '4', timestamp: '13:55:08', text: 'AI MONITORING SUBSYSTEM ACTIVE', level: 'info', type: 'NEXUS_AI' }
];

export function SimulationProvider({ children }) {
  const [bootCompleted, setBootCompleted] = useState(false);
  const [threatLevel, setThreatLevel] = useState('GUARDED'); // LOW, GUARDED, ELEVATED, HIGH, CRITICAL
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [eventFeed, setEventFeed] = useState([
    { id: 'e1', timestamp: '13:55:10', event: 'SIGNAL DETECTED', target: 'NODE-084', status: 'STABLE' },
    { id: 'e2', timestamp: '13:55:14', event: 'AI ANALYSIS STARTED', target: 'TASK-209', status: 'RUNNING' },
    { id: 'e3', timestamp: '13:55:18', event: 'NETWORK UPDATED', target: 'MATRIX-81', status: 'SYNCED' }
  ]);
  const [notifications, setNotifications] = useState([]);
  
  const [systemMetrics, setSystemMetrics] = useState({
    activeNodes: 248,
    dataFlow: 842, // MB/s
    latency: 12, // ms
    stability: 98.4, // %
    packetCount: 142090,
    securityLayers: 7
  });

  const [activeMode, setActiveMode] = useState('NORMAL'); // NORMAL, DEEP_ANALYSIS, OVERRIDE, MINIMAL
  const [focusedModule, setFocusedModule] = useState(null); // null, 'terminal', 'radar', 'scanner', 'map', 'matrix'
  const [autoDemo, setAutoDemo] = useState(false);

  const [currentTheme, setCurrentTheme] = useState('CYBERPUNK'); // MATRIX, CYBERPUNK, AI_LAB, MILITARY, HOLLYWOOD, RETRO_CRT
  const [fxSettings, setFxSettings] = useState({
    matrixRain: true,
    crtMode: true,
    glitchMode: false,
    soundEnabled: false,
    volume: 0.5
  });

  const [glitchTrigger, setGlitchTrigger] = useState(false);

  const sound = useSound(fxSettings.soundEnabled, fxSettings.volume);

  const getFormattedTime = useCallback(() => {
    const now = new Date();
    return now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0').slice(0, 2);
  }, []);

  const addLog = useCallback((text, level = 'info', type = 'SYSTEM') => {
    const time = new Date().toTimeString().split(' ')[0];
    const newEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: time,
      text,
      level,
      type
    };
    setLogs((prev) => [...prev.slice(-150), newEntry]);
  }, []);

  const addNotification = useCallback((text, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotif = { id, text, type, timestamp: new Date().toTimeString().split(' ')[0] };
    setNotifications((prev) => [...prev.slice(-4), newNotif]);
    if (type === 'critical' || type === 'alert') {
      sound.playAlertSound();
    } else {
      sound.playClickSound();
    }

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4500);
  }, [sound, fxSettings.soundEnabled]);

  const addEventFeedItem = useCallback((event, target, status = 'ACTIVE') => {
    const time = new Date().toTimeString().split(' ')[0];
    const item = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: time,
      event,
      target,
      status
    };
    setEventFeed((prev) => [item, ...prev.slice(0, 20)]);
  }, []);

  const triggerGlitchEffect = useCallback(() => {
    setGlitchTrigger(true);
    setTimeout(() => setGlitchTrigger(false), 350);
  }, []);

  const toggleFx = useCallback((settingName) => {
    setFxSettings((prev) => ({
      ...prev,
      [settingName]: !prev[settingName]
    }));
    sound.playClickSound();
  }, [sound]);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  // Area Scan Simulation
  const triggerAreaScan = useCallback((radius = '100M') => {
    sound.playRadarPing();
    addLog(`AREA SCAN INITIALIZED [RADIUS: ${radius}]`, 'info', 'SCANNER');
    addNotification(`AREA SCAN STARTED (${radius})`, 'info');

    setTimeout(() => {
      const generatedCount = Math.floor(Math.random() * 15) + 10;
      const newNodesList = [];
      const nodeTypes = ['MOBILE NODE', 'LAPTOP NODE', 'WORKSTATION', 'SMART DEVICE', 'UNKNOWN SIGNAL'];
      const encTypes = ['AES-256', 'RSA-4096', 'QUANTUM-SHIELD', 'WPA3-SEC', 'UNENCRYPTED'];

      for (let i = 0; i < generatedCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distRatio = Math.random() * 0.85 + 0.1;
        const nodeNum = Math.floor(Math.random() * 899) + 100;
        newNodesList.push({
          id: `NODE-${nodeNum}`,
          type: nodeTypes[Math.floor(Math.random() * nodeTypes.length)],
          signal: Math.floor(Math.random() * 45) + 55,
          encryption: encTypes[Math.floor(Math.random() * encTypes.length)],
          status: Math.random() > 0.3 ? 'ACTIVE' : 'ANALYZING',
          x: Math.cos(angle) * distRatio,
          y: Math.sin(angle) * distRatio,
          distance: Math.floor(distRatio * parseInt(radius)),
          ip: `192.168.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 254)}`,
          mac: `${Math.floor(Math.random()*89+10)}:${Math.floor(Math.random()*89+10)}:${Math.floor(Math.random()*89+10)}`
        });
      }

      setNodes(newNodesList);
      addLog(`AREA SCAN COMPLETE: ${generatedCount} NODES DISCOVERED`, 'success', 'SCANNER');
      addNotification(`AREA SCAN COMPLETE: ${generatedCount} NODES DISCOVERED`, 'success');
      addEventFeedItem('AREA SCAN COMPLETE', `NODES: ${generatedCount}`, 'STABLE');
      
      setSystemMetrics((prev) => ({
        ...prev,
        activeNodes: prev.activeNodes + generatedCount - 5
      }));
    }, 1200);
  }, [addLog, addNotification, addEventFeedItem, sound]);

  // Deep Analysis Mode
  const triggerDeepAnalysis = useCallback(() => {
    setActiveMode('DEEP_ANALYSIS');
    triggerGlitchEffect();
    sound.playAlertSound();
    addLog('INITIATING DEEP ANALYSIS SEQUENCE Across ALL CHANNELS', 'warning', 'ANALYSIS');
    addNotification('DEEP ANALYSIS MODE ACTIVATED', 'alert');
    addEventFeedItem('DEEP ANALYSIS ACTIVE', 'GLOBAL MATRIX', 'HIGH');

    setTimeout(() => {
      setActiveMode('NORMAL');
      sound.playSuccessSound();
      addLog('DEEP ANALYSIS COMPLETE // SYSTEM STABILITY OPTIMAL', 'success', 'ANALYSIS');
      addNotification('DEEP ANALYSIS SEQUENCE COMPLETE', 'success');
      addEventFeedItem('ANALYSIS COMPLETE', 'MATRIX OPTIMIZED', 'SECURE');
    }, 6000);
  }, [addLog, addNotification, addEventFeedItem, sound, triggerGlitchEffect]);

  // System Override Display Mode
  const triggerSystemOverride = useCallback(() => {
    setActiveMode('OVERRIDE');
    setThreatLevel('CRITICAL');
    triggerGlitchEffect();
    sound.playAlertSound();
    addLog('SYSTEM OVERRIDE INITIATED // FULL MATRIX SYNCHRONIZATION', 'critical', 'OVERRIDE');
    addNotification('SYSTEM OVERRIDE SIMULATION ACTIVE', 'critical');

    setTimeout(() => {
      setActiveMode('NORMAL');
      setThreatLevel('GUARDED');
      sound.playSuccessSound();
      addLog('SYSTEM OVERRIDE SIMULATION COMPLETE // THREAT CONTAINED', 'success', 'OVERRIDE');
      addNotification('OVERRIDE SIMULATION FINISHED', 'success');
    }, 7000);
  }, [addLog, addNotification, sound, triggerGlitchEffect]);

  // Periodic Random Simulation Event Engine
  useEffect(() => {
    if (!bootCompleted) return;

    const interval = setInterval(() => {
      // Smooth metric fluctuations
      setSystemMetrics((prev) => ({
        ...prev,
        dataFlow: Math.max(400, Math.min(1200, Math.floor(prev.dataFlow + (Math.random() * 60 - 30)))),
        latency: Math.max(8, Math.min(35, Math.floor(prev.latency + (Math.random() * 4 - 2)))),
        packetCount: prev.packetCount + Math.floor(Math.random() * 120) + 40,
        stability: Math.min(99.9, Math.max(94.0, +(prev.stability + (Math.random() * 0.4 - 0.2)).toFixed(1)))
      }));

      // 30% chance per tick to generate an interconnected event
      if (Math.random() < 0.3) {
        const events = [
          { text: 'NEW ENCRYPTED SIGNAL DETECTED ON PORT 8080', type: 'RADAR', level: 'info', feed: 'SIGNAL DETECTED', target: 'NODE-' + (Math.floor(Math.random()*800)+100) },
          { text: 'NODE TELEMETRY RE-CALIBRATED', type: 'MATRIX', level: 'info', feed: 'NODE RE-CALIBRATED', target: 'MATRIX-CORE' },
          { text: 'FIREWALL DEEP PACKET INSPECTION PASSED', type: 'SECURITY', level: 'success', feed: 'FIREWALL SCAN', target: 'PASS' },
          { text: 'AI ASSISTANT: ANOMALY PREDICTION MATRIX STABLE', type: 'NEXUS_AI', level: 'info', feed: 'AI MATRIX STABLE', target: 'AI-CORE' },
          { text: 'SATELLITE DOWNLINK BEAM ANGLE ADJUSTED', type: 'SATELLITE', level: 'info', feed: 'SAT LINK UPDATED', target: 'NEXUS-SAT-04' }
        ];

        const evt = events[Math.floor(Math.random() * events.length)];
        addLog(evt.text, evt.level, evt.type);
        addEventFeedItem(evt.feed, evt.target, 'ACTIVE');
      }

      // Auto Demo sequence runner if enabled
      if (autoDemo && Math.random() < 0.25) {
        const demoActions = [
          () => triggerAreaScan(['25M', '50M', '100M', '250M'][Math.floor(Math.random()*4)]),
          () => {
            const levels = ['LOW', 'GUARDED', 'ELEVATED', 'HIGH'];
            const nextLvl = levels[Math.floor(Math.random()*levels.length)];
            setThreatLevel(nextLvl);
            addLog(`THREAT LEVEL ADJUSTED TO ${nextLvl}`, 'warning', 'THREAT');
          }
        ];
        demoActions[Math.floor(Math.random() * demoActions.length)]();
      }

    }, 3000);

    return () => clearInterval(interval);
  }, [bootCompleted, autoDemo, addLog, addEventFeedItem, triggerAreaScan]);

  const value = {
    bootCompleted,
    setBootCompleted,
    threatLevel,
    setThreatLevel,
    nodes,
    logs,
    eventFeed,
    notifications,
    systemMetrics,
    activeMode,
    setActiveMode,
    focusedModule,
    setFocusedModule,
    autoDemo,
    setAutoDemo,
    currentTheme,
    setCurrentTheme,
    fxSettings,
    toggleFx,
    glitchTrigger,
    addLog,
    addNotification,
    addEventFeedItem,
    triggerGlitchEffect,
    triggerAreaScan,
    triggerDeepAnalysis,
    triggerSystemOverride,
    clearLogs,
    sound
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}
