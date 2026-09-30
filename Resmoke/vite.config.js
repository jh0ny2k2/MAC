import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(), 
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      injectManifest: {
        maximumFileSizeToCacheInBytes: 4000000
      },
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
        type: 'module',
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Resmoke - Marketplace de Cachimbas y Vapers',
        short_name: 'Resmoke',
        description: 'Descubre y compra productos únicos en Resmoke. Marketplace especializado en cachimbas, vapers, accesorios y productos de segunda mano de calidad.',
        theme_color: '#3B82F6',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/img/resmoke/logo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/img/resmoke/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        screenshots: [
          {
            src: "/img/resmoke/screenshot-wide.png",
            sizes: "1280x720",
            type: "image/png",
            form_factor: "wide",
            label: "Vista principal de Resmoke en desktop"
          },
          {
            src: "/img/resmoke/screenshot-narrow.png",
            sizes: "750x1334",
            type: "image/png",
            form_factor: "narrow",
            label: "Vista principal de Resmoke en móvil"
          }
        ],
        shortcuts: [
          {
            name: "Ver Productos",
            short_name: "Productos",
            description: "Explorar todos los productos disponibles",
            url: "/products",
            icons: [
              {
                src: "/img/resmoke/logo.png",
                sizes: "96x96"
              }
            ]
          },
          {
            name: "Mis Favoritos",
            short_name: "Favoritos",
            description: "Ver productos guardados como favoritos",
            url: "/favorites",
            icons: [
              {
                src: "/img/resmoke/logo.png",
                sizes: "96x96"
              }
            ]
          },
          {
            name: "Mi Perfil",
            short_name: "Perfil",
            description: "Acceder a mi perfil de usuario",
            url: "/profile",
            icons: [
              {
                src: "/img/resmoke/logo.png",
                sizes: "96x96"
              }
            ]
          }
        ]
      }
    })
  ],
  build: {
    sourcemap: true,
    target: 'es2019',
    cssCodeSplit: true
  },
  server: {
    proxy: {
      '/api/stripe': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/stripe/, '/api/stripe')
      },
      '/api/verify-email': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/api/verify-email-start': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/api/verify-email-complete': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/api/auth': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
})
