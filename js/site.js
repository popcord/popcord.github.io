/* Shared PopCord interactions — no framework required. */
(() => {
  const root = document.documentElement;
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.getElementById('primary-navigation');
  const themeButton = document.getElementById('theme-toggle');

  const setTheme = (theme, persist = false) => {
    if (theme === 'light') root.dataset.theme = 'light';
    else delete root.dataset.theme;
    if (themeButton) {
      const isLight = theme === 'light';
      themeButton.setAttribute('aria-pressed', String(isLight));
      themeButton.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
      themeButton.innerHTML = `${isLight ? '☼' : '◐'} <span>Theme</span>`;
    }
    if (persist) {
      try { localStorage.setItem('popcord-theme', theme); } catch (_) { /* Storage may be unavailable. */ }
    }
  };

  try { setTheme(localStorage.getItem('popcord-theme') === 'light' ? 'light' : 'dark'); }
  catch (_) { setTheme('dark'); }

  themeButton?.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'light' ? 'dark' : 'light', true);
  });

  const closeMenu = (returnFocus = false) => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation menu');
    nav.classList.remove('is-open');
    if (returnFocus) menuButton.focus();
  };

  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    nav?.classList.toggle('is-open', open);
  });

  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;

    // Close the innermost open navigation disclosure first. Do not steal focus
    // when Escape is pressed elsewhere on the page and nothing is open.
    const openDisclosure = nav?.querySelector('details[open]');
    if (openDisclosure) {
      openDisclosure.removeAttribute('open');
      openDisclosure.querySelector('summary')?.focus();
      return;
    }

    const menuIsOpen = menuButton?.getAttribute('aria-expanded') === 'true'
      || nav?.classList.contains('is-open');
    if (menuIsOpen) closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (menuButton && nav && !nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) closeMenu();
  }, { passive: true });

  const year = document.querySelector('[data-current-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
