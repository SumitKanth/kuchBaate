import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '/socket.io/': {
        target: 'https://kuchbaatebackend.onrender.com',
        changeOrigin: true,
        secure: false,
        ws: true,
      },

    }
},
  plugins: [react()],
})
