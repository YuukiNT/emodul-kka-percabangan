import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Plugin ringan untuk menyuntikkan daftar aset hasil build ke dist/sw.js
 * agar Service Worker melakukan precache penuh untuk mode luring (offline-first).
 */
function pwaPrecachePlugin() {
  let outDir = 'dist';
  return {
    name: 'pwa-precache-manifest',
    configResolved(config) {
      outDir = config.build.outDir || 'dist';
    },
    closeBundle() {
      const distPath = path.resolve(process.cwd(), outDir);
      const swPath = path.join(distPath, 'sw.js');
      if (!fs.existsSync(swPath)) return;

      const files = [];
      function walk(dir, relPrefix = '') {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, entry.name);
          const rel = relPrefix ? `${relPrefix}/${entry.name}` : entry.name;
          if (entry.isDirectory()) {
            walk(full, rel);
          } else if (entry.name !== 'sw.js' && !entry.name.endsWith('.map')) {
            files.push(`./${rel}`);
          }
        }
      }
      walk(distPath);

      const precacheList = ['./', ...files.sort()];
      const buildStamp = `emodul-kka-v050-${Date.now().toString(36)}`;
      let swContent = fs.readFileSync(swPath, 'utf-8');
      swContent = swContent
        .replaceAll('__CACHE_NAME__', buildStamp)
        .replace('/*__PRECACHE_URLS__*/[]', JSON.stringify(precacheList, null, 2));
      fs.writeFileSync(swPath, swContent, 'utf-8');
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [tailwindcss(), pwaPrecachePlugin()],
  build: {
    target: 'es2020',
    sourcemap: false,
  },
});
