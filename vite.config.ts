import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/pokedex-ddalkak/',  // 예: '/pokedex/'
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "/src/styles/_variables.scss" as *;`
      }
    }
  }
})