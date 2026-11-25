/* Mounts the robotics and industrial Money Rivers (money-river.js). */
(function () {
  'use strict';
  function init() {
    if (!window.MoneyRiver) return;
    window.MoneyRiver.mount(document.getElementById('robotics-river'), window.ROBOTICS_DATA, {
      ariaLabel: 'Robotics money river: buyers, robot categories, and cost pools',
      colSubs: ['modeled from installation shares', 'sourced totals', 'BOM and project benchmarks'],
      legend: [['b', 'Industry buyer'], ['o', 'Households (retail money)'], ['p', 'Venture capital (not revenue)'], ['t', 'Robot category'], ['g', 'Cost pool']],
      companiesNote: 'Companies stay off the river. Click any node for incumbents vs AI-native; DVC portfolio marked.',
      foot: 'Base year 2025. Destination totals from IFR, company filings, Interact Analysis, DII, IDC, Grand View, MarketsandMarkets. Buyer split and cost-pool decomposition are modeled for explanation and constrained to those totals. IFR World Robotics 2026 (24 Sep 2026) restates the 2025 industrial figures. Facts and citations audited 17 Sep 2026.'
    });
    window.MoneyRiver.mount(document.getElementById('industrial-river'), window.INDUSTRIAL_DATA, {
      ariaLabel: 'Industrial money river: operator verticals, spend categories, and cost pools',
      colSubs: ['modeled from vendor order mixes', 'sourced and derived totals', 'margin structures in the filings'],
      legend: [['b', 'Operator vertical (buyer)'], ['t', 'Spend category'], ['g', 'Cost pool']],
      companiesNote: 'Companies stay off the river. Click a spend category or cost pool for incumbents vs AI-native; click a vertical for operators and their corporate-venture programmes. DVC portfolio marked.',
      foot: 'Base year 2025. Category totals reconciled from Grand View, MarketsandMarkets, Interact Analysis, Verdantix, Mordor, Frost &amp; Sullivan, IFR and the annual reports of Siemens, ABB, Schneider, Emerson, Rockwell, Honeywell, Yokogawa, Endress+Hauser, MSA, Draeger and 3M. Buyer split and cost-pool decomposition are modeled for explanation and constrained to those totals. Cost-of-the-problem figures from NSC, BLS, ILO, EU-OSHA, NCCI, Marsh, ICMM and Siemens. Facts and citations audited 30 Sep 2026.'
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
