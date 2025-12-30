import tailwind from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import vueJsxVapor from 'vue-jsx-vapor/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsxVapor({
      macros: true,
    }),
    tailwind(),
  ],
})
