import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'ui-common/user-search-modal': fileURLToPath(
        new URL('../ui-common/src/user-search-modal.ts', import.meta.url),
      ),
      'ui-common/config': fileURLToPath(
        new URL('../ui-common/src/config.ts', import.meta.url),
      ),
      'ui-common': fileURLToPath(new URL('../ui-common/src/index.ts', import.meta.url)),
      '@entities': fileURLToPath(new URL('../ui-common/src/entities', import.meta.url)),
      '@features': fileURLToPath(new URL('../ui-common/src/features', import.meta.url)),
      '@shared': fileURLToPath(new URL('../ui-common/src/shared', import.meta.url)),
      '@widgets': fileURLToPath(new URL('../ui-common/src/widgets', import.meta.url)),
    },
  },
})
