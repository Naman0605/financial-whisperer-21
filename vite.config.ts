
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
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
})
