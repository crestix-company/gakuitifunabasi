const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#main-nav');
if (menuButton && menu) menuButton.closest('.site-header')?.classList.add('menu-ready');
function closeMenu(returnFocus = false) {
  menuButton?.setAttribute('aria-expanded', 'false');
  menu?.classList.remove('is-open');
  const label = menuButton?.querySelector('.sr-only');
  if (label) label.textContent = 'メニューを開く';
  if (returnFocus) menuButton?.focus();
}
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menu.classList.toggle('is-open', open);
  menuButton.querySelector('.sr-only').textContent = open ? 'メニューを閉じる' : 'メニューを開く';
});
menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') closeMenu(true); });
document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
matchMedia('(min-width: 801px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

// A single entrance per element. No hidden-content class, scroll loop or dependency.
// If JavaScript or IntersectionObserver is unavailable, the whole page is readable.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let revealObserver;
function setUpReveals() {
  revealObserver?.disconnect();
  document.querySelectorAll('.is-revealed').forEach(element => element.classList.remove('is-revealed'));
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
  revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-revealed');
      revealObserver.unobserve(entry.target);
    }
  }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('[data-reveal], .shop-card, .recruit > div, .instagram-strip > div, .branch-page .section-heading, .menu-feature, .course-photo, .course-list article, .branch-space > *, .access > *, .reservation > h2').forEach(element => revealObserver.observe(element));
}
setUpReveals();
reducedMotion.addEventListener('change', setUpReveals);

// A focused link must never be obscured by its parent's entrance animation.
document.addEventListener('focusin', event => {
  const reveal = event.target.closest('.is-revealed');
  if (reveal) reveal.classList.remove('is-revealed');
});
