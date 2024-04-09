import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({
  plugins: [
    react(),
    VitePWA({ 
      workbox: {
        navigateFallbackDenylist: [ /^https:\/\/www\.googleapis\.com/
      ]
      },
      
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'logo.svg'],
      devOptions: {
        enabled: true,
        suppressWarnings: true
      },
      manifest: {
        name: 'TimerApp',
        short_name: 'TimerApp',
        description: 'TimerApp description TODO',
        theme_color: '#0F0F0F',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
