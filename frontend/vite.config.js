import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: 'Zone 4: Exclusion Zone Treasure Hunt',
        short_name: 'Zone 4',
        description: 'Interactive 3D Treasure Hunt Registration and Field Dossier System',
        theme_color: '#002729',
        background_color: '#002729',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        // Exclude huge video files from precache to avoid choking service worker install
        globIgnores: ['**/*.mp4'],
        runtimeCaching: [
          {
            // Cache images and 3D assets on demand
            urlPattern: /\.(?:png|jpg|jpeg|svg|webp|glb|gltf)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'treasure-hunt-assets',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            }
          },
          {
            // Network first for API calls so offline mode fails gracefully without showing stale responses
            urlPattern: /^https?:\/\/.*\/api\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 24 * 60 * 60
              }
            }
          }
        ]
      }
    })
  ]
});
