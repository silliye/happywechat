import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  
  
  plugins: [
    vue(),
  ],

  server: {
    proxy: {
      '/ws': {
        target: 'wss://localhost:443',  // 代理到后端WebSocket服务器
        ws: true,  // 标识为WebSocket代理
        changeOrigin: true  // 确保代理服务器修改请求头中的origin
      }
    }
  },


  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
