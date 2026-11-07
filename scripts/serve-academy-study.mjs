import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const routes = new Map([
  ['/assets/brand/studio26-transparent-v1-1440.webp', ['public/assets/brand/studio26-transparent-v1-1440.webp', 'image/webp']],
  ['/', ['experiments/academy-hero/index.html', 'text/html; charset=utf-8']],
  ['/study.css', ['experiments/academy-hero/study.css', 'text/css']],
  ['/particles.js', ['experiments/academy-hero/particles.js', 'text/javascript']],
  ['/assets/fonts/instrument-sans-latin.woff2', ['public/assets/fonts/instrument-sans-latin.woff2', 'font/woff2']],
  ['/assets/brand/studio26-transparent-v1-800.webp', ['public/assets/brand/studio26-transparent-v1-800.webp', 'image/webp']],
]);
createServer(async (request, response) => {
  const entry = routes.get(new URL(request.url, 'http://localhost').pathname);
  if (!entry || !['GET', 'HEAD'].includes(request.method)) { response.writeHead(404); response.end(); return; }
  try {
    const data = await readFile(fileURLToPath(new URL(entry[0], root)));
    response.writeHead(200, {'Content-Type': entry[1], 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow'});
    response.end(request.method === 'HEAD' ? undefined : data);
  } catch { response.writeHead(404); response.end(); }
}).listen(3002, '127.0.0.1', () => console.log('Academy opening study: http://127.0.0.1:3002/'));
