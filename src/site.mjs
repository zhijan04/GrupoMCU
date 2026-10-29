// Datos generales del sitio. Todo lo que se repite en las páginas sale de aquí.

export const SITE = {
  // Dirección pública del sitio (con barra final). Cambiar cuando haya dominio propio.
  url: "https://zhijan04.github.io/GrupoMCU/",
  name: "Grupo MCU · Alumbrado Tecnológico",
  shortName: "Grupo MCU",
  locale: "es_MX",
  lang: "es-MX",
  themeColor: "#000000",
  shareImage: "assets/img/og/compartir.jpg",
  description:
    "Iluminación exterior LED para municipios, vialidades y espacios públicos. Luminarias viales, solares y de punta de poste con proyecto, instalación y mantenimiento.",

  whatsapp: {
    number: "523324062551",
    display: "+52 33 2406 2551",
    defaultMessage: "Hola, quiero cotizar un proyecto de iluminación LED.",
  },
  phones: [
    ["33 2406 2551", "33 2770 8170"],
    ["33 3330 5024", "33 1523 1799"],
  ],
  email: "cotizaciones@grupomcu.com",
  social: {
    facebook: { label: "Grupo MCU", url: "https://www.facebook.com/alteciluminacion" },
    instagram: { label: "grupomcu_", url: "https://www.instagram.com/grupomcu_/" },
    tiktok: { label: "grupo.mcu", url: "https://www.tiktok.com/@grupo.mcu" },
  },
  address: {
    street: "Bolivia 2797",
    postalCode: "44950",
    city: "Guadalajara",
    region: "Jalisco",
    country: "MX",
    countryName: "México",
    lat: 20.641118,
    lng: -103.376219,
  },
};

// Menú principal. `home` es el destino desde la página principal; `sub`, desde las demás.
// `page` marca qué página resalta el ítem.
export const NAV = [
  { label: "Inicio", home: "#inicio", sub: "index.html" },
  { label: "Nosotros", home: "#nosotros", sub: "nosotros.html", page: "nosotros" },
  { label: "Productos", home: "#productos", sub: "index.html#productos" },
  { label: "Green Cobra", home: "#green-cobra", sub: "index.html#green-cobra" },
  { label: "Proyectos", home: "#proyectos", sub: "proyectos.html", page: "proyectos" },
  { label: "Servicios", home: "servicios.html", sub: "servicios.html", page: "servicios" },
  { label: "Financiamiento", home: "financiamiento.html", sub: "financiamiento.html", page: "financiamiento" },
  { label: "Catálogo Digital", home: "catalogo.html", sub: "catalogo.html", page: "catalogo" },
  { label: "Contacto", home: "#contacto", sub: "#contacto" },
];

// Páginas del sitio. `hero` se precarga para que la portada aparezca antes.
export const PAGES = [
  {
    id: "index",
    file: "index.html",
    title: "Grupo MCU · Alumbrado Tecnológico | Alumbrado público LED en México",
    description: SITE.description,
    hero: "assets/img/ambiente/hero.webp",
    whatsapp: "Hola, quiero cotizar un proyecto de iluminación LED.",
    lightbox: { label: "Foto del proyecto", prev: "Foto anterior", next: "Foto siguiente" },
  },
  {
    id: "catalogo",
    file: "catalogo.html",
    title: "Catálogo 2026 · Grupo MCU",
    description:
      "Catálogo 2026 de Grupo MCU: luminarias LED viales, solares, punta de poste, ornamentales, reflectores, campanas, interiores, postes, brazos y anclas.",
    hero: "assets/img/ambiente/catalogo-hero.webp",
    bodyClass: "page-sub page-catalogo",
    whatsapp: "Hola, quiero cotizar productos del catálogo 2026.",
    lightbox: { label: "Ficha del catálogo", prev: "Página anterior", next: "Página siguiente" },
    crumb: "Catálogo digital",
  },
  {
    id: "proyectos",
    file: "proyectos.html",
    title: "Proyectos · Grupo MCU",
    description:
      "Obras de alumbrado LED de Grupo MCU en unidades deportivas, plazas, andadores, colonias y vialidades de México.",
    hero: "assets/img/ambiente/proyectos-hero.webp",
    bodyClass: "page-sub page-proyectos",
    whatsapp: "Hola, quiero cotizar un proyecto de iluminación LED.",
    lightbox: { label: "Foto de la obra", prev: "Foto anterior", next: "Foto siguiente" },
    crumb: "Proyectos",
  },
  {
    id: "nosotros",
    file: "nosotros.html",
    title: "Nosotros · Grupo MCU",
    description:
      "Grupo MCU · Alumbrado Tecnológico: más de 20 años en soluciones de iluminación LED para el sector público y privado. Misión, visión, certificaciones y partner Leotek.",
    hero: "assets/img/ambiente/nosotros-hero.webp",
    bodyClass: "page-sub page-nosotros",
    whatsapp: "Hola, quiero cotizar un proyecto de iluminación LED.",
    crumb: "Nosotros",
    video: {
      name: "Grupo MCU · Alumbrado Tecnológico: espacios seguros para toda la comunidad",
      description: "Cómo Grupo MCU acompaña a los municipios con planeación, asesoría y equipos de iluminación LED para vialidades, unidades deportivas y canchas.",
      file: "assets/video/grupo-mcu.mp4",
      poster: "assets/video/grupo-mcu-poster.webp",
      duration: "PT1M2S",
      uploadDate: "2026-10-29",
    },
  },
  {
    id: "servicios",
    file: "servicios.html",
    title: "Servicios · Grupo MCU",
    description:
      "Servicios de Grupo MCU: venta de luminarias y material eléctrico, proyectos eléctricos y lumínicos, renta de grúas y canastillas, mantenimiento e instalación.",
    hero: "assets/img/ambiente/servicios-hero.webp",
    bodyClass: "page-sub page-srv",
    whatsapp: "Hola, quiero cotizar un servicio de Grupo MCU.",
    crumb: "Servicios",
  },
  {
    id: "financiamiento",
    file: "financiamiento.html",
    title: "Financiamiento para municipios · Grupo MCU",
    description:
      "Financiamiento para municipios: sustitución de luminarias antiguas por LED de alto rendimiento, con suministro, retiro, instalación, georreferenciación y asesoría técnica.",
    hero: "assets/img/ambiente/financiamiento-hero.webp",
    bodyClass: "page-sub page-fin",
    whatsapp: "Hola, quiero información sobre el financiamiento de alumbrado público para mi municipio.",
    crumb: "Financiamiento",
  },
];

// Obras que se muestran en la página Nosotros.
export const OBRAS_DESTACADAS = [
  "unidad-deportiva-diaz-ordaz-arandas-jalisco-mx1",
  "andador-torres-bodet-tlaquepaque-jalisco",
  "kiosco-zacoalco-de-torres-jalisco-mx",
  "unidad-deportiva-solidaridad-jesus-maria-jalisco-mx",
];

// Carrusel de proyectos de la página principal: estas fotos van primero y después
// todas las obras de src/data/obras.json, salvo las que repiten una de estas fotos.
export const PROYECTOS_PORTADA = {
  fotos: [
    { img: "assets/img/proyectos/plaza-kiosko.webp", size: [900, 675], label: "Plaza pública", alt: "Kiosko y plaza principal iluminados de noche" },
    { img: "assets/img/proyectos/espacio-publico.webp", size: [900, 675], label: "Espacio público", alt: "Andador peatonal con luminarias LED entre áreas verdes" },
    { img: "assets/img/proyectos/campo-deportivo.webp", size: [900, 675], label: "Instalación deportiva", alt: "Campo de béisbol con iluminación LED nocturna" },
    { img: "assets/img/proyectos/centro-historico.webp", size: [900, 675], label: "Centro histórico", alt: "Fachada de templo iluminada en el centro histórico" },
  ],
  omitir: ["unidad-deportiva-diaz-ordaz-arandas-jalisco-mx1", "kiosco-zacoalco-de-torres-jalisco-mx"],
};
