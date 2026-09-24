import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { once } from 'node:events';
import assert from 'node:assert/strict';

const root = resolve(import.meta.dirname, '../dist');
const prefix = '/gakuitifunabasi/';
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (!pathname.startsWith(prefix)) throw new Error('Outside project prefix');
    let path = pathname.slice(prefix.length);
    if (!path || path.endsWith('/')) path += 'index.html';
    const file = resolve(root, path);
    if (!file.startsWith(root + sep)) throw new Error('Outside public directory');
    response.end(await readFile(file));
  } catch {
    response.writeHead(404).end('Not found');
  }
});
server.listen(0, '127.0.0.1');
await once(server, 'listening');
const origin = `http://127.0.0.1:${server.address().port}`;
const checked = new Set();
try {
  for (const route of ['', 'funabashi/', 'tsudanuma/']) {
    const page = new URL(prefix + route, origin);
    const response = await fetch(page);
    assert.equal(response.status, 200, page.href);
    const html = await response.text();
    assert.match(html, /<title>[^<]*学一/);
    assert.ok(!/markdown-body|Jekyll|Directory listing|id="ローカルで表示"/.test(html));
    for (const [, value] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      const target = new URL(value.replaceAll('&amp;', '&'), page);
      if (target.origin !== origin) continue;
      assert.ok(target.pathname.startsWith(prefix), `Link escapes project path: ${target}`);
      target.hash = '';
      if (checked.has(target.href)) continue;
      const asset = await fetch(target);
      assert.equal(asset.status, 200, target.href);
      assert.ok((await asset.arrayBuffer()).byteLength > 0, target.href);
      checked.add(target.href);
    }
    console.log(`PASS HTTP ${page.pathname}`);
  }
  console.log(`PASS ${checked.size} project-prefixed pages/assets; no README fallback.`);
} finally {
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
}
