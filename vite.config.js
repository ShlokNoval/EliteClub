import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('three') || id.includes('@react-three')) {
            return 'three-vendor';
          }
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
            return 'react-vendor';
          }
          if (id.includes('framer-motion') || id.includes('lucide-react') || id.includes('recharts')) {
            return 'ui-libs';
          }
          if (id.includes('@supabase')) {
            return 'supabase-vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  }
})
