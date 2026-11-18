// shared motion layer: nav state, reading progress, heading reveals, counters, magnetic buttons
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { locale } from './i18n.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

export function initMotion(reduce) {
  const nav = document.querySelector('.nav');
  const bar = document.querySelector('.progress');

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (s) => { bar.style.transform = `scaleX(${s.progress})`; },
  });
  // frost the nav as soon as the page moves, so content never runs under bare nav text
  const frost = () => nav.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', frost, { passive: true });
  frost();

  // the nav turns dark over the dark band and the footer; one check so the two never fight
  const dark = [];
  const sync = () => nav.classList.toggle('on-dark', dark.some((t) => t.isActive));
  dark.push(
    ScrollTrigger.create({ trigger: '.sec-dark', start: 'top 64px', end: 'bottom 64px', onToggle: sync }),
    ScrollTrigger.create({ trigger: '.foot', start: 'top 64px', end: 'bottom top', onToggle: sync }),
  );

  // counter targets in the page's number format (30.000 / 30,000); a running count overwrites this on its next frame
  const counts = () => {
    for (const el of document.querySelectorAll('[data-count]')) {
      const dec = Number(el.dataset.decimals || 0);
      el.textContent = Number(el.dataset.count).toLocaleString(locale(), { minimumFractionDigits: dec, maximumFractionDigits: dec });
    }
  };
  counts();
  document.addEventListener('langchange', counts);

  if (reduce) return;

  // section headings rise out of a line mask, once; unsplit while the language switches, then split the new text
  const splits = [];
  document.addEventListener('beforelangchange', () => { for (const s of splits) s.revert(); });
  document.addEventListener('langchange', () => { for (const s of splits) s.split(); });
  document.fonts.ready.then(() => {
    for (const h of document.querySelectorAll('.sec h2')) {
      splits.push(SplitText.create(h, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) => gsap.from(self.lines, {
          yPercent: 110,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: h, start: 'top 88%', once: true },
        }),
      }));
    }
  });

  // numbers count up once when they come into view
  for (const el of document.querySelectorAll('[data-count]')) {
    const to = Number(el.dataset.count);
    const dec = Number(el.dataset.decimals || 0);
    const o = { v: 0 };
    const fmt = () => o.v.toLocaleString(locale(), { minimumFractionDigits: dec, maximumFractionDigits: dec });
    gsap.to(o, {
      v: to,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      onUpdate: () => { el.textContent = fmt(); },
    });
  }

  // magnetic buttons drift toward the pointer (uses the CSS `translate` property, so hover transforms still work)
  if (matchMedia('(hover: hover)').matches) {
    for (const el of document.querySelectorAll('[data-magnetic]')) {
      const set = (x, y) => gsap.to(el, { '--mx': `${x}px`, '--my': `${y}px`, duration: 0.4, ease: 'power3.out', overwrite: true });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        set((e.clientX - r.left - r.width / 2) * 0.3, (e.clientY - r.top - r.height / 2) * 0.4);
      });
      el.addEventListener('pointerleave', () => set(0, 0));
    }
  }
}
