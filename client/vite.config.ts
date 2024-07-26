import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    proxy: {
      '/vtuber': 'http://avatar.aicubes.cn/',
      // '/vtuber': 'http://avatar-test.aicubes.cn/',
    }
  },
})
