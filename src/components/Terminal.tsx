import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { initializeShell } from '../shell/shellEngine';
import { usePyodide } from '../hooks/usePyodide';

const TerminalView: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const term = useRef<Terminal | null>(null);
  const { pyodide, loaded } = usePyodide();
  const shellInitialized = useRef(false);

  useEffect(() => {
    if (term.current) return;
    const t = new Terminal({
      cursorBlink: true,
      fontFamily: 'Fira Mono, monospace',
      fontSize: 15,
      theme: {
        background: '#181818',
        foreground: '#e0e0e0',
        cursor: '#00ff00',
      },
      letterSpacing: 0.5,
      lineHeight: 1.2,
    });
    t.open(terminalRef.current!);
    term.current = t;
  }, []);

  useEffect(() => {
    if (!term.current || !loaded || shellInitialized.current) return;
    initializeShell(term.current, pyodide!);
    shellInitialized.current = true;
  }, [loaded, pyodide]);

  return (
    <div
      ref={terminalRef}
      style={{
        height: '100%',
        width: '100%',
        background: '#181818',
        borderRadius: '6px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        padding: '8px',
        overflow: 'hidden'
      }}
    />
  );
};

export default TerminalView;