import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/frontend',
      'mssql': '/frontend/lib/db/polyfills.ts',
    },
  },
  define: {
    global: 'globalThis',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  optimizeDeps: {
    exclude: ['node:*']
  },
  server: {
    port: 8080,
    fs: {
      allow: ['..']
    }
  },
  build: {
    rollupOptions: {
      external: [
        'fs',
        'path',
        'crypto',
        'node:*',
        'mssql',
        'tedious',
        'cloudflare:sockets'
      ],
      output: {
        globals: {
          'fs': '{}',
          'path': '{}',
          'crypto': '{}',
          'mssql': '{}',
          'tedious': '{}',
          'cloudflare:sockets': '{}'
        }
      }
    }
  },
  worker: {
    format: 'es'
  }
}) 