import { Terminal } from '@xterm/xterm';
import { executeCommand } from './shellProcessor';
import type { PyodideInterface } from 'pyodide';

export function initializeShell(term: Terminal, pyodide: PyodideInterface) {
  let buffer = '';
  const history: string[] = [];
  let historyIndex = -1;
  let firstPrompt = true;

  function printPrompt() {
    if (firstPrompt) {
      term.write('$ ');
      firstPrompt = false;
    } else {
      term.write('\r\n$ ');
    }
    buffer = '';
  }

  function overwriteLine(text: string) {
    // Clear line and write prompt + buffer
    term.write('\x1b[2K\r$ ' + text);
  }

  printPrompt();

  term.onData((data) => {
    switch (data) {
      case '\r': // ENTER
        term.write('\r\n');
        if (buffer.trim()) {
          history.push(buffer);
          historyIndex = history.length;
          executeCommand(buffer, { writeln: (msg: string) => term.writeln(msg) }, pyodide, printPrompt);
        } else {
          printPrompt();
        }
        break;

      case '\u007f': // BACKSPACE
        if (buffer.length > 0) {
          buffer = buffer.slice(0, -1);
          // Remove last char visually
          overwriteLine(buffer);
        }
        break;

      case '\u001b[A': // UP arrow
        if (history.length > 0 && historyIndex > 0) {
          historyIndex--;
          buffer = history[historyIndex];
          overwriteLine(buffer);
        }
        break;

      case '\u001b[B': // DOWN arrow
        if (history.length > 0) {
          if (historyIndex < history.length - 1) {
            historyIndex++;
            buffer = history[historyIndex];
          } else {
            historyIndex = history.length;
            buffer = '';
          }
          overwriteLine(buffer);
        }
        break;

      default:
        // Printable character
        buffer += data;
        term.write(data);
    }
  });
}