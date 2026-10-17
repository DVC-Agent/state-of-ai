(function() {
  'use strict';

  /* ================================================
     SECTION 8: PHYSICAL AI — INTERACTIVITY
     ================================================ */

  let fsdChartInstance = null;

  function initPhysicalAI() {
    initAVCardExpansion();
    initTreemapTooltips();
    initScrollAnimations();
  }

  /* --- AV Card Expand/Collapse --- */
  function initAVCardExpansion() {
    const avCards = document.querySelectorAll('.pai-av-card');
    avCards.forEach(card => {
      card.addEventListener('click', function() {
        const wasExpanded = this.classList.contains('expanded');
        // Collapse all first
        avCards.forEach(c => c.classList.remove('expanded'));
        // Toggle clicked
        if (!wasExpanded) {
          this.classList.add('expanded');
        }
      });
    });
  }

  /* --- Treemap Tooltips --- */
  function initTreemapTooltips() {
    const cells = document.querySelectorAll('.pai-treemap-cell');
    const tooltip = document.getElementById('pai-treemap-tooltip');
    if (!tooltip) return;

    cells.forEach(cell => {
      cell.addEventListener('mouseenter', function(e) {
        const detail = this.getAttribute('data-detail');
        const sector = this.getAttribute('data-sector');
        if (detail) {
          tooltip.innerHTML = '<strong style="color:#fff;display:block;margin-bottom:4px">' + sector + '</strong>' + detail;
          tooltip.classList.add('visible');
        }
      });

      cell.addEventListener('mousemove', function(e) {
        tooltip.style.left = (e.clientX + 14) + 'px';
        tooltip.style.top = (e.clientY - 10) + 'px';
      });

      cell.addEventListener('mouseleave', function() {
        tooltip.classList.remove('visible');
      });
    });
  }

  /* --- FSD Miles Chart (Chart.js) --- */
  function initFSDChart() { window.VISUAL_CHARTS.initPhysicalChart(); }

  function animateEconBars() {
    const rows = document.querySelectorAll('.pai-econ-row');
    rows.forEach(row => {
      const val = parseFloat(row.getAttribute('data-value'));
      const max = parseFloat(row.getAttribute('data-max'));
      const bar = row.querySelector('.pai-econ-bar');
      if (bar && val && max) {
        const pct = (val / max) * 100;
        bar.style.width = Math.min(pct, 100) + '%';
      }
    });
  }

  /* --- Shipment Bar Animation --- */
  function animateShipmentBar() {
    const fills = document.querySelectorAll('.pai-shipment-fill');
    fills.forEach(fill => {
      const w = fill.getAttribute('data-width');
      if (w) {
        fill.style.width = w + '%';
      }
    });
  }

  /* --- Scroll-triggered Animations --- */
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;

          // Trigger chart when visible
          if (el.querySelector('#pai-fsd-chart')) {
            initFSDChart();
          }

          // Trigger econ bars
          if (el.querySelector('#pai-econ-bars') || el.classList.contains('pai-econ-block')) {
            setTimeout(animateEconBars, 300);
          }

          // Trigger shipment bar
          if (el.classList.contains('pai-shipment-bar') || el.querySelector('.pai-shipment-bar')) {
            setTimeout(animateShipmentBar, 300);
          }
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe the chart block
    const chartBlock = document.querySelector('.pai-chart-block');
    if (chartBlock) observer.observe(chartBlock);

    // Observe econ block
    const econBlock = document.querySelector('.pai-econ-block');
    if (econBlock) observer.observe(econBlock);

    // Observe shipment bar
    const shipBar = document.querySelector('.pai-shipment-bar');
    if (shipBar) observer.observe(shipBar);
  }

  /* --- Init on DOM Ready --- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPhysicalAI);
  } else {
    initPhysicalAI();
  }
})();
