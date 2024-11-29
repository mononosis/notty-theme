import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { keycloakify } from "keycloakify/vite-plugin";


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    keycloakify({
      accountThemeImplementation: "none"
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),

    },
  },
})
