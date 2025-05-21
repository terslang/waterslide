// src/hooks/usePyodide.ts
import { useState, useEffect } from 'react';
import type { PyodideInterface } from 'pyodide';

export function usePyodide() {
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pd:PyodideInterface = await (window as any).loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.3/full/',
      });
      setPyodide(pd);
      setLoaded(true);
    })();
  }, []);

  return { pyodide, loaded };
}
