import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // This MUST match your GitHub repository name
  base: "/Smart-Event-Management/", 
  plugins: [react()],
})