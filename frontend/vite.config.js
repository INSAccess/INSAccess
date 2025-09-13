import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // Configuration du build pour correspondre à CRA
  build: {
    outDir: 'build', // Garde le même nom de dossier que CRA
    assetsDir: 'static', // Assets dans static/ comme CRA
    sourcemap: false,
    
    // Optimisations pour la production
    rollupOptions: {
      output: {
        // Nommage des fichiers similar à CRA
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
  
  // Support pour les path absolus si vous en utilisez
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  
  // Configuration pour le dev server (Docker)
  server: {
    port: 3000,
    host: '0.0.0.0', // Important pour Docker
    open: false // Pas d'ouverture auto dans Docker
  },
  
  // Variables d'environnement - remplace REACT_APP_ par VITE_
  define: {
    // Si vous avez des variables d'env spécifiques à déplacer
  }
})