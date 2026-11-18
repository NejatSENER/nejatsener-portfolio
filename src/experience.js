// experience line map: a winding line drawn by scroll, stops that light up, the character's head riding the tip
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { tt } from './i18n.js';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

export function initExperience(reduce) {
  const root = document.querySelector('.xp');
  if (!root) return;
  const track = root.querySelector('.xp-track');
  const line = root.querySelector('.xp-line');
  const head = root.querySelector('.xp-head');
  const stops = [...root.querySelectorAll('.xp-stop')];
  const scratch = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  scratch.setAttribute('fill', 'none');
  scratch.setAttribute('visibility', 'hidden');
  root.querySelector('.xp-svg').appendChild(scratch);
  const mobile = matchMedia('(max-width: 760px)');
  let len = 1;
  let stopsAt = [];
  let progress = reduce ? 1 : 0;

  function build() {
    const r = root.getBoundingClientRect();
    const pts = stops.map((li) => {
      const d = li.querySelector('.xp-dot').getBoundingClientRect();
      return { x: d.left + d.width / 2 - r.left, y: d.top + d.height / 2 - r.top };
    });
    const first = { x: pts[0].x, y: 0 };
    const last = { x: pts[pts.length - 1].x, y: r.height };
    // one segment per stop (plus the tail), so each stop sits exactly at a segment end
    const segs = [];
    const swing = mobile.matches ? 0 : Math.min(70, r.width * 0.06);
    let prev = first;
    [...pts, last].forEach((p, i) => {
      const dir = i % 2 ? -1 : 1;
      const gap = p.y - prev.y;
      segs.push(mobile.matches
        ? `M${prev.x},${prev.y} L${p.x},${p.y}`
        : `M${prev.x},${prev.y} C${prev.x + swing * dir},${prev.y + gap * 0.45} ${p.x + swing * dir},${p.y - gap * 0.45} ${p.x},${p.y}`);
      prev = p;
    });
    const d = segs.map((sg, i) => (i ? sg.replace(/^M[^ ]+ /, '') : sg)).join(' ');
    track.setAttribute('d', d);
    line.setAttribute('d', d);
    // stop positions as summed segment lengths: a handful of getTotalLength calls instead of sampling
    let acc = 0;
    const ends = segs.map((sg) => { scratch.setAttribute('d', sg); acc += scratch.getTotalLength(); return acc; });
    len = acc;
    stopsAt = ends.slice(0, pts.length).map((e) => e / len);
    render(progress);
  }

  function render(p) {
    progress = p;
    gsap.set(line, { drawSVG: `0% ${p * 100}%` });
    const q = line.getPointAtLength(Math.max(0.01, p) * len);
    gsap.set(head, { x: q.x - head.offsetWidth / 2, y: q.y - head.offsetHeight / 2 });
    stops.forEach((li, i) => li.classList.toggle('is-on', p >= stopsAt[i] - 0.004));
  }

  build();
  // rebuild at most once a frame while the layout moves, refresh scroll positions once it settles
  let frame = 0;
  let settle = 0;
  new ResizeObserver(() => {
    if (!frame) frame = requestAnimationFrame(() => { frame = 0; build(); });
    clearTimeout(settle);
    settle = setTimeout(() => ScrollTrigger.refresh(), 250);
  }).observe(root);

  if (!reduce) {
    const o = { p: 0 };
    gsap.to(o, {
      p: 1,
      ease: 'none',
      scrollTrigger: { trigger: root, start: 'top 62%', end: 'bottom 62%', scrub: 0.6 },
      onUpdate: () => render(o.p),
    });
  }

  // Zorlu details accordion with smooth height
  for (const btn of root.querySelectorAll('.xp-more')) {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', () => toggle(btn, panel, btn.getAttribute('aria-expanded') !== 'true'));
  }

  // hiring mode opens the Zorlu details by default
  document.addEventListener('modechange', (e) => {
    const btn = root.querySelector('.xp-more');
    if (btn) toggle(btn, document.getElementById(btn.getAttribute('aria-controls')), e.detail === 'hire', true);
  });

  function toggle(btn, panel, open, instant = false) {
    btn.setAttribute('aria-expanded', String(open));
    btn.textContent = tt(open ? 'Detayları gizle' : 'Detayları göster');
    const dur = instant || reduce ? 0 : 0.35;
    if (open) {
      panel.hidden = false;
      gsap.fromTo(panel, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: dur * 1.3, ease: 'power3.inOut', overwrite: true });
    } else {
      gsap.to(panel, { height: 0, opacity: 0, duration: dur * 1.3, ease: 'power3.inOut', overwrite: true, onComplete: () => { panel.hidden = true; } });
    }
  }
}
