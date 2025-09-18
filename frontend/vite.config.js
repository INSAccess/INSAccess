import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  },
  
  build: {
    outDir: 'build',
    assetsDir: 'static', 
    sourcemap: false,
    
    rollupOptions: {
      output: {
        entryFileNames: 'static/js/[name]-[hash].js',
        chunkFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'static/css/[name]-[hash].css'
          }
          return 'static/media/[name]-[hash][extname]'
        }
      }
    }
  },
  
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  
  server: {
    port: 3000,
    host: '0.0.0.0', 
    open: false 
  },
})