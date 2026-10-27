/// <reference types="vitest/config" />
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
  server: {
    // Em desenvolvimento, /api vai para o backend: mesma origem, sem CORS, e o cookie do login funciona
    proxy: {
      '/api': 'http://localhost:5071',
    },
  },
})
