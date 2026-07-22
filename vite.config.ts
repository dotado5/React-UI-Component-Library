/// <reference types="node" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Dev / demo-app config. The publishable library is built with
// `vite.lib.config.ts` (see `npm run build`).
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
