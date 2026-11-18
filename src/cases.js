// "Örnek işler": sticky card stack, animated visuals, FLIP drawer
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BACKEND, caseFor, cardHTML, drawerHTML } from './cases-data.js';
import { locale } from './i18n.js';

gsap.registerPlugin(ScrollTrigger);

const stackMQ = matchMedia('(min-width: 861px)');
const CARD_BG = '#2A2A27';
const PAPER = '#F3F3F1';

export function initCases(reduce) {
  const list = document.querySelector('.cases');
  const dialog = document.querySelector('.drawer');
  if (!list || !dialog) return;
  const panel = dialog.querySelector('.drawer-panel');
  const body = dialog.querySelector('.drawer-body');
  let triggers = [];
  let opener = null;

  function render() {
    const mode = document.documentElement.dataset.mode;
    triggers.forEach((t) => t.kill());
    triggers = [];
    const ids = BACKEND;
    list.innerHTML = ids.map((id, i) => cardHTML(id, i, mode)).join('');
    const cards = [...list.querySelectorAll('.case')];
    list.style.setProperty('--n', cards.length);

    for (const card of cards) {
      card.querySelector('.case-open').addEventListener('click', () => open(card));
      animateVisual(card);
    }
    if (reduce) return;

    // each card shrinks and dims as the next one slides over it
    // sticky offsets and the gap come from CSS, so phone and desktop share this
    const top = (el) => parseFloat(getComputedStyle(el).top) || 0;
    const gap = () => parseFloat(getComputedStyle(list).rowGap) || 0;
    cards.slice(0, -1).forEach((card, i) => {
      const next = cards[i + 1];
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: next,
          start: () => `top ${top(card) + card.offsetHeight + gap()}px`,
          end: () => `top ${top(next)}px`,
          scrub: true,
        },
      });
      tl.to(card, { scale: 0.94, ease: 'none' }, 0)
        .to(card.querySelector('.case-shade'), { opacity: 0.55, ease: 'none' }, 0);
      triggers.push(tl.scrollTrigger);
    });
    ScrollTrigger.refresh();
  }

  // bars grow, beams start, eval dots fill once the card is on screen
  function animateVisual(card) {
    const st = ScrollTrigger.create({
      trigger: card,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        card.classList.add('is-live');
        if (reduce) return;
        for (const b of card.querySelectorAll('[data-to]')) {
          const o = { v: 0 };
          const to = Number(b.dataset.to);
          gsap.to(o, { v: to, duration: 1.4, ease: 'power2.out', onUpdate: () => { b.textContent = Math.round(o.v).toLocaleString(locale()); } });
        }
      },
    });
    triggers.push(st);
  }

  // ---------- drawer ----------
  function open(card) {
    opener = card;
    const c = caseFor(card.dataset.case);
    body.innerHTML = drawerHTML(c);
    body.querySelector('.drawer-visual .viz')?.closest('.drawer-visual').classList.add('is-live');
    dialog.showModal();
    document.documentElement.classList.add('drawer-open');
    body.scrollTop = 0;
    if (reduce) return;
    // FLIP: the panel starts on the card's box and grows into place
    const from = card.getBoundingClientRect();
    const to = panel.getBoundingClientRect();
    // starts in the card's dark colour and turns into the paper panel as it grows
    gsap.fromTo(panel,
      { x: from.left - to.left, y: from.top - to.top, scaleX: from.width / to.width, scaleY: from.height / to.height, borderRadius: 28, backgroundColor: CARD_BG },
      { x: 0, y: 0, scaleX: 1, scaleY: 1, borderRadius: 0, backgroundColor: PAPER, duration: 0.6, ease: 'expo.inOut', transformOrigin: '0 0' });
    gsap.fromTo(body.children, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.04, delay: 0.42, ease: 'power2.out' });
    gsap.fromTo(dialog, { '--veil': 0 }, { '--veil': 1, duration: 0.4 });
  }

  function close() {
    if (!dialog.open) return;
    const done = () => { if (dialog.open) dialog.close(); cleanup(); };
    setTimeout(done, 800);
    if (reduce || !opener) return done();
    const from = opener.getBoundingClientRect();
    const to = panel.getBoundingClientRect();
    // shrinks back onto the card, darkening to the card's colour and fading out at the end
    gsap.to(body.children, { opacity: 0, duration: 0.15 });
    gsap.to(dialog, { '--veil': 0, duration: 0.5 });
    const tl = gsap.timeline({ onComplete: done });
    tl.to(panel, {
      x: from.left - to.left, y: from.top - to.top, scaleX: from.width / to.width, scaleY: from.height / to.height,
      borderRadius: 28, backgroundColor: CARD_BG, duration: 0.55, ease: 'expo.inOut', transformOrigin: '0 0',
    }, 0).to(panel, { opacity: 0, duration: 0.25, ease: 'power1.out' }, 0.38);
  }

  // idempotent: called by close() and by the native close event
  function cleanup() {
    if (!document.documentElement.classList.contains('drawer-open')) return;
    document.documentElement.classList.remove('drawer-open');
    gsap.set(panel, { clearProps: 'all' });
    opener?.querySelector('.case-open')?.focus();
  }
  dialog.addEventListener('close', cleanup);
  dialog.querySelector('.drawer-close').addEventListener('click', close);
  dialog.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
  dialog.addEventListener('click', (e) => { if (e.target === dialog) close(); });

  render();
  stackMQ.addEventListener('change', render);
  document.addEventListener('modechange', render);
  document.addEventListener('langchange', render);

  // links elsewhere on the page (services) can open a case directly
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-open-case]');
    if (!link) return;
    const card = list.querySelector(`[data-case="${link.dataset.openCase}"]`);
    if (!card) return;
    e.preventDefault();
    card.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    setTimeout(() => open(card), reduce ? 0 : 750);
  });
}
