/* ═══════════════════════════════════════════
   HTU ORGANIZATION — MAIN SCRIPT
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────
     STICKY HEADER
  ────────────────────────────────────── */
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ──────────────────────────────────────
     MOBILE MENU
  ────────────────────────────────────── */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav  = document.getElementById('mobile-nav');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      menuToggle.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    // Close on link click
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        menuToggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ──────────────────────────────────────
     HERO SLIDER
  ────────────────────────────────────── */
  const slides      = document.querySelectorAll('.slide');
  const dotsWrap    = document.getElementById('sliderDots');
  const prevBtn     = document.getElementById('prevBtn');
  const nextBtn     = document.getElementById('nextBtn');
  const currentSpan = document.getElementById('currentSlide');
  const totalSpan   = document.getElementById('totalSlides');

  if (slides.length) {
    let current = 0;
    let autoTimer;

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slayt ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
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

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(next, 5000);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });

    // Touch swipe
    let touchStartX = 0;
    const heroEl = document.getElementById('hero');
    if (heroEl) {
      heroEl.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
      heroEl.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); startAuto(); }
      }, { passive: true });
    }

    startAuto();
  }

  /* ──────────────────────────────────────
     TESTIMONIAL SLIDER
  ────────────────────────────────────── */
  const track       = document.getElementById('testimonialTrack');
  const tDots       = document.getElementById('testimonialDots');
  const tCards      = track ? track.querySelectorAll('.testimonial-card') : [];

  if (tCards.length && tDots) {
    let tCurrent = 0;
    let tTimer;

    tCards.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Yorum ${i + 1}`);
      d.addEventListener('click', () => tGoTo(i));
      tDots.appendChild(d);
    });

    const tDotBtns = tDots.querySelectorAll('.dot');

    function tGoTo(idx) {
      tDotBtns[tCurrent].classList.remove('active');
      tCurrent = (idx + tCards.length) % tCards.length;
      track.style.transform = `translateX(-${tCurrent * 100}%)`;
      tDotBtns[tCurrent].classList.add('active');
    }

    tTimer = setInterval(() => tGoTo(tCurrent + 1), 4500);
  }

  /* ──────────────────────────────────────
     SCROLL-REVEAL (Intersection Observer)
  ────────────────────────────────────── */
  const revealEls = document.querySelectorAll(
    '.service-card, .stat-item, .about-img-block, .about-text-block, .testimonial-card, #intro .container > *'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => el.classList.add('visible'), Number(delay));
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    observer.observe(el);
  });

  // Mark visible immediately when in viewport
  document.querySelectorAll('.service-card').forEach(el => {
    el.style.opacity = '';
    el.style.transform = '';
  });

  /* ──────────────────────────────────────
     COUNTER ANIMATION (Stats section)
  ────────────────────────────────────── */
  const counters = document.querySelectorAll('.stat-number');
  const statsSection = document.getElementById('stats');

  if (counters.length && statsSection) {
    let counted = false;
    const statsObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !counted) {
        counted = true;
        counters.forEach(el => {
          const target = parseInt(el.dataset.target, 10);
          const duration = 1800;
          const step = Math.ceil(target / (duration / 16));
          let current = 0;
          const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = current;
            if (current >= target) clearInterval(timer);
          }, 16);
        });
      }
    }, { threshold: 0.4 });
    statsObs.observe(statsSection);
  }

  /* ──────────────────────────────────────
     SERVICE CARDS REVEAL (re-apply)
  ────────────────────────────────────── */
  const sCards = document.querySelectorAll('.service-card');
  if (sCards.length) {
    const cardObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const d  = parseInt(el.dataset.delay || 0);
          setTimeout(() => el.classList.add('visible'), d);
          cardObs.unobserve(el);
        }
      });
    }, { threshold: 0.1 });
    sCards.forEach(c => cardObs.observe(c));
  }

  /* ──────────────────────────────────────
     CONTACT FORM (iletisim.html)
  ────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn-submit');
      btn.textContent = 'Gönderiliyor...';
      btn.disabled = true;

      setTimeout(() => {
        const success = document.getElementById('formSuccess');
        contactForm.style.display = 'none';
        if (success) success.style.display = 'block';
      }, 1200);
    });
  }

});
