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
      foot: 'Historical 2025 illustrative spending model, not an observed 2026 market total. Named source scopes differ. Buyer splits and cost-pool decomposition are modeled and constrained to destination totals. Official IFR unit statistics are updated separately to World Robotics 2026. October 16 evidence cut; see Method and Audit log for vintages and limitations.'
    });
    window.MoneyRiver.mount(document.getElementById('industrial-river'), window.INDUSTRIAL_DATA, {
      ariaLabel: 'Industrial money river: operator verticals, spend categories, and cost pools',
      colSubs: ['modeled from vendor order mixes', 'sourced and derived totals', 'margin structures in the filings'],
      legend: [['b', 'Operator vertical (buyer)'], ['t', 'Spend category'], ['g', 'Cost pool']],
      companiesNote: 'Companies stay off the river. Click a spend category or cost pool for incumbents vs AI-native; click a vertical for operators and their corporate-venture programmes. DVC portfolio marked.',
      foot: 'Historical 2025 illustrative category model with ranges, not an official spending census. Buyer split and cost-pool decomposition are modeled, not measured category margins. Operating surveys, safety statistics and acquisition status have separate disclosure dates. October 16 evidence cut; see Method and Audit log for vintages and limitations.'
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
