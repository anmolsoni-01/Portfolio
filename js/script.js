// ==========================================================================
// Anmol Soni — Portfolio
// Small, dependency-free enhancements: mobile nav, active-link highlighting,
// navbar scroll state, scroll-reveal, the footer year, the background
// particle network, and the contact form submission.
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primary-nav');
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  // -- Footer year -----------------------------------------------------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // -- Mobile nav toggle -------------------------------------------------
  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        primaryNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  // -- Navbar background once the page scrolls ---------------------------
  const onScroll = () => {
    if (window.scrollY > 12) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // -- Active nav link while scrolling (scroll-spy) -----------------------
  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = `#${entry.target.id}`;
          navLinks.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === id);
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((section) => spy.observe(section));
  }

  // -- Reveal sections/cards as they enter the viewport -------------------
  const revealTargets = document.querySelectorAll(
    '.project-card, .skill-group, .cert-card, .timeline__item, .record-item, .about__body'
  );
  revealTargets.forEach((el) => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  // -- Contact form submission (Netlify Forms, progressive AJAX) ----------
  const contactForm = document.getElementById('contactForm');
  const contactStatus = document.getElementById('contactFormStatus');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(contactForm);
      const body = new URLSearchParams();
      data.forEach((value, key) => body.append(key, value));

      if (contactStatus) contactStatus.textContent = 'Sending…';

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      })
        .then(() => {
          if (contactStatus) {
            contactStatus.textContent = "Thanks — your message is on its way. I'll get back to you soon.";
          }
          contactForm.reset();
        })
        .catch(() => {
          if (contactStatus) {
            contactStatus.textContent = 'Something went wrong sending that — please email me directly instead.';
          }
        });
    });
  }
});

// ==========================================================================
// Background particle network
// A quiet, ambient constellation behind every section — nodes drift slowly
// and link to nearby neighbours. Respects prefers-reduced-motion (renders
// one static frame instead of animating) and scales particle count to
// screen size so it stays light on smaller devices.
// ==========================================================================
(function initNetworkBackground() {
  const canvas = document.getElementById('bg-network');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function hexToRgb(hex) {
    const clean = hex.trim().replace('#', '');
    const value = parseInt(clean.length === 3
      ? clean.split('').map((c) => c + c).join('')
      : clean, 16);
    return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
  }

  const styles = getComputedStyle(document.documentElement);
  const nodeRgb = hexToRgb(styles.getPropertyValue('--color-accent') || '#E3A75B');
  const lineRgb = hexToRgb(styles.getPropertyValue('--color-border') || '#26314A');
  const LINK_DIST = 150;

  let width = 0;
  let height = 0;
  let points = [];
  let frameId = null;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const density = 1 / 16000;
    const count = Math.min(90, Math.max(26, Math.round(width * height * density)));
    points = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
    }));
  }

  function drawFrame() {
    ctx.clearRect(0, 0, width, height);

    if (!reduceMotion) {
      points.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x <= 0 || p.x >= width) p.vx *= -1;
        if (p.y <= 0 || p.y >= height) p.vy *= -1;
        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));
      });
    }

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const a = points[i];
        const b = points[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          const alpha = (1 - dist / LINK_DIST) * 0.16;
          ctx.strokeStyle = `rgba(${lineRgb[0]}, ${lineRgb[1]}, ${lineRgb[2]}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    points.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${nodeRgb[0]}, ${nodeRgb[1]}, ${nodeRgb[2]}, 0.55)`;
      ctx.fill();
    });

    if (!reduceMotion) {
      frameId = requestAnimationFrame(drawFrame);
    }
  }

  resize();
  drawFrame();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (frameId) cancelAnimationFrame(frameId);
      resize();
      drawFrame();
    }, 200);
  }, { passive: true });
})();
