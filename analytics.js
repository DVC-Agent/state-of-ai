/* State of AI report analytics: Google Analytics 4 events plus first-touch attribution for the Apply links.
   Loaded in <head> of index.html and whats-new.html.
   - With no measurement ID set, nothing is sent: events go to the console and to window.__soaiEvents,
     so the wiring can be checked locally. Set GA_MEASUREMENT_ID to switch sending on.
   - EEA, UK and Swiss visitors default to Consent Mode "denied" (cookieless pings, no analytics cookies);
     everyone else defaults to "granted". There is no banner.
   - Apply links keep utm_source=state-of-ai and their placement, and carry the visitor's own source and
     campaign inside utm_campaign, so the /invest form records where the reader originally came from. */
(function () {
  'use strict';
  var GA_MEASUREMENT_ID = 'G-GGH264KFQC';
  var EDITION = 'soai-nov-2026';
  var DEBUG = /[?&]ga_debug=1\b/.test(location.search);

  window.__soaiEvents = [];
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  var EEA = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
             'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH'];
  gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', region: EEA });
  gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });

  if (GA_MEASUREMENT_ID) {
    var tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_MEASUREMENT_ID);
    document.head.appendChild(tag);
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, { report_edition: EDITION, debug_mode: DEBUG || undefined });
  }

  function clip(v) { return v == null ? undefined : String(v).replace(/\s+/g, ' ').trim().slice(0, 100); }
  function send(name, params) {
    var p = {};
    Object.keys(params || {}).forEach(function (k) { var v = clip(params[k]); if (v) p[k] = v; });
    p.report_edition = EDITION;
    window.__soaiEvents.push({ name: name, params: p });
    if (GA_MEASUREMENT_ID) gtag('event', name, p);
    else if (DEBUG || /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) console.debug('[analytics]', name, p);
  }
  window.soaiTrack = send;

  /* ---------- first-touch attribution, forwarded into the Apply links ---------- */
  var KEY = 'soai-first-touch';
  function readTouch() {
    var q = new URLSearchParams(location.search), t = {};
    ['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (k) { var v = q.get(k); if (v) t[k] = v.trim().slice(0, 40); });
    if (!t.utm_source && document.referrer) {
      try { var h = new URL(document.referrer).hostname.replace(/^www\./, ''); if (h && h !== location.hostname) t.utm_source = h.slice(0, 40); } catch (e) { /* bad referrer */ }
    }
    return t;
  }
  /* A campaign link in the URL wins; otherwise the source stored earlier in this tab, then the referrer. */
  var touch = {}, fresh = readTouch();
  try { touch = JSON.parse(sessionStorage.getItem(KEY) || 'null') || {}; } catch (e) { touch = {}; }
  if (/[?&]utm_source=/.test(location.search) || !touch.utm_source) {
    touch = fresh;
    try { sessionStorage.setItem(KEY, JSON.stringify(touch)); } catch (e) { /* storage blocked */ }
  }
  function slug(v) { return String(v || '').toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, ''); }
  function placementOf(a) {
    if (a.closest('.d-mod-apply') || a.classList.contains('apply-rail') || a.classList.contains('d-mod-apply')) return 'cover';
    if (a.classList.contains('apply-block')) return 'top_block';
    if (a.classList.contains('apply-closing')) return 'report_end';
    return 'other';
  }
  function campaign() {
    var parts = [EDITION];
    if (touch.utm_source) parts.push(slug(touch.utm_source));
    if (touch.utm_campaign) parts.push(slug(touch.utm_campaign));
    return parts.join('.').slice(0, 100);
  }
  function tagApplyLinks() {
    document.querySelectorAll('a[href*="theoss.ai/invest"]').forEach(function (a) {
      try {
        var u = new URL(a.href);
        u.searchParams.set('utm_source', 'state-of-ai');
        var pl = placementOf(a);
        u.searchParams.set('utm_medium', pl === 'report_end' ? 'report-end' : 'report-' + pl.replace(/_/g, '-'));
        u.searchParams.set('utm_campaign', campaign());
        a.href = u.toString();
      } catch (e) { /* leave the link as authored */ }
    });
  }

  /* ---------- events ---------- */
  function chapterOf(el) {
    var art = el.closest && el.closest('article.visual-chapter');
    if (!art) return {};
    var h = art.querySelector('.chapter-divider h2');
    return { chapter_number: art.getAttribute('data-chapter') || '', chapter_name: h ? h.textContent : art.id };
  }
  function summaryText(d) { var s = d.querySelector(':scope > summary'); return s ? s.textContent : ''; }

  function init() {
    tagApplyLinks();
    send('report_open', { page: location.pathname.replace(/^.*\//, '') || 'index.html', entry_source: touch.utm_source, entry_medium: touch.utm_medium, entry_campaign: touch.utm_campaign });

    /* Chapter reached: once per chapter, as soon as its yellow opener enters the viewport (fast scrolling included). */
    if ('IntersectionObserver' in window) {
      var seen = {};
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var c = chapterOf(e.target);
          if (c.chapter_number && !seen[c.chapter_number]) { seen[c.chapter_number] = true; send('chapter_reached', c); }
          io.unobserve(e.target);
        });
      }, { threshold: 0.01 });
      document.querySelectorAll('article.visual-chapter .chapter-divider').forEach(function (d) { io.observe(d); });
      var end = document.querySelector('.apply-closing, .d-method');
      if (end) new IntersectionObserver(function (entries, o) {
        if (entries.some(function (e) { return e.isIntersecting; })) { send('report_end_reached', {}); o.disconnect(); }
      }, { threshold: 0.3 }).observe(end);
    }

    /* Clicks: one delegated listener. Interactive controls are named by what the reader sees. */
    document.addEventListener('click', function (ev) {
      var t = ev.target;
      if (!t || !t.closest) return;
      var a = t.closest('a[href]');
      if (a) {
        var href = a.getAttribute('href') || '';
        if (/theoss\.ai\/invest/.test(href)) { send('apply_click', Object.assign({ placement: placementOf(a) }, chapterOf(a))); return; }
        if (/(^|\/)slides\.html/.test(href)) { send('cta_click', { target: 'slides' }); return; }
        if (/(^|\/)whats-new\.html/.test(href)) { send('cta_click', { target: 'whats_new' }); return; }
        if (/versions\/pre-seven-chapters/.test(href)) { send('cta_click', { target: 'previous_version' }); return; }
        if (href.charAt(0) === '#') {
          if (a.closest('.d-contents')) send('toc_click', { chapter_name: a.querySelector('.d-ttl') ? a.querySelector('.d-ttl').textContent : href });
          else if (a.classList.contains('d-btn-primary')) send('cta_click', { target: 'scroll_to_explore' });
          return;
        }
        if (/^https?:/.test(href)) {
          try { var host = new URL(href, location.href).hostname.replace(/^www\./, ''); if (host !== location.hostname) send('source_click', Object.assign({ domain: host }, chapterOf(a))); } catch (e) { /* ignore */ }
        }
        return;
      }
      var map = [
        ['.mf-toggle-btn', 'stack_lens', function (e) { return e.textContent; }],
        ['#mfJourneyBtn', 'dollar_journey', null],
        ['.mf-layer-header', 'stack_layer', function (e) { var l = e.closest('.mf-layer'); return l ? 'L' + l.getAttribute('data-layer') : ''; }],
        ['.capex-tog', 'capex_company', function (e) { return e.getAttribute('data-company'); }],
        ['.compute-controls button', 'compute_timeline', function (e) { return e.textContent; }],
        ['.brush-price', 'price_tier', function (e) { var s = e.querySelector('small'); return s ? s.textContent : ''; }],
        ['[data-brush-story]', 'model_lever', function (e) { return e.getAttribute('data-brush-story'); }],
        ['.mf-dep-btn', 'gpu_depreciation', function (e) { return e.textContent; }],
        ['.eco-filter-btn', 'portfolio_filter', function (e) { return e.textContent; }],
        ['.rabbit-hole-toggle', 'rabbit_hole', function (e) { var r = e.querySelector('.rabbit-hole-title'); return r ? r.textContent : e.textContent; }],
        ['.ar-card-toggle, .ar-agent-card', 'agent_card', function (e) { var c = e.closest('.ar-agent-card'); var h = c && c.querySelector('h3'); return h ? h.textContent : ''; }],
        ['.inc-cell, .inc-col-header', 'big_tech_matrix', function (e) { return e.textContent; }],
        ['.pai-av-card', 'robotaxi_card', function (e) { return e.getAttribute('data-company'); }]
      ];
      for (var i = 0; i < map.length; i++) {
        var hit = t.closest(map[i][0]);
        if (hit) { send('report_interaction', Object.assign({ element: map[i][1], value: map[i][2] ? map[i][2](hit) : '' }, chapterOf(hit))); return; }
      }
      var ex = t.closest('#sec-healthcare-ai, #sec-robotics-ai, .sec-robotics-ai, #sec-industrial-ai, #sec-services-visual');
      if (ex && t.closest('button, [role="button"], [role="tab"], svg, .mr-btn, .hc-seg, .hc-state-btn')) {
        var name = /healthcare/.test(ex.id) ? 'healthcare' : /industrial/.test(ex.id) ? 'industrial' : /services/.test(ex.id) ? 'services' : 'robotics';
        send('explorer_use', { explorer: name, control: (t.closest('button, [role="button"], [role="tab"]') || t).textContent });
      }
    }, true);

    /* Folds: any <details> opened by the reader (supporting notes, folded blocks, method notes).
       "Open supporting notes" opens all of them at once; that counts as one cta_click, not 25 folds. */
    var bulkUntil = 0;
    document.addEventListener('toggle', function (ev) {
      var d = ev.target;
      if (!d || d.tagName !== 'DETAILS' || !d.open || Date.now() < bulkUntil) return;
      var type = d.classList.contains('d-fold') ? 'folded_block' : d.classList.contains('copy-detail') ? 'supporting_note' : 'other';
      send('fold_open', Object.assign({ fold_type: type, label: summaryText(d) }, chapterOf(d)));
    }, true);
    var openAll = document.getElementById('visualExpandCopy');
    if (openAll) openAll.addEventListener('click', function () {
      bulkUntil = Date.now() + 800;
      send('cta_click', { target: 'open_all_notes' });
    }, true);

    /* Capex range switch is a checkbox, not a click target with text. */
    var gap = document.getElementById('gapToggle');
    if (gap) gap.addEventListener('change', function () { send('report_interaction', Object.assign({ element: 'capex_ranges', value: gap.checked ? 'on' : 'off' }, chapterOf(gap))); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
