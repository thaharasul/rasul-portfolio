const INTRO_STORAGE_KEY = 'portfolioIntroSeen';
const ROOT_ID = 'introRoot';
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

async function mountIntro() {
  const [{ default: React, useEffect, useMemo, useState }, { default: ReactDOMClient }, { motion, AnimatePresence }] = await Promise.all([
    import('https://esm.sh/react@18.3.1'),
    import('https://esm.sh/react-dom@18.3.1/client'),
    import('https://esm.sh/framer-motion@11.0.0'),
  ]);

  const rootElement = document.getElementById(ROOT_ID);
  if (!rootElement) return;

  function createParticles(count = 22) {
    return Array.from({ length: count }, (_, index) => {
      const left = 6 + Math.random() * 88;
      const top = 6 + Math.random() * 88;
      const size = 2 + Math.random() * 3;
      const delay = Math.random() * 1.8;
      const duration = 3.8 + Math.random() * 1.4;
      const opacity = 0.08 + Math.random() * 0.14;
      return { id: index, left, top, size, delay, duration, opacity };
    });
  }

  let root = null;

  function IntroOverlay() {
    const [visibleTA, setVisibleTA] = useState(false);
    const [showLines, setShowLines] = useState(false);
    const [showPortfolio, setShowPortfolio] = useState(false);
    const [finished, setFinished] = useState(false);
    const particles = useMemo(() => createParticles(24), []);

    useEffect(() => {
      if (prefersReducedMotion) {
        finishIntro();
        return;
      }

      const timers = [
        window.setTimeout(() => setVisibleTA(true), 260),
        window.setTimeout(() => {
          setVisibleTA(false);
          setShowLines(true);
        }, 1500),
        window.setTimeout(() => setShowPortfolio(true), 2240),
        window.setTimeout(() => finishIntro(), 4700),
      ];

      return () => timers.forEach((timer) => window.clearTimeout(timer));
    }, []);

    function finishIntro(skip = false) {
      if (finished) return;
      setFinished(true);
      document.body.classList.remove('intro-active');
      document.body.style.overflow = '';
      window.sessionStorage.setItem(INTRO_STORAGE_KEY, 'true');
      window.setTimeout(() => {
        if (root) {
          root.unmount();
          if (rootElement) rootElement.innerHTML = '';
        }
      }, 780);
      if (!skip) {
        const hero = document.getElementById('hero');
        if (hero) hero.scrollIntoView({ behavior: 'smooth' });
      }
    }

    return (
      React.createElement(AnimatePresence, null,
        React.createElement(motion.div, {
          className: 'intro-root',
          initial: { opacity: 0 },
          animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
          exit: { opacity: 0, scale: 1.04, filter: 'blur(0.9px)' },
          transition: { type: 'spring', stiffness: 90, damping: 16, mass: 1, duration: 0.5 },
        },
          React.createElement('div', { className: 'intro__particles', 'aria-hidden': 'true' },
            particles.map((particle) => React.createElement('div', {
              key: particle.id,
              className: 'intro__particle',
              style: {
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              },
            }))
          ),
          React.createElement('div', { className: 'intro__stage' },
            React.createElement(motion.span, {
              className: 'intro__headline intro__headline--ta',
              initial: { opacity: 0, y: 18, scale: 0.96, filter: 'blur(2px)' },
              animate: visibleTA ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : { opacity: 0, y: -28, scale: 0.98, filter: 'blur(2.4px)' },
              transition: { duration: 0.92, ease: [0.22, 1, 0.36, 1] },
            }, 'வணக்கம்'),
            React.createElement(motion.div, {
              className: 'intro__line intro__line--welcome',
              initial: { opacity: 0, y: 20, scale: 0.96, filter: 'blur(2px)' },
              animate: showLines ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {},
              transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.06 },
            }, 'WELCOME'),
            React.createElement(motion.div, {
              className: 'intro__line intro__line--to-my',
              initial: { opacity: 0, y: 20, scale: 0.96, filter: 'blur(2px)' },
              animate: showLines ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {},
              transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.18 },
            }, 'to my'),
            React.createElement(motion.div, {
              className: 'intro__line intro__line--portfolio',
              initial: { opacity: 0, y: 26, scale: 0.96, filter: 'blur(2px)' },
              animate: showPortfolio ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {},
              transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.3 },
            }, 'PORTFOLIO'),
            React.createElement('button', {
              className: 'intro__skip',
              type: 'button',
              onClick: () => finishIntro(true),
            }, 'Skip Intro')
          )
        )
      )
    );
  }

  root = ReactDOMClient.createRoot(rootElement);
  root.render(React.createElement(IntroOverlay));
}

function initIntro() {
  const hasSeen = window.sessionStorage.getItem(INTRO_STORAGE_KEY) === 'true';
  if (hasSeen || prefersReducedMotion) {
    const rootElement = document.getElementById(ROOT_ID);
    if (rootElement) {
      rootElement.style.display = 'none';
    }
    document.body.classList.remove('intro-active');
    return;
  }

  mountIntro().catch((error) => {
    console.error('Intro mount failed:', error);
    const rootElement = document.getElementById(ROOT_ID);
    if (rootElement) {
      rootElement.style.display = 'none';
    }
    document.body.classList.remove('intro-active');
  });
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initIntro, { once: true });
} else {
  initIntro();
}
