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
        main: path.resolve(__dirname, 'index.html'),
        list: path.resolve(__dirname, 'src/src/pages/List/index.html'),
        form: path.resolve(__dirname, 'src/src/pages/Form/index.html'),
        login: path.resolve(__dirname, 'src/src/pages/Login/index.html'),
        moderation: path.resolve(__dirname, 'src/src/pages/moderation/index.html'),
        profile: path.resolve(__dirname, 'src/src/pages/Profile/index.html'),
        question: path.resolve(__dirname, 'src/src/pages/Question/index.html'),
      },
    },
  },
})
