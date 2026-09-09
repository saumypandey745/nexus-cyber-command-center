import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const WindowContext = createContext(null);

export function WindowProvider({ children }) {
  const openWindowRef = useRef(null);

  const registerOpenWindow = useCallback((fn) => {
    openWindowRef.current = fn;
  }, []);

  const requestOpenWindow = useCallback((windowId) => {
    if (openWindowRef.current) {
      openWindowRef.current(windowId);
    }
  }, []);

  return (
    <WindowContext.Provider value={{ registerOpenWindow, requestOpenWindow }}>
      {children}
    </WindowContext.Provider>
  );
}

export function useWindowContext() {
  return useContext(WindowContext);
}
