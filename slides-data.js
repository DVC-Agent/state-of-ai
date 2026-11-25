/* Evidence cut October 16, 2026. Historical baselines and modeled allocations retain their own scope. */
(function(root) { "use strict"; var D = {
  "stackLayers": [
    {
      "badge": "LAYER 5",
      "title": "APPLICATIONS",
      "accent": "#4ECDC4",
      "revenue2026": ">$1B",
      "revenueLabel": "Higgsfield annualized pace · September 24",
      "marginRange": "Inference, human review, support and pricing",
      "growth": "Task economics"
    },
    {
      "badge": "LAYER 4",
      "title": "FOUNDATION MODELS",
      "accent": "#4CB5AB",
      "revenue2026": "$16.8B",
      "revenueLabel": "Anthropic reported Q3 2026 revenue",
      "marginRange": "Serving costs and partner distribution",
      "growth": "Serving economics"
    },
    {
      "badge": "LAYER 3",
      "title": "CLOUD & INFRA",
      "accent": "#4A90D9",
      "revenue2026": "~$733B",
      "revenueLabel": "Selected-four CY2026 capex midpoint",
      "marginRange": "Utilization, leases, depreciation and financing",
      "growth": "Asset economics"
    },
    {
      "badge": "LAYER 2",
      "title": "SILICON",
      "accent": "#E8837C",
      "revenue2026": "$96.2B",
      "revenueLabel": "NVIDIA Q2 FY2027 revenue",
      "marginRange": "Product mix, scarcity and development cost",
      "growth": "Supply economics"
    },
    {
      "badge": "LAYER 1",
      "title": "ENERGY",
      "accent": "#F5C542",
      "revenue2026": "485 TWh",
      "revenueLabel": "Global data-centre consumption · 2025",
      "marginRange": "Generation, grid access and executable permits",
      "growth": "Delivery economics"
    }
  ],
  "hyperscalerCapex": {
    "y2026": 732.5,
    "y2026Label": "~$733B midpoint; $720–745B range",
    "ratio": "Different issuer accounting scopes"
  },
  "inferenceCost": [],
  "inferenceCostDrop": null,
  "inferenceBarbell": "Small models $0.10/$0.50; workhorse $2/$10; premium $10/$50; list prices, not cost per successful task.",
  "appLayer": [
    {
      "name": "Anthropic",
      "val": "$16.8B Q3",
      "color": "#4CB5AB"
    },
    {
      "name": "OpenAI",
      "val": "~$50B pace",
      "color": "#4CB5AB"
    },
    {
      "name": "Higgsfield",
      "val": ">$1B pace",
      "color": "#4CB5AB",
      "dvc": true
    },
    {
      "name": "Lovable",
      "val": "$600M pace",
      "color": "#4CB5AB",
      "stat": "$600M annualized revenue",
      "desc": "September 24 company disclosure. No current employee denominator."
    },
    {
      "name": "ElevenLabs",
      "val": "55% enterprise",
      "color": "#4CB5AB"
    }
  ],
  "labLeadership": {
    "anthropic": {
      "runRate": "$16.8B reported Q3 revenue",
      "enterprise": "43.8% of Ramp businesses pay Anthropic"
    },
    "openai": {
      "runRate": "Nearly $50B annualized September revenue",
      "caveat": "Prior nearly $70B figure corrected October 8"
    },
    "disclosure": "Private results are reported and unaudited; accounting scope and periods differ."
  },
  "modelBarbell": {
    "premiumAgentic": [
      {
        "model": "Claude Fable 5.1 / GPT-6 Astra",
        "price": "$10/$50",
        "note": "Standard input/output per million tokens"
      }
    ],
    "efficientFrontier": [
      {
        "model": "GPT-6.1 Sol / Claude Sonnet 5.5",
        "price": "$2/$10",
        "note": "Standard API input/output"
      },
      {
        "model": "Claude Haiku 5.5 / GPT-6 Luna",
        "price": "$0.10/$0.50",
        "note": "Haiku up to 100K input tokens; higher above threshold"
      },
      {
        "model": "Gemini 4 Argon",
        "price": "$2/$10 introductory",
        "note": "Through November 30; then $4/$20"
      },
      {
        "model": "Muse Wonder",
        "price": "Not quoted",
        "note": "October release; weights status not inferred"
      }
    ],
    "openWeightChina": [
      {
        "model": "DeepSeek V4.1 Flash",
        "params": "MIT weights",
        "note": "1M context; September release"
      },
      {
        "model": "Kimi K3",
        "params": "Kimi K3 License",
        "note": "2.8T vendor parameter count; downloadable weights"
      },
      {
        "model": "GLM-5.3 / 5.3-Flash",
        "params": "August releases",
        "note": "Check model-specific weights and licence before deployment"
      }
    ]
  },
  "tokenEfficiencyClaims": [],
  "smarterCurve": [],
  "infraStats": {
    "capex2026": "~$733B",
    "capex2026Detail": "CY2026 selected-four guidance; issuer scopes differ",
    "nuclear": "45 GW conditional SMR offtake pipeline, not operating generation"
  },
  "fundingMix": {
    "note": "Cash flow, equity, debt, leases and customer funding differ by company. No synthetic funding-share ratio."
  },
  "siliconPower": {
    "nvidia": {
      "period": "Q2 FY2027 (quarter ended Jul 26, 2026)",
      "revenue": "$96.2B",
      "dataCenter": "$89.0B",
      "note": "Vera Rubin in full production · Q3 FY27 guided $108B ±2% · physical AI is a disclosed revenue line (TTM figure not printed — unsourced) · China compute revenue zero",
      "annualContrast": "Do not confuse with FY2026 annual revenue of $215.9B — always label the period"
    },
    "amd": {
      "summary": "Major hyperscaler commitments for the Instinct roadmap; exact gigawatt totals removed after the Aug 4 source audit."
    },
    "broadcom": {
      "aiSemis": "$16.7B FQ3 (+221%)",
      "q3Guide": "$21.7B (FQ4 guide)",
      "openai": "OpenAI partnered with Broadcom on its first in-house processors"
    },
    "etched": {
      "round": "$700M financing",
      "valuation": "$21B",
      "date": "August 18, 2026",
      "investors": "Led by Jane Street; Sequoia and others participated",
      "dvc": true
    },
    "nuclear": {
      "committed": "45 GW conditional SMR offtake pipeline",
      "operational": "Not an operating-capacity total",
      "gasBridge": "Project-specific construction and FID need verification"
    }
  },
  "voiceAI": {
    "elevenlabs": {
      "arr": ">$500M",
      "from": "First four months of 2026; last verified primary ARR milestone",
      "disclosure": "55% enterprise revenue; >15M weekly agent conversations, September 30"
    },
    "openai": {
      "product": "OpenAI full-duplex voice",
      "date": "2026 product release",
      "capability": "Simultaneous listening and speaking; exact SKU names/date removed after source audit."
    },
    "dvcExposure": [
      "FleetWorks",
      "Avoca"
    ]
  },
  "agentLayers": [
    {
      "num": 1,
      "name": "UI / Frontend",
      "desc": "How agents meet users"
    },
    {
      "num": 2,
      "name": "Orchestration",
      "desc": "Planning, routing, multi-agent"
    },
    {
      "num": 3,
      "name": "Tool Calling",
      "desc": "How agents act on the world"
    },
    {
      "num": 4,
      "name": "Memory",
      "desc": "Persistent context, long-term state"
    },
    {
      "num": 5,
      "name": "Models",
      "desc": "The reasoning core"
    },
    {
      "num": 6,
      "name": "Observability",
      "desc": "Tracing, eval, debugging"
    },
    {
      "num": 7,
      "name": "Security & Identity",
      "desc": "Auth, permissions, sandboxes"
    }
  ],
  "vibeCoding": [
    {
      "domain": "cursor.com",
      "letter": "C",
      "name": "Cursor",
      "stat": "$4B ARR",
      "color": "#FF8C42",
      "desc": "$60B all-stock acquisition by SpaceX, signed Jun 16 and closed Aug 14"
    },
    {
      "domain": "claude.ai",
      "letter": "A",
      "name": "Claude Code",
      "stat": "Sonnet 5 default",
      "color": "#D4A574",
      "desc": "Default surface for Sonnet 5 from Jul 1 · ~$2.5B annualized"
    },
    {
      "domain": "lovable.dev",
      "letter": "L",
      "name": "Lovable",
      "stat": "$600M annualized revenue",
      "color": "#7C4DFF",
      "desc": "September 24 company disclosure. No current employee denominator."
    },
    {
      "domain": "openai.com",
      "letter": "O",
      "name": "Work + Codex",
      "stat": "~10M WAU",
      "color": "#10A37F",
      "desc": "OpenAI platform bundle · doubled from 6M in nine days"
    },
    {
      "domain": "meta.com",
      "letter": "M",
      "name": "Muse Spark",
      "stat": "$1.25/$4.25",
      "color": "#1877F2",
      "desc": "Meta entered coding Jul 9 — its first paid Model API"
    },
    {
      "domain": "wabi.ai",
      "letter": "W",
      "name": "Wabi",
      "stat": "$20M pre-seed",
      "color": "#4ECDC4",
      "desc": "Software creation, reimagined",
      "dvc": true
    }
  ],
  "vibeStats": {
    "aiAuthoredCode": "42%",
    "dailyUseAmongTriers": "72%",
    "source": "SonarSource 2026 State of Code Developer Survey"
  },
  "physicalAI": {
    "note": "Industrial deployment, autonomous mobility and general-purpose robot intelligence have distinct populations."
  },
  "physicalAITiles": [
    {
      "category": "Autonomous mobility",
      "color": "#4CB5AB",
      "icon": "car",
      "company": "Waymo",
      "detail": "San Antonio, San Diego and Tampa open to everyone October 14. Availability is not unit economics."
    },
    {
      "category": "Industrial installed base",
      "color": "#4CB5AB",
      "icon": "truck",
      "company": "IFR",
      "detail": ">600,000 industrial installations in 2025; ~5M operating stock."
    },
    {
      "category": "Robot intelligence",
      "color": "#4CB5AB",
      "icon": "robotarm",
      "company": "Rhoda",
      "detail": "$450M Series A disclosed in March; video-based robot intelligence, not a humanoid.",
      "dvc": true
    }
  ],
  "physicalAIStats": [
    {
      "num": "~5M",
      "label": "Industrial robots operating · 2025",
      "accent": "#4CB5AB"
    },
    {
      "num": "59%",
      "label": "China share of 2025 industrial installs",
      "accent": "#4CB5AB"
    }
  ],
  "cyclePhases": [
    "Infrastructure buildout",
    "Platform consolidation",
    "Application dominance"
  ],
  "weAreHere": "Infrastructure buildout",
  "iframeEmbeds": {},
  "diveDeeperAnchors": {
    "1": "index.html#sec-0",
    "2": "index.html#sec-0",
    "3": "index.html#sec-1",
    "4": "index.html#sec-1",
    "5": "index.html#sec-2",
    "6": "index.html#sec-3",
    "7": "index.html#sec-3",
    "8": "index.html#sec-7",
    "9": "index.html#sec-7",
    "10": "index.html#sec-5",
    "11": "index.html#sec-4",
    "12": "index.html#sec-4",
    "13": "index.html#sec-9",
    "14": "index.html#sec-9",
    "15": "index.html#attack-angles-block",
    "16": "index.html#sec-healthcare-ai",
    "17": "index.html#sec-8",
    "18": "index.html#sec-14"
  }
};
root.SLIDES_DATA=D; })(typeof window !== "undefined" ? window : globalThis);
