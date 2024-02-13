import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175
  },
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 10000 // Increase the limit to 10000 kB (10 MB)
  },
})
