import { getLang, tt, locale } from './i18n.js';
import { CASES_EN } from './en.js';
import { C } from './brand.js';

// case studies shown in "Örnek işler"; every figure comes from the project's README, the CV or confirmed notes
const GH = 'https://github.com/NejatSENER';

// backend and systems cases, the same for every mode; websites live in their own section
export const BACKEND = ['flash', 'translate', 'enocta', 'bus', 'documind', 'leads'];

export const CASES = {
  flash: {
    // business-language version shown in freelance mode
    biz: { lead: 'Kampanya anında binlerce eşzamanlı alışverişi aksatmadan, stok hatası olmadan karşılayan sistem.', facts: [['0 hata', 'stokta olmayan ürün asla satılmaz'], ['20.000', 'aynı anda alışveriş yapan kişiyle test edildi'], ['~8 kat', 'en yavaş yönteme göre daha hızlı']] },
    tag: 'Backend · Yük testi',
    title: 'Flash Sale API',
    lead: '1.000 ürün, aynı saniyede 20.000 alıcı. Tam 1.000 kişi almalı, bir tane fazlası değil.',
    facts: [
      ['5.783 istek/sn', 'Redis kapısıyla en hızlı strateji'],
      ['19.000', 'saf yöntemin fazla sattığı ürün'],
      ['14 test', 'Testcontainers ile gerçek PostgreSQL ve Redis'],
    ],
    stack: ['.NET 10', 'PostgreSQL', 'Redis (Lua)', 'EF Core', 'k6', 'xUnit'],
    visual: 'chart',
    story: [
      ['Sorun', 'Bir flash sale\'de 1.000 ürün var ve 20.000 kişi aynı anda "satın al"a basıyor. Fazla satış olmamalı, ödenmeyen rezervasyonlar stoğa dönmeli, ödeme sağlayıcının iki kez ya da geç gelen bildirimleri güvenle işlenmeli.'],
      ['Yaklaşım', 'Stoğu düşürmenin dört yolunu yazıp aynı testlerden geçirdim: oku-yaz, tek SQL UPDATE, iyimser kilit (xmin) ile yeniden deneme ve Redis Lua kapısı + atomik SQL. Ödenmeyen rezervasyonlar 5 saniyede bir süresi dolunca stoğa döner. Ödeme bildirimleri HMAC ile doğrulanır ve olay kimliğiyle tek kez işlenir.'],
      ['Sonuç', 'k6 ile 300 sanal kullanıcı, 20.000 alıcı. Oku-yaz yöntemi 19.000 fazla satış yaptı. Redis kapısı saniyede 5.783 istekle en hızlısı oldu (p95 156 ms): 19.000 "tükendi" cevabını bellekten verdi, veritabanı sadece alabilecek 1.000 isteği gördü. İyimser kilit hiç fazla satmadı ama stok varken 2.340 kişiyi geri çevirdi.'],
    ],
    note: 'Ölçümler tek makinede, karşılaştırma amaçlı.',
    links: [['GitHub\'da incele', `${GH}/flash-sale-api`]],
  },
  translate: {
    // business-language version shown in freelance mode
    biz: { lead: 'Yüklenen belgeleri otomatik çeviren, iş bitince e-postayla haber veren ve hiçbir işi kaybetmeyen platform.', facts: [['Otomatik', 'yükle, çevrilsin, e-posta gelsin'], ['0 kayıp', 'hiçbir iş yolda kaybolmaz'], ['Tek komut', 'tüm sistem tek komutla kurulur']] },
    tag: 'Dağıtık sistem · Kurumsal deneyimden açık kaynağa',
    title: 'TranslateFlow',
    lead: 'Zorlu Holding\'de üzerinde çalıştığım belge çeviri platformunun problemini açık kaynak olarak sıfırdan yeniden çözdüm.',
    facts: [
      ['3 servis', 'Api, Worker, Notifier, ayrı ayrı deploy edilir'],
      ['Outbox', 'iş ve mesaj tek transaction\'da'],
      ['16 test', 'tek komutla tüm sistem ayağa kalkar'],
    ],
    stack: ['.NET 10', 'RabbitMQ', 'PostgreSQL', 'EF Core', 'Docker Compose'],
    visual: 'translate',
    story: [
      ['Kurumsal sürümdeki katkım', 'Zorlu Holding\'deki şirket içi belge çeviri platformunda, yüklenen dokümanları çeviri için düz metne dönüştüren metin çıkarma servisini yazdım. Dil çiftine göre 3 çeviri modeli arasında yönlendirme, kullanıcı bazlı token maliyeti ve tamamlanan işleri Kafka üzerinden ayrı deploy edilen bildirim servisine ileten outbox akışı üzerinde çalıştım.'],
      ['Sorun', 'Kullanıcı bir dosya yüklüyor, çeviri uzun sürüyor. İş, veritabanına yazılıp kuyruğa gönderilirken arada kaybolmamalı ya da iki kez işlenmemeli. Bittiğinde kullanıcıya e-posta gitmeli.'],
      ['Açık kaynak sürüm', 'Şirket koduna dokunmadan aynı problemi sıfırdan yazdım. API işi ve bir outbox satırını tek transaction\'da yazar, relay bunu RabbitMQ\'ya publisher confirm ile yayınlar. Worker metni çıkarır (txt, docx, pdf), token boyutunda parçalara böler, dil çiftine göre modeli seçip çevirir, token ve maliyeti hesaplar. Notifier e-postayı ayrı bir servis olarak gönderir. İki kez başarısız olan mesaj dead-letter kuyruğuna düşer.'],
      ['Sonuç', 'Tek `docker compose up --build` ile API, worker, notifier, arayüz ve e-posta kutusu birlikte açılır. 16 test, CI yeşil.'],
    ],
    image: ['/v2/work/translateflow_ui.webp', 'TranslateFlow arayüzü: yüklenen işlerin durumu ve çeviri sonucu', 1100, 980],
    links: [['GitHub\'da incele', `${GH}/translate-flow`]],
  },
  enocta: {
    // business-language version shown in freelance mode
    biz: { lead: 'Manuel veri girişini %100 ortadan kaldıran sistem: veriler her sabah kendiliğinden aktarılır.', facts: [['25.000+', 'kullanıcının verisi otomatik taşınıyor'], ['1 milyon+', 'kayıt elle girilmeden aktarılıyor'], ['%100', 'otomatik, elle adım kalmadı']] },
    tag: 'Kurumsal entegrasyon · Zorlu Holding',
    title: 'Enocta LMS Entegrasyonu',
    lead: 'Elle yürüyen veri aktarımını her sabah kendiliğinden çalışan bir servise çevirdim.',
    facts: [
      ['25.000+', 'kullanıcı'],
      ['1 milyon+', 'büyüyen kayıt'],
      ['%100', 'otomatik, elle adım kalmadı'],
    ],
    stack: ['.NET', 'PostgreSQL', 'Windows Task Scheduler', 'ELK'],
    visual: 'enocta',
    story: [
      ['Sorun', 'Vestel Akademi\'nin eğitim ve kullanıcı verileri Enocta LMS\'ten elle aktarılıyordu.'],
      ['Yaklaşım', 'Entegrasyonu tek başıma tasarlayıp geliştirdim. Servis her sabah Enocta API\'sinden son iki haftada güncellenen kayıtları bir staging alanına çeker, ardından Vestel Akademi veritabanına yazar. Ayrı deploy edilir, Windows Task Scheduler ile çalışır, logları ELK\'ye gider.'],
      ['Sonuç', 'Manuel süreç tamamen otomatik hale geldi. 25 binden fazla kullanıcı ve 1 milyonu aşan, büyümeye devam eden kayıt.'],
    ],
    note: 'Kurum içi proje: kod ve ekran görüntüsü paylaşılamıyor.',
    links: [],
  },
  bus: {
    // business-language version shown in freelance mode
    biz: { lead: 'Aynı koltuğu asla iki kişiye satmayan, buluta güvenli ve otomatik kurulan bilet sistemi.', facts: [['0 çifte satış', 'her koltuk tek kişiye'], ['Otomatik', 'her güncelleme test edilip yayına alınır'], ['Güvenli', 'sistemde tek bir şifre bile tutulmaz']] },
    tag: 'Azure · Altyapı kod olarak · CI/CD',
    title: 'Otobüs Bileti API',
    lead: 'Aynı koltuk asla iki kez satılmaz. Uygulama Azure\'a tek dağıtımla ve hiç şifre tutmadan kurulur.',
    facts: [
      ['0 şifre', 'kodda, ayarlarda ve GitHub\'da'],
      ['1 × 201', 'aynı koltuğa 10 eşzamanlı istekten sadece biri satılır'],
      ['10 test', 'gerçek HTTP hattı üzerinden uçtan uca'],
    ],
    stack: ['ASP.NET Core 10', 'Azure SQL', 'Bicep', 'Managed Identity', 'Key Vault', 'GitHub Actions', 'App Insights'],
    visual: 'bus',
    story: [
      ['Sorun', 'Bir otobüs bileti servisinde iki kişi aynı anda aynı koltuğu almaya çalıştığında koltuk yine de bir kez satılmalı. Uygulama bulutta çalışırken hiçbir şifre kodda, ayarlarda ya da CI\'da durmamalı.'],
      ['Yaklaşım', 'Çift satışı uygulama kodu değil, veritabanı engelliyor: iptal edilmemiş biletler için (sefer, koltuk) üzerinde filtreli benzersiz indeks. İkinci kayıt hata verir, API 409 döner, iptal edilen koltuk yeniden satılabilir. Tüm Azure kaynakları tek bir Bicep dağıtımıyla kurulur. Uygulama SQL ve Key Vault\'a Managed Identity ile bağlanır, GitHub Actions Azure\'a OIDC ile şifresiz girer. Bileti görmek ya da iptal etmek için PNR ile birlikte e-posta da gerekir, böylece başkasının bileti tahminle açılamaz.'],
      ['Sonuç', 'Eşzamanlılık testinde aynı koltuğa gelen 10 istekten 1\'i 201, 9\'u 409 döndü. Her push; derleme, test, onay kapısı, dağıtım ve sağlık kontrolünden geçiyor.'],
    ],
    note: 'Canlı demo şu an kapalı: Azure kaynakları maliyet için duraklatıldı.',
    links: [['GitHub\'da incele', `${GH}/bus-ticket-api`]],
  },
  leads: {
    // business-language version shown in freelance mode
    biz: { lead: 'Potansiyel müşterilerini otomatik bulan ve analiz eden satış asistanı.', facts: [['Otomatik', 'işletmeleri bulur ve inceler'], ['1–10', 'her adaya öncelik puanı'], ['Tablo', 'sonuçlar hazır bir Google Sheets tablosunda']] },
    tag: 'Otomasyon · Yapay zeka',
    title: 'Lead puanlama ajanı',
    lead: 'İşletmeleri bulur, web sitelerini inceler ve hizmet potansiyeline göre puanlayıp tabloya yazar.',
    facts: [
      ['4 aşama', 'bul, incele, puanla, raporla'],
      ['1–10', 'her işletme için öncelik puanı'],
      ['Sheets', 'niş başına ayrı sekme ve özet sekmesi'],
    ],
    stack: ['Python', 'Google Places API', `${C} API`, 'LangChain', 'Paperclip', 'Google Sheets'],
    visual: 'leads',
    story: [
      ['Sorun', 'Bir ajans için potansiyel müşteri bulmak saatler süren elle araştırma demek: işletmeyi bulmak, sitesine bakmak, ne kadar ihtiyacı olduğunu tahmin etmek.'],
      ['Yaklaşım', 'Çok adımlı bir ajan hattı tasarladım. Google Places API\'den şehir ve sektöre göre işletmeleri çeker, web sitelerini analiz eder, bir LLM ile hizmet potansiyeline göre puanlar ve sonuçları yapılandırılmış biçimde Google Sheets\'e yazar. Her niş ayrı sekmeye, özet istatistikler formüllerle ayrı bir sekmeye gider.'],
    ],
    note: 'Gerçek işletme verisi içerdiği için kod paylaşılmıyor.',
    links: [],
  },
  documind: {
    // business-language version shown in freelance mode
    biz: { lead: 'Belgelerine soru sorup kaynağıyla cevap alabileceğin, verini dışarı çıkarmayan asistan.', facts: [['11/12', 'soruda doğru ve kaynaklı cevap'], ['Yerel', 'belgeler şirket dışına çıkmaz'], ['Kaynaklı', 'her cevap hangi belgeden geldiğini gösterir']] },
    tag: 'Yapay zeka · RAG',
    title: 'DocuMind',
    lead: 'Belgelere soru sor, kaynağını gösteren cevap al. Ücretli API yok, modeller yerelde.',
    facts: [
      ['11/12', 'hibrit aramayla doğru cevap'],
      ['9/12', 'sadece vektör aramayla'],
      ['17 test', 'CI ve SonarCloud'],
    ],
    stack: ['.NET 10', 'Ollama', 'pgvector', 'RabbitMQ', 'Redis', 'React'],
    visual: 'rag',
    story: [
      ['Sorun', 'Belgelere doğal dilde soru sorup kaynak gösteren cevap almak, bunu ücretli bir API olmadan yerel modellerle yapmak.'],
      ['Yaklaşım', '.NET 10 API ve Worker, Ollama (qwen2.5:7b, nomic-embed-text) ve pgvector. Belgeler RabbitMQ üzerinden parçalanıp gömülür. Aramada vektör ve anahtar kelime sonuçları RRF ile birleştirilir. Cevap, kaynak etiketleriyle (K1, K2) SSE üzerinden akar. Benzer sorular Redis\'teki anlamsal önbellekten döner.'],
      ['Sonuç', '12 soruluk değerlendirme setinde sadece vektör arama 9/12, hibrit arama 11/12 doğru cevap verdi. LLM ile yeniden sıralama 10/12\'de kaldı, bu yüzden kapalı.'],
    ],
    links: [['GitHub\'da incele', `${GH}/documind`]],
  },
};

// a case in the current language: English text over the Turkish entry's stack, visual and links
export function caseFor(id) {
  const base = CASES[id];
  const en = getLang() === 'en' && CASES_EN[id];
  if (!en) return base;
  const image = base.image && [base.image[0], en.imageAlt || base.image[1], base.image[2], base.image[3]];
  return { ...base, ...en, image };
}

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const code = (s) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>');

// ---------- visuals ----------
const FLASH = [
  { name: 'Oku-yaz', rps: 742, p95: 673, bad: '19.000 fazla satış' },
  { name: 'Atomik SQL', rps: 4369, p95: 279 },
  { name: 'İyimser kilit', rps: 2132, p95: 736, warn: '2.340 kişi geri çevrildi' },
  { name: 'Redis kapısı', rps: 5783, p95: 156, best: true },
];

function chart() {
  const max = 6000;
  const rows = FLASH.map((r) => `
    <div class="bar-row${r.best ? ' is-best' : ''}${r.bad ? ' is-bad' : ''}">
      <span class="bar-name">${tt(r.name)}</span>
      <span class="bar-track"><span class="bar-fill" style="--w:${(r.rps / max) * 100}%"></span></span>
      <span class="bar-val"><b data-to="${r.rps}">${r.rps.toLocaleString(locale())}</b> ${tt('istek/sn')} · p95 ${r.p95} ms</span>
      ${r.bad ? `<span class="bar-note bad">${tt(r.bad)}</span>` : ''}${r.warn ? `<span class="bar-note">${tt(r.warn)}</span>` : ''}
    </div>`).join('');
  return `<figure class="viz viz-chart" aria-label="${tt('Dört stok stratejisinin k6 yük testi sonuçları')}">
    <figcaption class="viz-head"><span>${tt('k6 · 20.000 alıcı · 1.000 ürün')}</span></figcaption>
    ${rows}
  </figure>`;
}

// node: [x, y, w, label, sub]; edge: [from, to, dashed]
function flow(nodes, edges, label, h = 340) {
  const H = 46;
  label = tt(label);
  const c = (n) => ({ x: n[0] + n[2] / 2, y: n[1] + H / 2 });
  const port = (a, b) => {
    const ca = c(a);
    const cb = c(b);
    const dx = cb.x - ca.x;
    const dy = cb.y - ca.y;
    if (Math.abs(dx) > Math.abs(dy)) return [{ x: dx > 0 ? a[0] + a[2] : a[0], y: ca.y }, { x: dx > 0 ? b[0] : b[0] + b[2], y: cb.y }];
    return [{ x: ca.x, y: dy > 0 ? a[1] + H : a[1] }, { x: cb.x, y: dy > 0 ? b[1] : b[1] + H }];
  };
  const paths = edges.map(([f, t, dashed], i) => {
    const [p, q] = port(nodes[f], nodes[t]);
    const mx = (p.x + q.x) / 2;
    const my = (p.y + q.y) / 2;
    const horiz = Math.abs(q.x - p.x) > Math.abs(q.y - p.y);
    const d = horiz
      ? `M${p.x},${p.y} C${mx},${p.y} ${mx},${q.y} ${q.x},${q.y}`
      : `M${p.x},${p.y} C${p.x},${my} ${q.x},${my} ${q.x},${q.y}`;
    return `<path class="edge${dashed ? ' dashed' : ''}" d="${d}"/>${dashed ? '' : `<path class="beam" d="${d}" pathLength="100" style="--d:${i * 0.45}s"/>`}`;
  }).join('');
  const boxes = nodes.map((n) => `
    <g class="node${n[5] ? ` ${n[5]}` : ''}"><rect x="${n[0]}" y="${n[1]}" width="${n[2]}" height="${H}" rx="12"/>
    <text x="${n[0] + n[2] / 2}" y="${n[1] + (n[4] ? 20 : 28)}">${tt(n[3])}</text>
    ${n[4] ? `<text class="sub" x="${n[0] + n[2] / 2}" y="${n[1] + 35}">${tt(n[4])}</text>` : ''}</g>`).join('');
  return `<figure class="viz viz-flow" aria-label="${label}"><svg viewBox="0 0 600 ${h}" role="img"><title>${label}</title>${paths}${boxes}</svg></figure>`;
}

const dots = (n) => Array.from({ length: 12 }, (_, i) => `<i${i < n ? ' class="hit"' : ''} style="--k:${i}"></i>`).join('');

const VISUALS = {
  chart,
  translate: () => flow(
    [[20, 147, 104, 'Api', 'yükleme'], [168, 40, 132, 'PostgreSQL', 'iş + outbox'], [340, 147, 120, 'RabbitMQ', 'exchange'],
      [486, 60, 100, 'Worker', 'çevir · say'], [486, 234, 100, 'Notifier', 'e-posta'], [340, 270, 120, 'Dead-letter', '2 hatadan sonra', 'muted']],
    [[0, 1], [1, 2], [2, 3], [2, 4], [2, 5, true]],
    'TranslateFlow mimarisi: Api, PostgreSQL outbox, RabbitMQ, Worker ve Notifier',
  ),
  enocta: () => flow(
    [[20, 147, 130, 'Enocta API', 'LMS'], [235, 147, 130, 'Staging', 'PostgreSQL'], [450, 147, 130, 'Vestel', 'veritabanı'],
      [235, 40, 130, 'Her sabah', '', 'muted'], [235, 254, 130, 'ELK', 'loglar', 'muted']],
    [[0, 1], [1, 2], [3, 1, true], [1, 4, true]],
    'Enocta entegrasyonu: Enocta API, staging, Vestel veritabanı',
  ),
  bus: () => flow(
    [[20, 40, 140, 'GitHub Actions', 'test · onay · dağıt'], [230, 147, 140, 'App Service'], [450, 60, 130, 'Azure SQL'],
      [450, 234, 130, 'Key Vault', 'Managed Identity'], [230, 270, 140, 'App Insights', 'izleme · alarm', 'muted'], [20, 254, 140, 'Bicep', '', 'muted']],
    [[0, 1], [1, 2], [1, 3], [1, 4, true], [5, 1, true]],
    'Otobüs Bileti API altyapısı: GitHub Actions, App Service, Azure SQL, Key Vault ve App Insights',
  ),
  leads: () => flow(
    [[20, 60, 120, 'Google Places', 'şehir · sektör'], [175, 60, 120, 'İşletme analizi', 'web · sosyal'], [330, 60, 120, 'LLM puanlama', 'öncelik 1–10'],
      [470, 60, 116, 'Google Sheets']],
    [[0, 1], [1, 2], [2, 3]],
    'Lead puanlama ajanı: Google Places, işletme analizi, LLM ile puanlama, Google Sheets',
    166,
  ),
  rag: () => `<div class="viz-rag">${flow(
    [[20, 40, 110, 'Soru'], [170, 40, 150, 'Hibrit arama', 'vektör + kelime · RRF'], [360, 40, 110, 'qwen2.5:7b', 'Ollama'],
      [500, 40, 84, 'Cevap', 'K1, K2'], [170, 150, 150, 'pgvector', 'HNSW', 'muted']],
    [[0, 1], [1, 2], [2, 3], [4, 1, true]],
    'DocuMind: soru, hibrit arama, yerel model, kaynaklı cevap',
    214,
  )}
    <div class="eval" aria-label="${tt('12 soruluk değerlendirme')}">
      <div class="eval-row"><span>${tt('Vektör')}</span><span class="eval-dots">${dots(9)}</span><b>9/12</b></div>
      <div class="eval-row is-best"><span>${tt('Hibrit')}</span><span class="eval-dots">${dots(11)}</span><b>11/12</b></div>
    </div></div>`,
};

export const visualFor = (c) => VISUALS[c.visual](c);

// ---------- markup ----------
export function cardHTML(id, i, mode) {
  const base = caseFor(id);
  const c = mode === 'client' && base.biz ? { ...base, ...base.biz } : base;
  const facts = c.facts.map(([a, b]) => `<li><b>${a}</b><span>${b}</span></li>`).join('');
  return `<article class="case" data-case="${id}" style="--i:${i}">
    <div class="case-text">
      <p class="case-tag">${c.tag}</p>
      <h3>${c.title}</h3>
      <p class="case-lead">${c.lead}</p>
      <ul class="case-facts">${facts}</ul>
      <button class="btn btn-light case-open" type="button" aria-haspopup="dialog">${tt('Vakayı oku')} <span aria-hidden="true">→</span></button>
    </div>
    <div class="case-visual">${visualFor(c)}</div>
    <span class="case-shade" aria-hidden="true"></span>
  </article>`;
}

export function drawerHTML(c) {
  const story = c.story.map(([h, p]) => `<section><h4>${tt(h)}</h4><p>${code(p)}</p></section>`).join('');
  const img = c.image ? `<img class="drawer-img" src="${c.image[0]}" alt="${c.image[1]}" width="${c.image[2]}" height="${c.image[3]}">` : '';
  const links = c.links.map(([t, h]) => `<a class="btn btn-primary" href="${h}" target="_blank" rel="noopener">${tt(t)} <span aria-hidden="true">↗</span></a>`).join('');
  return `<p class="case-tag">${c.tag}</p>
    <h3 id="drawer-title">${c.title}</h3>
    <p class="drawer-lead">${c.lead}</p>
    <div class="drawer-visual">${visualFor(c)}</div>
    ${story}
    ${img}
    ${c.note ? `<p class="drawer-note">${c.note}</p>` : ''}
    <section><h4>${tt('Teknolojiler')}</h4><ul class="chips">${c.stack.map((s) => `<li>${s}</li>`).join('')}</ul></section>
    ${links ? `<div class="drawer-links">${links}</div>` : ''}`;
}
