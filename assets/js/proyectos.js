/* Grupo MCU — página de proyectos: filtros, foto ampliada y arranque arriba */
(function () {
  "use strict";

  /* ---------- Siempre arrancar arriba ---------- */
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  function toTop() { if (!location.hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" }); }
  toTop();
  window.addEventListener("load", toTop);
  window.addEventListener("pageshow", function (e) { if (e.persisted) toTop(); });
  document.querySelectorAll('a[href="proyectos.html"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  /* ---------- Filtros por tipo de obra ---------- */
  var obras = Array.prototype.slice.call(document.querySelectorAll(".obra"));
  var filters = Array.prototype.slice.call(document.querySelectorAll(".obras-filter"));
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var f = btn.dataset.filter;
      filters.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      obras.forEach(function (o) { o.hidden = !(f === "todos" || o.dataset.type === f); });
    });
  });

  /* ---------- Foto ampliada ---------- */
  var zoom = document.getElementById("zoom");
  var zImg = document.getElementById("zoom-img");
  var zCap = document.getElementById("zoom-cap");
  var list = [], current = 0, lastFocus = null;

  function visibleButtons() {
    return obras.filter(function (o) { return !o.hidden; }).map(function (o) { return o.querySelector(".obra__btn"); });
  }
  function show(i) {
    current = (i + list.length) % list.length;
    var b = list[current];
    zImg.src = b.dataset.big;
    zImg.alt = b.dataset.name + ", " + b.dataset.place;
    zCap.textContent = b.dataset.name + " · " + b.dataset.place;
  }
  function open(btn) {
    list = visibleButtons();
    lastFocus = btn;
    show(list.indexOf(btn));
    zoom.hidden = false;
    document.documentElement.classList.add("zoom-open");
    document.getElementById("zoom-close").focus();
  }
  function close() {
    zoom.hidden = true;
    document.documentElement.classList.remove("zoom-open");
    if (lastFocus) lastFocus.focus();
  }
  obras.forEach(function (o) {
    var b = o.querySelector(".obra__btn");
    b.addEventListener("click", function () { open(b); });
  });
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
  var sx = null;
  zoom.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
  zoom.addEventListener("touchend", function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
  });
})();
