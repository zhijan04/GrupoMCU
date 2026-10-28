// Armado del sitio: genera las páginas HTML, sitemap.xml y robots.txt.
// Uso:  node src/build.mjs
// Edita las plantillas en src/pages, los datos en src/data y la configuración en src/site.mjs.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE, NAV, PAGES, OBRAS_DESTACADAS, PROYECTOS_PORTADA } from "./site.mjs";

const SRC = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SRC, "..");
const read = (p) => readFileSync(join(SRC, p), "utf8");
const json = (p) => JSON.parse(read(p));

const catalogo = json("data/catalogo.json");
const obras = json("data/obras.json");
const municipios = json("data/municipios.json");
const ICONS = Object.fromEntries(
  [...read("partials/icons.svg").matchAll(/<symbol id="([^"]+)".*?<\/symbol>/gs)].map((m) => [m[1], m[0]])
);

const YEAR = new Date().getFullYear();
const TODAY = new Date().toISOString().slice(0, 10);

/* ---------- Utilidades ---------- */
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const icon = (id, cls = "icon") => `<svg class="${cls}" aria-hidden="true"><use href="#${id}"/></svg>`;
const waUrl = (msg = SITE.whatsapp.defaultMessage) =>
  `https://wa.me/${SITE.whatsapp.number}?text=${encodeURIComponent(msg)}`;
const absUrl = (file) => SITE.url + (file === "index.html" ? "" : file);
const telHref = (n) => `tel:+52${n.replace(/\s/g, "")}`;
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${SITE.address.lat}%2C${SITE.address.lng}`;
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const ext = 'target="_blank" rel="noopener"';

/* ---------- Encabezado y pie ---------- */
function navLinks(page, { footer = false } = {}) {
  const isHome = page.id === "index";
  return NAV.map((item) => {
    const href = isHome ? item.home : item.sub;
    let attrs = `href="${href}"`;
    if (!footer && isHome && item.home === "#inicio") attrs += ' aria-current="true"';
    if (!footer && item.page === page.id) attrs += ' aria-current="page"';
    return `        <li><a ${attrs}>${item.label}</a></li>`;
  }).join("\n");
}

function header(page) {
  return `<header class="site-header" id="top">
  <div class="container container--wide header__inner">
    <a class="brand" href="index.html">
      <img class="brand__logo" src="assets/img/marca/logo-mcu-negativo.webp" alt="Grupo MCU · Alumbrado Tecnológico, ir al inicio" width="476" height="200">
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
      <span class="burger" aria-hidden="true"><span></span><span></span><span></span></span>
      <span class="visually-hidden">Abrir menú</span>
    </button>
    <nav class="site-nav" id="site-nav" aria-label="Principal">
      <ul>
${navLinks(page)}
      </ul>
      <a class="btn btn--primary btn--sm" href="#contacto" data-wa="${esc(page.whatsapp)}">${icon("i-chat")} Cotiza por WhatsApp</a>
    </nav>
  </div>
</header>`;
}

function footer(page) {
  const { social, address: a } = SITE;
  const phones = SITE.phones
    .map(
      (pair) =>
        `        <li>${icon("i-phone", "icon icon--accent")}<span class="visually-hidden">Teléfonos: </span><span>${pair
          .map((n) => `<a href="${telHref(n)}">${n}</a>`)
          .join(" / ")}</span></li>`
    )
    .join("\n");
  const socialRow = (key, ic, label) =>
    `        <li>${icon(ic, "icon icon--accent")}<span class="visually-hidden">${label}: </span><a href="${social[key].url}" ${ext}>${social[key].label}</a></li>`;
  return `<footer class="site-footer" id="contacto" aria-labelledby="contacto-title">
  <div class="container footer__grid">
    <div class="footer__brand">
      <a class="brand brand--lg" href="index.html">
        <img class="brand__logo" src="assets/img/marca/logo-mcu-negativo.webp" alt="Grupo MCU · Alumbrado Tecnológico, volver al inicio" width="476" height="200" loading="lazy">
      </a>
      <p>Iluminación exterior LED para municipios, vialidades y espacios públicos.</p>
      <a class="btn btn--primary btn--sm" href="#contacto" data-wa="">${icon("i-chat")} Cotiza por WhatsApp</a>
    </div>
    <nav class="footer__col" aria-label="Enlaces del pie">
      <h2 class="footer__title">Enlaces</h2>
      <ul class="footer__links">
${navLinks(page, { footer: true })}
      </ul>
    </nav>
    <div class="footer__col">
      <h2 class="footer__title" id="contacto-title">Contacto</h2>
      <ul class="contact-list">
${phones}
        <li>${icon("i-chat", "icon icon--accent")}<span class="visually-hidden">WhatsApp: </span><a href="${waUrl()}" ${ext}>${SITE.whatsapp.display}</a></li>
        <li>${icon("i-mail", "icon icon--accent")}<a href="mailto:${SITE.email}">${SITE.email}</a></li>
${socialRow("instagram", "i-instagram", "Instagram")}
${socialRow("facebook", "i-facebook", "Facebook")}
${socialRow("tiktok", "i-tiktok", "TikTok")}
      </ul>
    </div>
    <div class="footer__col">
      <h2 class="footer__title">Ubicación</h2>
      <address class="footer__address">
        <p class="footer__city">${icon("i-pin", "icon icon--accent")} ${a.city}, ${a.region}, ${a.countryName}</p>
        <p>${a.street}, C.P. ${a.postalCode}</p>
      </address>
      <a class="map-slot" href="${esc(mapsUrl)}" ${ext} aria-label="Ver ubicación en Google Maps">
        <span class="map-slot__pin">${icon("i-pin")}</span>
        <span class="map-slot__label">Ver en Google Maps</span>
      </a>
    </div>
  </div>
  <div class="container footer__bottom">
    <p>© ${YEAR} Grupo MCU · Alumbrado Tecnológico</p>
  </div>
</footer>`;
}

function lightbox({ label, prev, next }) {
  return `<div class="zoom" id="zoom" role="dialog" aria-modal="true" aria-label="${label}" hidden>
  <button type="button" class="zoom__close" id="zoom-close">${icon("i-close")}<span>Cerrar</span></button>
  <button type="button" class="zoom__nav zoom__nav--prev" id="zoom-prev" aria-label="${prev}">${icon("i-chevron")}</button>
  <figure class="zoom__fig"><img id="zoom-img" alt=""><figcaption id="zoom-cap"></figcaption></figure>
  <button type="button" class="zoom__nav zoom__nav--next" id="zoom-next" aria-label="${next}">${icon("i-chevron")}</button>
</div>`;
}

/* ---------- Bloques generados desde datos ---------- */
function catalogItem(cat, it) {
  const orn = cat.source === "ornamentales";
  const pad = String(it.page).padStart(2, "0");
  const base = "assets/img/catalogo/";
  const image = base + (it.image || `pag-${pad}.webp`);
  const full = base + (it.zoomImage || (orn ? `orn/pag-${pad}.webp` : it.image || `pag-${pad}.webp`));
  const caption = it.caption || (orn ? `página ${it.page} de Luminarias ornamentales` : `página ${it.page} del catálogo 2026`);
  const alt = it.alt || (orn ? `Farol ${it.name}` : `Ficha de ${it.name} en el catálogo 2026`);
  const [w, h] = it.size || (orn ? [640, 640] : [1000, 1250]);
  const layout = it.layout || (orn ? "product" : "");
  const search = it.search || `${it.name} ${it.type}${orn ? " ornamental farol colonial" : ""}`.toLowerCase();
  const message = it.message || `Hola, quiero cotizar: ${it.name} (${orn ? "luminarias ornamentales" : "catálogo 2026"}).`;
  const specs = it.specs
    ? `\n          <dl class="cat-card__specs">${it.specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`
    : "";
  return `      <li class="cat-card${layout ? ` cat-card--${layout}` : ""}" data-name="${esc(search)}">
        <button type="button" class="cat-card__img" data-full="${full}" data-caption="${esc(`${it.name} · ${caption}`)}" data-alt="${esc(`Ficha de ${it.name} en el catálogo`)}" aria-label="Ver ficha completa de ${esc(it.name)}">
          <img src="${image}" alt="${esc(alt)}" width="${w}" height="${h}" loading="lazy">
          <span class="cat-card__zoom">${icon("i-zoom")}Ver ficha</span>
        </button>
        <div class="cat-card__body">
          <p class="cat-card__type">${esc(it.type)}</p>
          <h3 class="cat-card__name">${esc(it.name)}</h3>${specs}
          <a class="btn btn--primary btn--sm cat-card__cta" href="#contacto" data-wa="${esc(message)}">${icon("i-chat")}Cotizar</a>
        </div>
      </li>`;
}

function catalogSection(cat) {
  const cover = `assets/img/catalogo/${cat.cover}`;
  const coverSize = cat.cover.startsWith("orn/") ? 'width="1000" height="1318"' : 'width="1000" height="1250"';
  const pdf = cat.pdf
    ? `\n        <a class="btn btn--dark btn--sm cat-sec__pdf" href="${cat.pdf}" ${ext}>Descargar PDF ${icon("i-arrow")}</a>`
    : "";
  return `  <section class="cat-sec" id="${cat.id}" aria-labelledby="${cat.id}-t">
    <div class="container container--wide">
      <div class="cat-sec__head">
        <img class="cat-sec__cover" src="${cover}" alt="" ${coverSize} loading="lazy">
        <div>
          <p class="eyebrow eyebrow--dark">${plural(cat.items.length, "producto", "productos")}</p>
          <h2 class="section-title" id="${cat.id}-t">${cat.title}</h2>
          <p class="cat-sec__sub">${cat.subtitle}</p>
        </div>${pdf}
      </div>
      <ul class="cat-grid">
${cat.items.map((it) => catalogItem(cat, it)).join("\n")}
      </ul>
    </div>
  </section>`;
}

const TYPE_LABEL = {
  deportivas: "Unidades deportivas",
  plazas: "Plazas y andadores",
  colonias: "Colonias y fraccionamientos",
  vialidades: "Vialidades",
};
const obraAlt = (o) => `${o.name}, ${o.place}, con alumbrado LED de Grupo MCU`;

function obraCard(o) {
  const img = `assets/img/obras/${o.slug}`;
  return `        <li class="obra">
          <button type="button" class="obra__btn" data-full="${img}.webp" data-caption="${esc(`${o.name} · ${o.place}`)}" data-alt="${esc(obraAlt(o))}" aria-label="Ampliar foto: ${esc(o.name)}, ${esc(o.place)}">
            <img src="${img}-sm.webp" alt="${esc(obraAlt(o))}" width="${o.size[0]}" height="${o.size[1]}" loading="lazy">
          </button>
          <div class="obra__cap">
            <p class="obra__type">${TYPE_LABEL[o.type]}</p>
            <h3 class="obra__name">${esc(o.name)}</h3>
            <p class="obra__place">${icon("i-pin")}${esc(o.place)}</p>
          </div>
        </li>`;
}

function obraDestacada(slug) {
  const o = obras.find((x) => x.slug === slug);
  if (!o) throw new Error(`Obra destacada inexistente: ${slug}`);
  return `        <li><a class="nos-obra" href="proyectos.html">
          <img src="assets/img/obras/${o.slug}-sm.webp" alt="${esc(obraAlt(o))}" width="${o.size[0]}" height="${o.size[1]}" loading="lazy">
        </a></li>`;
}

function proyectosCarrusel() {
  // Desplazamiento continuo, como el de municipios: la tira se repite (oculta para lectores y teclado)
  // para que el movimiento no tenga cortes.
  const fotos = [
    ...PROYECTOS_PORTADA.fotos.map((f) => ({ full: f.img, thumb: f.img, size: f.size, alt: f.alt, caption: f.label, label: f.label })),
    ...obras
      .filter((o) => !PROYECTOS_PORTADA.omitir.includes(o.slug))
      .map((o) => {
        const img = `assets/img/obras/${o.slug}`;
        // Las fotos de obras ya traen el nombre y el lugar impresos, así que no llevan etiqueta.
        return { full: `${img}.webp`, thumb: `${img}-sm.webp`, size: o.size, alt: obraAlt(o), caption: `${o.name} · ${o.place}` };
      }),
  ];
  const item = ({ full, thumb, size, alt, caption, label }, copy) =>
    `<li class="projects__item"${copy ? ' aria-hidden="true"' : ""}><button type="button" class="projects__btn" data-full="${full}" data-caption="${esc(caption)}" data-alt="${esc(alt)}"${copy ? ' tabindex="-1"' : ` aria-label="Ampliar foto: ${esc(caption)}"`}><img src="${thumb}" alt="${copy ? "" : esc(alt)}" width="${size[0]}" height="${size[1]}" loading="lazy">${label ? `<span class="projects__label">${esc(label)}</span>` : ""}</button></li>`;
  return `      <ul class="projects__track">${fotos.map((f) => item(f, false)).join("")}${fotos.map((f) => item(f, true)).join("")}</ul>`;
}

function municipiosRail() {
  // Dos filas alternadas; cada fila se repite (oculta para lectores) para que el desplazamiento no tenga cortes.
  const rows = [municipios.filter((_, i) => i % 2 === 0), municipios.filter((_, i) => i % 2 === 1)];
  const item = (m, copy) =>
    `<li class="munis__item"${copy ? ' aria-hidden="true"' : ""}><img src="assets/img/municipios/${m.slug}.webp" alt="${copy ? "" : `Logo del municipio de ${esc(m.name)}`}" width="${m.size[0]}" height="${m.size[1]}" loading="lazy"></li>`;
  return rows
    .map(
      (row, r) => `      <div class="munis__row${r ? " munis__row--rev" : ""}">
        <ul class="munis__track">${row.map((m) => item(m, false)).join("")}${row.map((m) => item(m, true)).join("")}</ul>
      </div>`
    )
    .join("\n");
}

const BLOCKS = {
  "catalog.chips": () =>
    `<ul class="cat-nav__list">${catalogo.map((c) => `<li><a href="#${c.id}">${c.label}</a></li>`).join("")}</ul>`,
  "catalog.sections": () => catalogo.map(catalogSection).join("\n"),
  obras: () => obras.map(obraCard).join("\n"),
  "obras.destacadas": () => OBRAS_DESTACADAS.map(obraDestacada).join("\n"),
  municipios: municipiosRail,
  "proyectos.carrusel": proyectosCarrusel,
};

/* ---------- SEO ---------- */
function structuredData(page) {
  const a = SITE.address;
  const business = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": SITE.url + "#empresa",
    name: SITE.name,
    url: SITE.url,
    logo: SITE.url + "assets/img/marca/logo-mcu-original.png",
    image: SITE.url + SITE.shareImage,
    description: SITE.description,
    email: SITE.email,
    telephone: SITE.phones.flat().map((n) => "+52 " + n),
    address: {
      "@type": "PostalAddress",
      streetAddress: a.street,
      postalCode: a.postalCode,
      addressLocality: a.city,
      addressRegion: a.region,
      addressCountry: a.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: a.lat, longitude: a.lng },
    areaServed: { "@type": "Country", name: "México" },
    sameAs: Object.values(SITE.social).map((s) => s.url),
  };
  const data = [business];
  if (page.crumb) {
    data.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: SITE.url },
        { "@type": "ListItem", position: 2, name: page.crumb, item: absUrl(page.file) },
      ],
    });
  }
  return data.map((d) => `<script type="application/ld+json">${JSON.stringify(d)}</script>`).join("\n");
}

function head(page) {
  const url = absUrl(page.file);
  const img = SITE.url + SITE.shareImage;
  return `<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="${SITE.themeColor}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:locale" content="${SITE.locale}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="favicon.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="image" href="${page.hero}" fetchpriority="high">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;900&family=Montserrat:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="assets/css/styles.css">
<script src="assets/js/main.js" defer></script>
${structuredData(page)}
</head>`;
}

/* ---------- Ensamblado ---------- */
function whatsappLinks(html) {
  // <a ... href="#contacto" data-wa="mensaje"> → enlace directo a WhatsApp
  return html.replace(/<a ([^>]*?)href="#contacto"([^>]*?) data-wa="([^"]*)"/g, (_, before, after, msg) => {
    const text = msg.replace(/&quot;/g, '"').replace(/&amp;/g, "&");
    return `<a ${before}href="${waUrl(text || undefined)}"${after} ${ext}`;
  });
}

function sprite(html) {
  const used = [...new Set([...html.matchAll(/href="#(i-[a-z0-9-]+)"/g)].map((m) => m[1]))].sort();
  const missing = used.filter((id) => !ICONS[id]);
  if (missing.length) throw new Error(`Íconos inexistentes: ${missing.join(", ")}`);
  return `<svg xmlns="http://www.w3.org/2000/svg" class="sprite" aria-hidden="true" focusable="false"><defs>
${used.map((id) => ICONS[id]).join("\n")}
</defs></svg>`;
}

function render(page) {
  let main = read(`pages/${page.id}.html`).replace(/\{\{([\w.]+)\}\}/g, (_, key) => {
    if (!BLOCKS[key]) throw new Error(`Bloque desconocido {{${key}}} en ${page.id}`);
    return BLOCKS[key]();
  });
  let body = `<a class="skip-link" href="#contenido">Saltar al contenido</a>
${header(page)}
<main id="contenido">
${main.trimEnd()}
</main>
${footer(page)}${page.lightbox ? "\n" + lightbox(page.lightbox) : ""}`;
  body = whatsappLinks(body);
  if (/data-wa=/.test(body)) throw new Error(`Quedó un botón de WhatsApp sin convertir en ${page.id}`);
  return `<!doctype html>
<html lang="${SITE.lang}">
${head(page)}
<body${page.bodyClass ? ` class="${page.bodyClass}"` : ""}>
${sprite(body)}
${body}
</body>
</html>
`;
}

for (const page of PAGES) {
  writeFileSync(join(ROOT, page.file), render(page));
  console.log("✓", page.file);
}

writeFileSync(
  join(ROOT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map((p) => `  <url><loc>${absUrl(p.file)}</loc><lastmod>${TODAY}</lastmod></url>`).join("\n")}
</urlset>
`
);
writeFileSync(join(ROOT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}sitemap.xml\n`);
console.log("✓ sitemap.xml, robots.txt");
