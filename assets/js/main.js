/* Grupo MCU — comportamiento del sitio (sin dependencias).
   Cada módulo se activa solo si su HTML está en la página. */
(function () {
  "use strict";

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var onScroll = function (fn) {
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; fn(); });
    }, { passive: true });
  };

  /* ---------- Siempre abrir arriba; el enlace a la página actual sube al inicio ---------- */
  function scrollTopOnLoad() {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    var toTop = function () { if (!location.hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" }); };
    toTop();
    window.addEventListener("load", toTop);
    window.addEventListener("pageshow", function (e) { if (e.persisted) toTop(); });

    var current = location.pathname.split("/").pop() || "index.html";
    $$('a[href="' + current + '"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        if (location.hash) history.replaceState(null, "", location.pathname);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  /* ---------- Encabezado: logo grande arriba, compacto al bajar ---------- */
  function header() {
    var el = $(".site-header");
    var update = function () { el.classList.toggle("is-scrolled", window.scrollY > 40); };
    onScroll(update);
    update();
  }

  /* ---------- Menú móvil ---------- */
  function mobileMenu() {
    var toggle = $(".nav-toggle");
    var nav = $("#site-nav");
    var headerEl = $(".site-header");
    var label = $(".visually-hidden", toggle);

    function setMenu(open) {
      nav.classList.toggle("is-open", open);
      headerEl.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      label.textContent = open ? "Cerrar menú" : "Abrir menú";
    }
    toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
    });
    window.matchMedia("(min-width: 1366px)").addEventListener("change", function (mq) { if (mq.matches) setMenu(false); });
  }

  /* ---------- Página principal: ítem del menú según la sección visible ---------- */
  function scrollSpy() {
    var links = $$('.site-nav ul a[href^="#"]');
    var blocks = $$("main > section, body > footer");
    if (!$("#inicio") || !links.length) return;
    // Sección → enlace del menú. Las secciones sin enlace propio no marcan ninguno.
    var linkFor = { inicio: "#inicio", productos: "#productos", luminarias: "#green-cobra",
                    nosotros: "#nosotros", proyectos: "#proyectos", contacto: "#contacto" };
    var headerEl = $(".site-header");
    var active = null;

    function update() {
      var line = headerEl.getBoundingClientRect().bottom + window.innerHeight * 0.25;
      var current = blocks[0];
      blocks.forEach(function (s) { if (s.getBoundingClientRect().top <= line) current = s; });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = blocks[blocks.length - 1];
      var href = linkFor[current.id] || null;
      if (href === active) return;
      active = href;
      links.forEach(function (a) {
        if (a.getAttribute("href") === href) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    }
    onScroll(update);
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- Vistas de cada luminaria (miniaturas) ---------- */
  function productGalleries() {
    $$(".slide").forEach(function (slide) {
      var main = $(".gc__main", slide);
      var caption = $(".gc__caption", slide);
      var name = $("h3", slide).textContent;
      var thumbs = $$(".gc__thumb", slide);
      thumbs.forEach(function (btn) {
        btn.addEventListener("click", function () {
          thumbs.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
          main.src = btn.dataset.src;
          main.width = btn.dataset.w;
          main.height = btn.dataset.h;
          main.alt = name + ": " + btn.dataset.label.toLowerCase();
          caption.textContent = btn.dataset.label;
        });
      });
    });
  }

  /* ---------- Carrusel de luminarias ---------- */
  function productCarousel() {
    var track = $(".lines__track");
    if (!track) return;
    var slides = $$(".slide", track);
    var tabs = $$(".lines__tab");
    var dots = $$(".lines__dots span");
    var prev = $('.lines__arrows [data-dir="-1"]');
    var next = $('.lines__arrows [data-dir="1"]');
    var current = 0;

    function goTo(i) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: slides[i].offsetLeft - track.offsetLeft, behavior: "smooth" });
    }
    function mark(i) {
      current = i;
      tabs.forEach(function (t, k) {
        if (k === i) t.setAttribute("aria-current", "true"); else t.removeAttribute("aria-current");
      });
      dots.forEach(function (d, k) { d.classList.toggle("is-active", k === i); });
      prev.disabled = i === 0;
      next.disabled = i === slides.length - 1;
    }

    track.addEventListener("scroll", function () {
      var i = Math.round(track.scrollLeft / track.clientWidth);
      if (i !== current) mark(i);
    }, { passive: true });
    tabs.forEach(function (t) { t.addEventListener("click", function () { goTo(+t.dataset.go); }); });
    prev.addEventListener("click", function () { goTo(current - 1); });
    next.addEventListener("click", function () { goTo(current + 1); });
    track.addEventListener("keydown", function (e) {
      if (e.target !== track) return;
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(current + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goTo(current - 1); }
    });

    // Arrastre con mouse (en pantallas táctiles el deslizamiento es nativo)
    var drag = null;
    track.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.target.closest("button, a")) return;
      drag = { x: e.clientX, left: track.scrollLeft };
      track.classList.add("is-dragging");
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener("pointermove", function (e) {
      if (drag) track.scrollLeft = drag.left - (e.clientX - drag.x);
    });
    function endDrag(e) {
      if (!drag) return;
      var dx = e.clientX - drag.x;
      drag = null;
      track.classList.remove("is-dragging");
      goTo(Math.abs(dx) > track.clientWidth * 0.12 ? current + (dx < 0 ? 1 : -1) : current);
    }
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
    track.addEventListener("dragstart", function (e) { e.preventDefault(); });

    // Enlaces a una luminaria concreta (#green-cobra, #lao-s-pro, #afrodita)
    $$('a[href^="#"]').forEach(function (a) {
      var idx = slides.findIndex(function (s) { return "#" + s.id === a.getAttribute("href"); });
      if (idx < 0) return;
      a.addEventListener("click", function (e) {
        e.preventDefault();
        $("#luminarias").scrollIntoView({ behavior: "smooth" });
        goTo(idx);
      });
    });

    mark(0);
    var start = slides.findIndex(function (s) { return "#" + s.id === location.hash; });
    if (start > 0) {
      track.style.scrollBehavior = "auto";
      goTo(start);
      track.style.scrollBehavior = "";
    }
  }

  /* ---------- Video con portada propia: el botón lo inicia y aparecen los controles ---------- */
  function videoPlayers() {
    $$(".nos-video__player").forEach(function (box) {
      var video = $("video", box);
      var btn = $(".nos-video__play", box);
      video.controls = false;
      btn.hidden = false;
      btn.setAttribute("aria-label", "Reproducir video");
      btn.addEventListener("click", function () {
        btn.hidden = true;
        video.controls = true;
        var playing = video.play();
        if (playing) playing.catch(function () { /* el navegador bloqueó la reproducción: quedan los controles */ });
        video.focus();
      });
    });
  }

  /* ---------- Visor de imágenes ampliadas (catálogo y proyectos) ---------- */
  function lightbox() {
    var box = $("#zoom");
    if (!box) return;
    var img = $("#zoom-img");
    var cap = $("#zoom-cap");
    var triggers = $$("[data-full]");
    // Las copias de las tiras en movimiento abren la foto original, sin repetirla en el recorrido
    var originals = triggers.filter(function (t) { return !t.closest('[aria-hidden="true"]'); });
    var list = [], current = 0, lastFocus = null;

    function show(i) {
      current = (i + list.length) % list.length;
      var t = list[current];
      img.src = t.dataset.full;
      img.alt = t.dataset.alt || "";
      cap.textContent = t.dataset.caption || "";
    }
    function open(trigger) {
      // Solo se recorren las imágenes visibles (por ejemplo, después de buscar en el catálogo)
      list = originals.filter(function (t) { return !t.closest("[hidden]"); });
      lastFocus = trigger;
      show(list.findIndex(function (t) { return t.dataset.full === trigger.dataset.full; }));
      box.hidden = false;
      document.documentElement.classList.add("zoom-open");
      $("#zoom-close").focus();
    }
    function close() {
      box.hidden = true;
      document.documentElement.classList.remove("zoom-open");
      if (lastFocus) lastFocus.focus();
    }

    triggers.forEach(function (t) { t.addEventListener("click", function () { open(t); }); });
    $("#zoom-close").addEventListener("click", close);
    $("#zoom-prev").addEventListener("click", function () { show(current - 1); });
    $("#zoom-next").addEventListener("click", function () { show(current + 1); });
    box.addEventListener("click", function (e) { if (e.target === box) close(); });
    document.addEventListener("keydown", function (e) {
      if (box.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") show(current + 1);
      if (e.key === "ArrowLeft") show(current - 1);
    });
    var startX = null;
    box.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    });
  }

  /* ---------- Catálogo: buscador y categoría activa ---------- */
  function catalog() {
    var input = $("#cat-search");
    if (!input) return;
    var cards = $$(".cat-card");
    var sections = $$(".cat-sec");
    var empty = $("#cat-empty");
    var norm = function (s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); };

    input.addEventListener("input", function () {
      var q = norm(input.value.trim());
      var any = false;
      cards.forEach(function (c) {
        var hit = !q || norm(c.dataset.name).indexOf(q) !== -1;
        c.hidden = !hit;
        if (hit) any = true;
      });
      sections.forEach(function (s) { s.hidden = !$(".cat-card:not([hidden])", s); });
      empty.hidden = any;
    });

    var chips = $$(".cat-nav__list a");
    var bar = $(".cat-nav");
    var list = $(".cat-nav__list");
    var last = null;
    function mark() {
      var line = bar.getBoundingClientRect().bottom + 40;
      var id = null;
      sections.forEach(function (s) { if (!s.hidden && s.getBoundingClientRect().top <= line) id = s.id; });
      chips.forEach(function (a) {
        var on = a.getAttribute("href") === "#" + id;
        a.classList.toggle("is-active", on);
        if (on && last !== id) {
          last = id;
          list.scrollTo({ left: a.offsetLeft - 16, behavior: "smooth" });
        }
      });
    }
    onScroll(mark);
    mark();
  }

  scrollTopOnLoad();
  header();
  mobileMenu();
  scrollSpy();
  productGalleries();
  productCarousel();
  videoPlayers();
  lightbox();
  catalog();
})();
