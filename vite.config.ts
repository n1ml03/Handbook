import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/frontend',
      'mysql2': '/frontend/lib/db/polyfills.ts',
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
        'mysql2',
        'cloudflare:sockets'
      ],
      output: {
        globals: {
          'fs': '{}',
          'path': '{}',
          'crypto': '{}',
          'mysql2': '{}',
          'cloudflare:sockets': '{}'
        },
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-radix': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-context-menu',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-hover-card',
            '@radix-ui/react-label',
            '@radix-ui/react-menubar',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slider',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group',
            '@radix-ui/react-tooltip'
          ],
          'editor-tiptap': [
            '@tiptap/react',
            '@tiptap/starter-kit',
            '@tiptap/extension-bubble-menu',
            '@tiptap/extension-character-count',
            '@tiptap/extension-code-block-lowlight',
            '@tiptap/extension-color',
            '@tiptap/extension-document',
            '@tiptap/extension-dropcursor',
            '@tiptap/extension-focus',
            '@tiptap/extension-font-family',
            '@tiptap/extension-gapcursor',
            '@tiptap/extension-hard-break',
            '@tiptap/extension-highlight',
            '@tiptap/extension-history',
            '@tiptap/extension-horizontal-rule',
            '@tiptap/extension-image',
            '@tiptap/extension-link',
            '@tiptap/extension-list-item',
            '@tiptap/extension-mention',
            '@tiptap/extension-paragraph',
            '@tiptap/extension-placeholder',
            '@tiptap/extension-table',
            '@tiptap/extension-table-cell',
            '@tiptap/extension-table-header',
            '@tiptap/extension-table-row',
            '@tiptap/extension-task-item',
            '@tiptap/extension-task-list',
            '@tiptap/extension-text-align',
            '@tiptap/extension-text-style',
            '@tiptap/extension-typography',
            '@tiptap/extension-underline',
            'lowlight'
          ],
          'charts-vendor': ['recharts', 'reactflow'],
          'animation-vendor': ['framer-motion'],
          'data-vendor': ['zustand', '@tanstack/react-table'],
          'utils-vendor': [
            'clsx',
            'class-variance-authority',
            'tailwind-merge',
            'zod',
            'joi',
            'uuid',
            'emoji-picker-react'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  worker: {
    format: 'es'
  }
}) 