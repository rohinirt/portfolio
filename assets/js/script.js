'use strict';

/* =========================================================
   PAGE NAVIGATION (tabs, single page, with transitions)
========================================================= */
(() => {
  const navLinks = document.querySelectorAll('[data-nav-link]');
  const pages = document.querySelectorAll('[data-page]');
  const topbar = document.querySelector('[data-topbar]');
  const underline = document.querySelector('[data-nav-underline]');
  const navListLinks = document.querySelectorAll('.nav-list [data-nav-link]');

  const pageOf = (name) => document.querySelector(`[data-page="${name}"]`);

  function positionUnderline(link) {
    if (!underline || !link) return;
    const list = link.closest('.nav-list');
    if (!list) { underline.style.opacity = 0; return; }
    const listRect = list.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    underline.style.opacity = 1;
    underline.style.left = (linkRect.left - listRect.left) + 'px';
    underline.style.width = linkRect.width + 'px';
  }

  function setActiveNav(target) {
    navLinks.forEach(l => l.classList.toggle('active', l.dataset.target === target));
    const activeInList = document.querySelector(`.nav-list [data-target="${target}"]`);
    positionUnderline(activeInList);
  }

  function goTo(target, { push = true } = {}) {
    const current = document.querySelector('.page.active');
    const next = pageOf(target);
    if (!next || next === current) { setActiveNav(target); return; }

    if (current) {
      current.classList.remove('active', 'anim-in');
    }
    next.classList.add('active', 'anim-in');
    setActiveNav(target);

    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });

    if (push && history.pushState) {
      history.pushState({ page: target }, '', `#${target}`);
    }

    topbar?.classList.remove('menu-open');
    hamburger?.classList.remove('active');
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      goTo(link.dataset.target);
    });
  });

  window.addEventListener('popstate', () => {
    const target = location.hash.replace('#', '') || 'home';
    goTo(target, { push: false });
  });

  window.addEventListener('resize', () => {
    const activeInList = document.querySelector('.nav-list .nav-link.active');
    positionUnderline(activeInList);
  });

  // initial route
  const initial = location.hash.replace('#', '') || 'home';
  goTo(initial, { push: false });
  // ensure underline positions after fonts/layout settle
  window.addEventListener('load', () => {
    const activeInList = document.querySelector('.nav-list .nav-link.active');
    positionUnderline(activeInList);
  });

  /* Mobile hamburger */
  var hamburger = document.querySelector('[data-hamburger]');
  hamburger?.addEventListener('click', () => {
    topbar.classList.toggle('menu-open');
    hamburger.classList.toggle('active');
  });
})();

/* =========================================================
   ROLE CYCLE (animated "I'm a ___" text)
========================================================= */
(() => {
  const el = document.querySelector('[data-role-cycle]');
  if (!el) return;

  const roles = ['Data Analyst', 'Business Analyst', 'Data Visualization Expert', 'BI Analyst'];
  let i = 0;

  setInterval(() => {
    i = (i + 1) % roles.length;
    el.classList.add('role-out');
    setTimeout(() => {
      el.textContent = roles[i];
      el.classList.remove('role-out');
      el.classList.add('role-in');
      setTimeout(() => el.classList.remove('role-in'), 400);
    }, 280);
  }, 2400);
})();

/* =========================================================
   TESTIMONIALS CAROUSEL
========================================================= */
(() => {
  const track = document.querySelector('[data-t-track]');
  const prev = document.querySelector('[data-t-prev]');
  const next = document.querySelector('[data-t-next]');
  if (!track) return;

  const scrollByCard = (dir) => {
    const card = track.querySelector('.t-card');
    if (!card) return;
    const gap = 20;
    const amount = card.getBoundingClientRect().width + gap;
    track.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };

  prev?.addEventListener('click', () => scrollByCard(-1));
  next?.addEventListener('click', () => scrollByCard(1));
})();

/* =========================================================
   PROJECTS FILTER
========================================================= */
(() => {
  const list = document.querySelector('[data-filter-list]');
  if (!list) return;

  const btns = list.querySelectorAll('[data-filter-btn]');
  const cards = document.querySelectorAll('[data-projects-grid] .project-card');
  const emptyMsg = document.querySelector('[data-projects-empty]');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      let visibleCount = 0;

      cards.forEach((card, i) => {
        const match = filter === 'all' || card.dataset.category === filter;
        if (match) {
          card.classList.add('show');
          card.style.animationDelay = (visibleCount * 0.03) + 's';
          visibleCount++;
        } else {
          card.classList.remove('show');
        }
      });

      if (emptyMsg) emptyMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    });
  });
})();

/* =========================================================
   CONTACT FORM
   Submits to Formspree (https://formspree.io) so messages land
   straight in your inbox — no backend needed on GitHub Pages.
   Setup: create a free form at formspree.io, then replace
   YOUR_FORM_ID in the form's "action" attribute in index.html
   with the ID Formspree gives you (looks like /f/abcdwxyz).
   Until that's done, this automatically falls back to opening
   the visitor's email app with the message pre-filled.
========================================================= */
(() => {
  const form = document.querySelector('[data-form]');
  if (!form) return;

  const submitBtn = form.querySelector('[data-form-btn]');
  const btnText = form.querySelector('[data-form-btn-text]');
  const msg = form.querySelector('[data-form-msg]');
  const isConfigured = !form.action.includes('YOUR_FORM_ID');

  function mailtoFallback(name, email, message) {
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:rohinitembhurnikar3@gmail.com?subject=${subject}&body=${body}`;
    if (msg) msg.textContent = 'Opening your email app to send this message…';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.querySelector('#cf-name').value.trim();
    const email = form.querySelector('#cf-email').value.trim();
    const message = form.querySelector('#cf-message').value.trim();
    if (!name || !email || !message) return;

    if (!isConfigured) {
      mailtoFallback(name, email, message);
      form.reset();
      return;
    }

    if (submitBtn) submitBtn.style.pointerEvents = 'none';
    if (btnText) btnText.textContent = 'Sending…';
    if (msg) { msg.textContent = ''; msg.style.color = 'var(--pine)'; }

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        if (msg) msg.textContent = "Thanks! Your message has been sent — I'll get back to you soon.";
        form.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (err) {
      if (msg) { msg.style.color = '#C2540C'; msg.textContent = "Couldn't send automatically — opening your email app instead."; }
      mailtoFallback(name, email, message);
    } finally {
      if (submitBtn) submitBtn.style.pointerEvents = '';
      if (btnText) btnText.textContent = 'Send Message';
    }
  });
})();

/* footer year */
document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
