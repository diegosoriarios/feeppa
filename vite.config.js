import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, "src"),
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    }
  },
  server: {
    port: 8000,
    hot: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        list: resolve(__dirname, 'src/pages/List/index.html'),
        form: resolve(__dirname, 'src/pages/Form/index.html'),
        login: resolve(__dirname, 'src/pages/Login/index.html'),
        moderation: resolve(__dirname, 'src/pages/moderation/index.html'),
        profile: resolve(__dirname, 'src/pages/Profile/index.html'),
        question: resolve(__dirname, 'src/pages/Question/index.html'),
      },
    },
  },
})
