import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const code = await readFile(new URL('../dist/assets/site.js', import.meta.url), 'utf8');
function element() {
  const classes = new Set();
  return {
    classList: { add: name => classes.add(name), remove: name => classes.delete(name), contains: name => classes.has(name) },
    closest: () => null,
  };
}
function fixture({ reduced = false, supported = true } = {}) {
  const nodes = [element(), element()];
  const media = { matches: reduced, addEventListener: (_type, fn) => { media.listener = fn; } };
  const instances = [];
  class Observer {
    constructor(callback, options) { this.callback = callback; this.options = options; this.observed = new Set(); instances.push(this); }
    observe(node) { this.observed.add(node); }
    unobserve(node) { this.observed.delete(node); }
    disconnect() { this.observed.clear(); this.disconnected = true; }
  }
  const document = {
    querySelector: () => null,
    querySelectorAll: selector => selector === '.is-revealed' ? nodes.filter(node => node.classList.contains('is-revealed')) : nodes,
    addEventListener: () => {},
  };
  vm.runInNewContext(code, { document, window: supported ? { IntersectionObserver: Observer } : {}, IntersectionObserver: Observer, matchMedia: query => query.includes('reduced-motion') ? media : { addEventListener() {} } });
  return { nodes, media, instances };
}

const normal = fixture();
assert.equal(normal.instances.length, 1);
const observer = normal.instances[0];
assert.equal(observer.observed.size, 2);
observer.callback([{ target: normal.nodes[0], isIntersecting: false }]);
assert.equal(normal.nodes[0].classList.contains('is-revealed'), false);
observer.callback([{ target: normal.nodes[0], isIntersecting: true }]);
assert.equal(normal.nodes[0].classList.contains('is-revealed'), true);
assert.equal(observer.observed.has(normal.nodes[0]), false, 'Reveals must only run once');
normal.media.matches = true;
normal.media.listener();
assert.equal(observer.disconnected, true);
assert.equal(normal.nodes[0].classList.contains('is-revealed'), false);
assert.equal(fixture({ reduced: true }).instances.length, 0);
assert.equal(fixture({ supported: false }).instances.length, 0);
const css = await readFile(new URL('../dist/assets/experience.css', import.meta.url), 'utf8');
assert.ok(css.includes('@media(prefers-reduced-motion:reduce)'));
assert.ok(css.includes('.site-header:not(.menu-ready) nav{display:flex;'));
assert.ok(!code.includes('setInterval') && !code.includes('requestAnimationFrame'));
console.log('PASS: one-time reveals, reduced motion (initial/live), missing observer, no persistent scroll loop, no-JS navigation fallback.');
