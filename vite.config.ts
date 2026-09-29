import path from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: [
        'icon-192.png',
        'icon-512.png',
        'apple-touch-icon.png',
        'favicon-32.png',
        'favicon.ico',
        'brand-penguin.webp',
      ],
      manifest: {
        name: 'BUG PINGUIM',
        short_name: 'BUG PINGUIM',
        description: 'Análise do seu dispositivo, direto no navegador.',
        lang: 'pt-BR',
        id: '/',
        start_url: '/',
        display: 'standalone',
        background_color: '#041124',
        theme_color: '#041124',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        globPatterns: ['**/*.{js,css,html,png,svg,webp,ico,woff2}'],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') } },
  server: { watch: { ignored: ['**/.agents/**', '**/dist/**'] } },
  build: { chunkSizeWarningLimit: 550 },
})
