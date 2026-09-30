(function() {
  'use strict';

  /* === Portfolio Data === */
  const companies = [
    {n:"Perplexity",d:"AI-native answer engine",c:"apps",g:"apps-consumer",f:true},
    {n:"Animation",d:"Real-time generative animation",c:"media",g:"apps-consumer",f:true},
    {n:"Skim.ai",d:"AI-powered collaborative reading",c:"apps",g:"apps-consumer",f:false},
    {n:"HyperC",d:"AI for Amazon wholesale optimization",c:"commerce",g:"apps-consumer",f:false},
    {n:"Firmly",d:"Distributed commerce solution",c:"commerce",g:"apps-consumer",f:false},
    {n:"Bina School",d:"Digital-age K-6 education",c:"edtech",g:"apps-consumer",f:false},
    {n:"Pervasive App",d:"AI-driven notes app",c:"apps",g:"apps-consumer",f:false},
    {n:"Howie AI",d:"AI email scheduling assistant",c:"apps",g:"apps-consumer",f:false},
    {n:"Aurora First",d:"AI family assistant for parents",c:"apps",g:"apps-consumer",f:false},
    {n:"Jome",d:"Marketplace for new construction",c:"commerce",g:"apps-consumer",f:false},
    {n:"Pinscreen",d:"Gen AI for movie VFX & dubbing",c:"media",g:"apps-consumer",f:false},
    {n:"Promethean AI",d:"AI for virtual world creation",c:"media",g:"apps-consumer",f:false},
    {n:"BerryApp",d:"Multiplayer Chrome extension",c:"apps",g:"apps-consumer",f:false},
    {n:"Beacons",d:"Creator business tools",c:"commerce",g:"apps-consumer",f:false},
    {n:"GPU Audio",d:"Cloud collaboration for audio",c:"media",g:"apps-consumer",f:false},
    {n:"Dwelly",d:"AI-powered property management",c:"commerce",g:"apps-consumer",f:true},

    {n:"PermitFlow",d:"AI construction permitting",c:"enterprise",g:"enterprise-saas",f:true},
    {n:"Humand",d:"All-in-one HR & internal comms",c:"enterprise",g:"enterprise-saas",f:true},
    {n:"Kick",d:"Self-driving bookkeeping",c:"fintech",g:"enterprise-saas",f:true},
    {n:"Parafin",d:"Embedded capital for platforms",c:"fintech",g:"enterprise-saas",f:true},
    {n:"Eloquent AI",d:"AI Operator for Financial Services",c:"fintech",g:"enterprise-saas",f:false},
    {n:"Unreal Labs",d:"AI Agent for Performance Marketing",c:"marketing",g:"enterprise-saas",f:false},
    {n:"Wrkdn",d:"Automated business process improvement",c:"enterprise",g:"enterprise-saas",f:false},
    {n:"Docdraft",d:"AI-assisted legal drafting",c:"legal",g:"enterprise-saas",f:false},
    {n:"The Forecasting Company",d:"Foundation model for time series",c:"enterprise",g:"enterprise-saas",f:false},
    {n:"Keye",d:"AI due diligence for PE investors",c:"fintech",g:"enterprise-saas",f:false},
    {n:"Avoca",d:"AI communications for SMBs",c:"enterprise",g:"enterprise-saas",f:true},
    {n:"Realytics",d:"Consumer intelligence & benchmarking",c:"marketing",g:"enterprise-saas",f:false},
    {n:"tely.ai",d:"AI agent for B2B content marketing",c:"marketing",g:"enterprise-saas",f:false},
    {n:"Aglide",d:"SaaS account management",c:"enterprise",g:"enterprise-saas",f:false},
    {n:"FleetWorks",d:"AI voice for freight industry",c:"logistics",g:"enterprise-saas",f:true},
    {n:"Docsum",d:"AI sales contract negotiation",c:"legal",g:"enterprise-saas",f:false},
    {n:"Generative Alpha",d:"AI financial investment agent",c:"fintech",g:"enterprise-saas",f:false},
    {n:"Solve Intelligence",d:"AI editor for patent writers",c:"legal",g:"enterprise-saas",f:true},
    {n:"Aviary AI",d:"AI credit rebuilding & defi lending",c:"fintech",g:"enterprise-saas",f:false},
    {n:"JustPaid.io",d:"AI-powered financial controller",c:"fintech",g:"enterprise-saas",f:false},
    {n:"Vasco",d:"Growth platform for startups",c:"enterprise",g:"enterprise-saas",f:false},
    {n:"Agentnoon",d:"Collaborative people planning",c:"enterprise",g:"enterprise-saas",f:false},
    {n:"Intento",d:"Machine translation hub",c:"enterprise",g:"enterprise-saas",f:false},
    {n:"RemoFirst",d:"Global payroll & HR compliance",c:"enterprise",g:"enterprise-saas",f:false},
    {n:"Fura",d:"Digital freight broker",c:"logistics",g:"enterprise-saas",f:false},
    {n:"Motives",d:"AI qualitative research platform",c:"marketing",g:"enterprise-saas",f:false},
    {n:"Sybilion",d:"AI predictions for supply chain",c:"logistics",g:"enterprise-saas",f:false},
    {n:"Zinit",d:"AI B2B procurement platform",c:"enterprise",g:"enterprise-saas",f:false},

    {n:"Qualified Health",d:"Generative AI at the Speed of Trust",c:"health",g:"health-biotech",f:true},
    {n:"Bioptic",d:"Molecular search engine (DNN)",c:"health",g:"health-biotech",f:true},
    {n:"Lovi",d:"AI-driven skincare app",c:"health",g:"health-biotech",f:false},
    {n:"Doctronic",d:"AI medical consultation",c:"health",g:"health-biotech",f:true},
    {n:"FitWise",d:"3D pose estimation for fitness",c:"health",g:"health-biotech",f:false},
    {n:"Kerna Laboratorie",d:"ML for genetic medicines",c:"health",g:"health-biotech",f:false},
    {n:"Hona AI",d:"Health Records AI for clinical notes",c:"health",g:"health-biotech",f:false},
    {n:"Red Sky Health",d:"ML for reducing insurance denials",c:"health",g:"health-biotech",f:false},
    {n:"Curex",d:"AI allergy treatments",c:"health",g:"health-biotech",f:false},
    {n:"Collectly",d:"Healthcare patient billing",c:"health",g:"health-biotech",f:false},
    {n:"NutriSense",d:"Personal nutrition with CGMs",c:"health",g:"health-biotech",f:false},
    {n:"Denti.ai",d:"AI diagnostics for dental X-rays",c:"health",g:"health-biotech",f:false},
    {n:"Asylia Dx",d:"Diagnostics for safer immunotherapy",c:"health",g:"health-biotech",f:false},

    {n:"Higgsfield",d:"AI video generation",c:"media",g:"apps-consumer",f:true},
    {n:"Etched",d:"Chips for transformer inference",c:"compute",g:"ai-infra",f:true},
    {n:"Wabi",d:"Generative interfaces for AI age",c:"devtools",g:"ai-infra",f:true},
    {n:"DoubleFifth",d:"Account linking & insights API",c:"infra",g:"ai-infra",f:false},
    {n:"superglu",d:"Self-healing data connectors",c:"infra",g:"ai-infra",f:false},
    {n:"CopilotKit",d:"Agent-native UI framework (AGUI)",c:"agents",g:"ai-infra",f:true},
    {n:"Zencoder",d:"AI-driven code tools (Repo Grokking)",c:"devtools",g:"ai-infra",f:false},
    {n:"The Stage AI",d:"Model optimization platform",c:"infra",g:"ai-infra",f:false},
    {n:"HackerPulse",d:"Developer analytics platform",c:"devtools",g:"ai-infra",f:false},
    {n:"Makini",d:"Unified API for industrial systems",c:"infra",g:"ai-infra",f:false},
    {n:"Eternis Labs",d:"Infrastructure for AI agent identity",c:"agents",g:"ai-infra",f:false},
    {n:"Paradigm",d:"Agent swarms for data & action",c:"agents",g:"ai-infra",f:false},
    {n:"Sutro",d:"AI-powered software compiler",c:"devtools",g:"ai-infra",f:false},
    {n:"mem0",d:"Memory layer for AI agents",c:"agents",g:"ai-infra",f:true},
    {n:"Datachain",d:"Open-source data-centric MLOps",c:"infra",g:"ai-infra",f:false},
    {n:"LightBeam.ai",d:"Automated data governance & security",c:"infra",g:"ai-infra",f:false},
    {n:"Hercules",d:"OS for enterprise AI applications",c:"infra",g:"ai-infra",f:false},
    {n:"Honeydew",d:"Shared data source of truth",c:"infra",g:"ai-infra",f:false},
    {n:"GetGenAI",d:"Guardrails for Generative AI",c:"infra",g:"ai-infra",f:false},
    {n:"Defog.ai",d:"AI data assistant for apps",c:"devtools",g:"ai-infra",f:false},
    {n:"Strong Compute",d:"10x\u20131000x faster neural network training",c:"compute",g:"ai-infra",f:false},
    {n:"evidently.ai",d:"Open-source ML model monitoring",c:"infra",g:"ai-infra",f:false},
    {n:"Alter Labs",d:"Zero-trust identity for AI agents",c:"agents",g:"ai-infra",f:false},
    {n:"Archetype",d:"World-descriptor AI for IoT/sensors",c:"infra",g:"ai-infra",f:true},
    {n:"DeepFlow AI",d:"Agentic workflow orchestration",c:"agents",g:"ai-infra",f:false},

    {n:"Rhoda AI",d:"Two-arm general-purpose robot using video models for physical imagination",c:"physical-ai",g:"physical-ai",f:true},
    {n:"Matic Robots",d:"Autonomous home robots",c:"physical-ai",g:"physical-ai",f:false},
    {n:"Abagy Robotics",d:"AI for welding robots",c:"physical-ai",g:"physical-ai",f:false},

    {n:"Thinking Machines Lab",d:"AI research & product company",c:"research",g:"research-frontier",f:true},
    {n:"Sooth Labs",d:"AI forecasting geopolitical and market events",c:"research",g:"research-frontier",f:true},
    {n:"SentientWave",d:"AGI in a pocket",c:"research",g:"research-frontier",f:false},
    {n:"Stealth Mode",d:"Pre-launch research company",c:"research",g:"research-frontier",f:false},
    /* Added 30 Sep 2026 from the VentureOS portfolio (Invested + Exit) */
    {n:"Valis",d:"AI operating layer for mid-market companies",c:"enterprise",g:"enterprise-saas",f:false},
    {n:"CARYATID",d:"Physics-grounded world model for robots",c:"physical-ai",g:"physical-ai",f:false},
    {n:"blockrun",d:"Pay-per-use AI gateway for agents",c:"agents",g:"ai-infra",f:false},
    {n:"All3",d:"Robotic construction platform",c:"physical-ai",g:"physical-ai",f:false},
    {n:"AeroSilicon",d:"Deterministic FPGA synthesis for AI",c:"compute",g:"ai-infra",f:false},
    {n:"Desk",d:"AI agent for real estate transactions",c:"enterprise",g:"enterprise-saas",f:false},
    {n:"Vela",d:"AI multichannel tools for ecommerce sellers",c:"commerce",g:"apps-consumer",f:false},
    {n:"AIC",d:"Futures exchange for compute",c:"compute",g:"ai-infra",f:false},
    {n:"Autonomous Minds",d:"Conversational BI for executives",c:"enterprise",g:"enterprise-saas",f:false},
    {n:"Arete Studios",d:"Authenticated designer fashion marketplace",c:"commerce",g:"apps-consumer",f:false},
    {n:"QTPIE",d:"AI driving-test examiner on a smartphone",c:"enterprise",g:"enterprise-saas",f:false},
    {n:"servamind",d:"Lower AI training cost via data compression",c:"infra",g:"ai-infra",f:false},
    {n:"FAIRWAY",d:"AI rental concierge",c:"commerce",g:"apps-consumer",f:false},
    {n:"Positronic Robotics",d:"Physical-AI benchmark and infrastructure",c:"physical-ai",g:"physical-ai",f:false},
    {n:"Stanislavsky AI",d:"Screenplay-to-animatic AI agents",c:"media",g:"apps-consumer",f:false},
    {n:"Savvy KID",d:"AI parenting copilot for ADHD families",c:"health",g:"health-biotech",f:false},
    {n:"Boldr",d:"Home energy management for the grid",c:"enterprise",g:"enterprise-saas",f:false},
    {n:"getstaxel",d:"Touchless interactive displays via computer vision",c:"marketing",g:"enterprise-saas",f:false},
    {n:"Vernex",d:"AI marketplace for wire-harness manufacturing",c:"logistics",g:"enterprise-saas",f:false},
    {n:"Explee",d:"AI search for companies and people",c:"enterprise",g:"enterprise-saas",f:false},
    {n:"dataprana",d:"Grid-connected land for AI data centers",c:"compute",g:"ai-infra",f:false},
    {n:"Autonomics",d:"Fleet orchestration for cleaning robots",c:"physical-ai",g:"physical-ai",f:false},
    {n:"NeeraLab",d:"Multisensory wellness devices",c:"health",g:"health-biotech",f:false},
    {n:"pact",d:"AI agents for project management",c:"agents",g:"ai-infra",f:false},
    {n:"agnify",d:"AI agents for enterprise video analytics",c:"agents",g:"ai-infra",f:false},
    {n:"Sava",d:"AI-powered trust company",c:"fintech",g:"enterprise-saas",f:false},
    {n:"Plan Monster",d:"AI construction takeoff for subcontractors",c:"enterprise",g:"enterprise-saas",f:false},
    {n:"novogaia",d:"AI discovery of fungal natural products",c:"health",g:"health-biotech",f:false},
    {n:"Grego",d:"AI smart-contract vulnerability detection",c:"devtools",g:"ai-infra",f:false},
    {n:"GenPeach AI",d:"Human image and video generation models",c:"research",g:"research-frontier",f:false},
    {n:"Slice & Dice",d:"Brand visibility in AI answer engines",c:"marketing",g:"enterprise-saas",f:false},
    {n:"Mozart",d:"AI sales outreach personalization",c:"marketing",g:"enterprise-saas",f:false},
    {n:"Plurio",d:"AI operating system for performance marketing",c:"marketing",g:"enterprise-saas",f:false},
    {n:"TaxRay",d:"AI withholding-tax recovery for enterprises",c:"legal",g:"enterprise-saas",f:false},
    {n:"Octrace",d:"Predictive B2B sales intelligence",c:"marketing",g:"enterprise-saas",f:false},
    {n:"API Nexus",d:"AI-native collaborative interfaces · acquired by Perplexity",c:"agents",g:"ai-infra",f:false},
    {n:"Embodix",d:"AI models · exited",c:"research",g:"research-frontier",f:false},
    {n:"Subconscious",d:"Synthetic behavioral market research",c:"marketing",g:"enterprise-saas",f:false},
    {n:"Monolith",d:"AI sales tools",c:"enterprise",g:"enterprise-saas",f:false},
    {n:"Beagle",d:"AI-native eDiscovery",c:"legal",g:"enterprise-saas",f:false},
    {n:"HelloCreator",d:"AI virtual teams for creators",c:"media",g:"apps-consumer",f:false},
    {n:"Essence",d:"Healthcare AI",c:"health",g:"health-biotech",f:false},
    {n:"Dicer.ai",d:"AI ad-creative copilot for agencies",c:"marketing",g:"enterprise-saas",f:false},
    {n:"Endless Adventures",d:"No-code narrative game authoring",c:"media",g:"apps-consumer",f:false},
    {n:"CreAitor",d:"Goal-driven marketing agents",c:"marketing",g:"enterprise-saas",f:false},
    {n:"NoCap",d:"AI angel investor",c:"fintech",g:"enterprise-saas",f:false},
    {n:"The Team",d:"AI agents for business processes · exited",c:"agents",g:"ai-infra",f:false},
    {n:"SpellWise",d:"Acquired by Perplexity",c:"apps",g:"apps-consumer",f:false},
    {n:"Respell",d:"No-code AI workflow agents · acquired by Salesforce",c:"agents",g:"ai-infra",f:false},
    {n:"Locals",d:"Local community platform",c:"apps",g:"apps-consumer",f:false},
    {n:"Performetry",d:"AI analytics",c:"enterprise",g:"enterprise-saas",f:false},
    {n:"Mighty Health",d:"Health platform for adults 50+ · exited",c:"health",g:"health-biotech",f:false},
    {n:"Birthday App",d:"AI birthday reminders",c:"apps",g:"apps-consumer",f:false},
    {n:"HealthRhythms",d:"Passive mental-health measurement",c:"health",g:"health-biotech",f:false},
    {n:"Area of Games",d:"Games and fintech",c:"media",g:"apps-consumer",f:false},
    {n:"AiSupervision",d:"AI supervision for factory lines",c:"physical-ai",g:"physical-ai",f:false},
    {n:"Fogbender",d:"B2B customer support platform",c:"enterprise",g:"enterprise-saas",f:false},
    {n:"Classtag",d:"Parent-teacher communication · acquired by SchoolStatus",c:"edtech",g:"apps-consumer",f:false},
    {n:"RemBrain",d:"Cloud platform for teaching robots",c:"physical-ai",g:"physical-ai",f:false},
    {n:"Product Science",d:"AI mobile app performance optimization",c:"devtools",g:"ai-infra",f:false},
    {n:"WLNC",d:"No-code talent marketplace · acquired by Toptal",c:"commerce",g:"apps-consumer",f:false},
    {n:"3D Predict",d:"AI treatment planning for aligners",c:"health",g:"health-biotech",f:false},
    {n:"Machinet",d:"AI unit-test generation · acquired by Zencoder",c:"devtools",g:"ai-infra",f:false},
    {n:"LovOn",d:"AI relationship therapist for couples",c:"health",g:"health-biotech",f:false},
    {n:"codemaestro",d:"AI dev assistant for game production",c:"devtools",g:"ai-infra",f:false},
    {n:"Thoughtful Lab",d:"AI with subjective intelligence",c:"research",g:"research-frontier",f:false}
  ];

  /* === Color Maps === */
  const catColors = {
    'apps':'#4ECDC4','commerce':'#4ECDC4','media':'#4ECDC4','edtech':'#4ECDC4',
    'enterprise':'#4A90D9','marketing':'#4A90D9','legal':'#4A90D9','logistics':'#4A90D9',
    'fintech':'#66BB6A',
    'health':'#E8837C',
    'infra':'#7C4DFF','devtools':'#7C4DFF','compute':'#7C4DFF','agents':'#7C4DFF',
    'physical-ai':'#F5C542',
    'research':'#FF8C42'
  };

  const groupLabels = {
    'apps-consumer': { label: 'Applications & Consumer', color: '#4ECDC4' },
    'enterprise-saas': { label: 'Enterprise & Vertical SaaS', color: '#4A90D9' },
    'health-biotech': { label: 'Health & Biotech', color: '#E8837C' },
    'ai-infra': { label: 'AI Infrastructure & DevTools', color: '#7C4DFF' },
    'physical-ai': { label: 'Physical AI & Robotics', color: '#F5C542' },
    'research-frontier': { label: 'Research & Frontier', color: '#FF8C42' }
  };

  const groupOrder = ['apps-consumer','enterprise-saas','health-biotech','ai-infra','physical-ai','research-frontier'];

  /* === Initials Helper === */
  function getInitials(name) {
    const map = {
      'CopilotKit':'CK','mem0':'m0','tely.ai':'T','evidently.ai':'E',
      'LightBeam.ai':'LB','JustPaid.io':'JP','Defog.ai':'D','Skim.ai':'S',
      'Denti.ai':'De','GetGenAI':'GG','Hona AI':'HA','Howie AI':'Ho',
      'The Forecasting Company':'TFC','The Stage AI':'TS','Red Sky Health':'RS',
      'Aurora First':'AF','Thinking Machines Lab':'TM','Generative Alpha':'GA',
      'Solve Intelligence':'SI','Promethean AI':'PA','Aviary AI':'Av',
      'Alter Labs':'AL','Eternis Labs':'EL','Unreal Labs':'UL',
      'Rhoda AI':'R','Abagy Robotics':'AR','Strong Compute':'SC',
      'GPU Audio':'GP','Bina School':'BS','DeepFlow AI':'DF',
      'Kerna Laboratorie':'KL','Qualified Health':'QH',
      'Pervasive App':'Pv','FitWise':'FW','Asylia Dx':'AD',
      'NutriSense':'NS','NewHomesMate':'NH','FleetWorks':'FL',
      'BerryApp':'BA','HyperC':'HC','HackerPulse':'HP',
      'Eloquent AI':'EA','SentientWave':'SW','Agentnoon':'An',
      'PermitFlow':'PF','RemoFirst':'RF','DoubleFifth':'DF','Matic Robots':'MR','Stealth Mode':'?','Avoca':'Ac'
    };
    return map[name] || name[0].toUpperCase();
  }

  /* === Build DOM === */
  const container = document.getElementById('eco-cloud-container');
  if (!container) return;

  const cloud = container.querySelector('.eco-cloud');
  if (!cloud) return;

  // Create tooltip
  const tooltip = document.createElement('div');
  tooltip.className = 'eco-tooltip';
  tooltip.innerHTML = '<div class="eco-tooltip-name"></div><div class="eco-tooltip-cat"></div><div style="margin-top:3px;color:#C8CCD4;font-size:0.72rem"></div>';
  document.body.appendChild(tooltip);

  // Group counts
  const groupCounts = {};
  companies.forEach(co => {
    groupCounts[co.g] = (groupCounts[co.g] || 0) + 1;
  });

  // Update filter badges
  document.querySelectorAll('.eco-filter-btn').forEach(btn => {
    const g = btn.dataset.group;
    const badge = btn.querySelector('.eco-filter-badge');
    if (g === 'all') {
      badge.textContent = companies.length;
    } else if (groupCounts[g]) {
      badge.textContent = groupCounts[g];
    }
  });

  // Update stats
  const totalEl = document.getElementById('eco-total-count');
  if (totalEl) totalEl.textContent = companies.length;

  let currentGroup = 'all';

  function renderCards(filterGroup) {
    cloud.innerHTML = '';
    currentGroup = filterGroup;

    groupOrder.forEach(group => {
      const groupCompanies = companies.filter(co => co.g === group);
      if (groupCompanies.length === 0) return;
      if (filterGroup !== 'all' && filterGroup !== group) return;

      // Category label
      const labelDiv = document.createElement('div');
      labelDiv.className = 'eco-category-label';
      labelDiv.innerHTML = `
        <span class="eco-category-dot" style="background:${groupLabels[group].color}"></span>
        <span class="eco-category-text">${groupLabels[group].label}</span>
        <span class="eco-category-line"></span>
      `;
      cloud.appendChild(labelDiv);

      // Sort: featured first
      const sorted = [...groupCompanies].sort((a,b) => (b.f ? 1 : 0) - (a.f ? 1 : 0));

      sorted.forEach(co => {
        const card = document.createElement('div');
        const color = catColors[co.c];
        const initials = getInitials(co.n);
        const isFeatured = co.f;

        card.className = 'eco-card anim-fade' + (isFeatured ? ' eco-featured' : '');
        card.dataset.group = co.g;
        card.dataset.name = co.n;
        card.dataset.desc = co.d;
        card.dataset.cat = co.c;

        let html = '';

        if (isFeatured) {
          html += `<span class="eco-star"><svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></span>`;
        }

        const logoDomain = (window.PORTFOLIO_DOMAINS || {})[co.n];
        html += `<div class="eco-logo" style="background:${color}"${logoDomain ? ` data-logo="${logoDomain}"` : ''}>${initials}</div>`;
        html += `<span class="eco-name">${co.n}</span>`;

        if (isFeatured) {
          html += `<span class="eco-desc">${co.d}</span>`;
        }

        card.innerHTML = html;

        // Tooltip events (non-featured only, featured show desc inline)
        card.addEventListener('mouseenter', (e) => {
          const rect = card.getBoundingClientRect();
          tooltip.querySelector('.eco-tooltip-name').textContent = co.n;
          tooltip.querySelector('.eco-tooltip-cat').textContent = co.c.replace('-', ' ');
          tooltip.children[2].textContent = co.d;
          
          // Position tooltip
          let left = rect.left + rect.width / 2 - 110;
          let top = rect.top - 8;
          
          tooltip.style.left = Math.max(8, Math.min(left, window.innerWidth - 228)) + 'px';
          tooltip.style.top = (top) + 'px';
          tooltip.style.transform = 'translateY(-100%)';
          tooltip.classList.add('eco-tooltip-visible');
        });

        card.addEventListener('mouseleave', () => {
          tooltip.classList.remove('eco-tooltip-visible');
        });

        cloud.appendChild(card);
      });
    });

    // Trigger scroll animations for new elements
    cloud.querySelectorAll('.anim-fade').forEach(el => {
      el.classList.add('visible');
    });
  }

  // Initial render
  renderCards('all');

  // Filter button handlers
  document.querySelectorAll('.eco-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.eco-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCards(btn.dataset.group);
    });
  });

})();
