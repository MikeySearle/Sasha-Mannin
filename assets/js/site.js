/* ============================================================
   Sasha Mannin — site behaviour
   1. load-in   2. masthead   3. reveal on scroll
   4. reels                   5. images that have not arrived yet
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

  /* ---------- 4. reels -------------------------------------- */
  /* Where one object was photographed more than once, the frames sit
     in a scroll-snapping row. Touch swipes it; a mouse gets arrows.
     The scroll position is the single source of truth, so a swipe and
     an arrow press both end up reporting the same index. */

  Array.prototype.forEach.call(document.querySelectorAll('[data-reel]'), function (frame) {
    var reel  = frame.querySelector('.reel');
    var shots = reel.querySelectorAll('img');
    var prev  = frame.querySelector('.reel__nav--prev');
    var next  = frame.querySelector('.reel__nav--next');
    var count = frame.querySelector('.reel__count');
    if (shots.length < 2) return;

    function index() {
      return Math.round(reel.scrollLeft / reel.clientWidth);
    }

    function sync() {
      var i = index();
      if (count) count.textContent = (i + 1) + '/' + shots.length;
      if (prev) prev.disabled = i <= 0;
      if (next) next.disabled = i >= shots.length - 1;
    }

    function go(step) {
      reel.scrollTo({ left: (index() + step) * reel.clientWidth, behavior: reduce.matches ? 'auto' : 'smooth' });
    }

    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });

    var pending;
    reel.addEventListener('scroll', function () {
      clearTimeout(pending);
      pending = setTimeout(sync, 90);
    }, { passive: true });

    /* arrow keys once the reel has focus */
    reel.tabIndex = 0;
    reel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); go(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    });

    window.addEventListener('resize', sync);
    sync();
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
