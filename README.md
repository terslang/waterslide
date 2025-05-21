# Waterslide

**Waterslide** is a browser-based code playground inspired by VS Code, featuring a file explorer, Monaco code editor, and an interactive terminal with Python execution via Pyodide. It uses BrowserFS for a virtual filesystem and xterm.js for a realistic terminal experience.

---

## Features

- **VS Code–style File Explorer:**  
  Create, delete, and navigate files and folders in a virtual filesystem.

- **Monaco Code Editor:**  
  Syntax highlighting, code folding, minimap, word wrap, and more.

- **Integrated Terminal:**  
  Real shell-like terminal with command history, file operations, and Python execution.

- **Python Support:**  
  Run Python scripts in-browser using Pyodide.

- **Modern UI:**  
  Subtle scrollbars, dark theme, and responsive layout.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

```sh
git clone https://github.com/yourusername/waterslide.git
cd waterslide
npm install
```

### Running the App

```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Usage

- **File Explorer:**  
  Click folders to expand/collapse. Use the `+ File` and `+ Folder` buttons to add new items. Selecting a file opens it in the editor.

- **Editor:**  
  Edit code with Monaco features. Changes are auto-saved to the virtual filesystem.

- **Terminal:**  
  Use commands like `ls`, `cd`, `cat`, `touch`, `mkdir`, `rm`, `pwd`, `clear`, `echo`, and `python <file.py>`.  
  Example:  
  ```
  python main.py
  ```

---

## Technologies Used

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [xterm.js](https://xtermjs.org/)
- [BrowserFS](https://github.com/jvilk/BrowserFS)
- [Pyodide](https://pyodide.org/)

---

## License

This project is licensed under the [GNU GPLv3](LICENSE).

---

## Credits

- [VS Code](https://code.visualstudio.com/) for UI inspiration
- [Pyodide](https://pyodide.org/) for Python in the browser

---

## Contributing

Pull requests and issues are welcome! Please open an issue to discuss your idea or bug before submitting a PR.

---