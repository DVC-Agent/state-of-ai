/* Design D, Paper + modules: theme layer for the seven-chapter report (preview copy only).
   Loaded at the end of <head>, after every stylesheet, so it runs before the body paints.
   What it does where CSS alone cannot:
   1. Remaps the dark theme's colours to the Paper palette in every stylesheet rule, inline style,
      SVG attribute and canvas drawing call, including content scripts add later. Specificity,
      hover states and scripted state changes keep working because rules are rewritten in place.
   2. Normalises type to the brandbook (no uppercase tracking, Regular/Medium only, Stabil Grotesk).
   3. Rebuilds the cover from its existing links, recolours Chart.js, and inserts the footer mark. */
(function () {
  'use strict';
  if (window.__DESIGN_D__) return;
  window.__DESIGN_D__ = true;
  document.documentElement.classList.add('design-d');

  var NAVY = [29, 37, 62], PAPER = [250, 249, 245], WHITE = [255, 255, 255], UTIL = [245, 246, 246],
      CHAR = [35, 35, 35], BLUE = [32, 128, 214], TEAL = [75, 181, 171], YELLOW = [255, 215, 32], CORAL = [244, 182, 169];

  /* ---------- colour primitives ---------- */
  var NAMED = { white: [255, 255, 255], black: [0, 0, 0], red: [255, 0, 0], green: [0, 128, 0], blue: [0, 0, 255],
    gray: [128, 128, 128], grey: [128, 128, 128], silver: [192, 192, 192], gold: [255, 215, 0], orange: [255, 165, 0],
    whitesmoke: [245, 245, 245], lightgray: [211, 211, 211], lightgrey: [211, 211, 211] };
  var COLOR_RE = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)|\b(?:white|black|transparent|red|green|blue|gray|grey|silver|gold|orange|whitesmoke|lightgray|lightgrey)\b/g;

  function hsl2rgb(h, s, l) {
    h = ((h % 360) + 360) % 360; s = Math.max(0, Math.min(1, s)); l = Math.max(0, Math.min(1, l));
    var c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2, r, g, b;
    if (h < 60) { r = c; g = x; b = 0; } else if (h < 120) { r = x; g = c; b = 0; } else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; } else if (h < 300) { r = x; g = 0; b = c; } else { r = c; g = 0; b = x; }
    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
  }
  function parse(t) {
    t = String(t).trim().toLowerCase();
    if (t === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
    if (t[0] === '#') {
      var h = t.slice(1);
      if (h.length === 3 || h.length === 4) h = h.split('').map(function (x) { return x + x; }).join('');
      if (!/^[0-9a-f]{6}([0-9a-f]{2})?$/.test(h)) return null;
      return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1 };
    }
    var m = t.match(/^rgba?\(([^)]*)\)$/);
    if (m) {
      var p = m[1].split(/[\s,\/]+/).filter(Boolean);
      if (p.length < 3) return null;
      var ch = function (v) { return v.slice(-1) === '%' ? parseFloat(v) * 2.55 : parseFloat(v); };
      var a = p.length > 3 ? (p[3].slice(-1) === '%' ? parseFloat(p[3]) / 100 : parseFloat(p[3])) : 1;
      if ([ch(p[0]), ch(p[1]), ch(p[2]), a].some(isNaN)) return null;
      return { r: ch(p[0]), g: ch(p[1]), b: ch(p[2]), a: a };
    }
    var hm = t.match(/^hsla?\(([^)]*)\)$/);
    if (hm) {
      var q = hm[1].split(/[\s,\/]+/).filter(Boolean);
      if (q.length < 3) return null;
      var rgb = hsl2rgb(parseFloat(q[0]), parseFloat(q[1]) / 100, parseFloat(q[2]) / 100);
      var al = q.length > 3 ? (q[3].slice(-1) === '%' ? parseFloat(q[3]) / 100 : parseFloat(q[3])) : 1;
      return { r: rgb[0], g: rgb[1], b: rgb[2], a: al };
    }
    if (NAMED[t]) return { r: NAMED[t][0], g: NAMED[t][1], b: NAMED[t][2], a: 1 };
    return null;
  }
  function lin(v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
  function lum(c) { return 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b); }
  function info(c) {
    var r = c.r / 255, g = c.g / 255, b = c.b / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, h = 0;
    if (d) { if (mx === r) h = ((g - b) / d) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
    return { L: lum(c), d: d, h: h };
  }
  function near(c, rgb, tol) { return Math.abs(c.r - rgb[0]) <= tol && Math.abs(c.g - rgb[1]) <= tol && Math.abs(c.b - rgb[2]) <= tol; }
  function over(c, bg) { return { r: c.r * c.a + bg[0] * (1 - c.a), g: c.g * c.a + bg[1] * (1 - c.a), b: c.b * c.a + bg[2] * (1 - c.a), a: 1 }; }
  function brand(i) { var h = i.h; if (h < 25 || h >= 300) return CORAL; if (h < 75) return YELLOW; if (h < 190) return TEAL; return BLUE; }
  function r3(a) { return Math.round(a * 1000) / 1000; }
  function fmt(x) { var c = x[0], a = x[1] == null ? 1 : r3(x[1]); return a >= 1 ? 'rgb(' + c[0] + ', ' + c[1] + ', ' + c[2] + ')' : 'rgba(' + c[0] + ', ' + c[1] + ', ' + c[2] + ', ' + a + ')'; }

  /* ---------- the four mappings: text, surface, line, canvas ---------- */
  function mapText(c, o) {
    if (c.a === 0) return null;
    var i = info(c);
    if (i.L < 0.075) return [(i.d < 0.06 && Math.abs(c.b - c.r) < 12) ? CHAR : NAVY, c.a];
    if (i.d < 0.12) {
      if (o && o.onBlue && i.L > 0.5) return [WHITE, 1];
      if (c.a < 0.35 && i.L > 0.3) return [NAVY, 0.6];
      var le = lum(over(c, NAVY));
      if (le >= 0.7) return [NAVY, 1];
      if (le >= 0.5) return [CHAR, 1];
      return [NAVY, 0.72];
    }
    if (o && o.link) return [BLUE, 1];
    if (c.a < 0.35) return [NAVY, 0.6];
    return [NAVY, c.a >= 0.85 ? 1 : 0.72];
  }
  function mapBg(c, o) {
    if (c.a === 0) return null;
    var i = info(c), svg = o && o.svg;
    if (i.L < 0.075) {
      if (i.d < 0.06 && i.L < 0.01) { if (c.a >= 1) return null; return c.a >= 0.5 ? [NAVY, 0.4] : [NAVY, c.a * 0.3]; }
      if (svg) return (near(c, NAVY, 2) && c.a >= 0.99) ? [PAPER, 1] : [NAVY, Math.min(0.06, c.a)];
      if (c.a < 0.6) return [WHITE, 1];
      var t = i.L < 0.017 ? WHITE : i.L < 0.028 ? PAPER : i.L < 0.036 ? WHITE : UTIL;
      return [t, c.a < 1 ? Math.max(c.a, 0.94) : 1];
    }
    if (i.d < 0.12) {
      if (i.L >= 0.8) {
        if (c.a >= 0.6) return null;
        if (c.a <= 0.08) return svg ? [NAVY, 0.04] : [WHITE, 1];
        return [NAVY, Math.min(0.3, c.a * 0.5)];
      }
      return [NAVY, Math.min(0.4, (0.08 + 0.3 * (1 - i.L)) * c.a)];
    }
    if (!svg && c.a <= 0.12) return [WHITE, 1];
    return [brand(i), c.a];
  }
  function mapLine(c, o) {
    if (c.a === 0) return null;
    var i = info(c), keep = o && o.keepAlpha;
    if (i.L < 0.075) {
      if (near(c, NAVY, 2) && c.a >= 0.99) return keep ? null : [PAPER, 1];
      return [NAVY, keep ? Math.min(c.a, 0.16) : 0.16];
    }
    if (i.d < 0.12) {
      if (i.L >= 0.8) {
        if (keep) return [NAVY, Math.min(0.6, Math.max(0.06, c.a * 1.5))];
        if (c.a >= 0.95) return [NAVY, 1];
        if (c.a <= 0.15) return [NAVY, 0.16];
        if (c.a <= 0.35) return [NAVY, 0.28];
        return [NAVY, 0.5];
      }
      return [NAVY, Math.min(0.4, 0.2 + 0.3 * (1 - i.L))];
    }
    if (c.a < 0.5 && !keep) return [NAVY, 0.16];
    return [brand(i), c.a];
  }
  function mapCanvasFill(c) {
    if (c.a === 0) return null;
    if (near(c, NAVY, 1) || near(c, CHAR, 1)) return null;
    var i = info(c);
    if (i.L < 0.075) return c.a <= 0.4 ? [NAVY, c.a] : [NAVY, 0.06];
    if (i.d < 0.12 && i.L >= 0.8) return c.a >= 0.6 ? null : [NAVY, Math.min(0.3, c.a)];
    return mapBg(c, { svg: true });
  }
  function mapCanvasText(c) {
    var m = mapText(c, null);
    if (!m) return null;
    return [m[0], Math.max(m[1], 0.72)];
  }

  /* ---------- value-level mapping ---------- */
  var rootVars = {};
  var VAR_RE = /var\(\s*(--[\w-]+)\s*(?:,\s*((?:[^()]|\([^()]*\))*))?\)/g;
  function resolveVars(s) {
    for (var n = 0; n < 4 && s.indexOf('var(') >= 0; n++) {
      s = s.replace(VAR_RE, function (m, name, fb) {
        if (rootVars[name] != null) return rootVars[name];
        if (fb != null) return fb;
        return m;
      });
    }
    return s;
  }
  /* Root variables are substituted (their declarations are remapped by name, which loses context);
     a locally defined variable stays a variable, with its fallback colour remapped in place. */
  function mapColors(v, fn) {
    var saved = [];
    var s = v.replace(/url\([^)]*\)/g, function (m) { saved.push(m); return '\u0001' + (saved.length - 1) + '\u0001'; });
    for (var n = 0; n < 4 && s.indexOf('var(') >= 0; n++) {
      s = s.replace(VAR_RE, function (m, name, fb) {
        if (rootVars[name] != null) return rootVars[name];
        var out = fb != null ? 'var(' + name + ', ' + mapColors(fb, fn) + ')' : m;
        saved.push(out); return '\u0001' + (saved.length - 1) + '\u0001';
      });
    }
    s = s.replace(COLOR_RE, function (t) { var c = parse(t); if (!c) return t; var r = fn(c); return r ? fmt(r) : t; });
    return s.replace(/\u0001(\d+)\u0001/g, function (m, k) { return saved[+k]; });
  }
  function splitTop(v) {
    var out = [], depth = 0, cur = '';
    for (var k = 0; k < v.length; k++) {
      var ch = v[k];
      if (ch === '(') depth++; else if (ch === ')') depth--;
      if (ch === ',' && depth === 0) { out.push(cur); cur = ''; } else cur += ch;
    }
    out.push(cur);
    return out;
  }
  function mapShadow(v) {
    if (/^\s*none\s*$/.test(v)) return null;
    var kept = splitTop(resolveVars(v)).filter(function (part) {
      var rest = part.replace(COLOR_RE, ' ').replace(/var\((?:[^()]|\([^()]*\))*\)/g, ' ').replace(/inset/g, ' ');
      var lens = rest.match(/-?[\d.]+[a-z%]*/g) || [];
      return !(lens.length >= 3 && parseFloat(lens[2]) > 0);
    }).map(function (part) { return mapColors(part, function (c) { return mapLine(c, null); }); });
    return kept.length ? kept.join(',') : 'none';
  }
  function kindOf(p) {
    if (p.slice(0, 2) === '--') return 'custom';
    switch (p) {
      case 'color': case '-webkit-text-fill-color': case 'caret-color': case 'text-decoration-color':
      case '-webkit-text-stroke-color': case 'text-emphasis-color': return 'text';
      case 'background-color': return 'bg';
      case 'background-image': case 'background': return 'bgimg';
      case 'fill': return 'fill';
      case 'stroke': return 'stroke';
      case 'stop-color': case 'flood-color': case 'lighting-color': return 'shape';
      case 'box-shadow': return 'shadow';
      case 'text-shadow': return 'tshadow';
      case 'filter': return 'filter';
      case 'letter-spacing': return 'ls';
      case 'text-transform': return 'tt';
      /* font-weight is left alone: brand.css maps 450-1000 to the Medium file, so bold already renders as
         Medium, and logos.js reads the computed weight to decide which headings get a company logo. */
      case 'font-family': return 'ff';
      case 'accent-color': return 'accent';
      case '-webkit-text-stroke-width': return 'stroke-w';
      case 'mix-blend-mode': return 'blend';
    }
    if (/^border(-(top|right|bottom|left|block|inline)(-(start|end))?)?(-color)?$/.test(p) || /^outline(-color)?$/.test(p) || p === 'column-rule-color') return 'line';
    if (/^border(-[a-z]+)*-radius$/.test(p)) return 'radius';
    return null;
  }
  function mapCustom(name, v) {
    if (/shadow|glow/i.test(name)) return /\d/.test(v) && !/^\s*none\s*$/.test(v) ? 'none' : null;
    if (!COLOR_RE.test(v)) { COLOR_RE.lastIndex = 0; return null; }
    COLOR_RE.lastIndex = 0;
    if (/bg|background|surface|card|panel/i.test(name)) return mapColors(v, function (c) { return mapBg(c, null); });
    if (/text|fg|ink|mute|soft/i.test(name)) return mapColors(v, function (c) { return mapText(c, null); });
    if (/border|line|rule|grid/i.test(name)) return mapColors(v, function (c) { return mapLine(c, null); });
    return mapColors(v, function (c) {
      var i = info(c);
      if (i.L >= 0.075 && i.d >= 0.12) return [brand(i), c.a];
      if (i.L < 0.075) return mapBg(c, null);
      return c.a >= 0.5 ? mapText(c, null) : [NAVY, Math.min(0.3, c.a * 1.5)];
    });
  }
  /* A colour taken from a locally defined variable (per-card accent, per-layer colour) cannot be read here;
     on Paper such text is Navy (Blue when it is clickable), unless the variable is a named text colour. */
  function localVarText(v, o) {
    var m = v.match(/^\s*var\(\s*(--[\w-]+)/);
    if (!m || rootVars[m[1]] != null || /text|fg|ink|mute|soft/i.test(m[1])) return null;
    return fmt([o && o.link ? BLUE : NAVY, 1]);
  }
  function mapValue(k, v, o) {
    switch (k) {
      case 'text':
        if (o.prop === 'color' || o.prop === '-webkit-text-fill-color') { var lv = localVarText(v, o); if (lv) return lv; }
        return mapColors(v, function (c) { return mapText(c, o); });
      case 'bg': return mapColors(v, function (c) { return mapBg(c, o); });
      case 'bgimg':
        if (o.prop === 'background-image' && /radial-gradient/.test(v) && !/url\(|linear-gradient|conic-gradient/.test(v)) return 'none';
        return mapColors(v, function (c) { return mapBg(c, o); });
      case 'line': return mapColors(v, function (c) { return mapLine(c, o); });
      case 'fill':
        if (o.svgText) { var lf = localVarText(v, o); if (lf) return lf; }
        return o.svgText ? mapColors(v, function (c) { return mapText(c, o); }) : mapColors(v, function (c) { return mapBg(c, { svg: true }); });
      case 'stroke': return mapColors(v, function (c) { return mapLine(c, { keepAlpha: true }); });
      case 'shape': return mapColors(v, function (c) { return mapBg(c, { svg: true }); });
      case 'shadow': return mapShadow(v);
      case 'tshadow': return /^\s*none\s*$/.test(v) ? null : 'none';
      case 'filter':
        if (v.indexOf('drop-shadow') < 0) return null;
        var f = v.replace(/drop-shadow\((?:[^()]|\([^()]*\))*\)/g, '').trim();
        return f || 'none';
      case 'ls':
        var n = parseFloat(v);
        if (isNaN(n) || n <= 0) return null;
        if ((/em$/.test(v) && n >= 0.03) || (/px$/.test(v) && n >= 0.5)) return 'normal';
        return null;
      case 'tt': return /uppercase/.test(v) ? 'none' : null;
      case 'fw':
        if (/bold|bolder/.test(v)) return '500';
        var w = parseInt(v, 10);
        if (w >= 600) return '500';
        if (w > 0 && w < 400) return '400';
        return null;
      case 'ff': return /stabil/i.test(v) || /inherit|initial|unset/.test(v) ? null : "'Stabil Grotesk', ui-sans-serif, system-ui, sans-serif";
      case 'accent': return fmt([BLUE, 1]);
      case 'blend': return /screen|lighten|color-dodge|plus-lighter/.test(v) ? 'multiply' : null;
      case 'stroke-w': return /^\s*0(px)?\s*$/.test(v) ? null : '0px';
      case 'radius': return /^\s*0(px)?(\s+0(px)?)*\s*$/.test(v) ? null : '0px';
      case 'custom': return mapCustom(o.prop, v);
    }
    return null;
  }

  /* ---------- declaration processing: rules and inline styles ---------- */
  var LINK_SEL = /(^|[\s>+~,(])a([.:#\[\s>+~,)]|$)|button|btn|:hover|:focus|link|summary|toggle|switch|cta|(^|[^\w-])tab([^\w-]|$)|-tab\b|nav-dot|apply/i;
  var TEXT_SEL = /(^|[\s>+~.,#-])(text|tspan|label|lbl|title|tick|value|name|caption|legend|num|pct|amount|figure|hint|sub|note|desc)/i;
  var SHORTS = ['background', 'border', 'border-top', 'border-right', 'border-bottom', 'border-left', 'border-color', 'outline', 'box-shadow', 'text-shadow', 'fill', 'stroke', 'color', 'background-color', 'background-image'];
  var memo = new WeakMap();

  function processDecl(st, sel, el) {
    var link = el ? !!(el.closest && el.closest('a,button,summary,[role="button"],[role="tab"],select')) : LINK_SEL.test(sel || '');
    var svgText = el ? /^(text|tspan|textPath)$/i.test(el.tagName) : (TEXT_SEL.test(sel || '') || !!(st.getPropertyValue('font-size') || st.getPropertyValue('font-weight') || st.getPropertyValue('text-anchor') || st.getPropertyValue('letter-spacing')));
    var mm = el ? (memo.get(el) || {}) : null;
    var onBlue = false, bgv = st.getPropertyValue('background-color') || st.getPropertyValue('background');
    if (bgv) {
      var bm = resolveVars(bgv).match(COLOR_RE); COLOR_RE.lastIndex = 0;
      var bc = bm && parse(bm[0]);
      if (bc && bc.a >= 0.9) { var bi = info(bc); onBlue = bi.L >= 0.075 && bi.d >= 0.12 && brand(bi) === BLUE; }
    }
    var props = [];
    for (var k = 0; k < st.length; k++) props.push(st[k]);
    SHORTS.forEach(function (p) { var v = st.getPropertyValue(p); if (v && v.indexOf('var(') >= 0 && props.indexOf(p) < 0) props.push(p); });
    var clip = st.getPropertyValue('-webkit-background-clip') || st.getPropertyValue('background-clip');
    if (clip && /text/.test(clip)) {
      var pr0 = st.getPropertyPriority('-webkit-background-clip') || st.getPropertyPriority('background-clip');
      st.setProperty('background-image', 'none', pr0);
      st.setProperty('-webkit-text-fill-color', 'currentcolor', pr0);
      if (!st.getPropertyValue('color') || /transparent/.test(st.getPropertyValue('color'))) st.setProperty('color', fmt([NAVY, 1]), pr0);
    }
    props.forEach(function (p) {
      var kind = kindOf(p);
      if (!kind) return;
      var v = st.getPropertyValue(p);
      if (!v) return;
      if (mm && mm[p] === v) return;
      var nv = mapValue(kind, v, { link: link && !onBlue, onBlue: onBlue, svgText: svgText, svg: el && el instanceof SVGElement, prop: p });
      if (nv != null && nv !== v) st.setProperty(p, nv, st.getPropertyPriority(p));
      if (mm) mm[p] = st.getPropertyValue(p);
    });
    /* Text dimmed twice (secondary colour plus opacity) fails contrast on Paper; the colour alone carries the hierarchy. */
    var op = parseFloat(st.getPropertyValue('opacity'));
    if (op > 0.3 && op < 0.95 && st.getPropertyValue('color') && !(mm && mm.opacity === '1')) {
      st.setProperty('opacity', '1', st.getPropertyPriority('opacity'));
      if (mm) mm.opacity = '1';
    }
    if (el) memo.set(el, mm);
  }

  var doneRules = new WeakSet();
  function isOwnSheet(sheet) { var n = sheet.ownerNode; return !!(n && (n.id === 'design-d-css' || (n.href && n.href.indexOf('design-d.css') >= 0))); }
  function walk(rules) {
    for (var k = 0; k < rules.length; k++) {
      var r = rules[k];
      if (doneRules.has(r)) continue;
      doneRules.add(r);
      if (r.type === 1 || r.type === 8) processDecl(r.style, r.selectorText || '', null);
      if (r.cssRules && r.type !== 5) walk(r.cssRules);
    }
  }
  function collectRoot(rules) {
    for (var k = 0; k < rules.length; k++) {
      var r = rules[k];
      if (r.type === 1 && /^\s*(:root|html)\s*$/.test(r.selectorText)) {
        for (var j = 0; j < r.style.length; j++) {
          var p = r.style[j];
          if (p.slice(0, 2) === '--') rootVars[p] = r.style.getPropertyValue(p).trim();
        }
      } else if (r.cssRules && r.type === 4) collectRoot(r.cssRules);
    }
  }
  function processSheet(sheet) {
    if (!sheet || isOwnSheet(sheet)) return;
    var rules;
    try { rules = sheet.cssRules; } catch (e) { return; }
    if (!rules) return;
    collectRoot(rules);
    walk(rules);
  }

  function processAttrs(el) {
    var mm = memo.get(el) || {};
    ['fill', 'stroke', 'stop-color'].forEach(function (a) {
      if (!el.hasAttribute(a)) return;
      var v = el.getAttribute(a), key = '@' + a;
      if (mm[key] === v) return;
      var kind = a === 'fill' ? 'fill' : a === 'stroke' ? 'stroke' : 'shape';
      var nv = mapValue(kind, v, { svgText: /^(text|tspan|textPath)$/i.test(el.tagName), svg: true, prop: a });
      if (nv != null && nv !== v) el.setAttribute(a, nv);
      mm[key] = el.getAttribute(a);
    });
    memo.set(el, mm);
  }
  function processEl(el) {
    if (!el || el.nodeType !== 1) return;
    var tag = el.tagName;
    if (tag === 'STYLE') { if (el.sheet) processSheet(el.sheet); return; }
    if (tag === 'LINK') {
      if (/stylesheet/.test(el.rel)) { if (el.sheet) processSheet(el.sheet); el.addEventListener('load', function () { processSheet(el.sheet); }); }
      return;
    }
    if (el.hasAttribute('style')) processDecl(el.style, null, el);
    if (el instanceof SVGElement) processAttrs(el);
  }
  function processTree(n) {
    processEl(n);
    if (n.querySelectorAll) n.querySelectorAll('[style],[fill],[stroke],[stop-color],style,link[rel~="stylesheet"]').forEach(processEl);
  }

  for (var s = 0; s < document.styleSheets.length; s++) collectRoot(document.styleSheets[s].cssRules || []);
  for (var t = 0; t < document.styleSheets.length; t++) processSheet(document.styleSheets[t]);
  processTree(document.documentElement);

  new MutationObserver(function (recs) {
    for (var k = 0; k < recs.length; k++) {
      var rec = recs[k];
      if (rec.type === 'childList') {
        if (rec.target.tagName === 'STYLE') { processSheet(rec.target.sheet); continue; }
        for (var j = 0; j < rec.addedNodes.length; j++) if (rec.addedNodes[j].nodeType === 1) processTree(rec.addedNodes[j]);
      } else processEl(rec.target);
    }
  }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'fill', 'stroke', 'stop-color'] });

  /* ---------- canvas: every 2D drawing call goes through the Paper mapping ---------- */
  (function () {
    var P = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
    if (!P) return;
    var fs = Object.getOwnPropertyDescriptor(P, 'fillStyle'), ss = Object.getOwnPropertyDescriptor(P, 'strokeStyle'),
        fd = Object.getOwnPropertyDescriptor(P, 'font'), cache = new Map();
    function cm(kind, v) {
      var key = kind + '|' + v;
      var hit = cache.get(key);
      if (hit !== undefined) return hit;
      var c = parse(v), out = v;
      if (c) {
        var m = kind === 'fill' ? mapCanvasFill(c) : kind === 'stroke' ? mapLine(c, { keepAlpha: true }) : mapCanvasText(c);
        if (m) out = fmt(m);
      }
      // Animations generate a new rgba() string every frame; keep the cache bounded.
      if (cache.size > 4000) cache.clear();
      cache.set(key, out);
      return out;
    }
    /* Chart.js canvases are themed through their config (themeCharts). Mapping their draw calls breaks hover:
       the colour animation passes through dark in-between shades that the mapping turns almost transparent. */
    function isChart(ctx) { var c = ctx.canvas; return !!(c && c.$chartjs); }
    Object.defineProperty(P, 'fillStyle', { configurable: true, enumerable: fs.enumerable, get: fs.get, set: function (v) {
      if (isChart(this)) { fs.set.call(this, v); this.__dFill = null; return; }
      fs.set.call(this, typeof v === 'string' ? cm('fill', v) : v);
      this.__dFill = v; this.__dFillSet = fs.get.call(this);
    } });
    Object.defineProperty(P, 'strokeStyle', { configurable: true, enumerable: ss.enumerable, get: ss.get, set: function (v) {
      if (isChart(this)) { ss.set.call(this, v); return; }
      ss.set.call(this, typeof v === 'string' ? cm('stroke', v) : v);
    } });
    if (fd) Object.defineProperty(P, 'font', { configurable: true, enumerable: fd.enumerable, get: fd.get, set: function (v) {
      fd.set.call(this, typeof v === 'string' ? v.replace(/\b(600|700|800|900|bold)\b/, '500').replace(/\bInter\b/, "'Stabil Grotesk'") : v);
    } });
    ['fillText', 'strokeText'].forEach(function (name) {
      var orig = P[name];
      P[name] = function () {
        var cur = fs.get.call(this);
        if (typeof cur !== 'string' || isChart(this)) return orig.apply(this, arguments);
        var src = (this.__dFillSet === cur && typeof this.__dFill === 'string') ? this.__dFill : cur;
        fs.set.call(this, cm('text', src));
        var r = orig.apply(this, arguments);
        fs.set.call(this, cur);
        return r;
      };
    });
    if (window.CanvasGradient) {
      var acs = CanvasGradient.prototype.addColorStop;
      CanvasGradient.prototype.addColorStop = function (o, c) { return acs.call(this, o, typeof c === 'string' ? cm('fill', c) : c); };
    }
  })();

  /* ---------- DOM: cover, footer mark, Chart.js ---------- */
  var NS = 'http://www.w3.org/2000/svg';
  function phosphor(path, size) {
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 256 256'); svg.setAttribute('width', size); svg.setAttribute('height', size);
    svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('class', 'd-ph');
    var p = document.createElementNS(NS, 'path'); p.setAttribute('d', path); p.setAttribute('fill', 'currentColor');
    svg.appendChild(p);
    return svg;
  }
  /* Phosphor Regular: arrow-up-right, arrow-down, arrow-right */
  var PH_UP_RIGHT = 'M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z';
  var PH_DOWN = 'M205.66,149.66l-72,72a8,8,0,0,1-11.32,0l-72-72a8,8,0,0,1,11.32-11.32L120,196.69V40a8,8,0,0,1,16,0V196.69l58.34-58.35a8,8,0,0,1,11.32,11.32Z';
  var PH_RIGHT = 'M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z';

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function strip(a) { a.removeAttribute('style'); a.removeAttribute('onmouseover'); a.removeAttribute('onmouseout'); return a; }

  function buildCover() {
    var hero = document.getElementById('sec-0');
    if (!hero || hero.querySelector('.d-cover')) return;
    var slides = hero.querySelector('a[href="slides.html"]'), news = hero.querySelector('a[href="whats-new.html"]'),
        apply = hero.querySelector('a.apply-rail'), title = hero.querySelector('.hero-title'), sub = hero.querySelector('.hero-subtitle'),
        tension = hero.querySelector('.hero-tension'), scroll = hero.querySelector('.scroll-indicator'), url = hero.querySelector('.hero-dvc-url'),
        canvas = hero.querySelector('#particleCanvas');

    var top = el('div', 'd-topbar'), topIn = el('div', 'd-wrap d-topbar-in');
    var brandline = el('span', 'd-brandline');
    if (url) brandline.appendChild(url);
    var nav = el('nav', 'd-topnav'); nav.setAttribute('aria-label', 'Report');
    if (slides) nav.appendChild(strip(slides.cloneNode(true)));
    if (news) nav.appendChild(strip(news.cloneNode(true)));
    topIn.appendChild(brandline); topIn.appendChild(nav); top.appendChild(topIn);

    var cover = el('div', 'd-cover'), copy = el('div', 'd-cover-copy');
    var mark = el('img', 'd-mark'); mark.src = 'assets/brand/dvc-square.svg'; mark.alt = 'DVC'; mark.width = 112; mark.height = 112;
    copy.appendChild(mark);
    copy.appendChild(el('p', 'd-eyebrow', 'November 2026'));
    if (title) copy.appendChild(title);
    if (sub) copy.appendChild(sub);
    if (tension) { tension.removeAttribute('style'); copy.appendChild(tension); }
    var actions = el('div', 'd-actions');
    var start = el('a', 'd-btn d-btn-primary'); start.href = '#sec-stack';
    if (scroll) start.appendChild(scroll);
    start.appendChild(phosphor(PH_DOWN, 16));
    start.addEventListener('click', function (e) { var t = document.getElementById('sec-stack'); if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); } });
    actions.appendChild(start);
    if (slides) { strip(slides); slides.className = 'd-btn d-btn-secondary'; actions.appendChild(slides); }
    copy.appendChild(actions);

    var mods = el('div', 'd-cover-mods');
    var mn = el('aside', 'd-mod-news'); mn.setAttribute('aria-label', 'Latest edition');
    mn.appendChild(el('p', 'd-t-ui', 'Latest edition · figures updated November 19, 2026'));
    var mnBody = el('div');
    mnBody.appendChild(el('p', 'd-t-h2', 'Original visuals. A shorter path.'));
    if (news) { strip(news); news.className = 'd-news-link'; news.appendChild(phosphor(PH_RIGHT, 16)); mnBody.appendChild(news); }
    mn.appendChild(mnBody);
    mods.appendChild(mn);
    if (apply) {
      strip(apply); apply.className = 'd-mod-apply';
      var label = (apply.textContent || '').replace(/\s*→\s*$/, '').trim();
      apply.textContent = '';
      if (canvas) { canvas.classList.add('d-cover-particles'); apply.appendChild(canvas); }
      apply.appendChild(phosphor(PH_UP_RIGHT, 32));
      apply.appendChild(el('span', 'd-t-h2', label));
      mods.appendChild(apply);
    }
    cover.appendChild(copy); cover.appendChild(mods);

    var contentsWrap = el('div', 'd-wrap'), contents = el('ol', 'd-contents'); contents.setAttribute('aria-label', 'Chapters');
    document.querySelectorAll('article.visual-chapter').forEach(function (art, n) {
      var h = art.querySelector('.chapter-divider h2');
      var li = el('li'), a = el('a'); a.href = '#' + art.id;
      a.appendChild(el('span', 'd-num', ('0' + (n + 1)).slice(-2)));
      a.appendChild(el('span', 'd-ttl', h ? h.textContent : art.id));
      li.appendChild(a); contents.appendChild(li);
    });
    contentsWrap.appendChild(contents);

    hero.appendChild(top); hero.appendChild(cover); hero.appendChild(contentsWrap);
  }

  function buildFooter() {
    var f = document.querySelector('footer.site-footer .footer-inner');
    if (!f || f.querySelector('.d-foot-mark')) return;
    var img = el('img', 'd-foot-mark'); img.src = 'assets/brand/dvc-horizontal.svg'; img.alt = 'DVC'; img.width = 162; img.height = 54;
    f.insertBefore(img, f.firstChild);
  }

  /* Chart.js: colours are set in each chart's config, as solid colours, so hover and its colour animation
     move between two real brand colours (the canvas mapping above skips chart canvases). */
  var hex = function (rgb) { return '#' + rgb.map(function (v) { return ('0' + Math.round(v).toString(16)).slice(-2); }).join(''); };
  function mix(rgb, to, t) { return [rgb[0] + (to[0] - rgb[0]) * t, rgb[1] + (to[1] - rgb[1]) * t, rgb[2] + (to[2] - rgb[2]) * t]; }
  /* A data colour from the dark theme, as a solid Paper colour: white (the dark page's highlight) becomes
     Yellow, greys a Navy tint, hues the nearest brand colour; transparency is flattened onto Paper. */
  function dataRgb(v) {
    var c = parse(v);
    if (!c) return null;
    var i = info(c), rgb;
    if (c.r > 235 && c.g > 235 && c.b > 235) rgb = YELLOW;
    else if (i.L < 0.075) rgb = NAVY;
    else if (i.d < 0.12) rgb = mix(PAPER, NAVY, 0.08 + 0.3 * (1 - i.L));
    else rgb = brand(i);
    return mix(PAPER, rgb, c.a);
  }
  /* Capex bars wear their legend chip's colour (design-d.css .capex-tog --d-sw). */
  var CAPEX = { Amazon: YELLOW, Alphabet: BLUE, Microsoft: TEAL, Meta: CORAL };

  function themeDataset(chart, ds) {
    if (ds.__d) return;
    ds.__d = true;
    var navy = hex(NAVY);
    var each = function (v, fn) { return Array.isArray(v) ? v.map(fn) : fn(v, 0); };
    var asHex = function (v) { if (typeof v !== 'string') return v; var r = dataRgb(v); return r ? hex(r) : v; };
    if (chart.canvas && chart.canvas.id === 'capexChart' && ds.type !== 'line') {
      var labels = chart.data.labels || [];
      ds.backgroundColor = labels.map(function (l) { return hex(CAPEX[l] || NAVY); });
      ds.borderColor = navy; ds.borderWidth = 1;
    } else if (ds.type === 'line') {
      ds.pointBackgroundColor = hex(YELLOW); ds.pointBorderColor = navy; ds.pointBorderWidth = 1.5; ds.pointRadius = 6;
      ds.pointHoverBackgroundColor = hex(YELLOW); ds.pointHoverBorderColor = navy;
    } else {
      /* Estimated bars were outlined in white on the dark page. On Paper they are a lighter tint of the
         same colour with no outline; the axis label already says E and the tooltip says it is an estimate. */
      var est = Array.isArray(ds.borderWidth) ? ds.borderWidth.map(function (w, k) {
        var bc = Array.isArray(ds.borderColor) ? ds.borderColor[k] : ds.borderColor, p = typeof bc === 'string' && parse(bc);
        return w > 0 && p && p.r > 235 && p.g > 235 && p.b > 235;
      }) : [];
      var base = ds.backgroundColor;
      if (est.some(Boolean)) {
        ds.backgroundColor = est.map(function (e, k) {
          var r = dataRgb(Array.isArray(base) ? base[k] : base);
          return r ? hex(e ? mix(r, PAPER, 0.5) : r) : base;
        });
        ds.borderWidth = 0; ds.borderColor = 'rgba(0, 0, 0, 0)';
      } else {
        ds.backgroundColor = each(base, asHex);
        if (ds.borderColor != null) ds.borderColor = each(ds.borderColor, asHex);
      }
    }
    /* Hover darkens the bar slightly; nothing else changes, so the bar never flickers or vanishes. */
    var bg = ds.backgroundColor;
    ds.hoverBackgroundColor = each(bg, function (v) { var p = typeof v === 'string' && parse(v); return p ? hex(mix([p.r, p.g, p.b], NAVY, 0.14)) : v; });
    ds.hoverBorderColor = ds.borderColor; ds.hoverBorderWidth = ds.borderWidth;
  }
  function themeOptions(o) {
    var walk = function (node, path) {
      if (!node || typeof node !== 'object' || path.indexOf('tooltip') >= 0) return;
      Object.keys(node).forEach(function (k) {
        var v = node[k];
        if (typeof v === 'string' && /color$/i.test(k) && parse(v)) node[k] = /grid|border/i.test(path + '.' + k) ? 'rgba(29, 37, 62, 0.1)' : 'rgba(29, 37, 62, 0.72)';
        else if (v && typeof v === 'object' && !Array.isArray(v)) walk(v, path + '.' + k);
      });
    };
    walk(o, 'options');
  }

  function themeCharts() {
    var C = window.Chart;
    if (!C || C.__designD) return;
    C.__designD = true;
    var navy = hex(NAVY);
    C.defaults.font.family = "'Stabil Grotesk', ui-sans-serif, system-ui, sans-serif";
    C.defaults.color = 'rgba(29, 37, 62, 0.72)';
    C.defaults.borderColor = 'rgba(29, 37, 62, 0.1)';
    var TT = { backgroundColor: '#FFFFFF', titleColor: navy, bodyColor: navy, footerColor: navy, borderColor: navy, borderWidth: 1, cornerRadius: 0, padding: 10, boxPadding: 4, titleFont: { weight: '500' }, multiKeyBackground: '#FFFFFF' };
    Object.assign(C.defaults.plugins.tooltip, TT);
    C.register({
      id: 'designD',
      beforeInit: function (chart) {
        var o = chart.config.options || (chart.config.options = {});
        themeOptions(o);
        o.plugins = o.plugins || {};
        o.plugins.tooltip = Object.assign(o.plugins.tooltip || {}, TT);
        if (o.plugins.legend && o.plugins.legend.labels) o.plugins.legend.labels.color = navy;
      },
      beforeUpdate: function (chart) { chart.data.datasets.forEach(function (ds) { themeDataset(chart, ds); }); },
      /* Capex bars are four colours keyed by the chips above, so the bar series' legend mark is neutral. */
      afterUpdate: function (chart) {
        if (!chart.canvas || chart.canvas.id !== 'capexChart' || !chart.legend || !chart.legend.legendItems) return;
        chart.legend.legendItems.forEach(function (it) { if (it.datasetIndex === 0) { it.fillStyle = '#FFFFFF'; it.strokeStyle = navy; it.lineWidth = 1; } });
      }
    });
    Object.values(C.instances || {}).forEach(function (ch) { try { themeOptions(ch.options); ch.update(); } catch (e) { /* chart destroyed */ } });
  }

  /* Hover notes (data-tooltip): one popup placed by script, kept 16px inside the viewport and flipped below
     the element when there is no room above. The stylesheets' own ::after notes are switched off in design-d.css. */
  function initTips() {
    if (!window.matchMedia || !matchMedia('(hover: hover)').matches) return;
    var tip = el('div', 'd-tip'); tip.setAttribute('role', 'tooltip'); tip.hidden = true;
    document.body.appendChild(tip);
    var cur = null;
    function hide() { tip.hidden = true; cur = null; }
    function show(t) {
      tip.textContent = t.getAttribute('data-tooltip');
      tip.hidden = false; tip.style.left = '0px'; tip.style.top = '0px';
      var r = t.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight, vw = document.documentElement.clientWidth, g = 16;
      var left = Math.min(Math.max(r.left + r.width / 2 - w / 2, g), vw - w - g), top = r.top - h - 8;
      if (top < g) top = r.bottom + 8;
      tip.style.left = Math.round(left) + 'px'; tip.style.top = Math.round(top) + 'px';
    }
    document.addEventListener('mouseover', function (e) {
      var t = e.target.closest ? e.target.closest('[data-tooltip]') : null;
      if (t === cur) return;
      if (!t) { hide(); return; }
      cur = t; show(t);
    });
    document.documentElement.addEventListener('mouseleave', hide);
    window.addEventListener('scroll', function () { if (cur) hide(); }, { passive: true });
  }

  /* Sources and notes: small type at the bottom right of the block they belong to. Classed source lines are
     styled in design-d.css; this tags the unclassed "Source: ..." lines and moves method notes below their block. */
  function tagNotes() {
    document.querySelectorAll('article.visual-chapter p, article.visual-chapter span, article.visual-chapter div').forEach(function (n) {
      if (n.closest('#sec-healthcare-ai, #sec-industrial-ai')) return;
      if (n.querySelector('p, div, ul, ol, table, canvas, svg')) return;
      var t = (n.textContent || '').trim();
      if (/^Sources?\s*:/.test(t) && t.length < 600) n.classList.add('d-note');
    });
    document.querySelectorAll('.mf-depreciation > .visual-method').forEach(function (m) { m.parentElement.appendChild(m); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildCover();
    buildFooter();
    tagNotes();
    initTips();
    themeCharts();
  });
  window.addEventListener('load', themeCharts);
})();
