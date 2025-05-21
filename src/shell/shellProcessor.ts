// shellProcessor.ts
import * as BrowserFS from 'browserfs';
import type { PyodideInterface } from 'pyodide';

const fs = BrowserFS.BFSRequire('fs');
const path = BrowserFS.BFSRequire('path');
let cwd: string = '/';

export async function executeCommand(
    input: string,
    term: { writeln: (msg: string) => void },
    pyodide: PyodideInterface | null,
    done: () => void
) {
    // Improved: join args for filenames with spaces
    const [cmd, ...args] = input.trim().split(/\s+/);

    // Helper to always write with newline
    function writeln(msg: string) {
        term.writeln(msg);
    }

    switch (cmd) {
        case 'pwd': {
            writeln(cwd);
            done();
            break;
        }
        case 'ls': {
            fs.readdir(cwd, (err, files) => {
                if (err) writeln('Failed to list directory');
                else writeln((files || []).join('  '));
                done();
            });
            break;
        }
        case 'python': {
            if (!pyodide) {
                writeln('Python runtime not ready yet.');
                done();
                return;
            }

            const script = args[0] || 'main.py';
            const filePath = path.join(cwd, script);
            fs.readFile(filePath, 'utf8', async (err, code) => {
                if (err) {
                    writeln(`File not found: ${script}`);
                    done();
                    return;
                }
                try {
                    if (typeof code === 'string') {
                        await pyodide.loadPackagesFromImports(code);
                    }
                    await pyodide.runPythonAsync(`
                        import io, sys
                        with open('/${script}', 'w') as f:
                            f.write(${JSON.stringify(code)})
                    `);
                    const output: string = await pyodide.runPythonAsync(`
                        import io, sys
                        buf = io.StringIO()
                        sys.stdout = buf
                        exec(open('/${script}').read())
                        buf.getvalue()
                    `);
                    if (output) {
                        output.split('\n').forEach((line) => writeln(line));
                    }
                } catch (e: unknown) {
                    writeln(`Error: ${String(e)}`);
                }
                done();
            });
            return;
        }
        case 'cd': {
            if (!args[0]) {
                writeln('Usage: cd <directory>');
                done();
                break;
            }
            const newPath = path.resolve(cwd, args.join(' '));
            fs.stat(newPath, (err, stats) => {
                if (err || !stats?.isDirectory()) {
                    writeln(`No such directory: ${args.join(' ')}`);
                } else {
                    cwd = newPath;
                    writeln(`Changed directory to: ${cwd}`);
                }
                done();
            });
            break;
        }
        case 'cat': {
            if (!args[0]) {
                writeln('Usage: cat <filename>');
                done();
                break;
            }
            const filePath = path.join(cwd, args.join(' '));
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    writeln(`File not found: ${args.join(' ')}`);
                } else {
                    writeln(data || '');
                }
                done();
            });
            break;
        }
        case 'touch': {
            if (!args[0]) {
                writeln('Usage: touch <filename>');
                done();
                break;
            }
            const filePath = path.join(cwd, args.join(' '));
            fs.writeFile(filePath, '', (err) => {
                if (err) {
                    writeln(`Failed to create file: ${args.join(' ')}`);
                } else {
                    writeln(`File created: ${args.join(' ')}`);
                }
                done();
            });
            break;
        }
        case 'mkdir': {
            if (!args[0]) {
                writeln('Usage: mkdir <folder>');
                done();
                break;
            }
            const dirPath = path.join(cwd, args.join(' '));
            fs.mkdir(dirPath, (err: Error | null) => {
                if (err) {
                    writeln(`Failed to create directory: ${args.join(' ')}\n${err.message}`);
                } else {
                    writeln(`Directory created: ${args.join(' ')}`);
                }
                done();
            });
            break;
        }
        case 'rm': {
            if (!args[0]) {
                writeln('Usage: rm <file>');
                done();
                break;
            }
            const filePath = path.join(cwd, args.join(' '));
            fs.unlink(filePath, (err) => {
                if (err) {
                    writeln(`Failed to delete file: ${args.join(' ')}`);
                } else {
                    writeln(`File deleted: ${args.join(' ')}`);
                }
                done();
            });
            break;
        }
        case 'clear': {
            term.writeln('\x1Bc');
            done();
            break;
        }
        case 'help': {
            writeln([
                'Available commands:',
                'ls      - list files',
                'cd DIR  - change directory',
                'cat     - print file',
                'touch   - create empty file',
                'mkdir   - create directory',
                'rm      - delete file',
                'pwd     - print current directory',
                'clear   - clear terminal',
                'echo    - print text or redirect to file (echo hi > file.txt)',
                'help    - show help'
            ].join('\n'));
            done();
            break;
        }
        case 'echo': {
            const redirectIndex = args.indexOf('>');
            if (redirectIndex !== -1) {
                const message = args.slice(0, redirectIndex).join(' ');
                const fileName = args[redirectIndex + 1];
                if (!fileName) {
                    writeln('Usage: echo <message> > <filename>');
                    done();
                    break;
                }
                const filePath = path.join(cwd, fileName);
                fs.writeFile(filePath, message, (err) => {
                    if (err) {
                        writeln(`Failed to write to file: ${fileName}\n${err.message}`);
                    } else {
                        writeln(`Wrote to file: ${fileName}`);
                    }
                    done();
                });
            } else {
                writeln(args.join(' '));
                done();
            }
            break;
        }
        default:
            writeln(`command not found: ${cmd}`);
            done();
    }
}
