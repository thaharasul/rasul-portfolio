/**
 * Scroll — smooth anchor navigation, scroll-to-top button
 */

(function () {
  'use strict';

  const NAV_OFFSET = 72;
  const scrollTopBtn = document.getElementById('scrollTop');

  /* Smooth scroll for anchor links */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* Floating scroll-to-top button */
  function initScrollTop() {
    if (!scrollTopBtn) return;

    function toggleVisibility() {
      scrollTopBtn.classList.toggle('is-visible', window.scrollY > 500);
    }

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();
  }

  initSmoothScroll();
  initScrollTop();
})();
