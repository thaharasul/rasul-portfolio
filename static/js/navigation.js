/**
 * Navigation — sticky header, mobile menu, active section tracking
 */

(function () {
  'use strict';

  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  const navLinks = document.querySelectorAll('.nav__link[data-section]');
  const sections = document.querySelectorAll('section[id]');

  /* Sticky nav shadow on scroll */
  function handleNavScroll() {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 20);
  }

  /* Mobile menu toggle */
  function initMobileMenu() {
    if (!toggle || !mobileNav) return;

    toggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('is-open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileMenu();
    });
  }

  function closeMobileMenu() {
    if (!mobileNav || !toggle) return;
    mobileNav.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  /* Active section highlight */
  function initActiveSection() {
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((link) => {
              link.classList.toggle('is-active', link.dataset.section === id);
            });
            mobileNav?.querySelectorAll('a').forEach((link) => {
              const href = link.getAttribute('href');
              link.classList.toggle('is-active', href === `#${id}`);
            });
          }
        });
      },
      { threshold: 0.3, rootMargin: '-10% 0px -60% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();
  initMobileMenu();
  initActiveSection();
})();
