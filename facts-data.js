/* October 16, 2026 evidence cut; historical baselines retain their dates. */
(function(root){"use strict";var D={
  "auditDate": "2026-10-16",
  "auditNote": "Disclosure dates are metric-specific. Historical transactions are not current market prices. Private-company operating results are unaudited unless explicitly established otherwise.",
  "anthropic": {
    "valuation": {
      "value": "$965B post-money",
      "asOf": "2026-05-28",
      "sourceUrl": "https://www.reuters.com/business/anthropic-raises-65-billion-now-valued-965-billion-2026-05-28/",
      "evidenceType": "wire-reported",
      "basis": "primary priced round — $65B Series H (Altimeter, Dragoneer, Greenoaks, Sequoia)"
    },
    "runRate": {
      "value": "$16.8B reported Q3 2026 revenue",
      "asOf": "2026-10-14",
      "sourceUrl": "https://www.reuters.com/business/finance/anthropics-q3-revenue-surges-45-nearly-17-billion-2026-10-14/",
      "evidenceType": "wire-reported",
      "basis": "Reported quarter, not run-rate. Reuters investor-day account: Q2 $11.6B; Q1 $4.7B. Adjusted profitability is not GAAP profitability.",
      "lastVerified": "2026-10-16"
    },
    "enterpriseShare": {
      "value": "43.8% Anthropic; 40.6% OpenAI; 55.9% any AI",
      "asOf": "2026-09-30",
      "sourceUrl": "https://ramp.com/data/ai-index-oct-2026",
      "evidenceType": "official",
      "basis": "September observed payments among Ramp businesses. Overlapping vendor adoption, not exclusive market share; October 14 release.",
      "lastVerified": "2026-10-16"
    },
    "flagship": {
      "value": "Fable 5.1 $10/$50; Opus 5.5 $4/$20; Sonnet 5.5 $2/$10; Haiku 5.5 $0.10/$0.50",
      "asOf": "2026-10-16",
      "sourceUrl": "https://docs.anthropic.com/en/docs/about-claude/pricing",
      "evidenceType": "official",
      "basis": "USD per million standard input/output tokens. Haiku price applies to prompts up to 100K input tokens; above that $0.50/$2.50. Cache, batch and regional pricing differ.",
      "lastVerified": "2026-10-16"
    },
    "seriesH": {
      "value": "$65B Series H at $965B post-money",
      "asOf": "2026-05-28",
      "sourceUrl": "https://www.reuters.com/business/anthropic-raises-65-billion-now-valued-965-billion-2026-05-28/",
      "evidenceType": "wire-reported",
      "basis": "largest private AI round of the 2025–26 period"
    }
  },
  "openai": {
    "valuation": {
      "value": "$852B post-money",
      "asOf": "2026-03-31",
      "sourceUrl": "https://openai.com/index/accelerating-the-next-phase-ai/",
      "evidenceType": "official",
      "basis": "primary priced round — $122B closed Mar 31 2026"
    },
    "arr": {
      "value": "Nearly $50B annualized September revenue",
      "asOf": "2026-10-08",
      "sourceUrl": "https://www.reuters.com/business/openais-annualized-revenue-20-billion-less-than-previously-signaled-ft-reports-2026-10-08/",
      "evidenceType": "wire-reported",
      "basis": "Corrects prior nearly $70B report. Cloud-partner revenue treatment differs from Anthropic. Not booked annual revenue.",
      "lastVerified": "2026-10-16"
    },
    "flagship": {
      "value": "GPT-6 Astra $10/$50; GPT-6.1 Sol $2/$10; GPT-6 Luna $0.10/$0.50",
      "asOf": "2026-10-16",
      "sourceUrl": "https://developers.openai.com/api/docs/pricing",
      "evidenceType": "official",
      "basis": "USD per million standard short-context input/output tokens. Cached input $1/$0.10/$0.01 respectively.",
      "lastVerified": "2026-10-16"
    },
    "microsoft": {
      "value": "Non-exclusive IP licence through 2032; OpenAI→Microsoft revenue share continues through 2030 at the same percentage subject to a total cap; Microsoft no longer pays revenue share to OpenAI",
      "asOf": "2026-04-27",
      "sourceUrl": "https://openai.com/index/next-phase-of-microsoft-partnership/",
      "evidenceType": "official",
      "basis": "amended agreement of Apr 27 2026; supersedes earlier reported terms"
    }
  },
  "google": {
    "capex2026": {
      "value": "$195–205B",
      "asOf": "2026-07-22",
      "sourceUrl": "https://insight.factset.com/hyperscalers-tap-external-financing-as-ai-capex-outruns-cash-flow",
      "evidenceType": "official",
      "basis": "FY2026 capex guidance raised on the July 22 2026 Q2 call from $180–190B"
    },
    "flagship": {
      "value": "Gemini 4 Argon: $2/$10 introductory; $4/$20 after November 30",
      "asOf": "2026-10-13",
      "sourceUrl": "https://cloud.google.com/blog/products/ai-machine-learning/gemini-4-argon-available-on-google-cloud",
      "evidenceType": "official",
      "basis": "USD per million input/output tokens. Launch price is temporary; cached-input discount is 95%.",
      "lastVerified": "2026-10-16"
    }
  },
  "meta": {
    "capex2026": {
      "value": "$130–145B",
      "asOf": "2026-07-29",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/0001326801/000162828026050596/meta-06302026xexhibit991.htm",
      "evidenceType": "official",
      "basis": "calendar-2026 capex guidance incl. finance-lease principal, narrowed on Jul 29 2026 from $125–145B (itself raised from $115–135B in April). ~$138B used as the midpoint anchor. Q2 capex $31.08B; Q2 FCF $0.8B; Q2 buybacks $0; Q2 net debt issuance $24.9B."
    },
    "flagship": {
      "value": "Muse Wonder and Muse Wonder Full",
      "asOf": "2026-10-12",
      "sourceUrl": "https://about.fb.com/news/2026/10/introducing-muse-wonder-models/",
      "evidenceType": "official",
      "basis": "Wonder through Meta Model API and Muse Code; Full for Muse Code subscribers. No API price or open-weight status inferred.",
      "lastVerified": "2026-10-16"
    }
  },
  "lovable": {
    "arr": {
      "value": "$600M annualized revenue",
      "asOf": "2026-09-24",
      "sourceUrl": "https://techcrunch.com/2026/09/24/lovables-annualized-revenue-crosses-600m-as-vibe-coding-takes-off/",
      "evidenceType": "company-disclosed",
      "basis": "Co-founder disclosure at HumanX. Run-rate, not contracted ARR. No current employee denominator disclosed.",
      "lastVerified": "2026-10-16"
    },
    "round": {
      "value": "$400M Series C at a $13.3B post-money valuation, co-led by Menlo Ventures and the Scaleup Europe Fund",
      "asOf": "2026-08-12",
      "sourceUrl": "https://techcrunch.com/2026/08/12/lovable-confirms-new-13-3b-valuation-raises-another-400m/",
      "evidenceType": "official",
      "basis": "company-confirmed close; doubles the $6.6B December 2025 mark. ~27× the $500M June ARR."
    }
  },
  "higgsfield": {
    "runRate": {
      "value": "More than $1B annualized revenue",
      "asOf": "2026-09-24",
      "sourceUrl": "https://www.bloomberg.com/news/articles/2026-09-24/ai-video-startup-higgsfield-eyes-1-billion-in-12-month-sales",
      "evidenceType": "company-disclosed",
      "basis": "Latest four weeks of revenue multiplied by 13, per CEO. Not contracted ARR or trailing-year revenue.",
      "lastVerified": "2026-10-16"
    },
    "round": {
      "value": "$400M Series B at a $5.4B valuation, led by DST Global",
      "asOf": "2026-08-17",
      "sourceUrl": "https://techcrunch.com/2026/08/17/higgsfield-raises-400m-series-b-quadrupling-its-valuation-in-8-months-to-5-4b/",
      "evidenceType": "official",
      "basis": "closed round; up from $1.3B at the January 2026 Series A. DVC portfolio company."
    }
  },
  "elevenlabs": {
    "arr": {
      "value": ">$500M ARR in the first four months of 2026",
      "asOf": "2026-05-05",
      "sourceUrl": "https://elevenlabs.io/blog/500m-arr-and-new-investors",
      "evidenceType": "company-disclosed",
      "basis": "Latest verified primary ARR milestone, not an October estimate. Company updated end-2025 baseline to $350M.",
      "lastVerified": "2026-10-16"
    },
    "raised": {
      "value": "$22B valuation in a $300M employee tender",
      "asOf": "2026-09-30",
      "sourceUrl": "https://elevenlabs.io/blog/tender-22bn",
      "evidenceType": "company-disclosed",
      "basis": "Secondary liquidity, not a primary financing. Enterprise is 55% of revenue; agents handle >15M conversations weekly.",
      "lastVerified": "2026-10-16"
    }
  },
  "harvey": {
    "valuation": {
      "value": "$15.5B primary-round valuation",
      "asOf": "2026-09-09",
      "sourceUrl": "https://www.harvey.ai/blog/harvey-raises-dollar550m-at-a-dollar155b-valuation-to-help-legal-teams-own-their-intelligence",
      "evidenceType": "company-disclosed",
      "basis": "$550M round co-led by Diffusion and Lightspeed. Legal software, not a law firm. No current ARR disclosed in this announcement.",
      "lastVerified": "2026-10-16"
    }
  },
  "sierra": {
    "valuation": {
      "value": "$15.8B post-money",
      "asOf": "2026-05-04",
      "sourceUrl": "https://www.adaptation.ai/insights/sierra-agent-platform",
      "evidenceType": "wire-reported",
      "basis": "$950M Series E, Tiger Global and GV"
    },
    "arr": {
      "value": ">$150M ARR in the company year-two review",
      "asOf": "2026-02-06",
      "sourceUrl": "https://sierra.ai/blog/year-two-in-review",
      "evidenceType": "company-disclosed",
      "basis": "Historical company milestone, not a new October estimate. The article’s $50M quarter is not interpreted as $50M ARR added.",
      "lastVerified": "2026-10-16"
    }
  },
  "decagon": {
    "valuation": {
      "value": "$4.5B",
      "asOf": "2026-01-31",
      "sourceUrl": "https://superframeworks.com/articles/best-ai-customer-support-tools",
      "evidenceType": "wire-reported",
      "basis": "$250M Series D, January 2026. NO revenue multiple is shown: the ~$35M ARR denominator previously used could not be sourced to anything better than an SEO aggregator, so the valuation is displayed without a multiple."
    }
  },
  "nvidia": {
    "quarter": {
      "value": "Q2 FY2027 revenue $96.2B (+106% YoY, +18% QoQ), data center $89.0B (+117%), GAAP gross margin 75.0%, net income $59.7B (+126%); Q3 FY2027 guided to ~$108B ±2%. Prior quarter (Q1 FY2027) $81.6B.",
      "asOf": "2026-08-26",
      "sourceUrl": "https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2027",
      "evidenceType": "official",
      "basis": "SINGLE QUARTER (Q2 FY2027, ended Jul 26 2026). Not comparable to the $215.9B annual figure. The $108B guide excludes any data-center compute revenue from China. Q2 equity-security gains were $7.771B of $59.688B net income (~13%)."
    },
    "year": {
      "value": "$215.9B FY2026 revenue (+65% YoY), gross margin 71.1%, data center revenue $193.7B",
      "asOf": "2026-01-31",
      "sourceUrl": "https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-first-quarter-fiscal-2027",
      "evidenceType": "official",
      "basis": "FISCAL YEAR ended January 2026. Not comparable to the $96.2B (Q2 FY2027) or $81.6B (Q1 FY2027) single-quarter figures."
    },
    "otherIncome": {
      "value": "$15.9B of other income against $58.3B of net income — 27.3%, roughly a quarter",
      "asOf": "2026-05-20",
      "sourceUrl": "https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-first-quarter-fiscal-2027",
      "evidenceType": "official",
      "basis": "GAAP EPS $2.39 vs non-GAAP EPS $1.87 shows the same point; the equity portfolio grew from ~$35.1B to ~$73.6B in the quarter"
    },
    "groq": {
      "value": "$20B non-exclusive technology licence plus asset purchase and acqui-hire (Dec 2025); NVIDIA states it did not acquire Groq",
      "asOf": "2025-12-24",
      "sourceUrl": "https://www.reuters.com/business/nvidia-buy-ai-chip-startup-groq-about-20-billion-cnbc-reports-2025-12-24/",
      "evidenceType": "wire-reported",
      "basis": "NOT an acquisition. NVIDIA licensed Groq’s inference technology non-exclusively and hired founder Jonathan Ross, president Sunny Madra and engineers; CNBC reported ~$20B cash for assets. Groq continues independently under CEO Simon Edwards and GroqCloud is uninterrupted. Senators Warren and Blumenthal are probing whether the structure evaded merger review."
    }
  },
  "etched": {
    "dvc": true,
    "round": {
      "value": "$700M financing at a $21B valuation, led by Jane Street",
      "asOf": "2026-08-18",
      "sourceUrl": "https://www.etched.com/progress/from-zero-to-one",
      "evidenceType": "company-disclosed",
      "basis": "Supersedes July $10.3B mark. Sequoia and others participated. First customer rack delivered; customer contracts are not recognized revenue.",
      "lastVerified": "2026-10-16"
    },
    "disclosure": {
      "value": "Etched IS a DVC portfolio company",
      "asOf": "2026-07-29",
      "sourceUrl": "https://www.linkedin.com/posts/davidovs-vc_ai-aiinfrastructure-semiconductors-activity-7487875223044943873-0ZCB",
      "evidenceType": "official",
      "basis": "Davidovs VC’s own public statement: \"DVC invested in Etched at an early stage.\" A firm’s own public statement about its own portfolio is first-party evidence."
    }
  },
  "capex": {
    "topFour2026": {
      "value": "~$733B midpoint; $720–745B guidance range",
      "asOf": "2026-10-16",
      "sourceUrl": "https://www.microsoft.com/en-us/investor/events/fy-2026/earnings-fy-2026-q4",
      "evidenceType": "dvc-analysis",
      "basis": "Amazon 220 + Alphabet 195–205 + Microsoft 175 + Meta 130–145 ($B). Mixed company-reported capex scopes, not pure AI spending.",
      "lastVerified": "2026-10-16"
    },
    "amazon": {
      "value": "~$220B",
      "asOf": "2026-07-30",
      "sourceUrl": "https://www.theglobeandmail.com/investing/markets/stocks/AMZN/pressreleases/3730734/amazon-amzn-q2-2026-earnings-call-transcript/",
      "evidenceType": "official",
      "basis": "calendar-2026 cash capex, raised from ~$200B on the Q2 call citing higher memory costs"
    },
    "alphabet": {
      "value": "~$200B ($195–205B)",
      "asOf": "2026-07-22",
      "sourceUrl": "https://insight.factset.com/hyperscalers-tap-external-financing-as-ai-capex-outruns-cash-flow",
      "evidenceType": "official",
      "basis": "FY2026 guidance raised July 22 2026"
    },
    "microsoft": {
      "value": "~$175B calendar-2026 reported capex",
      "asOf": "2026-07-29",
      "sourceUrl": "https://www.microsoft.com/en-us/investor/events/fy-2026/earnings-fy-2026-q4",
      "evidenceType": "official",
      "basis": "Finance-to-operating-lease reclassification changes presentation; underlying investment expectations are unchanged.",
      "lastVerified": "2026-10-16"
    },
    "meta": {
      "value": "~$138B",
      "asOf": "2026-07-29",
      "sourceUrl": "https://www.sec.gov/Archives/edgar/data/0001326801/000162828026050596/meta-06302026xexhibit991.htm",
      "evidenceType": "official",
      "basis": "midpoint ($137.5B) of $130–145B calendar-2026 guidance incl. finance-lease principal, narrowed from $125–145B"
    },
    "nuclear": {
      "value": "45 GW conditional SMR offtake pipeline",
      "asOf": "2026-10-16",
      "sourceUrl": "https://www.iea.org/news/data-centre-electricity-use-surged-in-2025-even-with-tightening-bottlenecks-driving-a-scramble-for-solutions",
      "evidenceType": "official",
      "basis": "IEA 2026, versus 25 GW at end-2024. Not operating generation or final investment decisions.",
      "lastVerified": "2026-10-16"
    },
    "projectKilby": {
      "value": "2.67 GW Project Kilby — 20-year PPA signed with Microsoft June 22 2026 under Chevron subsidiary Energy Forge One LLC, off-grid gas in Reeves County, Texas, first power 2028",
      "asOf": "2026-06-22",
      "sourceUrl": "https://techcrunch.com/2026/06/22/microsoft-and-chevron-plan-one-of-the-largest-gas-powered-data-center-projects-in-us/",
      "evidenceType": "wire-reported",
      "basis": "Chevron has NOT yet taken final investment decision (expected end-2026), so this is not yet committed capital. The Environmental Integrity Project estimates >13M tons of CO₂."
    }
  },
  "waymo": {
    "metros": {
      "value": "San Antonio, San Diego and Tampa open to everyone October 14",
      "asOf": "2026-10-14",
      "sourceUrl": "https://waymo.com/blog/",
      "evidenceType": "official",
      "basis": "Public access, not a count of testing, employee-only or invitation-only markets.",
      "lastVerified": "2026-10-16"
    },
    "rides": {
      "value": "~500,000 weekly paid rides: March disclosure",
      "asOf": "2026-03-27",
      "sourceUrl": "https://techcrunch.com/2026/03/27/waymo-skyrocketing-ridership-in-one-chart/",
      "evidenceType": "company-disclosed",
      "basis": "No newer tally verified in this refresh. Absence of a new disclosure does not establish flat operations.",
      "lastVerified": "2026-10-16"
    },
    "fleet": {
      "value": "4,000+ vehicles",
      "asOf": "2026-09-01",
      "sourceUrl": "https://roadsigns.com/blogs/resources/how-many-waymo-cars-are-there",
      "evidenceType": "official",
      "basis": "Waymo’s June 17 2026 NHTSA safety filing, up from 3,067 in December 2025"
    },
    "miles": {
      "value": "271M+ fully autonomous (rider-only) miles through June 2026",
      "asOf": "2026-06-30",
      "sourceUrl": "https://waymo.com/safety/impact/",
      "evidenceType": "official",
      "basis": "first-party; rider-only miles across five operating geographies. 94% fewer serious-or-fatal-injury crashes; now driving more than 4M miles every week."
    }
  },
  "rhoda": {
    "dvc": true,
    "description": {
      "value": "Video-based robot intelligence using Direct Video-Action; demonstrated platform is not a humanoid.",
      "asOf": "2026-08-04",
      "sourceUrl": "https://www.rhoda.ai/news/press-release",
      "evidenceType": "company-disclosed",
      "basis": "the single canonical description — supersedes earlier \"next-gen humanoid robots\" and \"foundational model for robotics\" copy"
    },
    "raised": {
      "value": "$450M Series A announced March 2026",
      "asOf": "2026-03-10",
      "sourceUrl": "https://www.rhoda.ai/news/press-release",
      "evidenceType": "company-disclosed",
      "basis": "Company announcement does not state a valuation.",
      "lastVerified": "2026-10-16"
    }
  },
  "funding": {
    "h1_2026": {
      "value": "OpenAI plus Anthropic absorbed $217B of $510B in H1 2026 — 43% of every venture dollar deployed globally. Excluding the two, H1 2026 global venture funding falls to roughly $293B, about where the market stood in H1 2021.",
      "asOf": "2026-07-02",
      "sourceUrl": "https://aiweekly.co/alerts/openai-and-anthropic-take-43-of-h1-2026-venture-funding",
      "evidenceType": "tracker",
      "basis": "Crunchbase H1 2026. Denominator is $510B, not $505B."
    },
    "q3_2026": {
      "value": "$159B global venture; $102B AI / 64%; $679B year to date",
      "asOf": "2026-10-05",
      "sourceUrl": "https://news.crunchbase.com/venture/q3-2026-global-startup-funding-ai-billion-dollar-rounds-exits-data/",
      "evidenceType": "official",
      "basis": "Crunchbase Q3 2026 data, reporting cut October 2. Not all private capital.",
      "lastVerified": "2026-10-16"
    }
  },
  "euAiAct": {
    "aug2026": {
      "value": "August 2, 2026 — GPAI enforcement powers and Article 50 transparency obligations",
      "asOf": "2026-08-03",
      "sourceUrl": "https://digital-strategy.ec.europa.eu/en/policies/enforcement-ai-act",
      "evidenceType": "official",
      "basis": "what actually activated. NOT full high-risk enforcement and NOT \"the majority of rules\"."
    },
    "highRisk": {
      "value": "Stand-alone Annex III high-risk obligations deferred from August 2, 2026 to December 2, 2027, and Annex I product-embedded high-risk to August 2, 2028, by the Digital Omnibus on AI (Regulation (EU) 2026/1744, OJ Jul 24, in force Jul 27 2026); Article 50 unchanged except a grace to December 2, 2026 for marking by generative systems already on the market",
      "asOf": "2026-08-03",
      "sourceUrl": "https://digital-strategy.ec.europa.eu/en/policies/enforcement-ai-act",
      "evidenceType": "official",
      "basis": "the Act now runs on two clocks"
    },
    "aug2027": {
      "value": "August 2, 2027 — GPAI models placed on the market before August 2, 2025 must be fully compliant",
      "asOf": "2026-08-03",
      "sourceUrl": "https://digital-strategy.ec.europa.eu/en/policies/enforcement-ai-act",
      "evidenceType": "official",
      "basis": "legacy-model compliance deadline — not a single \"full enforcement\" date"
    },
    "fines": {
      "value": "GPAI provider non-compliance: up to €15M or 3%; prohibited practices: €35M or 7%",
      "asOf": "2026-10-06",
      "sourceUrl": "https://digital-strategy.ec.europa.eu/en/policies/enforcement-ai-act",
      "evidenceType": "official",
      "basis": "Fine categories differ. The €7.5M/1% incorrect-information category is not the GPAI request-for-information penalty.",
      "lastVerified": "2026-10-16"
    },
    "newProhibitions": {
      "value": "December 2, 2026: additional CSAM and nonconsensual-intimate-material prohibitions",
      "asOf": "2026-10-06",
      "sourceUrl": "https://digital-strategy.ec.europa.eu/en/policies/enforcement-ai-act",
      "evidenceType": "official",
      "basis": "Separate from Annex III high-risk obligations on December 2, 2027 and product-embedded obligations on August 2, 2028.",
      "lastVerified": "2026-10-16"
    }
  },
  "noharm": {
    "benchmark": {
      "value": "1,100 tasks; 20 LLMs and 4 clinical RAG tools",
      "asOf": "2026-07-13",
      "sourceUrl": "https://arxiv.org/abs/2512.01241",
      "evidenceType": "official",
      "basis": "Latest v4 abstract. Task count is not a separately specified case count.",
      "lastVerified": "2026-10-16"
    },
    "findings": {
      "value": "Potential severe harm in up to 24.6% of cases; omissions >80% of severe errors",
      "asOf": "2026-07-13",
      "sourceUrl": "https://arxiv.org/abs/2512.01241",
      "evidenceType": "official",
      "basis": "Benchmark potential harm, not observed patient injury. AI assistance improved physician performance.",
      "lastVerified": "2026-10-16"
    }
  },
  "agentStack": {
    "scope": {
      "value": "47 mapped companies across 7 layers",
      "asOf": "2026-08-04",
      "sourceUrl": "",
      "evidenceType": "dvc-analysis",
      "basis": "company count only. The previously shown \"$1B+ combined funding\" total did not reconcile with the sum of the listed raises and has been removed rather than restated. Individual metrics as of Aug 4 2026."
    },
    "e2b": {
      "value": "88% of the Fortune 100 have signed up for E2B sandboxes",
      "asOf": "2026-08-04",
      "sourceUrl": "https://e2b.dev/",
      "evidenceType": "company-disclosed",
      "basis": "signups, not usage — the weaker and accurate verb"
    }
  },
  "inference": {
    "barbell": {
      "value": "Small models $0.10/$0.50; workhorse $2/$10; premium $10/$50",
      "asOf": "2026-10-16",
      "sourceUrl": "https://developers.openai.com/api/docs/pricing",
      "evidenceType": "official",
      "basis": "List input/output prices per million tokens, not measured cost per successful task. Haiku 5.5 now competes at the cheap short-context tier.",
      "lastVerified": "2026-10-16"
    }
  }
};root.FACTS=D;})(typeof window!=="undefined"?window:globalThis);
