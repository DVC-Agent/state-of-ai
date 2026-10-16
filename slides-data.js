// slides-data.js — SINGLE SOURCE OF TRUTH for the slideshow
// Update numbers here; the slideshow auto-updates.

window.SLIDES_DATA = {
  // ─── THE STACK — 5 layers, single source of truth (slides 3-5) ───
  // Top→bottom order: APPLICATIONS → FOUNDATION MODELS → CLOUD & INFRA → SILICON → ENERGY
  stackLayers: [
    {
      badge: 'LAYER 5', title: 'APPLICATIONS', accent: '#4BB5AB',
      revenue2026: '$60-70B', revenueLabel: 'app revenue',
      revenue2024Num: 13, revenue2026Num: 65,
      growth: '+400%',
      marginPct: 50, marginRange: '25-60%'
    },
    {
      badge: 'LAYER 4', title: 'FOUNDATION MODELS', accent: '#8CC0EE',
      revenue2026: '$35-40B', revenueLabel: 'API revenue',
      revenue2024Num: 9, revenue2026Num: 37,
      growth: '+311%',
      marginPct: 50, marginRange: '33-70%'
    },
    {
      badge: 'LAYER 3', title: 'CLOUD & INFRA', accent: '#2080D6',
      revenue2026: '$45-55B', revenueLabel: 'AI cloud rev (+ ~$735B 2026 CapEx)',
      revenue2024Num: 20, revenue2026Num: 50,
      growth: '+150%',
      marginPct: 28, marginRange: '20-35%'
    },
    {
      badge: 'LAYER 2', title: 'SILICON', accent: '#F4B6A9',
      revenue2026: '$350B+', revenueLabel: 'AI silicon revenue',
      revenue2024Num: 130, revenue2026Num: 350,
      growth: '+169%',
      marginPct: 60, marginRange: '45-75% (NVIDIA)'
    },
    {
      badge: 'LAYER 1', title: 'ENERGY', accent: '#FFD720',
      revenue2026: '580 TWh (US high case)', revenueLabel: 'US data-center power by 2028',
      revenue2024Num: 460, revenue2026Num: 580,
      growth: '+26%',
      marginPct: 12, marginRange: '8-15% (utility)'
    }
  ],

  // Hyperscaler CapEx ($B) — Big 4 2026 guidance: ~$735B midpoint, up to ~$745B top end (Microsoft ~$175B reported basis, Jul 29)
  // (post-Q2 2026 earnings; Alphabet raised to $195–205B on the Jul 22 2026 call).
  // y2024 = 224 is the 2024 figure and is labelled as such — it is NOT a 2026 number.
  hyperscalerCapex: { y2024: 224, y2026: 735, y2026Label: '~$735B mid / up to ~$745B', ratio: '$12 infra : $1 app revenue' },

  // Inference cost collapse — log scale. Cost per million tokens (USD).
  inferenceCost: [
    { date: 'GPT-4 (Mar 2023)',  cost: 37.50 },
    { date: 'GPT-4 Turbo',       cost: 30.00 },
    { date: 'GPT-4o',            cost: 15.00 },
    { date: 'Gemini Flash',      cost: 0.70 },
    { date: 'Today (commodity)', cost: 0.14 }
  ],
  inferenceCostDrop: null, // removed Aug 4 2026: the two cost series in the report used different model classes, baselines and windows and could not be reconciled to one current source
  inferenceBarbell: 'Floor at $0.10/$0.50 (GPT-6 Luna, Sep 22) against $10/$50 at the agentic top (GPT-6 Astra, Claude Fable 5.1): a 100x spread, up from ~10x in July. Floor fell on cheaper inference and caching, Chinese open-weight competition and buyers routing to cheaper tiers (Ramp: effective price per 1M tokens -41% since March) — published list prices, Sep 2026',

  // Application layer companies (slide 7)
  // Aug 3, 2026. Private run-rate/ARR figures are company-disclosed and unaudited.
  // Anthropic's run-rate is a time series, not a source conflict: $14B Feb → $19B Mar
  // → $30B Apr (official) → $47B May 2026 (Series H post) → $65B Jul. We show the latest point.
  // OpenAI is shown on revenue too (~$50B net, FT Oct 8), not users, so the slide compares like with like.
  // Cursor: the SpaceX transaction was signed Jun 16 2026 and closed Aug 14 2026.
  appLayer: [
    { name: 'Anthropic',  val: '$65B', color: '#D4A574' },
    { name: 'OpenAI',     val: '~$50B',  color: '#10A37F' },
    { domain: 'cursor.com', name: 'Cursor',     val: '$4B',     color: '#A0A8BC' },
    { name: 'ElevenLabs', val: '$600M',   color: '#A0A8BC' },
    { domain: 'lovable.dev', name: 'Lovable',    val: '$600M+',   color: '#8CC0EE' },
    { name: 'Higgsfield', val: '$1B',  color: '#4BB5AB', dvc: true }
  ],

  // ── Lab leadership (slide 5 strip + report cards) ──
  // Valuations are primary-round marks; secondary prints differ and are labelled.
  labLeadership: {
    anthropic: { primary: '$965B', secondary: null, runRate: '$65B run-rate at end of July 2026 (reported Aug 17), up from $47B in May; Q3 2026 revenue $16.8B (Bloomberg, Oct 14, unaudited)',
                 enterprise: '43.8% of US paid business use vs OpenAI 40.6% (Ramp AI Index, October 2026 release)',
                 customers: '1,000+ customers spending over $1M a year (Bloomberg, Apr 2026)' },
    openai:    { primary: '$852B', secondary: 'in talks to raise ~$30B at ~$1.4T (Bloomberg, Sep 29 2026) — not closed', usage: 'ChatGPT 1.2B+ weekly users · 35M+ weekly ChatGPT Work + Codex users (DevDay, Sep 29 2026)',
                 caveat: 'Annualized revenue about $50B at end-September on OpenAI’s net basis (FT, Oct 8 2026); the ~$70B reported in late September was gross-equivalent. No audited figures disclosed' },
    google:    { gemini: '1B+ MAU', aiMode: '1B+ MAU', enterprise: '~90% of the Fortune 100', tokens: '22B tokens/min through Gemini APIs' },
    meta:      { mau: '1.2B MAU', wau: '800M WAU', note: 'Largest by reach (unverified in Meta’s Q2 release), but embedded in existing search bars rather than chosen', agent: 'Muse personal agent (Sep 8 2026; ~4M users per TIME, Oct 6)', frontier: 'Muse Wonder (Oct 12 2026), $4/$20, 1M context' },
    disclosure: 'Private-company ARR and run-rate figures are company-disclosed and unaudited unless noted.'
  },

  // ── Slide 6: THE MODEL MARKET BECAME A BARBELL (updated Oct 16, 2026) ──
  // Four lanes. Slide 6 renders these as native HTML (see slides.html) so the
  // text stays legible in fullscreen; this block is the source of record.
  modelBarbell: {
    premiumAgentic: [
      { model: 'Claude Fable 5.1', price: '$10/$50', note: 'Sep 1 (succeeds Fable 5, Jun 9) · multi-day agentic tier · Mythos is restricted to Project Glasswing partners, not purchasable' },
      { model: 'GPT-6 Astra',               price: '$10/$50', note: 'GA Sep 4 · GPT-5.6 Sol (Jul 9) is on a $4/$20 promotion through at least Nov 21 (standard $5/$30)' }
    ],
    efficientFrontier: [
      { model: 'Claude Sonnet 5.5',      price: '$2/$10',            note: 'Sep 28 · 1M context' },
      { model: 'Grok 4.5 / 4.6 / 4.7',   price: '$2/$6',             note: '500K context ($4/$12 above 200K), xAI model docs · 4.7 shipped Sep 21' },
      { model: 'GPT-6 Sol / Luna',       price: '$2/$10 · $0.10/$0.50', note: 'Sep 22 · Luna set the floor; Claude Haiku 5.5 matched it Oct 7; GPT-6.1 Sol $2/$10 (Sep 29)' },
      { model: 'Claude Haiku 5.5',       price: '$0.10/$0.50',       note: 'Oct 7 · prompts up to 100K tokens ($0.50/$2.50 above) · two-vendor floor' },
      { model: 'Gemini 4 Argon',         price: '$2/$10',            note: 'GA Oct 13 · intro price, $4/$20 from Dec 1 · Flash 3.6/3.8 $0.75/$3.75 through Dec 31' },
      { model: 'Meta Muse Spark 1.1',    price: '$1.25/$4.25',       note: "Meta's first paid Model API · leads on tool use" },
      { model: 'Meta Muse Wonder',       price: '$4/$20',            note: "Oct 12 · Meta's first frontier model · 1M context" }
    ],
    openWeightChina: [
      { model: 'Kimi K3 (Moonshot)',      params: '2.8T', note: '896 experts / 16 routed, 104B active · 1M context · weights Jul 27 · largest open model to date' },
      { model: 'Qwen3.8 2.4T-A95B',      params: '2.4T', note: 'Aug 12 · 95B active · custom license (Apache option: Qwen3.8-27B)' },
      { model: 'DeepSeek V4-Pro',         params: '1.6T', note: 'GA Aug 13 · 49B active · MIT; V4.1-Flash (Sep 10) beats it per DeepSeek' }
    ],
    restrictedCyber: [
      { model: 'Fable 5 / Mythos 5 controls', stat: 'restricted access', note: 'Exact suspension duration and regulatory causality were not independently verified' },
      { model: 'GPT-5.6 pre-release review',    stat: 'EO 14409', note: 'US pre-release review preceded GA; OpenAI objected to it becoming the long-term default' },
      { model: 'Gemini 3.5 Flash Cyber',        stat: 'Dedicated SKU', note: 'Cyber capability became a release gate, not a footnote' }
    ],
    integrityCaveat: 'The Grok 4.5 CursorBench result was withdrawn after Cursor disclosed a codebase snapshot had entered the training data.'
  },

  // Token efficiency (slide 7 strip) — THREE SEPARATE VENDOR CLAIMS, NOT A TIME SERIES.
  // Deliberately not modelled as a curve: the three figures are each a vendor's
  // own comparison against its own predecessor on different tasks.
  tokenEfficiencyClaims: [
    { vendor: 'Grok 4.5',         claim: 'EFFICIENCY', detail: 'marketed on lower tokens per task; exact multiplier removed after audit' },
    { vendor: 'GPT-5.6 Sol',      claim: '54%',  detail: 'more token-efficient on coding than its predecessor' },
    { vendor: 'Gemini 3.6 Flash', claim: 'EFFICIENCY', detail: 'marketed on lower output-token use; exact percentage removed after audit' }
  ],

  // Smarter + Cheaper diverging curves
  // Illustrative only: MMLU is saturated and is retained here purely as a legacy
  // capability axis. The report itself notes SWE-bench Verified is nearing its ceiling.
  smarterCurve: [
    { date: '2023', mmlu: 70, cost: 37.50 },
    { date: '2024', mmlu: 80, cost: 15 },
    { date: '2025', mmlu: 87, cost: 2 },
    { date: '2026', mmlu: 92, cost: 0.14 }
  ],

  // ── NEW slide 6: Infrastructure & Energy headline stats ──
  infraStats: {
    capex2026: '~$735B mid / up to ~$745B',
    capex2026Detail: 'Top four 2026 guidance · up to ~$800B calendar 2026 including leases · Google raised to $195–205B',
    capex2024: '$224B (2024)',
    multiplier: '3.1×',
    nuclear: '9.8 GW committed across 13 hyperscaler nuclear deals vs 1.92 GW operational (tracker snapshot, May 2026) · bridged by a proposed 2.67 GW off-grid gas project without final investment decision'
  },

  // ── Slide 8: HOW IT'S FUNDED — the scale held, the funding quality changed ──
  fundingMix: {
    debtShare:  { from: '9% of capex (FY24)', to: '32% LTM (mid-2026)' },
    buybacks:   { from: '$28B in Q1 2025 (Meta $12.75B + Alphabet $15.07B)', to: '$0 in H1 2026' },
    alphabetFcf: 'Free cash flow negative for the first time since the 2004 IPO',
    equityRaise: '$84.75B Alphabet equity raise, June 2026 — its first since 2005'
  },

  // ── Slide 9 (NEW): SILICON & POWER ──
  siliconPower: {
    nvidia:   { period: 'Q2 FY2027 (quarter ended Jul 26, 2026)', revenue: '$96.2B', dataCenter: '$89.0B',
                note: 'Vera Rubin in full production · Q3 FY27 guided $108B ±2% · physical AI is a disclosed revenue line (TTM figure not printed — unsourced) · China compute revenue zero',
                annualContrast: 'Do not confuse with FY2026 annual revenue of $215.9B — always label the period' },
    amd:      { summary: 'Instinct commitments from AMD releases: OpenAI 6 GW (Oct 2025), Meta up to 6 GW (Feb 2026), Anthropic up to 2 GW of MI450 plus AMD equity of up to $5B (Jul 22, 2026); World Labs acquisition (~$8.2B in stock, Sep 2026).' },
    broadcom: { aiSemis: '$16.7B FQ3 (+221%)', q3Guide: '$21.7B (FQ4 guide)', openai: 'OpenAI partnered with Broadcom on its first in-house processors' },
    // Etched IS a DVC portfolio company (dvc: true below). DVC publicly states "DVC invested
    // in Etched at an early stage" — a firm's own statement about its own portfolio is first-party.
    // The DVC badge must render on the report card and on the Etched card in the silicon slide.
    etched:   { round: '$700M', valuation: '$21B', date: 'Aug 18, 2026',
                investors: 'Led by Jane Street, which bought and runs Etched hardware; doubles the $10.3B Series C of Jul 23 (Sequoia, a16z, Jane Street, SK Hynix); Argo and Diffusion among investors',
                totalRaised: '>$1.7B', contracts: '>$1B in customer contracts (company-stated)', preOrders: null, /* $1B pre-orders removed Aug 4 2026: unsourced */ dvc: true },
    nuclear: { committed: '9.8 GW across 13 hyperscaler nuclear deals (SMR Intel tracker, May 2026 cut)', operational: '1.92 GW — one deal: Amazon/Talen Susquehanna', ratio: '5:1',
                gasBridge: 'Project Kilby — proposed 2.67 GW off-grid West Texas gas plant with a 20-year Microsoft PPA; no final investment decision, which may slip to 2027 after Texas paused data-centre environmental permits on Sep 21, 2026',
                tmi: 'Three Mile Island Unit 1 / Crane restart: 835 MW, 20-year PPA, ~$16B — produces no power until 2027; FERC waiver approved June 2026, NRC environmental finding Sep 25, 2026' }
  },

  // ── Slide 12 (NEW): VOICE AI ──
  voiceAI: {
    elevenlabs: { arr: '$600M', from: '$330M at end-2025', growth: '~175% YoY',
                  f500: '41% of the Fortune 500', apiUsers: '1B+ end users via API',
                  creators: '$22M paid to 10,400+ voice creators', disclosure: 'company-disclosed' },
    openai:     { product: 'OpenAI full-duplex voice', date: '2026 product release', capability: 'Simultaneous listening and speaking; exact SKU names/date removed after source audit.' },
    dvcExposure: ['FleetWorks', 'Avoca']
  },

  // ── NEW slide 10: Agent Anatomy 7-layer stack (KPIs are now inline in the slide headline) ──
  agentLayers: [
    { num: 1, name: 'UI / Frontend',       desc: 'How agents meet users' },
    { num: 2, name: 'Orchestration',       desc: 'Planning, routing, multi-agent' },
    { num: 3, name: 'Tool Calling',        desc: 'How agents act on the world' },
    { num: 4, name: 'Memory',              desc: 'Persistent context, long-term state' },
    { num: 5, name: 'Models',              desc: 'The reasoning core' },
    { num: 6, name: 'Observability',       desc: 'Tracing, eval, debugging' },
    { num: 7, name: 'Security & Identity', desc: 'Auth, permissions, sandboxes' }
  ],

  // ── NEW slide 11: Vibe coding ──
  // Aug 3, 2026. ARR figures are company-disclosed and unaudited.
  vibeCoding: [
    { domain: 'cursor.com', letter: 'C', name: 'Cursor',      stat: '$4B ARR',         color: '#E07A5F', desc: '$60B all-stock acquisition by SpaceX, signed Jun 16 and closed Aug 14' },
    { domain: 'claude.ai', letter: 'A', name: 'Claude Code', stat: 'Sonnet 5 default', color: '#D4A574', desc: 'Default surface for Sonnet 5 from Jul 1 · >$2.5B annualized (Feb 2026, last disclosed)' },
    { domain: 'lovable.dev', letter: 'L', name: 'Lovable',     stat: '$600M+ run-rate',       color: '#8CC0EE', desc: 'Sep 2026 · $400M Series C at $13.3B (Aug 2026), ~22×' },
    { domain: 'openai.com', letter: 'O', name: 'Work + Codex', stat: '35M+ weekly',       color: '#10A37F', desc: 'OpenAI platform bundle · 35M+ weekly users at DevDay (Sep 29), from ~10M in July' },
    { domain: 'meta.com', letter: 'M', name: 'Muse Spark',  stat: '$1.25/$4.25',     color: '#1877F2', desc: "Meta entered coding Jul 9 — its first paid Model API" },
    { domain: 'wabi.ai', letter: 'W', name: 'Wabi',        stat: '$20M pre-seed',   color: '#4BB5AB', desc: 'Software creation, reimagined', dvc: true }
  ],
  // SonarSource 2026 State of Code Developer Survey: 42% of committed code is AI-generated
  // or significantly AI-assisted; 72% of developers who tried AI use it every day.
  // Source: https://www.sonarsource.com/state-of-code-developer-survey-report.pdf
  // Stack Overflow 2026 (73% of AI-assistant users daily, Oct 6 2026) kept only as secondary signal.
  vibeStats: {
    aiAuthoredCode: '42%',
    dailyUseAmongTriers: '72%',
    source: 'SonarSource 2026 State of Code Developer Survey'
  },

  // ── REBUILT slide 12: Physical AI tiles ──
  // Aug 3, 2026. Tesla's ~12B cumulative FSD miles (Q2 2026) are deliberately NOT used as
  // an equivalent to Waymo's autonomous miles — the comparable figure is Tesla's
  // 2.5M paid robotaxi miles, of which only 380K ran without a safety monitor.
  physicalAI: {
    waymoWeeklyRides: '~500,000',
    waymoTarget:      '1M/week by year-end (one forecast puts Q4 nearer 775,000)',
    waymoMetros:      '15 commercial US markets (San Antonio, San Diego, Tampa open to all riders Oct 14, 2026) · ~3,871 robotaxis (Jun NHTSA filing) · $5B term loan Oct 8',
    waymoMiles:       '271M+ autonomous miles through June 2026',
    teslaPaidMiles:   '2.5M paid robotaxi miles · only 380,000 without a safety monitor',
    teslaFlat:        '~1.1M added paid miles in Q1 vs ~700K in Q2 2026 — roughly 36% lower on the majority reading of Tesla’s cumulative chart',
    laborMarketTAM:   '$38T',
    humanoidFunding:  '$8.6B in 2026 through late July — 1.8× all of 2025',
    nvidiaPhysicalAI: 'physical AI is a disclosed revenue line (TTM figure not printed — unsourced)'
  },
  physicalAITiles: [
    { category: 'AUTONOMOUS MOBILITY',  color: '#4BB5AB', icon: 'car',
      company: 'WAYMO',          detail: '~500K paid rides/week (flat since Mar 2026) · 15 commercial markets · 271M+ mi' },
    { category: 'THE GAP WIDENED',      color: '#FFD720', icon: 'truck',
      company: 'TESLA ROBOTAXI', detail: '2.5M paid mi · 380K without a safety monitor · Q2 added miles ~36% below Q1 on majority read' },
    { category: 'AUTONOMOUS WORK',      color: '#F4B6A9', icon: 'robotarm',
      company: 'RHODA',          detail: '$450M Series A · $1.7B valuation (Bloomberg, Mar 2026)', dvc: true }
  ],
  physicalAIStats: [
    { num: '~500K',  label: 'WAYMO PAID RIDES/WEEK',   accent: '#4BB5AB' },
    { num: '$8.6B',  label: 'HUMANOID FUNDING 2026, TO LATE JULY', accent: '#FFD720' },
    { num: '380K',   label: 'TESLA MI, NO SAFETY MONITOR', accent: '#F4B6A9' },
    { num: 'DISCLOSED LINE', label: 'NVIDIA PHYSICAL AI — NO TTM FIGURE PRINTED', accent: '#8CC0EE' }
  ],

  // Slide 13 business-model proof points are native. Exact cross-company ARPU
  // bars were removed because their user denominators were not comparable.
  // (index.html #arpu-block) and slides.html together if any value changes.

  // Tech cycle phases (slide 15 close)
  cyclePhases: ['Infrastructure buildout', 'Platform consolidation', 'Application dominance'],
  weAreHere:   'Infrastructure buildout',

  // Iframe target sections — keyed by slide number, value passed as ?embed=...
  // 18 slides after the Aug 2026 refresh. Slides 8 (capex explorer) and 10
  // (agent anatomy) are NATIVE — they render in-page rather than via an iframe,
  // so this map is intentionally empty. Kept for the loader contract.
  iframeEmbeds: {},

  // Section anchors for "Dive deeper" links to index.html — 18 slides.
  //  1 QR cover            10 agent anatomy
  //  2 cinematic opener     11 vibe coding consolidation
  //  3 tech cycles          12 NEW voice AI
  //  4 unified stack        13 business models
  //  5 application / labs   14 services matrix
  //  6 model barbell        15 attack angles
  //  7 smarter + cheaper    16 NEW healthcare AI
  //  8 infra & how funded   17 physical AI
  //  9 NEW silicon & power  18 six beliefs close
  diveDeeperAnchors: {
    1:  'index.html#sec-0',
    2:  'index.html#sec-0',
    3:  'index.html#sec-1',
    4:  'index.html#sec-1',
    5:  'index.html#sec-2',
    6:  'index.html#sec-3',
    7:  'index.html#sec-3',
    8:  'index.html#sec-7',
    9:  'index.html#sec-7',
    10: 'index.html#sec-5',
    11: 'index.html#sec-4',
    12: 'index.html#sec-4',
    13: 'index.html#sec-9',
    14: 'index.html#sec-9',
    15: 'index.html#attack-angles-block',
    16: 'index.html#sec-healthcare-ai',
    17: 'index.html#sec-8',
    18: 'index.html#sec-14'
  }
};
