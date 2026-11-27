import './style.css';
import './sections.css';
import './cases.css';
import './extras.css';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initMotion } from './motion.js';
import { initExperience } from './experience.js';
import { initCases } from './cases.js';
import { initExtras } from './extras.js';
import { initI18n, getLang, tt } from './i18n.js';
import { COPY_EN } from './en.js';
import { C } from './brand.js';

// bust-shot set (public/v2). Bubble anchor in video coordinates (0..1), left of the face.
const BUBBLE_AT = [0.6, 0.16];
const OUTFIT = { hire: 'suit', client: 'casual', look: 'casual' };
const SPEED = { intro: 1.15, change: 1.1, point: 1.2, bored: 1.2 };
// hero and about copy per mode; hire is also what shows before a choice
const CV_TR = '/cv/Nejat-Berk-Sener-CV-TR.pdf';
const COPY = {
  hire: {
    role: 'BACKEND AĞIRLIKLI FULL-STACK & AI MÜHENDİSİ (.NET / REACT)',
    h1: 'Nejat Berk Şener',
    lead: 'Kurumsal ölçekte yüksek trafikli .NET sistemleri geliştiriyor, modern React arayüzleri ve otonom AI iş akışlarıyla mevcut mimarilere değer katıyorum.',
    a: ['Deneyimi İncele', '#deneyim'],
    b: ["CV'yi İndir", CV_TR, 'download'],
    trust: '',
    kicker: 'Ekibine katılmaya hazırım',
    aboutFirst: 'Kurumsal ölçekte yüksek trafikli backend mimarileri, modern web arayüzleri ve güvenilir AI iş akışları geliştiriyorum.',
    aboutP1: "İki yıl boyunca Zorlu Holding bünyesinde Vestel'den Zorlu Enerji'ye 15'ten fazla kurumsal projede yer aldım. 30 binden fazla kullanıcıya ve 5 milyonun üzerinde kayda hizmet veren sistemlerde; .NET Core, React ve Node.js ile yüksek hacimli API'ler, zamanlanmış görevler ve middleware bileşenleri geliştirdim. SSO, insan kaynakları sistemleri ve Enocta LMS gibi iş kritik entegrasyonların yanı sıra; SQL Server, PostgreSQL, Redis ve Kafka tabanlı veri akışlarını yönettim, CI/CD ve ELK Stack araçlarıyla canlı ortam süreçlerini destekledim.",
    aboutP2: "Son bir yılda bu tecrübeyi yapay zeka sistemlerine taşıyorum; otonom ajan iş akışları, LLM tabanlı otomasyon ve Outlier bünyesinde model değerlendirme süreçleri üzerine çalışıyorum. İTÜ Bilişim Enstitüsü'ndeki yüksek lisans sürecimde ise çok adımlı ajan akışlarının güvenilirliği ve hata toleransı üzerine çalışmayı hedefliyorum.",
    aboutLast: 'Şu an backend ağırlıklı full-stack (.NET / React) ve AI mühendisliği rollerine açığım.',
    facts: [
      ['Deneyim', '2,5+ yıl kurumsal yazılım geliştirme'],
      ['Ölçek', '30.000+ kullanıcı, 5M+ veri kaydı'],
      ['Şu an', "Outlier'da model değerlendirme, İTÜ'de yüksek lisans"],
      ['Konum', 'Beşiktaş, İstanbul'],
      ['Diller', 'Türkçe, İngilizce'],
    ],
  },
  client: {
    role: 'UÇTAN UCA YAZILIM & YAPAY ZEKA OTOMASYON ÇÖZÜMLERİ',
    h1: 'Fikrini Ürüne, Operasyonunu Otomasyona Dönüştürelim.',
    lead: 'İşletmen için uçtan uca web uygulamaları geliştiriyor, manuel iş yükünü sıfıra indiren akıllı yapay zeka asistanları ve veri otomasyonları kuruyorum.',
    a: ['Ücretsiz Ön Görüşme İste', '#iletisim'],
    b: ['Çözümleri Gör', '#hizmetler'],
    trust: '',
    kicker: 'Projeni konuşalım',
    aboutFirst: 'İşletmeni dijitale taşıyan modern web siteleri ve manuel iş yükünü sıfırlayan akıllı otomasyonlar kuruyorum.',
    aboutP1: 'Kurucu ortağı olduğum dijital ajansta 30\'dan fazla işletmeye uçtan uca web ve yazılım çözümleri sundum. Zorlu Holding gibi büyük ölçekli yapılarda edindiğim sistem mimarisi tecrübesiyle, projelerini sadece "çalışır" değil; hızlı, güvenli ve sorunsuz büyüyecek şekilde teslim ediyorum.',
    aboutP2: "Bugün işletmelere özel web siteleri geliştirmenin yanı sıra; potansiyel müşteri analizinden operasyon otomasyonuna kadar iş süreçlerini hızlandıran yapay zeka asistanları kuruyorum. İTÜ'deki yüksek lisans vizyonum ve aktif AI değerlendirme çalışmalarımla, işletmene en güncel ve güvenilir teknolojileri entegre ediyorum.",
    aboutLast: 'Yeni web projen veya iş süreçlerini otomatikleştirmek için bana yazabilirsin.',
    facts: [
      ['Teslimat', '30+ işletmeye uçtan uca dijital çözüm'],
      ['Uzmanlık', 'Kurumsal web siteleri ve AI otomasyonları'],
      ['Çalışma şekli', 'Hızlı prototipleme, anahtar teslim kurulum'],
      ['Şu an', 'Yeni freelance projelere açık'],
      ['Konum / Diller', 'Beşiktaş, İstanbul / Türkçe, İngilizce'],
    ],
  },
  look: {
    role: 'YAZILIM MÜHENDİSİ • AI ARAŞTIRMACISI • ÜRETİCİ',
    h1: 'Selam, ben Nejat.',
    lead: 'Milyonlarca veriyi işleyen kurumsal altyapılar kurmaktan işletmeleri dijitale taşıyan web projelerine, oradan da otonom yapay zeka modellerinin hata analizine uzanan çok yönlü bir mühendislik pratiğim var.',
    a: ['Neler Üzerinde Çalışıyorum?', '#isler'],
    b: ['Bağlantı Kur', '#iletisim'],
    trust: '',
    kicker: 'Merhaba demek için',
    aboutFirst: 'Yazılımın hem mutfağını hem vitrinini hem de yapay zeka tarafını inşa eden bir mühendisim.',
    aboutP1: "Kariyerime büyük ölçekli kurumsal sistemlerin arka planında başladım; Zorlu Holding'de on binlerce kullanıcının günlük operasyonunu sırtlayan entegrasyonlar ve yüksek trafikli servisler geliştirdim.",
    aboutP2: "Bugün üç farklı kulvarda üretmeye devam ediyorum: sağlam backend mimarileri kuruyor, işletmelere özel web projeleri geliştiriyor ve Outlier'da büyük dil modellerinin akıl yürütme ile kodlama sınırlarını değerlendiriyorum. Bunun yanında İTÜ'de yüksek lisans tezim kapsamında çok adımlı ajan akışlarının güvenilirliği üzerine araştırmalar yapmayı hedefliyorum.",
    aboutLast: 'Sistem mimarileri, yapay zeka ajanları veya herhangi bir konu üzerine sohbet etmek istersen her zaman yazabilirsin.',
    facts: [
      ['Arka plan', 'Kurumsal backend ve full-stack geliştirme'],
      ['Güncel odak', 'AI değerlendirme, freelance web ve ajan sistemleri'],
      ['Şu an', "Outlier'da model değerlendirme, İTÜ'de yüksek lisans"],
      ['Konum', 'Beşiktaş, İstanbul'],
      ['Diller', 'Türkçe, İngilizce'],
    ],
  },
};
const IDLE_BORED = 25000;
const IDLE_HOLD = 4000;
const STORE = 'pf-mode';

const $ = (s) => document.querySelector(s);
const hero = $('.hero');
const stage = $('.stage');
const layers = [...stage.querySelectorAll('video')];
const poster = $('.poster');
const bubble = $('.bubble');
const modeBtn = $('.mode-btn');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const phone = matchMedia('(max-width: 760px)').matches;
// phones (for now) and reduced motion get still images instead of video
const still = reduce || phone;
const SIZE = phone ? '720' : (screen.width * devicePixelRatio > 2000 ? '1440' : '1080');

let outfit = 'casual';
let mode = null;
let asked = false;
let state = 'intro';
let seq = 0;
let front = 0;
let queue = Promise.resolve();
const blobs = new Map();

const store = {
  get: () => { try { return localStorage.getItem(STORE); } catch { return null; } },
  set: (v) => { try { localStorage.setItem(STORE, v); } catch {} },
  clear: () => { try { localStorage.removeItem(STORE); } catch {} },
};

// ---------- media ----------
const fileOf = (n) => `/v2/${SIZE}/${n}.mp4`;
const src = (n) => blobs.get(n) || fileOf(n);

async function prefetch(names) {
  for (const n of names) {
    if (blobs.has(n)) continue;
    try {
      const r = await fetch(fileOf(n));
      if (r.ok && r.headers.get('content-type')?.startsWith('video')) blobs.set(n, URL.createObjectURL(await r.blob()));
    } catch {}
  }
}

function setPoster(name) {
  const base = `/v2/poster/${name}`;
  poster.srcset = `${base}_1280.webp 1280w, ${base}_1920.webp 1920w, ${base}_2560.webp 2560w`;
  poster.sizes = '100vw';
  poster.src = `${base}_1920.webp`;
}

const once = (el, ev) => new Promise((res, rej) => {
  el.addEventListener(ev, res, { once: true });
  el.addEventListener('error', rej, { once: true });
});

function ended(v) {
  return new Promise((res, rej) => {
    v.addEventListener('error', rej, { once: true });
    v.addEventListener('ended', res, { once: true });
  });
}

function show(name, opt) {
  const p = queue.then(() => swap(name, opt || {}));
  queue = p.catch(() => {});
  return p;
}

// iOS Safari loads no frames until play() is called, so start playback first instead of waiting for data
async function swap(name, { loop = false, rate = 1 }) {
  const cur = layers[front];
  const nx = layers[1 - front];
  nx.loop = loop;
  nx.defaultPlaybackRate = rate;
  nx.src = src(name);
  try {
    await nx.play();
  } catch (e) {
    // autoplay refused (e.g. iOS Low Power Mode): keep the still image and retry on the first touch
    nx.removeAttribute('src');
    blocked = true;
    if (poster.classList.contains('on')) setPoster(`${outfit}_idle`);
    throw e;
  }
  if (nx.readyState < 2) await once(nx, 'loadeddata');
  nx.playbackRate = rate;
  // fade the new layer in on top; the old one stays fully opaque underneath until covered
  nx.style.zIndex = 2;
  cur.style.zIndex = 1;
  nx.classList.add('on');
  front = 1 - front;
  setTimeout(() => {
    if (layers[1 - front] !== cur) return;
    cur.classList.remove('on');
    cur.pause();
    poster.classList.remove('on');
  }, 220);
  return nx;
}

// ---------- states ----------
let boredTimer;
let blocked = false;

// a touch or click lets the browser play video again; restart the idle loop if autoplay was refused
function unlock() {
  if (!blocked) return;
  blocked = false;
  // a play() call inside the gesture is what grants permission; stop it at once, the state machine plays for real
  for (const v of layers) { v.play().catch(() => {}); v.pause(); }
  // the same tap may also pick a mode; only restart the idle loop if nothing else started
  const id = seq;
  setTimeout(() => { if (seq === id) goIdle(); }, 400);
}

async function run(steps, then = () => goIdle(true)) {
  const id = ++seq;
  clearTimeout(boredTimer);
  try {
    for (const s of steps) {
      state = s.state || 'act';
      const v = await show(s.name, { rate: s.rate || 1 });
      if (id !== seq) return;
      if (s.onStart) s.onStart(v);
      await ended(v);
      if (id !== seq) return;
    }
  } catch {
    if (id !== seq) return;
    for (const s of steps) s.onFail?.();
  }
  then();
}

// idle plays once, then holds its last frame before playing again
function goIdle(holdFirst = false) {
  const id = ++seq;
  state = 'idle';
  const cycle = async () => {
    try {
      const v = await show(`${outfit}_idle`);
      if (id !== seq) return;
      await ended(v);
    } catch {
      return;
    }
    if (id === seq) setTimeout(() => { if (id === seq) cycle(); }, IDLE_HOLD);
  };
  if (holdFirst) setTimeout(() => { if (id === seq) cycle(); }, IDLE_HOLD);
  else cycle();
  armBored();
}

function armBored() {
  clearTimeout(boredTimer);
  boredTimer = setTimeout(() => {
    if (state === 'idle' && !document.hidden) run([{ name: `${outfit}_bored`, rate: SPEED.bored }]);
  }, IDLE_BORED);
}

// ---------- geometry ----------
function videoBox() {
  const r = stage.getBoundingClientRect();
  const s = Math.max(r.width / 16, r.height / 9);
  const w = 16 * s;
  const h = 9 * s;
  const [px, py] = getComputedStyle(layers[0]).objectPosition.split(' ').map(parseFloat);
  return { x: r.left + (r.width - w) * px / 100, y: r.top + (r.height - h) * py / 100, w, h };
}

// ---------- bubble and mode ----------
function placeBubble() {
  if (phone) return;
  const b = videoBox();
  const hr = hero.getBoundingClientRect();
  const x = b.x + BUBBLE_AT[0] * b.w - hr.left;
  const y = b.y + BUBBLE_AT[1] * b.h - hr.top;
  bubble.style.left = `${Math.max(16, x - bubble.offsetWidth)}px`;
  bubble.style.top = `${Math.max(84, y)}px`;
}

const veil = document.querySelector('.bubble-veil');

function openBubble() {
  if (!bubble.hidden && bubble.classList.contains('open')) return;
  asked = true;
  bubble.hidden = false;
  if (phone) {
    // phones: a centred modal over a dimmed page instead of a bubble beside the character
    bubble.classList.add('is-modal');
    veil.hidden = false;
    hideChipNow();
    requestAnimationFrame(() => { bubble.classList.add('open'); veil.classList.add('on'); });
    return;
  }
  placeBubble();
  requestAnimationFrame(() => bubble.classList.add('open'));
  if (!mode) requestAnimationFrame(startFloat);
}
function closeBubble() {
  stopFloat();
  bubble.classList.remove('open');
  veil.classList.remove('on');
  setTimeout(() => { bubble.hidden = true; veil.hidden = true; bubble.classList.remove('is-modal'); }, 250);
}
// phone modal dismissed without an answer: fold it into the corner chip
function dismissModal() {
  closeBubble();
  if (mode) return;
  setTimeout(() => {
    chip.hidden = false;
    chip.style.scale = '';
    chip.style.pointerEvents = 'auto';
    chip.tabIndex = 0;
    requestAnimationFrame(() => { chip.style.opacity = 1; });
  }, 200);
}
function hideChipNow() {
  chip.hidden = true;
  chip.style.opacity = 0;
}

// ---------- unanswered question follows the scroll, then folds into a corner chip ----------
// Everything is driven by a smoothed scroll value, so it rewinds when the visitor scrolls back up.
const chip = document.querySelector('.tune-chip');
const FOLLOW = 0.28;   // the bubble keeps up with the scroll for this share of the viewport
const MORPH = 0.32;    // then it shrinks into the chip over this share
const DRIFT = 0.35;    // how far it sinks inside the viewport while following
let float = null;
let sm = 0;
let floatRaf = 0;

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const ease = (t) => t * t * (3 - 2 * t);

function startFloat() {
  if (mode || reduce || float || bubble.hidden) return;
  const r = bubble.getBoundingClientRect();
  float = { x: r.left, pageY: r.top + scrollY, w: r.width, h: r.height };
  bubble.style.setProperty('--fw', `${r.width}px`);
  bubble.classList.add('is-floating');
  chip.hidden = false;
  // the chip's resting box, read once (its inline scale would skew a live measurement)
  const cs = getComputedStyle(chip);
  const ch = chip.offsetHeight;
  float.chip = { h: ch, right: innerWidth - parseFloat(cs.right), top: innerHeight - parseFloat(cs.bottom) - ch };
  sm = scrollY;
  const tick = () => {
    if (!float) return;
    sm += (scrollY - sm) * 0.12;
    renderFloat();
    floatRaf = requestAnimationFrame(tick);
  };
  floatRaf = requestAnimationFrame(tick);
}

function renderFloat() {
  const vh = innerHeight;
  const follow = FOLLOW * vh;
  // natural spot in the viewport, pulled down by the (lagging) scroll up to the follow limit,
  // plus a little extra sink so it visibly slides down with the page
  const pulled = Math.min(sm, follow);
  const baseY = float.pageY - scrollY + pulled + pulled * DRIFT;
  const p = ease(clamp01((sm - follow) / (MORPH * vh)));
  const c = float.chip;
  const k = 1 + (c.h / float.h - 1) * p;
  const x = float.x + (c.right - float.w * k - float.x) * p;
  const y = baseY + (c.top - baseY) * p;
  bubble.style.translate = `${x}px ${y}px`;
  bubble.style.scale = k;
  bubble.style.opacity = 1 - clamp01((p - 0.55) / 0.35);
  bubble.style.pointerEvents = p > 0.5 ? 'none' : '';
  const q = clamp01((p - 0.7) / 0.3);
  chip.style.opacity = q;
  chip.style.scale = 0.7 + 0.3 * q;
  chip.style.pointerEvents = q > 0.9 ? 'auto' : 'none';
  chip.tabIndex = q > 0.9 ? 0 : -1;
}

function stopFloat() {
  cancelAnimationFrame(floatRaf);
  float = null;
  bubble.classList.remove('is-floating');
  for (const prop of ['translate', 'scale', 'opacity', 'pointerEvents']) bubble.style[prop] = '';
  chip.hidden = true;
}

// phone menu: toggles a full-screen list of the nav links
function initMenu() {
  const btn = document.querySelector('.menu-btn');
  const panel = document.getElementById('mobile-menu');
  const set = (open) => {
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', tt(open ? 'Menüyü kapat' : 'Menüyü aç'));
    document.documentElement.classList.toggle('menu-open', open);
    if (open) {
      panel.hidden = false;
      requestAnimationFrame(() => panel.classList.add('on'));
      panel.querySelector('a').focus({ preventScroll: true });
    } else {
      panel.classList.remove('on');
      setTimeout(() => { if (!panel.classList.contains('on')) panel.hidden = true; }, 300);
    }
  };
  btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
  for (const a of panel.querySelectorAll('a')) a.addEventListener('click', () => set(false));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { set(false); btn.focus(); } });
}

function watchUnanswered() {
  // reduced motion: no follow or morph, the chip simply takes over once the hero is gone
  if (reduce) {
    addEventListener('scroll', () => {
      if (mode || bubble.hidden) return;
      const gone = hero.getBoundingClientRect().bottom < innerHeight * 0.45;
      chip.hidden = !gone;
      chip.style.opacity = gone ? 1 : 0;
      chip.style.pointerEvents = gone ? 'auto' : 'none';
    }, { passive: true });
  }
  chip.addEventListener('click', () => {
    if (phone) { openBubble(); bubble.querySelector('[data-mode]').focus({ preventScroll: true }); return; }
    scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    setTimeout(() => bubble.querySelector('[data-mode]').focus({ preventScroll: true }), reduce ? 0 : 900);
  });
  // layout changed: measure the bubble's resting spot again
  addEventListener('resize', () => {
    if (!float) return;
    stopFloat();
    placeBubble();
    startFloat();
  });
}

// section order and visibility per mode; "look" is also the order before any choice
function orderSections(m) {
  for (const s of document.querySelectorAll('.sec')) {
    const o = Number(s.dataset[`order${m[0].toUpperCase()}${m.slice(1)}`]);
    s.style.order = o;
    s.hidden = o >= 90;
  }
}

// fill every [data-copy] element and the facts list from COPY[m]
function applyCopy(m, animate) {
  const c = (getLang() === 'en' ? COPY_EN : COPY)[m];
  for (const el of document.querySelectorAll('[data-copy]')) {
    const v = c[el.dataset.copy];
    if (v === undefined) continue;
    if (Array.isArray(v)) {
      el.textContent = v[0];
      el.href = v[1];
      el.toggleAttribute('download', v[2] === 'download');
    } else {
      el.textContent = v;
      el.hidden = v === '';
    }
    if (animate) { el.classList.remove('copy-swap'); void el.offsetWidth; el.classList.add('copy-swap'); }
  }
  for (const dl of document.querySelectorAll('[data-copy-list="facts"]')) {
    dl.replaceChildren(...c.facts.map(([dt, dd]) => {
      const row = document.createElement('div');
      row.append(Object.assign(document.createElement('dt'), { textContent: dt }), Object.assign(document.createElement('dd'), { textContent: dd }));
      return row;
    }));
  }
  document.querySelector('.intro h1').classList.toggle('h1-long', c.h1.length > 24);
}

function applyMode(m, animate) {
  mode = m;
  applyCopy(m, animate);
  orderSections(m);
  modeBtn.hidden = false;
  document.documentElement.dataset.mode = m;
  document.dispatchEvent(new CustomEvent('modechange', { detail: m }));
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

function choose(m) {
  store.set(m);
  closeBubble();
  applyMode(m, true);
  const target = OUTFIT[m];
  if (still) {
    outfit = target;
    document.documentElement.dataset.outfit = outfit;
    setPoster(`${outfit}_idle`);
    return;
  }
  if (target === outfit) {
    run([{ name: `${outfit}_point`, rate: SPEED.point }]);
    return;
  }
  const clip = target === 'suit' ? 'change' : 'change_back';
  outfit = target;
  document.documentElement.dataset.outfit = outfit;
  run([{ name: clip, rate: SPEED.change, state: 'change' }]);
  prefetch([`${outfit}_point`, `${outfit}_bored`]);
}

function skipIntro() {
  if (state !== 'intro') return;
  goIdle();
  if (!mode) setTimeout(openBubble, 300);
}

// ---------- events ----------
function bindEvents() {
  addEventListener('pointerdown', unlock, { capture: true });
  addEventListener('keydown', unlock, { capture: true });
  stage.addEventListener('pointerdown', skipIntro);
  addEventListener('keydown', (e) => { if (e.key === 'Escape') skipIntro(); });
  addEventListener('wheel', skipIntro, { passive: true });

  let lastPoint = 0;
  const point = () => {
    if (state === 'idle' && performance.now() - lastPoint > 8000) {
      lastPoint = performance.now();
      run([{ name: `${outfit}_point`, rate: SPEED.point }]);
    }
  };
  const primary = $('.btn-primary');
  primary.addEventListener('mouseenter', point);
  primary.addEventListener('focus', point);

  for (const b of bubble.querySelectorAll('[data-mode]')) b.addEventListener('click', () => choose(b.dataset.mode));
  bubble.addEventListener('keydown', (e) => { if (e.key === 'Escape') (phone ? dismissModal : closeBubble)(); });
  bubble.querySelector('.bubble-x').addEventListener('click', dismissModal);
  veil.addEventListener('click', dismissModal);
  modeBtn.addEventListener('click', () => {
    scrollTo({ top: 0 });
    openBubble();
    bubble.querySelector('[data-mode]').focus();
  });
  addEventListener('resize', () => { if (!bubble.hidden) placeBubble(); });
}

// ---------- start ----------
function main() {
  for (const el of document.querySelectorAll('[data-brand]')) el.textContent = `${C} ${el.dataset.brand}`;
  initI18n();
  // mode copy is data, not page text: refill it in the new language
  document.addEventListener('langchange', () => {
    applyCopy(mode || 'hire', true);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  });
  const params = new URLSearchParams(location.search);
  if (params.has('reset')) store.clear();
  const param = { hire: 'hire', client: 'client' }[params.get('for')];
  const saved = param || store.get();
  if (saved && COPY[saved]) {
    applyMode(saved, false);
    if (param) store.set(param);
  }
  if (!mode) { orderSections('look'); applyCopy('hire', false); }
  outfit = mode ? OUTFIT[mode] : 'casual';
  document.documentElement.dataset.outfit = outfit;

  bindEvents();
  watchUnanswered();
  initMenu();
  initMotion(reduce);
  initExperience(reduce);
  initCases(reduce);
  initExtras(reduce);
  // sections above render after the triggers were created; measure again once layout and fonts settle
  requestAnimationFrame(() => ScrollTrigger.refresh());
  document.fonts.ready.then(() => ScrollTrigger.refresh());
  if (mode) document.dispatchEvent(new CustomEvent('modechange', { detail: mode }));

  if (still) {
    setPoster(`${outfit}_idle`);
    state = 'still';
    if (!mode) openBubble();
    return;
  }

  // returning visitor in suit: no walk-in, straight to the suit idle
  if (outfit === 'suit') {
    setPoster('suit_idle');
    goIdle();
    prefetch(['suit_point', 'suit_bored', 'change_back']);
    return;
  }

  setPoster('start');
  // the question normally comes as the intro ends; ask anyway if the video stalls or loads slowly
  setTimeout(() => { if (!mode && !asked) openBubble(); }, 7000);
  prefetch(['casual_idle', 'change', 'casual_point', 'casual_bored']);
  run([{
    name: 'casual_intro',
    rate: SPEED.intro,
    state: 'intro',
    onFail: () => { if (!mode) openBubble(); },
    onStart: (v) => {
      if (mode) return;
      const at = Math.max(0, (v.duration - 1.2) / SPEED.intro * 1000);
      setTimeout(() => { if (state === 'intro') openBubble(); }, at);
    },
  }]);
}

main();
