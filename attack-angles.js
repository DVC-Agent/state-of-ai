/* === Three Attack Angles on the Services Map ===
 * Single source of truth. Used by index.html (in #attack-angles-block) and slides.html (slide 15).
 */
(function () {
  'use strict';

  const ANGLES = [
    {
      key: 'saas',
      title: 'Software to incumbents',
      tagline: 'Sell software to the people doing the work.',
      glyph: 'stack',
      color: '#4CB5AB',
      when: 'Buyers can adopt software · workflows repeat',
      badWhen: 'Weak distribution or low willingness to pay',
      customer: 'The service provider',
      capital: { label: 'Primarily equity · inference and working capital matter', dots: 2 },
      pricing: 'Seat + usage hybrid',
      marginEconomics: 'Inference, support and human review reduce software margins',
      profitability: 'Depends on pricing, retention and delivery cost; no universal EBITDA band',
      comps: [
        { name: 'Harvey',        detail: 'Legal software for law firms and in-house teams' },
        { name: 'Legora',        detail: 'Harvey’s direct European competitor' },
        { name: 'ServiceTitan',  detail: 'NASDAQ: TTAN' },
        { name: 'ServiceNow Otto', detail: 'May 2026' },
        { name: 'Agentforce',    detail: 'pay-per-resolution GA' }
      ],
      dvc: [
        { name: 'Avoca',              detail: 'AI comms · SMB services' },
        { name: 'Kick',               detail: 'Self-driving bookkeeping' },
        { name: 'PermitFlow',         detail: 'Construction permitting' },
        { name: 'FleetWorks',         detail: 'AI voice · freight' },
        { name: 'Hona AI',            detail: 'Clinical notes' },
        { name: 'Solve Intelligence', detail: 'Patent drafting' },
        { name: 'Docdraft',           detail: 'Legal drafting' },
        { name: 'Docsum',             detail: 'Contract negotiation' },
        { name: 'Eloquent AI',        detail: 'Financial services AI' }
      ]
    },
    {
      key: 'vertical',
      title: 'Vertical agentic operator',
      tagline: 'Replace the service. Sell the outcome.',
      glyph: 'arrow',
      color: '#4CB5AB',
      when: 'Own the deliverable · reachable customers · repeatable work',
      badWhen: 'Unpriced liability or expensive human exceptions',
      customer: 'The end customer',
      capital: { label: 'Equity; debt where cash flows support it', dots: 3 },
      pricing: 'Outcome / per-task',
      marginEconomics: 'Price the outcome, including exceptions, liability and human delivery',
      profitability: 'Automation can improve margins, but service responsibility is not optional',
      comps: [
        { name: 'Crosby',     detail: 'AI-native law firm for commercial contracts' },
        { name: 'Amperos',    detail: 'AI-enabled billing service for healthcare providers' },
        { name: 'Unlimited Industries', detail: 'AI-native civil engineering; engineer of record' },
      ],
      dvc: [
        { name: 'Doctronic', detail: 'AI consultations plus clinician delivery through Summer Health' }
      ]
    },
    {
      key: 'rollup',
      title: 'Agentic rollup',
      tagline: 'Buy the business. Improve delivery. Reinvest durable cash flow.',
      glyph: 'rollup',
      color: '#4CB5AB',
      when: 'Fragmented · sticky client relationships',
      badWhen: 'Concentrated market or low operating leverage',
      customer: 'You become the service provider',
      capital: { label: 'Equity + Debt · acquisition leverage', dots: 3 },
      pricing: 'Own the P&L · price the work',
      marginEconomics: 'Consolidated service COGS remain; improvement must be demonstrated',
      profitability: 'Test organic cash conversion and debt service, not a blanket EBITDA target',
      comps: [
        { name: 'Dwelly',     detail: 'Property-management rollup', dvc: true },
        { name: 'Crete',      detail: 'Accounting rollup' },
        { name: 'Long Lake',  detail: 'HOA management rollup' },
        { name: 'Eudia',      detail: 'In-house legal' },
        { name: 'Titan + RFA', detail: 'IT managed services' },
        { name: 'Metropolis', detail: 'Parking operations' }
      ],
      dvc: [
        { name: 'Dwelly', detail: 'UK property-management rollup', link: 'fleetworks' },
        { name: 'Fura',   detail: 'Digital freight broker · uses FleetWorks', link: 'fleetworks' }
      ]
    }
  ];

  // ── Aug 3, 2026 context bands ──
  // Two things changed the competitive picture for the angles without changing
  // the angles themselves: the rollup arbitrage is now a funded contest, and the
  // model layer entered implementation services directly.
  const CONTEXT = {
    rollupContest: {
      tag: 'THE ROLLUP ARBITRAGE IS NOW A FUNDED CONTEST',
      body: 'Acquiring a relationship-heavy service business can buy distribution, customer contracts and cash flow. Automation can improve delivery economics, but acquisition prices, integration expense, human exception handling and debt service determine whether value is created. Higher cash flow can support more debt only if lenders accept its durability; the leverage loop is not automatic.'
    },
    modelLayerServices: {
      tag: 'MARKET STRUCTURE IS A HEURISTIC, NOT A LAW',
      body: 'Concentration alone does not determine the winning strategy. Bessemer’s AI-native services framework also identifies fragmented supply as an entry advantage. The useful tests are distribution, ownership of delivery, measurable quality, regulatory responsibility and whether the company can retain the automation surplus.'
    },
    disclosure: 'Evidence cut: October 16, 2026. No strategy-wide gross-margin or EBITDA bands are asserted. <a href="https://www.bvp.com/atlas/the-ai-pricing-and-monetization-playbook" target="_blank" rel="noopener noreferrer">Pricing evidence</a> · <a href="https://www.bvp.com/atlas/owning-the-outcome-bessemer-s-ai-native-services-evaluation-framework" target="_blank" rel="noopener noreferrer">Services framework</a>. Outcomes pricing alone does not turn a software platform into a service operator.'
  };

  function contextHTML(compact) {
    const cls = compact ? ' aa-context--compact' : '';
    return `
      <div class="aa-context${cls}">
        <div class="aa-context-card aa-context-card--rollup">
          <span class="aa-context-tag">${CONTEXT.rollupContest.tag}</span>
          <p class="aa-context-body">${CONTEXT.rollupContest.body}</p>
        </div>
        <div class="aa-context-card aa-context-card--model">
          <span class="aa-context-tag">${CONTEXT.modelLayerServices.tag}</span>
          <p class="aa-context-body">${CONTEXT.modelLayerServices.body}</p>
        </div>
      </div>
      <p class="aa-context-note">${CONTEXT.disclosure}</p>
    `;
  }

  // SVG glyphs for column headers
  const GLYPHS = {
    stack: '<svg viewBox="0 0 60 60" width="48" height="48" aria-hidden="true"><rect x="10" y="14" width="40" height="8" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="10" y="26" width="40" height="8" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="10" y="38" width="40" height="8" rx="2" fill="currentColor" opacity="0.18" stroke="currentColor" stroke-width="2"/></svg>',
    arrow: '<svg viewBox="0 0 60 60" width="48" height="48" aria-hidden="true"><circle cx="30" cy="30" r="20" fill="none" stroke="currentColor" stroke-width="2" opacity="0.45"/><path d="M 8 30 L 50 30 M 42 22 L 50 30 L 42 38" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    rollup: '<svg viewBox="0 0 60 60" width="48" height="48" aria-hidden="true"><rect x="6" y="10" width="14" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2" opacity="0.55"/><rect x="6" y="36" width="14" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2" opacity="0.55"/><rect x="40" y="10" width="14" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2" opacity="0.55"/><rect x="22" y="22" width="22" height="16" rx="3" fill="currentColor" opacity="0.18" stroke="currentColor" stroke-width="2"/><path d="M 20 17 L 24 25 M 20 43 L 24 35 M 40 17 L 36 25" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 2"/></svg>'
  };

  function dotMeter(filled) {
    let s = '';
    for (let i = 0; i < 3; i++) {
      s += `<span class="aa-dot${i < filled ? ' aa-dot--on' : ''}"></span>`;
    }
    return s;
  }

  function chipsHTML(items, accent) {
    return items.map(c => `
      <div class="aa-chip${c.dvc ? ' aa-chip--dvc' : ''}" style="--aa-accent:${accent}">
        <span class="aa-chip-name">${c.name}${c.dvc ? ' <span class="aa-dvc-pill">DVC</span>' : ''}</span>
        <span class="aa-chip-detail">${c.detail}</span>
      </div>
    `).join('');
  }

  function dvcChipsHTML(items, accent) {
    return items.map(c => `
      <div class="aa-chip aa-chip--dvc${c.link ? ' aa-chip--linked' : ''}" data-link="${c.link || ''}" style="--aa-accent:${accent}">
        <span class="aa-chip-name">${c.name}<span class="aa-dvc-pill">DVC</span></span>
        <span class="aa-chip-detail">${c.detail}</span>
      </div>
    `).join('');
  }

  function render(target) {
    const el = (typeof target === 'string') ? document.getElementById(target) : target;
    if (!el) return;
    if (el.dataset.aaRendered === '1') return;

    el.innerHTML = `
      <div class="aa-header">
        <h3 class="aa-title">Three angles of attack on the services map.</h3>
        <p class="aa-sub">Market structure informs the strategy. Distribution, delivery responsibility and economics decide whether it works.</p>
      </div>
      <div class="aa-grid">
        ${ANGLES.map(a => `
          <article class="aa-col" data-angle="${a.key}" style="--aa-accent:${a.color}">
            <header class="aa-col-head">
              <div class="aa-glyph">${GLYPHS[a.glyph]}</div>
              <h4 class="aa-col-title">${a.title}</h4>
              <p class="aa-col-tagline">${a.tagline}</p>
            </header>

            <dl class="aa-rows">
              <div class="aa-row">
                <dt>Customer</dt>
                <dd><strong>${a.customer}</strong></dd>
              </div>
              <div class="aa-row">
                <dt>Best when</dt>
                <dd class="aa-best">${a.when}</dd>
              </div>
              <div class="aa-row">
                <dt>Bad when</dt>
                <dd class="aa-bad">${a.badWhen}</dd>
              </div>
              <div class="aa-row">
                <dt>Capital</dt>
                <dd>
                  <span class="aa-meter" aria-label="Capital intensity">${dotMeter(a.capital.dots)}</span>
                  <span class="aa-meter-label">${a.capital.label}</span>
                </dd>
              </div>
              <div class="aa-row">
                <dt>Pricing</dt>
                <dd>${a.pricing}</dd>
              </div>
              <div class="aa-row"><dt>Economics</dt><dd>${a.marginEconomics}</dd></div>
              <div class="aa-row"><dt>Profitability</dt><dd>${a.profitability}</dd></div>
              <div class="aa-row aa-row--chips">
                <dt>Comps</dt>
                <dd class="aa-chips">${chipsHTML(a.comps, a.color)}</dd>
              </div>
              <div class="aa-row aa-row--chips">
                <dt>DVC plays</dt>
                <dd class="aa-chips aa-chips--dvc">${dvcChipsHTML(a.dvc, a.color)}</dd>
              </div>
            </dl>
          </article>
        `).join('')}
      </div>
      ${contextHTML(false)}
      <p class="aa-footer">
        <strong>Choose the responsibility.</strong> Selling a tool, delivering a service and owning an acquired business are different operating models.
        <span class="aa-footer-note">Inside DVC: <strong>Fura</strong> (rollup) uses <strong>FleetWorks</strong> (SaaS) for its AI voice layer &mdash; the portfolio compounds.</span>
      </p>
    `;
    el.dataset.aaRendered = '1';
  }

  // Compact stage-only renderer: 3 illustrative cards, no chip-dump.
  // Speech: "do not read every company in the table now; point is the lens."
  function renderStage(target) {
    const el = (typeof target === 'string') ? document.getElementById(target) : target;
    if (!el) return;
    if (el.dataset.aaStageRendered === '1') return;

    el.innerHTML = `
      <div class="aa-stage-cards">
        ${ANGLES.map(a => `
          <article class="aa-stage-card" style="--aa-accent:${a.color}">
            <header class="aa-stage-card-head">
              <div class="aa-stage-glyph">${GLYPHS[a.glyph]}</div>
              <h4 class="aa-stage-card-title">${a.title}</h4>
              <p class="aa-stage-card-tagline">${a.tagline}</p>
            </header>
            <ul class="aa-stage-facts">
              <li><span class="aa-stage-fact-label">Customer</span><span class="aa-stage-fact-value">${a.customer}</span></li>
              <li><span class="aa-stage-fact-label">Best when</span><span class="aa-stage-fact-value">${a.when}</span></li>
              <li><span class="aa-stage-fact-label">Pricing</span><span class="aa-stage-fact-value">${a.pricing}</span></li>
              <li><span class="aa-stage-fact-label">Capital</span><span class="aa-stage-fact-value">${a.capital.label}</span></li>
              <li><span class="aa-stage-fact-label">Economics</span><span class="aa-stage-fact-value">${a.marginEconomics}</span></li>
            </ul>
            <div class="aa-stage-examples">
              <span class="aa-stage-examples-label">Examples</span>
              <span class="aa-stage-examples-list">${a.comps.slice(0, 3).map(c => c.name).join(' · ')}</span>
            </div>
            <div class="aa-stage-dvc">
              <span class="aa-stage-examples-label">DVC examples</span>
              <span class="aa-stage-examples-list">${a.dvc.slice(0, 4).map(c => c.name).join(' · ')}</span>
            </div>
          </article>
        `).join('')}
      </div>
      ${contextHTML(true)}
      <p class="aa-stage-footer">Market structure is a starting hypothesis, not a deterministic rule. <span class="aa-stage-footer-note">Fura uses FleetWorks. Full company map and sources in the report.</span></p>
    `;
    el.dataset.aaStageRendered = '1';
  }

  // Expose globally so both index.html and slides.html can call it.
  window.ATTACK_ANGLES = { ANGLES, CONTEXT, render, renderStage };

  // Auto-render if a default container is present in the page.
  function autoRender() {
    var reportTarget = document.getElementById('attack-angles-block');
    if (reportTarget && reportTarget.dataset.aaMode === 'stage') renderStage(reportTarget);
    else render('attack-angles-block');
    renderStage('attack-angles-stage');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoRender);
  } else {
    autoRender();
  }
})();
