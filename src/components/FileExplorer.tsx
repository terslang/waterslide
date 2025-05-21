// src/components/FileExplorer.tsx
import React, { useEffect, useState } from 'react';
import * as BrowserFS from 'browserfs';

export type FileNode = {
  name: string;
  path: string;
  isDir: boolean;
  children?: FileNode[];
};

type Props = {
  onFileSelect: (filePath: string) => void;
  selectedPath: string;
};

const fs = BrowserFS.BFSRequire('fs');
const path = BrowserFS.BFSRequire('path');

const FileExplorer: React.FC<Props> = ({ onFileSelect, selectedPath }) => {
  const [tree, setTree] = useState<FileNode[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const loadTree = () => {
    readDirRecursive('/', setTree);
  };

  useEffect(loadTree, [expanded]);

  function readDirRecursive(dir: string, cb: (nodes: FileNode[]) => void) {
    fs.readdir(dir, (err, items) => {
      if (err || !Array.isArray(items)) return cb([]);
      const results: FileNode[] = [];
      let pending = items.length;
      if (!pending) return cb(results);

      items.forEach((name) => {
        const full = path.join(dir, name);
        fs.stat(full, (e, stats) => {
          if (!e && stats) {
            const node: FileNode = { name, path: full, isDir: stats.isDirectory() };
            if (node.isDir && expanded.has(full)) {
              readDirRecursive(full, (children) => {
                node.children = children;
                results.push(node);
                if (!--pending) cb(results);
              });
            } else {
              results.push(node);
              if (!--pending) cb(results);
            }
          } else {
            if (!--pending) cb(results);
          }
        });
      });
    });
  }

  function toggleFolder(node: FileNode) {
    if (!node.isDir) return;
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(node.path)) {
        next.delete(node.path);
      } else {
        next.add(node.path);
      }
      return next;
    });
  }

  function getTargetDir(): string {
    // If selectedPath is a folder, add inside it; else add at root
    if (!selectedPath) return '/';
    const isDir = treeFlat(tree).find(n => n.path === selectedPath)?.isDir;
    return isDir ? selectedPath : '/';
  }

  function handleAddFile() {
    const fileName = window.prompt('Enter file name:');
    if (!fileName) return;
    const dir = getTargetDir();
    const filePath = path.join(dir, fileName);
    fs.writeFile(filePath, '', (err) => {
      if (err) alert('Failed to create file: ' + err.message);
      loadTree();
    });
  }

  function handleAddFolder() {
    const folderName = window.prompt('Enter folder name:');
    if (!folderName) return;
    const dir = getTargetDir();
    const folderPath = path.join(dir, folderName);
    fs.mkdir(folderPath, (err: Error | null) => {
      if (err) alert('Failed to create folder: ' + err.message);
      loadTree();
    });
  }

  function treeFlat(nodes: FileNode[]): FileNode[] {
    // Flatten tree for quick lookup
    return nodes.reduce<FileNode[]>((acc, n) => acc.concat(n, n.children ? treeFlat(n.children) : []), []);
  }

  function renderTree(nodes: FileNode[], level = 0): React.ReactNode {
    return nodes.map((node) => {
      const isExpanded = expanded.has(node.path);
      const isSelected = node.path === selectedPath;
      return (
        <div key={node.path}>
          <div
            onClick={() => node.isDir ? toggleFolder(node) : onFileSelect(node.path)}
            style={{
              padding: '2px 6px',
              paddingLeft: 8 + level * 16,
              cursor: 'pointer',
              backgroundColor: isSelected ? '#094771' : 'transparent',
              color: '#ccc',
              fontFamily: 'monospace',
              borderRadius: 4,
              userSelect: 'none'
            }}
          >
            {node.isDir ? (isExpanded ? '▾ ' : '▸ ') : '   '}
            {node.isDir ? '📁' : '📄'} {node.name}
          </div>
          {node.isDir && isExpanded && node.children && renderTree(node.children, level + 1)}
        </div>
      );
    });
  }

  return (
    <div style={{ background: '#1e1e1e', color: '#ccc', height: '100%', overflow: 'auto', padding: 8 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <button onClick={handleAddFile}>+ File</button>
        <button onClick={handleAddFolder}>+ Folder</button>
      </div>
      {renderTree(tree)}
    </div>
  );
};

export default FileExplorer;