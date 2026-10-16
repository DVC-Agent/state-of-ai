/* The seven-part report, slide figures, evidence cards and mouseovers share these records.
 * Evidence cut: 2026-10-16. A historical observation is never rolled forward implicitly.
 */
(function(root) {
  'use strict';
  var F = root.FACTS;
  var M = {};
  function add(key,label,display,period,asOf,url,source,type,qualifier,detail) {
    M[key]={label:label,display:display,period:period,asOf:asOf,url:url,source:source,type:type,qualifier:qualifier,detail:detail||qualifier};
  }
  function from(key,path,label,display,period,source,qualifier,url) {
    var r=path.split('.').reduce(function(o,k){return o[k];},F);
    add(key,label,display,period,r.asOf,url||r.sourceUrl,source,r.evidenceType,qualifier||r.basis,r.value);
  }
  var IEA='https://www.iea.org/reports/key-questions-on-energy-and-ai/executive-summary';
  var CMS='https://www.cms.gov/data-research/statistics-trends-and-reports/national-health-expenditure-data/nhe-fact-sheet';
  var ROI='https://www.bvp.com/atlas/the-2026-healthcare-ai-roi-scorecard';
  var PWC='https://www.pwc.com/us/en/industries/health-industries/library/behind-the-numbers.html';
  var IFR='https://ifr.org/ifr-press-releases/news/five-million-robots-now-operate-in-factories-globally';
  var ROCKWELL='https://www.rockwellautomation.com/en-us/company/news/press-releases/90-of-Manufacturers-Say-Digital-Transformation-Is-Now-Essential-According-to-New-Global-Study.html';
  var BVP='https://www.bvp.com/atlas/the-ai-pricing-and-monetization-playbook';
  var SERVICES='https://www.bvp.com/atlas/owning-the-outcome-bessemer-s-ai-native-services-evaluation-framework';
  var SEQ='https://sequoiacap.com/article/services-the-new-software/';
  add('energy2025','Global data-center electricity use','485 TWh','2025 observed baseline','2026-10-14',IEA,'IEA','official','All data centers, not only AI. Historical consumption, not operating generation capacity.');
  add('energy2030','Global data-center electricity outlook','950 TWh','2030 central projection','2026-10-14',IEA,'IEA','forecast','All data centers. A forecast, not delivered capacity or AI-only demand.');
  from('nvidiaQuarter','nvidia.quarter','NVIDIA revenue','$96.2B','Q2 FY2027; quarter ended July 26, 2026','NVIDIA','Reported quarterly revenue, rounded from $96.221B. Not annual revenue or a hardware TAM.');
  from('capexAmazon','capex.amazon','Amazon cash capex guidance','$220B','Calendar 2026 guidance','Amazon','Cash capex guidance. Finance-lease treatment is not harmonized with other issuers.');
  from('capexAlphabet','capex.alphabet','Alphabet capex guidance','$195-205B','Calendar 2026 guidance','Alphabet','Consolidated capex guidance; midpoint $200B. Not AI-only spending.');
  from('capexMicrosoft','capex.microsoft','Microsoft reported capex guide','$175B','Calendar 2026 guidance','Microsoft','Excludes operating leases. Reclassification changes presentation, not underlying investment expectations.');
  from('capexMeta','capex.meta','Meta capex guidance','$130-145B','Calendar 2026 guidance','Meta','Includes finance-lease principal; midpoint $137.5B.');
  from('capexTotal','capex.topFour2026','Selected-four capex midpoint','$732.5B','Calendar 2026 issuer guidance','Issuer earnings calls','Arithmetic sum: Amazon 220 + Alphabet 200 + Microsoft 175 + Meta 137.5, in billions. Mixed accounting scopes, not total AI spend.');
  from('capexRange','capex.topFour2026','Selected-four guidance range','$720-745B','Calendar 2026 issuer guidance','Issuer earnings calls','Arithmetic lower/upper bounds with Amazon and Microsoft point guides. Mixed scopes, not a statistical confidence interval.');
  M.capexTotal.detail=M.capexTotal.qualifier;
  M.capexRange.detail='Selected-four calendar-2026 issuer guidance ranges from $720B to $745B, with a $732.5B midpoint. Company accounting scopes differ.';
  M.capexMeta.detail=M.capexMeta.qualifier;
  from('pricePremium','openai.flagship','Premium API list-price tier','$10 / $50','Per 1M input / output tokens; October 16 cut','OpenAI pricing','GPT-6 Astra standard short-context prices. Claude Fable 5.1 has the same input/output list prices. Cache and processing modes differ.');
  from('priceWorkhorse','openai.flagship','Workhorse API list-price tier','$2 / $10','Per 1M input / output tokens; October 16 cut','OpenAI pricing','GPT-6.1 Sol standard short-context prices. Claude Sonnet 5.5 has the same input/output list prices. Not equal cost per successful task.');
  from('priceSmall','openai.flagship','Small-model API list-price tier','$0.10 / $0.50','Per 1M input / output tokens; October 16 cut','OpenAI pricing','GPT-6 Luna standard short-context prices. Haiku 5.5 matches only for prompts up to 100K tokens; its longer prompts cost $0.50/$2.50.');
  from('priceClaude','anthropic.flagship','Claude pricing and context rules','Haiku: 100K threshold','Per-request prompt length; October 16 cut','Anthropic pricing','Haiku 5.5: $0.10/$0.50 up to 100K input tokens; $0.50/$2.50 above. Fable 5.1 $10/$50; Opus 5.5 $4/$20; Sonnet 5.5 $2/$10. All per 1M input/output tokens.');
  from('priceGemini','google.flagship','Gemini 4 Argon introductory pricing','$2 / $10','Per 1M input/output; through November 30, 2026','Google Cloud','Introductory rate. Standard prices become $4/$20 after November 30; not a permanent price comparison.');
  from('metaModels','meta.flagship','Meta October model release','Muse Wonder','October 12, 2026 announcement','Meta','Wonder through Meta Model API and Muse Code; Wonder Full through subscriptions. Price and open-weight status not inferred.');
  add('deepseek','DeepSeek V4.1 Flash','MIT weights','Model card checked October 16, 2026','2026-09-10','https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash','DeepSeek model card','official','Downloadable MIT-licensed weights; up to 1M context. Hosting control is not a promise of low total serving cost.');
  add('kimi','Kimi K3','1M context','Release material checked October 16, 2026','2026-10-16','https://www.kimi.com/en/blog/kimi-k3','Moonshot / Kimi','company-disclosed','Page does not state a calendar launch date. It describes 1M context and a full-weight release schedule. Verify the actual weight artifact and exact license before use; do not infer unrestricted rights.');
  add('glm','GLM-5.3 and GLM-5.3-Flash','Distinct releases','August 18 and August 26, 2026','2026-08-26','https://docs.z.ai/release-notes/new-released','Z.ai release notes','official','Release notes do not by themselves establish exact downloadable-weight availability or license terms.');
  from('anthropicRevenue','anthropic.runRate','Anthropic reported revenue','$16.8B','Q3 2026 reported quarter','CNBC','Investor-meeting reporting, not an independently audited public filing. A reported quarter is not an exit run-rate. Adjusted profit is not GAAP profit.','https://www.cnbc.com/2026/10/15/anthropics-third-quarter-revenue-hits-16point8-billion-ipo.html');
  from('openaiRevenue','openai.arr','OpenAI annualized revenue','~$50B','September 2026 annualized pace','Axios','Annualized pace, not booked annual revenue. Partner-sales gross/net treatment differs from Anthropic.','https://www.axios.com/2026/10/08/openai-50-billion-arr-anthropic-revenue-accounting');
  from('higgsfieldRevenue','higgsfield.runRate','Higgsfield annualized revenue','>$1B','September 2026 four-week revenue pace','Higgsfield','Latest four weeks multiplied by 13. Company-disclosed run-rate, not contracted ARR or trailing-year revenue.','https://higgsfield.ai/blog/higgsfield-1b-annualized-revenue-run-rate');
  M.higgsfieldRevenue.asOf='2026-09-29';
  from('lovableRevenue','lovable.arr','Lovable annualized revenue','>$600M','September 24, 2026 disclosure','TechCrunch','Co-founder disclosure. Annualized sales, not contracted ARR; no current employee denominator.');
  M.lovableRevenue.detail='Co-founder Fabian Hedin disclosed more than $600M in annualized revenue on September 24, 2026. This is not contracted ARR or a current revenue-per-employee ratio.';
  from('rampAny','anthropic.enterpriseShare','Ramp businesses paying any AI vendor','55.9%','September 2026 observed payments','Ramp','Ramp business sample; overlapping vendor payments, not a representative census.');
  from('rampAnthropic','anthropic.enterpriseShare','Ramp businesses paying Anthropic','43.8%','September 2026 observed payments','Ramp','Vendor payments overlap. Not exclusive market share or share of total AI spend.');
  from('rampOpenai','anthropic.enterpriseShare','Ramp businesses paying OpenAI','40.6%','September 2026 observed payments','Ramp','Vendor payments overlap. Not exclusive market share or share of total AI spend.');
  add('voiceEnterprise','ElevenLabs enterprise mix','55%','Revenue mix disclosed September 30, 2026','2026-09-30','https://elevenlabs.io/blog/tender-22bn','ElevenLabs','company-disclosed','Enterprise share of company revenue, not share of the voice market.');
  add('voiceConversations','ElevenLabs agent conversations','>15M / week','Disclosed September 30, 2026','2026-09-30','https://elevenlabs.io/blog/tender-22bn','ElevenLabs','company-disclosed','Company-disclosed weekly conversations; not resolved work, independently measured ROI or unique customers.');
  add('aiResearch','Claude-led measured model R&D work','26%','Anthropic internal index; August 2026','2026-10-08','https://press.airstreet.com/p/state-of-ai-2026','Air Street State of AI 2026','reported internal measure','Company-specific supervised R&D measure. Not cross-lab productivity or autonomous recursive improvement.');
  add('agentSecurity','MCP execution and authorization design','Scoped authority','July 28, 2026 specification','2026-07-28','https://blog.modelcontextprotocol.io/posts/2026-07-28/','MCP maintainers','official','Interoperability does not replace action-level authorization, monitoring, isolation and recovery.');
  add('pricingFramework','AI pricing and monetization framework','No universal margin band','February 10, 2026 research','2026-02-10',BVP,'Bessemer pricing playbook','research','Pricing and delivery costs differ by product and industry. Published cohort comparisons are not universal gross-margin or EBITDA targets.');
  add('serviceFramework','AI-native services evaluation','Own the delivery','July 31, 2026 framework','2026-07-31',SERVICES,'Bessemer services framework','research','Underwrite delivery economics, retained surplus and defensibility; availability of agents does not guarantee autonomy or software-like margins.');
  add('sequoiaServices','Copilot and autopilot framework','Tool vs. work','March 5, 2026 framework','2026-03-05',SEQ,'Sequoia services framework','research','Opportunity map is illustrative. Outsourced work can be a vendor-swap wedge; market estimates have different scopes and are not additive.');
  add('healthSpending','US national health expenditures','$5.3T','2024 actual historical baseline','2026-06-24',CMS,'CMS NHE fact sheet','official','Latest actual year on the fact sheet. 2025 onward is projected. River routing and cost pools are modeled, not CMS observations.');
  add('healthRoi','Healthcare average realized ROI','3.5×','2026 buyer survey; September 30 publication','2026-09-30',ROI,'Bessemer / Bain ROI scorecard','survey','226 healthcare executives across 65 use cases. Self-reported realized returns, not a randomized audit or national spending effect.');
  add('healthRcmAutonomy','Provider revenue-cycle agent autonomy','67%','2026 scorecard respondents in this function','2026-09-30',ROI,'Bessemer / Bain ROI scorecard','survey','Semi- or fully autonomous agents reported in provider revenue cycle. Different function/cohort from clinical.');
  add('healthClinicalAutonomy','Provider clinical agent autonomy','4%','2026 scorecard respondents in this function','2026-09-30',ROI,'Bessemer / Bain ROI scorecard','survey','Provider clinical solutions reported as semi- or fully autonomous. Not proof of clinical safety or readiness for general autonomy.');
  add('healthInflator','Health plans citing AI revenue capture','70%','2027 cost outlook; survey of 27 US health plans','2026-06-10',PWC,'PwC medical cost trend','survey / forecast','Share ranking AI-enabled provider revenue capture among top-three cost inflators. Payer expectation, not measured causal attribution.');
  add('healthTrend','Medical cost trend outlook','9% / 8.5%','2027 group / individual-market projections','2026-06-10',PWC,'PwC medical cost trend','forecast','2026 restated to the same levels. Projections are not national health-expenditure growth or a measured AI effect.');
  add('healthFunding','US digital-health venture funding','$3.7B','Q3 2026; 114 deals','2026-10-09','https://rockhealth.com/reports/q3-2026-market-update-crystallizing-fifteen-years-of-digital-health/','Rock Health','tracker','US-based digital-health startups; $11.1B and 358 deals through Q3. Not global healthtech or all healthcare AI.');
  from('clinicalHarm','noharm.findings','NOHARM potential severe harm','Up to 24.6%','Benchmark v4; July 13, 2026','NOHARM preprint','Potential harm from direct application of recommendations, not observed patient injuries. 1,100 tasks; 20 LLMs and 4 clinical RAG tools.');
  add('robotStock','Operating industrial robot stock','5M','Global operational stock; 2025','2026-09-24',IFR,'IFR World Robotics 2026','official','Unit count, not revenue or a humanoid TAM. Historical observation, not a 2026 forecast.');
  add('robotInstalls','Industrial robot installations','>600,000','Global installations; 2025','2026-09-24',IFR,'IFR World Robotics 2026','official','Annual installations, not cumulative installed stock; 11% growth in 2025.');
  add('robotChina','China share of industrial installations','59%','2025 global deployments','2026-09-24',IFR,'IFR World Robotics 2026','official','Share of annual deployments, not the global operating stock or robot revenue.');
  add('industrialAdoption','Respondents using smart manufacturing','59%','2026 survey; 1,560 respondents, 17 countries','2026-05-19',ROCKWELL,'Rockwell / Sapio Research','survey','18% remained in pilot mode. Smart manufacturing is broader than autonomous AI; respondent feedback is not instrumented plant ROI.');
  add('industrialOperations','Operations reported as AI-augmented','34%','2026 smart-manufacturing survey','2026-05-19',ROCKWELL,'Rockwell / Sapio Research','survey','Share of operations reported as AI-augmented, not share of factories with profitable autonomous systems.');
  from('waymoAccess','waymo.metros','Waymo public-access update','Three new open markets','October 14, 2026 update','Waymo','San Antonio, San Diego and Tampa opened to everyone. Public availability is not a weekly ride tally.');
  from('waymoRides','waymo.rides','Waymo weekly paid rides','~500,000','March 27, 2026 disclosure','TechCrunch / Waymo','Dated company milestone. No newer tally verified in this cut; do not infer that operations stayed flat.');
  from('etchedRound','etched.round','Etched public financing announcement','$700M at $21B','August 18, 2026 company announcement','Etched','Company-announced financing led by Jane Street with Sequoia and others. Financing classifications may differ across datasets; not operating revenue.');
  from('higgsfieldRound','higgsfield.round','Higgsfield publicly announced round','$400M at $5.4B','August 17, 2026 public Series B','TechCrunch','Dated public announcement, not a live price or assertion that no later private transaction occurred.');
  from('harveyRound','harvey.valuation','Harvey primary-round valuation','$15.5B','September 9, 2026; $550M primary round','Harvey','Legal software serving law firms and in-house teams. Announcement does not disclose current ARR; no synthetic multiple.');
  from('elevenTender','elevenlabs.raised','ElevenLabs employee tender','$22B','September 30, 2026; $300M tender','ElevenLabs','Secondary employee liquidity, not a primary raise into the company.');
  from('rhodaRound','rhoda.raised','Rhoda publicly announced raise','$450M Series A','March 10, 2026 announcement','Rhoda','Company announcement does not state a valuation. Do not label the demonstrated system a humanoid.');
  from('aiFundingShare','funding.q3_2026','AI share of global venture funding','64%','Q3 2026; Crunchbase cut October 2','Crunchbase','AI-driven startups across the stack received $102B of $159B global venture funding. Not all private capital.');
  from('globalFunding','funding.q3_2026','Global venture funding','$159B','Q3 2026; $679B through Q3','Crunchbase','Reported venture funding; seed data can be revised upward after quarter end.');
  add('euTimeline','EU AI Act phased application','2026 / 2027 / 2028','Commission enforcement page; October 6, 2026','2026-10-06','https://digital-strategy.ec.europa.eu/en/policies/enforcement-ai-act','European Commission','official','August 2, 2026 enforcement powers and specified provisions; December 2, 2026 additional prohibitions; Annex III high-risk December 2, 2027; product-embedded high-risk August 2, 2028.');
  root.NARRATIVE_DATA={
    edition:'2026-10-16', githubBase:'3742daa', evidenceBase:'9109da2',
    metrics:M,
    chapters:[
      {id:'ai-stack',title:'AI stack'},
      {id:'agentic',title:'Agentic revolution and stack'},
      {id:'business-models',title:'Business Models'},
      {id:'services',title:'Services'},
      {id:'healthcare',title:'Healthcare'},
      {id:'physical',title:'Robotics / Physical'},
      {id:'investing',title:'Investing and valuations'}
    ],
    capex:[
      {key:'amazon',name:'Amazon',low:220,mid:220,high:220,metric:'capexAmazon'},
      {key:'alphabet',name:'Alphabet',low:195,mid:200,high:205,metric:'capexAlphabet'},
      {key:'microsoft',name:'Microsoft',low:175,mid:175,high:175,metric:'capexMicrosoft'},
      {key:'meta',name:'Meta',low:130,mid:137.5,high:145,metric:'capexMeta'}
    ],
    legacyAnchors:{'sec-0':'top','sec-1':'ai-stack','sec-2':'layer-applications','sec-3':'layer-models','sec-4':'agentic','sec-5':'agent-architecture','sec-6':'agent-evidence','sec-7':'layer-cloud','sec-8':'physical','sec-9':'business-models','sec-healthcare-ai':'healthcare','sec-industrial-ai':'industrial-explorer','sec-10':'control-evidence','sec-11':'control-evidence','sec-12':'investing','sec-13':'dvc-ecosystem','sec-14':'underwriting','sec-15':'investing'}
  };
})(typeof window!=='undefined'?window:globalThis);
