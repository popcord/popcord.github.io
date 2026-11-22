/* PopCord Motion System — GSAP 3.15 + ScrollTrigger.
   Progressive enhancement: every content element is visible without JavaScript,
   if the CDN fails, or when the visitor requests reduced motion. */
(() => {
  'use strict';

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger || !document.body) return;

  gsap.registerPlugin(ScrollTrigger);

  const media = gsap.matchMedia();

  media.add({
    reduceMotion: '(prefers-reduced-motion: reduce)',
    motionOK: '(prefers-reduced-motion: no-preference)',
    desktop: '(min-width: 960px)',
    finePointer: '(hover: hover) and (pointer: fine)'
  }, conditions => {
    const { reduceMotion, motionOK, desktop, finePointer } = conditions.conditions;
    if (reduceMotion || !motionOK) return undefined;

    const cleanups = [];
    const context = gsap.context(() => {
      // Scroll progress is a 2px transform-only layer; it reserves no layout space.
      const progress = document.createElement('div');
      progress.className = 'scroll-progress';
      progress.setAttribute('aria-hidden', 'true');
      progress.innerHTML = '<span></span>';
      document.body.prepend(progress);
      const progressFill = progress.firstElementChild;

      gsap.to(progressFill, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'max',
          scrub: 0.2,
          invalidateOnRefresh: true
        }
      });

      // Sticky navigation gains contrast only after the visitor starts scrolling.
      const header = document.querySelector('.site-header');
      if (header) {
        ScrollTrigger.create({
          start: 28,
          end: 'max',
          toggleClass: { targets: header, className: 'is-scrolled' }
        });
      }

      // Home: one staged entrance ties the wordmark, copy and calls to action together.
      const hero = document.querySelector('.hero');
      if (hero) {
        const eyebrow = hero.querySelector('.hero-copy .eyebrow');
        const words = hero.querySelectorAll('.hero h1 .hero-word');
        const dot = hero.querySelector('.hero-dot');
        const description = hero.querySelector('.hero-description');
        const buttons = hero.querySelectorAll('.hero-actions .button');
        const note = hero.querySelector('.hero-note');
        const intro = gsap.timeline({ delay: 0.06, defaults: { ease: 'power3.out' } });

        if (eyebrow) intro.from(eyebrow, { y: 14, autoAlpha: 0, duration: 0.48 });
        if (words.length) intro.from(words, {
          yPercent: 72,
          autoAlpha: 0,
          duration: 0.78,
          stagger: 0.09,
          ease: 'expo.out'
        }, '-=0.12');
        if (dot) intro.from(dot, { scale: 0.3, autoAlpha: 0, duration: 0.4, ease: 'back.out(2)' }, '-=0.42');
        if (description) intro.from(description, { y: 14, autoAlpha: 0, duration: 0.56 }, '-=0.25');
        if (buttons.length) intro.from(buttons, { y: 10, autoAlpha: 0, duration: 0.42, stagger: 0.09 }, '-=0.24');
        if (note) intro.from(note, { autoAlpha: 0, duration: 0.35 }, '-=0.15');

        const visual = hero.querySelector('.hero-visual');
        const logo = visual?.querySelector('img');
        const orbits = visual?.querySelectorAll('.visual-orbit');

        if (logo) {
          gsap.fromTo(logo,
            { autoAlpha: 0, scale: 0.9, rotation: -4 },
            { autoAlpha: 1, scale: 1, rotation: 0, duration: 1.05, delay: 0.12, ease: 'expo.out' }
          );
          gsap.to(logo, {
            y: -7,
            duration: 4.2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 1.1
          });
        }

        if (orbits?.length) {
          gsap.from(orbits, { scale: 0.88, autoAlpha: 0, duration: 0.9, stagger: 0.12, ease: 'power2.out' });
          gsap.to(orbits[0], { rotation: 360, duration: 78, repeat: -1, ease: 'none' });
          if (orbits[1]) gsap.to(orbits[1], { rotation: -360, duration: 112, repeat: -1, ease: 'none' });
        }

        // Cursor response is restricted to large, fine-pointer screens.
        if (visual && logo && desktop && finePointer) {
          const moveX = gsap.quickTo(logo, 'x', { duration: 0.58, ease: 'power3.out' });
          const tiltY = gsap.quickTo(logo, 'rotationY', { duration: 0.58, ease: 'power3.out' });
          gsap.set(logo, { transformPerspective: 900, transformOrigin: '50% 50%' });
          let frame = 0;
          let pointerX = 0;

          const onPointerMove = event => {
            pointerX = event.clientX;
            if (frame) return;
            frame = window.requestAnimationFrame(() => {
              frame = 0;
              const bounds = visual.getBoundingClientRect();
              const ratio = (pointerX - (bounds.left + bounds.width / 2)) / Math.max(bounds.width / 2, 1);
              moveX(gsap.utils.clamp(-11, 11, ratio * 11));
              tiltY(gsap.utils.clamp(-4, 4, ratio * 4));
            });
          };
          const resetPointer = () => {
            moveX(0);
            tiltY(0);
          };

          visual.addEventListener('pointermove', onPointerMove, { passive: true });
          visual.addEventListener('pointerleave', resetPointer, { passive: true });
          cleanups.push(() => {
            visual.removeEventListener('pointermove', onPointerMove);
            visual.removeEventListener('pointerleave', resetPointer);
            if (frame) window.cancelAnimationFrame(frame);
          });
        }

        // A restrained scroll parallax, disabled on touch/small layouts.
        if (visual && desktop) {
          gsap.to(visual, {
            y: -28,
            ease: 'none',
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.7
            }
          });
        }
      }

      // The same reveal language is shared across the five pages, but applied
      // only to section-level elements to avoid a cascade of tiny animations.
      const revealSelector = [
        '.intro-strip-inner',
        '.section-heading',
        '.feature-row',
        '.faq-intro',
        '.faq-item',
        '.final-cta',
        '.page-hero .eyebrow',
        '.page-hero h1',
        '.page-hero .page-description',
        '.command-meta',
        '.explorer-heading',
        '.category-filters',
        '.results-count',
        '.command-group',
        '.catalogue-note',
        '.chat-heading > *',
        '.chat-shell',
        '.privacy-aside',
        '.policy-section',
        '.error-main .error-number',
        '.error-main h1',
        '.error-main > p:not(.eyebrow)',
        '.error-main > .button',
        '.site-footer .footer-inner'
      ].join(',');

      document.querySelectorAll(revealSelector).forEach((element, index) => {
        if (element.closest('.hero')) return;
        gsap.fromTo(element,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.66,
            delay: index % 3 === 0 ? 0.025 : 0,
            ease: 'power3.out',
            clearProps: 'transform,opacity,visibility',
            scrollTrigger: {
              trigger: element,
              start: 'top 88%',
              once: true
            }
          }
        );
      });

      // Open details panels get a short content entrance; closed content is untouched.
      document.querySelectorAll('.command-group, .faq-item').forEach(details => {
        const onToggle = () => {
          if (!details.open) return;
          const targets = details.classList.contains('command-group')
            ? details.querySelectorAll('.command-row:not([hidden])')
            : details.querySelectorAll('.faq-answer');
          if (!targets.length) return;
          gsap.fromTo(targets,
            { autoAlpha: 0, y: 7 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.34,
              stagger: details.classList.contains('command-group') ? 0.015 : 0,
              ease: 'power2.out',
              clearProps: 'transform,opacity,visibility'
            }
          );
        };
        details.addEventListener('toggle', onToggle);
        cleanups.push(() => details.removeEventListener('toggle', onToggle));
      });

      // A very small magnetic response adds tactile feedback on desktop only.
      if (finePointer && desktop) {
        document.querySelectorAll('.button-primary').forEach(button => {
          const moveX = gsap.quickTo(button, 'x', { duration: 0.25, ease: 'power2.out' });
          const moveY = gsap.quickTo(button, 'y', { duration: 0.25, ease: 'power2.out' });
          const onMove = event => {
            const bounds = button.getBoundingClientRect();
            if (!bounds.width || !bounds.height) return;
            moveX(((event.clientX - bounds.left) / bounds.width - 0.5) * 4);
            moveY(((event.clientY - bounds.top) / bounds.height - 0.5) * 3);
          };
          const reset = () => { moveX(0); moveY(0); };
          button.addEventListener('pointermove', onMove, { passive: true });
          button.addEventListener('pointerleave', reset, { passive: true });
          cleanups.push(() => {
            button.removeEventListener('pointermove', onMove);
            button.removeEventListener('pointerleave', reset);
          });
        });
      }

      // Animate the mobile menu after the shared navigation script updates aria-expanded.
      const menuButton = document.querySelector('.menu-toggle');
      const nav = document.getElementById('primary-navigation');
      if (menuButton && nav) {
        let menuFrame = 0;
        const onMenuClick = () => {
          if (menuFrame) window.cancelAnimationFrame(menuFrame);
          menuFrame = window.requestAnimationFrame(() => {
            menuFrame = 0;
            if (menuButton.getAttribute('aria-expanded') !== 'true') return;
            const links = nav.querySelectorAll('.nav-link, .nav-dropdown');
            gsap.fromTo(links,
              { autoAlpha: 0, y: 8 },
              { autoAlpha: 1, y: 0, duration: 0.28, stagger: 0.03, ease: 'power2.out', clearProps: 'transform,opacity,visibility' }
            );
          });
        };
        menuButton.addEventListener('click', onMenuClick);
        cleanups.push(() => {
          menuButton.removeEventListener('click', onMenuClick);
          if (menuFrame) window.cancelAnimationFrame(menuFrame);
        });
      }

      // Recalculate positions after web fonts and imagery settle, without polling.
      const refreshAfterLoad = () => ScrollTrigger.refresh();
      if (document.readyState === 'complete') {
        window.requestAnimationFrame(refreshAfterLoad);
      } else {
        window.addEventListener('load', refreshAfterLoad, { once: true });
        cleanups.push(() => window.removeEventListener('load', refreshAfterLoad));
      }

      if (document.fonts?.ready) {
        document.fonts.ready.then(() => {
          if (document.visibilityState !== 'hidden') ScrollTrigger.refresh();
        }).catch(() => {});
      }
    }, document.body);

    return () => {
      cleanups.forEach(cleanup => cleanup());
      context.revert();
    };
  });

  // Keep the GSAP matchMedia instance reachable for diagnostics without leaking internals.
  window.PopCordMotion = { version: gsap.version, scrollTrigger: true };
})();
