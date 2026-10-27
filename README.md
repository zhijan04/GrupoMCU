# Grupo MCU · Alumbrado Tecnológico — sitio web

Sitio estático (HTML + CSS + JS, sin dependencias ni build). Se sube tal cual a cualquier hosting.

## Estructura
- `index.html` — página completa (encabezado, hero, productos, Green Cobra, servicios, nosotros, proyectos, beneficios, pie)
- `assets/css/styles.css` — estilos y tokens de marca (colores, tipografías, espaciado)
- `assets/js/config.js` — **datos editables**: WhatsApp, teléfono, correo, redes, dirección, mapa
- `assets/js/main.js` — menú móvil, enlaces de WhatsApp, sección activa, galería Green Cobra
- `assets/img/productos/` — luminarias optimizadas en WebP (de 13 MB a ~380 KB)
- `assets/fonts/` — lugar para los archivos de Radnika Next
- `assets/img/ambiente/` — lugar para las fotos de proyectos y del hero

## Pendientes
1. Completar `assets/js/config.js`: número de WhatsApp, enlace de Facebook, dirección y mapa. Teléfonos, correo, Instagram y TikTok están en el pie de `index.html`.
2. Agregar los archivos de Radnika Next en `assets/fonts/`.
3. (Listo) Fotos, contacto, WhatsApp, Facebook y ubicación cargados.
4. Logo oficial en SVG (ver comentario en el encabezado de `index.html`).
5. (Listo) WhatsApp y Facebook configurados.
6. Fichas técnicas de Afrodita (potencia) y confirmar la ciudad del pie.

## Catálogo
- `catalogo.html` — sub-página con las 49 fichas del catálogo 2026 por categoría, buscador y vista ampliada.
- `assets/img/catalogo/pag-01..58.webp` — páginas del PDF como imágenes.
- `assets/catalogo/catalogo-2026-grupo-mcu.pdf` — PDF completo (botón "Descargar PDF").
- Los datos de cada ficha están en `catalogo.html`; si cambia el catálogo, editá ahí los textos y reemplazá la imagen de la página.

## Proyectos
- `proyectos.html` — galería de 22 obras con filtros por tipo y foto ampliada ("Ver más proyectos" lleva aquí).
- `assets/img/obras/` — fotos de obras (versión grande y `-sm` para la galería).
- Para sumar una obra: copiá un bloque `<li class="obra">` en `proyectos.html` y agregá sus dos imágenes.

## Nosotros
- `nosotros.html` — página "Conoce más sobre nosotros": cifras, cómo trabajamos, respaldo, líneas de producto, obras y ubicación.

## Financiamiento
- `financiamiento.html` — página general (sin cifras ni condiciones). Hay un comentario donde agregar la sección "Opciones de financiamiento" cuando el cliente confirme esquemas, plazos o requisitos.
- Sección "Luminarias ornamentales" en `catalogo.html` (28 faroles). Imágenes en `assets/img/catalogo/orn/`, PDF en `assets/catalogo/luminarias-ornamentales-grupo-mcu.pdf`.

## Servicios
- `servicios.html` — página de servicios (Iluminación, Proyectos, Renta, Servicios). El ítem "Servicios" del menú lleva aquí en todas las páginas.

## Municipios
- Carrusel "Municipios con los que hemos trabajado" en `index.html` (debajo de Beneficios). Logos en `assets/img/municipios/`. Para sumar uno: agregá la imagen y un `<li class="munis__item">` en la fila (y su copia con `aria-hidden="true"` para que el loop sea continuo).
