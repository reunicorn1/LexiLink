import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0'
  },
  build: {
    chunkSizeWarningLimit: 5000,
    outDir: 'dist',
    assetsDir: 'assets',
    manifest: true, 
    rollupOptions: {
      output: {
        // Use content hashing for filenames
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]'
      }
  },
  },
})
