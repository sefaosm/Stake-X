import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['stream', 'util', 'crypto', 'buffer', 'process'],
      globals: {
        Buffer: true,
        global: true,
        process: true
      }
    })
  ],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      stream: 'rollup-plugin-node-polyfills/polyfills/stream',
      util: 'rollup-plugin-node-polyfills/polyfills/util'
    }
  }
})
