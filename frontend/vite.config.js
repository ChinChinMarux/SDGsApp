import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      'rights-pricing-singles-grass.trycloudflare.com', // ← tambahkan host dari tunnel kamu
    ],
  },
});
