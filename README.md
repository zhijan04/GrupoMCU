# Grupo MCU · Alumbrado Tecnológico — sitio web

Sitio estático (HTML + CSS + JavaScript, sin dependencias). Las páginas se generan con un script de Node
a partir de plantillas y archivos de datos, así el encabezado, el pie, los iconos y los listados se escriben una sola vez.
El resultado son archivos HTML completos, listos para subir a cualquier hosting (GitHub Pages incluido) y fáciles de indexar por Google.

## Cómo editar

1. Cambiá lo que necesites dentro de `src/` (textos, datos o plantillas).
2. Generá las páginas:

   ```bash
   node src/build.mjs
   ```

3. Subí la carpeta completa. No hace falta instalar nada: solo Node 18 o superior.

> Los `.html` de la raíz se generan solos. Si se editan a mano, el próximo build los reemplaza.

## Estructura

```
src/
  site.mjs            Datos generales: dirección del sitio, WhatsApp, teléfonos, correo, redes, dirección,
                      menú y títulos/descripciones de cada página (SEO)
  build.mjs           Genera las páginas, sitemap.xml y robots.txt
  data/
    catalogo.json     Categorías y fichas del catálogo digital
    obras.json        Obras de la página Proyectos
    municipios.json   Logos del carrusel de municipios
  pages/*.html        Contenido de cada página (solo el <main>)
  partials/icons.svg  Iconos; cada página incluye solo los que usa

assets/
  css/styles.css      Estilos y variables de marca
  js/main.js          Menú, carrusel, visor de imágenes, buscador del catálogo
  img/                Imágenes en WebP (productos, obras, catálogo, municipios, marca, og)
  catalogo/           PDF del catálogo 2026 y de luminarias ornamentales
  fonts/              Lugar para los archivos de Radnika Next
```

## Tareas frecuentes

- **Cambiar WhatsApp, teléfonos o redes**: `src/site.mjs`. Se actualiza en todas las páginas.
- **Botones de WhatsApp**: en las plantillas, cualquier enlace con `data-wa="mensaje"` se convierte en un enlace
  a WhatsApp con ese mensaje. Con `data-wa=""` usa el mensaje general.
- **Sumar una obra**: agregá sus fotos en `assets/img/obras/` (`slug.webp` y `slug-sm.webp`) y una línea en `src/data/obras.json`.
  Aparece sola en la página Proyectos y en el carrusel de la página principal.
- **Carrusel de proyectos de la portada**: las fotos que van primero y las obras que se omiten están en `PROYECTOS_PORTADA` (`src/site.mjs`).
- **Sumar un municipio**: el logo en `assets/img/municipios/slug.webp` y una línea en `src/data/municipios.json`.
- **Sumar un producto al catálogo**: la imagen de la página en `assets/img/catalogo/` y un ítem en la categoría de `src/data/catalogo.json`.
- **Dominio propio**: cambiar `url` en `src/site.mjs` (lo usan las etiquetas canónicas, Open Graph y el sitemap).

## SEO incluido

- Título, descripción y URL canónica por página.
- Open Graph y Twitter Card con imagen para compartir (`assets/img/og/compartir.jpg`, 1200×630).
- Datos estructurados JSON-LD (`LocalBusiness` con dirección, teléfonos, coordenadas y redes; migas de pan en sub-páginas).
- `sitemap.xml` y `robots.txt` generados.
- Imagen de portada precargada, JavaScript diferido, imágenes con tamaño declarado y carga diferida.

## Pendientes

- Archivos de Radnika Next en `assets/fonts/` (ver `LEEME.txt`). Mientras no estén, se usa Archivo.
- Logo oficial en SVG.
