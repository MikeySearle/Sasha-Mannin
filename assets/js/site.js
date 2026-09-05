/* ============================================================
   Sasha Mannin — site behaviour
   1. load-in   2. masthead   3. reveal on scroll
   4. glaze filter            5. images that have not arrived yet
   ============================================================ */

(function () {
  'use strict';

  var root   = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- 1. load-in ------------------------------------ */

  function ready() { root.classList.remove('is-loading'); }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(ready);
    setTimeout(ready, 1400);              /* never wait on a slow font host */
  } else {
    window.addEventListener('load', ready);
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- 2. masthead ----------------------------------- */
  /* Transparent over the hero photograph, solid once past it. */

  var mast = document.querySelector('.mast');
  var hero = document.querySelector('.hero');
  var ticking = false;

  function onScroll() {
    var trigger = hero ? hero.offsetHeight - 90 : 40;
    mast.classList.toggle('is-stuck', (window.scrollY || 0) > trigger);
    ticking = false;
  }

  if (mast) {
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();
  }

  /* ---------- 3. reveal on scroll --------------------------- */

  var pieces = Array.prototype.slice.call(document.querySelectorAll('.piece'));

  if ('IntersectionObserver' in window && !reduce.matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    pieces.forEach(function (el) { io.observe(el); });
  } else {
    pieces.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- 4. glaze filter ------------------------------- */
  /* Browse the collection by colour, the way the museum does. */

  var swatches = Array.prototype.slice.call(document.querySelectorAll('.swatch'));

  swatches.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var want = btn.dataset.filter;

      swatches.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });

      pieces.forEach(function (p) {
        var show = want === 'all' || p.dataset.tone === want;
        p.classList.toggle('is-out', !show);
        if (show) p.classList.add('is-in');
      });
    });
  });

  /* ---------- 5. images that have not arrived yet ------------ */
  /* Every frame holds a real <img>. If the file is not there the
     frame falls back to a tone from the palette and names what it
     is waiting for, so the page never shows a broken image and
     the moment a photograph is dropped in, it simply appears. */

  function markEmpty(img) {
    var frame = img.closest('.piece__frame, .shot');
    if (frame) frame.classList.add('is-empty');
  }

  Array.prototype.forEach.call(document.images, function (img) {
    if (img.complete && img.naturalWidth === 0) { markEmpty(img); return; }
    img.addEventListener('error', function () { markEmpty(img); }, { once: true });
  });
}());
