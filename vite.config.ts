import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { renderSeoMetadata, routeMetadata } from './src/lib/seo';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      name: 'triangle-route-seo',
      transformIndexHtml(html) {
        return html.replace('<!-- page-seo -->', renderSeoMetadata(routeMetadata['/']));
      },
    },
    react(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
