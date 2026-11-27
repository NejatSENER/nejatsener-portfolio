// TR/EN switch: static text is translated in place by lookup, dynamic parts re-render on 'langchange'
import { EN } from './en.js';

const KEY = 'pf-lang';
const TR = Object.fromEntries(Object.entries(EN).map(([tr, en]) => [en, tr]));
const ATTRS = ['aria-label', 'alt', 'title', 'placeholder', 'data-toast'];
// rendered from data (cases, skills, mode copy) or code samples: never walked
const SKIP = 'script, style, pre, code, svg, .cases, .drawer-body, .skills, .toast, .foot-name, .cap-box, [data-copy], [data-copy-list]';

const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
const write = (v) => { try { localStorage.setItem(KEY, v); } catch {} };

function initial() {
  const q = new URLSearchParams(location.search).get('lang');
  if (q === 'tr' || q === 'en') { write(q); return q; }
  const saved = read();
  if (saved === 'tr' || saved === 'en') return saved;
  return (navigator.language || 'tr').toLowerCase().startsWith('tr') ? 'tr' : 'en';
}

let lang = initial();
export const getLang = () => lang;
export const locale = () => (lang === 'en' ? 'en-US' : 'tr-TR');
// translate one Turkish source string for the current language
export const tt = (s) => (lang === 'en' && EN[s]) || s;

const norm = (s) => s.replace(/\s+/g, ' ').trim();
const swap = (s) => {
  const k = norm(s);
  if (!k) return null;
  const v = lang === 'en' ? EN[k] : TR[k];
  if (v === undefined || v === k) return null;
  const lead = s.match(/^\s*/)[0];
  const tail = s.match(/\s*$/)[0];
  return lead + v + tail;
};

function translateDOM() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.parentElement.closest(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const v = swap(n.data);
    if (v !== null) n.data = v;
  }
  for (const a of ATTRS) {
    for (const el of document.querySelectorAll(`[${a}]`)) {
      if (el.parentElement?.closest(SKIP)) continue;
      const v = swap(el.getAttribute(a));
      if (v !== null) el.setAttribute(a, v);
    }
  }
  // links with a separate English target, e.g. the CV files
  for (const el of document.querySelectorAll('[data-href-en]')) {
    el.dataset.hrefTr ??= el.getAttribute('href');
    el.setAttribute('href', lang === 'en' ? el.dataset.hrefEn : el.dataset.hrefTr);
  }
  const t = swap(document.title);
  if (t !== null) document.title = t;
  const meta = document.querySelector('meta[name="description"]');
  const d = meta && swap(meta.content);
  if (d) meta.content = d;
  document.documentElement.lang = lang;
  for (const b of document.querySelectorAll('[data-lang]')) b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
}

export function setLang(l) {
  if (l === lang) return;
  lang = l;
  write(l);
  document.dispatchEvent(new Event('beforelangchange'));
  translateDOM();
  document.dispatchEvent(new CustomEvent('langchange', { detail: l }));
}

// run before anything else renders, so the first paint of every module is already in the right language
export function initI18n() {
  translateDOM();
  for (const b of document.querySelectorAll('[data-lang]')) b.addEventListener('click', () => setLang(b.dataset.lang));
}
