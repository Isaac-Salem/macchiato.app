import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

    let url_base = '/';
    if (process.env.GITHUB_ACTIONS)
    {
      url_base = '/macchiato.app/';
    }
    else if (process.env.CUST_BASE_URL)
    {
      // if set, assign the base name to a custom name from CUST_BASE_URL env variable
      url_base = process.env.CUST_BASE_URL;
    }

    return {
      plugins: [vue()],
      base: url_base,
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('/client/src', import.meta.url))
        }
      }
    }
  }
)
