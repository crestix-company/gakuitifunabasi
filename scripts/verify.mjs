import { readFile, stat, readdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const root = resolve(import.meta.dirname, '../dist');
const routes = ['index.html', 'funabashi/index.html', 'tsudanuma/index.html'];
const instagram = 'https://www.instagram.com/yakinikugakuichi/';
let links = 0;
for (const route of routes) {
  const html = await readFile(join(root, route), 'utf8');
  if (!html.includes(instagram)) throw new Error(`Missing supplied Instagram: ${route}`);
  if ((html.match(/<h1\b/g) || []).length !== 1) throw new Error(`Invalid main heading: ${route}`);
  if (!html.includes('noindex,nofollow')) throw new Error(`Private preview indexing policy missing: ${route}`);
  if (/<form\b|TODO|lorem ipsum|PARADISE8|placeholder/i.test(html)) throw new Error(`Unfinished or unrelated content: ${route}`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  if (new Set(ids).size !== ids.length) throw new Error(`Duplicate anchor: ${route}`);
  for (const [, attr, raw] of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
    links++;
    const url = raw.replaceAll('&amp;', '&');
    if (/^(https?:|data:|tel:)/.test(url)) continue;
    if (url.startsWith('/')) throw new Error(`Root-relative path will break project hosting: ${route} ${url}`);
    const current = new URL(route, 'https://local.example/');
    const target = new URL(url, current);
    let path = decodeURIComponent(target.pathname);
    if (path.endsWith('/')) path += 'index.html';
    const file = join(root, path);
    if (!(await stat(file)).size) throw new Error(`Empty asset: ${file}`);
    if (target.hash && attr === 'href') {
      const targetHtml = await readFile(file, 'utf8');
      if (!targetHtml.includes(`id="${target.hash.slice(1)}"`)) throw new Error(`Missing anchor: ${route} ${url}`);
    }
  }
  if (route.includes('funabashi') && (!html.includes('047-429-8861') || !html.includes('strJ001017648'))) throw new Error('Funabashi booking mismatch');
  if (route.includes('tsudanuma') && (!html.includes('047-403-3380') || !html.includes('strJ000025107'))) throw new Error('Tsudanuma booking mismatch');
  console.log(`PASS ${route}`);
}
console.log(`PASS ${routes.length} pages, ${links} asset/link references, branch contacts and Instagram.`);
console.log(`Assets: ${(await readdir(join(root, 'assets'))).length}`);
