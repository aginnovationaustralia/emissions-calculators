import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'electron-vite';

export default defineConfig({
  main: {
    build: {
      outDir: 'dist/main',
      sourcemap: true,
    },
  },
  preload: {
    build: {
      outDir: 'dist/preload',
      sourcemap: true,
    },
  },
  renderer: {
    build: {
      outDir: 'dist/renderer',
      sourcemap: true,
    },
    plugins: [react()],
    resolve: {
      alias: { '@': path.resolve(__dirname, 'src') },
    },
    server: {
      hmr: true,
    },
    css: {
      devSourcemap: true,
    },
  },
});
