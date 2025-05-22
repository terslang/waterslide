import { useState, useEffect } from 'react';
import * as BrowserFS from 'browserfs';
import FileExplorer from './components/FileExplorer';
import CodeEditor from './components/Editor';
import TerminalView from './components/Terminal';

const fs = BrowserFS.BFSRequire('fs');

function App() {
  const [code, setCode] = useState('print("Hello, Waterslide!")');
    // 1) selected file path
  const [filePath, setFilePath] = useState('main.py');

  // Auto-save to BrowserFS on every edit
  useEffect(() => {
    fs.writeFile(filePath, code, (err) => {
      if (err) console.error('Auto-save failed:', err);
    });
  }, [code, filePath]);

   // Load the file whenever filePath changes
  useEffect(() => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        // If file doesn’t exist yet, start with blank
        setCode('');
      } else {
        setCode(data || '');
      }
    });
  }, [filePath]);

  return (
    <div 
      style={{ 
        display: 'flex', 
        height: '100vh', 
        background: '#1e1e1e', 
        fontFamily: 'sans-serif', 
        color: '#fff'
      }}
    >
      {/* File Explorer */}
      <div 
        style={{ 
          width: 250, 
          borderRight: '1px solid #444', 
          overflowY: 'auto', 
          /* Subtle scrollbar styles (Firefox) */
          scrollbarWidth: 'thin',
          scrollbarColor: '#888 transparent'
        }}
      >
        <FileExplorer
           selectedPath={filePath}
          onFileSelect={(path) => setFilePath(path)}
        />
      </div>

      {/* Editor + Terminal */}
      <div 
        style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden'
        }}
      >
        <div 
          style={{ 
            flex: 1, 
            overflowY: 'auto', 
            /* Subtle scrollbar - Webkit */
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <CodeEditor
            fileName={filePath}
            code={code}
            onChange={(v) => setCode(v || '')}
          />
        </div>
        <div 
          style={{ 
            height: 400, 
            borderTop: '1px solid #444', 
            backgroundColor: '#2e2e2e', 
            overflowY: 'auto', 
            /* Subtle scrollbar styles (Firefox) */
            scrollbarWidth: 'thin',
            scrollbarColor: '#888 transparent'
          }}
        >
          <TerminalView />
        </div>
      </div>
    </div>
  );
}

export default App;
