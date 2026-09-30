/* Company logos across the report.
   1. Avatars: any element with data-logo="<domain>" gets the company's favicon
      in place of its letter; if the image fails, the letter stays.
   2. Card headings: a bold heading inside a card/pill whose text exactly equals
      a key of window.LOGO_NAMES (logo-names.js) gets a small inline logo. */
(function () {
  'use strict';
  // Google's favicon service covers almost every domain; for the few it does
  // not know (it serves a generic globe) DuckDuckGo has the icon, and for the
  // rest no public icon exists, so callers fall back to initials (url -> null).
  // Checked 30 Sep 2026 against every domain in the report.
  var VIA_DDG = { 'asyliadx.com': 1, 'bytedance.com': 1, 'dyna.co': 1, 'fastenal.com': 1, 'hexagon.com': 1, 'paloaltonetworks.com': 1, 'rockwellautomation.com': 1, 'woodplc.com': 1, 'worley.com': 1, 'respell.ai': 1, 'classtag.com': 1 };
  var NO_ICON = { 'bp.com': 1, 'covariant.ai': 1, 'eacon.com': 1, 'estun.com': 1, 'evebattery.com': 1, 'fanuc.co.jp': 1, 'gerdau.com': 1, 'hds.co.jp': 1, 'hikrobotics.com': 1, 'kajima.co.jp': 1, 'kepco.co.jp': 1, 'monarchtractor.com': 1, 'rembrain.ai': 1, 'shi.co.jp': 1, 'siasun.com': 1, 'tm-robot.com': 1, 'wrkdn.com': 1, 'zerosystems.com': 1, 'getstaxel.com': 1, 'mightyhealth.com': 1, 'hellocreator.com': 1, 'spellwise.ai': 1, 'machinet.net': 1, 'welovenocode.com': 1, 'corememily.com': 1 };
  function url(domain) {
    if (!domain || NO_ICON[domain]) return null;
    if (VIA_DDG[domain]) return 'https://icons.duckduckgo.com/ip3/' + encodeURIComponent(domain) + '.ico';
    return 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(domain) + '&sz=64';
  }
  function img(domain, onload) {
    if (!url(domain)) return;
    var i = new Image();
    i.alt = ''; i.referrerPolicy = 'no-referrer'; i.decoding = 'async';
    i.onload = function () { onload(i); };
    i.src = url(domain);
  }

  function applyAvatar(el) {
    var d = el.getAttribute('data-logo'); if (!d || el.classList.contains('has-logo')) return;
    img(d, function (i) {
      // Sizes are inline so a stale cached stylesheet can never blow the image up.
      i.style.cssText = 'width:62%;height:62%;object-fit:contain;display:block';
      el.classList.add('has-logo'); el.style.background = '#FFFFFF'; el.style.color = 'transparent';
      el.textContent = ''; el.appendChild(i);
    });
  }

  // Skip the money rivers and the portfolio cloud: they render their own logos.
  var SKIP = '.mr, #eco-cloud-container, [data-logo], .rv-logo';
  var CONTAINERS = '[class*="card"], [class*="pill"], [class*="row"], [class*="item"], [class*="tile"], [class*="cell"]';
  function tagHeadings(root) {
    var names = window.LOGO_NAMES || {};
    (root || document).querySelectorAll(CONTAINERS).forEach(function (c) {
      if (c.closest('.mr, #eco-cloud-container') || c.querySelector('[data-logo]') || c.closest('[class*="card"] [data-logo]')) return;
      c.querySelectorAll('strong, b, span, div, h3, h4, h5, p').forEach(function (e) {
        if (e.children.length || e.getAttribute('data-rv') || e.closest(SKIP)) return;
        // Only a standalone heading gets a logo, never a bold word inside a sentence:
        // skip when the parent carries its own text, or the name sits in running prose.
        var par = e.parentNode;
        if (!par || Array.prototype.some.call(par.childNodes, function (n) { return n.nodeType === 3 && n.textContent.trim(); })) return;
        var prose = e.closest('p, li, .aug-card-body, .aug-card-label, .aug-block-lede');
        if (prose && prose.textContent.trim().length > e.textContent.trim().length + 3) return;
        var t = e.textContent.trim();
        var d = names[t]; if (!d) return;
        if (parseInt(getComputedStyle(e).fontWeight, 10) < 600) return;
        e.setAttribute('data-rv', '1');
        img(d, function (i) {
          var s = document.createElement('span'); s.className = 'rv-logo'; s.setAttribute('aria-hidden', 'true');
          s.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;width:1.15em;height:1.15em;margin-right:0.4em;border-radius:0.25em;background:#FFFFFF;vertical-align:-0.18em;overflow:hidden;flex:0 0 auto';
          i.style.cssText = 'width:78%;height:78%;object-fit:contain;display:block';
          s.appendChild(i);
          e.insertBefore(s, e.firstChild);
        });
      });
    });
  }

  function run(root) {
    (root || document).querySelectorAll('[data-logo]').forEach(applyAvatar);
    tagHeadings(root);
  }
  window.dvcLogoUrl = url;
  window.dvcApplyLogos = run;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { run(); });
  else run();
})();
