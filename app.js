/* ====================================
   DVC STATE OF AI — APP.JS
   All interactivity, animations, charts
   ==================================== */

(function () {
  'use strict';

  // --- PARTICLE CANVAS ---
  function initParticles(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;
    let width, height;

    const COLORS = ['#4BB5AB', '#7DB6EA', '#FFD720', '#8CC0EE', '#A0A8BC'];
    const PARTICLE_COUNT = Math.min(80, Math.floor(window.innerWidth / 15));
    const CONNECTION_DIST = 140;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
    }

    function createParticle() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: Math.random() * 0.5 + 0.3,
      };
    }

    function init() {
      resize();
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle());
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
            ctx.strokeStyle = `rgba(75,181,171, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Particles
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    function update() {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }
    }

    function animate() {
      update();
      draw();
      animId = requestAnimationFrame(animate);
    }

    init();
    if (!reducedMotion) {
      animate();
    } else {
      draw();
    }

    window.addEventListener('resize', () => {
      resize();
      if (reducedMotion) draw();
    });
  }

  // --- INTERSECTION OBSERVER FOR ANIMATIONS ---
  function initScrollAnimations() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (reducedMotion) {
              entry.target.style.transition = 'none';
            }
            entry.target.classList.add('visible');
            // Don't unobserve — allows re-triggering if needed
            // But for performance, unobserve once shown
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    document.querySelectorAll('.anim-fade, .anim-slide-up').forEach((el) => {
      observer.observe(el);
    });
  }

  // --- NUMBER COUNTER ANIMATION ---
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseFloat(el.dataset.target);
            const prefix = el.dataset.prefix || '';
            const suffix = el.dataset.suffix || '';
            const duration = reducedMotion ? 0 : 1500;
            const start = performance.now();

            if (duration === 0) {
              el.textContent = prefix + target + suffix;
              observer.unobserve(el);
              return;
            }

            function animate(now) {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = target * eased;

              // Format number
              const formatted = target % 1 !== 0
                ? current.toFixed(1)
                : Math.floor(current).toString();

              el.textContent = prefix + formatted + suffix;

              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                el.textContent = prefix + target + suffix;
              }
            }

            requestAnimationFrame(animate);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );

    counters.forEach((c) => observer.observe(c));
  }

  // --- SCROLL PROGRESS BAR ---
  function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;

    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = progress + '%';
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  // --- SIDEBAR NAVIGATION ---
  function initSidebar() {
    const dots = document.querySelectorAll('.nav-dot');
    const sections = [];

    dots.forEach((dot) => {
      const idx = dot.dataset.section;
      const sec = document.getElementById('sec-' + idx);
      if (sec) sections.push({ dot, sec, idx });

      dot.addEventListener('click', () => {
        if (sec) {
          sec.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    function updateActive() {
      const scrollY = window.scrollY + window.innerHeight / 3;

      let activeIdx = sections.length ? sections[0].idx : null;
      for (const s of sections) {
        if (scrollY >= s.sec.offsetTop) {
          activeIdx = s.idx;
        }
      }

      dots.forEach((d) => {
        d.classList.toggle('active', d.dataset.section === activeIdx);
      });
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
  }

  // --- KEYBOARD NAVIGATION ---
  function initKeyboard() {
    const sectionEls = document.querySelectorAll('#sec-0, .visual-chapter, #sec-15');
    let currentSection = 0;

    function getCurrentSection() {
      const scrollY = window.scrollY + window.innerHeight / 2;
      for (let i = sectionEls.length - 1; i >= 0; i--) {
        if (scrollY >= sectionEls[i].offsetTop) {
          return i;
        }
      }
      return 0;
    }

    document.addEventListener('keydown', (e) => {
      if (e.target.closest('input,textarea,select,button,[contenteditable]')) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        currentSection = Math.min(getCurrentSection() + 1, sectionEls.length - 1);
        sectionEls[currentSection].scrollIntoView({ behavior: 'smooth' });
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        currentSection = Math.max(getCurrentSection() - 1, 0);
        sectionEls[currentSection].scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // --- CHARTS (Chart.js) ---
  function initCharts() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Chart.js global defaults
    if (typeof Chart !== 'undefined') {
      Chart.defaults.color = '#A0A8BC';
      Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
      Chart.defaults.font.family = "'Stabil Grotesk', sans-serif";
      Chart.defaults.animation.duration = reducedMotion ? 0 : 1200;
    }

    // 1. Reasoning Model Usage Chart
    initReasoningChart();
    // 2. Hyperscaler Capex Chart
    initCapexChart();
    // 2b. FCF Ring animations
    initFCFRings();
    // 3. Energy Chart
    initEnergyChart();
  }

  function initReasoningChart() { window.VISUAL_CHARTS.initReasoningChart(); }

  function initCapexChart() { window.VISUAL_CHARTS.initCapexChart(); }

  function initFCFRings() {
    const rings = document.querySelectorAll('.fcf-ring');
    if (!rings.length) return;

    rings.forEach((canvas) => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            animateRing(canvas);
            observer.unobserve(canvas);
          }
        },
        { threshold: 0.5 }
      );
      observer.observe(canvas);
    });

    function animateRing(canvas) {
      const pct = parseInt(canvas.dataset.pct) || 0;
      const color = canvas.dataset.color || '#F4B6A9';
      const ctx = canvas.getContext('2d');
      const size = 64;
      canvas.width = size * 2;
      canvas.height = size * 2;
      canvas.style.width = size + 'px';
      canvas.style.height = size + 'px';
      ctx.scale(2, 2);
      const cx = size / 2, cy = size / 2, r = 24, lw = 5;
      let progress = 0;
      const target = Math.min(pct / 100, 1); // Cap visual arc at full circle

      function draw() {
        ctx.clearRect(0, 0, size, size);
        // Background ring
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = lw;
        ctx.stroke();
        // Progress arc
        ctx.beginPath();
        ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(progress, 1));
        ctx.strokeStyle = color;
        ctx.lineWidth = lw;
        ctx.lineCap = 'round';
        ctx.stroke();
        // Center text
        ctx.fillStyle = '#E8ECF2';
        ctx.font = '600 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        var displayPct;
        if (pct > 100) {
          // FCF went negative (e.g. Amazon: positive FCF → negative)
          displayPct = '-' + pct + '%';
          ctx.font = '600 9px Inter, sans-serif';
        } else {
          displayPct = (canvas.dataset.prefix || '') + Math.round(progress * 100) + '%';
        }
        ctx.fillText(displayPct, cx, cy);

        if (progress < target) {
          progress = Math.min(progress + 0.02, target);
          requestAnimationFrame(draw);
        }
      }
      draw();
    }
  }

  function initEnergyChart() { window.VISUAL_CHARTS.initEnergyChart(); }

  function initMoneyFlow() {
    const section = document.querySelector('.section--money-flow');
    if (!section) return;

    // Layer expand/collapse
    const layers = section.querySelectorAll('.mf-layer');
    const interactHint = document.getElementById('interactHint');
    layers.forEach((layer) => {
      const header = layer.querySelector('.mf-layer-header');
      if (!header) return;
      header.addEventListener('click', () => {
        // Dismiss the interaction hint on first click
        if (interactHint && !interactHint.classList.contains('dismissed')) {
          interactHint.classList.add('dismissed');
        }
        const wasExpanded = layer.classList.contains('expanded');
        layers.forEach((l) => l.classList.remove('expanded'));
        if (!wasExpanded) {
          layer.classList.add('expanded');
          // Scroll expanded layer into view within the sticky container
          setTimeout(() => {
            const container = section.querySelector('.money-flow-container');
            if (container) {
              const layerTop = layer.offsetTop - container.offsetTop;
              const containerScroll = container.scrollTop;
              const containerHeight = container.clientHeight;
              const layerBottom = layerTop + layer.offsetHeight;
              // If expanded layer's bottom goes below visible area, scroll down
              if (layerBottom > containerScroll + containerHeight) {
                container.scrollTo({ top: Math.max(0, layerTop - 60), behavior: 'smooth' });
              }
            }
          }, 100);
        }
      });
    });

    // Depreciation toggle
    const depData = {
      4: { dep: '$75K', profit: '$30K', margin: '20.0%', breakeven: '~80%' },
      5: { dep: '$60K', profit: '$45K', margin: '30.0%', breakeven: '~70%' },
      6: { dep: '$50K', profit: '$55K', margin: '36.7%', breakeven: '~63%' },
    };

    const depBtns = section.querySelectorAll('.mf-dep-btn');
    depBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        depBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const years = parseInt(btn.dataset.dep);
        const d = depData[years];
        if (!d) return;
        const depEl = document.getElementById('depDepreciation');
        const profEl = document.getElementById('depProfit');
        const margEl = document.getElementById('depMargin');
        const brkEl = document.getElementById('depBreakeven');
        if (depEl) depEl.textContent = d.dep;
        if (profEl) profEl.textContent = d.profit;
        if (margEl) margEl.textContent = d.margin;
        if (brkEl) brkEl.textContent = d.breakeven;
      });
    });

    // ═══ SCROLL-DRIVEN YEAR PROGRESSION — APPLE-QUALITY ═══
    if (section.querySelector('[data-lenses]')) return;

    const yearBtns = section.querySelectorAll('.mf-year-toggle .mf-toggle-btn');
    const yearToggle = section.querySelector('.mf-year-toggle');
    const yearSequence = ['2024', '2025', '2026'];
    let currentYearIdx = 0;
    let autoScrollActive = true;
    let marginsRevealed = false;
    let isTransitioning = false;

    // New DOM references
    const progressFill = document.getElementById('mfProgressFill');
    const yearEpoch = null; // removed — no more background year
    const scrollHint = document.getElementById('mfScrollHint');

    // Hide margins initially
    section.classList.add('mf-margins-hidden');

    // Active transition timer IDs (for cancellation)
    let transitionTimer = null;
    // glowTimer removed — no more layer glow

    // Force-finish any in-progress transition
    function forceFinishTransition(year) {
      if (transitionTimer) { clearTimeout(transitionTimer); transitionTimer = null; }
      // glow cleanup removed
      const dataEls = section.querySelectorAll('[data-years]');
      const layerEls = section.querySelectorAll('.mf-layer');
      dataEls.forEach((el) => {
        el.style.transitionDelay = '0ms';
        el.classList.remove('transitioning-out', 'transitioning-in', 'settled');
        try {
          const years = JSON.parse(el.dataset.years);
          if (years[year]) el.textContent = years[year];
        } catch (e) { /* skip */ }
      });
      layerEls.forEach((l) => l.classList.remove('year-transitioning'));
      isTransitioning = false;
    }

    // ─── Cinematic year switch with 2-phase crossfade ───
    function switchToYear(year, animate) {
      const targetIdx = yearSequence.indexOf(year);
      if (targetIdx === -1) return;

      // Update pill indicator (smooth slide)
      if (yearToggle) yearToggle.setAttribute('data-active-idx', targetIdx);

      // Update button active states
      yearBtns.forEach((b) => b.classList.remove('active'));
      const targetBtn = section.querySelector('.mf-toggle-btn[data-year="' + year + '"]');
      if (targetBtn) targetBtn.classList.add('active');

      // Update background epoch text
      if (yearEpoch) {
        yearEpoch.textContent = year;
        yearEpoch.classList.remove('flash');
        void yearEpoch.offsetWidth;
        yearEpoch.classList.add('flash');
      }

      const dataEls = section.querySelectorAll('[data-years]');
      const layerEls = section.querySelectorAll('.mf-layer');

      if (!animate) {
        // No animation — instant swap (initial load)
        dataEls.forEach((el) => {
          try {
            const years = JSON.parse(el.dataset.years);
            if (years[year]) el.textContent = years[year];
          } catch (e) { /* skip */ }
        });
        return;
      }

      // If already transitioning, force-finish the old one first
      if (isTransitioning) {
        forceFinishTransition(year);
      }

      isTransitioning = true;

      // Calculate stagger delay per element based on its layer
      function getStagger(el) {
        const layer = el.closest('.mf-layer');
        if (!layer) return 0;
        const layerNum = parseInt(layer.dataset.layer) || 5;
        // Layer 5 at top = 0ms, layer 1 at bottom = 240ms
        return (5 - layerNum) * 60;
      }

      // Phase 1: Fade out old numbers (no stagger for fade-out — all go at once)
      dataEls.forEach((el) => {
        el.style.transitionDelay = '0ms';
        el.classList.remove('settled', 'transitioning-in');
        el.classList.add('transitioning-out');
      });

      // Layer glow removed for cleaner feel

      // Phase 2: After fade-out, swap text + fade in with stagger
      transitionTimer = setTimeout(() => {
        transitionTimer = null;
        dataEls.forEach((el) => {
          try {
            const years = JSON.parse(el.dataset.years);
            if (years[year]) el.textContent = years[year];
          } catch (e) { /* skip */ }
          el.classList.remove('transitioning-out');
          el.classList.add('transitioning-in');
        });

        // Phase 3: Settle into final position with cascading stagger
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            dataEls.forEach((el) => {
              el.style.transitionDelay = getStagger(el) + 'ms';
              el.classList.remove('transitioning-in');
              el.classList.add('settled');
            });
            // Mark as done after the last stagger completes
            setTimeout(() => {
              isTransitioning = false;
            }, 300);

            // glow cleanup removed
          });
        });
      }, 220); // slightly shorter fade-out for snappier feel
    }

    // Reveal margins with staggered animation
    function revealMargins() {
      if (marginsRevealed) return;
      marginsRevealed = true;
      section.classList.remove('mf-margins-hidden');
    }

    // Manual click still works — disables auto-scroll
    yearBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        autoScrollActive = false;
        // Hide scroll hint when user takes manual control
        if (scrollHint) scrollHint.classList.add('hidden');
        const year = btn.dataset.year;
        currentYearIdx = yearSequence.indexOf(year);
        switchToYear(year, true);
        if (year === '2026') {
          setTimeout(revealMargins, 800);
        }
      });
    });

    // ─── Scroll handler with progress bar + smooth year switching ───
    function initScrollYearProgression() {
      const sectionEl = section;
      let ticking = false;

      function onScroll() {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
          ticking = false;

          const rect = sectionEl.getBoundingClientRect();
          const sectionH = rect.height;
          const viewH = window.innerHeight;
          const scrolledPast = -rect.top;
          const scrollProgress = Math.max(0, Math.min(1,
            scrolledPast / (sectionH - viewH)
          ));

          // Update progress bar (direct DOM, no transitions for smoothness)
          if (progressFill) {
            progressFill.style.width = (scrollProgress * 100) + '%';
          }

          // Hide scroll hint after scrolling past 15%
          if (scrollHint) {
            if (scrollProgress > 0.15) {
              scrollHint.classList.add('hidden');
            } else {
              scrollHint.classList.remove('hidden');
            }
          }

          // Year zones: 0-0.25 = 2024, 0.25-0.50 = 2025, 0.50+ = 2026
          if (!autoScrollActive) return;

          let targetIdx;
          if (scrollProgress < 0.25) {
            targetIdx = 0;
          } else if (scrollProgress < 0.50) {
            targetIdx = 1;
          } else {
            targetIdx = 2;
          }

          if (targetIdx !== currentYearIdx) {
            currentYearIdx = targetIdx;
            switchToYear(yearSequence[currentYearIdx], true);
          }

          // Reveal margins once user hits bottom third
          if (scrollProgress > 0.70) {
            revealMargins();
          }
        });
      }

      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    // Start scroll progression once the section enters view
    const sectionObs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          initScrollYearProgression();
          sectionObs.unobserve(section);
        }
      },
      { threshold: 0.05 }
    );
    sectionObs.observe(section);

    // $1 Journey toggle
    const journeyBtn = document.getElementById('mfJourneyBtn');
    const journeyOverlay = document.getElementById('mfJourneyOverlay');
    const journeyClose = document.getElementById('mfJourneyClose');
    if (journeyBtn && journeyOverlay) {
      journeyBtn.addEventListener('click', () => {
        journeyOverlay.classList.add('visible');
      });
      if (journeyClose) {
        journeyClose.addEventListener('click', () => {
          journeyOverlay.classList.remove('visible');
        });
      }
      journeyOverlay.addEventListener('click', (e) => {
        if (e.target === journeyOverlay) {
          journeyOverlay.classList.remove('visible');
        }
      });
    }

  }

  // --- ANATOMY OF AI AGENT (sec-5) ---
  // Handled by sec3.js — do not duplicate listeners here
  function initAnatomyLayers() { }

  // --- AUTONOMOUS REVOLUTION (sec-4) ---
  function initAutonomousRevolution() {
    const sec = document.getElementById('sec-4');
    if (!sec) return;

    // Agent card expand/collapse
    sec.querySelectorAll('.ar-agent-card').forEach((card) => {
      card.addEventListener('click', () => {
        const wasExpanded = card.classList.contains('ar-agent-card--expanded');
        // collapse all
        sec.querySelectorAll('.ar-agent-card--expanded').forEach((c) =>
          c.classList.remove('ar-agent-card--expanded')
        );
        if (!wasExpanded) card.classList.add('ar-agent-card--expanded');
      });
    });

    // How It Works collapsible (all instances)
    sec.querySelectorAll('.ar-howworks').forEach((hw) => {
      const btn = hw.querySelector('.ar-howworks-toggle');
      if (!btn) return;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const collapsed = hw.dataset.collapsed === 'true';
        hw.dataset.collapsed = collapsed ? 'false' : 'true';
        btn.setAttribute('aria-expanded', collapsed ? 'true' : 'false');
      });
    });

    // Task bars — animate on scroll via existing anim-fade + visible
    // The bars use .ar-task-bar.visible .ar-task-fill { width: var(--target-width) }
    // The existing IntersectionObserver adds 'visible' class, which triggers the animation.

    // Deploy bars animate the same way via .anim-fade.visible .ar-deploy-bar-fill

    // Stat bar — animate fill when visible
    const statBar = sec.querySelector('.ar-stat-bar');
    if (statBar) {
      const fillObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.querySelector('.ar-stat-bar-fill').classList.add('animated');
              fillObs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      fillObs.observe(statBar);
    }
  }

  // --- RABBIT HOLE TOGGLES ---
  function initRabbitHoles() {
    document.querySelectorAll('.rabbit-hole-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var hole = btn.closest('.rabbit-hole');
        if (hole) {
          hole.classList.toggle('open');
        }
      });
    });
  }

  // ═══ INCUMBENTS' DILEMMA — Stack Matrix ═══
  function initIncumbents() {
    const matrix = document.querySelector('.inc-matrix');
    if (!matrix) return;

    const detail = document.getElementById('incDetail');
    const detailName = detail.querySelector('.inc-detail-name');
    const detailRank = detail.querySelector('.inc-detail-rank');
    const detailSuper = detail.querySelector('.inc-detail-super');
    const detailHeel = detail.querySelector('.inc-detail-heel');
    const detailStat = detail.querySelector('.inc-detail-stat');

    const companyData = {"google": {"name": "Google", "rank": "DVC thesis: integrated position", "color": "#4CB5AB", "superpower": "Search, cloud, Gemini, custom silicon and developer distribution.", "heel": "AI changes the monetization of answers and the route from discovery to transaction.", "stat": "October model update: Gemini 4 Argon. Product reach, paid adoption and infrastructure revenue are separate metrics."}, "microsoft": {"name": "Microsoft", "rank": "DVC thesis: enterprise distribution", "color": "#4CB5AB", "superpower": "Enterprise software, developer tools and cloud distribution.", "heel": "Partner dependence, model competition and infrastructure commitments need separate underwriting.", "stat": "Calendar-2026 reported capex is about $175B after lease reclassification; underlying investment expectations are unchanged."}, "meta": {"name": "Meta", "rank": "DVC thesis: embedded reach", "color": "#4CB5AB", "superpower": "Social distribution and AI embedded in existing products.", "heel": "Reach is not the same as paid demand or a chosen-assistant relationship.", "stat": "Muse Wonder is the October release. No stale model-price or user-count ranking is asserted."}, "apple": {"name": "Apple", "rank": "DVC thesis: device access", "color": "#4CB5AB", "superpower": "Devices, operating-system access and on-device computation.", "heel": "Control of distribution is not a substitute for product execution.", "stat": "Evaluate actual shipped functionality and partner terms, not an old launch forecast."}, "xai": {"name": "xAI / SpaceX", "rank": "DVC thesis: integrated resources", "color": "#4CB5AB", "superpower": "Compute access, consumer distribution and corporate integration.", "heel": "Integration does not establish enterprise adoption or sustainable serving economics.", "stat": "Financing, corporate transactions, product use and recognized revenue have different evidence requirements."}, "nvidia": {"name": "NVIDIA", "rank": "DVC thesis: ecosystem supplier", "color": "#4CB5AB", "superpower": "Accelerators, software, networking and infrastructure partnerships.", "heel": "Customers also develop alternative silicon; challengers need proof of shipment, utilization and economics.", "stat": "Etched\u2019s August $21B financing mark is not equivalent to scaled supply or market share."}, "amazon": {"name": "Amazon", "rank": "DVC thesis: cloud and commerce", "color": "#4CB5AB", "superpower": "Cloud infrastructure, commerce distribution and the customer transaction.", "heel": "Agent-led discovery can change how shoppers encounter sponsored placements.", "stat": "Whether value shifts depends on who controls selection, checkout, fulfilment and the customer relationship."}};

    let activeCompany = null;

    // Reveal cells on scroll
    const revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('inc-revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    revealObserver.observe(matrix);

    function showDetail(companyKey) {
      const data = companyData[companyKey];
      if (!data) return;
      activeCompany = companyKey;

      detailName.textContent = data.name;
      detailName.style.color = data.color;
      detailRank.textContent = data.rank;
      detailRank.style.color = data.color;
      detailSuper.textContent = data.superpower;
      detailHeel.textContent = data.heel;
      detailStat.textContent = data.stat;

      detail.classList.add('inc-detail--visible');
      detail.setAttribute('aria-hidden', 'false');

      // Highlight column
      document.querySelectorAll('.inc-col-header').forEach(function(h) {
        h.classList.toggle('inc-active', h.dataset.company === companyKey);
      });
      document.querySelectorAll('.inc-cell').forEach(function(c) {
        c.classList.toggle('inc-col-hover', c.dataset.company === companyKey);
      });
    }

    function hideDetail() {
      activeCompany = null;
      detail.classList.remove('inc-detail--visible');
      detail.setAttribute('aria-hidden', 'true');
      document.querySelectorAll('.inc-col-header').forEach(function(h) {
        h.classList.remove('inc-active');
      });
      document.querySelectorAll('.inc-cell').forEach(function(c) {
        c.classList.remove('inc-col-hover');
      });
    }

    // Desktop: hover on column headers
    document.querySelectorAll('.inc-col-header').forEach(function(header) {
      header.addEventListener('mouseenter', function() {
        showDetail(header.dataset.company);
      });
      header.addEventListener('click', function(e) {
        e.stopPropagation();
        if (activeCompany === header.dataset.company) {
          hideDetail();
        } else {
          showDetail(header.dataset.company);
        }
      });
    });

    // Cells also trigger their company
    document.querySelectorAll('.inc-cell').forEach(function(cell) {
      cell.addEventListener('mouseenter', function() {
        showDetail(cell.dataset.company);
      });
      cell.addEventListener('click', function(e) {
        e.stopPropagation();
        if (activeCompany === cell.dataset.company) {
          hideDetail();
        } else {
          showDetail(cell.dataset.company);
        }
      });
    });

    // Close on click outside
    document.addEventListener('click', function(e) {
      if (activeCompany && !e.target.closest('.inc-matrix') && !e.target.closest('.inc-detail')) {
        hideDetail();
      }
    });

    // Close on mouseleave from matrix area
    matrix.addEventListener('mouseleave', function() {
      hideDetail();
    });
  }

  // --- INIT ---
  function init() {
    initParticles('particleCanvas');
    initParticles('particleCanvas2');
    initScrollAnimations();
    initCounters();
    initScrollProgress();
    initSidebar();
    initKeyboard();
    initCharts();
    initMoneyFlow();
    initAutonomousRevolution();
    initAnatomyLayers();
    initCapitalConcentration();
    initRabbitHoles();
    initIncumbents();
  }

  // ═══ CAPITAL CONCENTRATION INTERACTIVE CHARTS ═══
  function initCapitalConcentration() {
    // --- AUM Horizontal Bar Chart ---
    const aumContainer = document.getElementById('aumBars');
    if (aumContainer) {
      const aumData = [{"name": "Etched \u00b7 Aug 2026", "aum": 0.7, "color": "#4CB5AB"}, {"name": "Harvey \u00b7 Sep 2026", "aum": 0.55, "color": "#4CB5AB"}, {"name": "Rhoda \u00b7 Mar 2026", "aum": 0.45, "color": "#4CB5AB"}, {"name": "Higgsfield \u00b7 Aug 2026", "aum": 0.4, "color": "#4CB5AB"}, {"name": "ElevenLabs \u00b7 Sep tender", "aum": 0.3, "color": "#9AA3B7"}];
      const maxAum = aumData[0].aum;

      aumData.forEach((d, i) => {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:0.75rem;';

        const label = document.createElement('span');
        label.style.cssText = 'min-width:110px;color:#C8CCD4;font-size:0.75rem;font-weight:600;text-align:right;white-space:nowrap;';
        label.textContent = d.name;

        const track = document.createElement('div');
        track.style.cssText = 'flex:1;height:26px;background:rgba(255,255,255,0.04);border-radius:0;overflow:hidden;position:relative;';

        const fill = document.createElement('div');
        const pct = (d.aum / maxAum) * 100;
        fill.style.cssText = `width:0%;height:100%;border-radius:0;background:${d.color};opacity:0.85;transition:width 1.2s cubic-bezier(0.22,1,0.36,1);transition-delay:${i * 0.08}s;position:relative;`;
        fill.dataset.targetWidth = pct + '%';

        const val = document.createElement('span');
        val.style.cssText = 'position:absolute;right:8px;top:50%;transform:translateY(-50%);font-size:0.75rem;font-weight:700;color:#1a1d28;font-variant-numeric:tabular-nums;';
        val.textContent = '$' + d.aum.toFixed(2) + 'B';
        fill.appendChild(val);

        track.appendChild(fill);
        row.appendChild(label);
        row.appendChild(track);
        aumContainer.appendChild(row);
      });

      // Animate on scroll
      const aumObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            aumContainer.querySelectorAll('[data-target-width]').forEach(fill => {
              fill.style.width = fill.dataset.targetWidth;
            });
            aumObs.unobserve(e.target);
          }
        });
      }, { threshold: 0.2 });
      aumObs.observe(aumContainer);
    }

    // --- Pareto Deals Bar Chart ---
    const paretoContainer = document.getElementById('paretoDeals');
    if (paretoContainer) {
      const dealData = [
        { company: 'Anthropic', amount: 65,  label: '$65B',   date: 'May 2026',  investors: 'Series H closed May 28 2026 at $965B post-money — the second-largest private round on record', color: '#FFD720' },
        { company: 'OpenAI',    amount: 122, label: '$122B',  date: 'Mar 2026',  investors: 'Series F closed at $852B post-money / $730B pre-money — SoftBank $30B + Amazon $50B + NVIDIA $30B',  color: '#F4B6A9' },
        { company: 'OpenAI',    amount: 40,  label: '$40B',   date: 'Mar 2025',  investors: 'SoftBank, Microsoft, Thrive Capital',  color: '#F4B6A9' },
        { company: 'Anthropic', amount: 30,  label: '$30B',   date: 'Feb 2026',  investors: 'Series G at $380B post-money — GIC + Coatue lead',      color: '#FFD720' },
        { company: 'Scale AI',  amount: 14.3,label: '$14.3B', date: 'Jun 2025',  investors: 'Meta, for a 49% stake',      color: '#4BB5AB' },
        { company: 'Anthropic', amount: 13,  label: '$13B',   date: 'Sep 2025',  investors: 'Series F at $183B post-money — ICONIQ lead; Fidelity, Lightspeed co-lead',            color: '#FFD720' },
        { company: 'xAI',       amount: 10,  label: '$10B',   date: 'Jul 2025',  investors: '$5B debt + $5B strategic equity (Morgan Stanley)',             color: '#2080D6' },
        { company: 'Prometheus',amount: 6.2, label: '$6.2B',  date: 'Nov 2025',  investors: 'Jeff Bezos’s physical-AI startup Project Prometheus',           color: '#8CC0EE' },
        { company: 'xAI',       amount: 20,  label: '$20B',   date: 'Jan 2026',  investors: 'Series E — Valor, StepStone, Fidelity, QIA, MGX; NVIDIA and Cisco strategic',     color: '#2080D6' },
      ];
      // Largest first, and every bar scaled to the largest round (OpenAI's $122B once rendered at 188%).
      dealData.sort((a, b) => b.amount - a.amount);
      const maxDeal = dealData[0].amount;
      let activeTooltipRow = null; // track active tooltip for mobile

      dealData.forEach((d, i) => {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:0.75rem;cursor:pointer;position:relative;';

        const label = document.createElement('span');
        label.style.cssText = 'min-width:85px;color:#C8CCD4;font-size:0.75rem;font-weight:600;text-align:right;white-space:nowrap;';
        label.textContent = d.company;

        const track = document.createElement('div');
        track.style.cssText = 'flex:1;height:32px;background:rgba(255,255,255,0.04);border-radius:0;overflow:hidden;position:relative;';

        const fill = document.createElement('div');
        const pct = (d.amount / maxDeal) * 100;
        fill.style.cssText = `width:0%;height:100%;border-radius:0;background:linear-gradient(90deg,${d.color},${d.color}cc);transition:width 1s cubic-bezier(0.22,1,0.36,1);transition-delay:${i * 0.1}s;display:flex;align-items:center;justify-content:flex-end;padding-right:10px;min-width:fit-content;`;
        fill.dataset.targetWidth = pct + '%';

        const amountSpan = document.createElement('span');
        amountSpan.style.cssText = 'font-size:0.75rem;font-weight:700;color:#1a1d28;font-variant-numeric:tabular-nums;white-space:nowrap;';
        amountSpan.textContent = d.label;
        fill.appendChild(amountSpan);

        track.appendChild(fill);

        const dateBadge = document.createElement('span');
        dateBadge.style.cssText = 'min-width:65px;color:#A0A8BC;font-size:0.75rem;text-align:left;white-space:nowrap;';
        dateBadge.textContent = d.date;

        row.appendChild(label);
        row.appendChild(track);
        row.appendChild(dateBadge);

        // Detail row (mobile-friendly, replaces tooltip on small screens)
        const detailRow = document.createElement('div');
        detailRow.style.cssText = 'display:none;padding:0.5rem 0 0.25rem 0;font-size:0.75rem;color:#A0A8BC;line-height:1.5;';
        detailRow.innerHTML = `<span style="color:${d.color};font-weight:600">${d.company}</span> · ${d.label} · ${d.date} — <span style="color:#C8CCD4">${d.investors}</span>`;

        // Tooltip (desktop hover)
        const tooltip = document.createElement('div');
        tooltip.style.cssText = 'position:absolute;bottom:110%;left:50%;transform:translateX(-50%);background:#1D253E;border:1px solid rgba(255,255,255,0.12);border-radius:0;padding:0.6rem 1rem;font-size:0.75rem;color:#E8E9ED;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity 0.25s;z-index:10;box-shadow:0 8px 24px rgba(0,0,0,0.4);';
        tooltip.innerHTML = `<strong style="color:${d.color}">${d.company}</strong> · ${d.label} · ${d.date}<br><span style="color:#A0A8BC">${d.investors}</span>`;
        row.appendChild(tooltip);

        // Desktop hover
        row.addEventListener('mouseenter', () => {
          if (window.innerWidth > 768) {
            tooltip.style.opacity = '1'; track.style.transform = 'scaleY(1.1)'; track.style.transition = 'transform 0.2s';
          }
        });
        row.addEventListener('mouseleave', () => {
          tooltip.style.opacity = '0'; track.style.transform = 'scaleY(1)';
        });

        // Mobile tap — toggle detail row
        row.addEventListener('click', (e) => {
          e.stopPropagation();
          const isVisible = detailRow.style.display !== 'none';
          // Close any previously open detail
          if (activeTooltipRow && activeTooltipRow !== detailRow) {
            activeTooltipRow.style.display = 'none';
          }
          detailRow.style.display = isVisible ? 'none' : 'block';
          activeTooltipRow = isVisible ? null : detailRow;
          // Highlight bar
          fill.style.opacity = isVisible ? '1' : '0.95';
          track.style.transform = isVisible ? 'scaleY(1)' : 'scaleY(1.05)';
          track.style.transition = 'transform 0.2s';
        });

        const wrapper = document.createElement('div');
        wrapper.appendChild(row);
        wrapper.appendChild(detailRow);
        paretoContainer.appendChild(wrapper);
      });

      // Close on outside tap
      document.addEventListener('click', () => {
        if (activeTooltipRow) { activeTooltipRow.style.display = 'none'; activeTooltipRow = null; }
      });

      // Animate on scroll
      const paretoObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            paretoContainer.querySelectorAll('div[data-target-width]').forEach(fill => {
              fill.style.width = fill.dataset.targetWidth;
            });
            paretoObs.unobserve(e.target);
          }
        });
      }, { threshold: 0.2 });
      paretoObs.observe(paretoContainer);
    }
  }

  /* ═══ Great Reallocation Toggle ═══ */
  function initGreatReallocation() {
    const toggleBtns = document.querySelectorAll('.gr-toggle-btn');
    const panelFear = document.getElementById('grPanelFear');
    const panelData = document.getElementById('grPanelData');
    if (!toggleBtns.length || !panelFear || !panelData) return;

    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        toggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const panel = btn.dataset.panel;
        panelFear.classList.toggle('active', panel === 'fear');
        panelData.classList.toggle('active', panel === 'data');
        // Animate bars when data panel opens
        if (panel === 'data') animateGrBars();
      });
    });

    // Animate bars on scroll if data panel is already active
    const barsEl = document.getElementById('grBars');
    if (barsEl) {
      const barsObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting && panelData.classList.contains('active')) {
            animateGrBars();
            barsObs.unobserve(e.target);
          }
        });
      }, { threshold: 0.3 });
      barsObs.observe(barsEl);
    }
  }

  function animateGrBars() {
    document.querySelectorAll('.gr-bar-fill[data-target]').forEach(fill => {
      const target = fill.dataset.target;
      requestAnimationFrame(() => {
        fill.style.width = target + '%';
      });
    });
  }

  function initAll() {
    init();
    initGreatReallocation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
