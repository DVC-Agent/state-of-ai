/* =====================================================================
   ROBOTICS & PHYSICAL AI — DATA MODEL
   Money River: buyers -> what is bought -> what the dollars fund
   Base year 2025 (latest full year). Destination totals are sourced
   (IFR, company filings, Interact Analysis, DII, IDC, Grand View, M&M);
   buyer split and cost-pool decomposition are modeled and constrained to
   those totals. Every node carries an evidence tag:
     official | filing | analyst | derived | modeled
   Same schema as HEALTHCARE_DATA so the renderer can be shared.
   ===================================================================== */
(function (root) {
  'use strict';

  var SRC = {
    ifr_wr2025:      'https://ifr.org/ifr-press-releases/news/global-robot-demand-in-factories-doubles-over-10-years',
    ifr_wr2026:      'https://ifr.org/ifr-press-releases/news/five-million-robots-now-operate-in-factories-globally',
    ifr_wr2026_cn:   'https://ifr.org/downloads/press_docs/EN-2026-SEP-24-IFR_Press_Release_WR-CHINA.pdf',
    ifr_wr2026_eu:   'https://ifr.org/downloads/press_docs/EN-2026-SEP-14-IFR_Press_Release_WR-EU-27.pdf',
    ifr_wr2026_us:   'https://ifr.org/downloads/press_docs/EN-2026-SEP-24-IFR_Press_Release_WR-USA.pdf',
    ifr_exec_ind:    'https://ifr.org/img/worldrobotics/Executive_Summary_WR_2025_Industrial_Robots.pdf',
    ifr_exec_svc:    'https://ifr.org/img/worldrobotics/Executive_Summary_WR_2025_Service_Robots.pdf',
    ifr_trends2026:  'https://ifr.org/ifr-press-releases/news/top-5-global-robotics-trends-2026',
    ifr_systems3x:   'https://ifr.org/ifr-press-releases/news/robot-investment-reaches-record-16.5-billion-usd',
    ifr_us2025:      'https://ifr.org/ifr-press-releases/news/us-robot-industry-returns-to-double-digit-growth',
    ifr_automate26:  'https://www.manufacturingdive.com/news/us-robotics-rebounded-2025-on-track-more-growth-ifr-automate-2026/823874/',
    ifr_china:       'https://ifr.org/downloads/press_docs/2025-09-25-IFR_press_release_China_in_English.pdf',
    ia_ind2025:      'https://interactanalysis.com/annual-industrial-robot-shipments/',
    ia_ind2024:      'https://interactanalysis.com/insight/global-industrial-robot-shipments-declined-in-2024-recovery-expected-in-2025/',
    ia_cobots:       'https://interactanalysis.com/strong-growth-forecast-collaborative-robot-shipments/',
    ia_mobile:       'https://interactanalysis.com/mobile-robots-market-outpaces-fixed-automation/',
    ia_warehouse:    'https://interactanalysis.com/insight/warehouse-automation-in-2025/',
    ia_components:   'https://www.controleng.com/industrial-robot-value-comes-from-servo-motors-servo-drives-and-gearboxes/',
    logisticsiq:     'https://www.prnewswire.com/news-releases/warehouse-automation-market-to-reach-55-billion-by-2030-driven-by-e-commerce-and-supply-chain-transformation---logisticsiq-302252709.html',
    abi:             'https://www.abiresearch.com/blog/global-robotics-market-outlook',
    a3_2025:         'https://www.automate.org/market-intelligence/insights-plus/robot-orders-grow-6-6-in-2025-as-general-industries-drive-broader-automation-adoption',
    isrg_fy25:       'https://isrg.intuitive.com/news-releases/news-release-details/intuitive-announces-fourth-quarter-earnings-5/',
    isrg_prelim25:   'https://isrg.intuitive.com/news-releases/news-release-details/intuitive-announces-preliminary-fourth-quarter-and-full-year-5',
    isrg_q2_26:      'https://isrg.intuitive.com/news-releases/news-release-details/intuitive-announces-second-quarter-earnings-6',
    gvr_surgical:    'https://www.grandviewresearch.com/industry-analysis/surgical-robot-market',
    gvr_exo:         'https://www.grandviewresearch.com/industry-analysis/exoskeleton-market',
    gvr_construction:'https://www.grandviewresearch.com/industry-analysis/construction-robots-market-report',
    gvr_si:          'https://www.grandviewresearch.com/industry-analysis/robotics-system-integration-market-report',
    dii:             'https://droneii.com/drone-market-growth-in-2025-and-beyond',
    dji_ag:          'https://www.dji.com/media-center/announcements/dji-agricultural-annual-report-2025',
    idc_cleaning:    'https://www.idc.com/resource-center/blog/global-home-cleaning-robot-market-2025/',
    idc_irobot:      'https://www.idc.com/resource-center/blog/the-rise-of-chinese-smart-vacuum-giants-and-the-fall-and-sale-of-irobot/',
    roborock:        'https://newsroom.roborock.com/gl/news/roborock-reports-56-51-revenue-growth-in-2025-q1-2026-revenue-up-23-31-',
    irobot:          'https://media.irobot.com/2025-03-12-iRobot-Reports-Fourth-Quarter-and-Full-Year-2024-Financial-Results',
    omdia_humanoid:  'https://www.bloomberg.com/news/articles/2026-01-08/chinese-firms-dominated-global-humanoid-robot-shipments-in-2025',
    omdia_pr:        'https://www.prnewswire.com/news-releases/omdia-ranks-agibot-no1-worldwide-in-humanoid-robot-shipments-in-2025-302656788.html',
    idc_humanoid:    'https://news.cgtn.com/news/2026-01-24/IDC-report-China-leads-the-global-humanoid-robot-rise-in-2025-1KccOGZyVGM/p.html',
    counterpoint_h:  'https://roboticsandautomationnews.com/2026/01/30/global-humanoid-robot-installations-reach-16000-units-as-commercial-deployments-accelerate/98422/',
    unitree_listing: 'https://www.21jingji.com/article/20260819/herald/4cdb97870e179c3d0f66b0d0e1604233.html',
    unitree_sse:     'https://english.sse.com.cn/news/newsrelease/voice/c/c_20260811_10828578.shtml',
    agibot_rev:      'https://www.scmp.com/tech/big-tech/article/3337477/chinas-agibot-targets-us142-million-revenue-march-humanoid-robots-gathers-pace',
    leju_filing:     'https://www.tmtpost.com/7997435.html',
    agility_rev:     'https://www.therobotreport.com/agility-robotics-reports-18m-revenue-ahead-of-humanoid-spac/',
    tesla_10k_25:    'https://ir.tesla.com/_flysystem/s3/sec/000162828026003952/tsla-20251231-gen.pdf',
    tesla_q4_25_call:'https://www.fool.com/earnings/call-transcripts/2026/01/28/tesla-tsla-q4-2025-earnings-call-transcript/',
    figure_revenue:  'https://www.therobotreport.com/figure-ai-ships-figure-02-humanoid-robots-paying-customer/',
    figure_bmw:      'https://www.figure.ai/news/production-at-bmw',
    figure_catalyst: 'https://www.figure.ai/news/figure-signs-agreement-with-catalyst-brands',
    apptronik_park2: 'https://apptronik.com/news-collection/welcome-to-robot-park-where-apptroniks-apollo-goes-to-work',
    onex_factory:    'https://www.globenewswire.com/news-release/2026/04/30/3285118/0/en/1x-opens-neo-factory-in-hayward-ca-america-s-first-vertically-integrated-humanoid-robot-factory-with-consumer-shipments-planned-for-2026.html',
    onex_eqt:        'https://www.businesswire.com/news/home/20251211360340/en/1X-Announces-Strategic-Partnership-to-Make-up-to-10000-Humanoid-Robots-Available-to-EQTs-Global-Portfolio',
    hmc_audit_25:    'https://www.hyundai.com/content/dam/hyundai/ww/en/images/company/investor-relations/financial-Information/report-en/2025/2025-q4-consolidated-audit-report-en.pdf',
    bd_bloter:       'https://www.bloter.net/news/articleView.html?idxno=669956',
    galbot_huxiu:    'https://www.huxiu.com/article/4866308.html',
    galbot_orders:   'https://www.21jingji.com/article/20250917/herald/4742678a9fda9f17d787e2c57022f2a8.html',
    unitree_clar:    'https://shop.unitree.com/blogs/news/clarification-regarding-unitrees-2025-sales-data',
    unitree_ipo:     'https://fortune.com/2026/08/19/unitree-china-dancing-robots-ipo-trading-surge-valuation/',
    unitree_debut:   'https://fortune.com/2026/08/19/unitree-china-dancing-robots-ipo-trading-surge-valuation/',
    ubtech:          'https://humanoid.guide/ubtech-humanoid-revenue-surges-in-2025-results/',
    ubtech_gasgoo:   'https://autonews.gasgoo.com/articles/icv/ubtech-2025-report-card-revenue-from-full-size-humanoid-robots-grows-over-22-fold-2039900685372407808',
    sag_h1_26:       'https://smartanalyticsglobal.com/global-humanoid-robot-shipments-2026-agibot-unitree/',
    ms_humanoid100:  'https://advisor.morganstanley.com/john.howard/documents/field/j/jo/john-howard/The_Humanoid_100_-_Mapping_the_Humanoid_Robot_Value_Chain.pdf',
    bofa_humanoid:   'https://institute.bankofamerica.com/content/dam/transformation/physical-ai-part-2.pdf',
    gs_humanoid:     'https://247wallst.com/investing/2026/09/13/robots-everywhere-goldman-sachs-now-sees-6-5-million-humanoid-robots-by-2035/',
    corematter_bom:  'https://corematter.substack.com/p/humanoid-robot-actuator-cost-bom-analysis',
    mm_milking:      'https://www.marketsandmarkets.com/Market-Reports/milking-robots-market-170643611.html',
    lely:            'https://www.lely.com/global/news/lely-reports-2025-financial-results-a-formidable-year/',
    mm_milrobots:    'https://www.marketsandmarkets.com/Market-Reports/military-robots-market-127654312.html',
    mm_mildrones:    'https://www.marketsandmarkets.com/Market-Reports/military-drone-market-221577711.html',
    dod_fy26:        'https://defensescoop.com/2025/06/26/dod-fy26-budget-request-autonomy-unmanned-systems/',
    dod_fy27:        'https://defensescoop.com/2026/04/21/dod-plans-largest-ever-investment-drones-anti-drone-weapons/',
    ukraine_fpv:     'https://kyivindependent.com/ukraine-on-track-to-receive-total-of-3-million-fpv-drones-in-2025/',
    ukraine_budget:  'https://kyivindependent.com/ukraine-to-buy-4-5-million-fpv-drones-in-2025/',
    anduril:         'https://techcrunch.com/2026/05/13/anduril-raises-5b-doubles-valuation-to-61b/',
    keenon_idc:      'https://www.prnewswire.com/news-releases/keenon-robotics-continues-global-lead-in-commercial-service-robot-market-securing-triple-no1-rankings-idc-reports-302509306.html',
    integrator_tco:  'https://amdmachines.com/blog/total-cost-of-ownership-for-robotic-systems/',
    integrator_25:   'https://motioncontrolsrobotics.com/resources/tech-talk-articles/range-robot-cost/',
    a3_roi:          'https://www.automate.org/robotics/editorials/calculating-robot-roi-how-to-determine-the-true-cost-of-robotics',
    standardbots:    'https://standardbots.com/blog/how-much-do-robots-cost',
    fmi_china_cost:  'https://www.futuremarketinsights.com/articles/how-is-chinas-automation-surge-reshaping-component-cost-stacks-import-substitution-and-competitive-dynamics-between-domestic-oems-and-global-suppliers',
    a16z_reducers:   'https://a16z.com/america-cannot-lose-the-robotics-race/',
    cobot_cell:      'https://www.evsint.com/how-much-does-a-cobot-cost-pricing-guide-2026/',
    nabtesco:        'https://www.nabtesco.com/cms/wp-content/uploads/Results_Briefing_Material_for_FY2025_e.pdf',
    hds:             'https://finance.biggo.com/news/jpx_tdnet_140120260511521357',
    leaderdrive:     'https://humanoid.guide/leaderdrive-harmonic-reducers-surge-as-humanoid-demand-lifts-shares/',
    yaskawa:         'https://www.yaskawa-global.com/wp-content/uploads/2026/04/254Q_script_E.pdf',
    fanuc:           'https://www.fanuc.co.jp/en/ir/announce/pdf/2026/reference202603_e.pdf',
    abb_softbank:    'https://new.abb.com/news/detail/129685/abb-to-divest-robotics-division-to-softbank-group',
    kuka:            'https://www.kuka.com/-/media/kuka-corporate/documents/ir/reports-and-presentations/en/annual-report/annual-report-2025.pdf',
    teradyne:        'https://investors.teradyne.com/news-events/press-releases/detail/433/teradyne-reports-fourth-quarter-and-full-year-2025-results',
    keyence:         'https://www.keyence.co.jp/pdf/FinancialResults_202604_en.pdf',
    cognex:          'https://www.prnewswire.com/news-releases/cognex-reports-fourth-quarter-2025-results-302685567.html',
    hesai:           'https://investor.hesaitech.com/news-releases/news-release-details/hesai-group-reports-fourth-quarter-and-full-year-2025-unaudited',
    robosense:       'https://autonews.gasgoo.com/articles/news/robosense-achieves-first-quarterly-profit-in-2025-robotics-business-accounts-for-nearly-half-2037147819842895872',
    nvidia_fy26:     'https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2026',
    nvidia_ces26:    'https://nvidianews.nvidia.com/news/nvidia-releases-new-physical-ai-models-as-global-partners-unveil-next-generation-robots',
    nvidia_thor:     'https://nvidianews.nvidia.com/news/nvidia-blackwell-powered-jetson-thor-now-available-accelerating-the-age-of-general-robotics',
    symbotic:        'https://ir.symbotic.com/news-releases/news-release-details/symbotic-reports-fourth-quarter-and-fiscal-year-2025-results',
    symbotic_10k:    'https://www.sec.gov/Archives/edgar/data/1837240/000119312526015495/ars_2025.pdf',
    symbotic_q3_26:  'https://ir.symbotic.com/news-releases/news-release-details/symbotic-reports-third-quarter-fiscal-year-2026-results',
    geekplus:        'https://www.geekplus.com/resources/news/geekplus-hits-profitability-milestone-with-31.6-yoy-revenue-growth-fueled-by-embodied-intelligence-driven-tech-innovation',
    autostore:       'https://www.autostoresystem.com/investors/press-releases/autostore-q4-2025-financial-results-4317e',
    ocado:           'https://www.ocadogroup.com/investors/results-and-presentations/ocado-group-full-year-results-2025',
    kion_dematic:    'https://www.kiongroup.com/en/Press/Press-Releases/Press-Releases-Detail.html?id=1531044111&type=corporate',
    amazon_1m:       'https://www.aboutamazon.com/news/operations/amazon-million-robots-ai-foundation-model',
    locus:           'https://locusrobotics.com/blog/seven-billion-picks-warehouse',
    agility_spac:    'https://www.geekwire.com/2026/digit-maker-agility-robotics-to-go-public-in-2-5b-deal-heres-what-the-filings-say-about-its-finances/',
    figure_c:        'https://techcrunch.com/2025/09/16/figure-reaches-39b-valuation-in-latest-funding-round/',
    skild:           'https://techcrunch.com/2026/01/14/robotic-software-maker-skild-ai-hits-14b-valuation/',
    pi_talks:        'https://techcrunch.com/2026/03/27/physical-intelligence-is-reportedly-in-talks-to-raise-1-billion-again/',
    apptronik:       'https://apptronik.com/news-collection/apptronik-closes-over-935-million-series-a',
    galbot:          'https://www.caixinglobal.com/2026-03-03/galbot-raises-362-million-in-fresh-funding-eyes-hong-kong-ipo-102418742.html',
    a3_q2_26:        'https://www.therobotreport.com/q2-2026-robotics-demand-increased-across-industries-reports-a3/',
    agibot_10k:      'https://www.therobotreport.com/agibot-rolls-out-10000th-humanoid-robot/',
    ms_china_50k:    'https://thenextweb.com/news/china-humanoid-robot-forecast-morgan-stanley-50000/',
    apptronik_park:  'https://apptronik.com/news-collection/welcome-to-robot-park-where-apptroniks-apollo-goes-to-work',
    irobot_picea:    'https://media.irobot.com/2026-01-23-iRobot-Completes-Court-Supervised-Transaction-with-Picea,-Enabling-the-Next-Chapter-of-Growth',
    ecovacs:         'http://finance.people.com.cn/n1/2026/0427/c1004-40709653.html',
    dreame:          'https://www.caixinglobal.com/2026-05-08/in-depth-dreames-100-trillion-vision-tests-chinas-make-everything-tech-playbook-102441968.html',
    komatsu_1000:    'https://im-mining.com/2026/04/21/komatsu-commissions-1000-autonomous-ultra-class-trucks/',
    horizon:         'https://autonews.gasgoo.com/articles/news/horizon-robotics-boasts-577-yoy-surge-in-2025-annual-revenue-2034605818467483649',
    ouster:          'https://investors.ouster.com/news-releases/news-release-details/ouster-announces-results-fourth-quarter-and-full-year-2025',
    ambi:            'https://www.ambirobotics.com/media/ambi-robotics-raises-32m/',
    carbon:          'https://www.geekwire.com/2025/carbon-robotics-raises-20m-as-laserweeder-maker-plans-secretive-new-ai-robot-for-farms/',
    pi_axios:        'https://www.axios.com/2025/11/21/robots-physical-intelligence-ai',
    genesis_talks:   'https://thenextweb.com/news/genesis-ai-500m-raise-robotics-foundation-model',
    drone_dominance: 'https://defensescoop.com/2025/12/02/hegseth-drone-dominance-program-ddp-gauntlets-website-rfi/',
    neura:           'https://neura-robotics.com/record-series-c/',
    generalist:      'https://techcrunch.com/2026/08/25/robotics-startup-generalist-reaches-3b-valuation-sources-say/',
    dyna:            'https://www.bloomberg.com/news/articles/2025-09-15/dyna-robotics-raises-120-million-in-funding-from-nvidia-amazon',
    genesis:         'https://techcrunch.com/2026/05/06/khosla-backed-robotics-startup-genesis-ai-has-gone-full-stack-demo-shows/',
    sunday:          'https://siliconangle.com/2026/03/12/sunday-raises-165m-1-15b-valuation-launch-memo-household-robot/',
    onex:            'https://www.therobotreport.com/1x-announces-pre-order-launch-neo-humanoid-robot/',
    onex_softbank:   'https://www.humanoidsdaily.com/news/softbank-in-talks-for-majority-stake-in-1x-at-6-billion-below-the-10-billion-it-sought-last-year',
    deepmind_gr2:    'https://deepmind.google/blog/gemini-robotics-2-brings-whole-body-intelligence-to-robots/',
    tesla_q2_26:     'https://www.shacknews.com/article/150109/tesla-tsla-q2-2026-earnings-call-transcript',
    tesla_1m_line:   'https://www.teslarati.com/tesla-optimus-pilot-line-will-already-have-an-incredible-annual-output/',
    hyundai_atlas:   'https://www.automate.org/robotics/industry-insights/boston-dynamics-to-begin-production-on-redesigned-atlas-humanoid-in-2026',
    hyundai_25k:     'https://www.koreaherald.com/article/10741955',
    hyundai_union:   'https://en.sedaily.com/finance/2026/01/22/not-a-single-robot-without-agreement-hyundai-motor-union',
    xpeng_iron:      'https://electrek.co/2026/09/07/xpeng-iron-humanoid-robot-production-line/',
    mechmind:        'https://thebambooworks.com/mech-mind-debuts-as-hong-kongs-first-embodied-intelligence-eye-brain-hand-stock/',
    dexterity:       'https://www.robotics247.com/article/ai-powered-dexterity-valued-at-1.65-billion',
    covariant:       'https://www.geekwire.com/2024/amazon-hires-covariant-founders-inks-licensing-deal-with-robotics-ai-startup-in-latest-reverse-acquihire-deal/',
    moon:            'https://www.prnewswire.com/news-releases/moon-surgical-receives-fda-clearance-for-scopilot-on-maestro-industrys-first-ai-enhanced-intraoperative-capability-powered-by--nvidia-holoscan-302404920.html',
    ottava:          'https://www.jnj.com/media-center/press-releases/johnson-johnson-receives-fda-market-authorization-in-the-u-s-for-its-ottava-robotic-surgical-system',
    hugo:            'https://news.medtronic.com/2025-12-03-Medtronic-announces-FDA-clearance-of-Hugo-TM-robotic-assisted-surgery-system-for-urologic-surgical-procedures',
    acs_robotic:     'https://www.facs.org/for-medical-professionals/news-publications/news-and-articles/bulletin/2026/february-2026-volume-111-issue-2/cost-of-robotic-surgery-remains-complex-equation/',
    shield:          'https://shield.ai/shield-ai-to-acquire-software-simulation-company-aechelon-and-raise-2b-at-12-7b-valuation/',
    helsing:         'https://www.defensenews.com/global/europe/2026/07/13/helsing-raises-18-billion-in-europes-biggest-defense-startup-round/',
    saronic:         'https://www.prnewswire.com/news-releases/saronic-closes-1-75b-series-d-at-9-25b-valuation-to-accelerate-a-new-era-of-maritime-autonomy-302729238.html',
    crunchbase_rob:  'https://news.crunchbase.com/robotics/startup-venture-funding-surges-2026-data/',
    crunchbase_2024: 'https://news.crunchbase.com/venture/ai-humanoid-robot-funding-apptronik/',
    china_datacenters:'https://english.news.cn/20260316/9a6dffb3472c4ea8a02b58af155d8d00/c.html',
    china_shijingshan:'https://en.people.cn/n3/2026/0428/c90000-20451334.html',
    tesla_dataops:   'https://www.techspot.com/news/104336-tesla-hiring-optimus-robot-trainers-earn-48-hour.html',
    mfg_institute:   'https://themanufacturinginstitute.org/manufacturers-need-as-many-as-3-8-million-new-employees-by-2033/',
    recruit_japan:   'https://recruit-holdings.com/en/blog/post_20230926_0001/',
    nbs_china:       'https://www.stats.gov.cn/english/PressRelease/202601/t20260119_1962328.html',
    s301_robots:     'https://www.govinfo.gov/content/pkg/FR-2018-06-20/pdf/2018-13248.pdf',
    s232_robotics:   'https://www.federalregister.gov/documents/2025/09/26/2025-18749/notice-of-request-for-public-comments-on-section-232-national-security-investigation-of-imports-of',
    s232_status:     'https://www.bis.gov/about-bis/bis-leadership-and-offices/SIES/section-232-investigations',
    s232_chips:      'https://www.whitecase.com/insight-alert/president-trump-orders-narrowly-targeted-25-section-232-tariff-certain-advanced',
    fcc_covered:     'https://docs.fcc.gov/public/attachments/DA-26-786A1.pdf',
    fcc_ifr:         'https://ifr.org/ifr-press-releases/news/fcc-restrictions-on-foreign-produced-advanced-robotic-devices',
    obbba:           'https://www.bdo.com/insights/tax/one-big-beautiful-bill-act-expands-100-depreciation-expensing-opportunities',
    eu_ai_act:       'https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/',
    eu_machinery:    'https://osha.europa.eu/en/legislation/directive/regulation-20231230eu-machinery',
    iso10218:        'https://www.therobotreport.com/iso-10218-industrial-robot-safety-standard-receives-major-overhaul/',
    r1506:           'https://www.automate.org/industry-insights/ansi-a3-publish-revised-r15-06-industrial-robot-safety-standard',
    china_standards: 'https://english.news.cn/20260303/0e51ac8f66c542c5bacf2af3f80b3a40/c.html',
    rare_earth:      'https://www.csis.org/analysis/rare-earth-export-restrictions-one-year-later',
    musk_magnets:    'https://www.tomshardware.com/tech-industry/tesla-is-impacted-by-chinas-export-ban-on-rare-earth-minerals-optimus-production-is-delayed-due-to-a-magnet-issue',
    iea_elec:        'https://www.iea.org/reports/electricity-2026/prices',
    merics_china:    'https://merics.org/en/report/embodied-ai-chinas-ambitious-path-transform-its-robotics-industry',
    miit_2023:       'https://www.therobotreport.com/china-plans-to-mass-produce-humanoids-by-2025/',
    beijing_fund:    'https://www.therobotreport.com/beijing-announces-1-4b-robotics-fund/',
    ifr_govt_rd:     'https://ifr.org/news/robotics-research-goverment-programs-asia-europe-and-america-2025/',
    dvc_portfolio:   'https://dvc.vc/'
  };

  // Headline tiles ------------------------------------------------------
  var headlineStats = [
    { label: 'Robots & robotic systems bought', value: '$155B', sub: '2025, bottom-up sum of sourced categories (see method)', evidence: 'derived' },
    { label: 'Industrial robots installed', value: '600,000+', sub: '2025, +11% (IFR World Robotics 2026, 24 Sep 2026); 2024: 542,076. The preliminary 621,000 (+15%) was revised down', evidence: 'official', src: SRC.ifr_wr2026 },
    { label: 'Robot arms, value', value: '$16.7B', sub: 'IFR 2024, robot only; systems incl. integration ~3x', evidence: 'official', src: SRC.ifr_trends2026 },
    { label: 'China share of installs', value: '59%', sub: '2025: 354,000 units (+20%); 55% supplied by Chinese brands (57% in 2024)', evidence: 'official', src: SRC.ifr_wr2026_cn },
    { label: 'Humanoids shipped', value: '13-18k', sub: '2025, by tracker: Omdia 13,318, Counterpoint ~16,000, IDC ~18,000; H1 2026: 19,100 (Smart Analytics Global)', evidence: 'analyst', src: SRC.omdia_pr },
    { label: 'VC into robotics startups', value: '$15B', sub: '2025 (Crunchbase, as of 22 Jun 2026); $18.8B in 2026 by mid-June', evidence: 'analyst', src: SRC.crunchbase_rob }
  ];

  // =====================================================================
  // LAYER B — WHAT IS BOUGHT (2025, USD billions)
  // Destination totals are the anchors of the river.
  // =====================================================================
  var destinations = [
    { id: 'dest_arms', label: 'Industrial robot arms', value_b: 15.6, display: '$15.6B',
      evidence: 'official', src: SRC.ifr_trends2026, year: '2024 value, 2025 growth',
      description: 'Articulated, SCARA, delta and cartesian robots, robot only (no software, peripherals or integration). IFR: $16.7B in 2024, an all-time high; Interact Analysis: vendor revenue +0.8% in 2025 on 549,555 units. Cobots ($1.2B) shown separately.',
      note: 'IFR World Robotics 2026 (24 Sep 2026): 2025 installs +11% to more than 600,000 units, revising down the preliminary 621,000 (+15%); Asia 457,315 of them (+14%). The press release gives no 2025 robot-only value, so the $16.7B (2024) anchor stands.' },
    { id: 'dest_cobots', label: 'Collaborative robots', value_b: 1.2, display: '$1.2B',
      evidence: 'analyst', src: SRC.ia_cobots, year: '2025',
      description: 'Power-and-force-limited arms sold mostly to general industry and SMBs. Interact Analysis: >$1.2B and ~57,000 units in 2025 (+14.5%); China 54.7% of shipments.' },
    { id: 'dest_integration', label: 'Integration, peripherals & software (industrial cells)', short: 'Integration, peripherals & software', value_b: 33.0, display: '$33.0B',
      evidence: 'modeled', src: SRC.ifr_systems3x, year: '2025',
      description: 'Everything around the arm that the buyer also pays for: engineering, programming, end-of-arm tooling, vision, fixtures, guarding, conveyors, controls software, commissioning. IFR (2018 data, its last published estimate): robots-only $16.5B vs ~$50B with software, peripherals and systems engineering (~3x). Integrators: the robot is 25-40% of a cell.',
      note: 'Largest single pool in the river and the least measured. Grand View sizes robotics systems integration at $74.6B (2024) with a broader scope.' },
    { id: 'dest_mobile', label: 'Mobile robots (AMR / AGV)', value_b: 5.8, display: '$5.8B',
      evidence: 'derived', src: SRC.ia_mobile, year: '2025',
      description: 'Autonomous mobile robots and AGVs for warehouses and factories. Interact Analysis: just under $5B in 2024, 19% CAGR to $14B by 2030; AGVs 33% of revenue; China 58% of units but 36% of revenue. IFR: 102,900 logistics service robots in 2024 (+14%).' },
    { id: 'dest_warehouse', label: 'Warehouse automation systems (ASRS, G2P, sortation)', short: 'Warehouse automation systems', value_b: 20.0, display: '$20.0B',
      evidence: 'modeled', src: SRC.logisticsiq, year: '2025',
      description: 'Fixed robotic fulfillment: AS/RS, shuttles, goods-to-person, sorters, robotic palletizing, plus their WES/WCS software. LogisticsIQ: $55B by 2030 at 15% CAGR, which implies ~$24B in 2024 (derived), less mobile robots; Interact: order intake +7% in 2025. ABI cross-check: mobile robots incl. AS/RS $25.9B (2024).',
      note: 'Symbotic FY2025 revenue $2.25B, backlog $22.5B, Walmart 85% of revenue; AutoStore $539M (-10%), ~1,900 systems; Ocado Technology GBP 561M.' },
    { id: 'dest_surgical', label: 'Surgical & medical robots', value_b: 14.7, display: '$14.7B',
      evidence: 'analyst', src: SRC.gvr_surgical, year: '2025',
      description: 'Surgical systems, their instruments and service, plus rehab exoskeletons. Grand View: surgical robots $14.1B in 2025 (accessories 54%); Intuitive Surgical alone $10.06B (instruments & accessories $6.02B, systems $2.47B, service $1.57B); exoskeletons ~$0.6B.' },
    { id: 'dest_drones', label: 'Civil drones (hardware & software)', short: 'Civil drones', value_b: 11.2, display: '$11.2B',
      evidence: 'analyst', src: SRC.dii, year: '2025',
      description: 'Commercial drone hardware ($6.7B) and software ($1.7B) plus recreational drones (~$2.8B, derived as the remainder of DII\'s $40.6B total), per Drone Industry Insights. Drone services ($29.4B of operator revenue) are excluded: they are not robots bought. DJI is private and publishes no revenue.' },
    { id: 'dest_consumer', label: 'Consumer robots (vacuum, mop, mower, pool)', short: 'Consumer robots', value_b: 11.5, display: '$11.5B',
      evidence: 'modeled', src: SRC.idc_cleaning, year: '2025',
      description: 'IDC: 32.7M home cleaning robots shipped in 2025 (+20%): 24.1M vacuums, 2.4M window, 2.0M mowers (+64%). Vendor revenues: Roborock RMB 18.7B (+57%, 5.8M units), Ecovacs RMB 19.0B, Dreame >RMB 40B (incl. non-robot lines), iRobot in Chapter 11, sold to Shenzhen Picea. Modeled at $11.5B from units and vendor revenue.' },
    { id: 'dest_humanoids', label: 'Humanoid robots', value_b: 0.5, display: '$0.5B',
      evidence: 'derived', src: SRC.idc_humanoid, year: '2025',
      description: '13,000-18,000 units shipped in 2025 depending on tracker (Omdia 13,318; Counterpoint ~16,000; IDC ~18,000), >80% from Chinese vendors. Company disclosures: Unitree humanoid revenue RMB 868M on 5,511 units (STAR listing documents), UBTech RMB 821M on 1,079 full-size units, AgiBot >RMB 1.0B total revenue on >5,100 units, Leju RMB 258M on 577 units. Western and other vendors disclose no humanoid revenue figure: Tesla none (Optimus "still in the R&D phase", Q4 2025 call); Figure and Galbot say they have paying customers (BMW pilot; Galbot <150 units shipped in 2025) but publish no number; Apptronik pilots only; 1X no NEO deliveries; Agility $1.8M; Boston Dynamics KRW 151B, all Spot and Stretch, Atlas zero. Disclosed sum ~$0.4B; IDC puts 2025 hardware revenue at ~$440M. Derived at $0.5B including the undisclosed vendors.',
      note: 'Smart Analytics Global forecasts ~$1.6B for 2026 (19,100 units shipped in H1 2026, +272%). Morgan Stanley: China 2026 ~50,000 units, ~$2B. Goldman Sachs (Sep 2026): 6.5M units and $138B by 2035.' },
    { id: 'dest_ag', label: 'Agricultural robots (milking, field)', short: 'Agricultural robots', value_b: 4.2, display: '$4.2B',
      evidence: 'analyst', src: SRC.mm_milking, year: '2025',
      description: 'Milking and barn robots dominate: MarketsandMarkets $3.64B in 2025; Lely alone EUR 1.01B (+18%). Field, weeding and harvesting robots add ~$0.6B (modeled). Agricultural drones (DJI Agras, XAG) are counted under civil drones.' },
    { id: 'dest_defense', label: 'Defense & security robots (UAS, UGV, USV)', short: 'Defense & security robots', value_b: 33.7, display: '$33.7B',
      evidence: 'derived', src: SRC.mm_milrobots, year: '2025',
      description: 'Military and security unmanned systems across air, ground and sea. MarketsandMarkets: military robots $42.2B in 2026 at 25% CAGR, which implies ~$33.7B for 2025; military drones are ~80% of it. Cross-checks: US DoD FY2026 request $13.4B for autonomy plus $3.1B counter-UAS; Ukraine budgeted ~$2.6B for 4.5M FPV drones in 2025 and had received ~2.6M by late December; Anduril 2025 revenue $2.2B.',
      note: 'Analyst scope is broad (includes loitering munitions). Teal-style production estimates run lower. FY2027 US request: >$70B for drones and counter-drone.' },
    { id: 'dest_service', label: 'Commercial service robots (cleaning, delivery, inspection, construction)', short: 'Commercial service robots', value_b: 3.2, display: '$3.2B',
      evidence: 'modeled', src: SRC.ifr_exec_svc, year: '2025',
      description: 'IFR 2024 units: professional cleaning 25,000+ (+34%), hospitality and delivery 42,000+, inspection 2,800, construction +16%; Chinese vendors 85% of commercial service shipments (IDC). Construction robots $1.6B (Grand View). Modeled at $3.2B from units x typical prices.' },
    { id: 'dest_physical_ai', label: 'Physical AI R&D (venture-funded)', short: 'Physical AI R&D (venture-funded)', value_b: 15.0, display: '$15.0B',
      evidence: 'analyst', src: SRC.crunchbase_rob, year: '2025',
      description: 'Capital, not product revenue: venture and strategic money into robotics startups, most of it funding humanoid and foundation-model R&D ahead of meaningful sales (Figure and Galbot have paying customers but disclose no revenue; Tesla, Apptronik and 1X have none yet). Crunchbase (22 Jun 2026): $15B in 2025 (vs $8.2B in 2024), $18.8B in 2026 by mid-June. Figure $39B, Skild $14B, Physical Intelligence >$11B (talks), Apptronik ~$5.5B.',
      note: 'Shown as its own channel so the reader can see that 2025 venture money into robotics roughly equals the entire market for industrial robot arms.' }
  ];

  // =====================================================================
  // LAYER A — WHO PAYS (2025, modeled split of destination totals)
  // Values are computed below from destToBuyerShares.
  // =====================================================================
  var paymentChannels = [
    { id: 'pay_auto', label: 'Automotive (OEMs & suppliers)', short: 'Automotive', role: 'industry', evidence: 'modeled', src: SRC.ifr_exec_ind,
      description: 'Largest single robot buyer by value. IFR 2024: 126,088 installs (23%, -7%); China 57,200 of them. Heaviest cells (welding, painting, body shop) and the earliest humanoid pilots (Hyundai/Boston Dynamics, Tesla, BYD, Mercedes/Apptronik).' },
    { id: 'pay_electronics', label: 'Electronics & semiconductors', short: 'Electronics & semis', role: 'industry', evidence: 'modeled', src: SRC.ifr_exec_ind,
      description: 'Largest buyer by units: 128,899 installs in 2024 (24%), 64% of them in China. SCARA and small six-axis arms at low prices; the 2025 surge in installs came from electronics and data-centre supply chains (IFR).' },
    { id: 'pay_metal', label: 'Metal & machinery', role: 'industry', evidence: 'modeled', src: SRC.ifr_exec_ind,
      description: '88,777 installs in 2024 (16%, +18%): machine tending, welding, grinding. China metal & machinery 54,600 units, 90% supplied domestically. Core cobot buyer.' },
    { id: 'pay_othermfg', label: 'Plastics, chemicals, food & other manufacturing', short: 'Plastics, food & other mfg', role: 'industry', evidence: 'modeled', src: SRC.ifr_exec_ind,
      description: 'Plastics & chemicals 77,752 (+18%), food & beverage 20,792 (+42%), pharma, textiles, wood, plus the "unspecified" 94,155 installs. The fastest-growing general-industry buyers; palletizing, packaging, machine tending.' },
    { id: 'pay_logistics', label: 'Logistics, e-commerce & retail', short: 'Logistics & e-commerce', role: 'industry', evidence: 'modeled', src: SRC.ia_warehouse,
      description: 'Warehouses, parcel hubs, grocery fulfillment and retail distribution. Amazon >1M robots across 300+ sites; Walmart anchors Symbotic\'s $22.5B backlog; non-manufacturing was one-third of US installs in 2025 (+41%).' },
    { id: 'pay_health', label: 'Healthcare & life sciences', short: 'Healthcare', role: 'industry', evidence: 'modeled', src: SRC.isrg_fy25,
      description: 'Hospitals and surgery centres buying and leasing surgical systems and their consumables; labs and pharma distribution buying automation. 872 of 1,721 da Vinci placements in 2025 (51%) were operating leases.' },
    { id: 'pay_households', label: 'Households', role: 'consumer', evidence: 'modeled', src: SRC.idc_cleaning,
      description: 'The only buyer paying retail: 32.7M cleaning robots in 2025 plus recreational drones. Chinese brands hold the top five vacuum slots; 1X NEO ($20,000 or $499/month) and Sunday Memo open the home-humanoid category in late 2026.' },
    { id: 'pay_agri', label: 'Agriculture', role: 'industry', evidence: 'modeled', src: SRC.dji_ag,
      description: 'Dairy farms (milking robots), field crops (weeding, harvesting) and ~400,000 DJI agricultural drones in use at end-2024. IFR: 19,500 agricultural service robots in 2024.' },
    { id: 'pay_defense', label: 'Defense & public safety', short: 'Defense & public safety', role: 'public', evidence: 'modeled', src: SRC.dod_fy26,
      description: 'Ministries of defense, police and civil agencies. US DoD FY2026 request: $13.4B autonomy ($9.4B UAV) + $3.1B counter-UAS; FY2027 request >$70B for drones and counter-drone; Ukraine ~3M FPV drones in 2025 (2.6M delivered by 24 Dec); Europe rearmament (Helsing $18B).' },
    { id: 'pay_infra', label: 'Construction, energy, mining & utilities', short: 'Construction, energy & mining', role: 'industry', evidence: 'modeled', src: SRC.gvr_construction,
      description: 'Inspection drones and crawlers, construction robots ($1.6B), ~3,700+ autonomous haul trucks worldwide (Komatsu 1,000, Caterpillar 690 at end-2024, EACON >2,000). Autonomous trucks themselves are excluded from the river.' },
    { id: 'pay_services', label: 'Hospitality, facilities & other services', short: 'Hospitality & facilities', role: 'industry', evidence: 'modeled', src: SRC.keenon_idc,
      description: 'Restaurants, hotels, airports, facility-management firms and retailers buying delivery, reception and cleaning robots (Keenon, IDC #1 with 22.7% of 2024 shipments; Pudu; Chinese vendors 84.7% of shipments).' },
    { id: 'pay_research', label: 'Research, education & entertainment', short: 'Research & education', role: 'other', evidence: 'modeled', src: SRC.unitree_clar,
      description: 'Universities, labs, showrooms, stage shows and content creators: still the main buyer of humanoids in 2025 (73.6% of Unitree\'s 9M-2025 humanoid sales went to research and education; G1 from $13,500) and of research cobots (Franka).' },
    { id: 'pay_vc', label: 'Venture & strategic capital', short: 'Venture & strategic capital', role: 'capital', evidence: 'analyst', src: SRC.crunchbase_rob,
      description: 'Venture funds, sovereign and corporate strategics (Nvidia, SoftBank, Amazon, Hyundai, Foxconn, Bosch, Qualcomm, national funds in China). $15B into robotics startups in 2025 (Crunchbase); 2026 passed that by June.' }
  ];

  // Share of each destination's spend by buyer (rows sum to 1).
  var destToBuyerShares = {
    dest_arms:        { pay_auto: 0.30, pay_electronics: 0.19, pay_metal: 0.16, pay_othermfg: 0.26, pay_logistics: 0.05, pay_infra: 0.02, pay_research: 0.01, pay_health: 0.01 },
    dest_cobots:      { pay_auto: 0.15, pay_electronics: 0.25, pay_metal: 0.25, pay_othermfg: 0.20, pay_logistics: 0.05, pay_research: 0.06, pay_health: 0.02, pay_services: 0.02 },
    dest_integration: { pay_auto: 0.34, pay_electronics: 0.17, pay_metal: 0.16, pay_othermfg: 0.24, pay_logistics: 0.05, pay_infra: 0.02, pay_health: 0.01, pay_research: 0.01 },
    dest_mobile:      { pay_logistics: 0.62, pay_auto: 0.08, pay_electronics: 0.10, pay_metal: 0.04, pay_othermfg: 0.06, pay_health: 0.04, pay_services: 0.03, pay_infra: 0.03 },
    dest_warehouse:   { pay_logistics: 0.80, pay_othermfg: 0.10, pay_electronics: 0.03, pay_auto: 0.03, pay_health: 0.02, pay_infra: 0.02 },
    dest_surgical:    { pay_health: 1.0 },
    dest_drones:      { pay_households: 0.25, pay_agri: 0.20, pay_infra: 0.25, pay_defense: 0.15, pay_logistics: 0.05, pay_services: 0.07, pay_research: 0.03 },
    dest_consumer:    { pay_households: 1.0 },
    dest_humanoids:   { pay_research: 0.45, pay_auto: 0.20, pay_logistics: 0.15, pay_electronics: 0.12, pay_services: 0.05, pay_defense: 0.03 },
    dest_ag:          { pay_agri: 1.0 },
    dest_defense:     { pay_defense: 1.0 },
    dest_service:     { pay_services: 0.50, pay_infra: 0.35, pay_health: 0.08, pay_logistics: 0.04, pay_research: 0.03 },
    dest_physical_ai: { pay_vc: 1.0 }
  };

  // =====================================================================
  // LAYER C — WHAT THE DOLLARS FUND (cost pools)
  // =====================================================================
  var costPools = [
    { id: 'pool_actuators', label: 'Actuators, motors & drives', short: 'Actuators & motors',
      description: 'Servo motors, frameless torque motors, drives and ESCs, linear actuators. ~21% of an arm\'s price (Interact Analysis, 2022 data); linear plus rotary actuators ~51% of a 2030 humanoid BOM (BofA).',
      leaders: 'Yaskawa (Motion Control JPY 236B), Inovance, Panasonic, Mitsubishi Electric, Siemens, Nidec, Maxon, Kollmorgen; Sanhua and Tuopu in the Tesla chain.' },
    { id: 'pool_reducers', label: 'Precision reducers & transmissions', short: 'Precision reducers',
      description: 'Harmonic (strain-wave) and RV cycloidal gears, planetary and roller screws, cross-roller bearings. ~14% of an industrial robot\'s price, up to 20% for 10-80 kg arms; the oligopoly that humanoid makers are trying to design around.',
      leaders: 'Nabtesco (RV, ~60% world share by its own estimate, precision gears JPY 78.6B), Harmonic Drive Systems (JPY 59.6B), Sumitomo; Leaderdrive / Green Harmonic (30-40% of China harmonic market per J.P. Morgan, revenue +47%, 30-50% cheaper than Japanese incumbents per a16z), Shuanghuan.' },
    { id: 'pool_sensors', label: 'Sensors, vision & LiDAR', short: 'Sensors & vision',
      description: 'Cameras, 3D vision, LiDAR, encoders, force-torque and tactile sensors, EO/IR payloads on drones.',
      leaders: 'Keyence (JPY 1.17T, 51% operating margin, 83% gross margin), Cognex ($994M), SICK, Basler, Renishaw; Hesai (1.62M lidars, robotics units +426%), RoboSense (robotics ~49% of Q4 sales), Ouster; Mech-Mind (22% of AI 3D-vision guidance).' },
    { id: 'pool_compute', label: 'Compute & semiconductors', short: 'Compute & chips',
      description: 'Robot SoCs and GPUs (Jetson Thor at $3,499), flight controllers, MCUs, motor-control and power chips.',
      leaders: 'NVIDIA (Automotive segment, which includes robotics: $2.3B FY2026, +39%), Qualcomm, Horizon Robotics (RMB 3.8B), TI, STMicro, Infineon, Renesas; Hailo, SiMa.ai at the edge.' },
    { id: 'pool_batteries', label: 'Batteries & power',
      description: 'Packs, cells, chargers, hot-swap systems. Small in a humanoid BOM (0.5-4%) but decisive for AMR and drone economics.',
      leaders: 'CATL (Galbot partner), BYD, LG Energy Solution, Samsung SDI, EVE, Panasonic; Amprius for high-density drone cells.' },
    { id: 'pool_structure', label: 'Structure, mechanics & assembly', short: 'Structure & assembly',
      description: 'Castings, machined links, frames, harnesses, racking and conveyors, contract assembly and factory labor. Component procurement is 50-65% of a Chinese OEM\'s ex-factory cost; assembly and test 10-18% (Future Market Insights).',
      leaders: 'Foxconn (Agility, Apptronik via Jabil), Flex; Tesla Fremont line, XPeng IRON line (>80% automated), Guangdong 10,000-unit humanoid plant.' },
    { id: 'pool_eoat', label: 'End effectors, grippers & hands', short: 'End effectors & hands',
      description: 'Grippers, vacuum tooling, welding torches, dexterous hands, surgical instruments. 10-20% of a cobot cell; hands are 17-19% of a humanoid BOM.',
      leaders: 'Schunk, Zimmer, Robotiq, OnRobot, Piab, Festo; Shadow, Sharpa, Inspire, Tesollo; Intuitive instruments ($6.0B).' },
    { id: 'pool_software', label: 'Software, controls & AI models', short: 'Software, controls & AI',
      description: 'Controllers and teach pendants (~12% of an arm), PLC and WES/WCS software, fleet management, navigation, simulation, and the new layer: robot foundation models.',
      leaders: 'FANUC, Siemens, Rockwell, Beckhoff; NVIDIA Isaac/GR00T/Cosmos, Google DeepMind Gemini Robotics 2; Physical Intelligence, Skild, Generalist, Dyna; Amazon DeepFleet.' },
    { id: 'pool_integration', label: 'Integration & engineering labor', short: 'Integration & eng. labor',
      description: 'Cell design, programming, installation, commissioning, safety validation, plus the new data-collection labor (teleop farms). 30-50% of an industrial project; the analog of admin drag in healthcare.',
      leaders: 'Rockwell, Siemens, JR Automation, Bastian, Dematic, Honeywell, SIASUN; ~944 service-robot producers and 333 logistics-robot suppliers (IFR); eight state-backed data-collection centres in China (Xinhua).' },
    { id: 'pool_service', label: 'Service, consumables & spares', short: 'Service & consumables',
      description: 'Service contracts (10-15% of robot price per year), spare reducers and drives, surgical instruments per procedure, vacuum filters and brushes, drone accessories, sustainment.',
      leaders: 'FANUC Service (16.5% of sales), Intuitive instruments & service (75% of revenue), Symbotic recurring software and services.' },
    { id: 'pool_rnd', label: 'R&D',
      description: 'Vendor research and development: 4-6% of sales at FANUC (5.2%), KUKA (5.5%) and Yaskawa (4.4%); 13-14% at Intuitive and Cognex; and nearly all of the venture dollars in early-stage physical AI.',
      leaders: 'Intuitive ($1.31B), NVIDIA, Google DeepMind, Tesla Optimus; Physical Intelligence, Figure, Skild, Apptronik, Agility ($111M 2025 opex).' },
    { id: 'pool_margin', label: 'Vendor margin, SG&A & channel', short: 'Margin, SG&A & channel',
      description: 'Gross margin, sales and distribution, retail channel. Spread is enormous: KUKA EBIT 1.5%, Yaskawa 8.7%, FANUC 21.4%, Intuitive pro forma GM 67.6% (GAAP 66.0%), Keyence 51% operating margin, Unitree 60% gross margin on core businesses.',
      leaders: 'Where the money is retained: FANUC, Keyence, Intuitive, Nabtesco; and where it is not: KUKA, Teradyne Robotics ($308M, restructuring), iRobot (Chapter 11).' }
  ];

  var destToPoolWeights = {
    dest_arms:        { pool_reducers: 0.14, pool_actuators: 0.21, pool_software: 0.10, pool_sensors: 0.03, pool_structure: 0.22, pool_rnd: 0.06, pool_margin: 0.24 },
    dest_cobots:      { pool_reducers: 0.18, pool_actuators: 0.20, pool_sensors: 0.06, pool_software: 0.12, pool_structure: 0.16, pool_rnd: 0.08, pool_margin: 0.20 },
    dest_integration: { pool_integration: 0.42, pool_eoat: 0.14, pool_sensors: 0.09, pool_structure: 0.20, pool_software: 0.07, pool_margin: 0.08 },
    dest_mobile:      { pool_batteries: 0.08, pool_sensors: 0.12, pool_compute: 0.08, pool_actuators: 0.10, pool_structure: 0.17, pool_software: 0.15, pool_integration: 0.10, pool_service: 0.05, pool_rnd: 0.07, pool_margin: 0.08 },
    dest_warehouse:   { pool_structure: 0.35, pool_actuators: 0.10, pool_sensors: 0.05, pool_software: 0.12, pool_integration: 0.22, pool_service: 0.06, pool_compute: 0.03, pool_rnd: 0.03, pool_margin: 0.04 },
    dest_surgical:    { pool_eoat: 0.14, pool_service: 0.08, pool_actuators: 0.03, pool_sensors: 0.04, pool_compute: 0.02, pool_structure: 0.04, pool_rnd: 0.13, pool_margin: 0.52 },
    dest_drones:      { pool_batteries: 0.10, pool_actuators: 0.10, pool_sensors: 0.18, pool_compute: 0.12, pool_structure: 0.15, pool_software: 0.05, pool_service: 0.04, pool_rnd: 0.08, pool_margin: 0.18 },
    dest_consumer:    { pool_actuators: 0.08, pool_batteries: 0.07, pool_sensors: 0.10, pool_compute: 0.07, pool_structure: 0.20, pool_software: 0.05, pool_service: 0.06, pool_rnd: 0.07, pool_margin: 0.30 },
    dest_humanoids:   { pool_actuators: 0.26, pool_reducers: 0.20, pool_eoat: 0.12, pool_sensors: 0.05, pool_compute: 0.08, pool_batteries: 0.03, pool_structure: 0.10, pool_software: 0.06, pool_rnd: 0.05, pool_margin: 0.05 },
    dest_ag:          { pool_actuators: 0.10, pool_sensors: 0.12, pool_compute: 0.04, pool_structure: 0.25, pool_software: 0.06, pool_integration: 0.10, pool_service: 0.15, pool_rnd: 0.06, pool_margin: 0.12 },
    dest_defense:     { pool_structure: 0.22, pool_compute: 0.18, pool_sensors: 0.15, pool_actuators: 0.08, pool_batteries: 0.06, pool_software: 0.08, pool_service: 0.08, pool_rnd: 0.08, pool_margin: 0.07 },
    dest_service:     { pool_actuators: 0.08, pool_batteries: 0.08, pool_sensors: 0.14, pool_compute: 0.08, pool_structure: 0.18, pool_software: 0.12, pool_integration: 0.08, pool_service: 0.08, pool_rnd: 0.08, pool_margin: 0.08 },
    dest_physical_ai: { pool_rnd: 0.45, pool_integration: 0.25, pool_compute: 0.12, pool_actuators: 0.06, pool_structure: 0.04, pool_margin: 0.08 }
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
  // AI SURFACES (overlay)
  // =====================================================================
  var aiSurfaces = [
    { id: 'ai_vla', label: 'Robot foundation models',
      attach_pools: ['pool_software', 'pool_rnd', 'pool_compute'],
      attach_dests: ['dest_humanoids', 'dest_cobots', 'dest_mobile', 'dest_physical_ai', 'dest_integration'],
      what: 'Vision-language-action models that turn pixels and language into motor commands across embodiments. Physical Intelligence pi0.5, Skild ($14B), Generalist Gen 1.5 ($3B), Dyna, Google Gemini Robotics 2 / On-Device 2 (30 Jul 2026: adapts to a new bi-arm robot with fewer than 200 examples), NVIDIA GR00T N1.6.',
      buyer: 'Robot OEMs, integrators and end users buying capability instead of programming hours.',
      adoption: 'No timeline for commercialization at the leaders (Physical Intelligence); the money is R&D, not revenue, in 2025-26. First wedge into the $33B integration pool.',
      dvc: ['Positronic Robotics', 'Rhoda'] },
    { id: 'ai_sim', label: 'Simulation & world models',
      attach_pools: ['pool_software', 'pool_rnd', 'pool_compute'],
      attach_dests: ['dest_physical_ai', 'dest_humanoids'],
      what: 'Physics simulators, world models and synthetic-data pipelines that replace expensive real-world data: NVIDIA Isaac Sim, Omniverse and Cosmos (Predict/Transfer 2.5), Genesis AI, Hillbot, Lightwheel.',
      buyer: 'Every team training a policy; cost shifts from data-collection labor to compute.',
      adoption: 'Sim-to-real gap is the binding constraint; the winners sell the gap-closing tools, not the robots.',
      dvc: ['CARYATID', 'Archetype AI'] },
    { id: 'ai_data', label: 'Teleop & data collection',
      attach_pools: ['pool_integration', 'pool_rnd'],
      attach_dests: ['dest_humanoids', 'dest_physical_ai'],
      what: 'Paid humans in mocap suits and VR generating demonstrations, plus state-backed data factories: Beijing Shijingshan centre (100 humanoids, 12,000 tasks/day; People\'s Daily), Sichuan Zigong centre (15,000 entries/day, a session can cost over 1,000 yuan; Xinhua), Tesla data operators at $25-48/hour, Apptronik Robot Park with DeepMind (Jun 2026).',
      buyer: 'Model builders; in China, provincial governments.',
      adoption: 'A new services sub-market. Whoever owns the data flywheel owns the model; China is industrializing it first.' },
    { id: 'ai_fleet', label: 'Fleet orchestration & RaaS',
      attach_pools: ['pool_software', 'pool_service', 'pool_margin'],
      attach_dests: ['dest_mobile', 'dest_warehouse', 'dest_service'],
      what: 'Cloud software that runs heterogeneous fleets and the subscription pricing that turns capex into opex: Amazon DeepFleet (+10% fleet travel time), Symbotic (77 systems in deployment, Q3 FY2026), Locus (7B picks), Agility RaaS, InOrbit, Formant.',
      buyer: 'Warehouse and facility operators.',
      adoption: 'RaaS fleets grew 31% to >24,500 units in 2024 (IFR), a rounding error in a $155B market, but it is where recurring margin concentrates.',
      dvc: ['Autonomics'] },
    { id: 'ai_vision', label: 'Vision, grasping & picking',
      attach_pools: ['pool_sensors', 'pool_eoat', 'pool_software'],
      attach_dests: ['dest_mobile', 'dest_warehouse', 'dest_integration', 'dest_arms'],
      what: 'AI-guided 3D vision and manipulation for picking, induction, palletizing: Mech-Mind (HK IPO, 22% share of AI 3D-vision guidance), Dexterity ($1.65B), Covariant tech inside Amazon, Amazon Vulcan (touch), Ambi, RightHand, Plus One.',
      buyer: 'Logistics and electronics operators.',
      adoption: 'Closest to measured ROI today: picks per hour, error rates.' },
    { id: 'ai_integration', label: 'Integration copilots',
      attach_pools: ['pool_integration', 'pool_software'],
      attach_dests: ['dest_integration', 'dest_cobots', 'dest_arms'],
      what: 'No-code and AI-assisted programming, simulation-driven cell design, remote commissioning: Standard Bots, Vention, Formic (RaaS integrator), Intrinsic (Alphabet), Abagy (high-mix welding without programming).',
      buyer: 'Integrators and SMB manufacturers who cannot hire robot programmers.',
      adoption: 'Attacks the largest pool in the river ($33B) the way admin AI attacks healthcare admin drag.',
      dvc: ['Abagy', 'RemBrain'] },
    { id: 'ai_surgical', label: 'Surgical autonomy',
      attach_pools: ['pool_sensors', 'pool_software', 'pool_service'],
      attach_dests: ['dest_surgical'],
      what: 'AI-assisted navigation, perception and partial autonomy on top of the installed base: Intuitive (11,710 systems), Medtronic Hugo (FDA urology, Dec 2025), J&J Ottava (FDA de novo, Jul 2026), Moon Surgical ScoPilot (FDA, NVIDIA Holoscan), LEM Surgical.',
      buyer: 'Hospitals, via the incumbent platform.',
      adoption: 'No payer pays more for robotic surgery, so autonomy must cut cost per case, not add price.' },
    { id: 'ai_humanoid', label: 'Humanoid full-stack',
      attach_pools: ['pool_actuators', 'pool_reducers', 'pool_eoat', 'pool_compute'],
      attach_dests: ['dest_humanoids', 'dest_physical_ai'],
      what: 'Vertically integrated body + brain: Figure ($39B), Tesla Optimus (Fremont line, 1M/yr target), Boston Dynamics Atlas (Hyundai >25,000 units), Apptronik, Agility ($2.5B SPAC), 1X, Unitree (IPO Aug 2026, +460% on day one to ~$50B), AgiBot, UBTech, Galbot, XPeng IRON, NEURA.',
      buyer: 'Automotive plants, logistics operators, research labs; households from late 2026.',
      adoption: 'BOM $35-55k today, <$17k by 2030 (BofA); China ships 80-90% of units. Labor unions (Hyundai) and the FCC Covered List are the new gates.' },
    { id: 'ai_actuators', label: 'AI-designed actuators & hands',
      attach_pools: ['pool_actuators', 'pool_reducers', 'pool_eoat', 'pool_structure'],
      attach_dests: ['dest_humanoids'],
      what: 'In-house, sim-optimized actuator and hand programs (Tesla, Figure, Apptronik, 1X) plus low-cost Chinese chains (Leaderdrive / Green Harmonic, 30-50% cheaper per a16z) to escape the reducer oligopoly. Hands: Sharpa 22-DoF, Genesis with Wuji, Shadow.',
      buyer: 'Humanoid OEMs.',
      adoption: 'Actuators are ~half of the humanoid BOM (BofA: 51% by 2030); whoever gets to $100-300 per actuator at volume wins the unit-cost race.' },
    { id: 'ai_defense', label: 'Autonomous defense',
      attach_pools: ['pool_compute', 'pool_software', 'pool_batteries'],
      attach_dests: ['dest_defense', 'dest_drones'],
      what: 'Autonomy stacks and attritable platforms: Anduril ($61B, $2.2B revenue), Shield AI Hivemind ($12.7B; USAF CCA mission-autonomy provider), Helsing HX-2 ($18B), Saronic ($9.25B); Ukraine ~3M FPV drones in 2025.',
      buyer: 'Defense ministries.',
      adoption: 'Procurement is moving from exquisite platforms to software-defined mass; DAWG FY2027 request $54.6B.' },
    { id: 'ai_edge', label: 'Physical-AI compute',
      attach_pools: ['pool_compute'],
      attach_dests: ['dest_humanoids', 'dest_mobile', 'dest_drones', 'dest_defense'],
      what: 'Edge inference silicon and modules: NVIDIA Jetson Thor / T4000, Qualcomm, Horizon Robotics, Hailo, SiMa.ai; Tesla FSD chip in Optimus.',
      buyer: 'Every robot OEM.',
      adoption: 'NVIDIA Automotive segment (incl. robotics) $2.3B (+39%); chips for factory robotics exempted from the Section 232 semiconductor tariff (Jan 2026).',
      dvc: ['AeroSilicon'] }
  ];

  // =====================================================================
  // INCENTIVES / STRUCTURAL FORCES (overlay)
  // =====================================================================
  var incentives = [
    { id: 'inc_labor', label: 'Labor shortage', tone: 'pull',
      attach: ['pay_auto', 'pay_electronics', 'pay_metal', 'pay_othermfg', 'pay_logistics', 'dest_arms', 'dest_cobots', 'dest_humanoids', 'pool_integration'],
      body: 'Missing workers set the price ceiling for robots. US: 3.8M manufacturing jobs to fill 2024-33, 1.9M may go unfilled (Manufacturing Institute). China working-age population fell 6.6M in 2025. Japan: 11M worker shortfall by 2040. Hyundai\'s union insists no robot enters a plant without a labor-management agreement (Jan 2026); the debate uses an industry estimate of ~KRW 200M (~$145k) per Atlas.' },
    { id: 'inc_tariffs', label: 'Tariffs & FCC list', tone: 'friction',
      attach: ['dest_mobile', 'dest_humanoids', 'dest_consumer', 'dest_arms', 'pool_actuators', 'pool_reducers', 'pool_structure'],
      body: 'Section 301 List 1 (2018): 25% on Chinese industrial robots (HTS 8479.50) and servos. Section 232 investigation into robotics and industrial machinery initiated 2 Sep 2025 (Federal Register notice 26 Sep), no proclamation as of Sep 2026. FCC Covered List (DA 26-786, 28 Jul 2026) bars new equipment authorizations for foreign-made humanoid, quadruped and other mobile robots >4.4 lb; stationary industrial arms exempt. iRobot went Chapter 11 and was sold to Shenzhen Picea.' },
    { id: 'inc_china', label: 'China industrial policy', tone: 'pull',
      attach: ['dest_humanoids', 'dest_arms', 'dest_mobile', 'dest_consumer', 'pool_actuators', 'pool_reducers', 'pool_structure', 'pool_margin'],
      body: 'MIIT humanoid guideline (2023): mass-production readiness by 2025. "Embodied AI" entered the Government Work Report in 2025 and the 15th Five-Year Plan; CNY 1T national VC guidance fund over 20 years; Beijing 10B-yuan robotics fund (2023) and Shanghai Pudong 10B-yuan humanoid fund (2024); provinces subsidize up to 30% of project cost (MERICS). Result: 59% of world installs (2025), 55% domestic brand share, >80% of humanoid shipments, harmonic reducers 30-50% cheaper (a16z).' },
    { id: 'inc_expensing', label: '100% expensing', tone: 'pull',
      attach: ['pay_auto', 'pay_metal', 'pay_othermfg', 'dest_arms', 'dest_integration'],
      body: 'OBBBA (4 Jul 2025): permanent 100% bonus depreciation for equipment acquired after 19 Jan 2025, Section 179 limit $2.5M, and 100% expensing of new factories through 2028. Lowers the after-tax price of a cell; the US factory-construction wave creates greenfield automation demand.' },
    { id: 'inc_eu', label: 'EU Machinery Reg & AI Act', tone: 'friction',
      attach: ['dest_arms', 'dest_cobots', 'dest_humanoids', 'pool_software', 'pool_integration'],
      body: 'Machinery Regulation 2023/1230 applies from 20 Jan 2027 (cybersecurity, self-evolving software). AI Act omnibus (May 2026): product-embedded AI obligations deferred to Aug 2028. Adds conformity cost to software and integration; the EU is 10% of installs (60,500 in 2025, -11%) and falling.' },
    { id: 'inc_standards', label: 'ISO 10218:2025', tone: 'friction',
      attach: ['dest_cobots', 'dest_humanoids', 'pool_software', 'pool_integration'],
      body: 'ISO 10218-1/-2:2025 (Feb 2025) absorbed the cobot rules of ISO/TS 15066 and added cybersecurity and new robot classes; adopted in the US as ANSI/A3 R15.06-2025 (Sep 2025). China released its first standards system for humanoids and embodied AI on 28 Feb 2026 (52 standards). Standards decide how much safety validation labor a cell needs.' },
    { id: 'inc_export', label: 'Rare earths & chip controls', tone: 'friction',
      attach: ['pool_actuators', 'pool_compute', 'dest_humanoids', 'dest_drones'],
      body: 'China\'s April 2025 rare-earth magnet licensing delayed Optimus (Musk, Apr 2025); expanded controls in Oct 2025 were suspended for a year after the Trump-Xi meeting, but in November 2025 US magnet imports were still down 11% year on year while EU imports rose 60% (CSIS). China processes ~90% of rare earths. US chip controls shape which compute Chinese OEMs can buy.' },
    { id: 'inc_energy', label: 'Energy costs', tone: 'friction',
      attach: ['pay_auto', 'pay_metal', 'pool_service'],
      body: 'EU industrial electricity in 2025 was roughly double US prices and >50% above China (IEA). Automation-heavy plants follow cheap power; energy is <4% of a humanoid BOM but a large share of plant opex.' },
    { id: 'inc_raas', label: 'RaaS & leasing', tone: 'pull',
      attach: ['dest_mobile', 'dest_humanoids', 'dest_surgical', 'dest_cobots', 'pool_service', 'pool_margin'],
      body: 'Capex becomes opex: 51% of 2025 da Vinci placements were operating leases; 1X NEO at $499/month; Agility >$300M committed multi-year orders; Locus, Formic, GreenBox (Symbotic/SoftBank, >$7.5B commitment). RaaS fleets grew 31% to >24,500 units in 2024 (IFR).' },
    { id: 'inc_reimb', label: 'No robotic-surgery premium', tone: 'friction',
      attach: ['pay_health', 'dest_surgical', 'pool_service', 'pool_margin'],
      body: 'No payer reimburses more for robotic than laparoscopic surgery, yet robotic abdominal cases cost ~$2,000 more and a dV5 lists at $1.8-2.5M. Hospitals buy for surgeon recruitment and volume; procedures still grew 16-18% a year. The razor-blade model (instruments 60% of revenue) is what the hospital actually funds.' },
    { id: 'inc_ecom', label: 'Delivery-speed pressure', tone: 'pull',
      attach: ['pay_logistics', 'dest_mobile', 'dest_warehouse'],
      body: 'Same-day and next-day promises force dense automated fulfillment. Amazon: 1M robots, 75% of orders delivered with robot assistance; Walmart: 400 Symbotic systems; non-automotive was 56% of North American robot units in Q2 2026 (A3).' },
    { id: 'inc_defense', label: 'Attritable-mass doctrine', tone: 'pull',
      attach: ['pay_defense', 'dest_defense', 'dest_drones', 'pool_compute'],
      body: 'Ukraine proved cheap autonomous mass beats exquisite platforms: ~3M FPV drones in 2025 (2.6M delivered by 24 Dec), on a ~$2.6B budget for 4.5M. US: Replicator folded into DAWG, FY2027 request $54.6B (vs $226M in FY2026); Drone Dominance Program 200,000+ small drones by 2027. Europe: Helsing $18B, Quantum Systems.' },
    { id: 'inc_capex', label: 'Capex cycle & rates', tone: 'friction',
      attach: ['pay_auto', 'pay_electronics', 'pay_metal', 'dest_arms'],
      body: 'Robot orders track rates and auto capex: global installs -2% in 2024, +11% in 2025 (IFR World Robotics 2026); US -9% then +12% (38,400 units, now the #2 market ahead of Japan); automotive OEM orders -25% in H1 2026 while semis/electronics were +38% in Q2 2026 (A3). Teradyne Robotics revenue fell to $308M on cautious capital spending.' },
    { id: 'inc_vc', label: 'Physical-AI capital wave', tone: 'pull',
      attach: ['pay_vc', 'dest_physical_ai', 'pool_rnd', 'pool_compute'],
      body: '$15B into robotics startups in 2025 and $18.8B by mid-June 2026 (Crunchbase). Figure $39B, Skild $14B, Physical Intelligence >$11B (talks), NEURA up to $1.4B, Unitree IPO +460% on day one (~$50B). Strategics (Nvidia, SoftBank, Amazon, Foxconn, Hyundai) fund both the model and the factory.' }
  ];

  // =====================================================================
  // COMPANIES (overlay): incumbent vs AI-native per node; dvc flags DVC portfolio
  // =====================================================================
  function co(name, note, extra) { var o = { name: name, note: note }; if (extra) { Object.keys(extra).forEach(function (k) { o[k] = extra[k]; }); } return o; }
  var DVC = { dvc: true };

  var companies = {
    dest_arms: {
      incumbent: [co('FANUC', 'Robot segment JPY 379B, 21% operating margin'), co('ABB Robotics', '$2.3B revenue (2024); agreed sale to SoftBank at $5.375B EV, closing expected H2 2026'), co('Yaskawa', 'Robotics JPY 247B'), co('KUKA (Midea)', 'EUR 3.9B, 1.5% EBIT'), co('Estun / Inovance', 'China share gainers')],
      ai_native: [co('NEURA Robotics', 'up to $1.4B Series C; order book and pipeline >$1B'), co('Standard Bots', 'US-made arms, no-code'), co('Mech-Mind', 'AI 3D vision for arms; HK IPO Sep 2026'), co('Abagy', 'AI co-pilot for high-mix welding without programming', DVC)]
    },
    dest_cobots: {
      incumbent: [co('Universal Robots (Teradyne)', 'Teradyne Robotics $308M in 2025, restructuring'), co('FANUC CRX / Doosan / Techman', ''), co('AUBO / JAKA', 'Chinese price competitors')],
      ai_native: [co('Dyna Robotics', 'DYNA-1 on dual-arm cells; $120M at >$600M'), co('Franka Robotics', 'research cobot; Gemini Robotics 2 partner'), co('Genesis AI', 'full-stack manipulation, ~$3B talks')]
    },
    dest_integration: {
      incumbent: [co('Rockwell / Siemens', ''), co('JR Automation (Hitachi)', ''), co('Bastian (Toyota Industries)', ''), co('Dematic (KION SCS)', 'order intake +39.5% in 2025')],
      ai_native: [co('Formic', 'RaaS integrator for SMB manufacturers'), co('Vention', 'cloud cell design'), co('Intrinsic (Alphabet)', ''), co('Abagy', 'welding cells programmed by AI', DVC), co('RemBrain', 'cloud platform for teaching robots', DVC)]
    },
    dest_mobile: {
      incumbent: [co('Geek+', 'RMB 3.2B (+32%), HK IPO Jul 2025'), co('Locus Robotics', '7 billion picks'), co('MiR (Teradyne)', ''), co('Hikrobot', '')],
      ai_native: [co('Agility Robotics', 'Digit; $2.5B SPAC; GXO, Schaeffler'), co('Dexterity', 'Mech dual-arm mobile; $1.65B'), co('Amazon Robotics', '>1M robots, DeepFleet')]
    },
    dest_warehouse: {
      incumbent: [co('Symbotic', 'FY2025 $2.25B, backlog $22.5B'), co('AutoStore', '$539M (-10%), ~1,900 systems'), co('Ocado', 'Technology Solutions GBP 561M'), co('Exotec / Hai Robotics', '')],
      ai_native: [co('Covariant (in Amazon)', 'RFM licensed, founders hired'), co('Ambi Robotics', '>80 AmbiSort systems installed (2022), Pitney Bowes anchor'), co('Verity', 'drone inventory')]
    },
    dest_surgical: {
      incumbent: [co('Intuitive Surgical', '$10.06B, 11,710 systems'), co('Medtronic Hugo', 'FDA urology Dec 2025'), co('J&J Ottava', 'FDA de novo Jul 2026'), co('Stryker Mako / Zimmer ROSA', '')],
      ai_native: [co('Moon Surgical', 'ScoPilot AI, NVIDIA-backed'), co('LEM Surgical', 'NVIDIA physical-AI partner'), co('Proprio / Activ Surgical', 'intra-op perception')]
    },
    dest_drones: {
      incumbent: [co('DJI', 'private, no published revenue; FCC/NDAA pressure'), co('Parrot / Teledyne FLIR', ''), co('Zipline', 'delivery')],
      ai_native: [co('Skydio', 'autonomous enterprise drones'), co('Quantum Systems', 'EU ISR'), co('Ukrainian producers', '~3M FPV drones delivered in 2025')]
    },
    dest_consumer: {
      incumbent: [co('Roborock', 'RMB 18.7B, 17.7% share'), co('Ecovacs', 'RMB 19.0B'), co('Dreame', '>RMB 40B, IPO prep'), co('iRobot', 'Chapter 11, sold to Picea')],
      ai_native: [co('1X NEO', '$20,000 or $499/month, late 2026'), co('Sunday (Memo)', '$165M at $1.15B'), co('Matic Robots', 'AI floor-cleaning robot with visual perception', DVC)]
    },
    dest_humanoids: {
      incumbent: [co('Tesla Optimus', 'no revenue, "still in the R&D phase" (Jan 2026); Fremont line "later this year"; ramp "quite flat and long"; commercial shipments guided ~2027'), co('Boston Dynamics (Hyundai)', '2025 revenue KRW 151B, all Spot/Stretch, net loss KRW 516B (Hyundai FS); Atlas production began 2026, first units to Hyundai and DeepMind; >25,000 committed for Hyundai/Kia plants'), co('UBTech', '1,079 full-size units, RMB 821M'), co('XPeng IRON', 'line live Sep 2026')],
      ai_native: [co('Figure', '$39B; revenue-generating since Dec 2024 (BMW, Catalyst Brands, third customer Aug 2026), amount undisclosed; 1,000th Figure 03 built Jul 2026'), co('Unitree', 'IPO Aug 2026, +460% on day one to ~$50B; RMB 868M humanoid revenue 2025'), co('AgiBot', '44% of H1 2026 shipments'), co('Apptronik', '~$5.5B (Bloomberg); pilots with Mercedes, GXO, Jabil; no revenue disclosed; Apollo 3 (2027) is the first commercial product'), co('Agility', '$2.5B SPAC'), co('1X', 'NEO deposits only, no customer deliveries confirmed by Sep 2026; EQT "up to 10,000" is non-binding; SoftBank majority-stake talks at ~$6B (Aug 2026)'), co('Galbot', '$3B post-money (Dec 2025); RMB 2.5B raised Mar 2026; <150 units shipped in 2025, orders ~1,000 units / >=RMB 700M; revenue undisclosed'), co('NEURA', 'up to $1.4B Series C; order book and pipeline >$1B')]
    },
    dest_ag: {
      incumbent: [co('Lely', 'EUR 1.01B'), co('DeLaval / GEA', ''), co('John Deere', 'autonomy kits; Apptronik investor'), co('DJI Agras', '~400,000 ag drones in use')],
      ai_native: [co('Carbon Robotics', 'LaserWeeder, $177M raised'), co('Monarch Tractor / Burro / Aigen', '')]
    },
    dest_defense: {
      incumbent: [co('Lockheed / General Dynamics / BAE', ''), co('Rheinmetall / Kratos / L3Harris', ''), co('AeroVironment', '')],
      ai_native: [co('Anduril', '$61B; $2.2B revenue 2025'), co('Shield AI', '$12.7B; USAF CCA mission autonomy'), co('Helsing', '$18B; HX-2'), co('Saronic', '$9.25B; autonomous vessels')]
    },
    dest_service: {
      incumbent: [co('Keenon / Pudu', 'Keenon IDC #1 (22.7% of 2024 shipments); Chinese vendors 84.7%'), co('Brain Corp', 'autonomous floor care'), co('Komatsu / Caterpillar / EACON', '~3,700+ autonomous haul trucks')],
      ai_native: [co('All3', 'robotic platform for heavy construction work', DVC), co('Autonomics', 'fleet orchestration for cleaning robots', DVC), co('Built Robotics', '')]
    },
    dest_physical_ai: {
      incumbent: [co('NVIDIA', 'GR00T, Cosmos, Isaac; 2M robotics developers'), co('Google DeepMind', 'Gemini Robotics 2'), co('Tesla', 'Optimus stack')],
      ai_native: [co('Physical Intelligence', '>$11B talks'), co('Skild AI', '$14B'), co('Generalist', '$3B (Aug 2026, reported)'), co('Positronic Robotics', 'PhAIL benchmark, inference API, data ops', DVC), co('Rhoda (ex-Asimov)', 'robotic intelligence platform', DVC), co('CARYATID', 'physics-grounded world model from video', DVC), co('Archetype AI', 'physical-world foundation model', DVC)]
    },
    pool_actuators: {
      incumbent: [co('Yaskawa / Inovance / Panasonic', ''), co('Nidec / Maxon / Kollmorgen', ''), co('Sanhua / Tuopu', 'Tesla-chain actuators')],
      ai_native: [co('Tesla, Figure, Apptronik, 1X', 'in-house actuators')]
    },
    pool_reducers: {
      incumbent: [co('Nabtesco', '~60% RV share'), co('Harmonic Drive Systems', 'JPY 59.6B'), co('Sumitomo', '')],
      ai_native: [co('Leaderdrive (Green Harmonic)', 'RMB 571M (+47%); 30-40% China share; 30-50% cheaper than Japanese incumbents (a16z); AgiBot, UBTech')]
    },
    pool_sensors: {
      incumbent: [co('Keyence', 'JPY 1.17T'), co('Cognex', '$994M'), co('SICK / Basler', ''), co('Hesai / RoboSense / Ouster', 'lidar')],
      ai_native: [co('Mech-Mind', 'AI 3D vision'), co('Orbbec / Zivid', ''), co('GelSight / Meta Digit', 'tactile'), co('Archetype AI', 'sensor-data foundation model', DVC)]
    },
    pool_compute: {
      incumbent: [co('NVIDIA', 'Jetson Thor $3,499; Automotive segment $2.3B'), co('Qualcomm', ''), co('Horizon Robotics', 'RMB 3.8B'), co('TI / STMicro / Infineon', 'motor control')],
      ai_native: [co('Hailo / SiMa.ai / Tenstorrent', 'edge AI silicon'), co('AeroSilicon', 'algorithm-to-custom-chip in weeks', DVC)]
    },
    pool_batteries: {
      incumbent: [co('CATL', 'Galbot partner'), co('BYD / LGES / Samsung SDI', ''), co('EVE / Panasonic', '')],
      ai_native: [co('Amprius', 'high-density drone cells')]
    },
    pool_structure: {
      incumbent: [co('Foxconn', 'Agility PIPE, manufacturing'), co('Jabil / Flex', ''), co('Guangdong humanoid plant', '10,000 units/yr')],
      ai_native: [co('Machina Labs', 'AI sheet forming'), co('Divergent', 'AI-designed structures')]
    },
    pool_eoat: {
      incumbent: [co('Schunk / Zimmer / Robotiq / OnRobot', ''), co('Intuitive instruments', '$6.0B')],
      ai_native: [co('Sharpa', '22-DoF hand'), co('Shadow / Inspire / Tesollo', ''), co('Genesis AI + Wuji', 'hand + data glove')]
    },
    pool_software: {
      incumbent: [co('FANUC / Siemens / Rockwell / Beckhoff', 'controllers, PLC'), co('NVIDIA Isaac / GR00T', ''), co('Google DeepMind', 'Gemini Robotics 2')],
      ai_native: [co('Physical Intelligence / Skild / Generalist / Dyna', 'VLA models'), co('Intrinsic / Viam / Foxglove', 'tooling'), co('Positronic Robotics', 'inference API', DVC), co('Rhoda', '', DVC), co('CARYATID', 'world model', DVC), co('Autonomics', 'fleet orchestration', DVC), co('RemBrain', '', DVC)]
    },
    pool_integration: {
      incumbent: [co('Rockwell / Siemens / JR Automation / Dematic', ''), co('SIASUN', 'China'), co('Chinese data-collection centres', '8+ cities')],
      ai_native: [co('Formic / Vention / Standard Bots', ''), co('Apptronik Robot Park', 'with DeepMind'), co('Abagy', '', DVC), co('RemBrain', '', DVC)]
    },
    pool_service: {
      incumbent: [co('FANUC Service', '16% of sales'), co('Intuitive', 'instruments + service 75% of revenue'), co('Symbotic', 'recurring software & services')],
      ai_native: [co('Locus / Agility', 'RaaS'), co('Formant / InOrbit', 'fleet ops'), co('Autonomics', '', DVC)]
    },
    pool_rnd: {
      incumbent: [co('Intuitive', '$1.31B, 13%'), co('NVIDIA / Google DeepMind', ''), co('Tesla / Hyundai-BD', '')],
      ai_native: [co('Physical Intelligence', '~80 staff, >$1B raised'), co('Figure / Skild / Apptronik', ''), co('CARYATID', '', DVC), co('Positronic', '', DVC)]
    },
    pool_margin: {
      incumbent: [co('Keyence', '51% operating margin'), co('FANUC', '21%'), co('Intuitive', '67.6% pro forma GM'), co('KUKA', '1.5% EBIT')],
      ai_native: [co('Unitree', '60% GM on core businesses; net profit RMB 278M (RMB 591M ex non-recurring)'), co('UBTech', 'RMB 790M loss'), co('Teradyne Robotics', 'restructuring')]
    }
  };

  // =====================================================================
  // FLOW MICROCOPY (click a flow) — buyer logic, recipient logic, tension, AI wedge
  // =====================================================================
  var flowMicrocopy = {
    'fl_pay_auto__dest_arms': {
      payer: 'Automotive buys the heaviest, most standardized cells: body-in-white welding, painting, press tending. Purchases move with model launches and EV retooling; OEM orders fell 25% in North America in H1 2026 while suppliers kept buying.',
      recipient: 'FANUC, ABB, Yaskawa and KUKA earn their best margins here; Chinese brands hold 31% of China\'s automotive installs and are moving up-market.',
      tension: 'Each new platform re-bids the line; OEMs squeeze arm prices while integration content grows. The arm is 25-40% of what the plant actually pays.',
      wedge: 'Humanoid pilots (Hyundai Atlas, Mercedes/Apptronik, BMW/Figure, BYD) start in automotive because the plant already has the safety culture and the capex line.' },
    'fl_pay_auto__dest_integration': {
      payer: 'For every dollar of arm, the plant pays two more for engineering, tooling, fixtures, guarding and commissioning, mostly to integrators and its own engineers.',
      recipient: 'Integrators and line builders (Dürr, Comau, JR Automation, KUKA Systems) capture the labor-heavy 42% of the cell.',
      tension: 'Integration does not scale with volume the way hardware does; every line is a project. Labor shortages hit here first.',
      wedge: 'Simulation-driven cell design (Isaac, Omniverse), no-code programming and AI welding copilots attack the engineering hours directly.' },
    'fl_pay_electronics__dest_arms': {
      payer: 'Electronics buys the most units at the lowest prices: SCARA and small six-axis arms for assembly, inspection and semiconductor handling. China is 64% of the world\'s electronics installs.',
      recipient: 'Epson, Yamaha, Estun, Inovance and the Chinese SCARA makers; FANUC and Yaskawa at the high end.',
      tension: 'Product cycles are months, not years; robots must be redeployable. Price pressure is brutal and integration content is thin.',
      wedge: 'Generalist manipulation models promise redeployable cells without reprogramming, the electronics buyer\'s central problem.' },
    'fl_pay_logistics__dest_warehouse': {
      payer: 'Retailers and 3PLs buy fulfillment capacity to meet delivery promises: Walmart (400 Symbotic systems), Ocado partners, grocery micro-fulfillment.',
      recipient: 'Symbotic, AutoStore, Dematic (order intake +39.5% in 2025), Ocado, Exotec, Hai Robotics; the structure-heavy (35%) and integration-heavy (22%) end of robotics.',
      tension: 'Multi-year projects with $20B+ backlogs vs. e-commerce volume swings; parcel order intake fell 15% in 2024 while grocery rose 20%.',
      wedge: 'AI in the software layer (orchestration, DeepFleet-style routing) raises throughput of already-installed steel.' },
    'fl_pay_logistics__dest_mobile': {
      payer: 'Warehouses add AMRs incrementally, often as RaaS, to lift picks per hour without rebuilding the building.',
      recipient: 'Geek+, Locus, Hikrobot, MiR; China 58% of units but 36% of revenue (cheaper AGVs).',
      tension: 'Fastest-growing hardware category (19% CAGR) but AGVs commoditize; margin migrates to fleet software.',
      wedge: 'Mobile manipulation (Dexterity Mech, Digit) merges the AMR with the picking arm, the next step up in value per unit.' },
    'fl_pay_health__dest_surgical': {
      payer: 'Hospitals buy or lease surgical systems to attract surgeons and volume; no payer reimburses more for robotic procedures.',
      recipient: 'Intuitive owns 71% of the market and 75% of its revenue is recurring instruments and service.',
      tension: 'The hospital funds a razor-blade model at 66-68% gross margin while each robotic case costs ~$2,000 more than laparoscopic.',
      wedge: 'AI perception and partial autonomy inside the incumbent platform; new entrants (Hugo, Ottava, Moon) compete on floor space and price per case.' },
    'fl_pay_households__dest_consumer': {
      payer: 'The one buyer paying retail, for time saved: 32.7M cleaning robots in 2025, mowers +64%.',
      recipient: 'Chinese brands hold the top five slots; iRobot, the category creator, went bankrupt in Dec 2025.',
      tension: 'Hardware margins go to whoever controls the channel and the BOM; vision and LiDAR are commodities within two years of launch.',
      wedge: 'Home humanoids (1X NEO at $499/month, Sunday Memo) test whether households will pay for general-purpose help.' },
    'fl_pay_defense__dest_defense': {
      payer: 'Defense ministries shifted from exquisite platforms to attritable mass after Ukraine: US FY2027 request >$70B for drones and counter-drone.',
      recipient: 'Primes and the new autonomy companies: Anduril ($2.2B revenue), Shield AI, Helsing, Saronic; Ukrainian producers delivering millions of FPV drones a year.',
      tension: 'Procurement cycles vs. six-month battlefield iteration; budgets are requests until appropriated.',
      wedge: 'Autonomy software and cheap compute define the platform; venture-backed entrants are now valued above many primes.' },
    'fl_pay_agri__dest_ag': {
      payer: 'Dairy farms buy milking robots to replace scarce labor; row-crop farms buy weeding and spraying autonomy.',
      recipient: 'Lely (EUR 1.01B, +18%), DeLaval, GEA; Carbon Robotics, Deere autonomy kits.',
      tension: 'Farm economics are seasonal and financed; service (15% of spend) is the recurring business.',
      wedge: 'Vision-driven weeding (LaserWeeder) and autonomous tractors sell chemical and labor savings, not robots.' },
    'fl_pay_vc__dest_physical_ai': {
      payer: 'Venture and strategic capital funding the model race before revenue: $15B in 2025, $18.8B by 22 Jun 2026 (Crunchbase).',
      recipient: 'Foundation-model labs (Physical Intelligence, Skild, Generalist), humanoid full-stacks (Figure, Apptronik, 1X), and the data-collection economy around them.',
      tension: 'Capital raised now exceeds the entire industrial-arm market; commercialization timelines are undisclosed at the leaders.',
      wedge: 'This is the wedge. The question is which pool it ends up owning: software and controls, or the actuators and reducers underneath.' },
    'fl_pay_research__dest_humanoids': {
      payer: 'Universities, showrooms, event companies and creators bought most 2025 humanoids: 73.6% of Unitree\'s humanoid sales went to research and education (9M-2025 prospectus data), G1 from $13,500.',
      recipient: 'Unitree (5,511 units, RMB 868M, 60% gross margin on core businesses), AgiBot, UBTech.',
      tension: 'Research demand proves manufacturability, not ROI; industrial deployments are still pilots.',
      wedge: 'The installed research base seeds the data and developer ecosystem the models need.' },
    'fl_pay_auto__dest_humanoids': {
      payer: 'Automakers are the first industrial humanoid buyers: Hyundai disclosed >25,000 Atlas units for its own plants (May 2026); Mercedes, BMW, BYD and Tesla run pilots.',
      recipient: 'Boston Dynamics, Figure, Apptronik, UBTech (Walker S2 orders >RMB 800M).',
      tension: 'Unions gate deployment (Hyundai: no robot without a labor-management agreement); unit economics at an estimated ~$145k per robot are not yet proven.',
      wedge: 'Whole-body VLA control (Gemini Robotics 2, Helix) is what turns a pilot into a shift.' },
    'fl_pay_electronics__dest_integration': {
      payer: 'Electronics plants pay for fast, repeatable cell changeovers rather than heavy tooling.',
      recipient: 'Asian integrators and the OEMs\' own engineering teams.',
      tension: 'Short product cycles make integration cost recur every launch.',
      wedge: 'Redeployable, model-driven cells cut the recurring engineering bill.' },
    'fl_pay_metal__dest_cobots': {
      payer: 'Job shops and machine builders buy cobots for machine tending and welding with 10-24 month paybacks.',
      recipient: 'Universal Robots, FANUC CRX, Doosan, and Chinese cobot makers at half the price.',
      tension: 'SMBs lack robot programmers; the cobot is cheap, the deployment is not.',
      wedge: 'No-code programming and AI welding copilots (Abagy) make the SMB deployment viable.' }
  };

  var flowMicrocopyFallback = {
    payer: 'Buyer allocation is modeled from IFR installation shares and category-level sources; click the nodes on either side for the sourced totals.',
    recipient: 'Recipient economics follow the destination category: see the cost-pool split on the right.',
    tension: 'Every modeled flow in this river is constrained to the sourced totals of both nodes.',
    wedge: 'Switch to the AI opportunities view to see which wedges attach to this stream.'
  };

  var sources = [
    { label: 'IFR World Robotics 2025, industrial robots press release (542,076 installs, 2024)', url: SRC.ifr_wr2025 },
    { label: 'IFR World Robotics 2025, executive summary, industrial robots (installs by industry and country)', url: SRC.ifr_exec_ind },
    { label: 'IFR World Robotics 2025, executive summary, service robots (units by application)', url: SRC.ifr_exec_svc },
    { label: 'IFR Top 5 Robotics Trends 2026 ($16.7B robot-only value, 2024)', url: SRC.ifr_trends2026 },
    { label: 'IFR: robots-only $16.5B vs ~$50B installed systems (the 3x rule)', url: SRC.ifr_systems3x },
    { label: 'IFR at Automate 2026: preliminary 2025 installs 621,000 (+15%), superseded by World Robotics 2026', url: SRC.ifr_automate26 },
    { label: 'IFR World Robotics 2026 press release (more than 600,000 installs in 2025, +11%; 5M operational stock)', url: SRC.ifr_wr2026 },
    { label: 'IFR World Robotics 2026, China (354,000 installs, 59% of world; 55% domestic suppliers)', url: SRC.ifr_wr2026_cn },
    { label: 'IFR World Robotics 2026, EU-27 (60,500 installs, -11%; Asia 457,315; Americas 57,044)', url: SRC.ifr_wr2026_eu },
    { label: 'IFR World Robotics 2026, USA (38,400 installs, +12%, ahead of Japan 36,200)', url: SRC.ifr_wr2026_us },
    { label: 'IFR China press release (295,045 installs, 57% domestic share)', url: SRC.ifr_china },
    { label: 'Interact Analysis: industrial robot shipments 2025 (549,555 units, revenue +0.8%)', url: SRC.ia_ind2025 },
    { label: 'Interact Analysis: collaborative robots 2025 (>$1.2B, ~57,000 units)', url: SRC.ia_cobots },
    { label: 'Interact Analysis: mobile robots just under $5B (2024), $14B by 2030', url: SRC.ia_mobile },
    { label: 'Interact Analysis: warehouse automation order intake +7% in 2025', url: SRC.ia_warehouse },
    { label: 'Interact Analysis via Control Engineering: component shares of industrial robot price', url: SRC.ia_components },
    { label: 'LogisticsIQ: warehouse automation $55B by 2030 at 15% CAGR', url: SRC.logisticsiq },
    { label: 'ABI Research: robotics market outlook (mobile incl. AS/RS $25.9B, 2024)', url: SRC.abi },
    { label: 'A3: North American robot orders 2025 (36,766 units, $2.25B)', url: SRC.a3_2025 },
    { label: 'Intuitive Surgical Q4/FY2025 results ($10.06B; instruments $6.02B, systems $2.47B, service $1.57B)', url: SRC.isrg_fy25 },
    { label: 'Grand View Research: surgical robots $14.1B (2025)', url: SRC.gvr_surgical },
    { label: 'Grand View Research: exoskeletons; construction robots $1.6B (2025); systems integration $74.6B (2024)', url: SRC.gvr_si },
    { label: 'Drone Industry Insights: civil drone market $40.6B (2025), hardware $6.7B, software $1.7B, services $29.4B', url: SRC.dii },
    { label: 'IDC: global home cleaning robot market 2025 (32.7M units)', url: SRC.idc_cleaning },
    { label: 'Roborock FY2025 results (RMB 18.7B, +57%)', url: SRC.roborock },
    { label: 'Omdia: 13,318 humanoids shipped in 2025, AgiBot 5,168 (press release); Bloomberg coverage', url: SRC.omdia_pr },
    { label: 'IDC via CGTN: ~18,000 humanoids shipped in 2025, ~$440M hardware revenue', url: SRC.idc_humanoid },
    { label: 'Counterpoint via Robotics & Automation News: ~16,000 humanoid installations in 2025', url: SRC.counterpoint_h },
    { label: 'Unitree STAR Market listing coverage (21st Century Business Herald): 2025 humanoid revenue RMB 868M, 5,511 units', url: SRC.unitree_listing },
    { label: 'Shanghai Stock Exchange: Unitree IPO pricing and listing', url: SRC.unitree_sse },
    { label: 'SCMP: AgiBot 2025 revenue exceeded RMB 1B', url: SRC.agibot_rev },
    { label: 'TMTPost: Leju Robotics IPO filing (RMB 258M revenue, 577 Kuavo units)', url: SRC.leju_filing },
    { label: 'The Robot Report: Agility Robotics 2025 revenue $1.8M (SPAC filing)', url: SRC.agility_rev },
    { label: 'Tesla 10-K FY2025: Optimus "in development", no robotics revenue line', url: SRC.tesla_10k_25 },
    { label: 'Tesla Q4 2025 call transcript: Optimus "still in the R&D phase"', url: SRC.tesla_q4_25_call },
    { label: 'The Robot Report: Figure ships Figure 02 to a paying customer (Dec 2024)', url: SRC.figure_revenue },
    { label: 'Figure: production at BMW (11-month pilot, 30,000+ X3s)', url: SRC.figure_bmw },
    { label: 'Figure: commercial agreement with Catalyst Brands (May 2026)', url: SRC.figure_catalyst },
    { label: '1X: Hayward factory, first customer shipments of NEO planned for 2026', url: SRC.onex_factory },
    { label: '1X and EQT: up to 10,000 humanoids for portfolio companies (non-binding)', url: SRC.onex_eqt },
    { label: 'Hyundai Motor FY2025 audited consolidated statements: HMG Global (Boston Dynamics) sales KRW 151,067M, loss KRW 515,839M', url: SRC.hmc_audit_25 },
    { label: 'Bloter: Boston Dynamics 2025 revenue KRW 150.1B, net loss KRW 528.4B (Glovis filing footnotes)', url: SRC.bd_bloter },
    { label: 'Huxiu: Galbot shipped fewer than 150 units in 2025', url: SRC.galbot_huxiu },
    { label: '21st Century Business Herald: Galbot orders ~1,000 units, >=RMB 700M (Sep 2025)', url: SRC.galbot_orders },
    { label: 'Unitree: clarification regarding 2025 sales data (>5,500 humanoids)', url: SRC.unitree_clar },
    { label: 'Fortune: Unitree IPO debut, +460% to ~$50B close (intraday ~$66B)', url: SRC.unitree_ipo },
    { label: 'UBTech 2025 results (humanoid revenue RMB 821M, 1,079 full-size units, net loss RMB 790M)', url: SRC.ubtech },
    { label: 'Smart Analytics Global: H1 2026 humanoid shipments 19,100', url: SRC.sag_h1_26 },
    { label: 'Morgan Stanley: The Humanoid 100 (Optimus BOM ~$50-60k; actuators ~56%)', url: SRC.ms_humanoid100 },
    { label: 'BofA Institute, Physical AI part 2 (Mar 2026): humanoid BOM $35k (2025) to <$17k (2030), component shares', url: SRC.bofa_humanoid },
    { label: 'Goldman Sachs via 24/7 Wall St: humanoid market $138B, 6.5M units by 2035 (Sep 2026)', url: SRC.gs_humanoid },
    { label: 'Morgan Stanley via TNW: China 2026 humanoid shipments raised to 50,000, ~$2B', url: SRC.ms_china_50k },
    { label: 'CoreMatter: audited humanoid actuator cost per axis (LeJu prospectus)', url: SRC.corematter_bom },
    { label: 'MarketsandMarkets: milking robots $3.64B (2025); Lely FY2025 EUR 1.01B', url: SRC.mm_milking },
    { label: 'MarketsandMarkets: military robots $42.2B (2026); military drones $34.9B (2026)', url: SRC.mm_milrobots },
    { label: 'DefenseScoop: DoD FY2026 autonomy request $13.4B; FY2027 >$70B drones and counter-drone', url: SRC.dod_fy26 },
    { label: 'Kyiv Independent: Ukraine on track for 3M FPV drones in 2025 (2.6M delivered by 24 Dec)', url: SRC.ukraine_fpv },
    { label: 'Kyiv Independent: Ukraine budgets UAH 110B (~$2.6B) for 4.5M FPV drones in 2025', url: SRC.ukraine_budget },
    { label: 'DefenseScoop: Drone Dominance Program (200,000+ small drones by 2027)', url: SRC.drone_dominance },
    { label: 'IDC / Keenon: commercial service robots, Chinese vendors 85% of shipments', url: SRC.keenon_idc },
    { label: 'Integrator benchmarks (AMD Machines): robot = 25-40% of cell; integration 30-50% of project; maintenance 3-8% of system per year', url: SRC.integrator_tco },
    { label: 'Motion Controls Robotics: robot averages 25% of cell cost', url: SRC.integrator_25 },
    { label: 'Standard Bots: service contracts 10-15% of robot price per year', url: SRC.standardbots },
    { label: 'evsint: cobot cell cost split (arm 40-50%, EOAT 10-20%, vision 5-15%)', url: SRC.cobot_cell },
    { label: 'Future Market Insights: Chinese OEM cost stack (components 50-65%, assembly 10-18%)', url: SRC.fmi_china_cost },
    { label: 'a16z: Green Harmonic reducers 30-50% cheaper than Japanese incumbents', url: SRC.a16z_reducers },
    { label: 'Nabtesco FY2025 results (precision reduction gears JPY 78.6B, ~60% share by its own estimate)', url: SRC.nabtesco },
    { label: 'Harmonic Drive Systems FY3/2026 results (JPY 59.6B)', url: SRC.hds },
    { label: 'Leaderdrive 2025 results (RMB 571M, +47%; 30-40% China harmonic share)', url: SRC.leaderdrive },
    { label: 'Yaskawa FY2/2026 results (Motion Control JPY 236B, Robotics JPY 247B)', url: SRC.yaskawa },
    { label: 'FANUC FY3/2026 results (Robot JPY 378.6B, Service 16.5%, OP 21.4%, R&D 5.2%)', url: SRC.fanuc },
    { label: 'ABB to divest Robotics to SoftBank ($5.375B EV; closing expected mid-to-late 2026)', url: SRC.abb_softbank },
    { label: 'KUKA annual report 2025 (EUR 3.9B, 1.5% EBIT)', url: SRC.kuka },
    { label: 'Teradyne FY2025 results (Robotics ~$308M)', url: SRC.teradyne },
    { label: 'Keyence FY3/2026 results (JPY 1.17T, 51.0% OP margin, 83.0% GM)', url: SRC.keyence },
    { label: 'Cognex FY2025 results ($994M)', url: SRC.cognex },
    { label: 'Hesai FY2025 results (1.62M lidars; robotics +426%)', url: SRC.hesai },
    { label: 'RoboSense 2025: robotics ~49% of Q4 product sales', url: SRC.robosense },
    { label: 'NVIDIA FY2026 results (Automotive segment $2.3B, +39%)', url: SRC.nvidia_fy26 },
    { label: 'NVIDIA CES 2026: GR00T N1.6, Cosmos 2.5, Jetson T4000, 2M robotics developers', url: SRC.nvidia_ces26 },
    { label: 'NVIDIA: Jetson AGX Thor developer kit at $3,499', url: SRC.nvidia_thor },
    { label: 'Gasgoo: Horizon Robotics 2025 revenue RMB 3.76B', url: SRC.horizon },
    { label: 'Ouster FY2025 results ($169M)', url: SRC.ouster },
    { label: 'Symbotic Q4/FY2025 results ($2,247M revenue)', url: SRC.symbotic },
    { label: 'Symbotic 10-K FY2025 (backlog ~$22.5B; Walmart ~85% of revenue; GreenBox $7.5B commitment)', url: SRC.symbotic_10k },
    { label: 'Symbotic Q3 FY2026 results ($721M; 77 systems in deployment)', url: SRC.symbotic_q3_26 },
    { label: 'Geek+ 2025 results (RMB 3.171B, +31.6%)', url: SRC.geekplus },
    { label: 'AutoStore Q4 2025 results ($538.6M, -10.4%; ~1,900 systems)', url: SRC.autostore },
    { label: 'Ocado Group FY2025 results (Technology Solutions GBP 561.2M)', url: SRC.ocado },
    { label: 'KION: Supply Chain Solutions (Dematic) order intake +39.5% in 2025', url: SRC.kion_dematic },
    { label: 'Ambi Robotics: >80 AmbiSort systems installed (2022)', url: SRC.ambi },
    { label: 'Amazon: 1 millionth robot and DeepFleet', url: SRC.amazon_1m },
    { label: 'Locus Robotics: 7 billion picks', url: SRC.locus },
    { label: 'GeekWire: Agility Robotics $2.5B SPAC filings', url: SRC.agility_spac },
    { label: 'TechCrunch: Figure Series C at $39B', url: SRC.figure_c },
    { label: 'TechCrunch: Skild AI $1.4B at $14B', url: SRC.skild },
    { label: 'TechCrunch: Physical Intelligence in talks at >$11B; ~80 staff; no commercialization timeline', url: SRC.pi_talks },
    { label: 'Axios: Physical Intelligence $600M at $5.6B (Nov 2025)', url: SRC.pi_axios },
    { label: 'Apptronik: $520M Series A extension, Series A total >$935M (Feb 2026)', url: SRC.apptronik },
    { label: 'Caixin: Galbot $362M at $3B', url: SRC.galbot },
    { label: 'NEURA Robotics: Series C of up to $1.4B; order book and pipeline >$1B', url: SRC.neura },
    { label: 'TechCrunch: Generalist at $3B (Aug 2026, sources)', url: SRC.generalist },
    { label: 'TNW: Genesis AI in talks at ~$3B', url: SRC.genesis_talks },
    { label: 'Bloomberg: Dyna Robotics $120M', url: SRC.dyna },
    { label: 'TechCrunch: Genesis AI full-stack', url: SRC.genesis },
    { label: 'SiliconANGLE: Sunday $165M at $1.15B', url: SRC.sunday },
    { label: 'The Robot Report: 1X NEO pre-orders, $20,000 or $499/month', url: SRC.onex },
    { label: 'Humanoids Daily: SoftBank in talks for majority stake in 1X at ~$6B (Aug 2026)', url: SRC.onex_softbank },
    { label: 'Tesla Q2 2026 earnings call transcript: Optimus Fremont line later this year, ramp "quite flat and long"', url: SRC.tesla_q2_26 },
    { label: 'Teslarati: 1M-unit Optimus line in Fremont (Nov 2025 shareholder meeting)', url: SRC.tesla_1m_line },
    { label: 'A3: Boston Dynamics to begin Atlas production in 2026', url: SRC.hyundai_atlas },
    { label: 'Korea Herald: Hyundai to deploy >25,000 Atlas robots (May 2026)', url: SRC.hyundai_25k },
    { label: 'Seoul Economic Daily: Hyundai union, no robot without labor-management agreement (Jan 2026)', url: SRC.hyundai_union },
    { label: 'The Robot Report: AgiBot rolls out 10,000th humanoid (Mar 2026)', url: SRC.agibot_10k },
    { label: 'Electrek: XPeng IRON production line', url: SRC.xpeng_iron },
    { label: 'Bamboo Works: Mech-Mind HK IPO', url: SRC.mechmind },
    { label: 'Robotics 24/7: Dexterity valued at $1.65B', url: SRC.dexterity },
    { label: 'GeekWire: Amazon-Covariant licensing and hires', url: SRC.covariant },
    { label: 'Crunchbase News (22 Jun 2026): robotics startups raised $18.8B in 2026 vs $15B in 2025', url: SRC.crunchbase_rob },
    { label: 'Crunchbase News (Feb 2026): 2024 robotics funding $8.2B', url: SRC.crunchbase_2024 },
    { label: 'TechSpot: Tesla Optimus data-collection operators, $25.25-48/hour', url: SRC.tesla_dataops },
    { label: 'Xinhua: Sichuan humanoid data-collection centre, 15,000 entries a day, eight centres nationwide', url: SRC.china_datacenters },
    { label: 'People\'s Daily: Beijing Shijingshan humanoid training centre, 100 robots, 12,000 tasks a day', url: SRC.china_shijingshan },
    { label: 'Apptronik: Robot Park with Google DeepMind (Jun 2026)', url: SRC.apptronik_park },
    { label: 'Google DeepMind: Gemini Robotics 2, ER 2 and On-Device 2 (30 Jul 2026)', url: SRC.deepmind_gr2 },
    { label: 'Manufacturing Institute / Deloitte: 3.8M manufacturing jobs needed by 2033, 1.9M may go unfilled', url: SRC.mfg_institute },
    { label: 'Recruit Works Institute: Japan faces an 11M worker shortfall by 2040', url: SRC.recruit_japan },
    { label: 'NBS China: 2025 population release (16-59 cohort 851.36M)', url: SRC.nbs_china },
    { label: 'Federal Register (2018): Section 301 List 1 incl. HTS 8479.50 industrial robots at 25%', url: SRC.s301_robots },
    { label: 'Federal Register: Section 232 investigation of robotics and industrial machinery (notice 26 Sep 2025)', url: SRC.s232_robotics },
    { label: 'BIS: Section 232 investigations status', url: SRC.s232_status },
    { label: 'White & Case: Section 232 semiconductor tariff exempts chips for factory robotics (Jan 2026)', url: SRC.s232_chips },
    { label: 'FCC Public Notice DA 26-786: foreign-produced advanced robotic devices added to the Covered List (28 Jul 2026)', url: SRC.fcc_covered },
    { label: 'IFR statement on the FCC restrictions (7 Aug 2026)', url: SRC.fcc_ifr },
    { label: 'BDO: OBBBA expands 100% depreciation and expensing', url: SRC.obbba },
    { label: 'Gibson Dunn: EU AI Act omnibus agreement, postponed high-risk deadlines', url: SRC.eu_ai_act },
    { label: 'EU-OSHA: Machinery Regulation (EU) 2023/1230 applies from 20 Jan 2027', url: SRC.eu_machinery },
    { label: 'The Robot Report: ISO 10218:2025 overhaul', url: SRC.iso10218 },
    { label: 'A3: ANSI/A3 R15.06-2025 published', url: SRC.r1506 },
    { label: 'Xinhua: China\'s first standards system for humanoid robots and embodied AI', url: SRC.china_standards },
    { label: 'CSIS: rare-earth export restrictions one year later', url: SRC.rare_earth },
    { label: 'Tom\'s Hardware: Musk says Optimus delayed by rare-earth magnet licensing (Apr 2025)', url: SRC.musk_magnets },
    { label: 'MERICS: Embodied AI, China\'s path to transform its robotics industry (Apr 2026)', url: SRC.merics_china },
    { label: 'The Robot Report: MIIT humanoid guideline, mass production by 2025', url: SRC.miit_2023 },
    { label: 'The Robot Report: Beijing announces $1.4B robotics fund', url: SRC.beijing_fund },
    { label: 'TechCrunch: Anduril raises $5B at $61B; 2025 revenue $2.2B', url: SRC.anduril },
    { label: 'Shield AI: $2B at $12.7B valuation; Aechelon acquisition', url: SRC.shield },
    { label: 'Defense News: Helsing raises $1.8B at $18B', url: SRC.helsing },
    { label: 'Saronic: $1.75B Series D at $9.25B', url: SRC.saronic },
    { label: 'Moon Surgical: FDA clearance for ScoPilot on Maestro (NVIDIA Holoscan)', url: SRC.moon },
    { label: 'Johnson & Johnson: FDA De Novo authorization for Ottava (22 Jul 2026)', url: SRC.ottava },
    { label: 'Medtronic: FDA clearance of Hugo for urologic procedures (3 Dec 2025)', url: SRC.hugo },
    { label: 'ACS Bulletin (Feb 2026): cost of robotic surgery', url: SRC.acs_robotic },
    { label: 'Intuitive preliminary FY2025: 1,721 placements, 872 under operating lease', url: SRC.isrg_prelim25 },
    { label: 'Intuitive Q2 2026 results ($2.89B; installed base 11,710)', url: SRC.isrg_q2_26 },
    { label: 'The Robot Report: A3 Q2 2026 orders (56% non-automotive)', url: SRC.a3_q2_26 },
    { label: 'iRobot completes transaction with Picea (Jan 2026)', url: SRC.irobot_picea },
    { label: 'People.cn: Ecovacs 2025 revenue RMB 19.04B', url: SRC.ecovacs },
    { label: 'Caixin: Dreame 2025 revenue >RMB 40B (company claim)', url: SRC.dreame },
    { label: 'International Mining: Komatsu commissions 1,000th autonomous truck (Apr 2026)', url: SRC.komatsu_1000 },
    { label: 'GeekWire: Carbon Robotics total funding $177M', url: SRC.carbon },
    { label: 'IEA Electricity 2026, prices chapter: EU industrial power roughly double US, >50% above China', url: SRC.iea_elec },
    { label: 'IFR: government robotics R&D programs 2025', url: SRC.ifr_govt_rd },
    { label: 'DVC portfolio (VentureOS) for the DVC-only toggle', url: SRC.dvc_portfolio }
  ];

  var method = [
    'Base year is 2025. Where a category has only a 2024 official figure (IFR robot value), it is carried forward with the analyst growth rate for 2025 and flagged.',
    'Destination totals (middle column) are the anchors: official statistics, company filings or named analyst estimates. Tags: official, filing, analyst, derived (arithmetic on a sourced figure), modeled (our estimate constrained to sourced units or benchmarks).',
    'Buyer split (left column) is modeled from IFR installation shares by industry (value-weighted: automotive x1.3, electronics x0.8) and category-level buyer evidence; buyer totals are column sums, not independent statistics.',
    'Cost pools (right column) decompose each destination with published BOM and project benchmarks: Interact Analysis component shares of arm price; integrator cell breakdowns; Morgan Stanley and BofA humanoid BOMs; Intuitive segment mix and margins; DII drone value chain.',
    'Excluded: drone services ($29.4B operator revenue), autonomous vehicles and trucks, mining haulage, pure software licences without a robot, and public research budgets. Venture capital is shown as a separate capital channel, not revenue.',
    'Definitions differ across sources by 3-5x (robot-only vs installed system). The river uses robot-only for arms and a separate modeled node for everything the buyer pays around the arm.',
    'Audited 17 Sep 2026: every citation was re-fetched; figures that could not be traced to an accessible publication were removed (see audit log).'
  ];

  var auditLog = [
    { date: '2026-09-30', change: 'IFR World Robotics 2026 (24 Sep 2026) applied: 2025 industrial installs more than 600,000 (+11%), replacing the preliminary 621,000 (+15%); China 354,000 = 59% (was 54% of 2024), domestic suppliers 55% (was 57%); EU 60,500 (-11%), about 10% of installs; US 38,400 (+12%). The 2024 base (542,076) is unchanged. No 2025 robot-only value was published, so $16.7B (2024) stays.' },
    { date: '2026-09-17', change: 'Humanoid robots: $0.6B (modeled) revised to $0.5B (derived) after a bottom-up from listing documents and annual results: Unitree RMB 868M, UBTech RMB 821M, AgiBot >RMB 1.0B (humanoid share undisclosed), Leju RMB 258M; Western vendors disclose no humanoid revenue (Agility $1.8M). IDC prints ~$440M for 2025 hardware revenue.' },
    { date: '2026-09-17', change: 'Removed as unverifiable: strain-wave gears in >95% of cobot axes; analyst robot-vacuum market ($7B); DJI leaked RMB 80B revenue; ~$3B RaaS market; Symbotic 56 operational systems; Ukraine >8M FPV/yr capacity and >160 producers; NEURA ~$7B valuation; Beijing 100B-yuan future-industries fund; $235B US factory-construction peak; Chinese reducers 20-30% cheaper (replaced with a16z 30-50%).' },
    { date: '2026-09-17', change: 'Corrected: Section 301 tariff on robots is List 1 (2018), not List 3; Section 232 robotics investigation initiated 2 Sep 2025 (notice 26 Sep); Gemini Robotics 2 dated 30 Jul 2026; CSIS magnet-import figures are Nov 2025 y/y; China humanoid standards system released 28 Feb 2026; ANSI/A3 R15.06-2025 already published; Ukraine 2025: ~3M FPV drones (2.6M delivered by 24 Dec) on a $2.6B budget for 4.5M.' },
    { date: '2026-09-17', change: 'Corrected company facts: Unitree day-one close +460% (~$50B; $66B was intraday) and net profit RMB 278M (RMB 591M ex non-recurring); 1X now in SoftBank majority-stake talks at ~$6B; Galbot $3B is the Dec 2025 post-money; Apptronik ~$5.5B (Bloomberg); Hyundai 25,000 Atlas disclosed May 2026; Tesla 1M/yr line target dates from Nov 2025; Dematic order intake +39.5%; AutoStore ~1,900 systems; Keyence GM 83.0%; FANUC service 16.5%; Intuitive GM 67.6% is pro forma (GAAP 66.0%), instruments + service 75%; ABB Robotics sale to SoftBank agreed, not closed; Leaderdrive and Green Harmonic are the same company; Keenon (not Pudu) is IDC #1.' },
    { date: '2026-09-17', change: 'Humanoid vendors re-checked one by one: Tesla no Optimus revenue (10-K "in development"; "R&D phase" on the Q4 2025 call); Figure revenue-generating since Dec 2024 but no figure; Apptronik pilots only, Apollo 3 (2027) first commercial product; 1X no NEO deliveries confirmed, EQT deal non-binding; Boston Dynamics 2025 revenue KRW 151B is Spot/Stretch with Atlas at zero (Hyundai audited FS); Galbot <150 units shipped in 2025, orders ~1,000 units. "Western vendors are pre-revenue" reworded; $0.5B derived total unchanged (the undisclosed vendors sit inside the allowed tail).' },
    { date: '2026-09-17', change: 'Citations: 22 placeholder URLs replaced with the primary page (regulator notices, company releases, law-firm alerts); paywalled CNBC/Bloomberg links swapped for accessible equivalents.' }
  ];

  root.ROBOTICS_DATA = {
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
