/* five-years.js — DVC at Five deck extras. Navigation comes from slides.js
   (data-plain-deck); this adds speaker notes on N and inline company logos. */
(function () {
  'use strict';

  document.addEventListener('keydown', function (e) {
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    if (e.key === 'n' || e.key === 'N') document.body.classList.toggle('fy-show-notes');
  });

  // <strong data-logo-inline="domain">Name</strong> gets a small logo before it.
  var src = window.dvcLogoUrl;
  document.querySelectorAll('[data-logo-inline]').forEach(function (el) {
    var url = src && src(el.getAttribute('data-logo-inline'));
    if (!url) return;
    var img = new Image();
    img.alt = ''; img.referrerPolicy = 'no-referrer';
    img.onload = function () {
      var s = document.createElement('span'); s.className = 'fy-inline-logo'; s.setAttribute('aria-hidden', 'true');
      s.appendChild(img);
      el.insertBefore(s, el.firstChild);
    };
    img.src = url;
  });
  // Take cards: <span class="fy-take-icon" data-take-logo="domain"> gets the company icon.
  document.querySelectorAll('[data-take-logo]').forEach(function (el) {
    var url = src && src(el.getAttribute('data-take-logo'));
    if (!url) return;
    var img = new Image();
    img.alt = ''; img.referrerPolicy = 'no-referrer';
    img.onload = function () { el.appendChild(img); };
    img.src = url;
  });
})();
