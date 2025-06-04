import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@headlessui/react', 'clsx'],
          icons: ['lucide-react'],
          forms: ['react-hook-form'],
          utils: ['date-fns', 'zustand']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    // Disable source maps in production for smaller build size
    sourcemap: false,
    // Minify the output
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log statements
        drop_debugger: true // Remove debugger statements
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});