(() => {
  'use strict';
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let cleanup = () => {};
  function enhance(page) {
    cleanup();
    if (preference.matches) return;
    const animations = new Set();
    const targets = page.querySelectorAll(
      '.story-section > div, .about-section > h2, .about-section > p, ' +
      '#que-recibes > div > div, .audience-section > div > div, ' +
      '.steps-section > div > div, #suscripcion > div > div, .closing-section > h2'
    );
    let observer;
    if ('IntersectionObserver' in window && 'animate' in Element.prototype) {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          const animation = entry.target.animate([
            { opacity: .25, transform: 'translateY(18px)' },
            { opacity: 1, transform: 'translateY(0)' }
          ], { duration: 650, easing: 'cubic-bezier(.2,.7,.3,1)' });
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        });
      }, { threshold: .12 });
      targets.forEach(target => {
        // El contenido que ya se está leyendo no vuelve a animarse.
        if (target.getBoundingClientRect().top >= window.innerHeight) observer.observe(target);
      });
    }
    const progress = document.createElement('div');
    progress.className = 'reading-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.append(progress);
    let frame = 0;
    function update() {
      frame = 0;
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = distance > 0 ? Math.max(0, Math.min(1, window.scrollY / distance)) : 0;
      progress.style.transform = `scaleX(${ratio})`;
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const resize = 'ResizeObserver' in window ? new ResizeObserver(schedule) : null;
    resize?.observe(page);
    update();
    cleanup = () => {
      observer?.disconnect();
      resize?.disconnect();
      animations.forEach(animation => animation.cancel());
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
      progress.remove();
    };
  }
  function start() {
    const page = document.querySelector('#dc-root .cartas-page');
    if (!page) return false;
    enhance(page);
    preference.addEventListener('change', () => enhance(page));
    return true;
  }
  if (!start()) {
    const mount = new MutationObserver(() => { if (start()) mount.disconnect(); });
    mount.observe(document.body, { childList: true, subtree: true });
  }
})();
