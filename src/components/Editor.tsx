// src/components/CodeEditor.tsx
import React from 'react';
import Editor, { type OnChange } from '@monaco-editor/react';
import * as BrowserFS from 'browserfs';

type Props = {
  fileName: string;
  code: string;
  onChange: (value: string) => void;
};

const fs = BrowserFS.BFSRequire('fs');

const CodeEditor: React.FC<Props> = ({ fileName, code, onChange }) => {
  // Whenever the user types, update React state AND write to BrowserFS
  const handleChange: OnChange = (value) => {
    const newCode = value ?? '';
    console.log('Code changed:', newCode);
    onChange(newCode);
    // Auto-save into BrowserFS
    fs.writeFile(fileName, newCode, (err) => {
      if (err) console.error('Failed to save', err);
    });
  };

  return (
    <Editor
      height="60vh"
      language="python"
      path={fileName}
      value={code}           // ← controlled
      onChange={handleChange}
      theme="vs-dark"
      options={{
        automaticLayout: true,                  // Auto-resize with container
        tabSize: 2,
        fontFamily: 'Fira Code, monospace',
        fontLigatures: true,
        fontSize: 18,
        wordWrap: 'on',                         // Enable word wrap
        minimap: { enabled: true },             // Show the minimap
        folding: true,                          // Enable code folding
        scrollBeyondLastLine: false,            // Don't show empty space after the last line
        lineNumbers: 'on',                      // Show line numbers
        renderWhitespace: 'all',                // Show all whitespace characters
        cursorSmoothCaretAnimation: 'on',
        contextmenu: true,                      // Show context menu on right-click
        smoothScrolling: true,
        formatOnType: true,
        formatOnPaste: true,
        codeLens: true,
        inlineSuggest: {},
        suggestOnTriggerCharacters: true,
        glyphMargin: true,
        // You can add additional options here, e.g., fontSize, formatOnPaste, etc.
      }}
    />
  );
};

export default CodeEditor;
