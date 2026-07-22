/// <reference types="node" />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dts from 'vite-plugin-dts';

// Library build: emits ESM + CJS + type declarations, and a single
// precompiled `style.css`. React is externalized as a peer dependency.
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/test/**', 'demo/**'],
      insertTypesEntry: true,
    }),
  ],
  build: {
    cssCodeSplit: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        assetFileNames: (asset) =>
          asset.names?.some((n) => n.endsWith('.css')) ? 'style.css' : '[name][extname]',
      },
    },
  },
});
