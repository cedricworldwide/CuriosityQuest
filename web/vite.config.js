import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite configuration for the Curiosity Quest web application.
 *
 * The React plugin enables JSX transformation and Fast Refresh during
 * development. You can configure additional options here if you want
 * to adjust the base path or customize the dev server.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  preview: {
    port: 4173
  }
});