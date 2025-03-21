
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { componentTagger } from 'lovable-tagger'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '::',
    port: 8080,
    proxy: {
      '/api/ai-recommendations': {
        target: 'https://dntyiiqijkjxvlhqfehv.functions.supabase.co/ai-recommendations',
        changeOrigin: true,
        rewrite: (path) => '',
      },
      '/api/ai-chat': {
        target: 'https://dntyiiqijkjxvlhqfehv.functions.supabase.co/ai-chat',
        changeOrigin: true,
        rewrite: (path) => '',
      }
    }
  }
}))
