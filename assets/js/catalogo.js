/* Grupo MCU — sub-página del catálogo: buscador, ficha ampliada y categoría activa */
(function () {
  "use strict";

  /* ---------- Siempre arrancar arriba del catálogo ----------
     Al entrar a catalogo.html (sin #categoría) se va al inicio de la página,
     aunque el navegador recuerde dónde había quedado. */
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  function toTop() { if (!location.hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" }); }
  toTop();
  window.addEventListener("load", toTop);
  window.addEventListener("pageshow", function (e) { if (e.persisted) toTop(); });
  // Estando ya en el catálogo, "Catálogo Digital" sube al inicio
  document.querySelectorAll('a[href="catalogo.html"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      if (location.hash) history.replaceState(null, "", location.pathname);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  /* ---------- Ficha ampliada ---------- */
  var zoom = document.getElementById("zoom");
  var zImg = document.getElementById("zoom-img");
  var zCap = document.getElementById("zoom-cap");
  var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-zoom]"));
  var current = 0, lastFocus = null;

  function show(i) {
    current = (i + triggers.length) % triggers.length;
    var t = triggers[current];
    var name = t.closest(".cat-card").querySelector(".cat-card__name").textContent;
    zImg.src = t.dataset.src || "assets/img/catalogo/pag-" + String(t.dataset.zoom).padStart(2, "0") + ".webp";
    zImg.alt = "Ficha de " + name + " en el catálogo";
    zCap.textContent = name + " · " + (t.dataset.cap || "página " + t.dataset.zoom + " del catálogo 2026");
  }
  function open(i, trigger) {
    lastFocus = trigger || null;
    show(i);
    zoom.hidden = false;
    document.documentElement.classList.add("zoom-open");
    document.getElementById("zoom-close").focus();
  }
  function close() {
    zoom.hidden = true;
    document.documentElement.classList.remove("zoom-open");
    if (lastFocus) lastFocus.focus();
  }
  triggers.forEach(function (t, i) { t.addEventListener("click", function () { open(i, t); }); });
  document.getElementById("zoom-close").addEventListener("click", close);
  document.getElementById("zoom-prev").addEventListener("click", function () { show(current - 1); });
  document.getElementById("zoom-next").addEventListener("click", function () { show(current + 1); });
  zoom.addEventListener("click", function (e) { if (e.target === zoom) close(); });
  document.addEventListener("keydown", function (e) {
    if (zoom.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") show(current + 1);
    if (e.key === "ArrowLeft") show(current - 1);
  });
  // Deslizar con el dedo para pasar de ficha
  var sx = null;
  zoom.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
  zoom.addEventListener("touchend", function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
  });

  /* ---------- Buscador ---------- */
  var input = document.getElementById("cat-search");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".cat-card"));
  var secs = Array.prototype.slice.call(document.querySelectorAll(".cat-sec"));
  var empty = document.getElementById("cat-empty");
  function norm(s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  input.addEventListener("input", function () {
    var q = norm(input.value.trim());
    var any = false;
    cards.forEach(function (c) {
      var hit = !q || norm(c.dataset.name).indexOf(q) !== -1;
      c.hidden = !hit; if (hit) any = true;
    });
    secs.forEach(function (s) { s.hidden = !s.querySelector(".cat-card:not([hidden])"); });
    empty.hidden = any;
  });

  /* ---------- Categoría activa en la barra ---------- */
  var chips = Array.prototype.slice.call(document.querySelectorAll(".cat-nav__list a"));
  var bar = document.querySelector(".cat-nav");
  function mark() {
    var line = bar.getBoundingClientRect().bottom + 40;
    var id = null;
    secs.forEach(function (s) { if (!s.hidden && s.getBoundingClientRect().top <= line) id = s.id; });
    chips.forEach(function (a) {
      var on = a.getAttribute("href") === "#" + id;
      a.classList.toggle("is-active", on);
      if (on && a.scrollIntoView && bar.dataset.last !== id) {
        bar.dataset.last = id;
        var list = a.parentNode.parentNode;
        list.scrollTo({ left: a.offsetLeft - 16, behavior: "smooth" });
      }
    });
  }
  var tick = false;
  window.addEventListener("scroll", function () {
    if (tick) return; tick = true;
    requestAnimationFrame(function () { tick = false; mark(); });
  }, { passive: true });
  mark();
})();
