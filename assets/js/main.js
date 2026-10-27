/* Grupo MCU — comportamiento del sitio (sin dependencias) */
(function () {
  "use strict";

  var cfg = window.MCU_CONFIG || {};
  var digits = String(cfg.whatsappNumber || "").replace(/\D/g, "");

  function waUrl(message) {
    return "https://wa.me/" + digits + "?text=" + encodeURIComponent(message || cfg.whatsappMessage || "");
  }

  function externalLink(a) {
    a.target = "_blank";
    a.rel = "noopener";
  }

  /* ---------- Botones de WhatsApp ---------- */
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    if (digits) {
      a.href = waUrl(a.getAttribute("data-wa-message"));
      externalLink(a);
    } else {
      // Sin número configurado: llevan a Contacto
      a.href = "#contacto";
      a.setAttribute("data-wa-pending", "");
    }
  });

  /* ---------- Destinos configurables ---------- */
  var linkMap = { about: cfg.aboutUrl, projects: cfg.projectsUrl };
  document.querySelectorAll("[data-link]").forEach(function (a) {
    var url = linkMap[a.getAttribute("data-link")];
    if (url) {
      a.href = url;
      if (/^https?:/.test(url)) externalLink(a);
    }
  });

  /* ---------- Datos de contacto en el pie ---------- */
  function fill(key, text, href, external) {
    var li = document.querySelector('[data-contact="' + key + '"]');
    if (!li || !text) return;
    var target = li.querySelector(".pending") || li;
    var node;
    if (href) {
      node = document.createElement("a");
      node.href = href;
      if (external) externalLink(node);
    } else {
      node = document.createElement("span");
    }
    node.textContent = text;
    target.replaceWith ? target.replaceWith(node) : target.parentNode.replaceChild(node, target);
  }

  // WhatsApp: la fila aparece en el pie solo cuando hay número configurado
  if (digits) {
    var waLi = document.querySelector('[data-contact="whatsapp"]');
    if (waLi) waLi.hidden = false;
    fill("whatsapp", cfg.whatsappDisplay || "+" + digits, waUrl(), true);
  }
  // Facebook: si se configura el enlace, el nombre pasa a ser link
  if (cfg.facebook && cfg.facebook.url) {
    var fbLi = document.querySelector('[data-contact="facebook"]');
    var fbText = fbLi && fbLi.querySelector("span:not(.visually-hidden)");
    if (fbText) {
      var fbA = document.createElement("a");
      fbA.href = cfg.facebook.url; fbA.textContent = fbText.textContent; externalLink(fbA);
      fbText.replaceWith(fbA);
    }
  }
  if (cfg.address) fill("address", cfg.address);

  var city = document.querySelector('[data-contact="city"]');
  if (city && cfg.city) city.textContent = cfg.city;

  var map = document.querySelector('[data-contact="maps"]');
  if (map && cfg.mapsUrl) {
    map.href = cfg.mapsUrl;
    externalLink(map);
    map.classList.add("is-linked");
    map.setAttribute("aria-label", "Ver ubicación en Google Maps");
    map.querySelector(".map-slot__label").textContent = "Ver en Google Maps";
  }

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Logo: siempre a la página principal, arriba de todo ---------- */
  var isHome = !!document.getElementById("inicio");
  if (isHome) {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    var homeTop = function () { if (!location.hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" }); };
    homeTop();
    window.addEventListener("load", homeTop);
    window.addEventListener("pageshow", function (e) { if (e.persisted) homeTop(); });
    document.querySelectorAll("a.brand").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        if (location.hash) history.replaceState(null, "", location.pathname);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  /* ---------- Catálogo digital ----------
     "Catálogo Digital" lleva a catalogo.html. Si en config.js se pone un PDF, abre en otra pestaña. */
  if (cfg.catalogUrl) {
    document.querySelectorAll("[data-catalog]").forEach(function (a) {
      a.href = cfg.catalogUrl;
      if (/\.pdf($|\?)/i.test(cfg.catalogUrl)) externalLink(a);
    });
  }

  /* ---------- Header: logo grande arriba, compacto al bajar ---------- */
  var siteHeader = document.querySelector(".site-header");
  function onHeaderScroll() { siteHeader.classList.toggle("is-scrolled", window.scrollY > 40); }
  window.addEventListener("scroll", onHeaderScroll, { passive: true });
  onHeaderScroll();

  /* ---------- Menú móvil ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  var toggleLabel = toggle.querySelector(".visually-hidden");

  var siteHeaderEl = document.querySelector(".site-header");
  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggleLabel.textContent = open ? "Cerrar menú" : "Abrir menú";
    siteHeaderEl.classList.toggle("menu-open", open);
  }

  toggle.addEventListener("click", function () {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });
  window.matchMedia("(min-width: 1366px)").addEventListener("change", function (mq) {
    if (mq.matches) setMenu(false);
  });

  /* ---------- Enlace activo según la sección visible ----------
     Se marca la sección que está justo debajo del menú. Las secciones
     sin enlace propio (Servicios, Beneficios) no marcan ninguno. */
  var links = Array.prototype.slice.call(document.querySelectorAll('.site-nav ul a[href^="#"]'));
  // Qué sección de la página corresponde a cada enlace del menú
  var linkFor = { inicio: "#inicio", productos: "#productos", luminarias: "#green-cobra",
                  nosotros: "#nosotros", proyectos: "#proyectos", servicios: "#servicios",
                  contacto: "#contacto" };
  var blocks = Array.prototype.slice.call(document.querySelectorAll("main > section, body > footer"));
  var header = document.querySelector(".site-header");
  var activeHref = null;

  function setActive(href) {
    if (href === activeHref) return;
    activeHref = href;
    links.forEach(function (a) {
      if (a.getAttribute("href") === href) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }
  function updateActive() {
    var line = header.getBoundingClientRect().bottom + window.innerHeight * 0.25;
    var current = blocks[0];
    blocks.forEach(function (s) { if (s.getBoundingClientRect().top <= line) current = s; });
    // Al llegar al final de la página, el pie (Contacto) queda marcado
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      current = blocks[blocks.length - 1];
    }
    setActive(linkFor[current.id] || null);
  }
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; updateActive(); });
  }, { passive: true });
  window.addEventListener("resize", updateActive);
  updateActive();

  /* ---------- Galerías de vistas (una por luminaria) ---------- */
  document.querySelectorAll(".slide").forEach(function (slide) {
    var main = slide.querySelector(".gc__main");
    var caption = slide.querySelector(".gc__caption");
    var name = slide.querySelector("h3").textContent;
    var thumbs = slide.querySelectorAll(".gc__thumb");
    thumbs.forEach(function (btn) {
      btn.addEventListener("click", function () {
        thumbs.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
        btn.setAttribute("aria-pressed", "true");
        main.src = btn.dataset.src;
        main.width = btn.dataset.w;
        main.height = btn.dataset.h;
        main.alt = name + ": " + btn.dataset.label.toLowerCase();
        caption.textContent = btn.dataset.label;
      });
    });
  });

  /* ---------- Carrusel de luminarias ---------- */
  var track = document.querySelector(".lines__track");
  if (track) {
    var slides = Array.prototype.slice.call(track.querySelectorAll(".slide"));
    var tabs = document.querySelectorAll(".lines__tab");
    var dots = document.querySelectorAll(".lines__dots span");
    var prev = document.querySelector('.arrow-btn[data-dir="-1"]');
    var next = document.querySelector('.arrow-btn[data-dir="1"]');
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

    // Arrastre con mouse (en táctil el deslizamiento es nativo)
    var drag = null;
    track.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.target.closest("button, a")) return;
      drag = { x: e.clientX, left: track.scrollLeft, moved: false };
      track.classList.add("is-dragging");
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener("pointermove", function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x;
      if (Math.abs(dx) > 4) drag.moved = true;
      track.scrollLeft = drag.left - dx;
    });
    function endDrag(e) {
      if (!drag) return;
      var dx = e.clientX - drag.x;
      track.classList.remove("is-dragging");
      var target = Math.abs(dx) > track.clientWidth * 0.12 ? current + (dx < 0 ? 1 : -1) : current;
      drag = null;
      goTo(target);
    }
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
    track.addEventListener("dragstart", function (e) { e.preventDefault(); });

    // Enlaces a una luminaria (#green-cobra, #lao-s-pro, #afrodita)
    document.querySelectorAll("a[href^='#']").forEach(function (a) {
      var idx = slides.findIndex(function (s) { return "#" + s.id === a.getAttribute("href"); });
      if (idx < 0) return;
      a.addEventListener("click", function (e) {
        e.preventDefault();
        document.getElementById("luminarias").scrollIntoView({ behavior: "smooth" });
        goTo(idx);
      });
    });
    var startIdx = slides.findIndex(function (s) { return "#" + s.id === location.hash; });
    mark(0);
    if (startIdx > 0) { track.style.scrollBehavior = "auto"; goTo(startIdx); track.style.scrollBehavior = ""; }
  }
})();
