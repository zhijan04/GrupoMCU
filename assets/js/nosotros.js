/* Grupo MCU — sub-páginas (Nosotros, Financiamiento): abrir siempre arriba */
(function () {
  "use strict";
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  function toTop() { if (!location.hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" }); }
  toTop();
  window.addEventListener("load", toTop);
  window.addEventListener("pageshow", function (e) { if (e.persisted) toTop(); });
  var self = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll('a[href="' + self + '"]').forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); });
  });
})();
