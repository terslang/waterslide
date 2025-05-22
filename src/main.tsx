import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App';
import * as BrowserFS from 'browserfs';

BrowserFS.configure({ fs: "IndexedDB", options: {} }, (err) => {
  if (err) {
    console.error('Failed to init BrowserFS:', err);
  } else {
    console.log('BrowserFS ready');
    const fs = BrowserFS.BFSRequire('fs');
    fs.mkdir('/', () => {}); // ensure root exists

    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
});
