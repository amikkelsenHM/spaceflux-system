import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/spaceflux-system/' : '/',
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'docs',
    assetsDir: 'assets',
    sourcemap: true,
  },
}))
