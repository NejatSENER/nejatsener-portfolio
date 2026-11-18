// open source, skills, services, process, FAQ, contact form, dock, footer
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { tt } from './i18n.js';
import { C } from './brand.js';

gsap.registerPlugin(ScrollTrigger, Flip);

const hover = matchMedia('(hover: hover)');
const TO = 'nejatsenerr@gmail.com';
// Web3Forms access key: public by design, it only lets the form send to the owner's inbox
const FORM_KEY = '4cea02ea-28b7-4690-bcc3-8e95279d0be5';

// [icon, name, categories (space separated)]
const SKILLS = [
  ['csharp', 'C#', 'backend'],
  ['dotnetcore', '.NET', 'backend'],
  ['dotnet', 'ASP.NET MVC', 'backend'],
  ['nodejs', 'Node.js', 'backend'],
  ['python', 'Python', 'backend ai'],
  ['postgresql', 'PostgreSQL', 'data'],
  ['sqlserver', 'SQL Server', 'data'],
  ['redis', 'Redis', 'data'],
  ['mongodb', 'MongoDB', 'data'],
  ['elasticsearch', 'Elasticsearch', 'data'],
  ['kafka', 'Kafka', 'msg'],
  ['rabbitmq', 'RabbitMQ', 'msg'],
  ['docker', 'Docker', 'ops'],
  ['git', 'Git', 'ops'],
  ['azuredevops', 'Azure DevOps', 'ops'],
  ['githubactions', 'GitHub Actions', 'ops'],
  ['kibana', 'ELK', 'ops'],
  ['sonarqube', 'SonarQube', 'ops'],
  ['spark', `${C} API`, 'ai'],
  ['openai', 'OpenAI API', 'ai'],
  ['langchain', 'LangChain', 'ai'],
  ['paperclip', 'Paperclip', 'ai'],
  ['ollama', 'Ollama', 'ai'],
  ['react', 'React', 'front'],
  ['typescript', 'TypeScript', 'front'],
  ['javascript', 'JavaScript', 'front'],
  ['html5', 'HTML', 'front'],
  ['css3', 'CSS', 'front'],
  ['bootstrap', 'Bootstrap', 'front'],
  ['vite', 'Vite', 'front'],
];

export function initExtras(reduce) {
  initCopy();
  initTerminal(reduce);
  initSkills(reduce);
  initServices();
  initSteps(reduce);
  initFaq(reduce);
  initForm();
  initDock(reduce);
  initFooter(reduce);
}

// ---------- copy + toast ----------
const toast = () => document.querySelector('.toast');
let toastTimer;
function showToast(text) {
  const t = toast();
  t.querySelector('.toast-text').textContent = text;
  t.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('is-on'), 1800);
}

function initCopy() {
  for (const b of document.querySelectorAll('[data-copy-text]')) {
    b.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(b.dataset.copyText); } catch {}
      showToast(b.dataset.toast || tt('Kopyalandı'));
    });
  }
}

// ---------- terminal: output types itself once ----------
function initTerminal(reduce) {
  const out = document.querySelector('.term-out[data-type]');
  if (!out || reduce) return;
  const full = out.innerHTML;
  const lines = full.split('\n');
  out.innerHTML = '';
  ScrollTrigger.create({
    trigger: out,
    start: 'top 80%',
    once: true,
    onEnter: async () => {
      const first = lines[0];
      const cmd = 'dotnet run';
      const prompt = first.replace(cmd, '');
      out.innerHTML = prompt;
      for (const ch of cmd) {
        out.innerHTML += ch;
        await wait(55);
      }
      await wait(380);
      for (const l of lines.slice(1)) {
        out.innerHTML += `\n${l}`;
        await wait(240);
      }
      out.classList.add('done');
    },
  });
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- skills: filter with Flip, proximity scale ----------
function initSkills(reduce) {
  const list = document.querySelector('.skills');
  if (!list) return;
  list.innerHTML = SKILLS.map(([icon, name, cat]) => `
    <li class="skill" data-cat="${cat}">
      <div class="skill-tile">
        <span class="skill-icon">${icon ? `<img src="/icons/${icon}.svg" alt="" width="40" height="40" loading="lazy">` : `<b>${name.slice(0, 2)}</b>`}</span>
        <span class="skill-name">${name}</span>
      </div>
    </li>`).join('');

  const items = [...list.querySelectorAll('.skill')];
  for (const f of document.querySelectorAll('.filter')) {
    f.addEventListener('click', () => {
      for (const o of document.querySelectorAll('.filter')) {
        o.classList.toggle('is-on', o === f);
        o.setAttribute('aria-pressed', String(o === f));
      }
      const state = Flip.getState(items);
      const from = list.offsetHeight;
      for (const it of items) it.hidden = !(f.dataset.filter === 'all' || it.dataset.cat.split(' ').includes(f.dataset.filter));
      if (reduce) { ScrollTrigger.refresh(); return; }
      // the grid's height glides to its new size, so the sections below never jump
      const to = list.offsetHeight;
      gsap.killTweensOf(list);
      gsap.fromTo(list, { height: from }, { height: to, duration: 0.55, ease: 'power3.inOut' });
      // release the fixed height only after the items are back in normal flow
      Flip.from(state, {
        duration: 0.55,
        ease: 'power3.inOut',
        absolute: true,
        onComplete: () => { gsap.set(list, { clearProps: 'height' }); ScrollTrigger.refresh(); },
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.45 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.6, duration: 0.3 }),
      });
    });
  }

  if (reduce || !hover.matches) return;
  // icons near the pointer grow, like a dock
  const icons = items.map((it) => it.querySelector('.skill-icon'));
  list.addEventListener('pointermove', (e) => {
    for (const ic of icons) {
      if (ic.closest('.skill').hidden) continue;
      const r = ic.getBoundingClientRect();
      const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
      const s = 1 + Math.max(0, 1 - d / 160) * 0.35;
      gsap.to(ic, { scale: s, duration: 0.3, ease: 'power3.out', overwrite: 'auto' });
    }
  });
  list.addEventListener('pointerleave', () => gsap.to(icons, { scale: 1, duration: 0.4, ease: 'power3.out' }));
}

// ---------- services: the hovered or focused panel opens ----------
function initServices() {
  const panels = [...document.querySelectorAll('.svc')];
  const openOne = (p) => panels.forEach((x) => x.classList.toggle('is-open', x === p));
  for (const p of panels) {
    p.addEventListener('mouseenter', () => openOne(p));
    p.addEventListener('focusin', () => openOne(p));
    p.addEventListener('click', () => openOne(p));
  }
}

// ---------- process: a line fills from step to step ----------
function initSteps(reduce) {
  const steps = document.querySelector('.steps');
  if (!steps) return;
  const items = [...steps.children];
  if (reduce) {
    steps.style.setProperty('--fill', 1);
    items.forEach((li) => li.classList.add('is-on'));
    return;
  }
  gsap.to(steps, {
    '--fill': 1,
    ease: 'none',
    scrollTrigger: {
      trigger: steps,
      start: 'top 75%',
      end: 'bottom 55%',
      scrub: 0.5,
      onUpdate: (self) => items.forEach((li, i) => li.classList.toggle('is-on', self.progress >= i / (items.length - 1) - 0.02)),
    },
  });
}

// ---------- FAQ: one answer open at a time, smooth height ----------
function initFaq(reduce) {
  const btns = [...document.querySelectorAll('.faq-item button')];
  const set = (btn, open) => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.setAttribute('aria-expanded', String(open));
    if (open) {
      panel.hidden = false;
      gsap.fromTo(panel, { height: 0 }, { height: 'auto', duration: reduce ? 0 : 0.35, ease: 'power2.out' });
    } else if (!panel.hidden) {
      gsap.to(panel, { height: 0, duration: reduce ? 0 : 0.3, ease: 'power2.in', onComplete: () => { panel.hidden = true; } });
    }
  };
  for (const b of btns) {
    b.addEventListener('click', () => {
      const open = b.getAttribute('aria-expanded') !== 'true';
      btns.forEach((o) => { if (o !== b) set(o, false); });
      set(b, open);
    });
  }
}

// ---------- contact form: validates, then opens the mail app ----------
function initForm() {
  const form = document.querySelector('.brief');
  if (!form) return;
  // form.name would be the form's own name attribute, so read controls through elements
  const f = form.elements;
  const checks = [
    [f.namedItem('name'), (v) => v.trim().length > 1],
    [f.namedItem('email'), (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())],
    [f.namedItem('message'), (v) => v.trim().length > 4],
  ];
  const validate = (input, ok) => {
    const good = ok(input.value);
    input.setAttribute('aria-invalid', String(!good));
    document.getElementById(input.getAttribute('aria-describedby')).hidden = good;
    return good;
  };
  for (const [input, ok] of checks) input.addEventListener('blur', () => { if (input.value) validate(input, ok); });
  const btn = form.querySelector('button[type="submit"]');
  const done = document.querySelector('.done');
  const err = form.querySelector('.send-err');
  const sent = form.querySelector('.sent');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const bad = checks.filter(([input, ok]) => !validate(input, ok));
    if (bad.length) { bad[0][0].focus(); return; }
    const type = f.namedItem('type').value;
    const name = f.namedItem('name').value.trim();
    const email = f.namedItem('email').value.trim();
    const message = f.namedItem('message').value.trim();
    const subject = `Proje: ${type}`;

    btn.disabled = true;
    btn.textContent = tt('Gönderiliyor…');
    err.hidden = true;
    try {
      // Web3Forms delivers the message to the inbox tied to this public access key
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: FORM_KEY,
          subject: `Portfolyo: ${subject}`,
          from_name: name,
          name,
          email,
          proje_turu: type,
          message,
          botcheck: f.namedItem('botcheck').checked,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || `HTTP ${res.status}`);
      form.hidden = true;
      done.hidden = false;
      gsap.from(done, { opacity: 0, y: 12, duration: 0.45, ease: 'power2.out' });
      done.querySelector('.done-again').focus({ preventScroll: true });
    } catch {
      // the service failed: offer Gmail and copying instead
      const body = `${message}\n\n${name}\n${email}`;
      sent.querySelector('.sent-gmail').href = `https://mail.google.com/mail/?view=cm&fs=1&to=${TO}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      sent.querySelector('.sent-copy').onclick = async () => {
        try { await navigator.clipboard.writeText(`${TO}\n${subject}\n\n${body}`); } catch {}
        showToast(tt('Mesaj kopyalandı'));
      };
      if (sent.hidden) {
        sent.hidden = false;
        gsap.from(sent, { height: 0, opacity: 0, duration: 0.4, ease: 'power2.out', clearProps: 'height' });
      }
    } finally {
      btn.disabled = false;
      btn.textContent = tt('Mesajı gönder');
    }
  });

  done.querySelector('.done-again').addEventListener('click', () => {
    form.reset();
    sent.hidden = true;
    done.hidden = true;
    form.hidden = false;
    f.namedItem('name').focus();
  });
}

// ---------- dock: links grow toward the pointer ----------
function initDock(reduce) {
  const dock = document.querySelector('.dock');
  if (!dock || reduce || !hover.matches) return;
  const links = [...dock.querySelectorAll('a')];
  dock.addEventListener('pointermove', (e) => {
    for (const a of links) {
      const r = a.getBoundingClientRect();
      const d = Math.abs(e.clientX - (r.left + r.width / 2));
      gsap.to(a, { scale: 1 + Math.max(0, 1 - d / 120) * 0.45, y: -Math.max(0, 1 - d / 120) * 8, duration: 0.25, overwrite: 'auto' });
    }
  });
  dock.addEventListener('pointerleave', () => gsap.to(links, { scale: 1, y: 0, duration: 0.35 }));
}

// ---------- footer: the name bounces in once ----------
function initFooter(reduce) {
  document.querySelector('.foot-top-btn')?.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
  const name = document.querySelector('.foot-name');
  if (!name) return;
  // scale the name so it spans the content width exactly, then it can be centred
  const text = name.querySelector('span');
  const fit = () => {
    const cs = getComputedStyle(name);
    const room = name.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const size = parseFloat(cs.fontSize);
    name.style.fontSize = `${size * (room / text.offsetWidth)}px`;
  };
  document.fonts.ready.then(fit);
  new ResizeObserver(fit).observe(name);
  if (reduce) return;
  // the name rises from the bottom edge with a little bounce and warms toward oak
  gsap.from(name, {
    yPercent: 70,
    duration: 1.3,
    ease: 'elastic.out(1, 0.5)',
    scrollTrigger: { trigger: name, start: 'top bottom', once: true },
  });
  gsap.to(name, {
    color: '#3A2F25',
    ease: 'none',
    scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: true },
  });
}
