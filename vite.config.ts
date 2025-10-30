import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/lens-comparator/',
  server: {
    port: 8018,
    host: '127.0.0.1',
    allowedHosts: ['yage.ai'],
  },
  preview: {
    port: 8018,
    host: '127.0.0.1',
    allowedHosts: ['yage.ai'],
  },
})
