/* =====================================================================
   HEAVY-INDUSTRY OPERATIONS TECHNOLOGY & SAFETY - DATA MODEL
   Money River: who pays -> what is bought -> what the dollars fund
   Base year 2025 (latest full year; FY Mar-26 / Sep-25 vendor years noted).
   Scope: heavy industry (oil & gas, chemicals, mining & metals, power &
   utilities, discrete and process manufacturing, construction, transport
   infrastructure) buying automation, instrumentation, industrial software,
   industrial AI, robotics & inspection, safety systems & PPE, EHS &
   connected-worker software, OT cyber, engineering & integration services,
   and maintenance & reliability services.
   Destination totals are sourced or derived from named analyst and filing
   figures; buyer split and cost-pool decomposition are modeled and
   constrained to those totals. Every node carries an evidence tag:
     official | filing | analyst | derived | modeled
   Same schema as ROBOTICS_DATA / HEALTHCARE_DATA so the renderer is shared.
   Built for the DVC State of AI report (industrial section).
   ===================================================================== */
(function (root) {
  'use strict';

  var SRC = {
    // Market sizing (analyst)
    gvr_iacs:        'https://www.grandviewresearch.com/industry-analysis/industrial-automation-market',
    mm_process:      'https://www.marketsandmarkets.com/PressReleases/process-automation.asp',
    ia_drives:       'https://interactanalysis.com/low-voltage-ac-drives-market/',
    ia_motion:       'https://interactanalysis.com/insight/motion-controls-market-declines-6-9-in-2024-amid-destocking-but-brighter-days-are-ahead/',
    mm_machsafety:   'https://www.marketsandmarkets.com/PressReleases/machine-safety.asp',
    abb_dcs:         'https://new.abb.com/news/detail/3104/abb-confirmed-as-the-1-in-distributed-control-systems-globally',
    arc_top50:       'https://www.controlglobal.com/control/article/55235510/top-50-automation-suppliers',
    mm_indsw:        'https://www.globenewswire.com/news-release/2024/07/30/2920962/0/en/Industrial-Software-Market-Forecast-to-Be-Valued-at-46-6-Billion-by-2029.html',
    iot_analytics:   'https://iot-analytics.com/industrial-software-market-landscape/',
    mm_apm:          'https://www.marketsandmarkets.com/PressReleases/asset-performance-management.asp',
    mm_pdm:          'https://www.marketsandmarkets.com/PressReleases/operational-predictive-maintenance.asp',
    mm_aimfg:        'https://www.marketsandmarkets.com/PressReleases/artificial-intelligence-manufacturing.asp',
    idc_ai:          'https://www.idc.com/resource-center/blog/idcs-worldwide-ai-and-generative-ai-spending-industry-outlook/',
    ifr_wr2025:      'https://ifr.org/ifr-press-releases/news/global-robot-demand-in-factories-doubles-over-10-years',
    ifr_by_industry: 'https://eu.36kr.com/en/p/3483537185168257',
    gvr_robotics:    'https://www.grandviewresearch.com/industry-analysis/industrial-robotics-market',
    mm_ppe:          'https://www.marketsandmarkets.com/PressReleases/personal-protective-equipment.asp',
    gvr_ppe:         'https://www.grandviewresearch.com/industry-analysis/personal-protective-equipment-ppe-market',
    mm_gas:          'https://www.marketsandmarkets.com/PressReleases/gas-detection.asp',
    mm_wst:          'https://www.marketsandmarkets.com/PressReleases/workplace-safety.asp',
    verdantix_ehs:   'https://www.verdantix.com/venture/report/market-size-and-forecast-ehs-software-2023-2029-global',
    verdantix_ehs2:  'https://www.verdantix.com/insights/blog/ehs-software-market-size-the-road-to-3-billion-dollars',
    verdantix_cw:    'https://www.verdantix.com/insights/blog/connected-worker-solutions-market-to-reach-3.24-billion-dollars-by-2028-overcoming-initial-slow-growth',
    verdantix_svc:   'https://www.businesswire.com/news/home/20201221005454/en/Verdantix-Says-Spending-On-Digital-EHS-Services-Will-Reach-%243.2-billion-In-2025',
    verdantix_gq:    'https://www.verdantix.com/venture/report/green-quadrant-ehs-software-2025',
    mm_cw:           'https://www.marketsandmarkets.com/PressReleases/connected-worker.asp',
    mordor_ot:       'https://www.mordorintelligence.com/industry-reports/operational-technology-ot-security-market',
    frost_ot:        'https://www.frost.com/news/enterprises-need-for-ot-security-expertise-propels-growth-of-industrial-cybersecurity-market/',
    mm_indcyber:     'https://www.marketsandmarkets.com/PressReleases/industrial-cybersecurity.asp',
    gvr_services:    'https://www.grandviewresearch.com/industry-analysis/industrial-automation-services-market-report',
    idc_dx:          'https://www.businesswire.com/news/home/20240530917191/en/Worldwide-Spending-on-Digital-Transformation-is-Forecast-to-Reach-Almost-$4-Trillion-by-2027-According-to-New-IDC-Spending-Guide',
    pwc_mine:        'https://www.pwc.com/gx/en/industries/energy-utilities-resources/publications/mine.html',
    // Vendor filings
    siemens_q4:      'https://assets.new.siemens.com/siemens/assets/api/uuid:3948cdd4-35e0-4c1d-8412-9aed4097b3d0/HQCOPR202511117277EN.pdf',
    siemens_ar:      'https://assets.new.siemens.com/siemens/assets/api/uuid:428ea18a-e7ab-4f93-a160-33908f1c3540/Siemens-Annual-Report-2025.pdf',
    siemens_q2_26:   'https://press.siemens.com/global/en/pressrelease/siemens-continues-path-profitable-growth',
    abb_q4:          'https://library.e.abb.com/public/efa424a5e55545ef99275bfafc6ff638/ABB-Q4-2025-financial-information.pdf',
    abb_cmd:         'https://new.abb.com/news/detail/131069/abb-capital-markets-day-2025',
    schneider_fy:    'https://www.se.com/ww/en/assets/564/document/528237/release-fy-results-2025.pdf',
    emerson_q4:      'https://ir.emerson.com/news-events/press-releases/detail/617/emerson-reports-fourth-quarter-and-full-year-2025-results-provides-initial-2026-outlook',
    emerson_aspen:   'https://www.emerson.com/en/corporate/news/2025/emerson-completes-acquisition-of-remaining-outstanding-shares-of-aspentech',
    emerson_beyond:  'https://www.emerson.com/en/corporate/news/2025/project-beyond-to-build-enterprise-operations-platform',
    emerson_4pct:    'https://www.emerson.com/en-us/news/automation/1510-projectcertainty',
    emerson_call:    'https://www.fool.com/earnings/call-transcripts/2025/11/05/emerson-emr-q4-2025-earnings-call-transcript/',
    rockwell_q4:     'https://www.rockwellautomation.com/en-us/company/news/press-releases/Rockwell-Automation-Reports-Fourth-Quarter-and-Full-Year-2025-Results-Introduces-Fiscal-2026-Guidance.html',
    rockwell_q2_26:  'https://www.rockwellautomation.com/content/dam/rockwell-automation/documents/pdf/company/about-us/ir/2026/rok-pepared-remarks-q2-fy26.pdf',
    rockwell_sosm:   'https://www.rockwellautomation.com/en-us/capabilities/digital-transformation/state-of-smart-manufacturing.html',
    honeywell_q4:    'https://investor.honeywell.com/news-releases/news-release-details/honeywell-reports-fourth-quarter-2025-results-adjusted-sales-and',
    honeywell_ppe:   'https://www.honeywell.com/us/en/news/press-releases/2025/05/honeywell-completes-sale-of-personal-protective-equipment-business-to-protective-industrial-products',
    honeywell_hug:   'https://www.controlglobal.com/show-coverage/honeywell-users-group/article/55383249/honeywell-charts-automation-ai-driven-future-at-50th-anniversary-user-group',
    honeywell_google:'https://www.honeywell.com/us/en/news/press-releases/2024/10/honeywell-and-google-cloud-to-accelerate-autonomous-operations-with-ai-agents-for-the-industrial-sector',
    honeywell_auto:  'https://www.honeywell.com/us/en/news/press-releases/2025/06/honeywell-drives-industrial-transition-from-automation-to-autonomy-with-new-ai-enabled-digital-suite',
    yokogawa_fy25:   'https://cdn-nc.yokogawa.com/1/20567/tabs/ir_202603presentation-en.pdf',
    yokogawa_fkdpp:  'https://www.yokogawa.com/news/press-releases/2023/2023-03-30/',
    yokogawa_eneos:  'https://www.yokogawa.com/library/resources/references/successstory-eneos-materials/',
    melco_fy26:      'https://www.mitsubishielectric.com/en/pr/2026/pdf/0428_co1.pdf',
    melco_nozomi:    'https://www.mitsubishielectric.com/en/pr/2025/pdf/0909-1.pdf',
    omron_fy:        'https://www.omron.com/global/en/assets/file/ir/shareholder/business_report_89th.pdf',
    fanuc:           'https://www.fanuc.co.jp/en/ir/announce/pdf/2026/reference202603_e.pdf',
    eh_2025:         'https://www.endress.com/en/endress-hauser-group/press-center/2025-financial-year',
    hexagon_ye:      'https://mb.cision.com/Main/387/4300053/3907199.pdf',
    octave:          'https://www.octave.com/newsroom/press-releases/2026/octave-holds-investor-day-ahead-of-planned-spin-off',
    ptc_q4:          'https://investor.ptc.com/resources/news/news-details/2025/PTC-ANNOUNCES-FOURTH-FISCAL-QUARTER-AND-FULL-FISCAL-YEAR-2025-RESULTS/default.aspx',
    dassault_fy:     'https://investor.3ds.com/news-releases/news-release-details/dassault-systemes-q4-revenue-growth-1-solid-operating-margin-and',
    bentley_fy:      'https://investors.bentley.com/news-releases/news-release-details/bentley-systems-announces-fourth-quarter-and-full-year-2025',
    aspentech_rev:   'https://stockanalysis.com/stocks/azpn/revenue/',
    msa_q4:          'https://investors.msasafety.com/news-releases/news-release-details/msa-safety-announces-fourth-quarter-and-full-year-2025-results',
    draeger_ar:      'https://www.draeger.com/Content/Documents/Content/annual-report-2025-EmA4R7Xhj6.pdf',
    draeger_fy:      'https://www.webdisclosure.com/press-release/dragerwerk-ag-co-kgaa-etr-drw8-dragerwerk-ag-co-kgaa-drager-with-good-order-development-record-net-sales-and-significant-increase-in-net-profit-in-fiscal-year-2025-third-dividend-increase-in-a-row-tqpy0glFsOo',
    mmm_q4:          'https://investors.3m.com/financials/sec-filings/content/0000066740-26-000003/q42025-8kerexx991.htm',
    ansell_fy:       'https://investor.ansell.com/FormBuilder/_Resource/_module/WEtAsUy_jk6Kmk_vOw9f5g/docs/results/Ansell_FYRP_2025.pdf',
    fortive_q4:      'https://investors.fortive.com/news-events/press-releases/detail/280/fortive-reports-fourth-quarter-and-full-year-2025-results',
    samsara_q4:      'https://www.businesswire.com/news/home/20260305580818/en/Samsara-Reports-Fourth-Quarter-and-Full-Fiscal-Year-2026-Financial-Results',
    palantir_q4:     'https://investors.palantir.com/files/Palantir%20-%20Q4%202025%20Investor%20Presentation.pdf',
    c3ai_fy26:       'https://c3.ai/news/c3-ai-announces-fiscal-fourth-quarter-and-full-fiscal-year-2026-results',
    wesco_q4:        'https://investors.wesco.com/news-releases/news-release-details/wesco-international-reports-fourth-quarter-and-full-year-2025',
    wk_fy25:         'https://assets.contenthub.wolterskluwer.com/api/public/content/3118646-2026-02-25-wolters-kluwer-2025-full-year-results-7391945524?v=2c966da9',
    blackline_fy25:  'https://www.blacklinesafety.com/about/press-releases/blackline-safety-reports-record-fiscal-2025-revenue-of-150.5-million-and-adjusted-ebitda-of-6.1-million',
    blackline_fp:    'https://www.franciscopartners.com/media/blackline-safety-enters-into-definitive-agreement-to-be-acquired-by-francisco-partners-for-up-to-850-million',
    blackline_q2:    'https://www.blacklinesafety.com/about/press-releases/blackline-safety-announces-q2-2026-results-and-provides-update-on-francisco-partners-transaction',
    // Cost benchmarks
    autoworld_sw:    'https://www.automationworld.com/home/article/13311282/calculating-the-true-cost-of-software',
    chemproc_io:     'https://www.chemicalprocessing.com/automation/control-systems/article/11312700/control-system-rule-out-a-rule-of-thumb-chemical-processing',
    dimension_si:    'https://dimensionfunding.com/automation-project-cost-breakdown',
    nsca_margin:     'https://www.nsca.org/nsca-news/whats-the-right-hardware-margin-for-integrators/',
    graybar:         'https://distributionstrategy.com/2026/03/graybar-reports-record-12-9-billion-in-2025-sales-as-net-income-rises/',
    // Cost of the problem (official / insurer)
    nsc_costs:       'https://injuryfacts.nsc.org/work/costs/work-injury-costs/',
    nsc_wc:          'https://injuryfacts.nsc.org/work/costs/workers-compensation-costs/',
    ilo_3m:          'https://www.ilo.org/resource/news/nearly-3-million-people-die-work-related-accidents-and-diseases',
    ilo_gdp:         'https://www.ilo.org/sites/default/files/wcmsp5/groups/public/@dgreports/@dcomm/documents/publication/wcms_686645.pdf',
    euosha_cost:     'https://osha.europa.eu/sites/default/files/2021-11/international_comparison-of_costs_work_related_accidents.pdf',
    euosha_roi:      'https://osha.europa.eu/en/themes/good-osh-is-good-for-business',
    eurostat:        'https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Accidents_at_work_statistics',
    hse_cost:        'https://www.hse.gov.uk/statistics/cost.htm',
    bls_cfoi:        'https://www.bls.gov/news.release/cfoi.nr0.htm',
    bls_soii:        'https://www.bls.gov/news.release/osh.nr0.htm',
    bls_by_industry: 'https://www.bls.gov/charts/census-of-fatal-occupational-injuries/number-and-rate-of-fatal-work-injuries-by-industry.htm',
    bls_rates:       'https://www.bls.gov/iif/nonfatal-injuries-and-illnesses-tables/table-1-injury-and-illness-rates-by-industry-2024-national.htm',
    bls_transport:   'https://www.bls.gov/iag/tgs/iag48-49.htm',
    msha:            'https://wwwn.cdc.gov/NIOSH-Mining/MMWC/Fatality/NumberAndRate',
    liberty:         'https://www.insurancejournal.com/magazines/mag-features/2025/08/04/834116.htm',
    marsh_100:       'https://www.marsh.com/en/industries/energy-and-power/insights/100-largest-losses.html',
    marsh_index:     'https://www.marsh.com/en/services/international-placement-services/insights/global-insurance-market-index.html',
    csb:             'https://www.csb.gov/us-chemical-safety-board-releases-volume-3-of-chemical-incident-reports-incidents-resulted-in-18-billion-dollars-in-property-damage/',
    allianz_claims:  'https://www.allianz.com/en/press/news/studies/220719_Allianz-Global-Corporate-Specialty-Global-Claims-Review-2022.html',
    allianz_barometer:'https://commercial.allianz.com/news-and-insights/news/allianz-risk-barometer-2026.html',
    icmm:            'https://www.icmm.com/en-gb/news/2025/2024-safety-performance',
    bhp_ar:          'https://www.bhp.com/-/media/documents/investors/annual-reports/2025/250819_bhpannualreport2025.pdf',
    siemens_downtime:'https://www.theaemt.com/resource/the-true-cost-of-downtime-2024-a-comprehensive-analysis.html',
    acronis_downtime:'https://www.acronis.com/en/blog/posts/how-unplanned-ot-downtime-is-silently-draining-industrial-profits/',
    osha_penalties:  'https://www.osha.gov/news/newsreleases/osha-trade-release/20250114',
    osha_case:       'https://www.osha.gov/businesscase',
    osha_psm:        'https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.119',
    osha_ita:        'https://www.federalregister.gov/documents/2023/07/21/2023-15091/improve-tracking-of-workplace-injuries-and-illnesses',
    nahb_osha:       'https://www.nahb.org/blog/2026/06/top-osha-violations-2026-penalties',
    aflcio_dotj:     'https://aflcio.org/2026/4/27/24-things-you-need-know-2026-death-job-report',
    nuclear_2024:    'https://riskandinsurance.com/nuclear-verdicts-skyrocket-corporate-lawsuit-awards-surge-116-to-31-3-billion-in-2024/',
    nuclear_2025:    'https://www.insurancejournal.com/magazines/mag-features/2026/09/07/883943.htm',
    ncci_sotl:       'https://www.ncci.com/Articles/Documents/AIS2026-SOTL-Presentation.pdf',
    ncci_ij:         'https://www.insurancejournal.com/news/national/2026/05/14/869862.htm',
    naic_msr:        'https://content.naic.org/sites/default/files/publication-msr-pb-property-casualty.pdf',
    milliman_kinetic:'https://www.milliman.com/en/insight/improving-workers-compensation-loss-experience-using-wearable-technology',
    nationwide_kin:  'https://www.dig-in.com/news/nationwide-kinetic-insurance-wearables-for-workers-comp',
    // Regulation
    eu_machinery:    'https://single-market-economy.ec.europa.eu/sectors/mechanical-engineering/machinery_en',
    eu_nis2:         'https://digital-strategy.ec.europa.eu/en/policies/nis2-directive',
    eu_csrd:         'https://finance.ec.europa.eu/financial-markets/company-reporting-and-auditing/company-reporting/corporate-sustainability-reporting_en',
    eu_nzia:         'https://single-market-economy.ec.europa.eu/industry/sustainability/net-zero-industry-act_en',
    isa_62443:       'https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards',
    sec232:          'https://www.whitehouse.gov/presidential-actions/2025/06/adjusting-imports-of-aluminum-and-steel-into-the-united-states/',
    au_manslaughter: 'https://en.wikipedia.org/wiki/Industrial_manslaughter',
    // Structural forces
    iea_wei:         'https://www.iea.org/reports/world-energy-investment-2025/executive-summary',
    iea_ai:          'https://www.iea.org/reports/energy-and-ai/executive-summary',
    census_c30:      'https://www.census.gov/construction/c30/pdf/release.pdf',
    deloitte_mfg:    'https://www.deloitte.com/us/en/insights/industry/manufacturing-industrial-products/manufacturing-industry-outlook.html',
    dragos_yir:      'https://www.dragos.com/blog/dragos-2026-ot-cybersecurity-year-in-review',
    dragos_300b:     'https://www.dragos.com/resources/press-release/new-dragos-report-estimates-over-300-billion-in-potential-global-ot-cyber-risk-exposure',
    dragos_ember:    'https://www.dragos.com/resources/press-release/',
    // AI adoption and quotes
    mckinsey_2026:   'https://www.mckinsey.com/~/media/mckinsey/business%20functions/quantumblack/our%20insights/the%20state%20of%20ai/the-state-of-ai-in-2026-on-the-road-to-roi.pdf',
    mckinsey_2025:   'https://www.mckinsey.com/~/media/mckinsey/business%20functions/quantumblack/our%20insights/the%20state%20of%20ai/november%202025/the-state-of-ai-2025-agents-innovation_cmyk-v1.pdf',
    mit_nanda:       'https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/',
    bcg_value:       'https://web-assets.bcg.com/a5/37/be4ddf26420e95aa7107a35aae8d/bcg-wheres-the-value-in-ai.pdf',
    aramco_ai:       'https://oilprice.com/Latest-Energy-News/World-News/Saudi-Aramco-Expects-Up-to-5-Billion-Gains-from-AI-in-2025.html',
    aramco_metabrain:'https://www.middleeastainews.com/p/aramco-ai--drives-4-billion-value',
    siemens_ces:     'https://press.siemens.com/global/en/pressrelease/siemens-unveils-technologies-accelerate-industrial-ai-revolution-ces-2026',
    siemens_nvidia:  'https://nvidianews.nvidia.com/news/siemens-and-nvidia-expand-partnership-industrial-ai-operating-system',
    siemens_eigen:   'https://press.siemens.com/global/en/pressrelease/siemens-takes-ai-physical-world-next-level-two-new-eigen-engineering-agent',
    siemens_agents:  'https://press.siemens.com/global/en/pressrelease/siemens-introduces-ai-agents-industrial-automation',
    siemens_senseye: 'https://press.siemens.com/global/en/pressrelease/siemens-expands-industrial-copilot-new-generative-ai-powered-maintenance-offering',
    siemens_tk:      'https://press.siemens.com/global/en/pressrelease/siemens-industrial-copilot-expanded-adopted-thyssenkrupp',
    siemens_pg:      'https://www.manufacturingtomorrow.com/news/2026/09/16/siemens-and-procter-gamble-scale-ai-based-quality-inspection-across-global-production-/28216/',
    emerald_ai:      'https://blogs.nvidia.com/blog/ai-energy-management-alliance/',
    rockwell_ms:     'https://www.rockwellautomation.com/en-us/company/news/press-releases/Rockwell-Automation-and-Microsoft-Deliver-on-a-Shared-Vision-to-Accelerate-Industrial-Transformation.html',
    shell_sawan:     'https://arbiterz.com/ai-and-assets-sales-shells-recipe-for-a-leaner-future-wael-sawan/',
    shell_c3:        'https://c3.ai/blog/how-shell-scaled-ai-predictive-maintenance-to-monitor-10000-pieces-of-equipment-globally/',
    bhp_escondida:   'https://www.bhp.com/news/media-centre/releases/2023/05/bhp-and-microsoft-use-ai-to-lift-escondida-copper-recovery',
    energize_proof:  'https://energizecap.com/insights/the-burden-of-proof-evaluating-energy-and-industrial-solutions-in-the-ai-era',
    a16z_dynamism:   'https://a16z.com/building-american-dynamism/',
    eclipse_raise:   'https://thenextweb.com/news/eclipse-fund-vi-early-growth-iii-1-3-billion',
    // AI-native vendors and startups
    voxel_b:         'https://www.prnewswire.com/news-releases/voxel-raises-44m-in-series-b-funding-to-transform-workplace-safety-with-its-ai-powered-platform-302471555.html',
    protex_b:        'https://www.protex.ai/news/protex-ai-secures-36m-series-b-to-power-safer-and-smarter-industrial-workplaces-with-ai',
    intenseye_b:     'https://www.businesswire.com/news/home/20240227534107/en/',
    intenseye_site:  'https://www.intenseye.com/',
    tulip_d:         'https://tulip.co/press/tulip-secures-120m-series-d/',
    kinetic:         'https://kineticcomp.com/',
    komatsu_ahs:     'https://www.komatsu.jp/en/newsroom/2026/20260422',
    strongarm:       'https://strongarmtech.com/',
    aatmunn:         'https://aatmunn.com/',
    augmentir:       'https://www.augmentir.ai/news',
    poka:            'https://www.poka.io/en/customers-stories/loreal-improving-training-and-empowering-workers',
    augury_f:        'https://www.augury.com/media-center/press/augury-announces-75-million-of-funding-and-maintains-1b-valuation-as-it-accelerates-leadership-in-industrial-ai-solutions/',
    seeq_d:          'https://www.seeq.com/resources/press-releases/seeq-announces-50-million-series-d-funding-round-led-by-sixth-street-growth/',
    uptake_bosch:    'https://www.dcvelocity.com/transportation/trucking/truck-facilities-maintenance/bosch-acquires-uptake-to-expand-predictive-maintenance-for-commercial-fleets',
    cognite_se:      'https://www.cognite.com/en/company/newsroom/schneider-electric-announces-agreement-to-acquire-cognite',
    cognite_site:    'https://www.cognite.com/',
    imubit:          'https://imubit.com/',
    fero:            'https://www.prnewswire.com/news-releases/fero-labs-secures-15m-to-reduce-manufacturing-emissions-with-ai-301856002.html',
    gecko_d:         'https://www.geckorobotics.com/news/gecko-reaches-unicorn-status',
    gecko_cnbc:      'https://www.cnbc.com/2025/06/12/gecko-robotics-raises-125-million-surpassing-billion-dollar-valuation.html',
    anybotics:       'https://www.venturelab.swiss/EUR-127-million-for-ANYbotics-fourlegged-robot-workforce',
    bd_chevron:      'https://bostondynamics.com/case-studies/meet-chevrons-new-energy-watchdog/',
    percepto:        'https://percepto.co/methane-regulation/',
    skydio_f:        'https://dronexl.co/2026/04/23/skydio-110m-series-f-44-billion-valuation/',
    korial:          'https://www.korial.com/',
    landingai:       'https://www.landing.ai/',
    archetype:       'https://www.archetypeai.io/blog/archetype-ai-series-a',
    caryatid:        'https://caryatid.ai/',
    nvidia_cosmos:   'https://nvidianews.nvidia.com/news/nvidia-launches-cosmos-world-foundation-model-platform-to-accelerate-physical-ai-development',
    armis_round:     'https://techcrunch.com/2025/11/05/armis-raises-435m-pre-ipo-round-at-6-1b-valuation-after-refusing-ma-offers',
    armis_now:       'https://newsroom.servicenow.com/press-releases/details/2026/ServiceNow-completes-Armis-acquisition-closing-the-gap-between-asset-visibility-and-cyber-risk/default.aspx',
    nozomi_close:    'https://www.prnewswire.com/news-releases/nozomi-networks-enters-next-phase-of-growth-as-mitsubishi-electric-completes-acquisition-302673652.html',
    claroty_100m:    'https://claroty.com/press-releases/claroty-secures-usd100-million-in-strategic-growth-financing',
    phaidra:         'https://www.phaidra.ai/',
    instrumental:    'https://instrumental.com/',
    elementary:      'https://www.elementaryml.com/',
    enablon:         'https://www.wolterskluwer.com/en/expert-insights/how-pfizer-digitalized-its-work-permit-process-to-reduce-work-related-injuries',
    enablon_yara:    'https://www.wolterskluwer.com/en/expert-insights/yara-improves-efficiency-and-safety-with-digital-permit-to-work',
    safetyculture:   'https://mitti.com/media-releases/safetyculture-acquires-twine-to-accelerate-agentic-platform-ambitions',
    safetyculture_rd:'https://www.startupdaily.net/topic/funding/safetyculture-takes-200-million-valuation-haircut-to-bank-another-75-million/',
    sphera_news:     'https://sphera.com/company/news/workers-fail-to-report-safety-incidents-despite-easy-reporting-systems',
    sphera_bx:       'https://www.blackstone.com/news/press/blackstone-to-acquire-sphera-a-leading-provider-of-esg-software-data-and-consulting-services-from-genstar-capital-for-1-4-billion/',
    sphera_exit:     'https://www.privateequitywire.co.uk/blackstone-eyes-3bn-exit-from-esg-software-specialist-sphera/',
    ideagen_cmd:     'https://www.hgcapitaltrust.com/~/media/Files/H/Hgcapital-Trust-V2/documents/investors/publications/2024/Capital-markets-day-2024/portfolio-company-spotlight-ideagen.pdf',
    ideagen_deal:    'https://www.insidermedia.com/news/midlands/terms-agreed-on-1.05bn-ideagen-acquisition',
    intelex_deal:    'https://www.kirkland.com/news/press-release/2019/06/kirkland-represents-fortive-on-industrial-scientif',
    interplay:       'https://www.interplaylearning.com/',
    vention:         'https://vention.com/press',
    abb_softbank:    'https://new.abb.com/news/detail/129685/abb-to-divest-robotics-division-to-softbank-group',
    procore_dd:      'https://www.equipmentworld.com/technology/article/15832798/procore-to-acquire-dronedeploy-for-845-million',
    // dss+ and CVC
    dss_about:       'https://www.consultdss.com/about/about-us/',
    dss_proaction:   'https://www.consultdss.com/news/dssplus-acquires-proaction-international-to-deepen-operational-excellence/',
    gyrus:           'https://www.gyruscapital.com/portfolio',
    erm_wiki:        'https://en.wikipedia.org/wiki/ERM_(consultancy)',
    pitchbook_q2_26: 'https://nvca.org/wp-content/uploads/2026/07/Q2-2026-PitchBook-NVCA-Venture-Monitor.pdf',
    pitchbook_q2_25: 'https://nvca.org/wp-content/uploads/2025/07/Q2-2025-PitchBook-NVCA-Venture-Monitor-19728.pdf',
    gcv_wocv:        'https://www.worldofcorporateventuring.com/executive-summary',
    gcv_toolkit:     'https://globalventuring.com/corporate/overview/corporates-broaden-the-venture-toolkit/',
    songma:          'https://corpgov.law.harvard.edu/2019/04/15/the-life-cycle-of-corporate-venture-capital/',
    mitsmr_cvc:      'https://sloanreview.mit.edu/article/steer-clear-of-corporate-venture-capital-pitfalls/',
    emerald_25:      'https://finance.yahoo.com/news/emerald-technology-ventures-celebrates-25-100000453.html',
    emerald_dic:     'https://www.dic-global.com/en/news/2026/ir/20260213145018.html',
    emerald_mitsui:  'https://www.globenewswire.com/news-release/2026/05/13/3293645/0/en/mitsui-kinzoku-backs-emerald-fund-to-tap-global-startup-innovation-in-climate-tech-robotics-and-next-gen-computing.html',
    eip_fund3:       'https://www.vcaonline.com/news/2025100721/energy-impact-partners-closes-latest-flagship-fund-at-pivotal-moment-for-the-energy-sector/',
    energize_fund3:  'https://www.prnewswire.com/news-releases/energize-capital-raises-430-million-to-capitalize-and-scale-digitally-enabled-climate-solutions-302471446.html',
    abb_ventures:    'https://www.abb.com/global/en/company/ventures',
    se_ventures:     'https://www.seventures.com/',
    bhp_ventures:    'https://www.bhp.com/about/our-businesses/ventures',
    vale_ventures:   'https://vale.com/vale-ventures',
    xcarb:           'https://corporate.arcelormittal.com/climate-action/xcarb/xcarb-innovation-fund',
    caterpillar_v:   'https://www.caterpillar.com/en/company/innovation/caterpillar-ventures.html',
    hitachi_v:       'https://www.hitachi-ventures.com/',
    lmsv:            'https://www.lmstrategicventures.com/about-lmsv/our-fund/overview',
    tyson_v:         'https://www.tysonfoods.com/innovation/food-innovation/tyson-ventures',
    ngp:             'https://www.ngpartners.com/'
  };

  // Headline tiles: the spend, and what the spend is trying to prevent ------
  var headlineStats = [
    { label: 'Heavy-industry OT & safety spend', value: '$410B', sub: '2025, bottom-up sum of ten sourced categories, range $370-470B (see method)', evidence: 'derived' },
    { label: 'US cost of work injuries', value: '$181.4B', sub: '2024; $48,000 per medically consulted injury, $1.54M per death (NSC)', evidence: 'official', src: SRC.nsc_costs },
    { label: 'Work-related deaths, global', value: '2.93M/yr', sub: 'ILO estimate for 2019; 395M non-fatal injuries; lost work days almost 4% of world GDP (ILO)', evidence: 'official', src: SRC.ilo_3m },
    { label: 'Unplanned downtime, Fortune Global 500', value: '$1.4T', sub: '11% of revenue (Siemens True Cost of Downtime 2024); ABB survey median $125k per hour', evidence: 'analyst', src: SRC.siemens_downtime },
    { label: 'Largest downstream hydrocarbon losses from integrity failure', value: '44%', sub: 'Mechanical-integrity failures, downstream and midstream; refining fleet averages ~45 years old, BI:PD above the historical 3:1 (Marsh, 29th ed.)', evidence: 'analyst', src: SRC.marsh_100 },
    { label: 'US workers\' comp premium', value: '$41.6B', sub: '2025 private-carrier net written premium, combined ratio 91; US casualty rates +7% in Q2 2026 (NCCI, Marsh)', evidence: 'official', src: SRC.ncci_sotl }
  ];

  // =====================================================================
  // LAYER B: WHAT IS BOUGHT (2025, USD billions, global)
  // Destination totals are the anchors of the river.
  // =====================================================================
  var destinations = [
    { id: 'dest_automation', label: 'Automation & control systems (DCS, PLC, SCADA, SIS, drives)', short: 'Automation & control', value_b: 110.0, display: '$110B',
      evidence: 'derived', src: SRC.gvr_iacs, year: '2025',
      description: 'Distributed control systems, PLC/PAC, SCADA and HMI, safety instrumented systems, drives and motion. No single published total: Grand View sizes industrial automation and control at $226.8B (2025) but includes control valves (24%), robots and sensors; MarketsandMarkets process automation and instrumentation $74.2B (2024); Interact Analysis low-voltage drives $14.4B and motion controls $12.3B. The nine vendor segments in the note sum to ~$85B as reported, roughly $63B once instruments, software and services are stripped out. Working figure $110B (range $95-130B).',
      note: 'SIS logic solvers sit inside DCS-vendor revenue and stay here, not in safety systems. Vendor segments: Siemens DI automation ~EUR 11.6B, ABB Motion $8.2B + Automation $8.1B, Emerson $18.0B (group), Rockwell $8.3B, Honeywell Industrial Automation $9.4B, Schneider Industrial Automation EUR 7.0B, Yokogawa Control JPY 566B (FY25), Mitsubishi Electric FA JPY 798B, Omron IAB JPY 410B.' },
    { id: 'dest_instruments', label: 'Field instrumentation, analyzers & valves', short: 'Instrumentation & valves', value_b: 50.0, display: '$50B',
      evidence: 'derived', src: SRC.mm_process, year: '2025',
      description: 'Pressure, level, flow and temperature transmitters, process analyzers, control valves and actuators, condition-monitoring sensors. MarketsandMarkets: field instruments dominated the $74.2B process automation and instrumentation market in 2024; at 45-50% that is $33-37B, plus control valves and actuators (~$12-15B on stand-alone scopes) and condition-monitoring sensors. Vendor check: Endress+Hauser EUR 4.0B, Emerson Measurement & Analytical $4.1B plus Final Control $4.4B, ABB Measurement & Analytics inside Automation.',
      note: 'Grand View puts control valves at 24% of its $226.8B automation figure (~$54B), a scope artefact; stand-alone valve estimates run $10-15B.' },
    { id: 'dest_software', label: 'Industrial software (MES, APM/EAM, historians, simulation, twins)', short: 'Industrial software', value_b: 40.0, display: '$40B',
      evidence: 'derived', src: SRC.iot_analytics, year: '2025',
      description: 'The heavy-industry-relevant slice of MES/MOM, asset performance and EAM, historians, process simulation and APC, plant engineering and digital-twin tools, scheduling. Analyst definitions span $21.5B (MarketsandMarkets, MES-centric, 2024) to $146B+ (IoT Analytics, includes cloud, ERP and cybersecurity). Disclosed vendor revenue: Siemens DI software EUR 6.17B, Dassault EUR 6.24B, PTC $2.74B, Bentley $1.50B, Octave (ex-Hexagon ALI) $1.6B, Emerson software ACV $1.56B (incl. AspenTech), AVEVA undisclosed (ARR +12%). A large share of that is discrete PLM/CAD/EDA and civil infrastructure, which is why the working figure sits below the disclosed sum.' },
    { id: 'dest_ai', label: 'Industrial AI & analytics (stand-alone)', short: 'Industrial AI & analytics', value_b: 10.0, display: '$10B',
      evidence: 'modeled', src: SRC.mm_aimfg, year: '2025',
      description: 'AI and analytics bought as a separate line rather than as a feature of the suites above: MarketsandMarkets AI in manufacturing $34.2B (2025, hardware-heavy, all manufacturing) at roughly a 30% heavy-industry share. The weakest line in the river, kept separate so the AI overlay has a home. Vendor scale: Palantir US commercial $1.47B (industrial share undisclosed), Cognite >$170M (bought by Schneider for $3.1B, Jun 2026), C3.ai $250M and guiding lower.',
      note: 'IDC publishes no manufacturing, process or utilities AI split; Gartner none by vertical. Range $8-12B.' },
    { id: 'dest_robotics', label: 'Robotics, drones & autonomous inspection (heavy industry)', short: 'Robotics & inspection', value_b: 11.0, display: '$11B',
      evidence: 'derived', src: SRC.gvr_robotics, year: '2025',
      description: 'Industrial robots and cells landing in metal, chemicals, food, mining and energy, plus inspection robots, drones and autonomous-haulage retrofits. IFR: 542,000 industrial robots installed in 2024, 53% in general industry (metal and machinery +18%, plastics and chemicals +18%, food +42%); Grand View industrial robotics $37.8B (2025). Heavy-industry robot spend $7-9B plus inspection robots and drones $2-4B (not separately measured). Automotive and electronics cells are excluded here and live in the robotics river.' },
    { id: 'dest_safety', label: 'Safety systems & PPE (PPE, gas detection, F&G, machine safety)', short: 'Safety systems & PPE', value_b: 50.0, display: '$50B',
      evidence: 'derived', src: SRC.mm_ppe, year: '2025',
      description: 'Industrial PPE, portable and fixed gas detection, fire and gas systems, machine safety (light curtains, safety PLCs, interlocks), fall protection. PPE: MarketsandMarkets $56.6B (2024, incl. healthcare) vs Grand View $90.4B (2025, healthcare-heavy); industrial share ~$33-40B. Gas detection $3.84B (2025); machine safety $5.66B (2025). Vendors: 3M Personal Safety $3.54B, MSA $1.875B (Detection $763M), Draeger Safety division EUR 1.49B, Ansell Industrial $0.9B; Honeywell sold its PPE unit to PIP for $1.325B (May 2025) and kept gas detection.',
      note: 'Range $45-65B. Machine safety is counted here, not in automation. Fire and gas, SIS field devices and fall protection have no stand-alone analyst figure.' },
    { id: 'dest_ehs', label: 'EHS software, connected worker & wearables', short: 'EHS & connected worker', value_b: 5.0, display: '$5B',
      evidence: 'derived', src: SRC.verdantix_ehs, year: '2025',
      description: 'EHS software, connected-worker platforms, wearables and lone-worker devices. Verdantix: EHS software $1.9B (2023) growing 14.6% a year, so ~$2.5B in 2025, with safety management ~60% of it; connected worker ~$2.1B (2025, derived from $1.38B in 2022 at 15.3%). MarketsandMarkets connected worker $8.62B on a broader hardware scope. Blackline Safety C$150.5M revenue, ARR C$84.5M (+27%), taken private by Francisco Partners for up to C$850M (agreed Apr 2026).',
      note: 'Smallest category in the river and the one growing fastest. Verdantix digital EHS services ($3.2B, 2025) are counted under engineering and consulting.' },
    { id: 'dest_otcyber', label: 'OT / ICS cybersecurity', short: 'OT cybersecurity', value_b: 11.0, display: '$11B',
      evidence: 'derived', src: SRC.mordor_ot, year: '2025',
      description: 'Products and services protecting ICS and SCADA networks. Frost & Sullivan trajectory $10.2B (2025); Mordor $22.15B (2025, includes managed services; manufacturing 28.7%, power utilities fastest at 19.4% CAGR); MarketsandMarkets $84.5B counts all IT security bought by industrial firms. Vendors: Nozomi $101.7M revenue (2025; Mitsubishi Electric paid $883M for the 93% it did not own), Armis ARR ~$300M (bought by ServiceNow for $7.75B, closed Apr 2026), Claroty ARR >$100M (2023), Dragos.',
      note: 'Range $10-22B depending on whether managed services and IT-side tools are included.' },
    { id: 'dest_engineering', label: 'Engineering, system integration & OT consulting', short: 'Engineering, SI & consulting', value_b: 85.0, display: '$85B',
      evidence: 'derived', src: SRC.gvr_services, year: '2025',
      description: 'Project engineering, system integration, installation, commissioning and OT and safety consulting bought around the hardware and software above. Grand View industrial automation services $175.4B (2024, includes maintenance and operational services); the project-and-consulting slice is roughly half. Sanity check: integration typically costs as much as the equipment it wraps; Rockwell Lifecycle Services $2.2B, Yokogawa project orders JPY 242B, dss+ 1,700 consultants in 41 countries (revenue undisclosed), ERM $1.3B (2023).',
      note: 'Largest pool of labor in the river and the least measured. Range $70-100B. EPC automation packages in mega-projects overlap vendor project revenue.' },
    { id: 'dest_maintenance', label: 'Maintenance, reliability services & spares', short: 'Maintenance & reliability', value_b: 40.0, display: '$40B',
      evidence: 'derived', src: SRC.abb_q4, year: '2025',
      description: 'Vendor and third-party lifecycle services: maintenance contracts, calibration, spares, condition monitoring, turnaround inspection. Vendor service lines: ABB services $5.55B (16.7% of group; Automation area ~37% services), Rockwell Lifecycle Services $2.2B, FANUC service 16.5% of sales, Draeger Services >EUR 1B, Yokogawa solution and service ~26% of Control orders. Predictive-maintenance market $13.9B (2026, MarketsandMarkets, includes sensors).',
      note: 'Range $35-45B: lifecycle services at 20-30% of installed-base vendor revenue plus third-party condition monitoring and calibration.' }
  ];

  // =====================================================================
  // LAYER A: WHO PAYS (2025, modeled split of destination totals by vertical)
  // Values are computed below from destToBuyerShares.
  // =====================================================================
  var paymentChannels = [
    { id: 'pay_oilgas', label: 'Oil & gas (upstream, midstream, refining, LNG)', short: 'Oil & gas', role: 'industry', evidence: 'modeled', src: SRC.iea_wei,
      description: 'Upstream, midstream, LNG and refining. IEA: upstream investment just under $570B in 2025 (-4%). The largest buyer of instrumentation and process control. Marsh: 44% of the 100 largest hydrocarbon losses trace to mechanical-integrity failure and the refining fleet averages ~45 years (North America 61). Aramco expects $3-5B of technology-realised value in 2025.' },
    { id: 'pay_chem', label: 'Chemicals, petrochemicals & industrial gases', short: 'Chemicals', role: 'industry', evidence: 'modeled', src: SRC.csb,
      description: 'Chemicals, petrochemicals, polymers, industrial gases. OSHA PSM and Seveso sites; the US CSB logged 500+ serious chemical incidents in five years, 30 of them causing $1.8B of property damage.' },
    { id: 'pay_mining', label: 'Mining, metals & steel', short: 'Mining & metals', role: 'industry', evidence: 'modeled', src: SRC.icmm,
      description: 'Mining, metals, steel, aluminium. ICMM members: 42 fatalities in 2024 (36 in 2023), only 9 of 24 members fatality-free; BHP FY2025 zero fatalities. PwC: top-40 miners $909B revenue, $248B EBITDA. Section 232 steel and aluminium tariffs at 50% since 4 Jun 2025.' },
    { id: 'pay_power', label: 'Power, utilities & water', short: 'Power & utilities', role: 'industry', evidence: 'modeled', src: SRC.iea_ai,
      description: 'Generation, grids, water and waste utilities, nuclear. IEA: $1.5T of electricity-sector investment and ~$400B of grid spend in 2025; data-centre power 415 TWh (2024) heading to ~945 TWh (2030). Fastest-growing OT-cyber buyer (Mordor: power utilities 19.4% CAGR); NIS2 and NERC CIP regulated.' },
    { id: 'pay_discrete', label: 'Discrete manufacturing (automotive, machinery, electronics, aero)', short: 'Discrete manufacturing', role: 'industry', evidence: 'modeled', src: SRC.idc_dx,
      description: 'Automotive, machinery, electronics, aerospace, tyres. The largest software and robotics buyer (IDC: discrete-manufacturing digital-transformation spend ~$500B in 2024, largest of 19 industries). Siemens, Rockwell, Mitsubishi Electric and Omron are discrete-weighted. US manufacturing construction fell 21.7% year on year by Jul 2026 after the 2024-25 peak.' },
    { id: 'pay_process', label: 'Process manufacturing (food, pharma, pulp, cement, glass)', short: 'Process manufacturing', role: 'industry', evidence: 'modeled', src: SRC.yokogawa_fy25,
      description: 'Food and beverage, pharma, pulp and paper, cement, glass. Yokogawa\'s Life subsegment (food, pharma) took only 9% of its FY25 Control orders (Energy & Sustainability 57%); food robot installs +42% in 2024 (IFR); Verdantix: high-risk industries are 54% of digital EHS services spend.' },
    { id: 'pay_construction', label: 'Construction & infrastructure', short: 'Construction & infra', role: 'industry', evidence: 'modeled', src: SRC.bls_by_industry,
      description: 'Construction and infrastructure owners and contractors. Highest fatal-injury count in the US (1,034 in 2024, 9.2 per 100,000 FTE; BLS) and 23% of EU fatal accidents at work (2024, Eurostat); second-largest PPE end use (MarketsandMarkets).' },
    { id: 'pay_transport', label: 'Transport & logistics infrastructure (rail, ports, airports)', short: 'Transport infra', role: 'industry', evidence: 'modeled', src: SRC.bls_transport,
      description: 'Rail, ports, airports, logistics infrastructure. US transportation and warehousing: 865 fatalities in 2024, second only to construction (BLS).' }
  ];

  // Share of each destination's spend by buyer vertical (rows sum to 1).
  // Anchors: Yokogawa FY25 Control order mix (Energy & Sustainability 57% / Materials 34% / Life 9%),
  // IFR 2024 installs by industry, Grand View PPE end use, Mordor OT-cyber
  // end-user shares, Verdantix EHS spend by industry, IDC DX by industry.
  var destToBuyerShares = {
    dest_automation:   { pay_oilgas: 0.20, pay_chem: 0.14, pay_mining: 0.08, pay_power: 0.15, pay_discrete: 0.25, pay_process: 0.14, pay_construction: 0.01, pay_transport: 0.03 },
    dest_instruments:  { pay_oilgas: 0.27, pay_chem: 0.20, pay_mining: 0.07, pay_power: 0.16, pay_discrete: 0.06, pay_process: 0.20, pay_construction: 0.01, pay_transport: 0.03 },
    dest_software:     { pay_oilgas: 0.12, pay_chem: 0.10, pay_mining: 0.05, pay_power: 0.10, pay_discrete: 0.40, pay_process: 0.13, pay_construction: 0.07, pay_transport: 0.03 },
    dest_ai:           { pay_oilgas: 0.12, pay_chem: 0.10, pay_mining: 0.05, pay_power: 0.10, pay_discrete: 0.40, pay_process: 0.15, pay_construction: 0.05, pay_transport: 0.03 },
    dest_robotics:     { pay_oilgas: 0.04, pay_chem: 0.06, pay_mining: 0.16, pay_power: 0.02, pay_discrete: 0.58, pay_process: 0.10, pay_construction: 0.02, pay_transport: 0.02 },
    dest_safety:       { pay_oilgas: 0.18, pay_chem: 0.12, pay_mining: 0.10, pay_power: 0.08, pay_discrete: 0.20, pay_process: 0.12, pay_construction: 0.17, pay_transport: 0.03 },
    dest_ehs:          { pay_oilgas: 0.15, pay_chem: 0.12, pay_mining: 0.10, pay_power: 0.12, pay_discrete: 0.22, pay_process: 0.15, pay_construction: 0.10, pay_transport: 0.04 },
    dest_otcyber:      { pay_oilgas: 0.15, pay_chem: 0.08, pay_mining: 0.05, pay_power: 0.25, pay_discrete: 0.29, pay_process: 0.10, pay_construction: 0.02, pay_transport: 0.06 },
    dest_engineering:  { pay_oilgas: 0.20, pay_chem: 0.14, pay_mining: 0.08, pay_power: 0.15, pay_discrete: 0.22, pay_process: 0.15, pay_construction: 0.03, pay_transport: 0.03 },
    dest_maintenance:  { pay_oilgas: 0.22, pay_chem: 0.14, pay_mining: 0.09, pay_power: 0.16, pay_discrete: 0.18, pay_process: 0.16, pay_construction: 0.02, pay_transport: 0.03 }
  };

  // =====================================================================
  // LAYER C: WHAT THE DOLLARS FUND (cost pools)
  // Decomposition follows the vendor archetypes in the filings: a hardware
  // OEM dollar is ~50c COGS / 8c R&D / 20c SG&A / 20c profit (Rockwell,
  // ABB, Schneider, Yokogawa, MSA, Draeger); a software dollar ~15-20c COGS,
  // 15-21c R&D, 25-35c S&M+G&A, 25-35c profit (PTC, Bentley, Dassault,
  // Hexagon); services and SI cluster at 6-15% operating margin.
  // =====================================================================
  var costPools = [
    { id: 'pool_bom', label: 'Hardware BOM & manufacturing', short: 'Hardware BOM & mfg',
      description: 'Electronics, enclosures, sensor elements, valve bodies, cable, PPE textiles and the factories that assemble them. Cost of goods is ~52% of sales at Rockwell (GM 48.1%), ~58-59% at ABB and Schneider (GM 41-42%), ~54% at MSA (GM 46.5%) and Draeger (45.2%).',
      leaders: 'Siemens, ABB, Schneider, Emerson, Rockwell, Yokogawa, Mitsubishi Electric, Omron, Endress+Hauser, VEGA, Krohne; 3M, MSA, Draeger, Honeywell (gas detection), Ansell; contract electronics in Asia.' },
    { id: 'pool_eng_labor', label: 'Engineering, integration & commissioning labor', short: 'Engineering & integration',
      description: 'Project engineering, configuration, programming, FAT/SAT, installation and commissioning, whether billed by integrators, EPCs or the vendor. The old $500-per-I/O-point rule of thumb understates engineering hours badly; integration typically costs as much as the robot or system it wraps; software implementation runs 20-100% of licence and up to 5x on complex projects. One documented DCS migration overran its budget by 87%.',
      leaders: 'Rockwell Lifecycle Services ($2.2B, 14.5% margin), Yokogawa projects, ABB Automation services, Honeywell Process Solutions, Wood, Worley, Jacobs, CSIA integrators (~1,000 firms), Accenture Industry X.' },
    { id: 'pool_field_service', label: 'Field service, inspection & maintenance labor', short: 'Field service & maintenance',
      description: 'Technicians, calibration crews, turnaround and inspection contractors, managed OT-security operations. Vendor service lines run at 14-16% of sales (ABB 16.7%, FANUC 16.5%, Rockwell 26% incl. projects), Draeger Services ~29% of sales.',
      leaders: 'ABB, Emerson, Siemens, Honeywell, Yokogawa service organisations; Bureau Veritas, Mistras, SGS, TUV (inspection); Dragos, Honeywell OT SOC (managed security).' },
    { id: 'pool_spares', label: 'Spares, consumables & replacement PPE', short: 'Spares & consumables',
      description: 'Spare boards and valves, sensor cells, calibration gas, filters, gloves and respirators bought again and again. The recurring, margin-rich end of hardware: MSA Detection and 3M Personal Safety are largely replacement demand.',
      leaders: 'OEM spares channels; PPE distributors (Grainger, Fastenal, Wesco: GM ~21%); MSA, 3M, Ansell, Draeger.' },
    { id: 'pool_software', label: 'Software engineering, cloud & compute (incl. software R&D)', short: 'Software, cloud & compute',
      description: 'Developer payroll, hosting and edge compute behind the software and AI categories: R&D 16.7% of revenue at PTC, 20.5% at Bentley, ~16% at Hexagon (incl. capitalised), plus 15-20% cost of revenue for hosting and support. Sub-scale AI vendors invert the model: C3.ai GAAP gross margin 31%, guiding to a $128-160M non-GAAP operating loss.',
      leaders: 'Siemens DI software (EUR 6.17B), AVEVA (Schneider), AspenTech (Emerson), Dassault, PTC, Bentley, Octave, Cognite (now Schneider), Palantir, Samsara (GM 77%), NVIDIA and Microsoft as substrate.' },
    { id: 'pool_rnd', label: 'Vendor R&D (hardware & controls)', short: 'Vendor R&D',
      description: 'Product development at the hardware and controls vendors: 8.1% of sales at Rockwell ($679M), 5.6% at Schneider, 5.5% at Yokogawa, 7.0% at Endress+Hauser, 9.6% at Draeger, 3.5% at MSA; Siemens group 8.3%.',
      leaders: 'Siemens (EUR 6.6B group R&D), Emerson, Rockwell, ABB, Schneider, Yokogawa, Endress+Hauser, Draeger, MSA.' },
    { id: 'pool_sga', label: 'Sales, distribution & channel', short: 'Sales & channel',
      description: 'Vendor sales forces and marketing (~20% of sales at OEMs, 25-35% at software vendors) plus the distributor layer that carries PPE, drives and components: Wesco $23.5B sales at ~21% gross margin, Graybar $12.9B at 3.3% net.',
      leaders: 'Wesco, Graybar, Grainger, Fastenal, Rexel, RS Group; vendor direct sales and channel partners.' },
    { id: 'pool_margin', label: 'Vendor operating profit', short: 'Vendor profit',
      description: 'Where the dollar is retained: 25-35% at product and software vendors (PTC 36% GAAP, Emerson Software & Control 31%, Rockwell Software & Control 29.7%, Hexagon 27.2%, MSA 22.1% adjusted) against 6-15% in services and integration (ABB Automation 14.0%, Schneider IA 14.2%, Yokogawa Control ~13%, Rockwell Lifecycle Services 14.5%; Draeger Safety division 11.9% EBIT).',
      leaders: 'Retained most by Emerson, Rockwell, PTC, Bentley, Dassault, Hexagon, MSA; least by integrators, EPCs and safety-hardware makers with heavy service mix.' },
    { id: 'pool_consulting', label: 'Consulting, certification & training', short: 'Consulting & certification',
      description: 'Safety and operational-excellence consultants, functional-safety and Ex certification bodies, auditors, operator and safety training. dss+ (ex-DuPont Sustainable Solutions): 1,700 consultants, 41 countries; ERM $1.3B revenue; Verdantix digital EHS services $3.2B (2025), 70% implementation. EU-OSHA: EUR 2.2 back per euro invested in OSH; OSHA: $2 or more per $1.',
      leaders: 'dss+, ERM, Worley Consulting, Wood, DEKRA, TUV, DNV, Bureau Veritas, exida (SIL); Interplay Learning, Poka (IFS) for training.' }
  ];

  var destToPoolWeights = {
    dest_automation:  { pool_bom: 0.42, pool_eng_labor: 0.14, pool_field_service: 0.04, pool_spares: 0.03, pool_software: 0.07, pool_rnd: 0.06, pool_sga: 0.14, pool_margin: 0.10 },
    dest_instruments: { pool_bom: 0.45, pool_eng_labor: 0.08, pool_field_service: 0.05, pool_spares: 0.06, pool_software: 0.03, pool_rnd: 0.07, pool_sga: 0.15, pool_margin: 0.11 },
    dest_software:    { pool_software: 0.35, pool_eng_labor: 0.15, pool_sga: 0.25, pool_margin: 0.22, pool_consulting: 0.03 },
    dest_ai:          { pool_software: 0.50, pool_eng_labor: 0.15, pool_sga: 0.30, pool_margin: 0.05 },
    dest_robotics:    { pool_bom: 0.38, pool_eng_labor: 0.22, pool_field_service: 0.08, pool_spares: 0.04, pool_software: 0.10, pool_rnd: 0.06, pool_sga: 0.08, pool_margin: 0.04 },
    dest_safety:      { pool_bom: 0.44, pool_spares: 0.08, pool_field_service: 0.05, pool_eng_labor: 0.04, pool_software: 0.02, pool_rnd: 0.05, pool_sga: 0.18, pool_margin: 0.10, pool_consulting: 0.04 },
    dest_ehs:         { pool_software: 0.35, pool_eng_labor: 0.12, pool_bom: 0.10, pool_sga: 0.25, pool_margin: 0.13, pool_consulting: 0.05 },
    dest_otcyber:     { pool_software: 0.35, pool_eng_labor: 0.15, pool_field_service: 0.10, pool_bom: 0.05, pool_sga: 0.25, pool_margin: 0.10 },
    dest_engineering: { pool_eng_labor: 0.55, pool_consulting: 0.15, pool_bom: 0.08, pool_software: 0.04, pool_sga: 0.08, pool_margin: 0.10 },
    dest_maintenance: { pool_field_service: 0.50, pool_spares: 0.25, pool_eng_labor: 0.05, pool_software: 0.03, pool_sga: 0.07, pool_margin: 0.10 }
  };

  // ---- Builders --------------------------------------------------------
  function round1(x) { return Math.round(x * 10) / 10; }
  function fmtUSD(b) {
    if (b >= 1000) return '$' + (b / 1000).toFixed(2) + 'T';
    return '$' + b.toFixed(1) + 'B';
  }

  function buildAB(payments, dests, shares) {
    var links = [];
    var totals = {};
    dests.forEach(function (d) {
      var row = shares[d.id] || {};
      Object.keys(row).forEach(function (pId) {
        var v = d.value_b * row[pId];
        totals[pId] = (totals[pId] || 0) + v;
        links.push({ id: 'fl_' + pId + '__' + d.id, source: pId, target: d.id, value_b: v, span: 'AB' });
      });
    });
    payments.forEach(function (p) {
      p.value_b = round1(totals[p.id] || 0);
      p.display = fmtUSD(p.value_b);
    });
    return links;
  }
  function buildBC(dests, w) {
    var links = [];
    dests.forEach(function (d) {
      var row = w[d.id] || {};
      var ws = 0; Object.keys(row).forEach(function (k) { ws += row[k]; });
      if (ws <= 0) return;
      Object.keys(row).forEach(function (poolId) {
        links.push({ id: 'fl_' + d.id + '__' + poolId, source: d.id, target: poolId, value_b: d.value_b * (row[poolId] / ws), span: 'BC' });
      });
    });
    return links;
  }

  var moneyLinksAB = buildAB(paymentChannels, destinations, destToBuyerShares);
  var moneyLinksBC = buildBC(destinations, destToPoolWeights);

  // =====================================================================
  // AI SURFACES (overlay): the 14 wedges, where each attaches, who buys
  // =====================================================================
  var aiSurfaces = [
    { id: 'ai_vision_safety', label: 'Vision-based safety',
      attach_pools: ['pool_software', 'pool_consulting'],
      attach_dests: ['dest_safety', 'dest_ehs', 'dest_ai'],
      what: 'Computer vision on existing CCTV that flags unsafe acts and conditions (PPE, forklift-pedestrian conflicts, zone intrusion, ergonomics) and turns them into coaching. Voxel ($44M Series B, Jun 2025; deployed customers report 91% fewer recordable injuries, one site saved ~$2.2M over two years; Tokio Marine an investor, Gallagher a risk-control partner), Protex AI ($36M Series B; DHL saw an average 64% risk reduction within three months), Intenseye (400+ facilities, 45+ countries; Huhtamaki TRIR -40%, Henkel TRIR 3.3 to 0).',
      buyer: 'VP EHS and plant safety managers from the corporate EHS budget, increasingly co-funded by risk and insurance.',
      adoption: 'Camera coverage, works-council and union consent, false-positive fatigue and integration with the EHS system of record are the gates; insurer distribution is the accelerator. The wedge where AI already ships in heavy industry.' },
    { id: 'ai_connected_worker', label: 'Connected worker & wearables',
      attach_pools: ['pool_software', 'pool_bom'],
      attach_dests: ['dest_ehs', 'dest_safety', 'dest_software'],
      what: 'Lone-worker and gas-detection devices with cloud monitoring, frontline apps and ergonomic wearables. Blackline Safety (ARR C$93M, +24%; 128% net dollar retention at FY2025 year-end; taken private by Francisco Partners for up to C$850M), Tulip ($120M Series D led by Mitsubishi Electric at $1.3B; 1,000 sites in 45 countries, 60,000 frontline workers), Kinetic (workers\' comp insurer backed by Nationwide that pairs policies with its wearables; actuarial review found 50-60% fewer injuries), StrongArm (35% average soft-tissue injury reduction; Walmart, Tyson, 3M), Aatmunn (ex-Guardhat, 250+ companies), Augmentir agents.',
      buyer: 'EHS plus operations; connected-worker platforms increasingly bought by the COO or head of digital manufacturing.',
      adoption: 'ATEX certification, site connectivity, location-tracking privacy and PPE-distributor procurement cycles slow it; insurer underwriting acceptance (Nationwide/Kinetic) is the model to copy.',
      dvc: ['Humand'] },
    { id: 'ai_pdm', label: 'Predictive maintenance & APM',
      attach_pools: ['pool_field_service', 'pool_spares', 'pool_software'],
      attach_dests: ['dest_maintenance', 'dest_instruments', 'dest_ai', 'dest_software'],
      what: 'Vibration and process analytics that move maintenance from calendar to condition. Augury ($75M Series F at >$1B; claims 5-20x ROI; PepsiCo, DuPont, Colgate), Siemens Senseye Maintenance Copilot (25% less reactive-maintenance time in pilots), Shell with C3 AI (10,000+ equipment items, 15M predictions a day), Cognite (now Schneider), Bosch bought Uptake (Mar 2026); Emerson folded AspenTech Mtell into Plantweb.',
      buyer: 'Reliability and maintenance directors from the opex maintenance budget; often self-funding against unplanned downtime ($1.4T a year at the Fortune Global 500).',
      adoption: 'Sensor retrofit cost and ATEX, historian and DCS data access, alarm fatigue and CMMS work-order integration; outcome-based contracts are the unlock.',
      dvc: ['INImakini (Makini)', 'The Forecasting Company'] },
    { id: 'ai_process_opt', label: 'Closed-loop process optimization',
      attach_pools: ['pool_software', 'pool_eng_labor'],
      attach_dests: ['dest_automation', 'dest_ai', 'dest_instruments'],
      what: 'Learning controllers and optimisers writing set-points above the DCS. Yokogawa FKDPP at ENEOS Materials: 35-day autonomous run of a distillation column, steam use -40%, in routine operation since 2022 (the first reinforcement-learning controller on a live plant). Imubit: 100+ closed-loop applications; Chevron and Marathon among customers (claims $0.25/bbl and 15-30% natural-gas reduction). Fero Labs (Gerdau, Covestro, Vallourec). BHP Escondida with Microsoft for copper recovery.',
      buyer: 'Process engineering and site operations; capex-light, opex-funded.',
      adoption: 'SIS and HAZOP sign-off for closed-loop control, write access to controllers, operator trust and the APC incumbents (AspenTech DMC3, Honeywell Profit, Yokogawa) decide who gets to drive.' },
    { id: 'ai_inspection', label: 'Autonomous inspection robots & drones',
      attach_pools: ['pool_field_service', 'pool_bom'],
      attach_dests: ['dest_robotics', 'dest_maintenance', 'dest_instruments'],
      what: 'Crawlers, quadrupeds and drones that replace scaffolding, confined-space entry and manual rounds. Gecko Robotics ($125M Series D at $1.25B; ADNOC, US Navy), ANYbotics (>EUR 127M raised; 200+ ANYmal shipped across oil and gas, mining, power and metals; ANYmal X for explosive zones in 2026), Boston Dynamics Spot at Chevron and bp, Percepto (autonomous OGI drones approved by the EPA as an alternative methane test method, 2025), Skydio (3.7M+ missions flown; $4.4B Series F valuation), Korial (1M+ inspections, 42% cost saving claim).',
      buyer: 'Asset-integrity and turnaround managers from inspection opex and turnaround capex; inspection contractors as channel.',
      adoption: 'Ex-zone certification, site permits and safety cases, BVLOS approvals, and whether API-certified inspectors accept robot-collected data. Marsh: 44% of the largest hydrocarbon losses are mechanical-integrity failures, so the budget exists.' },
    { id: 'ai_engineering', label: 'AI for engineering & documents',
      attach_pools: ['pool_eng_labor', 'pool_software'],
      attach_dests: ['dest_engineering', 'dest_software', 'dest_automation'],
      what: 'Agents that generate PLC and HMI code, read P&IDs and datasheets and draft designs. Siemens Eigen Engineering Agent (100+ companies in 19 countries; 2-5x faster engineering, up to 50% efficiency gains), Rockwell FactoryTalk Design Studio Copilot on Azure OpenAI, LandingAI agentic document extraction (ABB, Siemens Energy, Schaeffler, Parker), PhysicsX for simulation.',
      buyer: 'Engineering and project directors at owner-operators and EPCs from capex project budgets.',
      adoption: 'Scanned legacy P&IDs, liability for stamped engineering outputs, the hours-based EPC business model and tool lock-in (TIA Portal, Studio 5000). Attacks the $85B engineering pool directly.' },
    { id: 'ai_copilots', label: 'Operator copilots & agents',
      attach_pools: ['pool_software', 'pool_consulting'],
      attach_dests: ['dest_software', 'dest_automation', 'dest_ai'],
      what: 'Natural-language access to plant data and procedures, then agents that act. Siemens Industrial Copilot (nine copilots plus Digital Twin Composer at CES 2026; thyssenkrupp global rollout), Honeywell with Google Cloud (Forge agents; Experion Cognition, Jun 2026), Cognite Atlas AI (bought by Schneider to run inside AVEVA CONNECT), Palantir AIP (HD Hyundai, Lear, Trinity Industries), Tulip Composable AI Agents, Mitti by SafetyCulture (Twine acquisition for an agentic platform, Apr 2026).',
      buyer: 'Operations and automation leads through incumbent vendor contracts; CIO/CDO for platforms.',
      adoption: 'On-prem and edge requirements (Honeywell CEO: public clouds are not designed for industrial environments), hallucination risk in safety-critical guidance, vendor-locked copilots. McKinsey 2026: 44% of companies scaling AI enterprise-wide but only 6% are high performers.' },
    { id: 'ai_twins', label: 'Digital twins & virtual commissioning',
      attach_pools: ['pool_software', 'pool_eng_labor'],
      attach_dests: ['dest_software', 'dest_engineering', 'dest_automation'],
      what: 'Physics-based and data-driven twins used to design, commission and re-plan plants before touching steel. Siemens with NVIDIA Industrial AI Operating System (Foxconn, HD Hyundai, KION, PepsiCo evaluating): PepsiCo reports +20% throughput, 90% of issues found virtually and capex -10-15%. Digital Twin Composer on Xcelerator with Omniverse libraries (mid-2026).',
      buyer: 'Engineering and capex projects, manufacturing IT, corporate digital.',
      adoption: 'CAD/PLM data readiness, keeping the twin in sync with live data, ROI attribution and skills.',
      dvc: ['CARYATID'] },
    { id: 'ai_physical_models', label: 'Physical-world foundation models',
      attach_pools: ['pool_software', 'pool_rnd'],
      attach_dests: ['dest_ai', 'dest_robotics', 'dest_automation'],
      what: 'Models that ingest multimodal plant signals (time series, video, drawings, text) with physics priors. Archetype AI Newton ($35M Series A, Nov 2025; Kajima construction, City of Bellevue), Aramco METABRAIN (1-trillion-parameter industrial LLM on 90 years of data; 300+ AI use cases), NVIDIA Cosmos world models (adopters mostly robotics and AV so far), CARYATID World Engine (physics-grounded world model from video; DVC), Positronic PhAIL (real-hardware benchmark for VLA models; DVC).',
      buyer: 'Today: R&D budgets of majors and model labs; tomorrow: the substrate under wedges 1, 3, 4, 5 and 7.',
      adoption: 'Data rights, certification of learned physics for safety-critical action, edge compute and the absence of plant-specific benchmarks.',
      dvc: ['Archetype AI', 'CARYATID', 'Positronic Robotics'] },
    { id: 'ai_otcyber', label: 'OT security AI',
      attach_pools: ['pool_software', 'pool_field_service'],
      attach_dests: ['dest_otcyber', 'dest_automation'],
      what: 'Asset discovery, anomaly detection and response for control networks. Dragos (EmberAI, Jun 2026; 2026 Year in Review: 3,300 industrial organisations hit by ransomware in 2025, manufacturing more than two-thirds of victims; $300B+ global OT cyber-risk exposure in a 1-in-250-year scenario, modeled with Marsh McLennan), Armis ($435M at $6.1B, then sold to ServiceNow for $7.75B), Nozomi (now Mitsubishi Electric; $101.7M revenue), Claroty (ARR >$100M), Honeywell OT SOC.',
      buyer: 'CISO plus plant OT security, pushed by NIS2, NERC CIP and TSA directives.',
      adoption: 'Passive monitoring only in OT, segmentation projects first, and vendor consolidation (Mitsubishi/Nozomi, ServiceNow/Armis) closing the exit window for the next entrant.' },
    { id: 'ai_energy', label: 'Energy & emissions optimization',
      attach_pools: ['pool_software'],
      attach_dests: ['dest_automation', 'dest_instruments', 'dest_ai'],
      what: 'AI that cuts steam, gas, power and methane per unit of output. Yokogawa/ENEOS steam -40%; Imubit 15-30% natural-gas reduction; Phaidra cooling and power agents (30% cooling-cost cut; CoreWeave, NVIDIA, AirTrunk); Percepto methane OGI drones (EPA alternative test method); Emerald AI with Google and NVIDIA on grid-flexible AI data centres (Sep 2026).',
      buyer: 'Site energy managers, sustainability and process engineering; metering budgets.',
      adoption: 'Measurement and verification, split incentives between opex and capex owners, utility interconnection rules; data-centre power (415 to ~945 TWh by 2030) is the new demand pull.' },
    { id: 'ai_quality', label: 'Quality & process vision',
      attach_pools: ['pool_software', 'pool_bom'],
      attach_dests: ['dest_software', 'dest_ai', 'dest_robotics'],
      what: 'Self-training vision on the line. Instrumental (Meta 900+ engineering weeks saved a year; Toast 5.3x ROI), Elementary (1B+ parts a year; 95% fewer quality escapes on day one; Unilever, Stryker), Siemens with P&G AI quality inspection (Sep 2026); incumbents Cognex, Keyence, Zeiss.',
      buyer: 'VP Quality and automation capex.',
      adoption: 'PLC I/O integration, GMP validation, cost of false rejects, lighting and fixturing.',
      dvc: ['AiSupervision'] },
    { id: 'ai_permits', label: 'Control of work, permits & incident AI',
      attach_pools: ['pool_software', 'pool_consulting'],
      attach_dests: ['dest_ehs', 'dest_safety', 'dest_engineering'],
      what: 'AI-drafted permits to work, risk assessments, incident narratives and root-cause analysis inside the EHS system of record. Wolters Kluwer Enablon Permit Advisor and EHS Companion (Pfizer -94% work-related injuries and permit incidents; Yara 6,000 hours a year saved), Mitti by SafetyCulture (2M+ workers; Twine acquisition, Apr 2026), Sphera AI push (survey of 500 US frontline workers: 83% interested in an AI assistant for safety tasks), Augmentir 5-Why and root-cause agents.',
      buyer: 'Corporate EHS and process-safety leaders; the EHS software line ($2.5B) and the consultants around it.',
      adoption: 'Regulatory acceptability of AI-drafted permits under OSHA PSM and Seveso, audit trails, works councils and SAP PM/Maximo integration.' },
    { id: 'ai_skills', label: 'Skills capture & training',
      attach_pools: ['pool_consulting', 'pool_software'],
      attach_dests: ['dest_ehs', 'dest_software', 'dest_engineering'],
      what: 'Capturing retiring operators and training the next shift. Deloitte 2026: skills development is the top concern for more than a third of manufacturing executives surveyed. Interplay Learning (14,000+ companies, 500,000+ learners), Poka (IFS; L\'Oreal Canada new hires reached 11% higher OEE in their first three months), Siemens Operations Copilot. dss+ capability-building is the consulting analogue.',
      buyer: 'Operations, EHS and L&D; part of the training and consulting pool.',
      adoption: 'Content creation cost, LMS integration, measuring competency and skills-based pay agreements with unions.' }
  ];

  // =====================================================================
  // INCENTIVES / STRUCTURAL FORCES (overlay)
  // =====================================================================
  var incentives = [
    { id: 'inc_injury_cost', label: 'Cost of injury', tone: 'pull',
      attach: ['pay_mining', 'pay_construction', 'pay_oilgas', 'pay_transport', 'dest_safety', 'dest_ehs', 'pool_consulting'],
      body: 'US work injuries cost $181.4B in 2024: $1,120 per worker, $48,000 per medically consulted injury, $1.54M per death (NSC). ILO: 2.93M work-related deaths (2019 estimate), 395M non-fatal injuries, lost work days almost 4% of world GDP. EU: EUR 476B a year (3.3% of GDP). The US direct workers\' comp cost of serious injuries is $58.78B a year (Liberty Mutual 2025 index), led by overexertion ($13.7B) and same-level falls ($10.5B). OSHA and EU-OSHA both put the return on prevention at $2 or EUR 2.2 per unit invested.' },
    { id: 'inc_downtime', label: 'Unplanned downtime', tone: 'pull',
      attach: ['dest_maintenance', 'dest_software', 'dest_ai', 'dest_instruments', 'pool_field_service', 'pool_spares'],
      body: 'Siemens True Cost of Downtime 2024: the Fortune Global 500 lose $1.4T a year to unplanned downtime, 11% of revenue; an idle automotive line costs up to $2.3M an hour; large plants average 25 incidents and 27 hours of downtime a month; nearly half now have dedicated predictive-maintenance teams. ABB survey: median $125,000 an hour, two-thirds of firms down at least monthly. This is the budget predictive maintenance sells into.' },
    { id: 'inc_process_safety', label: 'Ageing assets & process safety', tone: 'pull',
      attach: ['pay_oilgas', 'pay_chem', 'dest_instruments', 'dest_maintenance', 'dest_robotics', 'dest_engineering'],
      body: 'Marsh 100 Largest Losses (2025 edition): mechanical-integrity failures cause 44% of major downstream and midstream losses, business-interruption claims now exceed the historical 3:1 ratio to property damage (some 10:1), and the refining and petrochemical fleet averages ~45 years (North America 61, Europe 54). US CSB: 500+ serious chemical incidents in five years; 30 incidents in one reporting volume caused $1.8B of property damage. Allianz: fire and explosion was 21% of the value of corporate insurance claims (2017-21).' },
    { id: 'inc_insurance', label: 'Insurers & liability', tone: 'pull',
      attach: ['pay_construction', 'pay_transport', 'pay_process', 'dest_safety', 'dest_ehs', 'pool_consulting'],
      body: 'US workers\' comp private-carrier net written premium $41.6B (2025) with a calendar-year combined ratio of 91 but an accident-year ratio of 102; severity +4% for medical and indemnity (NCCI). Marsh Q2 2026: property rates -12% while US casualty rates rose 7% on claims severity and litigation. Nuclear verdicts: $31.3B in 2024 (135 verdicts, +116%), $25.6B in 2025 across nearly 200. Insurers are becoming buyers: Nationwide bundles Kinetic wearables into policies, Tokio Marine invested in Voxel, Gallagher distributes it; Liberty Mutual Strategic Ventures holds Kinetic and Trunk Tools.' },
    { id: 'inc_regulation', label: 'Regulation & reporting', tone: 'friction',
      attach: ['dest_safety', 'dest_ehs', 'dest_otcyber', 'dest_automation', 'dest_engineering', 'pool_consulting'],
      body: 'OSHA PSM (29 CFR 1910.119) and electronic injury reporting (from 1 Jan 2024 for 100+ employee sites in designated industries); OSHA penalties up to $16,550 per serious and $165,514 per willful violation, but the average serious penalty actually assessed is $4,678 and there are 1,651 inspectors for the whole US (AFL-CIO 2026). EU: CSRD with ESRS S1 workforce injury metrics (scope narrowed to 1,000+ employees), Machinery Regulation 2023/1230 mandatory from 20 Jan 2027 (AI safety functions, cyber-safety of safety software), NIS2 transposition deadline 17 Oct 2024, ISA/IEC 62443 as the horizontal OT-security standard. Australia: industrial manslaughter offences in most states (NSW from Sep 2024).' },
    { id: 'inc_zero_harm', label: 'Zero-harm mandates', tone: 'pull',
      attach: ['pay_mining', 'pay_oilgas', 'pay_chem', 'dest_safety', 'dest_ehs', 'dest_robotics'],
      body: 'Boards report fatalities, not TRIR. ICMM members: 42 deaths in 2024 (36 in 2023, 33 in 2022), 9 of 24 members fatality-free; 15 of the 42 in South Africa; mobile equipment and fall of ground the top causes. BHP FY2025: zero fatalities. Consultancies sell the culture and management-system side; technology is what makes the target reachable.' },
    { id: 'inc_workforce', label: 'Retiring workforce', tone: 'pull',
      attach: ['pay_discrete', 'pay_process', 'pay_power', 'dest_ehs', 'dest_software', 'dest_ai', 'pool_consulting'],
      body: 'Deloitte 2026 manufacturing outlook: skills development is the top concern for more than a third of executives; immigrants filled nearly one in four US production jobs in 2024; 80% plan to spend at least a fifth of improvement budgets on smart manufacturing and physical-AI adoption is expected to rise from 9% to nearly a quarter within two years.' },
    { id: 'inc_otcyber', label: 'OT cyber threat', tone: 'pull',
      attach: ['pay_power', 'pay_oilgas', 'dest_otcyber', 'dest_automation'],
      body: 'Dragos 2026 Year in Review: 3,300 industrial organisations hit by ransomware in 2025, 119 ransomware groups (+49%), manufacturing more than two-thirds of victims, only 30% of OT networks with visibility and 46% of assessed organisations with adequate monitoring; adversaries mapping control loops. Dragos with Marsh McLennan puts global OT cyber-risk exposure above $300B in a 1-in-250-year scenario. Allianz Risk Barometer 2026 ranks cyber the top business risk (42%).' },
    { id: 'inc_energy_capex', label: 'Energy & grid capex', tone: 'pull',
      attach: ['pay_power', 'pay_oilgas', 'dest_automation', 'dest_instruments', 'dest_engineering'],
      body: 'IEA World Energy Investment 2025: $3.3T of energy investment, $2.2T of it clean energy, electricity sector $1.5T (about 50% more than upstream oil, gas and coal), grids ~$400B, nuclear above $70B, upstream oil and gas just under $570B (-4%). Data-centre electricity 415 TWh in 2024 (1.5% of global) to ~945 TWh by 2030; US data centres about half of US demand growth. Emerson: automation is roughly 4% of a process capital project, so every $100B of plant capex carries ~$4B of automation.' },
    { id: 'inc_mfg_capex', label: 'Manufacturing capex post-peak', tone: 'friction',
      attach: ['pay_discrete', 'dest_automation', 'dest_robotics', 'dest_software'],
      body: 'US private manufacturing construction ran at $167.8B (SAAR) in Jul 2026, down 21.7% from $214.4B a year earlier (Census); Deloitte: more than 75% of manufacturers cite trade uncertainty as their top concern and input costs are expected to rise 5.4%. Section 232 steel and aluminium tariffs doubled to 50% on 4 Jun 2025; the EU Net-Zero Industry Act targets 40% domestic clean-tech manufacturing by 2030. Frame as post-peak but historically elevated, not accelerating.' },
    { id: 'inc_pilot_purgatory', label: 'AI pilot purgatory', tone: 'friction',
      attach: ['dest_ai', 'dest_software', 'pool_software'],
      body: 'MIT NANDA (Aug 2025): ~95% of enterprise gen-AI pilots deliver no measurable P&L return; vendor-bought tools succeed about twice as often as internal builds. McKinsey 2026 (n=1,719): 44% scaling AI enterprise-wide, but only 6% are high performers attributing 5%+ of EBIT to AI. BCG: 74% of companies have yet to show tangible value from AI. Honeywell survey: 17% of industrial AI leaders have fully launched their initial plans. Rockwell 2026: 34% of operations AI-augmented today, 54% expected by 2030.' },
    { id: 'inc_incumbent_platforms', label: 'Incumbents buy the AI layer', tone: 'friction',
      attach: ['dest_software', 'dest_ai', 'dest_otcyber', 'dest_automation', 'pool_margin'],
      body: 'The exit route and the moat are the same companies. Siemens bought Altair ($10.6B, ~17x revenue) and Dotmatics ($5.1B); Emerson bought the rest of AspenTech ($7.2B for 43%); Schneider bought AVEVA (GBP 9.48B whole-company value) and Cognite ($3.1B, ~18x revenue, Jun 2026); ServiceNow bought Armis ($7.75B, ~25x ARR); Mitsubishi Electric bought Nozomi ($883M for 93%, ~9x 2025 revenue) and led Tulip; Bosch bought Uptake; PTC bought ServiceMax ($1.46B); Rockwell bought Plex ($2.22B). Hardware-heavy assets clear at 2-5x (ABB Robotics to SoftBank $5.375B, 2.3x; Emerson-NI 4.9x). DCS write access and installed-base lock-in decide what an entrant can touch.' },
    { id: 'inc_incumbent_ai', label: 'Incumbent AI push', tone: 'pull',
      attach: ['dest_automation', 'dest_software', 'dest_ai', 'pool_software'],
      body: 'Siemens CEO Roland Busch (CES 2026): industrial AI is no longer a feature, it is a force that will reshape the next century; Siemens and NVIDIA are building an Industrial AI Operating System and the Eigen Engineering Agent is at 100+ companies. Honeywell CEO Vimal Kapur (Jun 2026): automation will be redefined within five to ten years by learning systems, from automation to augmentation to autonomy. Emerson Project Beyond (Jul 2025). Aramco: $3-5B of technology-realised value in 2025, METABRAIN 1T-parameter model. Shell CEO Wael Sawan: AI is letting Shell become much leaner. Incumbent selling motion validates the category and sets the partnership route for startups.' },
    { id: 'inc_cvc_retreat', label: 'Corporate venture retreat', tone: 'friction',
      attach: ['dest_ai', 'dest_ehs', 'pool_software', 'pool_rnd'],
      body: 'PitchBook-NVCA: CVCs took part in 21.1% of US VC deals in H1 2026, the lowest share in a decade, even as AI mega-rounds pushed their share of deal value to 82.6%; only 1,112 corporate investors closed a deal in H1 2025, 35.7% of the 2022 high. Median CVC unit lives ~4 years (Song Ma, RFS); a third of active CVCs were mothballed or shut within three years (MIT SMR). Yet more than half of CVCs hold LP positions in external funds and more than half of funds closing in Q2 2026 had corporate commitments (GCV). Emerald counts 50+ Fortune 500 corporate LPs (ABB, Caterpillar, Chevron, Nestle, MHI); Energy Impact Partners closed $1.36B with 75+ LPs, many of them strategic energy and industrial players; ABB Ventures holds 10 fund positions.' },
    { id: 'inc_specialist_capital', label: 'Specialist capital wave', tone: 'pull',
      attach: ['dest_robotics', 'dest_ai', 'dest_ehs', 'pool_software'],
      body: 'Eclipse raised $1.3B (Apr 2026) on the line that physical industries are the majority of GDP yet under-served by venture; Energize closed $430M with GE Vernova, Keysight and WEX as strategic LPs and argues that in high-stakes, deterministic industrial settings probabilistic AI is not good enough; a16z American Dynamism cites Samsara-style software plus cheap sensors improving safety and efficiency at once. Safety-tech rounds: Voxel $44M, Protex $36M, Intenseye $64M, Gecko $125M at $1.25B, ANYbotics >EUR 127M, Tulip $120M at $1.3B; exits Blackline (up to C$850M), Ideagen (GBP 1.05B), Sphera ($1.4B in, $3B ask), Intelex ($570M).' }
  ];

  // =====================================================================
  // COMPANIES (overlay): incumbent vs AI-native per node; dvc flags DVC
  // portfolio. Buyer nodes carry custom headings: operators vs their
  // corporate-venture programmes.
  // =====================================================================
  function co(name, note, extra) { var o = { name: name, note: note }; if (extra) { Object.keys(extra).forEach(function (k) { o[k] = extra[k]; }); } return o; }
  var DVC = { dvc: true };
  var BUYER_HEADS = ['Operators', 'Corporate venture programmes'];

  var companies = {
    // ---- Buyers ----------------------------------------------------------
    pay_oilgas: { heads: BUYER_HEADS,
      incumbent: [co('Suncor', 'LP in Evok Innovations'), co('Aramco', '$3-5B AI value 2025; METABRAIN')],
      ai_native: [co('Aramco Ventures', '$7.5B programme incl. $500M digital/industrial; Cognite and Seeq investor'), co('Chevron Technology Ventures', 'Future Energy Fund III $500M; Emerald LP'), co('Equinor Ventures / bp ventures / Shell Ventures', 'active CVCs; LP activity not public'), co('Evok Innovations', 'Fund II $300M first close with Suncor and Cenovus as LPs'), co('Halliburton Labs', 'accelerator; no board seats, commercial or IP rights')] },
    pay_chem: { heads: BUYER_HEADS,
      incumbent: [co('Covestro / Gerdau', 'Fero Labs users')],
      ai_native: [co('BASF Venture Capital', 'EUR 250M evergreen, EUR 1-5M tickets; Brazil operations shut Sep 2026'), co('Evonik Venture Capital', 'Citrine Informatics (materials AI)'), co('Emerald Technology Ventures', 'Industrial Innovation Fund LPs incl. DIC ($62M physical-AI programme), MHI, Nabtesco, Mitsui Kinzoku')] },
    pay_mining: { heads: BUYER_HEADS,
      incumbent: [co('BHP', 'FY2025 zero fatalities'), co('Rio Tinto', 'Safe Production System'), co('Anglo American / Glencore', 'no public CVC found'), co('ArcelorMittal / thyssenkrupp', 'thyssenkrupp rolling out Siemens Industrial Copilot')],
      ai_native: [co('BHP Ventures', '~25 companies incl. FieldAI, AIM autonomous mine ops, GeologicAI, Plotlogic'), co('Vale Ventures', '$100M initial; decarbonisation, circular and smart mining'), co('ArcelorMittal XCarb Innovation Fund', '$200M committed, 9 direct investments'), co('Caterpillar Ventures', 'autonomy, robotics, mining tech; Emerald LP'), co('Teck', 'LP in Chrysalix RoboValley Fund')] },
    pay_power: { heads: BUYER_HEADS,
      incumbent: [co('National Grid / Kansai Electric', 'Spot, Cognite users')],
      ai_native: [co('Energy Impact Partners', 'Flagship Fund III $1.36B, 75+ LPs incl. strategic energy and industrial players'), co('National Grid Partners', 'grid AI and OT cyber; exits AiDASH, AutoGrid to Schneider'), co('Energize Capital', 'Fund III $430M; GE Vernova, Keysight, WEX as strategic LPs'), co('Siemens Energy Ventures / Engie New Ventures / Verbund X', 'GCV Powerlist 2026; LP activity not public')] },
    pay_discrete: { heads: BUYER_HEADS,
      incumbent: [co('Mercedes-Benz / Caterpillar / Bridgestone', 'Intenseye users')],
      ai_native: [co('Hitachi Ventures', '$1B AUM, 4 funds, 59 companies; digital and industrial themes'), co('Next47 (Siemens)', 'Skydio, Tractian, Verkada'), co('SE Ventures (Schneider)', 'EUR 1B committed, 60+ companies, 60%+ with a Schneider commercial partnership'), co('ABB Ventures', '~$500M deployed since 2009; 10 active fund investments alongside 50 directs'), co('Bosch Ventures', 'parent Bosch bought Uptake (Mar 2026)')] },
    pay_process: { heads: BUYER_HEADS,
      incumbent: [co('Nestle / Nespresso', 'Emerald LP; Intenseye user')],
      ai_native: [co('Tyson Ventures', 'active CVC; Oxipital AI (vision and robotics)'), co('Nestle via Emerald', 'corporate LP'), co('Saint-Gobain NOVA / General Mills 301 INC', 'CVC units')] },
    pay_construction: { heads: BUYER_HEADS,
      incumbent: [co('Kajima', 'Archetype AI deployment'), co('All3', 'robotic construction platform; $25M seed (Apr 2026)', DVC), co('PermitFlow', 'AI agents for construction permitting; YC', DVC)],
      ai_native: [co('Liberty Mutual Strategic Ventures', 'Fund II $200M; Trunk Tools, Kinetic, Pano'), co('CRH Ventures / Holcim MAQER', 'GCV Powerlist 2026'), co('Procore', 'bought DroneDeploy for $845M (Jul 2026)')] },
    pay_transport: { heads: BUYER_HEADS,
      incumbent: [],
      ai_native: [co('Deutsche Bahn Digital Ventures', 'rail CVC'), co('Munich Re Ventures / AXA Venture Partners', 'insurer CVCs (50+ companies; EUR 2B AUM) with future-of-risk mandates')] },

    // ---- Destinations ----------------------------------------------------
    dest_automation: {
      incumbent: [co('Siemens Digital Industries', 'EUR 17.8B, 14.9% margin; software EUR 6.17B'), co('Emerson', '$18.0B; Software & Control $5.7B at 31%'), co('ABB', 'Motion $8.2B, Automation $8.1B at 14.0%; #1 in DCS'), co('Rockwell', '$8.3B, GM 48.1%'), co('Honeywell', 'Industrial Automation $9.4B at 18.5%; PA&T carved out 2026'), co('Schneider', 'Industrial Automation EUR 7.0B at 14.2%'), co('Yokogawa', 'Control JPY 566B at ~13% (FY25); FKDPP autonomous control'), co('Mitsubishi Electric', 'FA JPY 798B; bought Nozomi, led Tulip')],
      ai_native: [co('Imubit', '100+ closed-loop applications; Chevron, Marathon, CITGO'), co('Fero Labs', 'Gerdau, Covestro, Vallourec'), co('Vention', '$110M strategic round (Jan 2026, NVentures); 25,000 machines'), co('Siemens Eigen Engineering Agent', '100+ companies, 19 countries')]
    },
    dest_instruments: {
      incumbent: [co('Emerson', 'Measurement & Analytical $4.1B at 28.5%; Final Control $4.4B'), co('Endress+Hauser', 'EUR 4.0B, EBIT 11.9%, R&D 7.0%; SICK analyzer JV'), co('ABB Measurement & Analytics', 'inside Automation'), co('Siemens Process Instrumentation / VEGA / Krohne', 'private or undisclosed'), co('Yokogawa', 'measuring instruments growing strongly')],
      ai_native: [co('Augury', 'wireless vibration plus AI; >$1B'), co('Percepto', 'EPA-approved autonomous methane OGI drones'), co('Archetype AI', 'sensor-stream foundation model', DVC)]
    },
    dest_software: {
      incumbent: [co('Siemens DI Software', 'EUR 6.17B; Altair and Dotmatics added'), co('AVEVA (Schneider)', 'ARR +12%; Cognite folding into CONNECT'), co('AspenTech (Emerson)', 'Emerson software ACV $1.56B (+10%)'), co('Dassault Systemes', 'EUR 6.24B, 32% margin'), co('PTC', '$2.74B, ARR $2.48B, GM ~84%'), co('Bentley', '$1.50B, ARR $1.46B'), co('Octave (ex-Hexagon ALI)', '$1.6B revenue, ARR $1.1B; listed May 2026'), co('Honeywell Forge / SAP / IBM Maximo', 'undisclosed')],
      ai_native: [co('Cognite', '>$170M revenue; sold to Schneider for $3.1B'), co('Tulip', '$1.3B; 1,000 sites'), co('Seeq', '$50M Series D; Aramco Energy Ventures'), co('Samsara', '$1.62B revenue, ARR $1.89B (FY26)'), co('INImakini (Makini)', 'unified API into ERP, CMMS and WMS for industrial tech vendors', DVC), co('Sybilion', 'demand forecasting for chemicals and textiles supply chains', DVC)]
    },
    dest_ai: {
      incumbent: [co('Palantir', 'US commercial $1.47B (+109%); HD Hyundai, Lear, Trinity'), co('C3.ai', '$250M, guiding down; Shell PdM at scale'), co('Microsoft / NVIDIA / Google Cloud', 'substrate partners of Siemens, Honeywell, Rockwell'), co('Aramco METABRAIN', '1T-parameter industrial LLM')],
      ai_native: [co('Cognite', 'Atlas AI agents; now Schneider'), co('Augury', 'vibration AI; >$1B valuation'), co('Archetype AI', 'Newton physical-world model; $35M Series A', DVC), co('CARYATID', 'physics-grounded world model; $150M post', DVC), co('Positronic Robotics', 'PhAIL benchmark and inference API for physical AI', DVC), co('The Forecasting Company', 'time-series foundation model for manufacturing and energy', DVC), co('AiSupervision', 'AI supervision for factories; 15 factories at investment', DVC)]
    },
    dest_robotics: {
      incumbent: [co('FANUC', 'Robot JPY 379B'), co('ABB Robotics', 'to SoftBank at $5.375B EV, 2.3x revenue'), co('KUKA / Yaskawa', ''), co('Komatsu / Caterpillar', 'autonomous haulage: 1,000 Komatsu ultra-class trucks commissioned (Apr 2026)'), co('Boston Dynamics', 'Spot at Chevron, bp, National Grid, POSCO')],
      ai_native: [co('Gecko Robotics', '$1.25B; ADNOC, US Navy'), co('ANYbotics', '200+ ANYmal; ANYmal X for Ex zones'), co('Skydio', '$4.4B; 3.7M+ missions'), co('Korial (ex-Energy Robotics)', '1M+ inspections'), co('Abagy', 'AI co-pilot for high-mix welding without programming', DVC), co('RemBrain', 'cloud platform for teaching robots', DVC)]
    },
    dest_safety: {
      incumbent: [co('3M', 'Personal Safety $3.54B'), co('MSA Safety', '$1.875B; Detection $763M; adj. op 22.1%'), co('Draeger', 'group EUR 3.48B; Safety division EUR 1.49B at 11.9% EBIT'), co('Honeywell', 'kept gas detection, sold PPE for $1.325B'), co('Ansell', 'Industrial $0.9B'), co('PIP / Odyssey', 'bought Honeywell PPE'), co('Sick / Pilz / Rockwell', 'machine safety')],
      ai_native: [co('Voxel', '$44M Series B; Tokio Marine investor'), co('Protex AI', '$36M Series B'), co('Intenseye', '$64M Series B; 400+ facilities'), co('Kinetic', 'Nationwide-embedded wearables'), co('Blackline Safety', 'connected gas detection; ARR C$93M')]
    },
    dest_ehs: {
      incumbent: [co('Wolters Kluwer Enablon', 'EHS & ESG ~EUR 194M, +10% organic'), co('Sphera (Blackstone)', '>$300M revenue, >$100M EBITDA; $3B exit sought'), co('Cority (Thoma Bravo)', '~$2B sale explored'), co('Intelex (Fortive)', 'bought for $570M'), co('Ideagen (Hg)', 'GBP 1.05B take-private; 92%+ GM'), co('VelocityEHS (CVC) / Benchmark Gensuite', 'Verdantix leaders')],
      ai_native: [co('Blackline Safety', 'up to C$850M take-private'), co('Tulip', '$1.3B'), co('Mitti by SafetyCulture', 'A$2.5B (2024 round); 2M+ workers'), co('Aatmunn (ex-Guardhat)', '250+ companies'), co('StrongArm', '35% average soft-tissue injury reduction claimed'), co('Augmentir', 'AI agents for frontline work'), co('Humand', 'frontline HR and communication app; 50+ enterprise customers', DVC)]
    },
    dest_otcyber: {
      incumbent: [co('Fortinet / Palo Alto / Tenable OT', 'undisclosed'), co('Honeywell', 'OT SOC, Cyber Proactive Defense'), co('Mitsubishi Electric', 'owns Nozomi'), co('ServiceNow', 'owns Armis'), co('Accenture', 'Dragos partnership (Jun 2026)')],
      ai_native: [co('Dragos', 'EmberAI; bought Phosphorus'), co('Claroty', 'ARR >$100M (2023)'), co('Armis', '$7.75B exit, ~25x ARR'), co('Nozomi', '$101.7M revenue; $883M for 93%'), co('TXOne', '')]
    },
    dest_engineering: {
      incumbent: [co('Rockwell Lifecycle Services', '$2.2B at 14.5%'), co('Yokogawa projects', 'JPY 242B orders'), co('Worley', 'A$12.1B aggregated revenue (FY25), 45,000+ staff'), co('Wood (Sidara) / Jacobs / Fluor', ''), co('dss+', '1,700 consultants, 41 countries; DuPont carve-out (Gyrus Capital)'), co('ERM (KKR)', '$1.3B revenue (2023)'), co('Accenture Industry X / Capgemini', 'undisclosed')],
      ai_native: [co('Siemens Eigen Engineering Agent', '2-5x faster PLC engineering'), co('LandingAI', 'agentic document extraction; ABB, Siemens Energy'), co('PhysicsX', 'AI-native simulation'), co('Vention', 'cloud machine design'), co('PermitFlow', 'permit automation for construction', DVC)]
    },
    dest_maintenance: {
      incumbent: [co('ABB', 'services $5.55B, 16.7% of group'), co('Emerson / Siemens / Honeywell service', 'undisclosed'), co('Rockwell', 'Lifecycle Services $2.2B'), co('FANUC', 'service 16.5% of sales'), co('Draeger Services', '>EUR 1B'), co('Bureau Veritas / Mistras / SGS', 'inspection contractors')],
      ai_native: [co('Augury', '$75M Series F; 5-20x ROI claim'), co('Siemens Senseye', '25% less reactive maintenance in pilots'), co('Uptake', 'bought by Bosch'), co('Gecko Robotics', 'robotic inspection data'), co('INImakini (Makini)', 'CMMS and ERP integration layer', DVC), co('The Forecasting Company', 'forecasting for maintenance and energy', DVC)]
    },

    // ---- Cost pools ------------------------------------------------------
    pool_bom: {
      incumbent: [co('Siemens / ABB / Schneider / Emerson / Rockwell', 'GM 41-48%'), co('Endress+Hauser', 'EUR 4.0B'), co('3M / MSA / Draeger / Ansell', 'MSA GM 46.5%, Draeger 45.2%')],
      ai_native: [co('Vention', 'modular hardware plus software'), co('ANYbotics / Gecko', 'own robots'), co('Blackline', 'own devices, GM 63%')]
    },
    pool_eng_labor: {
      incumbent: [co('Rockwell Lifecycle Services', '14.5% margin'), co('Worley / Wood / Jacobs', 'EPC'), co('CSIA integrators', '~1,000 firms; benchmarks member-gated')],
      ai_native: [co('Siemens Eigen', 'PLC code generation'), co('Rockwell Design Studio Copilot', ''), co('LandingAI', 'document extraction'), co('Abagy', 'welding without programming', DVC), co('RemBrain', 'remote robot teaching', DVC)]
    },
    pool_field_service: {
      incumbent: [co('ABB / Emerson / Siemens / Yokogawa service', ''), co('Bureau Veritas / Mistras / TUV', 'inspection'), co('Draeger Services', '~29% of sales')],
      ai_native: [co('Augury', ''), co('Gecko / ANYbotics / Korial', 'robotic inspection as a service'), co('Dragos', 'managed OT security'), co('Autonomics', 'fleet orchestration for service robots', DVC)]
    },
    pool_spares: {
      incumbent: [co('MSA / 3M / Ansell', 'replacement demand'), co('Grainger / Fastenal / Wesco', 'distribution')],
      ai_native: [co('Augury', 'spares from prediction, not failure'), co('INImakini (Makini)', 'CMMS integration for parts workflows', DVC)]
    },
    pool_software: {
      incumbent: [co('Siemens DI Software', 'EUR 6.17B'), co('PTC / Bentley / Dassault / Hexagon', 'R&D 15-21% of sales'), co('AVEVA / AspenTech', ''), co('Palantir', '50% adj. op margin'), co('C3.ai', 'GM 31%')],
      ai_native: [co('Cognite', ''), co('Tulip', ''), co('Archetype AI', 'physical-world model', DVC), co('CARYATID', 'world model', DVC), co('Positronic Robotics', 'physical-AI infrastructure', DVC), co('The Forecasting Company', 'time-series foundation model', DVC), co('AeroSilicon', 'algorithm-to-FPGA synthesis for edge compute', DVC)]
    },
    pool_rnd: {
      incumbent: [co('Siemens', 'EUR 6.6B group R&D, 8.3%'), co('Rockwell', '$679M, 8.1%'), co('Draeger', '9.6%'), co('Endress+Hauser', '7.0%'), co('MSA', '3.5%')],
      ai_native: [co('Archetype AI', 'Newton model R&D', DVC), co('CARYATID', 'world-model R&D', DVC), co('Positronic Robotics', 'benchmark and data-ops R&D', DVC)]
    },
    pool_sga: {
      incumbent: [co('Wesco', '$23.5B, GM ~21%'), co('Graybar', '$12.9B, 3.3% net'), co('Grainger / Fastenal / Rexel', '')],
      ai_native: [co('Kinetic via Nationwide', 'insurer as channel'), co('Voxel via Gallagher', 'broker as channel'), co('SE Ventures portfolio', '60%+ with Schneider commercial partnership')]
    },
    pool_margin: {
      incumbent: [co('PTC', '36% GAAP op margin'), co('Emerson Software & Control', '31%'), co('Hexagon', '27.2%'), co('MSA', '22.1% adj.'), co('ABB Automation / Schneider IA / Yokogawa Control', '13-14%'), co('Draeger Safety', '11.9% EBIT')],
      ai_native: [co('Samsara', '17% non-GAAP op margin'), co('Blackline', 'first positive adj. EBITDA'), co('C3.ai', 'deeply negative')]
    },
    pool_consulting: {
      incumbent: [co('dss+', '1,700 consultants; revenue undisclosed'), co('ERM', '$1.3B'), co('DEKRA / TUV / DNV / Bureau Veritas', 'certification'), co('exida', 'SIL')],
      ai_native: [co('Interplay Learning', '14,000+ companies'), co('Poka (IFS)', 'L\'Oreal new hires +11% OEE'), co('Mitti by SafetyCulture', ''), co('Humand', 'frontline training and onboarding', DVC)]
    }
  };

  // =====================================================================
  // FLOW MICROCOPY (click a flow): buyer logic, recipient logic, tension, AI wedge
  // =====================================================================
  var flowMicrocopy = {
    'fl_pay_oilgas__dest_instruments': {
      payer: 'Refineries, gas plants and offshore platforms buy transmitters, analyzers and valves by the tens of thousands per site, on turnaround cycles and brownfield projects; upstream investment just under $570B in 2025 (IEA).',
      recipient: 'Emerson (Measurement & Analytical $4.1B at 28.5% margin, Final Control $4.4B), Endress+Hauser (EUR 4.0B), ABB, Siemens, Yokogawa, VEGA, Krohne: the most profitable hardware in the river.',
      tension: 'A 45-year-old fleet (Marsh) needs replacement instruments, but the buyer gets the same measurement it had; value comes only when the data is used.',
      wedge: 'Wireless condition monitoring (Augury) and drone-borne methane sensing (Percepto, EPA-approved) add measurements without the wiring; physical-world models (Archetype) turn the streams into state.' },
    'fl_pay_oilgas__dest_automation': {
      payer: 'DCS and SIS refreshes are decided by asset-integrity and control engineers on 15-25 year cycles; automation is ~4% of a process project (Emerson), so a $10B LNG train carries ~$400M of it.',
      recipient: 'Emerson, Honeywell Process Automation & Technology, Yokogawa, ABB (#1 in DCS), Schneider, Siemens. Installed-base lock-in is near total.',
      tension: 'Migration projects overrun (one documented DCS migration +87%) and the SIS layer cannot be touched without HAZOP sign-off, so the incumbent keeps write access.',
      wedge: 'Closed-loop optimisers sit above the DCS (Yokogawa FKDPP, Imubit at Chevron and Marathon); copilots sit beside it (Honeywell with Google, Emerson Project Beyond).' },
    'fl_pay_oilgas__dest_engineering': {
      payer: 'Owner-operators pay EPCs, integrators and consultants for every project, migration and turnaround; the labor is the largest single line of OT spend.',
      recipient: 'Worley (A$12.1B), Wood, Jacobs, vendor project organisations (Yokogawa JPY 242B of project orders), dss+ and ERM on the safety and risk side.',
      tension: 'Hours-based business models have no incentive to compress hours, and project overruns are the norm rather than the exception.',
      wedge: 'Engineering agents (Siemens Eigen: 2-5x faster PLC engineering) and document extraction (LandingAI) attack the hours directly; owners, not EPCs, will buy them.' },
    'fl_pay_chem__dest_instruments': {
      payer: 'Chemical sites are PSM and Seveso regulated; analyzers and gas detection are mandated, and instrument density is the highest of any vertical.',
      recipient: 'Endress+Hauser (SICK analyzer JV), Emerson, ABB, Siemens, Draeger and MSA for fixed gas detection.',
      tension: 'The US CSB logged 500+ serious chemical incidents in five years; mechanical integrity is the top cause of major losses, yet inspection is still manual and periodic.',
      wedge: 'Autonomous inspection (ANYbotics ANYmal X for Ex zones, Gecko crawlers) move integrity from calendar to condition.' },
    'fl_pay_mining__dest_safety': {
      payer: 'Miners buy PPE, gas detection, proximity and collision-avoidance systems against a fatality count the board reports: ICMM 42 deaths in 2024, mobile equipment the top cause.',
      recipient: 'MSA, Draeger, 3M, Honeywell gas detection, plus proximity-detection and fatigue-monitoring vendors.',
      tension: 'Zero-harm targets versus remote sites, contractor workforces and the hardest environments for cameras and connectivity.',
      wedge: 'Vision-based safety (Intenseye, Voxel) and connected-worker platforms (Blackline, Aatmunn at Teck) are the first AI that plant safety managers can buy from their own budget.' },
    'fl_pay_mining__dest_robotics': {
      payer: 'Autonomous haulage, drilling and inspection are capex decisions taken at mine level with a direct safety case: every removed cab is a removed exposure.',
      recipient: 'Komatsu (>1,000 autonomous ultra-class trucks commissioned), Caterpillar, Sandvik, Epiroc, plus inspection-robot vendors.',
      tension: 'Fleet-scale autonomy is bought from the OEM; the entrant sells the perception, the data and the retrofits, not the truck.',
      wedge: 'BHP Ventures backs FieldAI and AIM (autonomous mine operations); Caterpillar Ventures backs Novarc welding robots; DVC: Abagy, RemBrain, All3 in construction.' },
    'fl_pay_power__dest_otcyber': {
      payer: 'Utilities are the fastest-growing OT-security buyers (Mordor: 19.4% CAGR) under NERC CIP, NIS2 and TSA directives, and the IEA sees ~$400B a year of grid capex adding attack surface.',
      recipient: 'Dragos, Claroty, Nozomi (Mitsubishi Electric), Armis (ServiceNow), Fortinet and Palo Alto OT lines, Honeywell OT SOC.',
      tension: 'Passive monitoring only; segmentation and asset inventory come before any AI, and the big platforms have just bought the leaders.',
      wedge: 'Dragos EmberAI and ELECTRUM-style threat intelligence; National Grid Partners is the most active utility-side CVC.' },
    'fl_pay_power__dest_engineering': {
      payer: 'Grid, nuclear and water projects are engineered by EPCs and owner teams; the IEA counts $1.5T of electricity-sector investment in 2025.',
      recipient: 'Bentley (infrastructure software, $1.5B), Worley, Jacobs, AECOM, vendor project teams; consultants on safety cases.',
      tension: 'Data-centre load (415 to ~945 TWh by 2030) is pulling projects forward faster than engineering capacity grows.',
      wedge: 'Digital twins and virtual commissioning (Siemens with NVIDIA), engineering agents, and energy-management AI (Phaidra, Emerald AI) on the load side.' },
    'fl_pay_discrete__dest_software': {
      payer: 'Automotive, machinery and electronics plants are the biggest software buyers: PLM, MES, simulation; IDC sizes discrete-manufacturing digital-transformation spend at ~$500B (2024).',
      recipient: 'Siemens DI Software (EUR 6.17B), Dassault (EUR 6.24B), PTC ($2.74B), Rockwell Software & Control ($2.4B at 29.7%), Hexagon/Octave, Tulip.',
      tension: 'Vendors earn 30%+ operating margins (PTC 36%, Dassault 32%) on largely recurring revenue; the buyer pays again for implementation (20-100% of licence).',
      wedge: 'Copilots inside the suites (Siemens Industrial Copilot, Rockwell with Microsoft) and composable frontline apps (Tulip, Augmentir); Makini (DVC) sells the integration layer.' },
    'fl_pay_discrete__dest_automation': {
      payer: 'Line builders and plants buy PLCs, drives, motion and machine safety with every new model or line; US manufacturing construction is down 21.7% year on year after the 2024-25 peak.',
      recipient: 'Siemens (TIA Portal), Rockwell (North America 63% of sales), Mitsubishi Electric, Omron, Beckhoff, Schneider.',
      tension: 'Capex follows tariffs and rates: Section 232 at 50% helps domestic steel while manufacturers expect input costs to rise 5.4% (Deloitte); orders are lumpy.',
      wedge: 'Engineering agents cut the programming hours that gate every line change; machine-safety software is where the EU Machinery Regulation (Jan 2027) bites first.' },
    'fl_pay_discrete__dest_ai': {
      payer: 'Discrete plants run many AI pilots and scale few: McKinsey 2026 finds only 6% of companies are AI high performers.',
      recipient: 'Palantir (HD Hyundai, Lear, Trinity), Instrumental and Elementary (quality vision), Augury, Cognite, plus the hyperscalers underneath.',
      tension: 'MIT: 95% of gen-AI pilots show no P&L return; vendor-bought tools succeed twice as often as internal builds, which favours specialists.',
      wedge: 'Quality vision and predictive maintenance have measured ROI today; DVC: AiSupervision (15 factories), The Forecasting Company, Positronic.' },
    'fl_pay_process__dest_ehs': {
      payer: 'Food, pharma and materials sites buy EHS software and connected-worker tools under CSRD reporting and customer audits; high-risk industries are 54% of digital EHS services spend (Verdantix).',
      recipient: 'Enablon (Wolters Kluwer), Sphera, Cority, Intelex, Ideagen, VelocityEHS on software; Blackline, Tulip, Mitti by SafetyCulture on the frontline.',
      tension: 'A $2.5B software market growing 14.6% a year with private-equity owners seeking $2-3B exits: consolidation is the exit, and the exit is small relative to the injury cost.',
      wedge: 'AI permits and incident investigation (Enablon Permit Advisor: Pfizer -94% injuries and permit incidents), vision safety (Intenseye at Nestle, Heineken, Mars), Humand (DVC) for frontline communication.' },
    'fl_pay_process__dest_maintenance': {
      payer: 'Continuous plants pay for reliability because downtime is the P&L: $1.4T a year across the Fortune Global 500 (Siemens), median $125,000 an hour (ABB).',
      recipient: 'Vendor service organisations (ABB $5.55B of services, Rockwell $2.2B, FANUC 16.5% of sales), inspection contractors, spares channels.',
      tension: 'Service margins are 14% at the vendors, so the incumbents want software attached; the plant wants fewer failures, not more contracts.',
      wedge: 'Augury (PepsiCo, Colgate), Siemens Senseye (25% less reactive maintenance), Cognite APM; The Forecasting Company and Makini (DVC) in the data layer.' },
    'fl_pay_construction__dest_safety': {
      payer: 'Contractors buy PPE and fall protection on the highest US fatality count of any sector (1,034 deaths in 2024) and 23% of EU fatal accidents; fall protection is the most-cited OSHA standard (5,914 citations in FY2025).',
      recipient: '3M, Honeywell (now PIP), MSA, Ansell and the distributors; the second-largest PPE end use (MarketsandMarkets).',
      tension: 'Nuclear verdicts ($31.3B in 2024; construction and engineering ~$2B) and US casualty rates +7% make insurers the co-buyer.',
      wedge: 'Wearables bundled into workers\' comp (Kinetic with Nationwide), vision safety on sites (Voxel), Trunk Tools and PermitFlow (DVC) on the workflow side; Liberty Mutual Strategic Ventures is the most active insurer CVC.' }
  };

  var flowMicrocopyFallback = {
    payer: 'Buyer allocation is modeled from vendor order mixes (Yokogawa, Rockwell, Emerson), IFR installs by industry, PPE and OT-cyber end-use shares and Verdantix EHS spend by industry; click the nodes on either side for the sourced totals.',
    recipient: 'Recipient economics follow the destination category: see the cost-pool split on the right.',
    tension: 'Every modeled flow in this river is constrained to the sourced totals of both nodes.',
    wedge: 'Switch to the AI opportunities view to see which wedges attach to this stream.'
  };

  var sources = [
    { label: 'Grand View Research: industrial automation & control systems $226.8B (2025), control valves 24%', url: SRC.gvr_iacs },
    { label: 'MarketsandMarkets: process automation & instrumentation $74.2B (2024), field instruments dominate', url: SRC.mm_process },
    { label: 'Interact Analysis: low-voltage AC drives $14.4B (2025)', url: SRC.ia_drives },
    { label: 'Interact Analysis: motion controls $12.3B (2024)', url: SRC.ia_motion },
    { label: 'MarketsandMarkets: machine safety $5.66B (2025)', url: SRC.mm_machsafety },
    { label: 'ABB: #1 in distributed control systems', url: SRC.abb_dcs },
    { label: 'Control Global / ARC: Top 50 automation suppliers (scope)', url: SRC.arc_top50 },
    { label: 'MarketsandMarkets: industrial software $21.5B (2024)', url: SRC.mm_indsw },
    { label: 'IoT Analytics: industrial software landscape $146B (2023)', url: SRC.iot_analytics },
    { label: 'MarketsandMarkets: asset performance management $2.4B (2026)', url: SRC.mm_apm },
    { label: 'MarketsandMarkets: predictive maintenance $13.9B (2026)', url: SRC.mm_pdm },
    { label: 'MarketsandMarkets: AI in manufacturing $34.2B (2025)', url: SRC.mm_aimfg },
    { label: 'IDC: worldwide AI spending outlook by industry', url: SRC.idc_ai },
    { label: 'IFR World Robotics 2025: 542,000 installs (2024)', url: SRC.ifr_wr2025 },
    { label: 'IFR 2024 installs by industry (general industry 53%, food +42%)', url: SRC.ifr_by_industry },
    { label: 'Grand View Research: industrial robotics $37.8B (2025)', url: SRC.gvr_robotics },
    { label: 'MarketsandMarkets: PPE $56.6B (2024)', url: SRC.mm_ppe },
    { label: 'Grand View Research: PPE $90.4B (2025), manufacturing 18.3%', url: SRC.gvr_ppe },
    { label: 'MarketsandMarkets: gas detection $3.84B (2025)', url: SRC.mm_gas },
    { label: 'MarketsandMarkets: workplace safety technology $19.6B (2025)', url: SRC.mm_wst },
    { label: 'Verdantix: EHS software $1.9B (2023) to $4.5B (2029)', url: SRC.verdantix_ehs },
    { label: 'Verdantix: EHS software, safety management ~60% of spend', url: SRC.verdantix_ehs2 },
    { label: 'Verdantix: connected worker $1.38B (2022) to $3.24B (2028)', url: SRC.verdantix_cw },
    { label: 'Verdantix: digital EHS services $3.2B (2025), high-risk industries 54%', url: SRC.verdantix_svc },
    { label: 'Verdantix Green Quadrant EHS Software 2025 (leaders)', url: SRC.verdantix_gq },
    { label: 'MarketsandMarkets: connected worker $8.62B (2025)', url: SRC.mm_cw },
    { label: 'Mordor Intelligence: OT security $22.15B (2025), manufacturing 28.7%', url: SRC.mordor_ot },
    { label: 'Frost & Sullivan: industrial cybersecurity to $10.2B (2025)', url: SRC.frost_ot },
    { label: 'MarketsandMarkets: industrial cybersecurity $84.5B (2024, IT+OT scope)', url: SRC.mm_indcyber },
    { label: 'Grand View Research: industrial automation services $175.4B (2024)', url: SRC.gvr_services },
    { label: 'IDC: discrete manufacturing DX spend ~$500B (2024)', url: SRC.idc_dx },
    { label: 'PwC Mine 2026: top-40 miners revenue $909B', url: SRC.pwc_mine },
    { label: 'Siemens Q4 FY25 results (DI EUR 17.8B)', url: SRC.siemens_q4 },
    { label: 'Siemens Annual Report 2025 (DI software EUR 6.17B, Altair and Dotmatics)', url: SRC.siemens_ar },
    { label: 'Siemens Q2 FY26 results (DI ARR EUR 5.5B)', url: SRC.siemens_q2_26 },
    { label: 'ABB Q4 2025 financial information (Motion, Automation, services)', url: SRC.abb_q4 },
    { label: 'ABB Capital Markets Day 2025 targets', url: SRC.abb_cmd },
    { label: 'ABB: robotics division sale to SoftBank, $5.375B', url: SRC.abb_softbank },
    { label: 'Schneider Electric FY2025 results (Industrial Automation EUR 7.0B, AVEVA ARR +12%)', url: SRC.schneider_fy },
    { label: 'Emerson Q4 FY2025 results (segments)', url: SRC.emerson_q4 },
    { label: 'Emerson Q4 FY2025 earnings call (software ACV $1.56B)', url: SRC.emerson_call },
    { label: 'Emerson completes AspenTech buy-in', url: SRC.emerson_aspen },
    { label: 'Emerson Project Beyond', url: SRC.emerson_beyond },
    { label: 'Emerson Project Certainty: automation ~4% of project investment', url: SRC.emerson_4pct },
    { label: 'Rockwell Q4 FY2025 results (segments, GM 48.1%)', url: SRC.rockwell_q4 },
    { label: 'Rockwell Q2 FY26 prepared remarks (S&C 34.9% margin)', url: SRC.rockwell_q2_26 },
    { label: 'Rockwell State of Smart Manufacturing 2026', url: SRC.rockwell_sosm },
    { label: 'Honeywell Q4 2025 results (Industrial Automation $9.4B)', url: SRC.honeywell_q4 },
    { label: 'Honeywell completes PPE sale to PIP ($1.325B)', url: SRC.honeywell_ppe },
    { label: 'Control Global: Honeywell Users Group 2026 (Kapur quotes)', url: SRC.honeywell_hug },
    { label: 'Honeywell and Google Cloud AI agents; 17% fully launched', url: SRC.honeywell_google },
    { label: 'Honeywell: automation to autonomy suite, OT SOC (Jun 2025)', url: SRC.honeywell_auto },
    { label: 'Yokogawa FY25 results presentation (Control JPY 566B, order mix, project orders)', url: SRC.yokogawa_fy25 },
    { label: 'Yokogawa: FKDPP adopted for routine operation at ENEOS Materials', url: SRC.yokogawa_fkdpp },
    { label: 'Yokogawa: ENEOS Materials success story (steam -40%)', url: SRC.yokogawa_eneos },
    { label: 'Mitsubishi Electric FY26 results (FA JPY 798B)', url: SRC.melco_fy26 },
    { label: 'Mitsubishi Electric: acquisition of Nozomi Networks', url: SRC.melco_nozomi },
    { label: 'Omron business report (IAB JPY 410B)', url: SRC.omron_fy },
    { label: 'FANUC FY Mar-26 reference data (service 16.5%)', url: SRC.fanuc },
    { label: 'Endress+Hauser 2025 financial year (EUR 4.0B)', url: SRC.eh_2025 },
    { label: 'Hexagon year-end report 2025 (adj. operating margin 27.2%)', url: SRC.hexagon_ye },
    { label: 'Octave investor day ($1.6B revenue, ARR $1.1B)', url: SRC.octave },
    { label: 'PTC Q4 FY25 results ($2.74B, ARR $2.48B)', url: SRC.ptc_q4 },
    { label: 'Dassault Systemes FY2025 results', url: SRC.dassault_fy },
    { label: 'Bentley Systems FY2025 results', url: SRC.bentley_fy },
    { label: 'AspenTech revenue history (FY24 $1.13B)', url: SRC.aspentech_rev },
    { label: 'MSA Safety Q4 2025 results ($1.875B)', url: SRC.msa_q4 },
    { label: 'Draeger Annual Report 2025 (R&D 9.6%, Services >EUR 1B)', url: SRC.draeger_ar },
    { label: 'Draeger FY2025 results (Safety division EUR 1,486M, 11.9% EBIT)', url: SRC.draeger_fy },
    { label: '3M Q4 2025 (Personal Safety $3.54B)', url: SRC.mmm_q4 },
    { label: 'Ansell FY25 results (Industrial $898.6M)', url: SRC.ansell_fy },
    { label: 'Fortive Q4 2025 (Intelex inside IOS)', url: SRC.fortive_q4 },
    { label: 'Samsara Q4 FY26 results', url: SRC.samsara_q4 },
    { label: 'Palantir Q4 2025 investor presentation', url: SRC.palantir_q4 },
    { label: 'C3.ai Q4 FY26 results', url: SRC.c3ai_fy26 },
    { label: 'Wesco FY2025 results (GM 21.1%)', url: SRC.wesco_q4 },
    { label: 'Graybar 2025 results ($12.9B)', url: SRC.graybar },
    { label: 'Wolters Kluwer FY2025 results (EHS & ESG +10%)', url: SRC.wk_fy25 },
    { label: 'Blackline Safety FY2025 results', url: SRC.blackline_fy25 },
    { label: 'Francisco Partners to acquire Blackline Safety (up to C$850M)', url: SRC.blackline_fp },
    { label: 'Blackline Safety Q2 FY26 (ARR C$93M)', url: SRC.blackline_q2 },
    { label: 'Automation World: true cost of software (implementation 20-100% of licence)', url: SRC.autoworld_sw },
    { label: 'Chemical Processing: engineering cost per I/O point', url: SRC.chemproc_io },
    { label: 'Dimension Funding / Grand View: robot hardware vs integration', url: SRC.dimension_si },
    { label: 'NSCA: integrator hardware margins', url: SRC.nsca_margin },
    { label: 'NSC Injury Facts: work injury costs 2024 ($181.4B)', url: SRC.nsc_costs },
    { label: 'NSC: workers\' compensation costs', url: SRC.nsc_wc },
    { label: 'ILO: nearly 3 million work-related deaths a year', url: SRC.ilo_3m },
    { label: 'ILO: Safety and Health at the Heart of the Future of Work (4% of GDP)', url: SRC.ilo_gdp },
    { label: 'EU-OSHA: international comparison of costs (EUR 476B, 3.3% of EU GDP)', url: SRC.euosha_cost },
    { label: 'EU-OSHA: good OSH is good for business (EUR 2.2 per euro)', url: SRC.euosha_roi },
    { label: 'Eurostat: accidents at work statistics 2023', url: SRC.eurostat },
    { label: 'HSE: costs to Britain of workplace injury (GBP 22.9B)', url: SRC.hse_cost },
    { label: 'BLS CFOI 2024: 5,070 fatal work injuries', url: SRC.bls_cfoi },
    { label: 'BLS SOII 2024: 2.5M nonfatal injuries', url: SRC.bls_soii },
    { label: 'BLS: fatal injuries by industry 2024', url: SRC.bls_by_industry },
    { label: 'BLS: injury and illness rates by industry 2024', url: SRC.bls_rates },
    { label: 'BLS: transportation and warehousing at a glance', url: SRC.bls_transport },
    { label: 'NIOSH/MSHA mining fatalities', url: SRC.msha },
    { label: 'Insurance Journal: Liberty Mutual Workplace Safety Index 2025 ($58.78B)', url: SRC.liberty },
    { label: 'Marsh: 100 Largest Losses in the Hydrocarbon Industry (29th ed.)', url: SRC.marsh_100 },
    { label: 'Marsh Global Insurance Market Index Q2 2026', url: SRC.marsh_index },
    { label: 'US CSB: chemical incident reports volume 3 ($1.8B property damage)', url: SRC.csb },
    { label: 'Allianz Global Claims Review 2022 (fire and explosion 21%)', url: SRC.allianz_claims },
    { label: 'Allianz Risk Barometer 2026', url: SRC.allianz_barometer },
    { label: 'ICMM 2024 safety performance (42 fatalities)', url: SRC.icmm },
    { label: 'BHP Annual Report 2025 (zero fatalities)', url: SRC.bhp_ar },
    { label: 'Siemens True Cost of Downtime 2024 (AEMT summary)', url: SRC.siemens_downtime },
    { label: 'Acronis summary of Siemens and ABB downtime studies', url: SRC.acronis_downtime },
    { label: 'OSHA penalty adjustments 2025', url: SRC.osha_penalties },
    { label: 'OSHA business case for safety ($2+ per $1)', url: SRC.osha_case },
    { label: 'OSHA PSM standard 29 CFR 1910.119', url: SRC.osha_psm },
    { label: 'Federal Register: OSHA improve tracking of workplace injuries (2024)', url: SRC.osha_ita },
    { label: 'NAHB: top OSHA violations FY2025', url: SRC.nahb_osha },
    { label: 'AFL-CIO Death on the Job 2026 (average serious penalty $4,678, 1,651 inspectors)', url: SRC.aflcio_dotj },
    { label: 'Risk & Insurance: nuclear verdicts $31.3B (2024)', url: SRC.nuclear_2024 },
    { label: 'Insurance Journal: nuclear verdicts $25.6B (2025)', url: SRC.nuclear_2025 },
    { label: 'NCCI State of the Line 2026 (private-carrier NWP $41.6B, combined ratio 91)', url: SRC.ncci_sotl },
    { label: 'Insurance Journal on NCCI State of the Line 2026', url: SRC.ncci_ij },
    { label: 'NAIC market share report (US workers\' comp direct premiums $57.9B)', url: SRC.naic_msr },
    { label: 'Milliman: wearables and workers\' comp (Nationwide/Kinetic)', url: SRC.milliman_kinetic },
    { label: 'Digital Insurance: Nationwide and Kinetic wearables', url: SRC.nationwide_kin },
    { label: 'European Commission: Machinery Regulation 2023/1230 (20 Jan 2027)', url: SRC.eu_machinery },
    { label: 'European Commission: NIS2 Directive', url: SRC.eu_nis2 },
    { label: 'European Commission: CSRD and Omnibus', url: SRC.eu_csrd },
    { label: 'European Commission: Net-Zero Industry Act', url: SRC.eu_nzia },
    { label: 'ISA/IEC 62443 series', url: SRC.isa_62443 },
    { label: 'White House: Section 232 steel and aluminium at 50%', url: SRC.sec232 },
    { label: 'Industrial manslaughter laws (Australia)', url: SRC.au_manslaughter },
    { label: 'IEA World Energy Investment 2025', url: SRC.iea_wei },
    { label: 'IEA Energy and AI (data-centre electricity)', url: SRC.iea_ai },
    { label: 'US Census: construction spending Jul 2026', url: SRC.census_c30 },
    { label: 'Deloitte 2026 Manufacturing Industry Outlook', url: SRC.deloitte_mfg },
    { label: 'Dragos 2026 OT Cybersecurity Year in Review (119 ransomware groups, 3,300 organisations)', url: SRC.dragos_yir },
    { label: 'Dragos and Marsh McLennan: $300B+ OT cyber-risk exposure (1-in-250-year scenario)', url: SRC.dragos_300b },
    { label: 'Dragos press releases (EmberAI, Phosphorus)', url: SRC.dragos_ember },
    { label: 'McKinsey State of AI 2026: On the road to ROI', url: SRC.mckinsey_2026 },
    { label: 'McKinsey State of AI Nov 2025', url: SRC.mckinsey_2025 },
    { label: 'Fortune: MIT NANDA GenAI Divide (95% no return)', url: SRC.mit_nanda },
    { label: 'BCG: Where\'s the value in AI (74% yet to show tangible value)', url: SRC.bcg_value },
    { label: 'OilPrice: Aramco expects $3-5B AI-enabled value in 2025', url: SRC.aramco_ai },
    { label: 'Aramco METABRAIN and $4B technology value (2024)', url: SRC.aramco_metabrain },
    { label: 'Siemens at CES 2026 (Busch quote; PepsiCo results)', url: SRC.siemens_ces },
    { label: 'NVIDIA and Siemens: Industrial AI Operating System', url: SRC.siemens_nvidia },
    { label: 'Siemens Eigen Engineering Agent (100+ companies)', url: SRC.siemens_eigen },
    { label: 'Siemens introduces AI agents for industrial automation', url: SRC.siemens_agents },
    { label: 'Siemens Maintenance Copilot / Senseye (25% less reactive time)', url: SRC.siemens_senseye },
    { label: 'Siemens Industrial Copilot adopted by thyssenkrupp', url: SRC.siemens_tk },
    { label: 'Siemens and P&G scale AI quality inspection (Sep 2026)', url: SRC.siemens_pg },
    { label: 'NVIDIA: Emerald AI, Google and NVIDIA launch AI Energy Management Alliance (Sep 2026)', url: SRC.emerald_ai },
    { label: 'Rockwell and Microsoft: Design Studio Copilot', url: SRC.rockwell_ms },
    { label: 'Shell CEO Wael Sawan on AI and leaner operations', url: SRC.shell_sawan },
    { label: 'C3 AI: Shell predictive maintenance at scale', url: SRC.shell_c3 },
    { label: 'BHP and Microsoft: AI at Escondida', url: SRC.bhp_escondida },
    { label: 'Energize Capital: The Burden of Proof (Jul 2026)', url: SRC.energize_proof },
    { label: 'a16z: Building American Dynamism', url: SRC.a16z_dynamism },
    { label: 'Eclipse raises $1.3B (Apr 2026)', url: SRC.eclipse_raise },
    { label: 'Voxel $44M Series B', url: SRC.voxel_b },
    { label: 'Protex AI $36M Series B', url: SRC.protex_b },
    { label: 'Intenseye $64M Series B', url: SRC.intenseye_b },
    { label: 'Intenseye site (400+ facilities, customer results)', url: SRC.intenseye_site },
    { label: 'Tulip $120M Series D led by Mitsubishi Electric', url: SRC.tulip_d },
    { label: 'Kinetic (Nationwide-backed workers\' comp)', url: SRC.kinetic },
    { label: 'Komatsu: 1,000 ultra-class autonomous haul trucks commissioned', url: SRC.komatsu_ahs },
    { label: 'StrongArm Technologies (35% average soft-tissue injury reduction)', url: SRC.strongarm },
    { label: 'Aatmunn (ex-Guardhat)', url: SRC.aatmunn },
    { label: 'Augmentir news (AI agents)', url: SRC.augmentir },
    { label: 'Poka (IFS): L\'Oreal new hires +11% OEE', url: SRC.poka },
    { label: 'Augury $75M Series F', url: SRC.augury_f },
    { label: 'Seeq $50M Series D', url: SRC.seeq_d },
    { label: 'Bosch acquires Uptake', url: SRC.uptake_bosch },
    { label: 'Schneider Electric to acquire Cognite ($3.1B)', url: SRC.cognite_se },
    { label: 'Cognite site (Forrester TEI, Atlas AI)', url: SRC.cognite_site },
    { label: 'Imubit (closed-loop AI)', url: SRC.imubit },
    { label: 'Fero Labs $15M', url: SRC.fero },
    { label: 'Gecko Robotics reaches unicorn status', url: SRC.gecko_d },
    { label: 'CNBC: Gecko Robotics $125M', url: SRC.gecko_cnbc },
    { label: 'Venturelab: ANYbotics raises over EUR 127M', url: SRC.anybotics },
    { label: 'Boston Dynamics: Spot at Chevron', url: SRC.bd_chevron },
    { label: 'Percepto: EPA alternative test method for autonomous OGI', url: SRC.percepto },
    { label: 'Skydio $110M Series F at $4.4B (3.7M+ missions)', url: SRC.skydio_f },
    { label: 'Korial (ex-Energy Robotics)', url: SRC.korial },
    { label: 'LandingAI agentic document extraction', url: SRC.landingai },
    { label: 'Archetype AI $35M Series A (Newton)', url: SRC.archetype },
    { label: 'CARYATID', url: SRC.caryatid },
    { label: 'NVIDIA Cosmos world foundation models', url: SRC.nvidia_cosmos },
    { label: 'TechCrunch: Armis $435M at $6.1B', url: SRC.armis_round },
    { label: 'ServiceNow completes Armis acquisition', url: SRC.armis_now },
    { label: 'Nozomi Networks: Mitsubishi Electric completes acquisition ($101.7M 2025 revenue)', url: SRC.nozomi_close },
    { label: 'Claroty $100M growth financing', url: SRC.claroty_100m },
    { label: 'Phaidra', url: SRC.phaidra },
    { label: 'Instrumental', url: SRC.instrumental },
    { label: 'Elementary', url: SRC.elementary },
    { label: 'Wolters Kluwer Enablon: Pfizer permit-to-work case (-94%)', url: SRC.enablon },
    { label: 'Wolters Kluwer Enablon: Yara permit-to-work case (6,000 hours)', url: SRC.enablon_yara },
    { label: 'Mitti (SafetyCulture) acquires Twine', url: SRC.safetyculture },
    { label: 'Startup Daily: SafetyCulture A$2.5B round', url: SRC.safetyculture_rd },
    { label: 'Sphera frontline worker survey (83% interested in AI assistant)', url: SRC.sphera_news },
    { label: 'Blackstone acquires Sphera for $1.4B', url: SRC.sphera_bx },
    { label: 'Private Equity Wire: Blackstone eyes $3B Sphera exit', url: SRC.sphera_exit },
    { label: 'Hg: Ideagen capital markets day (92%+ gross margin)', url: SRC.ideagen_cmd },
    { label: 'Insider Media: terms agreed on GBP 1.05B Ideagen acquisition', url: SRC.ideagen_deal },
    { label: 'Kirkland: Fortive / Industrial Scientific acquires Intelex ($570M)', url: SRC.intelex_deal },
    { label: 'Interplay Learning', url: SRC.interplay },
    { label: 'Vention press ($110M strategic round)', url: SRC.vention },
    { label: 'Equipment World: Procore to acquire DroneDeploy ($845M)', url: SRC.procore_dd },
    { label: 'dss+ about', url: SRC.dss_about },
    { label: 'dss+ acquires Proaction International (1,700 consultants, 41 countries)', url: SRC.dss_proaction },
    { label: 'Gyrus Capital portfolio (dss+ carve-out from DuPont)', url: SRC.gyrus },
    { label: 'ERM (consultancy) revenue and KKR deal', url: SRC.erm_wiki },
    { label: 'PitchBook-NVCA Q2 2026 Venture Monitor (CVC 21.1% of deals)', url: SRC.pitchbook_q2_26 },
    { label: 'PitchBook-NVCA Q2 2025 Venture Monitor (1,112 active corporate investors)', url: SRC.pitchbook_q2_25 },
    { label: 'GCV World of Corporate Venturing 2026 executive summary', url: SRC.gcv_wocv },
    { label: 'GCV: corporates broaden the venture toolkit (LP commitments, Jul 2026)', url: SRC.gcv_toolkit },
    { label: 'Harvard corp-gov: Song Ma, The Life Cycle of Corporate Venture Capital', url: SRC.songma },
    { label: 'MIT Sloan Management Review: CVC pitfalls', url: SRC.mitsmr_cvc },
    { label: 'Emerald Technology Ventures 25 years (50+ Fortune 500 corporate LPs)', url: SRC.emerald_25 },
    { label: 'DIC $62M physical-AI programme with Emerald', url: SRC.emerald_dic },
    { label: 'Mitsui Kinzoku backs Emerald Industrial Innovation Fund', url: SRC.emerald_mitsui },
    { label: 'Energy Impact Partners closes Flagship Fund III ($1.36B, 75+ LPs)', url: SRC.eip_fund3 },
    { label: 'Energize Capital raises $430M', url: SRC.energize_fund3 },
    { label: 'ABB Ventures (10 fund investments)', url: SRC.abb_ventures },
    { label: 'SE Ventures', url: SRC.se_ventures },
    { label: 'BHP Ventures', url: SRC.bhp_ventures },
    { label: 'Vale Ventures', url: SRC.vale_ventures },
    { label: 'ArcelorMittal XCarb Innovation Fund', url: SRC.xcarb },
    { label: 'Caterpillar Ventures', url: SRC.caterpillar_v },
    { label: 'Hitachi Ventures', url: SRC.hitachi_v },
    { label: 'Liberty Mutual Strategic Ventures', url: SRC.lmsv },
    { label: 'Tyson Ventures', url: SRC.tyson_v },
    { label: 'National Grid Partners', url: SRC.ngp }
  ];

  var method = [
    'Base year is 2025. Vendor fiscal years differ (Siemens, Emerson, Rockwell to Sep-25; Yokogawa, Mitsubishi Electric, Omron, FANUC to Mar-26; others calendar 2025) and are quoted as reported. FX for derived dollars: EUR 1.13, JPY 150.',
    'Scope is heavy-industry operations technology and safety: what oil and gas, chemicals, mining and metals, power and utilities, discrete and process manufacturers, construction and transport-infrastructure operators buy to run and protect plants. Consumer, healthcare and office IT are out. Automotive and electronics robot cells are counted in the robotics river, not here.',
    'Destination totals (middle column) are the anchors: analyst market sizes reconciled against company filings, tagged official, filing, analyst, derived (arithmetic on sourced figures, shown in each node) or modeled (our estimate constrained to sourced benchmarks). Every derived node carries its range. Ten categories sum to ~$410B (range $370-470B) after removing the flagged overlaps (SIS kept in automation, machine safety in safety systems, AI features in suites kept in software, projects in engineering, lifecycle in maintenance).',
    'Buyer split (left column) is modeled from vendor order mixes (Yokogawa FY25 Control orders: Energy & Sustainability 57% / Materials 34% / Life 9%), IFR installations by industry, Grand View and MarketsandMarkets end-use shares for PPE and OT security, Verdantix EHS spend by industry and IDC digital-transformation spend by industry; buyer totals are column sums, not independent statistics.',
    'Cost pools (right column) decompose each destination with the margin structures in the filings: hardware OEMs ~50c COGS / 8c R&D / 20c SG&A / 20c profit; software vendors ~15-20c COGS / 15-21c R&D / 25-35c S&M and G&A / 25-35c profit; services and integration at 6-15% operating margin; distributor gross margins 21% (Wesco).',
    'Excluded: insurance premiums and claims (shown in the headline strip and the incentives overlay, US-only), safety training as a stand-alone market (no sourced figure), EPC construction and the plant equipment itself, cloud and ERP spend, and venture capital into industrial startups (no reliable heavy-industry total found).',
    'Cost-of-the-problem figures are national (NSC, BLS, NCCI, HSE, Eurostat) or global (ILO) and are not added to the river. Company revenue is used only as a sanity check on market sizes, never summed into them.',
    'Built 20 Sep 2026 from five research packs; citation liveness and fact audit completed 30 Sep 2026 (see audit log).'
  ];

  var auditLog = [
    { date: '2026-09-20', change: 'Initial build. Ten destination anchors set from analyst ranges reconciled to vendor filings; buyer matrix and cost-pool weights modeled. Working figures flagged as derived with ranges: automation $110B ($95-130B), instrumentation $50B ($45-57B), industrial software $40B ($30-50B), industrial AI $10B ($8-12B, modeled), robotics and inspection $11B ($10-13B), safety systems and PPE $50B ($45-65B), EHS and connected worker $5B ($4.5-6B), OT cyber $11B ($10-22B), engineering and SI $85B ($70-100B), maintenance $40B ($35-45B).' },
    { date: '2026-09-20', change: 'Known conflicts carried into notes rather than resolved: Draeger Safety division sales appear as EUR 1,552M and EUR 1,642M in two extractions of the same annual report (shown as ~EUR 1.5-1.6B); process-control share of plant cost 4% (Emerson) vs >25% (The Chemical Engineer, unsourced) with 4% used; OT security $10B (Frost) vs $22B (Mordor) vs $85B (MarketsandMarkets, IT scope); PPE $56.6B (M&M) vs $90.4B (Grand View).' },
    { date: '2026-09-20', change: 'Not printed for lack of an accessible source: dss+ revenue; NCCI workers\' comp premium by industry; global industrial property and liability premiums; ARC market values for DCS, PLC and SCADA; Claroty, Dragos, Cority, Sphera, Intenseye current valuations; safety-training and operator-training-simulator market sizes; the Deloitte/Manufacturing Institute 3.8M-jobs figure (page not reachable); the WEF pilot-purgatory 70% figure.' },
    { date: '2026-09-20', change: 'Citations: every URL is a specific page (filing, release, report or article), no domain roots; 22 startup and CVC pages are company sites used only for the facts printed on them. Liveness re-check and second-agent fact audit completed 30 Sep 2026 (entries below), mirroring the 17 Sep 2026 robotics audit.' },
    { date: '2026-09-30', change: 'Audit summary. Every SRC URL re-fetched; every headline figure and every destination total and range re-checked against its sources. Headline tiles: all six values unchanged ($410B, $181.4B, 2.93M, $1.4T, 44%, $41.6B); sub-lines tightened (ILO figure is a 2019 estimate; Marsh 44% is downstream and midstream losses, 29th edition; NCCI $41.6B is private-carrier premium). Destination totals: all ten unchanged; their analyst inputs confirmed (Grand View $226.8B and 24% valves, MarketsandMarkets $74.2B, Interact $14.4B and $12.3B, $21.5B and IoT Analytics $146B, $34.2B AI in manufacturing, IFR 542,000, Grand View $37.8B robotics and $90.4B PPE, $56.6B PPE, $3.84B gas detection, $5.66B machine safety, Verdantix $1.9B and $1.38B, $8.62B connected worker, Mordor $22.15B, Frost $10.2B, $84.5B industrial cyber, Grand View $175.4B services, $13.9B predictive maintenance).' },
    { date: '2026-09-30', change: 'Corrected (19): Yokogawa FY25 Control order mix is Energy & Sustainability 57% / Materials 34% / Life 9% (was 50/18/32; buyer shares left as modeled, anchor text fixed); Yokogawa Control sales JPY 566B at ~13% (was the FY24 JPY 528B at 14.2%); Yokogawa solution and service ~26% of Control orders (was ~31%); Draeger Safety division EUR 1,486M at 11.9% EBIT (was ~EUR 1.5-1.6B and 5.7%; the two conflicting extractions in the 20 Sep log were both wrong); Draeger R&D 9.6% (was 9.7%); MSA gross margin 46.5% (was 46.4%); Blackline take-private is up to C$850M, not US$850M; Emerson $1.56B ACV is total software ACV, not AspenTech alone; Siemens DI automation ~EUR 11.6B (was ~$12B); ABB Automation services ~37% (was ~37.5%); Nozomi price $883M for 93% (was ~$1B); Eurostat construction share of EU fatal accidents 23% for 2024 (was 24%); PitchBook CVC share of H1 2026 deal value 82.6% (65.1% was the 2025 figure); Worley A$12.1B aggregated revenue and 45,000+ staff (was >$12B, 40,000); IEA nuclear above $70B (was ~$75B); Hitachi Ventures 59 companies, $1B AUM; Skydio 3.7M+ missions (was 1,000 docks, 4M+ flights); ICMM South Africa 15 of 42 deaths (was 35%); Hexagon R&D ~16% (was 15%).' },
    { date: '2026-09-30', change: 'Removed as unverifiable: Augury ~$100M ARR target; Claroty IPO prep; Samsara ~$24B market cap; StrongArm-Worklete merger; Honeywell PA&T 23.7% margin; TIA Portal 600,000+ users; Yokogawa GM 45.7% and SG&A 32%; ABB 4.5-5.0% R&D target; Dassault R&D 21.2%; Wesco 5.2% operating margin; ~$440 per I/O point (source gives a $500 rule of thumb it rejects); NCCI ~$62,000 lost-time claim; NSC 102M days lost and NCCI $47,316 average claim; BLS transport 4.4 nonfatal rate and highest-sector claim; ICMM 0.015 fatality frequency; BHP high-potential injury frequency; Vale Ventures zero-fatality pillar (not on its page); Marsh 51% management-system share; Siemens 2019 downtime 8%; McKinsey 40% of large firms scaling agents and the Nov 2025 industry cuts (report not reachable); CB Insights robotics $40.7B; Poka 3,000+ sites; Cognite 465% TEI ROI; Imubit CITGO and HF Sinclair and the new-hires claim; IPA >65% overrun claim; Deloitte n=600; EIP named LPs; ANYbotics customer list; Gartner $584B (paywalled).' },
    { date: '2026-09-30', change: 'Citations replaced (dead, redirected, root, paywalled or bot-walled with a specific accessible page): poka, procore_dd, liberty, dragos_yir, dragos_300b, mckinsey_2026, bcg_value, aramco_ai, eip_fund3, nozomi_close, blackline_q2, anybotics, archetype, enablon, percepto, safetyculture, sphera_news, hexagon_ye, allianz_claims, emerson_4pct, plus redirect fixes for honeywell_ppe, honeywell_auto, melco_nozomi, sec232, eu_csrd, dss_about, gyrus, songma, strongarm. Added: emerson_call, draeger_fy, aflcio_dotj, siemens_pg, emerald_ai, komatsu_ahs, enablon_yara, ideagen_deal. Removed: gartner_mfg_it (paywalled), skydio_blog (index page). Company homepages kept only where the homepage itself states the printed fact (Intenseye, Imubit, Korial, Aatmunn, Instrumental, Elementary, Phaidra, Interplay, LandingAI, SE Ventures, Hitachi Ventures, National Grid Partners). Some official pages (NSC, BLS, Grand View, Draeger, ABB, Marsh, bhp.com) block automated fetches but load in a browser; figures on them were confirmed via mirrors or the same text in accessible coverage.' },
    { date: '2026-09-30', change: 'Confirmed as printed (sample): NSC $181.4B, $48,000, $1.54M; ILO 2.93M and 395M; Siemens $1.4T, 11%, $2.3M an hour, 25 incidents and 27 hours; ABB $125,000 an hour; Marsh 44%, ~45 years (NA 61, Europe 54), 3:1 and 10:1 BI:PD; NCCI 91 and 102, severity +4%; Marsh Q2 2026 property -12%, US casualty +7%; nuclear verdicts $31.3B (135, +116%) and $25.6B; OSHA $16,550 and $165,514; AFL-CIO $4,678 and 1,651; fall protection 5,914 citations; CSB 500+ and $1.8B; ICMM 42/36/33 and 9 of 24; BLS 5,070, 1,034 (9.2), 865; Census $167.8B vs $214.4B (-21.7%); IEA $3.3T, $2.2T, $1.5T, $400B, <$570B, 415 and ~945 TWh; Siemens DI EUR 17.8B at 14.9%, software EUR 6.17B, R&D 8.3%; ABB Motion $8.2B, Automation $8.1B at 14.0%, services $5.55B; Emerson $18.0B, S&C $5.7B at ~31%, M&A $4.1B at 28.5%, Final Control $4.4B; Rockwell $8.3B, GM 48.1%, S&C 29.7%, LS $2.2B at 14.5%, R&D $679M; Honeywell IA $9.4B at 18.5%; Schneider IA EUR 7.0B at 14.2%; Mitsubishi FA JPY 798B; Omron IAB JPY 410B; FANUC Robot JPY 379B and service 16.5%; E+H >EUR 4B, 11.9%, 7.0%; PTC $2.74B, ARR $2.48B, 36%; Dassault EUR 6.24B, 32%; Bentley $1.50B, ARR $1.46B; Octave $1.6B and $1.1B ARR; Palantir US commercial $1.47B (+109%), 50% margin; C3.ai $250M, 31% GM; Samsara $1.62B, $1.89B ARR, 17%; 3M Personal Safety $3.54B; MSA $1.875B, Detection $763M, 22.1%, R&D 3.5%; Ansell Industrial $898.6M; WK EHS and ESG ~EUR 194M, +10%; Cognite $3.1B and >$170M; Armis $435M at $6.1B, $7.75B, ARR ~$300M; Tulip $120M at $1.3B; Gecko $1.25B; Voxel $44M; Protex $36M; Intenseye $64M, 400+ facilities, 45+ countries; Seeq $50M; Vention $110M; Eclipse $1.3B; Energize $430M; EIP $1.36B; ABB Robotics $5.375B; Sphera $1.4B and $3B ask; Intelex $570M; Ideagen GBP 1.05B; Cority ~$2B; Procore-DroneDeploy $845M; Aramco $3-5B; Eigen 100+ companies in 19 countries; PepsiCo +20% throughput; Dragos 3,300, 119 groups (+49%), 46%; PitchBook 21.1% and 1,112 (35.7%); GCV; Emerald 50+ Fortune 500 LPs; DIC $62M; SE Ventures EUR 1B, 60+, 60%+.' }
  ];

  root.INDUSTRIAL_DATA = {
    SRC: SRC,
    baseYear: '2025',
    headlineStats: headlineStats,
    paymentChannels: paymentChannels,
    destinations: destinations,
    costPools: costPools,
    destToBuyerShares: destToBuyerShares,
    destToPoolWeights: destToPoolWeights,
    moneyLinksAB: moneyLinksAB,
    moneyLinksBC: moneyLinksBC,
    aiSurfaces: aiSurfaces,
    incentives: incentives,
    companies: companies,
    flowMicrocopy: flowMicrocopy,
    flowMicrocopyFallback: flowMicrocopyFallback,
    sources: sources,
    method: method,
    auditLog: auditLog,
    fmtUSD: fmtUSD
  };
})(typeof window !== 'undefined' ? window : this);
