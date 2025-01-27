import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'MiniReact',
      formats: ['es', 'umd'],
      fileName: (format) => `myreact.${format}.js`
    },
    outDir: 'dist'
  },
  plugins: [dts()]
}) 