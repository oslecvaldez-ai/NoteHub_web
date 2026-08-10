import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import electron from 'vite-plugin-electron/simple'
import { notBundle } from 'vite-plugin-electron/plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    electron({
      main: {
        entry: 'electron/main.ts',
        vite: {
          plugins: [notBundle()],
          build: {
            rollupOptions: {
              external: ['better-sqlite3'],
            },
          },
        },
      },
      preload: {
        input: 'electron/main/preload.ts',
        vite: {
          build: {
            outDir: 'dist-electron',
            emptyOutDir: false,
          },
        },
      },
    }),
  ],
  optimizeDeps: {
    exclude: ['better-sqlite3'],
  },
})
