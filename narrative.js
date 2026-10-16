(function () {
  'use strict';
  var M = window.NARRATIVE_DATA.metrics;
  // Hydrate generated fallbacks as well as interactive renderings from the current records.
  document.querySelectorAll('[data-metric]').forEach(function(el){var m=M[el.dataset.metric];if(m)el.textContent=m.display;});
  document.querySelectorAll('.metric-card[data-fact]').forEach(function(el){
    var m=M[el.dataset.fact];if(!m)return;
    el.setAttribute('aria-label',m.label+': '+m.display+'. Open evidence.');
    [['.metric-name','label'],['.metric-period','period'],['.metric-qualifier','qualifier']].forEach(function(pair){var node=el.querySelector(pair[0]);if(node)node.textContent=m[pair[1]];});
  });
  var report = document.getElementById('report-content');
  var dialog = document.getElementById('metric-dialog');
  var previousFocus = null;
  var tip = document.createElement('div');
  tip.className = 'fact-tooltip'; tip.hidden = true; tip.setAttribute('role', 'tooltip');
  document.body.appendChild(tip);
  function escape(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function(c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function setMode(expanded) {
    if (report) report.querySelectorAll('details.rabbit-hole').forEach(function(d) { d.open = expanded; });
    document.querySelectorAll('[data-reading-mode]').forEach(function(b) {
      b.setAttribute('aria-pressed', String((b.dataset.readingMode === 'explore') === expanded));
    });
    tip.hidden = true;
    window.dispatchEvent(new Event('resize'));
  }
  document.querySelectorAll('[data-reading-mode]').forEach(function(b) { b.addEventListener('click', function() { setMode(b.dataset.readingMode === 'explore'); }); });
  var closeAll = document.getElementById('collapseAllRail');
  if (closeAll) closeAll.addEventListener('click', function() { setMode(false); });
  function revealTarget(hash, instant) {
    var id;
    try { id = decodeURIComponent(hash.slice(1)); } catch (_) { return; }
    var aliases = window.NARRATIVE_DATA.legacyAnchors || {};
    var target = document.getElementById(aliases[id] || id);
    if (!target) return;
    for (var node = target; node; node = node.parentElement) if (node.tagName === 'DETAILS') node.open = true;
    requestAnimationFrame(function() { target.scrollIntoView({behavior:instant || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto':'smooth',block:'start'}); });
  }
  document.querySelectorAll('a[href^="#"]').forEach(function(a) { a.addEventListener('click', function(e) { e.preventDefault();history.pushState(null,'',a.hash);revealTarget(a.hash); }); });
  window.addEventListener('hashchange', function() { revealTarget(location.hash); });
  if (location.hash) revealTarget(location.hash, true);
  document.querySelectorAll('details.rabbit-hole').forEach(function(d) { d.addEventListener('toggle', function() { requestAnimationFrame(function() { window.dispatchEvent(new Event('resize')); }); }); });
  var mobile = document.getElementById('mobile-chapters');
  if (mobile) mobile.addEventListener('change', function() { history.pushState(null,'','#'+mobile.value);revealTarget('#'+mobile.value,true); });
  if (report && window.IntersectionObserver) {
    var observer = new IntersectionObserver(function(entries) {
      var current = entries.filter(function(e) { return e.isIntersecting; }).sort(function(a,b) { return a.boundingClientRect.top-b.boundingClientRect.top; })[0];
      if (!current) return;
      var id = current.target.id;
      document.querySelectorAll('.chapter-rail a').forEach(function(a) { if (a.hash === '#'+id) a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current'); });
      if (mobile) mobile.value = id;
    }, {rootMargin:'-15% 0px -65% 0px',threshold:0});
    report.querySelectorAll('.narrative-chapter').forEach(function(s) { observer.observe(s); });
  }
  function showFact(key, trigger) {
    var m = M[key]; if (!m || !dialog) return;
    previousFocus = trigger || document.activeElement; tip.hidden = true;
    dialog.querySelector('.metric-dialog-content').innerHTML =
      '<p class="chapter-kicker">Evidence record</p><h2>'+escape(m.label)+'</h2>'+
      '<span class="metric-value" data-metric="'+escape(key)+'">'+escape(m.display)+'</span>'+
      '<p>'+escape(m.detail || m.qualifier)+'</p><dl><dt>Period / observation</dt><dd>'+escape(m.period)+'</dd>'+
      '<dt>Disclosure date</dt><dd>'+escape(m.asOf)+'</dd><dt>Evidence type</dt><dd>'+escape(m.type)+'</dd>'+
      '<dt>Scope and limitations</dt><dd>'+escape(m.qualifier)+'</dd></dl>'+
      '<p><a href="'+escape(m.url)+'" target="_blank" rel="noopener noreferrer">Open '+escape(m.source)+'</a></p>'+
      '<code class="source-address">'+escape(m.url)+'</code><button type="button" class="copy-source">Copy source URL</button><p class="copy-status" aria-live="polite"></p>';
    dialog.showModal();
    dialog.querySelector('.copy-source').addEventListener('click', async function() {
      var status = dialog.querySelector('.copy-status');
      try { await navigator.clipboard.writeText(m.url); status.textContent = 'Source URL copied.'; }
      catch (_) { status.textContent = 'Select the full URL above to copy it manually.'; }
    });
  }
  document.querySelectorAll('[data-fact]').forEach(function(el) {
    var key = el.dataset.fact, m = M[key]; if (!m) return;
    el.addEventListener('click', function() { showFact(key,el); });
    el.addEventListener('mouseenter', function() {
      if (!window.matchMedia('(hover: hover)').matches) return;
      tip.innerHTML = '<strong>'+escape(m.display)+'</strong>'+escape(m.label)+' · '+escape(m.period)+'<br>'+escape(m.qualifier)+'<br>Click for the source and method.';
      tip.hidden = false;
      var r = el.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
      tip.style.left = Math.max(16,Math.min(innerWidth-w-16,r.left))+'px';
      tip.style.top = (r.bottom+h+12<innerHeight ? r.bottom+8 : Math.max(16,r.top-h-8))+'px';
    });
    el.addEventListener('mouseleave', function() { tip.hidden = true; });
    el.addEventListener('blur', function() { tip.hidden = true; });
  });
  if (dialog) {
    dialog.querySelector('.dialog-close').addEventListener('click', function() { dialog.close(); });
    dialog.addEventListener('click', function(e) { if (e.target === dialog) { var r=dialog.getBoundingClientRect(); if(e.clientX<r.left) dialog.close(); } });
    dialog.addEventListener('close', function() { if (previousFocus) previousFocus.focus({preventScroll:true}); });
  }
  window.addEventListener('scroll',function(){tip.hidden=true;},{passive:true});
  // Agent layer accordion: semantic controls with correctly serialized states.
  document.querySelectorAll('.aa-layer').forEach(function(layer) {
    var bar = layer.querySelector('.aa-layer-bar'), panel = layer.querySelector('.aa-layer-detail');
    if (!bar || !panel) return;
    bar.setAttribute('role','button');bar.setAttribute('tabindex','0');bar.setAttribute('aria-expanded','false');
    panel.id = 'agent-layer-'+layer.dataset.layer;bar.setAttribute('aria-controls',panel.id);
    function toggle() {
      var expanded = !layer.classList.contains('aa-layer--expanded');
      document.querySelectorAll('.aa-layer').forEach(function(l) { l.classList.remove('aa-layer--expanded');l.querySelector('.aa-layer-bar').setAttribute('aria-expanded','false'); });
      layer.classList.toggle('aa-layer--expanded',expanded);bar.setAttribute('aria-expanded',String(expanded));
    }
    bar.addEventListener('click',toggle);bar.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});
  });
  if (window.SERVICES_MATRIX && document.getElementById('seq-matrix-mount')) window.SERVICES_MATRIX.render('seq-matrix-mount');
  if (window.ATTACK_ANGLES && document.getElementById('attack-angles-block')) window.ATTACK_ANGLES.renderStage('attack-angles-block');
  // Shared exploration affordance. No hover-only dependency, including on the deck map.
  window.bindExplorerTips = function(scope) {
    (scope || document).querySelectorAll('[data-tip]').forEach(function(el) {
      if(el.dataset.explorerBound)return;
      el.dataset.explorerBound='true';el.tabIndex=0;el.setAttribute('role','button');
      function open() {
        if(!dialog)return;
        previousFocus=el;tip.hidden=true;
        dialog.querySelector('.metric-dialog-content').innerHTML='<div class="explorer-dialog-content">'+el.getAttribute('data-tip')+'</div>';
        dialog.querySelectorAll('.explorer-dialog-content a[href^="http"]').forEach(function(a){
          a.target='_blank';a.rel='noopener noreferrer';
          var url=document.createElement('code');url.className='source-address';url.textContent=a.href;a.after(url);
        });
        dialog.showModal();
      }
      el.addEventListener('click',open);
      el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
      el.addEventListener('mouseenter',function(){
        if(!window.matchMedia('(hover:hover)').matches)return;
        tip.textContent=el.textContent.trim()+'. Click to inspect the full evidence and company examples.';
        tip.hidden=false;var r=el.getBoundingClientRect();
        tip.style.left=Math.max(16,Math.min(innerWidth-tip.offsetWidth-16,r.left))+'px';
        tip.style.top=Math.min(innerHeight-tip.offsetHeight-16,r.bottom+8)+'px';
      });
      el.addEventListener('mouseleave',function(){tip.hidden=true;});
    });
  };
  window.bindExplorerTips(document);
  // The source register supplies both chart values and the mouseover explanations.
  var controls = document.getElementById('capex-controls');
  var issuers = window.NARRATIVE_DATA.capex || [];
  if (controls) {
    var included = new Set(issuers.map(function(i){return i.key;}));
    controls.innerHTML = issuers.map(function(i){return '<button type="button" data-company="'+i.key+'" aria-pressed="true">'+escape(i.name)+'</button>';}).join('');
    function drawCapex() {
      var sum=0,low=0,high=0;
      document.getElementById('capex-bars').innerHTML = issuers.map(function(i) {
        var enabled=included.has(i.key);if(enabled){sum+=i.mid;low+=i.low;high+=i.high;}
        return '<div class="capex-bar-row'+(enabled?'':' is-excluded')+'"><span>'+escape(i.name)+'</span><div class="capex-bar-track"><div class="capex-bar-fill" style="width:'+((enabled?i.mid:0)/220*100)+'%"></div></div><span title="'+escape(M[i.metric].qualifier)+'">$'+i.mid+'B</span></div>';
      }).join('');
      document.getElementById('capex-sum').textContent='$'+sum.toLocaleString('en-US',{maximumFractionDigits:1})+'B';
      document.getElementById('capex-range').textContent='$'+low+'-'+high+'B range';
      controls.querySelectorAll('button').forEach(function(b){b.setAttribute('aria-pressed',String(included.has(b.dataset.company)));});
    }
    controls.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var k=b.dataset.company;included.has(k)?included.delete(k):included.add(k);drawCapex();});
    drawCapex();
  }
  window.NARRATIVE_QA = {
    auditMetrics: function() {
      return Array.from(document.querySelectorAll('[data-metric]')).filter(function(el) { return !M[el.dataset.metric] || el.textContent.trim() !== M[el.dataset.metric].display; }).map(function(el){return {key:el.dataset.metric,actual:el.textContent.trim(),expected:M[el.dataset.metric]&&M[el.dataset.metric].display};});
    },
    chapterIds: Array.from(document.querySelectorAll('.narrative-chapter')).map(function(s){return s.id;}),
    openFact: showFact
  };
})();
