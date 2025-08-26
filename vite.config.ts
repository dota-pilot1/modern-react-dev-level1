import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    tailwindcss(),
    // Add React plugin if needed
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  }
})