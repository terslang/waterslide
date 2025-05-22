import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import rollupNodePolyFill from 'rollup-plugin-polyfill-node';

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  base: isGitHubPages ? '/waterslide/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      // These point to browser-safe versions
      buffer: 'buffer',
      path: 'path-browserify',
      fs: 'browserfs/dist/shims/fs.js',
      stream: 'stream-browserify',
      process: 'process/browser',
    },
  },
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  optimizeDeps: {
    include: ['buffer', 'process', 'stream-browserify', 'path-browserify'],
  },
  build: {
    rollupOptions: {
      plugins: [
        rollupNodePolyFill(),
      ],
    },
  },
});
