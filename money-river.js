/* Money River: a three-column Sankey (who pays -> what is bought -> what the
   dollars fund) with AI-wedge, structural-force and company overlays.
   Shared by the robotics and industrial sections. Ported from the standalone
   robotics/industrial river renderers; every DOM lookup is scoped to its own
   mount so two rivers can live on one page.

   Usage: MoneyRiver.mount(el, window.ROBOTICS_DATA, config) where el carries
   the class "mr" and config supplies the per-river copy (see index.html). */
(function (root) {
  'use strict';

  var uid = 0;
  var tip = null;
  function ensureTip() {
    if (tip) return tip;
    tip = document.createElement('div');
    tip.className = 'mr-tip';
    document.body.appendChild(tip);
    return tip;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function pct(a, b) { return b > 0 ? Math.round(100 * a / b) + '%' : ''; }

  // ---- Logos -----------------------------------------------------------
  // Domains come from company-domains.js (window.COMPANY_DOMAINS); a missing
  // domain or a failed image falls back to an initials monogram.
  function initials(name) {
    var w = String(name).replace(/\(.*?\)/g, '').trim().split(/[\s-]+/).filter(Boolean);
    return ((w[0] || '?').charAt(0) + (w.length > 1 ? w[1].charAt(0) : (w[0] || '').charAt(1) || '')).toUpperCase();
  }
  function logos(name) {
    var map = root.COMPANY_DOMAINS || {};
    var src = root.dvcLogoUrl || function (d) { return 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(d) + '&sz=64'; };
    var doms = map[name] || [];
    var parts = String(name).split(' / ');
    if (!doms.length) return '<span class="mr-logo mr-logo--mono" aria-hidden="true">' + esc(initials(name)) + '</span>';
    return '<span class="mr-logos" aria-hidden="true">' + doms.slice(0, 4).map(function (d, i) {
      if (!src(d)) return '<span class="mr-logo mr-logo--mono">' + esc(initials(parts[i] || name)) + '</span>';
      return '<span class="mr-logo" data-mono="' + esc(initials(parts[i] || name)) + '"><img src="' + esc(src(d)) + '" alt="" loading="lazy" referrerpolicy="no-referrer"></span>';
    }).join('') + '</span>';
  }
  function wireLogos(scope) {
    scope.querySelectorAll('.mr-logo img').forEach(function (img) {
      var fail = function () { var s = img.parentNode; s.classList.add('mr-logo--mono'); s.textContent = s.getAttribute('data-mono'); };
      img.addEventListener('error', fail);
    });
  }

  function mount(el, D, cfg) {
    if (!el || !D || !root.d3 || !root.d3.sankey) return;
    var d3 = root.d3;
    var id = 'mr' + (++uid);
    var fmt = D.fmtUSD;

    el.innerHTML =
      '<div class="mr-stats" data-r="stats"></div>' +
      '<div class="mr-head"><h3>' + esc(cfg.riverTitle || 'Where the money flows') + '</h3>' +
        '<div class="mr-toolbar" role="toolbar" aria-label="Money River view controls">' +
          '<div class="mr-seg" role="radiogroup" aria-label="View">' +
            '<button type="button" role="radio" aria-checked="true" data-view="money">Money</button>' +
            '<button type="button" role="radio" aria-checked="false" data-view="ai">AI opportunities</button>' +
            '<button type="button" role="radio" aria-checked="false" data-view="incentives">Incentives</button>' +
            '<button type="button" role="radio" aria-checked="false" data-view="companies">Companies</button>' +
          '</div>' +
          '<button type="button" class="mr-btn" data-r="dvc-only" aria-pressed="false" hidden>DVC only</button>' +
          '<button type="button" class="mr-btn" data-r="reset" hidden>Reset</button>' +
        '</div></div>' +
      '<p class="mr-hint" data-r="hint"></p>' +
      '<div class="mr-card">' +
        '<div class="mr-wrap"><div class="mr-scroll-hint">Scroll sideways to see all three columns &rarr;</div>' +
          '<svg class="view-money" role="img" aria-label="' + esc(cfg.ariaLabel) + '"></svg></div>' +
        '<div class="mr-legend"><span class="k">Legend</span>' + cfg.legend.map(function (l) { return '<span><i class="sw ' + l[0] + '"></i>' + esc(l[1]) + '</span>'; }).join('') +
          '<span><i class="sw m"></i>Modeled total</span></div>' +
        '<section class="mr-overlay" data-r="overlay-ai" hidden><h4>AI wedges. Hover a card to see where it attaches; click to pin.</h4><div class="mr-cards" data-r="ai-cards"></div></section>' +
        '<section class="mr-overlay" data-r="overlay-inc" hidden><h4>Structural forces. Pull raises demand or lowers price; friction adds cost or blocks flow.</h4><div class="mr-cards" data-r="inc-cards"></div></section>' +
        '<section class="mr-overlay" data-r="overlay-co" hidden><h4>' + esc(cfg.companiesNote) + '</h4></section>' +
        '<section class="mr-drawer" data-r="drawer" hidden aria-live="polite"></section>' +
        '<div class="mr-foot">' + cfg.foot +
          '<details><summary>Method and exclusions</summary><ol data-r="method"></ol></details>' +
          '<details><summary>Sources (' + D.sources.length + ')</summary><ul data-r="sources"></ul></details>' +
          '<details><summary>Audit log</summary><ol data-r="auditlog"></ol></details>' +
        '</div>' +
      '</div>';

    function $(r) { return el.querySelector('[data-r="' + r + '"]'); }
    var svgEl = el.querySelector('svg');
    var svg = d3.select(svgEl);
    var drawer = $('drawer'), resetBtn = $('reset'), dvcBtn = $('dvc-only');
    var tipEl = ensureTip();

    var byId = {};
    D.paymentChannels.forEach(function (n) { byId[n.id] = Object.assign({ layer: 0, kind: 'buyer' }, n); });
    D.destinations.forEach(function (n) { byId[n.id] = Object.assign({ layer: 1, kind: 'destination' }, n); });
    var poolTotals = {};
    D.moneyLinksBC.forEach(function (l) { poolTotals[l.target] = (poolTotals[l.target] || 0) + l.value_b; });
    D.costPools.forEach(function (n) { byId[n.id] = Object.assign({ layer: 2, kind: 'pool', value_b: poolTotals[n.id] || 0, display: fmt(poolTotals[n.id] || 0), evidence: 'modeled' }, n); });
    var allLinks = D.moneyLinksAB.concat(D.moneyLinksBC);

    var aiByNode = {}, incByNode = {};
    D.aiSurfaces.forEach(function (a) { (a.attach_pools || []).concat(a.attach_dests || []).forEach(function (k) { (aiByNode[k] = aiByNode[k] || []).push(a); }); });
    D.incentives.forEach(function (i) { i.attach.forEach(function (k) { (incByNode[k] = incByNode[k] || []).push(i); }); });
    function isMarked(x) { return x.dvc || x.pipe; }
    function companiesFor(k, dvcOnly) {
      var c = D.companies[k]; if (!c) return null;
      var f = function (arr) { return dvcOnly ? arr.filter(isMarked) : arr; };
      return { heads: c.heads || ['Incumbent', 'AI-native'], incumbent: f(c.incumbent || []), ai_native: f(c.ai_native || []) };
    }

    // ---- Stat tiles, method, sources, audit log ------------------------
    $('stats').innerHTML = D.headlineStats.map(function (s) {
      return '<div class="mr-stat"><div class="v">' + s.value + '</div><div class="l">' + s.label + '</div><div class="s">' + (s.src ? '<a href="' + s.src + '" target="_blank" rel="noopener">' + s.sub + '</a>' : s.sub) + '</div></div>';
    }).join('');
    $('method').innerHTML = D.method.map(function (m) { return '<li>' + m + '</li>'; }).join('');
    $('sources').innerHTML = D.sources.map(function (s) { return '<li><a href="' + s.url + '" target="_blank" rel="noopener">' + s.label + '</a></li>'; }).join('');
    $('auditlog').innerHTML = (D.auditLog || []).map(function (a) { return '<li><b>' + a.date + '</b> ' + a.change + '</li>'; }).join('');

    // ---- Sankey --------------------------------------------------------
    var W = 1240, H = 900, ML = 232, MR = 232, MT = 46, MB = 16;
    var state = { view: 'money', selected: null, selType: null, dvcOnly: false, pinned: null };
    var graph, nodeSel, linkSel;

    function render() {
      svg.selectAll('*').remove();
      svg.attr('viewBox', '0 0 ' + W + ' ' + H).attr('preserveAspectRatio', 'xMinYMin meet');
      var nodes = Object.keys(byId).map(function (k) { return Object.assign({}, byId[k]); });
      var links = allLinks.map(function (l) { return { id: l.id, source: l.source, target: l.target, value: l.value_b, span: l.span }; });
      graph = d3.sankey()
        .nodeId(function (d) { return d.id; })
        .nodeWidth(14).nodePadding(12)
        .nodeAlign(d3.sankeyJustify)
        .nodeSort(function (a, b) { return b.value - a.value; })
        .extent([[ML, MT], [W - MR, H - MB]])({ nodes: nodes, links: links });

      var cols = [
        { x: ML, t: 'Who pays', s: D.baseYear + ', ' + cfg.colSubs[0], anchor: 'end', dx: -6 },
        { x: (ML + (W - MR)) / 2, t: 'What is bought', s: cfg.colSubs[1], anchor: 'middle', dx: 0 },
        { x: W - MR, t: 'What the dollars fund', s: cfg.colSubs[2], anchor: 'start', dx: 20 }
      ];
      var ct = svg.append('g');
      cols.forEach(function (c) {
        ct.append('text').attr('class', 'col-title').attr('x', c.x + c.dx).attr('y', 16).attr('text-anchor', c.anchor).text(c.t);
        ct.append('text').attr('class', 'col-sub').attr('x', c.x + c.dx).attr('y', 30).attr('text-anchor', c.anchor).text(c.s);
      });

      var colorOf = function (n) {
        if (n.layer === 0) return n.role === 'consumer' ? '#FF8C42' : n.role === 'capital' ? '#9B7BFF' : n.role === 'public' ? '#6FA6E0' : '#4A90D9';
        return n.layer === 1 ? '#4ECDC4' : '#A0A8BC';
      };

      linkSel = svg.append('g').selectAll('g').data(graph.links).join('g').attr('class', 'link-group');
      linkSel.append('path').attr('class', function (d) { return 'link ' + (d.span === 'AB' ? 'ab' : 'bc'); })
        .attr('d', d3.sankeyLinkHorizontal())
        .attr('stroke', function (d) { return d.span === 'AB' ? colorOf(d.source) : '#6E9BAA'; })
        .attr('stroke-width', function (d) { return Math.max(1, d.width); });
      svg.append('g').selectAll('path').data(graph.links).join('path').attr('class', 'link-hit')
        .attr('d', d3.sankeyLinkHorizontal()).attr('stroke-width', function (d) { return Math.max(6, d.width); })
        .on('mousemove', function (ev, d) { showTip(ev, linkTip(d)); })
        .on('mouseleave', hideTip)
        .on('click', function (ev, d) { selectLink(d); });

      nodeSel = svg.append('g').selectAll('g').data(graph.nodes).join('g')
        .attr('class', function (d) {
          var c = 'node layer-' + d.layer + (d.role ? ' role-' + d.role : '');
          if (d.evidence === 'modeled' || d.evidence === 'derived') c += ' is-modeled';
          if (aiByNode[d.id]) c += ' has-ai';
          if (incByNode[d.id]) c += ' has-inc';
          if (D.companies[d.id]) c += ' has-co';
          return c;
        })
        .attr('tabindex', 0).attr('role', 'button')
        .attr('aria-label', function (d) { return d.label + ', ' + d.display; })
        .on('click', function (ev, d) { selectNode(d.id); })
        .on('keydown', function (ev, d) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); selectNode(d.id); } })
        .on('mousemove', function (ev, d) { showTip(ev, nodeTip(d)); })
        .on('mouseleave', hideTip);
      nodeSel.append('rect')
        .attr('x', function (d) { return d.x0; }).attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; }).attr('height', function (d) { return Math.max(2, d.y1 - d.y0); })
        .attr('rx', 2);
      nodeSel.append('text').attr('class', 'node-label')
        .attr('x', function (d) { return d.layer === 2 ? d.x1 + 8 : d.x0 - 8; })
        .attr('y', function (d) { return (d.y0 + d.y1) / 2; })
        .attr('dy', '0.35em')
        .attr('text-anchor', function (d) { return d.layer === 2 ? 'start' : 'end'; })
        .each(function (d) {
          var t = d3.select(this);
          t.append('tspan').text(d.short || d.label);
          t.append('tspan').attr('class', 'val').attr('dx', 6).text(d.display);
        });

      nodeSel.each(function (d) {
        var g = d3.select(this);
        var addBadge = function (cls, text) {
          var bx = d.layer === 2 ? d.x0 - 10 - 30 : d.x1 + 10;
          var b = g.append('g').attr('class', 'badge ' + cls).attr('transform', 'translate(' + bx + ',' + ((d.y0 + d.y1) / 2 - 9) + ')');
          b.append('rect').attr('width', 30).attr('height', 18).attr('rx', 9).attr('stroke-width', 1);
          b.append('text').attr('x', 15).attr('y', 13).attr('text-anchor', 'middle').text(text);
        };
        if (aiByNode[d.id]) addBadge('ai', aiByNode[d.id].length);
        if (incByNode[d.id]) addBadge('inc', incByNode[d.id].length);
        var c = D.companies[d.id];
        if (c) {
          var all = (c.incumbent || []).concat(c.ai_native || []);
          addBadge('co' + (all.some(isMarked) ? ' dvc' : ''), all.length);
        }
      });
      applyView();
    }

    // ---- Tooltip -------------------------------------------------------
    function showTip(ev, html) {
      tipEl.innerHTML = html; tipEl.classList.add('on');
      var x = ev.clientX + 14, y = ev.clientY + 14;
      if (x + 290 > window.innerWidth) x = ev.clientX - 290;
      if (y + 90 > window.innerHeight) y = ev.clientY - 80;
      tipEl.style.left = x + 'px'; tipEl.style.top = y + 'px';
    }
    function hideTip() { tipEl.classList.remove('on'); }
    function linkTip(d) {
      var s = d.source, t = d.target;
      return '<div class="t">' + esc(s.label) + ' &rarr; ' + esc(t.label) + '</div><div>' + fmt(d.value) + '</div><div class="m">' + pct(d.value, s.value) + ' of ' + esc(s.short || s.label) + ' &middot; ' + pct(d.value, t.value) + ' of ' + esc(t.short || t.label) + '</div>';
    }
    function nodeTip(d) {
      var tags = [];
      if (aiByNode[d.id]) tags.push(aiByNode[d.id].length + ' AI wedge' + (aiByNode[d.id].length > 1 ? 's' : ''));
      if (incByNode[d.id]) tags.push(incByNode[d.id].length + ' force' + (incByNode[d.id].length > 1 ? 's' : ''));
      return '<div class="t">' + esc(d.label) + '</div><div>' + d.display + ' <span class="m">&middot; ' + (d.evidence || 'modeled') + (d.year ? ' &middot; ' + esc(d.year) : '') + '</span></div>' + (tags.length ? '<div class="m">' + tags.join(' &middot; ') + '</div>' : '') + '<div class="m">Click to trace</div>';
    }

    // ---- Selection & highlight ----------------------------------------
    function clearHighlight() {
      nodeSel.classed('is-dim', false).classed('is-hi', false);
      linkSel.classed('is-dim', false).classed('is-hi', false).classed('is-trace', false).style('--trace', null);
    }
    function applyHighlight() {
      clearHighlight();
      if (!state.selected) return;
      var sel = state.selected;
      if (state.selType === 'link') {
        var L = graph.links.find(function (l) { return l.id === sel; });
        linkSel.classed('is-dim', function (l) { return l.id !== sel; }).classed('is-hi', function (l) { return l.id === sel; });
        nodeSel.classed('is-dim', function (n) { return n.id !== L.source.id && n.id !== L.target.id; }).classed('is-hi', function (n) { return n.id === L.source.id || n.id === L.target.id; });
        return;
      }
      var node = graph.nodes.find(function (n) { return n.id === sel; });
      var share = {}; share[sel] = 1;
      var touched = {}; touched[sel] = true;
      var linkOp = {};
      if (node.layer === 0) {
        node.sourceLinks.forEach(function (l) { linkOp[l.id] = 1; share[l.target.id] = l.value / l.target.value; touched[l.target.id] = true; });
        graph.links.forEach(function (l) { if (l.span === 'BC' && share[l.source.id]) { linkOp[l.id] = share[l.source.id]; touched[l.target.id] = true; } });
      } else if (node.layer === 1) {
        node.targetLinks.forEach(function (l) { linkOp[l.id] = 1; touched[l.source.id] = true; });
        node.sourceLinks.forEach(function (l) { linkOp[l.id] = 1; touched[l.target.id] = true; });
      } else {
        node.targetLinks.forEach(function (l) { linkOp[l.id] = 1; share[l.source.id] = l.value / l.source.value; touched[l.source.id] = true; });
        graph.links.forEach(function (l) { if (l.span === 'AB' && share[l.target.id]) { linkOp[l.id] = share[l.target.id]; touched[l.source.id] = true; } });
      }
      nodeSel.classed('is-dim', function (n) { return !touched[n.id]; }).classed('is-hi', function (n) { return n.id === sel; });
      linkSel.each(function (l) {
        var g = d3.select(this), op = linkOp[l.id];
        if (op === undefined) { g.classed('is-dim', true); return; }
        if (op >= 0.999) { g.classed('is-hi', true); return; }
        g.classed('is-trace', true).style('--trace', String(Math.max(0.12, Math.min(0.85, op * 0.85 + 0.1))));
      });
    }
    function selectNode(k) { state.selected = k; state.selType = 'node'; applyHighlight(); renderDrawer(); resetBtn.hidden = false; }
    function selectLink(l) { state.selected = l.id; state.selType = 'link'; applyHighlight(); renderDrawer(); resetBtn.hidden = false; }
    resetBtn.addEventListener('click', function () {
      state.selected = null; state.selType = null; state.pinned = null;
      clearHighlight(); drawer.hidden = true; resetBtn.hidden = true;
      el.querySelectorAll('.mr-ocard.is-on').forEach(function (c) { c.classList.remove('is-on'); });
    });

    // ---- Drawer --------------------------------------------------------
    function nodeRow(n, v, total) { return '<tr><td class="lbl" data-go="' + n.id + '">' + esc(n.label) + '</td><td class="n">' + fmt(v) + '</td><td class="n">' + pct(v, total) + '</td></tr>'; }
    function tableOf(title, rows) { return rows.length ? '<div><h5>' + title + '</h5><table><thead><tr><th>Node</th><th class="n">$B</th><th class="n">Share</th></tr></thead><tbody>' + rows.join('') + '</tbody></table></div>' : ''; }
    function chipsOf(items, cls) { return items && items.length ? '<div class="chips">' + items.map(function (x) { return '<button type="button" class="chip ' + cls + '" data-' + cls + '="' + x.id + '">' + esc(x.label) + '</button>'; }).join('') + '</div>' : ''; }
    function coList(arr) { return arr.length ? '<ul>' + arr.map(function (c) { return '<li' + (c.dvc ? ' class="dvc"' : c.pipe ? ' class="pipe"' : '') + '>' + logos(c.name) + '<b>' + esc(c.name) + '</b>' + (c.note ? ' <span>' + esc(c.note) + '</span>' : '') + '</li>'; }).join('') + '</ul>' : '<ul><li><span>none in this view</span></li></ul>'; }
    function companiesBlock(k) {
      var c = companiesFor(k, state.dvcOnly); if (!c) return '';
      return '<div><h5>Companies' + (state.dvcOnly ? ' (DVC portfolio)' : '') + '</h5><div class="cos"><div><h5>' + esc(c.heads[0]) + '</h5>' + coList(c.incumbent) + '</div><div><h5>' + esc(c.heads[1]) + '</h5>' + coList(c.ai_native) + '</div></div></div>';
    }
    function uniq(x, i, a) { return a.indexOf(x) === i; }
    function renderDrawer() {
      var html = '';
      if (state.selType === 'link') {
        var L = graph.links.find(function (l) { return l.id === state.selected; });
        var s = L.source, t = L.target;
        var mc = D.flowMicrocopy[L.id] || D.flowMicrocopyFallback;
        html += '<div class="kind">' + (L.span === 'AB' ? 'Flow: buyer &rarr; category' : 'Flow: category &rarr; cost pool') + '</div>';
        html += '<div class="title">' + esc(s.label) + ' &rarr; ' + esc(t.label) + '</div>';
        html += '<div><span class="amount">' + fmt(L.value) + '</span> <span class="ev">' + pct(L.value, s.value) + ' of ' + esc(s.short || s.label) + '</span><span class="ev">' + pct(L.value, t.value) + ' of ' + esc(t.short || t.label) + '</span></div>';
        if (L.span === 'AB') {
          html += '<div class="flow-grid"><div><h5>Buyer logic</h5><p>' + esc(mc.payer) + '</p></div><div><h5>Recipient logic</h5><p>' + esc(mc.recipient) + '</p></div><div><h5>Structural tension</h5><p>' + esc(mc.tension) + '</p></div><div><h5>AI wedge</h5><p>' + esc(mc.wedge) + '</p></div></div>';
        } else {
          var w = D.destToPoolWeights[s.id] && D.destToPoolWeights[s.id][t.id];
          html += '<div class="flow-grid"><div><h5>What this stream funds</h5><p>' + esc(t.description) + '</p></div><div><h5>Why this share</h5><p>' + esc(Math.round(w * 100) + '% of ' + s.label.toLowerCase() + ' spend is allocated to this pool, from the benchmarks listed in the method.') + '</p></div><div><h5>Who captures it</h5><p>' + esc(t.leaders || '') + '</p></div></div>';
        }
        var wedges = (aiByNode[t.id] || []).concat(aiByNode[s.id] || []).filter(uniq);
        if (wedges.length) html += '<div style="margin-top:12px"><h5>AI wedges on this stream</h5>' + chipsOf(wedges, 'ai') + '</div>';
        var forces = (incByNode[t.id] || []).concat(incByNode[s.id] || []).filter(uniq);
        if (forces.length) html += '<div style="margin-top:12px"><h5>Forces on this stream</h5>' + chipsOf(forces, 'inc') + '</div>';
        html += '<div class="src">Flow value is modeled and constrained to both node totals.</div>';
      } else {
        var n = graph.nodes.find(function (x) { return x.id === state.selected; });
        var kind = n.layer === 0 ? 'Who pays' : n.layer === 1 ? 'What is bought' : 'What the dollars fund';
        html += '<div class="kind">' + kind + '</div><div class="title">' + esc(n.label) + '</div>';
        html += '<div><span class="amount">' + n.display + '</span><span class="ev ' + (n.evidence || 'modeled') + '">' + (n.evidence || 'modeled') + '</span>' + (n.year ? '<span class="ev">' + esc(n.year) + '</span>' : '') + '</div>';
        html += '<p>' + esc(n.description || '') + '</p>';
        if (n.note) html += '<p class="note">' + esc(n.note) + '</p>';
        if (n.leaders) html += '<p><b style="color:var(--mr-text)">Who captures it:</b> ' + esc(n.leaders) + '</p>';
        html += '<div class="grid">';
        if (n.layer === 0) {
          html += tableOf('Top destinations', n.sourceLinks.slice().sort(function (a, b) { return b.value - a.value; }).map(function (l) { return nodeRow(l.target, l.value, n.value); }));
          var pools = {}; n.sourceLinks.forEach(function (l) { var sh = l.value / l.target.value; l.target.sourceLinks.forEach(function (m) { pools[m.target.id] = (pools[m.target.id] || 0) + m.value * sh; }); });
          html += tableOf('Where it ends up (traced)', Object.keys(pools).sort(function (a, b) { return pools[b] - pools[a]; }).slice(0, 8).map(function (k) { return nodeRow(byId[k], pools[k], n.value); }));
        } else if (n.layer === 1) {
          html += tableOf('Who pays', n.targetLinks.slice().sort(function (a, b) { return b.value - a.value; }).map(function (l) { return nodeRow(l.source, l.value, n.value); }));
          html += tableOf('What it funds', n.sourceLinks.slice().sort(function (a, b) { return b.value - a.value; }).map(function (l) { return nodeRow(l.target, l.value, n.value); }));
        } else {
          html += tableOf('Fed by', n.targetLinks.slice().sort(function (a, b) { return b.value - a.value; }).map(function (l) { return nodeRow(l.source, l.value, n.value); }));
          var buyers = {}; n.targetLinks.forEach(function (l) { var sh = l.value / l.source.value; l.source.targetLinks.forEach(function (m) { buyers[m.source.id] = (buyers[m.source.id] || 0) + m.value * sh; }); });
          html += tableOf('Ultimately paid by (traced)', Object.keys(buyers).sort(function (a, b) { return buyers[b] - buyers[a]; }).slice(0, 8).map(function (k) { return nodeRow(byId[k], buyers[k], n.value); }));
        }
        html += '</div>';
        if (aiByNode[n.id]) html += '<div style="margin-top:14px"><h5>AI wedges attached</h5>' + chipsOf(aiByNode[n.id], 'ai') + '</div>';
        if (incByNode[n.id]) html += '<div style="margin-top:12px"><h5>Structural forces</h5>' + chipsOf(incByNode[n.id], 'inc') + '</div>';
        var cb = companiesBlock(n.id); if (cb) html += '<div style="margin-top:14px">' + cb + '</div>';
        html += '<div class="src">' + (n.src ? '<a href="' + n.src + '" target="_blank" rel="noopener">Source &#8599;</a> &middot; ' : '') + (n.layer === 0 ? 'Buyer total is the column sum of modeled shares of sourced category totals.' : n.layer === 1 ? 'Category total as sourced; routing to buyers and pools is modeled.' : 'Pool total is the sum of modeled decompositions of sourced category totals.') + '</div>';
      }
      drawer.innerHTML = html; drawer.hidden = false; wireLogos(drawer);
      drawer.querySelectorAll('[data-go]').forEach(function (td) { td.addEventListener('click', function () { selectNode(td.getAttribute('data-go')); }); });
      drawer.querySelectorAll('[data-ai]').forEach(function (b) { b.addEventListener('click', function () { setView('ai'); pinCard('ai', b.getAttribute('data-ai')); }); });
      drawer.querySelectorAll('[data-inc]').forEach(function (b) { b.addEventListener('click', function () { setView('incentives'); pinCard('inc', b.getAttribute('data-inc')); }); });
    }

    // ---- Views ---------------------------------------------------------
    var HINTS = {
      money: '<b>Click a flow</b> for buyer logic, recipient logic, the structural tension and the AI wedge. <b>Click a node</b> to trace its money through all three layers. Dashed nodes are modeled.',
      ai: 'Teal nodes have AI wedges attached; the badge counts them. <b>Hover a card</b> to see where a wedge lands, <b>click a node</b> for the list.',
      incentives: 'Highlighted nodes are where a structural force acts. Pull raises demand or lowers price; friction adds cost or blocks flow.',
      companies: 'Badges count named companies per node; purple badges include DVC portfolio companies. <b>Click a node</b> for incumbents vs AI-native.'
    };
    function setView(v) {
      state.view = v;
      el.querySelectorAll('[data-view]').forEach(function (b) { b.setAttribute('aria-checked', b.getAttribute('data-view') === v ? 'true' : 'false'); });
      dvcBtn.hidden = v !== 'companies';
      applyView();
    }
    function applyView() {
      svgEl.setAttribute('class', 'view-' + state.view);
      $('overlay-ai').hidden = state.view !== 'ai';
      $('overlay-inc').hidden = state.view !== 'incentives';
      $('overlay-co').hidden = state.view !== 'companies';
      $('hint').innerHTML = HINTS[state.view];
      if (state.selType === 'node' && !drawer.hidden) renderDrawer();
    }
    el.querySelectorAll('[data-view]').forEach(function (b) { b.addEventListener('click', function () { setView(b.getAttribute('data-view')); }); });
    dvcBtn.addEventListener('click', function () {
      state.dvcOnly = !state.dvcOnly; dvcBtn.setAttribute('aria-pressed', state.dvcOnly ? 'true' : 'false');
      if (state.selType === 'node') renderDrawer();
    });

    // ---- Overlay cards -------------------------------------------------
    function attachIds(x) { return x.attach || (x.attach_pools || []).concat(x.attach_dests || []); }
    function cardHTML(x, cls) {
      var attach = attachIds(x).map(function (k) { return byId[k] ? (byId[k].short || byId[k].label) : k; });
      var dvc = x.dvc ? '<div class="dvc">DVC: ' + x.dvc.map(function (n) { return '<span class="mr-dvc-co">' + logos(n) + esc(n) + '</span>'; }).join(', ') + '</div>' : '';
      var tone = x.tone ? '<span class="tone ' + x.tone + '">' + x.tone + '</span>' : '';
      return '<div class="mr-ocard ' + cls + '" tabindex="0" data-' + cls + '-id="' + x.id + '"><div class="n">' + esc(x.label) + tone + '</div><div class="d">' + esc(x.what || x.body) + '</div>' + (x.adoption ? '<div class="a">' + esc(x.adoption) + '</div>' : '') + '<div class="a">Attaches to: ' + esc(attach.join(', ')) + '</div>' + dvc + '</div>';
    }
    $('ai-cards').innerHTML = D.aiSurfaces.map(function (a) { return cardHTML(a, 'ai'); }).join('');
    $('inc-cards').innerHTML = D.incentives.map(function (i) { return cardHTML(i, 'inc'); }).join('');
    wireLogos($('ai-cards'));
    function itemOf(cls, k) { return (cls === 'ai' ? D.aiSurfaces : D.incentives).find(function (x) { return x.id === k; }); }
    function highlightNodes(ids) {
      clearHighlight();
      var set = {}; ids.forEach(function (i) { set[i] = true; });
      nodeSel.classed('is-dim', function (n) { return !set[n.id]; }).classed('is-hi', function (n) { return set[n.id]; });
      linkSel.classed('is-dim', true);
    }
    function pinCard(cls, k) {
      state.pinned = cls + ':' + k;
      el.querySelectorAll('.mr-ocard.is-on').forEach(function (c) { c.classList.remove('is-on'); });
      var card = el.querySelector('.mr-ocard[data-' + cls + '-id="' + k + '"]');
      if (card) { card.classList.add('is-on'); card.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
      highlightNodes(attachIds(itemOf(cls, k)));
      resetBtn.hidden = false;
    }
    ['ai', 'inc'].forEach(function (cls) {
      el.querySelectorAll('.mr-ocard.' + cls).forEach(function (card) {
        var k = card.getAttribute('data-' + cls + '-id');
        var item = itemOf(cls, k);
        card.addEventListener('mouseenter', function () { if (!state.pinned) highlightNodes(attachIds(item)); });
        card.addEventListener('mouseleave', function () { if (!state.pinned) { if (state.selected) applyHighlight(); else clearHighlight(); } });
        card.addEventListener('click', function () {
          if (state.pinned === cls + ':' + k) { state.pinned = null; card.classList.remove('is-on'); if (state.selected) applyHighlight(); else clearHighlight(); }
          else pinCard(cls, k);
        });
        card.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); card.click(); } });
      });
    });

    render();
    el.setAttribute('data-mr-id', id);
  }

  root.MoneyRiver = { mount: mount };
})(window);
