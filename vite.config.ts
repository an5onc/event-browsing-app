import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for the event browsing application.  We enable the
// React plugin to support automatic JSX transformation and HMR.  The
// default server port is set to 3000 for local development.  This file
// can be extended to include additional configuration such as proxy
// settings or environment variables as the project grows.

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
});