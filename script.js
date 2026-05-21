(function () {
  /* ── Touch detection ─────────────────────────────────────────────── */
  const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
 
  /* ── Custom Cursor (desktop only) ───────────────────────────────── */
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursorTrail');
 
  if (!isTouch && cursor && trail) {
    let mouseX = -200, mouseY = -200;
 
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
 
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
 
      // Reveal cursor on first move
      if (!cursor.classList.contains('active')) {
        cursor.classList.add('active');
        trail.classList.add('active');
      }
 
      // Trail follows with slight delay
      setTimeout(() => {
        trail.style.left = mouseX + 'px';
        trail.style.top  = mouseY + 'px';
      }, 80);
    });
 
    // Hide cursor when it leaves the window
    document.addEventListener('mouseleave', () => {
      cursor.classList.remove('active');
      trail.classList.remove('active');
    });
    document.addEventListener('mouseenter', () => {
      cursor.classList.add('active');
      trail.classList.add('active');
    });
 
    // Hover expansion on interactive elements
    document.querySelectorAll('a, button, .skill-card, .project-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width  = '20px';
        cursor.style.height = '20px';
        trail.style.width   = '50px';
        trail.style.height  = '50px';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width  = '12px';
        cursor.style.height = '12px';
        trail.style.width   = '36px';
        trail.style.height  = '36px';
      });
    });
  }
 
  /* ── Hamburger / Mobile Nav ─────────────────────────────────────── */
  const hamburger = document.getElementById('navHamburger');
  const drawer    = document.getElementById('navDrawer');
 
  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      drawer.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      // Prevent body scroll while drawer is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
 
    // Close drawer on link click
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        drawer.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }
 
  /* ── Reveal animations (Intersection Observer) ──────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Use a data attribute or sibling index for stagger, not the entries array index
          const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = (idx % 4) * 0.1 + 's';
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => observer.observe(el));
  }
 
  /* ── Contact Form (Formspree) ───────────────────────────────────── */
  window.handleFormSubmit = async function (e) {
    e.preventDefault();
    const form    = document.getElementById('contactForm');
    const btn     = document.querySelector('.btn-submit');
    const success = document.getElementById('formSuccess');
    if (!form || !btn) return;
 
    const originalText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;
 
    try {
      const res = await fetch('https://formspree.io/f/xeededpo', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });
 
      if (res.ok) {
        form.reset();
        if (success) {
          success.style.display = 'block';
          setTimeout(() => { success.style.display = 'none'; }, 5000);
        }
      } else {
        alert('Oops! Something went wrong. Please try again.');
      }
    } catch (err) {
      alert('Network error. Please check your connection and try again.');
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  };
 
  /* ── Skill bar animations ────────────────────────────────────────── */
  const skillCards = document.querySelectorAll('.skill-card');
  if (skillCards.length) {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
            bar.style.width = (bar.dataset.width || 0) + '%';
          });
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    skillCards.forEach(card => barObserver.observe(card));
  }
 
})();
