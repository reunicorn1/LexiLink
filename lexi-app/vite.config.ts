import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Custom middleware function to set cache control headers
const cacheControlMiddleware = () => {
  return {
    name: 'custom-cache-control',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        next();
      });
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), cacheControlMiddleware()],
  server: {
    host: 'localhost'
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
  }
});
