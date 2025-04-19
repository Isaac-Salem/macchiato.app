import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), ''); // Load .env files
    return {
      plugins: [vue()],
      // base: env.GITHUB_PAGES ? '/macchiato.app/' : '/',
      base: '/macchiato.app/',
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('/client/src', import.meta.url))
        }
      }
    }
  }
)
