import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
  css: {
    devSourcemap: true,
  },
  plugins: [vue(), vueDevTools()],
  optimizeDeps: {
    include: ['mqtt'],
  },
  resolve: {
    alias: {
      // jsconfig.json 에서도 같이 설정
      '@': path.resolve(__dirname, 'src'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@composables': path.resolve(__dirname, 'src/composables'),
      '@layouts': path.resolve(__dirname, 'src/layouts'),
      '@router': path.resolve(__dirname, 'src/router'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@util': path.resolve(__dirname, 'src/util'),
      '@pages': path.resolve(__dirname, 'src/pages'),
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  server: {
    port: 3000,
  },
});
