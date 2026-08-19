import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { cpSync, existsSync } from 'node:fs'

const root = process.cwd()

// The storefront is a mixed Vite + static multi-page site.
// Product images and the shared store script live outside /public,
// so explicitly copy them into the final Netlify /dist output.
function copyStorefrontStaticAssets() {
  return {
    name: 'copy-storefront-static-assets',
    closeBundle() {
      for (const dir of ['images', 'js']) {
        const source = resolve(root, dir)
        const destination = resolve(root, 'dist', dir)
        if (existsSync(source)) {
          cpSync(source, destination, { recursive: true })
        }
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), copyStorefrontStaticAssets()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(root, 'index.html'),
        shop: resolve(root, 'shop.html'),
        product: resolve(root, 'product.html'),
        admin: resolve(root, 'admin.html'),
        journal: resolve(root, 'journal.html'),
      },
    },
  },
})
