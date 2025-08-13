import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'  // <-- Add this import for path resolution

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@chat-platform/shared': resolve(__dirname, '../../packages/shared/src'),  // <-- Add this alias for your shared package
    },
  },
})