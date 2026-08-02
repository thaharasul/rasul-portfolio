/**
 * Animations — scroll reveal, typewriter effect
 */

(function () {
  'use strict';

  /* Intersection Observer for scroll reveals */
  function initReveal() {
    const revealEls = document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale'
    );

    if (!revealEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
  }

  /* Premium intro experience */
  function initIntro() {
    const intro = document.getElementById('intro');
    const shell = document.getElementById('siteShell');
    if (!intro || !shell) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const alreadySeen = sessionStorage.getItem('portfolio-intro-seen');

    if (reducedMotion || alreadySeen) {
      document.body.classList.remove('intro-active');
      document.body.classList.add('intro-ready');
      return;
    }

    sessionStorage.setItem('portfolio-intro-seen', 'true');
    document.body.classList.add('intro-active');

    const words = Array.from(intro.querySelectorAll('.intro__word'));
    if (!words.length) {
      document.body.classList.remove('intro-active');
      document.body.classList.add('intro-ready');
      return;
    }

    function setActiveWord(index) {
      words.forEach((word, itemIndex) => {
        word.classList.toggle('is-visible', itemIndex === index);
        word.classList.toggle('is-hidden', itemIndex !== index);
      });
    }

    setActiveWord(0);

    const timers = words.map((_, index) => {
      return window.setTimeout(() => {
        setActiveWord(index);
      }, index * 500);
    });

    timers.push(window.setTimeout(() => {
      document.body.classList.remove('intro-active');
      document.body.classList.add('intro-ready');
    }, words.length * 500));
  }

  /* Animated role fading */
  function initTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;

    const roles = ['Applied AI Engineer', 'Python Developer'];
    let roleIndex = 0;
    const fadeDuration = 600;
    const visibleDuration = 1300;

    el.classList.add('role-fade');
    el.textContent = roles[roleIndex];

    requestAnimationFrame(() => {
      el.classList.add('visible');
    });

    function cycleRole() {
      el.classList.remove('visible');
      window.setTimeout(() => {
        roleIndex = (roleIndex + 1) % roles.length;
        el.textContent = roles[roleIndex];
        el.classList.add('visible');
      }, fadeDuration);
    }

    window.setInterval(cycleRole, visibleDuration + fadeDuration);
  }

  initReveal();
  initIntro();
  initTypewriter();
})();
