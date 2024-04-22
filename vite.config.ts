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
        name: 'TimeTracker',
        short_name: 'TimeTracker',
        description: 'TimeTracker is an easy-to-use tool for creating timers and viewing usage graphs by day. It allows you to effectively track your time and view average timer usage.',
        theme_color: '#000000',
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
