/* ═══════════════════════════════════════════
   NUANCIA ORGANIZATION — MAIN SCRIPT
   Shared by every page. Each block checks that its elements exist,
   so pages without a slider, stats or form are unaffected.
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────
     STICKY HEADER
     Pages that start with class="scrolled" (inner pages) keep a solid
     header; only the home page toggles it on scroll.
  ────────────────────────────────────── */
  const header = document.getElementById('header');
  if (header && !header.classList.contains('scrolled')) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // correct state if the page loads already scrolled
  }

  /* ──────────────────────────────────────
     MOBILE MENU
  ────────────────────────────────────── */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav  = document.getElementById('mobile-nav');
  if (menuToggle && mobileNav) {
    const setMenu = open => {
      mobileNav.classList.toggle('open', open);
      menuToggle.classList.toggle('open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    };
    menuToggle.addEventListener('click', () => setMenu(!mobileNav.classList.contains('open')));
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  }

  /* ──────────────────────────────────────
     DESKTOP DROPDOWN (Hizmetlerimiz)
     Hover opens it via CSS. A click/tap also toggles it, for touch
     screens wide enough to show the desktop menu (tablets) and for
     keyboard users. Clicking elsewhere or pressing Escape closes it.
  ────────────────────────────────────── */
  document.querySelectorAll('#main-nav .has-dropdown').forEach(item => {
    const trigger = item.querySelector(':scope > a');
    if (!trigger) return;
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');

    const setOpen = open => {
      item.classList.toggle('open', open);
      trigger.setAttribute('aria-expanded', String(open));
    };

    trigger.addEventListener('click', e => {
      e.preventDefault(); // href="#" would otherwise jump to the top of the page
      setOpen(!item.classList.contains('open'));
    });
    document.addEventListener('click', e => { if (!item.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { setOpen(false); if (item.contains(document.activeElement)) trigger.focus(); }
    });
  });

  /* ──────────────────────────────────────
     HERO SLIDER
  ────────────────────────────────────── */
  const slides      = document.querySelectorAll('.slide');
  const dotsWrap    = document.getElementById('sliderDots');
  const prevBtn     = document.getElementById('prevBtn');
  const nextBtn     = document.getElementById('nextBtn');
  const currentSpan = document.getElementById('currentSlide');
  const totalSpan   = document.getElementById('totalSlides');
  const heroEl      = document.getElementById('hero');

  if (slides.length && dotsWrap) {
    let current = 0;
    let autoTimer;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slayt ${i + 1}`);
      dot.addEventListener('click', () => { goTo(i); startAuto(); });
      dotsWrap.appendChild(dot);
    });

    const dots = dotsWrap.querySelectorAll('.dot');
    if (totalSpan) totalSpan.textContent = String(slides.length).padStart(2, '0');

    function goTo(idx) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
      if (currentSpan) currentSpan.textContent = String(current + 1).padStart(2, '0');
    }
    const next = () => goTo(current + 1);
    const prev = () => goTo(current - 1);

    function startAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(next, 5000);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });

    // Touch swipe
    if (heroEl) {
      let touchStartX = 0;
      heroEl.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
      heroEl.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); startAuto(); }
      }, { passive: true });
    }

    // Pause while the tab is hidden
    document.addEventListener('visibilitychange', () => {
      document.hidden ? clearInterval(autoTimer) : startAuto();
    });

    startAuto();
  }

  /* ──────────────────────────────────────
     HERO IMAGE FIT
     Never stretches. If the photo's shape is close to the screen's
     (≤ 18% would be cropped), it fills the hero ("cover"). Otherwise the
     whole photo is shown ("contain") over its own blurred backdrop.
  ────────────────────────────────────── */
  const heroImgs = document.querySelectorAll('.slide-img');
  if (heroImgs.length && heroEl) {
    const MAX_CROP = 0.18;

    const fitImage = img => {
      if (!img.naturalWidth) return;
      if (img.closest('.slide--cover')) { img.style.objectFit = 'cover'; img.classList.remove('is-contained'); return; }
      const imgRatio  = img.naturalWidth / img.naturalHeight;
      const heroRatio = heroEl.clientWidth / heroEl.clientHeight;
      const crop = 1 - Math.min(imgRatio, heroRatio) / Math.max(imgRatio, heroRatio);
      const contain = crop > MAX_CROP;
      img.style.objectFit = contain ? 'contain' : 'cover';
      img.classList.toggle('is-contained', contain);
    };
    const fitAll = () => heroImgs.forEach(fitImage);

    heroImgs.forEach(img => {
      if (img.complete) fitImage(img);
      else img.addEventListener('load', () => fitImage(img), { once: true });
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(fitAll, 150);
    });
  }

  /* ──────────────────────────────────────
     TESTIMONIAL SLIDER
  ────────────────────────────────────── */
  const track  = document.getElementById('testimonialTrack');
  const tDots  = document.getElementById('testimonialDots');
  const tCards = track ? track.querySelectorAll('.testimonial-card') : [];

  if (tCards.length && tDots) {
    let tCurrent = 0;
    let tTimer;

    tCards.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Yorum ${i + 1}`);
      d.addEventListener('click', () => { tGoTo(i); tStart(); });
      tDots.appendChild(d);
    });

    const tDotBtns = tDots.querySelectorAll('.dot');

    function tGoTo(idx) {
      tDotBtns[tCurrent].classList.remove('active');
      tCurrent = (idx + tCards.length) % tCards.length;
      track.style.transform = `translateX(-${tCurrent * 100}%)`;
      tDotBtns[tCurrent].classList.add('active');
    }
    function tStart() {
      clearInterval(tTimer);
      tTimer = setInterval(() => tGoTo(tCurrent + 1), 4500);
    }
    tStart();
  }

  /* ──────────────────────────────────────
     SCROLL-REVEAL
     Hidden state is set here (not in CSS) so content stays visible if
     JavaScript fails. Reveal clears the inline style directly.
     Service cards use their own CSS-driven .visible class (below).
  ────────────────────────────────────── */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealEls = document.querySelectorAll(
    '.stat-item, .about-img-block, .about-text-block, .testimonial-slider, #intro .container > *, ' +
    '.area-card, .mv-card, .value-card'
  );

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, Number(el.dataset.delay || 0));
        revealObs.unobserve(el);
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      revealObs.observe(el);
    });
  }

  /* Service cards — hidden by style.css until .visible is added */
  const sCards = document.querySelectorAll('.service-card');
  if (sCards.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      sCards.forEach(c => c.classList.add('visible'));
    } else {
      const cardObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          setTimeout(() => el.classList.add('visible'), parseInt(el.dataset.delay || 0, 10));
          cardObs.unobserve(el);
        });
      }, { threshold: 0.1 });
      sCards.forEach(c => cardObs.observe(c));
    }
  }

  /* ──────────────────────────────────────
     COUNTER ANIMATION (Stats section)
  ────────────────────────────────────── */
  const counters     = document.querySelectorAll('.stat-number');
  const statsSection = document.getElementById('stats');

  if (counters.length && statsSection) {
    const runCounters = () => counters.forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      if (reduceMotion) { el.textContent = target; return; }
      const step = Math.max(1, Math.ceil(target / (1800 / 16)));
      let value = 0;
      const timer = setInterval(() => {
        value = Math.min(value + step, target);
        el.textContent = value;
        if (value >= target) clearInterval(timer);
      }, 16);
    });

    if ('IntersectionObserver' in window) {
      const statsObs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { runCounters(); statsObs.disconnect(); }
      }, { threshold: 0.4 });
      statsObs.observe(statsSection);
    } else {
      runCounters();
    }
  }

  /* ──────────────────────────────────────
     CONTACT FORM (iletisim.html)
  ────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn-submit');
      if (btn) { btn.textContent = 'Gönderiliyor...'; btn.disabled = true; }

      setTimeout(() => {
        const success = document.getElementById('formSuccess');
        contactForm.style.display = 'none';
        if (success) success.style.display = 'block';
      }, 1200);
    });
  }

});
