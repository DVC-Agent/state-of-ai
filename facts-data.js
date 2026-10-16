/* ============================================================================
   facts-data.js — SINGLE SOURCE OF TRUTH for entity-level facts
   ----------------------------------------------------------------------------
   Created 2026-08-04 as part of the August 4 fact audit (306 material claims).

   Every record carries five fields so a reader (and the next refresh) can tell
   what a number actually is:
     value        — the figure or phrase as it should be rendered
     asOf         — the date the figure was true / disclosed
     sourceUrl    — the single best source (first-party > wire > analyst)
     evidenceType — official | company-disclosed | wire-reported | estimate |
                    rumour | tracker | dvc-analysis
     basis        — ARR vs run-rate, MAU vs WAU, primary vs secondary,
                    fiscal year vs quarter, program size vs cash, etc.

   Root cause of the August-4 audit's P0 list was architectural: the same fact
   lived in an August block, a legacy card, a tooltip, a chart array, a slide
   and a data file with no shared key. This file is the shared key.
   ============================================================================ */
(function (root) {
  'use strict';

  var F = {
    auditDate: '2026-10-16',
    auditNote: 'Figures checked against source on Aug 4, 2026. Private-company revenue is company-disclosed and unaudited unless marked otherwise.',

    /* ── LABS ───────────────────────────────────────────────────────────── */
    anthropic: {
      valuation: {
        value: '$965B post-money',
        asOf: '2026-05-28',
        sourceUrl: 'https://www.reuters.com/business/anthropic-raises-65-billion-now-valued-965-billion-2026-05-28/',
        evidenceType: 'wire-reported',
        basis: 'primary priced round — $65B Series H (Altimeter, Dragoneer, Greenoaks, Sequoia)'
      },
      runRate: {
        value: '$65B+ at end of July 2026 (Bloomberg), up from $47B in May and the company\u2019s own $30B disclosure in April; Q3 2026 revenue $16.8B, up ~45% from Q2 (Bloomberg, Oct 14, unaudited)',
        asOf: '2026-08-17',
        sourceUrl: 'https://fortune.com/2026/08/18/anthropic-annual-revenue-run-rate-65-billion/',
        evidenceType: 'wire-reported',
        basis: 'annualised run-rate, not recognised revenue; a time series ($14B Feb \u2192 $19B Mar \u2192 $30B Apr \u2192 $47B May, company-disclosed in the Series H post \u2192 $65B Jul), not a source conflict. Prospectus: Q2 2026 revenue $11.5B; 2025 revenue ~$4.6B.'
      },
      multiple: {
        value: '~15\u00d7',
        asOf: '2026-06-12',
        sourceUrl: 'https://www.reuters.com/business/anthropic-raises-65-billion-now-valued-965-billion-2026-05-28/',
        evidenceType: 'dvc-analysis',
        basis: '$965B primary mark \u00f7 $65B run-rate (end of July 2026)'
      },
      enterpriseShare: {
        value: '43.8% of US businesses pay for Anthropic vs OpenAI\u2019s 40.6%',
        asOf: '2026-10-14',
        sourceUrl: 'https://ramp.com/data/ai-index-oct-2026',
        evidenceType: 'official',
        basis: 'Ramp AI Index, October 2026 release (September data); lead narrowed to 3.2 pts, overall adoption 55.9%, token spend flat two months running; corporate-card transaction data across Ramp customers, skewed to startups and SMBs — not US-wide market share.'
      },
      flagship: {
        value: 'Claude Fable 5.1 (Sep 1 2026, $10/$50 per 1M tokens, cache reads cut 75%); followed by Opus 5.5 (Sep 22) and Sonnet 5.5 (Sep 28)',
        asOf: '2026-09-28',
        sourceUrl: 'https://www.anthropic.com/claude-fable-and-mythos-5-1',
        evidenceType: 'official',
        basis: 'generally available flagship. Mythos 5 is the same weights with safeguards lifted and is restricted to Project Glasswing partners \u2014 not purchasable.'
      },
      claudeCode: {
        value: '~$2.5B annualised',
        asOf: '2026-02-12',
        sourceUrl: 'https://www.anthropic.com/news/anthropic-raises-30-billion-series-g-funding-380-billion-post-money-valuation',
        evidenceType: 'company-disclosed',
        basis: 'last disclosed Feb 2026; total run-rate has since gone $14B \u2192 $65B+, so this line is almost certainly stale'
      },
      seriesH: {
        value: '$65B Series H at $965B post-money',
        asOf: '2026-05-28',
        sourceUrl: 'https://www.reuters.com/business/anthropic-raises-65-billion-now-valued-965-billion-2026-05-28/',
        evidenceType: 'wire-reported',
        basis: 'largest private AI round of the 2025\u201326 period'
      }
    },

    openai: {
      valuation: {
        value: '$852B post-money',
        asOf: '2026-03-31',
        sourceUrl: 'https://openai.com/index/accelerating-the-next-phase-ai/',
        evidenceType: 'official',
        basis: 'primary priced round \u2014 $122B closed Mar 31 2026'
      },
      secondary: {
        value: '~$880\u2013895B implied in secondaries',
        asOf: '2026-06-26',
        sourceUrl: 'https://forgeglobal.com/openai_ipo/',
        evidenceType: 'tracker',
        basis: 'Forge Global derived price (~$721.85/share, late June 2026) \u2014 secondary print, not a priced primary round'
      },
      users: {
        value: '~1B monthly active users on the ChatGPT mobile apps',
        asOf: '2026-05-31',
        sourceUrl: 'https://www.reuters.com/technology/chatgpt-app-hits-1-billion-monthly-active-users-record-time-data-shows-2026-06-02/',
        evidenceType: 'estimate',
        basis: 'Sensor Tower third-party estimate, iOS + Android apps only \u2014 excludes chatgpt.com web, API and enterprise. OpenAI\u2019s own last disclosure is 900M weekly actives (Feb 2026).'
      },
      wau: {
        value: '1.2B weekly users',
        asOf: '2026-09-29',
        sourceUrl: 'https://openai.com/index/accelerating-the-next-phase-ai/',
        evidenceType: 'company-disclosed',
        basis: 'stated at DevDay, Sep 29 2026 (The Decoder); plus 2.5M businesses on OpenAI products. Not comparable to the mobile MAU estimate.'
      },
      arr: {
        value: '~$50B annualised revenue at end-September 2026 on OpenAI\u2019s net basis; ~$70B gross-equivalent; targets \u2265$70B by year-end',
        asOf: '2026-10-08',
        sourceUrl: 'https://news.bloombergtax.com/artificial-intelligence/openais-annualized-revenue-nears-50-billion-ft-says',
        evidenceType: 'wire-reported',
        basis: 'FT via Bloomberg. The ~$70B reported Sep 29 grossed up partner and cloud sales the way Anthropic counts them; later source wins. Run-rate was ~$25B Feb\u2013May, >$40B in August. Q3 run-rate +77%, enterprise +107%.'
      },
      flagship: {
        value: 'GPT-6 Astra (GA Sep 4 2026) at $10/$50; GPT-6 Sol / Luna (Sep 22) at $2/$10 and $0.10/$0.50 per 1M tokens',
        asOf: '2026-09-22',
        sourceUrl: 'https://developers.openai.com/api/docs/pricing',
        evidenceType: 'wire-reported',
        basis: 'published API list prices'
      },
      microsoft: {
        value: 'Non-exclusive IP licence through 2032; OpenAI\u2192Microsoft revenue share continues through 2030 at the same percentage subject to a total cap; Microsoft no longer pays revenue share to OpenAI',
        asOf: '2026-04-27',
        sourceUrl: 'https://openai.com/index/next-phase-of-microsoft-partnership/',
        evidenceType: 'official',
        basis: 'amended agreement of Apr 27 2026; supersedes earlier reported terms'
      }
    },

    google: {
      geminiMau: {
        value: '1B+ Gemini app monthly active users',
        asOf: '2026-08-11',
        sourceUrl: 'https://blog.google/innovation-and-ai/products/gemini-app/one-billion-monthly-users/',
        evidenceType: 'company-disclosed',
        basis: 'Gemini app MAU, up from 750M disclosed in February 2026'
      },
      capex2026: {
        value: '$195\u2013205B',
        asOf: '2026-07-22',
        sourceUrl: 'https://www.sec.gov/Archives/edgar/data/0001652044/000165204426000066/googexhibit991q22026.htm',
        evidenceType: 'official',
        basis: 'FY2026 capex guidance raised on the July 22 2026 Q2 call from $180\u2013190B (Alphabet Q2 release; FactSet\u2019s page still showed the old range)'
      },
      fcf: {
        value: 'Q2 2026 free cash flow of \u2212$5.9B \u2014 first negative quarter since the 2004 IPO',
        asOf: '2026-07-22',
        sourceUrl: 'https://europeanbusinessmagazine.com/google-ai-billion-spending-turns-cash-flow-negative/',
        evidenceType: 'wire-reported',
        basis: 'operating cash flow $39.1B less capex $44.9B; revenue $119.8B (+24%)'
      },
      equityRaise: {
        value: '$84.75B equity capital raise program',
        asOf: '2026-06-03',
        sourceUrl: 'https://abc.xyz/investor/news/news-details/2026/Alphabet-Announces-Upsize-and-Pricing-of-84-75-Billion-Equity-Capital-Raise-to-Expand-AI-Infrastructure--and-Compute-2026-QzN3D9yMAj/default.aspx',
        evidenceType: 'official',
        basis: 'announced PROGRAM SIZE, not cash collected \u2014 $18B common, $16.75B mandatory convertible preferred, $10B Berkshire private placement, $40B at-the-market. Net proceeds recognised in the June quarter were roughly $30.5B + $19.1B.'
      },
      buybacks: {
        value: '$0',
        asOf: '2026-07-22',
        sourceUrl: 'https://europeanbusinessmagazine.com/google-ai-billion-spending-turns-cash-flow-negative/',
        evidenceType: 'wire-reported',
        basis: 'buybacks halted at both Alphabet and Meta in 2026; the prior comparison point was $13.2B in Q2 2025'
      }
    },

    meta: {
      capex2026: {
        value: '$130\u2013145B',
        asOf: '2026-07-29',
        sourceUrl: 'https://www.sec.gov/Archives/edgar/data/0001326801/000162828026050596/meta-06302026xexhibit991.htm',
        evidenceType: 'official',
        basis: 'calendar-2026 capex guidance incl. finance-lease principal, narrowed on Jul 29 2026 from $125\u2013145B (itself raised from $115\u2013135B in April). ~$138B used as the midpoint anchor. Q2 capex $31.08B; Q2 FCF $0.8B; Q2 buybacks $0; Q2 net debt issuance $24.9B.'
      },
      metaAiUsers: {
        value: '1.2B Meta AI MAU / 800M WAU',
        asOf: '2026-07-30',
        sourceUrl: 'https://about.fb.com/news/',
        evidenceType: 'company-disclosed',
        basis: 'embedded reach across Facebook, Instagram and WhatsApp \u2014 a distribution number, not a chosen-assistant number. Not found in Meta\u2019s Q2 release or call coverage (Oct 16 audit): unverified.'
      },
      museAgent: {
        value: 'Muse personal agent launched Sep 8 2026 (free tier, $20 and $100 plans; small-business version Sep 29); ~4M users by early October',
        asOf: '2026-10-06',
        sourceUrl: 'https://www.axios.com/2026/09/08/meta-debuts-muse-personal-ai-agent',
        evidenceType: 'wire-reported',
        basis: 'Axios (launch, pricing), CNBC (small business, Sep 29), TIME (4M users, Oct 6). Runs on Muse Spark in a per-user cloud VM with a visible browser.'
      },
      museWonder: {
        value: 'Muse Wonder (Oct 12 2026), Meta\u2019s first frontier model, $4/$20 per 1M tokens, 1M context; Wonder Full limited to Muse Code subscribers',
        asOf: '2026-10-12',
        sourceUrl: 'https://techcrunch.com/2026/10/12/meta-releases-its-first-frontier-model-muse-wonder/',
        evidenceType: 'official',
        basis: 'Benchmarks are Meta\u2019s own; Artificial Analysis: Wonder Full 56, Wonder 52, Claude Opus 5.5 58.'
      }
    },

    /* ── APPLICATION LAYER ──────────────────────────────────────────────── */
    cursor: {
      arr: {
        value: '$4B ARR, of which ~$2.6B enterprise',
        asOf: '2026-06-16',
        sourceUrl: 'https://www.reuters.com/legal/transactional/spacex-buy-anysphere-60-billion-2026-06-16/',
        evidenceType: 'wire-reported',
        basis: 'annualised revenue as of early June 2026, per company data provided to Reuters; up from ~$1B in November 2025'
      },
      deal: {
        value: '$60B all-stock acquisition by SpaceX, signed June 16 2026 and completed August 14 2026',
        asOf: '2026-08-14',
        sourceUrl: 'https://www.techzine.eu/news/devops/143619/spacex-completes-acquisition-of-cursor/',
        evidenceType: 'wire-reported',
        basis: 'CLOSED. Effective Aug 14 2026 per regulatory filing (Bloomberg). The April option was exercised on June 16.'
      },
      multiple: {
        value: '~15\u00d7 LTM',
        asOf: '2026-06-16',
        sourceUrl: 'https://finance.yahoo.com/technology/ai/articles/why-spacexs-acquisition-cursor-ai-121100165.html',
        evidenceType: 'dvc-analysis',
        basis: '$60B \u00f7 $4B ARR. Gross margin is close to negative once model-token pass-through is counted (DVC analysis), so a mid-teens revenue multiple is the expected outcome.'
      },
      share: {
        value: '26% of a $9.5B AI coding market \u2014 down from ~41% in June 2025',
        asOf: '2026-05-31',
        sourceUrl: 'https://www.cnbc.com/2026/06/16/spacex-spcx-cursor-acquisition-ipo.html',
        evidenceType: 'tracker',
        basis: 'Ramp corporate-spend share; Anthropic now holds roughly half the segment'
      }
    },

    lovable: {
      arr: {
        value: '$500M ARR in June 2026 on 146 employees (~$3.4M per head)',
        asOf: '2026-06-30',
        sourceUrl: 'https://techcrunch.com/2026/07/08/lovable-reportedly-in-talks-to-double-its-valuation-to-13-2b/',
        evidenceType: 'company-disclosed',
        basis: 'annualised run-rate, company-disclosed and unaudited; $400M in February 2026'
      },
      round: {
        value: '$400M Series C at a $13.3B post-money valuation, co-led by Menlo Ventures and the Scaleup Europe Fund',
        asOf: '2026-08-12',
        sourceUrl: 'https://techcrunch.com/2026/08/12/lovable-confirms-new-13-3b-valuation-raises-another-400m/',
        evidenceType: 'official',
        basis: 'company-confirmed close; doubles the $6.6B December 2025 mark. ~27\u00d7 the $500M June ARR.'
      }
    },

    higgsfield: {
      runRate: {
        value: '$1B ARR (September 2026), up from ~$700M in August; reported cash-flow positive in June',
        asOf: '2026-09-24',
        sourceUrl: 'https://www.bloomberg.com/news/articles/2026-09-24/ai-video-startup-higgsfield-eyes-1-billion-in-12-month-sales',
        evidenceType: 'company-disclosed',
        basis: 'company-disclosed and unaudited. Up from ~$200M at end-2025 and ~$700M in August 2026. Sacra independently estimates ~$400M as of May 2026. ~70% of revenue reported as enterprise.'
      },
      round: {
        value: '$400M Series B at a $5.4B valuation, led by DST Global',
        asOf: '2026-08-17',
        sourceUrl: 'https://techcrunch.com/2026/08/17/higgsfield-raises-400m-series-b-quadrupling-its-valuation-in-8-months-to-5-4b/',
        evidenceType: 'official',
        basis: 'closed round; up from $1.3B at the January 2026 Series A. DVC portfolio company.'
      }
    },

    elevenlabs: {
      arr: {
        value: '$600M ARR',
        asOf: '2026-07-21',
        sourceUrl: 'https://www.postbeam.ai/blog/how-elevenlabs-grows',
        evidenceType: 'company-disclosed',
        basis: 'stated by the CEO at the All-In conference, July 2026; company-disclosed and unaudited. Up from $330M at end-2025 (~175% YoY).'
      },
      raised: {
        value: '$22B valuation in a $300M employee tender (Wellington, T. Rowe Price); $11B at the February 2026 Series D',
        asOf: '2026-09-30',
        sourceUrl: 'https://techcrunch.com/2026/09/30/ai-voice-startup-elevenlabs-doubles-valuation-to-22b/',
        evidenceType: 'wire-reported',
        basis: 'secondary tender, not a primary round; ~37× the $600M July ARR'
      }
    },

    perplexity: {
      arr: {
        value: '>$750M annualised revenue by August 2026, up from >$450M in March',
        asOf: '2026-08-24',
        sourceUrl: 'https://the-decoder.com/nvidia-in-talks-to-invest-in-perplexity-at-30-billion-plus-valuation/',
        evidenceType: 'wire-reported',
        basis: 'FT reporting of a ~50% one-month rise from ~$305M following the February 25 2026 launch of Computer; ~$500M is a Sacra estimate'
      },
      valuation: {
        value: '~$22.6B',
        asOf: '2026-01-09',
        sourceUrl: 'https://sacra.com/c/perplexity/',
        evidenceType: 'tracker',
        basis: 'Series E-6, January 2026; tracker-grade. $20B is the last press-confirmed priced round.'
      },
      multiple: {
        value: '~45\u201350\u00d7',
        asOf: '2026-04-30',
        sourceUrl: 'https://sacra.com/c/perplexity/',
        evidenceType: 'dvc-analysis',
        basis: '~$22.6B \u00f7 ~$450\u2013500M ARR'
      },
      computerLaunch: {
        value: 'Perplexity Computer launched February 25, 2026',
        asOf: '2026-02-25',
        sourceUrl: 'https://sacra.com/c/perplexity/',
        evidenceType: 'wire-reported',
        basis: 'launch date; orchestrates up to 19 models in parallel'
      }
    },

    harvey: {
      valuation: {
        value: '$11B',
        asOf: '2026-03-25',
        sourceUrl: 'https://www.harvey.ai/blog/harvey-raises-growth-round-at-dollar11-billion-valuation-co-led-by-gic-and-sequoia',
        evidenceType: 'official',
        basis: '$200M growth round co-led by GIC and Sequoia, first-party confirmed'
      },
      arr: {
        value: '~$190M ARR (January 2026)',
        asOf: '2026-01-31',
        sourceUrl: 'https://techcrunch.com/2026/02/09/harvey-reportedly-raising-at-11b-valuation-just-months-after-it-hit-8b/',
        evidenceType: 'company-disclosed',
        basis: 'stated by CEO Winston Weinberg; Sacra estimates $195M at end-2025. No credible source supports ~$300M.'
      },
      multiple: {
        value: '~58\u00d7',
        asOf: '2026-01-31',
        sourceUrl: 'https://techcrunch.com/2026/02/09/harvey-reportedly-raising-at-11b-valuation-just-months-after-it-hit-8b/',
        evidenceType: 'dvc-analysis',
        basis: '$11B \u00f7 ~$190M ARR'
      }
    },

    sierra: {
      valuation: {
        value: '$15.8B post-money',
        asOf: '2026-05-04',
        sourceUrl: 'https://www.adaptation.ai/insights/sierra-agent-platform',
        evidenceType: 'wire-reported',
        basis: '$950M Series E, Tiger Global and GV'
      },
      arr: {
        value: '~$165M ARR',
        asOf: '2026-05-31',
        sourceUrl: 'https://www.adaptation.ai/insights/sierra-agent-platform',
        evidenceType: 'company-disclosed',
        basis: 'stated by Bret Taylor one month into the ninth quarter; TechCrunch reports ~$150M at eight quarters'
      },
      multiple: {
        value: '~96\u00d7',
        asOf: '2026-05-31',
        sourceUrl: 'https://www.adaptation.ai/insights/sierra-agent-platform',
        evidenceType: 'dvc-analysis',
        basis: '$15.8B \u00f7 ~$165M ARR'
      }
    },

    decagon: {
      valuation: {
        value: '$4.5B',
        asOf: '2026-01-31',
        sourceUrl: 'https://superframeworks.com/articles/best-ai-customer-support-tools',
        evidenceType: 'wire-reported',
        basis: '$250M Series D, January 2026. NO revenue multiple is shown: the ~$35M ARR denominator previously used could not be sourced to anything better than an SEO aggregator, so the valuation is displayed without a multiple.'
      }
    },

    /* ── SILICON, CAPEX, POWER ──────────────────────────────────────────── */
    nvidia: {
      quarter: {
        value: 'Q2 FY2027 revenue $96.2B (+106% YoY, +18% QoQ), data center $89.0B (+117%), GAAP gross margin 75.0%, net income $59.7B (+126%); Q3 FY2027 guided to ~$108B \u00b12%. Prior quarter (Q1 FY2027) $81.6B.',
        asOf: '2026-08-26',
        sourceUrl: 'https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2027',
        evidenceType: 'official',
        basis: 'SINGLE QUARTER (Q2 FY2027, ended Jul 26 2026). Not comparable to the $215.9B annual figure. The $108B guide excludes any data-center compute revenue from China. Q2 equity-security gains were $7.771B of $59.688B net income (~13%).'
      },
      year: {
        value: '$215.9B FY2026 revenue (+65% YoY), gross margin 71.1%, data center revenue $193.7B',
        asOf: '2026-01-31',
        sourceUrl: 'https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-first-quarter-fiscal-2027',
        evidenceType: 'official',
        basis: 'FISCAL YEAR ended January 2026. Not comparable to the $96.2B (Q2 FY2027) or $81.6B (Q1 FY2027) single-quarter figures.'
      },
      otherIncome: {
        value: '$15.9B of other income against $58.3B of net income \u2014 27.3%, roughly a quarter',
        asOf: '2026-05-20',
        sourceUrl: 'https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-first-quarter-fiscal-2027',
        evidenceType: 'official',
        basis: 'GAAP EPS $2.39 vs non-GAAP EPS $1.87 shows the same point; the equity portfolio grew from ~$35.1B to ~$73.6B in the quarter'
      },
      groq: {
        value: '$20B non-exclusive technology licence plus asset purchase and acqui-hire (Dec 2025); NVIDIA states it did not acquire Groq',
        asOf: '2025-12-24',
        sourceUrl: 'https://www.reuters.com/business/nvidia-buy-ai-chip-startup-groq-about-20-billion-cnbc-reports-2025-12-24/',
        evidenceType: 'wire-reported',
        basis: 'NOT an acquisition. NVIDIA licensed Groq\u2019s inference technology non-exclusively and hired founder Jonathan Ross, president Sunny Madra and engineers; CNBC reported ~$20B cash for assets. Groq continues independently under CEO Simon Edwards and GroqCloud is uninterrupted. Senators Warren and Blumenthal are probing whether the structure evaded merger review.'
      }
    },

    etched: {
      dvc: true,
      round: {
        value: '$700M at a $21B valuation, led by Jane Street (Aug 18 2026); follows a $300M Series C at $10.3B (Jul 23, Sequoia with a16z, Jane Street and SK Hynix)',
        asOf: '2026-08-18',
        sourceUrl: 'https://techcrunch.com/2026/08/18/etcheds-valuation-doubles-to-21b-in-a-month/',
        evidenceType: 'wire-reported',
        basis: 'Jane Street tested, bought and runs Etched hardware. >$1B in customer contracts is company-stated. TechCrunch lists both Argo and Diffusion as investors. July round, valuation, date and lead confirmed. The previously shown "$1B of pre-orders" is removed: no source states it.'
      },
      disclosure: {
        value: 'Etched IS a DVC portfolio company',
        asOf: '2026-07-29',
        sourceUrl: 'https://www.linkedin.com/posts/davidovs-vc_ai-aiinfrastructure-semiconductors-activity-7487875223044943873-0ZCB',
        evidenceType: 'official',
        basis: 'Davidovs VC\u2019s own public statement: "DVC invested in Etched at an early stage." A firm\u2019s own public statement about its own portfolio is first-party evidence.'
      }
    },

    capex: {
      topFour2026: {
        value: '~$735B midpoint, up to ~$745B top end',
        asOf: '2026-07-30',
        sourceUrl: 'https://insight.factset.com/hyperscalers-tap-external-financing-as-ai-capex-outruns-cash-flow',
        evidenceType: 'official',
        basis: 'sum of company guidance midpoints: Amazon ~$220B (raised Jul 30 2026) + Alphabet ~$200B ($195\u2013205B) + Microsoft ~$175B (calendar 2026, reported basis: Jul 29 lease reclassification moved ~$15B from finance to operating leases, plan unchanged) + Meta ~$137.5B ($130\u2013145B, narrowed Jul 29). Calendar 2026. Top end 220 + 205 + 175 + 145.'
      },
      base2025: {
        value: '~$402\u2013410B',
        asOf: '2026-04-29',
        sourceUrl: 'https://analysis-atlas.com/research/hyperscaler-ai-capex-2026/',
        evidenceType: 'estimate',
        basis: 'top-four calendar-2025 capex; the ~+80% step-up to 2026 only works off this base'
      },
      amazon: { value: '~$220B', asOf: '2026-07-30', sourceUrl: 'https://www.theglobeandmail.com/investing/markets/stocks/AMZN/pressreleases/3730734/amazon-amzn-q2-2026-earnings-call-transcript/', evidenceType: 'official', basis: 'calendar-2026 cash capex, raised from ~$200B on the Q2 call citing higher memory costs' },
      alphabet: { value: '~$200B ($195\u2013205B)', asOf: '2026-07-22', sourceUrl: 'https://www.sec.gov/Archives/edgar/data/0001652044/000165204426000066/googexhibit991q22026.htm', evidenceType: 'official', basis: 'FY2026 guidance raised July 22 2026' },
      microsoft: { value: '~$175B', asOf: '2026-07-29', sourceUrl: 'https://www.microsoft.com/en-us/investor/events/fy-2026/earnings-fy-2026-q4', evidenceType: 'official', basis: 'calendar-2026, reported basis. CFO: plan unchanged, but more leases shift from finance to operating, which adjusts the expectation to ~$175B (was ~$190B). Q1 FY27 capex guided above $50B.' },
      oracle: { value: '$55.7B', asOf: '2026-06-22', sourceUrl: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=1341439&type=10-K', evidenceType: 'official', basis: 'FY2026 (ended May 31 2026) capex per 10-K; FY2027 guided to $90\u201395B gross, no more than $70B net cash' },
      meta: { value: '~$138B', asOf: '2026-07-29', sourceUrl: 'https://www.sec.gov/Archives/edgar/data/0001326801/000162828026050596/meta-06302026xexhibit991.htm', evidenceType: 'official', basis: 'midpoint ($137.5B) of $130\u2013145B calendar-2026 guidance incl. finance-lease principal, narrowed from $125\u2013145B' },
      debtShare: {
        value: '9% \u2192 32% incremental annual debt as a share of hyperscaler capex, FY24 \u2192 LTM mid-2026',
        asOf: '2026-07-27',
        sourceUrl: 'https://insight.factset.com/hyperscalers-tap-external-financing-as-ai-capex-outruns-cash-flow',
        evidenceType: 'official',
        basis: 'FactSet; strongest quantitative claim in the infrastructure section'
      },
      nuclear: {
        value: '9.8 GW committed across 13 hyperscaler nuclear deals (tracker, updated Jul 6 2026); 1.92 GW actually operational (Amazon\u2013Talen); plus Google\u2013Constellation 890 MW of new uprate capacity (Oct 6 2026)',
        asOf: '2026-10-06',
        sourceUrl: 'https://smrintel.com/nuclear-data-center-deals/',
        evidenceType: 'tracker',
        basis: 'SMR Intel deal tracker, last updated Jul 6 2026 (9.8 GW / 13 deals unchanged; the page no longer shows an operational figure, so the 1.92 GW is sourced to the Amazon\u2013Talen 1,920 MW contract itself). Four apparently independent trackers all trace to this one tracker \u2014 it is one source, not four. The 1.92 GW is a single deal: Amazon\u2019s front-of-meter PPA with Talen for Susquehanna (the 960 MW figure is the plant-side half of the same arrangement).'
      },
      projectKilby: {
        value: '2.67 GW Project Kilby \u2014 20-year PPA signed with Microsoft June 22 2026 under Chevron subsidiary Energy Forge One LLC, off-grid gas in Reeves County, Texas, first power 2028',
        asOf: '2026-06-22',
        sourceUrl: 'https://techcrunch.com/2026/06/22/microsoft-and-chevron-plan-one-of-the-largest-gas-powered-data-center-projects-in-us/',
        evidenceType: 'wire-reported',
        basis: 'Chevron has NOT yet taken final investment decision: expected end-2026, it could slip to 2027 after Texas paused TCEQ environmental permits for data centres on Sep 21 2026 (The Next Web, Oct 1). First power still targeted for 2028. The Environmental Integrity Project estimates >13M tons of CO\u2082.'
      }
    },

    /* ── PHYSICAL AI ────────────────────────────────────────────────────── */
    waymo: {
      metros: {
        value: '15 commercial US markets \u2014 San Antonio (incl. airport), San Diego and Tampa opened to all riders on October 14 2026; Denver opened Sep 1 and Las Vegas Sep 14 (invite codes); Toronto announced Oct 16 for 2028',
        asOf: '2026-10-16',
        sourceUrl: 'https://www.cnbc.com/2026/07/08/waymo-starts-driverless-rides-in-san-diego-las-vegas-tampa-denver.html',
        evidenceType: 'wire-reported',
        basis: 'public commercial service vs employee-only. Phoenix, SF Bay Area, LA, Austin, Atlanta, Dallas, Houston, San Antonio, Orlando, Miami, Nashville.'
      },
      rides: {
        value: '~500,000 paid rides/week \u2014 unchanged since the March 2026 disclosure',
        asOf: '2026-03-27',
        sourceUrl: 'https://techcrunch.com/2026/03/27/waymo-skyrocketing-ridership-in-one-chart/',
        evidenceType: 'company-disclosed',
        basis: 'the flatness is the material fact: the 1M-by-year-end target needs a 2\u00d7 in five months'
      },
      fleet: {
        value: '~3,871 vehicles',
        asOf: '2026-06-17',
        sourceUrl: 'https://www.nhtsa.gov/recalls',
        evidenceType: 'official',
        basis: 'Waymo\u2019s June 17 2026 NHTSA filing, up from 3,067 in December 2025. Waymo publishes no fleet count; the \u201c4,000+\u201d in circulation traces only to a blog.'
      },
      miles: {
        value: '271M+ fully autonomous (rider-only) miles through June 2026',
        asOf: '2026-06-30',
        sourceUrl: 'https://waymo.com/safety/impact/',
        evidenceType: 'official',
        basis: 'first-party; rider-only miles across five operating geographies. 95% fewer serious-injury-or-worse crashes and 82% fewer injury crashes than human drivers (Waymo, Sep 24 2026); the page says \u201cmillions of miles per week\u201d.'
      }
    },

    tesla: {
      miles: {
        value: '2.5M cumulative paid customer miles, of which 380,000 without an in-vehicle safety monitor',
        asOf: '2026-07-23',
        sourceUrl: 'https://www.reuters.com/business/autos-transportation/teslas-once-bullish-tone-robotaxis-shifts-2026-07-23/',
        evidenceType: 'company-disclosed',
        basis: 'disclosed on the Q2 2026 call'
      },
      unsupervised: {
        value: '1M+ cumulative unsupervised Robotaxi miles, claimed at the Cybercab launch event; paid public Cybercab rides began in Austin on September 4 2026',
        asOf: '2026-09-03',
        sourceUrl: 'https://electrek.co/2026/09/03/tesla-announces-1-million-unsupervised-miles-driven-by-robotaxi/',
        evidenceType: 'company-disclosed',
        basis: 'stated by Tesla’s VP of AI Software; up from 380,000 on the July 22 Q2 call. Not audited, and no fleet size or ride counts were disclosed'
      },
      trend: {
        value: 'Paid mileage fell quarter over quarter \u2014 roughly 1.1M miles added in Q1 2026 against roughly 700K in Q2, a ~36% decline on the most widely reported read of Tesla\u2019s own cumulative chart (Electrek reads both quarters at ~900K)',
        asOf: '2026-07-23',
        sourceUrl: 'https://finance.yahoo.com/technology/ai/articles/tesla-robotaxis-moving-reverse-162959622.html',
        evidenceType: 'wire-reported',
        basis: 'derived from Tesla\u2019s cumulative chart; readings differ. Either way there was no acceleration despite expanding to seven metros.'
      },
      safety: {
        value: 'Tesla\u2019s VP of AI claimed \u201czero notable incidents\u201d across the 380,000 unsupervised miles without defining \u201cnotable\u201d, while Tesla\u2019s own NHTSA disclosures show 22 crashes reported for the robotaxi system',
        asOf: '2026-07-23',
        sourceUrl: 'https://finance.yahoo.com/technology/ai/articles/tesla-robotaxis-moving-reverse-162959622.html',
        evidenceType: 'wire-reported',
        basis: 'company claim balanced against the federal crash reports'
      }
    },

    rhoda: {
      dvc: true,
      figures: {
        value: '$450M Series A at a $1.7B valuation',
        asOf: '2026-03-10',
        sourceUrl: 'https://www.bloomberg.com/news/articles/2026-03-10/ai-robotics-startup-rhoda-valued-at-1-7-billion-in-new-funding',
        evidenceType: 'wire-reported',
        basis: 'Series A led by Premji Invest with Khosla, Temasek, Mayfield and Capricorn; the only public valuation mark'
      },
      description: {
        value: 'Two-arm general-purpose robot using video models for physical imagination. Not a humanoid.',
        asOf: '2026-08-04',
        sourceUrl: '',
        evidenceType: 'company-disclosed',
        basis: 'the single canonical description \u2014 supersedes earlier "next-gen humanoid robots" and "foundational model for robotics" copy'
      }
    },

    figureAi: {
      valuation: {
        value: '$39B, self-reported, September 2025',
        asOf: '2025-09-16',
        sourceUrl: 'https://www.figure.ai/news/series-c',
        evidenceType: 'company-disclosed',
        basis: 'set by Figure\u2019s own Series C announcement; a year-old self-reported mark on ~$2.34B raised, with no new primary round priced as of September 2026'
      }
    },

    apptronik: {
      raised: {
        value: '~$1.45B+ raised in total, including a $935M round at a >$5.5B valuation',
        asOf: '2026-07-05',
        sourceUrl: 'https://techcrunch.com/2026/07/05/this-humanoid-robotics-company-is-going-public-but-its-ceo-isnt-promising-a-robot-in-your-home-anytime-soon/',
        evidenceType: 'wire-reported',
        basis: 'cumulative funding'
      }
    },

    agility: {
      spac: {
        value: '$2.5B pre-money equity value via merger with Churchill Capital Corp XI, expected to raise >$620M gross \u2014 S-4 effective Oct 13 2026, holder vote Nov 2, close targeted November (ticker AGLT)',
        asOf: '2026-10-13',
        sourceUrl: 'https://techcrunch.com/2026/07/05/this-humanoid-robotics-company-is-going-public-but-its-ceo-isnt-promising-a-robot-in-your-home-anytime-soon/',
        evidenceType: 'wire-reported',
        basis: 'agilityrobotics.com release, Oct 13 2026. Not the largest humanoid raise: Figure\u2019s Series C exceeded $1B and Apptronik raised $935M.'
      }
    },

    /* ── MARKET STRUCTURE ───────────────────────────────────────────────── */
    funding: {
      h1_2026: {
        value: 'OpenAI plus Anthropic absorbed $217B of $510B in H1 2026 \u2014 43% of every venture dollar deployed globally. Excluding the two, H1 2026 global venture funding falls to roughly $293B, about where the market stood in H1 2021.',
        asOf: '2026-07-02',
        sourceUrl: 'https://aiweekly.co/alerts/openai-and-anthropic-take-43-of-h1-2026-venture-funding',
        evidenceType: 'tracker',
        basis: 'Crunchbase H1 2026. Denominator is $510B, not $505B.'
      }
    },

    cerebras: {
      ipo: {
        value: 'Priced at $185, sold 30M shares raising $5.55B, opened at $350, closed day one at $311.07 (+68%) for a market cap of about $95B',
        asOf: '2026-05-14',
        sourceUrl: 'https://www.cnbc.com/2026/05/14/cerebras-cbrs-stock-trade-nasdaq-ipo.html',
        evidenceType: 'wire-reported',
        basis: 'fully-diluted market cap at the day-one close. At the time the largest US tech IPO since Uber in 2019; SpaceX\u2019s June 12 IPO (~$75B raised) is now the largest IPO ever.'
      },
      drawdown: {
        value: '$386.34 peak to a $133.88 low \u2014 roughly \u221263% on price; opened Oct 16 at $142.17',
        asOf: '2026-10-16',
        sourceUrl: 'https://www.fool.com/investing/2026/05/14/cerebras-just-pulled-off-the-biggest-ipo-of-2026-h/',
        evidenceType: 'wire-reported',
        basis: 'SHARE PRICE basis throughout. Mixing a fully-diluted cap at the high with a float-only cap at the low mechanically exaggerates the drawdown, so price is used for the drawdown and market cap is stated once, on one basis.'
      },
      concentration: {
        value: '$24.6B of RPO concentrated in one customer; management expects to recognise ~15% across 2026\u20132027; ~86% of 2025 revenue came from two UAE-linked customers; 2025 net income of $237.8M included a ~$363M non-cash gain from extinguishing a G42 forward contract, leaving an underlying operating loss of ~$146M',
        asOf: '2026-05-19',
        sourceUrl: 'https://finance.yahoo.com/markets/stocks/articles/cerebras-just-rocketed-onto-nasdaq-130002526.html',
        evidenceType: 'wire-reported',
        basis: 'backlog, customer concentration and earnings quality'
      }
    },

    /* ── REGULATION ─────────────────────────────────────────────────────── */
    euAiAct: {
      aug2026: {
        value: 'August 2, 2026 \u2014 GPAI enforcement powers and Article 50 transparency obligations',
        asOf: '2026-08-03',
        sourceUrl: 'https://digital-strategy.ec.europa.eu/en/policies/enforcement-ai-act',
        evidenceType: 'official',
        basis: 'what actually activated. NOT full high-risk enforcement and NOT "the majority of rules".'
      },
      highRisk: {
        value: 'Stand-alone Annex III high-risk obligations deferred from August 2, 2026 to December 2, 2027, and Annex I product-embedded high-risk to August 2, 2028, by the Digital Omnibus on AI (Regulation (EU) 2026/1744, OJ Jul 24, in force Jul 27 2026); Article 50 unchanged except a grace to December 2, 2026 for marking by generative systems already on the market',
        asOf: '2026-08-03',
        sourceUrl: 'https://artificialintelligenceact.eu/enforcement-of-chapter-v-under-the-eu-ai-act/',
        evidenceType: 'official',
        basis: 'the Act now runs on two clocks'
      },
      aug2027: {
        value: 'August 2, 2027 \u2014 GPAI models placed on the market before August 2, 2025 must be fully compliant',
        asOf: '2026-08-03',
        sourceUrl: 'https://artificialintelligenceact.eu/enforcement-of-chapter-v-under-the-eu-ai-act/',
        evidenceType: 'official',
        basis: 'legacy-model compliance deadline \u2014 not a single "full enforcement" date'
      },
      fines: {
        value: 'Article 101: \u20ac15M or 3% of worldwide annual turnover, whichever is higher, for GPAI provider non-compliance; \u20ac35M or 7% applies only to Article 5 prohibited practices; \u20ac7.5M or 1% for incorrect or misleading information to authorities',
        asOf: '2026-08-04',
        sourceUrl: 'https://artificialintelligenceact.eu/article/101/',
        evidenceType: 'official',
        basis: 'regulation text; Article 101 fines are imposed by the Commission directly'
      }
    },

    /* ── PRICING ────────────────────────────────────────────────────────── */
    pricing: {
      gartnerTam: {
        value: 'Up to $234B of enterprise application software spend \u2014 about 20% of the category \u2014 is exposed to agentic arbitrage BY 2030',
        asOf: '2026-07-01',
        sourceUrl: 'https://www.channel-impact.com/gartner-234-billion-in-enterprise-application-software-spend-is-at-risk-from-agentic-ai/',
        evidenceType: 'estimate',
        basis: 'Gartner projection with a 2030 horizon. Without the horizon a reader takes $234B as a present-day loss.'
      },
      gartnerShift: {
        value: 'At least 40% of enterprise SaaS spend shifts to usage-, agent- or outcome-based pricing by 2030, with seat-based revenue falling from 21% to 15% of vendor income',
        asOf: '2026-06-16',
        sourceUrl: 'https://www.cio.com/article/4184688/it-hurtles-toward-the-great-enterprise-pricing-reset.html',
        evidenceType: 'estimate',
        basis: 'Gartner, quoted by CIO and in Deloitte TMT Predictions 2026'
      },
      salesforce: {
        value: 'Agentforce Help Agent reached GA in July 2026 at $2 per resolved issue, with Data 360 and Agentforce usage unmetered inside the interaction and nothing charged when the agent escalates to a human; m3ter was signed June 8 and closed July 1 2026',
        asOf: '2026-07-21',
        sourceUrl: 'https://www.pipelance.com/blog/pay-per-resolution-pricing',
        evidenceType: 'wire-reported',
        basis: 'the incumbent-convert datapoint, with the price the earlier version omitted'
      },
      cognizant: {
        value: '45% of Cognizant\u2019s new BPO contracts are now signed on outcome-based commercial models, on a BPO business growing 9% YoY',
        asOf: '2026-07-06',
        sourceUrl: 'https://www.moneycontrol.com/artificial-intelligence/outcome-based-pricing-gains-ground-as-45-of-cognizant-s-new-bpo-contracts-adopt-the-model-article-13966968.html',
        evidenceType: 'wire-reported',
        basis: 'the shift is happening on a growing base'
      }
    },

    /* ── HEALTHCARE ─────────────────────────────────────────────────────── */
    noharm: {
      benchmark: {
        value: '100 real primary-care-to-specialist consultation cases across 10 specialties, 12,747 expert annotations on 4,249 clinical management options, run across 31 LLMs',
        asOf: '2026-07-29',
        sourceUrl: 'https://stanfordhealthcare.org/v2/publications/968/968514.html',
        evidenceType: 'official',
        basis: 'the benchmark\u2019s own abstract. Fortune reported "1,100 real clinical cases", which is where the error entered. Not peer-reviewed; OpenEvidence contested the scoring.'
      },
      findings: {
        value: '76.6% of harmful errors were omissions (95% CI 76.4\u201376.8%); potential for severe harm in up to 24.6% of cases, with omissions more than 80% of severe errors (arXiv v4 abstract)',
        asOf: '2026-07-13',
        sourceUrl: 'https://arxiv.org/abs/2512.01241',
        evidenceType: 'official',
        basis: 'the paper also found doctors with AI gave better care than doctors without'
      }
    },

    /* ── AGENT STACK ────────────────────────────────────────────────────── */
    agentStack: {
      scope: {
        value: '47 mapped companies across 7 layers',
        asOf: '2026-08-04',
        sourceUrl: '',
        evidenceType: 'dvc-analysis',
        basis: 'company count only. The previously shown "$1B+ combined funding" total did not reconcile with the sum of the listed raises and has been removed rather than restated. Individual metrics as of Aug 4 2026.'
      },
      e2b: {
        value: '88% of the Fortune 100 have signed up for E2B sandboxes (as of July 2025)',
        asOf: '2025-07',
        sourceUrl: 'https://www.insightpartners.com/ideas/e2b-raises-a-21m-series-a-to-offer-cloud-for-ai-agents-to-fortune-100/',
        evidenceType: 'company-disclosed',
        basis: 'signups, not usage \u2014 the weaker and accurate verb. From E2B\u2019s July 2025 Series A release; no longer on e2b.dev, so dated to 2025.'
      }
    },

    /* ── INFERENCE COST ─────────────────────────────────────────────────── */
    inference: {
      barbell: {
        value: 'Cost collapsed at the commodity tier while frontier list prices split upward: GPT-6 Luna at $0.10/$0.50 against Claude Fable 5.1 and GPT-6 Astra at $10/$50. Secondary-source Gemini pricing was removed after audit.',
        asOf: '2026-09-22',
        sourceUrl: 'https://developers.openai.com/api/docs/pricing',
        evidenceType: 'wire-reported',
        basis: 'published list prices per 1M input/output tokens, September 2026. Replaces the two incompatible 99.6%-decline time series (GPT-4-class $37.50\u2192$0.14 over 24 months and GPT-3.5-class $20.00\u2192$0.07 over 36 months), neither of which could be sourced to a current index.'
      }
    }
  };

  root.FACTS = F;
  if (typeof module !== 'undefined' && module.exports) module.exports = F;
})(typeof window !== 'undefined' ? window : globalThis);
