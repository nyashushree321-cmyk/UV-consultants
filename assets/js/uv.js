/* UV Consultants — light UI behaviour layered on top of easilon.js */
(function () {
  "use strict";

  var doc = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Header shadow + back-to-top visibility
  var header = document.querySelector(".uv-header");
  var toTop = document.querySelector(".uv-to-top");
  function onScroll() {
    var y = window.pageYOffset || doc.scrollTop;
    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (toTop) toTop.classList.toggle("is-visible", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  // Mobile menu: keep aria-expanded in sync and close on Escape.
  // Open/close itself is handled by easilon.js (.mobile-nav__toggler).
  var wrapper = document.querySelector(".mobile-nav__wrapper");
  var openBtn = document.querySelector(".uv-header__toggle");
  if (wrapper && openBtn) {
    var sync = function () {
      var open = wrapper.classList.contains("expanded");
      openBtn.setAttribute("aria-expanded", open ? "true" : "false");
      wrapper.setAttribute("aria-hidden", open ? "false" : "true");
      if (open) {
        var close = wrapper.querySelector(".mobile-nav__close");
        if (close) close.focus();
      }
    };
    new MutationObserver(sync).observe(wrapper, { attributes: true, attributeFilter: ["class"] });
    sync();
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && wrapper.classList.contains("expanded")) {
        wrapper.classList.remove("expanded");
        document.body.classList.remove("locked");
        openBtn.focus();
      }
    });
  }

  // Reveal on scroll
  var items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  items.forEach(function (el) { io.observe(el); });
})();
