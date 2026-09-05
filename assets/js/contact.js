/* ============================================================
   Enquiry form
   The human check and the honeypot run here, in the browser.
   Where the answers go is set by TO and ENDPOINT below.
   ============================================================ */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     WHERE THE ANSWERS GO  —  SET THIS BEFORE THE SITE GOES LIVE

     TO        Sasha's email address. Until it is filled in, the form
               refuses to send rather than quietly losing an enquiry.

     ENDPOINT  Optional. Left empty, sending opens the writer's own mail
               app with everything filled in and addressed to her — no
               setup, but they have to press send themselves.
               For enquiries to arrive on their own, get a free endpoint
               from formspree.io or web3forms.com and paste it here.
               Nothing else needs to change.
  ------------------------------------------------------------------ */
  var TO       = '';
  var ENDPOINT = '';

  var form     = document.getElementById('enquiry-form');
  var error    = document.getElementById('form-error');
  var note     = document.getElementById('form-note');
  var sent     = document.getElementById('sent');
  var loadedAt = Date.now();

  document.documentElement.classList.remove('is-loading');
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- human check ---------- */

  var WORDS = ['zero','one','two','three','four','five','six','seven','eight',
               'nine','ten','eleven','twelve','thirteen','fourteen','fifteen',
               'sixteen','seventeen','eighteen'];

  var a = 2 + Math.floor(Math.random() * 8);
  var b = 2 + Math.floor(Math.random() * 8);
  var answer = a + b;

  document.getElementById('human-question').textContent =
    'What is ' + WORDS[a] + ' plus ' + WORDS[b] + '?';

  function humanOK(raw) {
    var v = String(raw || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!v) return false;
    return v === String(answer) || v === WORDS[answer];
  }

  /* ---------- helpers ---------- */

  function val(name) {
    var el = form.elements[name];
    return el ? String(el.value || '').trim() : '';
  }

  function purpose() {
    var picked = form.querySelector('input[name="purpose"]:checked');
    return picked ? picked.value : '';
  }

  function fail(message, focusId) {
    error.textContent = message;
    error.hidden = false;
    error.scrollIntoView({ block: 'center', behavior: 'smooth' });
    var el = focusId && document.getElementById(focusId);
    if (el) el.focus({ preventScroll: true });
    return false;
  }

  function body() {
    return [
      'Name: '    + val('name'),
      'Email: '   + val('email'),
      'About: '   + purpose(),
      'Piece: '   + (val('piece') || '—'),
      '',
      val('message')
    ].join('\n');
  }

  /* ---------- send ---------- */

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    error.hidden = true;

    if (val('website')) return;                       /* a robot filled the honeypot */
    if (Date.now() - loadedAt < 3000) {
      return fail('That was quick — give it a moment and send again.');
    }

    if (!val('name'))    return fail('Your name is needed.', 'f-name');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val('email'))) {
      return fail('That email address does not look right.', 'f-email');
    }
    if (!purpose())      return fail('Pick what this is about.');
    if (!val('message')) return fail('Add a message, even a short one.', 'f-message');
    if (!humanOK(val('human'))) {
      return fail('The sum is not right — have another go.', 'f-human');
    }

    if (!TO && !ENDPOINT) {
      return fail('This form is not connected to an inbox yet. Set TO in assets/js/contact.js.');
    }

    var subject = 'Enquiry — ' + purpose() + ' — ' + val('name');

    if (!ENDPOINT) {
      window.location.href = 'mailto:' + TO +
        '?subject=' + encodeURIComponent(subject) +
        '&body='    + encodeURIComponent(body());
      note.textContent = 'Your mail app should have opened. If it did not, ' +
                         'write to ' + TO + ' directly.';
      return;
    }

    note.textContent = 'Sending…';

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: val('name'), email: val('email'), purpose: purpose(),
        piece: val('piece'), message: val('message'), _subject: subject
      })
    }).then(function (r) {
      if (!r.ok) throw new Error('bad response');
      form.hidden = true;
      sent.hidden = false;
      sent.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }).catch(function () {
      note.textContent = '';
      fail('That did not send. Write to ' + (TO || 'her') + ' directly and it will get there.');
    });
  });
}());
