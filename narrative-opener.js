/* Preserved cinematic opener from GitHub 3742daa. */
window.NARRATIVE_OPENER = function () {
    const slide = document.getElementById('slide-2');
    if (!slide) return;

    // Reset on every entry so the animation replays
    const ICON_COUNT = 5;
    const icons   = Array.from(slide.querySelectorAll('.house-icon'));
    const pulses  = Array.from(slide.querySelectorAll('.icon-pulse'));
    const glows   = Array.from(slide.querySelectorAll('.win-glow'));
    const connectors = Array.from(slide.querySelectorAll('.day-connector'));
    const stars   = slide.querySelector('#starsLayer');
    const sun     = slide.querySelector('#sunGroup');
    const sunCore = slide.querySelector('#sunCore');
    const sunGlow = slide.querySelector('#sunGlowDisc');
    const ground  = slide.querySelector('#groundLine');
    const outline = slide.querySelector('#houseOutline');
    const roof    = slide.querySelector('#houseRoof');
    const grid    = slide.querySelector('#houseGrid');
    const headline = slide.querySelector('.opener-headline');
    const eyebrow  = slide.querySelector('.opener-eyebrow');

    if (!window.gsap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Graceful fallback — just reveal everything
      [stars, sun, grid, ...glows, ...connectors].forEach(el => el && (el.style.opacity = 1));
      icons.forEach(el => { el.classList.add('is-revealed'); el.style.opacity = 1; }); [outline,roof,ground].forEach(el => el && (el.style.strokeDashoffset = '0'));
      return;
    }

    // Reset state each replay
    gsap.set([stars, sun, grid, ...glows, ...connectors, ...pulses], { opacity: 0 });
    icons.forEach(g => {
      g.style.opacity = 0;
      g.style.transform = '';
    });
    gsap.set(headline, { opacity: 1, y: 0 });
    gsap.set(eyebrow, { opacity: 1, y: 0 });
    if (outline) { outline.style.strokeDashoffset = '1500'; }
    if (roof)    { roof.style.strokeDashoffset = '760';  }
    if (ground)  { ground.style.strokeDashoffset = '720'; }
    connectors.forEach(c => { c.style.strokeDashoffset = c.getAttribute('stroke-dasharray'); });

    // ---- Sun-path helper: arc from (60, 380) up to (700, 80) and back down ----
    // We sample positions along a parametric arc.
    function sunPos(t) {
      // t in [0, 1]
      const x = 60 + 640 * t;
      const y = 380 - Math.sin(Math.PI * t) * 320; // peak around t=0.5
      return { x, y };
    }
    function sunColor(t) {
      // dawn (#F4B6A9 salmon) → day (#FFE6A8 warm) → dusk (#F4B6A9 salmon)
      if (t < 0.5) {
        const k = t * 2;
        return gsap.utils.interpolate('#F4B6A9', '#FFE6A8', k);
      } else {
        const k = (t - 0.5) * 2;
        return gsap.utils.interpolate('#FFE6A8', '#F4B6A9', k);
      }
    }

    const tl = window.__narrativeOpenerTimeline = gsap.timeline();

    // 1. Stars twinkle in (cold, pre-dawn night)
    tl.to(stars, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0);
    tl.to(slide.querySelectorAll('.sky-star'), {
      opacity: 1, scale: 1.0, duration: 0.4, stagger: 0.05, ease: 'power2.out',
      transformOrigin: 'center'
    }, 0.1);

    // 2. House draws itself (outline + roof + ground)
    tl.to(ground, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.out' }, 0.4);
    tl.to(outline, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, 0.6);
    tl.to(roof, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.out' }, 1.4);
    tl.to(grid, { opacity: 1, duration: 0.5 }, 1.9);

    // 3. Sunrise: stars fade as sun appears
    tl.to(sun, { opacity: 1, duration: 0.5 }, 2.0);
    tl.to(stars, { opacity: 0.18, duration: 1.1, ease: 'power2.in' }, 2.1);
    // Sun travels its arc — use an object proxy for smooth interpolation
    const sunProxy = { t: 0 };
    tl.to(sunProxy, {
      t: 1,
      duration: 8.0,
      ease: 'none',
      onUpdate: () => {
        const p = sunPos(sunProxy.t);
        const c = sunColor(sunProxy.t);
        sun.setAttribute('transform', `translate(${p.x},${p.y})`);
        if (sunCore) sunCore.setAttribute('fill', c);
        // Glow pulses with sun height — brighter at noon
        if (sunGlow) {
          const h = Math.sin(Math.PI * sunProxy.t);
          sunGlow.setAttribute('r', 50 + h * 30);
        }
      }
    }, 2.0);

    // 4. Icons ignite in chronological order, mapped to sun position
    // Icon timing: 6:40, 6:45, 7:15 (morning, sun rising) → 7:20 (mid-morning) → 3:10pm (afternoon)
    // Map them onto the 8s sun timeline at relative times.
    const iconTimings = [
      { idx: 0, at: 2.6 },  // Email — sunrise has begun
      { idx: 1, at: 3.2 },  // Calendar
      { idx: 2, at: 3.9 },  // Telegram
      { idx: 3, at: 4.7 },  // Amazon (mid-morning)
      { idx: 4, at: 7.2 }   // Waymo (afternoon, sun descending)
    ];
    iconTimings.forEach((t, i) => {
      const iconEl  = icons[t.idx];
      const glowEl  = glows[t.idx];
      const pulseEl = pulses[t.idx];
      // Glow lights up the window
      tl.to(glowEl, { opacity: 1, duration: 0.5, ease: 'power2.out' }, t.at);
      // Icon scales-in with a soft pop
      tl.fromTo(iconEl,
        { opacity: 0, scale: 0.4, transformOrigin: 'center' },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2.0)' },
        t.at
      );
      // Pulse ring radiates outward
      tl.fromTo(pulseEl,
        { opacity: 0.7, scale: 1, transformOrigin: 'center' },
        { opacity: 0, scale: 2.4, duration: 1.0, ease: 'power2.out' },
        t.at + 0.05
      );
      // Connector flows from previous icon to this one
      if (i > 0) {
        const prevTime = iconTimings[i - 1].at;
        const conn = connectors[i - 1];
        if (conn) {
          tl.to(conn, { opacity: 0.7, duration: 0.2 }, prevTime + 0.4);
          tl.to(conn, { strokeDashoffset: 0, duration: Math.min(0.9, t.at - prevTime - 0.1), ease: 'power1.inOut' }, prevTime + 0.4);
          tl.to(conn, { opacity: 0.35, duration: 0.4 }, t.at + 0.1);
        }
      }
    });

    // 5. Final breath — stars fade back in, headline appears
    tl.to(stars, { opacity: 1, duration: 1.0, ease: 'power2.out' }, 9.5);
    tl.to(headline, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 9.7);
    tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 10.0);

    // Subtle continuous pulse on the icons after settle (signals "alive")
    tl.add(() => {
      icons.forEach((g, i) => {
        const ringPulse = pulses[i];
        if (!ringPulse) return;
        gsap.to(ringPulse, {
          opacity: 0.35, scale: 1.7, duration: 1.6, ease: 'power2.out',
          repeat: -1, yoyo: false,
          repeatDelay: 3.5 + (i * 0.3),
          transformOrigin: 'center',
          onRepeat: () => { gsap.set(ringPulse, { scale: 1, opacity: 0.7 }); }
        });
      });
    }, '+=0');
  };
