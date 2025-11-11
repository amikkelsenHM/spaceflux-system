// vite.config.js
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/spaceflux-system/' : '/',
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'docs',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        waterfall: resolve(__dirname, 'waterfall.html')
      }
    },
    assetsDir: 'assets',
    sourcemap: true,
  },
}))