/* =========================================================
   CONFIGURACIÓN DEL SITIO — Grupo MCU
   Completá estos datos y el sitio los aplica solo.
   Todo campo vacío ("") se muestra como "pendiente".
   ========================================================= */
window.MCU_CONFIG = {
  // WhatsApp en formato internacional, solo dígitos, sin "+" ni espacios.
  // Ejemplo de formato para México: 52 + lada + número  →  "523300000000"
  whatsappNumber: "523324062551",
  // Cómo se muestra el número en el pie (opcional). Ej: "+52 33 0000 0000"
  whatsappDisplay: "+52 33 2406 2551",
  // Mensaje por defecto (cada botón puede tener el suyo con data-wa-message)
  whatsappMessage: "Hola, me interesa cotizar un proyecto de iluminación LED.",

  // Teléfonos, correo, Instagram y TikTok ya están escritos en index.html (pie de página).

  facebook: { url: "https://www.facebook.com/alteciluminacion" },   // Enlace de la página de Facebook "Grupo MCU", ej: "https://www.facebook.com/..."

  city: "Guadalajara, Jalisco, México",  // confirmar con el cliente
  address: "Bolivia 2797, C.P. 44950",        // Calle, número, colonia, CP
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=20.641118%2C-103.376219",        // Enlace de Google Maps a la ubicación

  // Destino de "Catálogo Digital": la sub-página del catálogo.
  // El PDF completo está en assets/catalogo/catalogo-2026-grupo-mcu.pdf
  catalogUrl: "catalogo.html",

  // Destino de los botones "Conoce más sobre nosotros" y "Ver más proyectos".
  // Si quedan vacíos, llevan a la sección de contacto.
  aboutUrl: "nosotros.html",
  projectsUrl: "proyectos.html"
};
