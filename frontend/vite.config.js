import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      '@': path.resolve(__dirname, './src'),
      "@material-tailwind/react": path.resolve(__dirname, "./node_modules/@material-tailwind/react"),
    },
  },
})