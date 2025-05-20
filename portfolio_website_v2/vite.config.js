import { defineConfig } from 'vite';
import pugPlugin from 'vite-plugin-pug';

const locals = { title: 'My Site' };

export default defineConfig({
  plugins: [pugPlugin({ pretty: true }, locals)],
  root: 'src', // Set the root folder to `src`
  build: {
    outDir: '../dist', // Output build to `dist` (relative to root)
    emptyOutDir: true, // Clean `dist` folder before building
    rollupOptions: {
      input: 'index.pug', // Correct the entry file path (relative to `src/`)
      output: {
        entryFileNames: 'bundle.js', // Output the JS bundle as `bundle.js`
        assetFileNames: '[name][extname]' // Keep asset names like `style.css`
      }
    }
  }
});
