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
   CONTACT FORM (mailto handoff — static site, no backend)
========================================================= */
(() => {
  const form = document.querySelector('[data-form]');
  if (!form) return;

  const inputs = form.querySelectorAll('[data-form-input]');
  const submitBtn = form.querySelector('[data-form-btn]');
  const msg = form.querySelector('[data-form-msg]');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#cf-name').value.trim();
    const email = form.querySelector('#cf-email').value.trim();
    const message = form.querySelector('#cf-message').value.trim();

    if (!name || !email || !message) return;

    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:rohinitembhurnikar3@gmail.com?subject=${subject}&body=${body}`;

    if (msg) msg.textContent = 'Opening your email app to send this message…';
    form.reset();
  });
})();

/* footer year */
document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
