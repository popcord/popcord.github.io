(() => {
  const search = document.getElementById('command-search');
  const groups = [...document.querySelectorAll('[data-category]')];
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const results = document.getElementById('command-results');
  const empty = document.getElementById('commands-empty');
  if (!search || !groups.length) return;

  let activeCategory = 'all';
  const update = () => {
    const query = search.value.trim().toLocaleLowerCase();
    let total = 0;
    groups.forEach(group => {
      const categoryMatches = activeCategory === 'all' || group.dataset.category === activeCategory;
      const rows = [...group.querySelectorAll('[data-command-row]')];
      let visibleInGroup = 0;
      rows.forEach(row => {
        const matches = categoryMatches && row.dataset.search.includes(query);
        row.hidden = !matches;
        if (matches) visibleInGroup++;
      });
      group.hidden = !categoryMatches || visibleInGroup === 0;
      if (query && visibleInGroup > 0) group.open = true;
      if (!query && activeCategory !== 'all' && categoryMatches) group.open = true;
      total += visibleInGroup;
    });
    if (results) results.textContent = `Showing ${total} ${total === 1 ? 'command' : 'commands'}`;
    if (empty) empty.hidden = total !== 0;
  };

  search.addEventListener('input', update);
  filterButtons.forEach(button => button.addEventListener('click', () => {
    activeCategory = button.dataset.filter;
    filterButtons.forEach(item => {
      const selected = item === button;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    update();
  }));
  update();
})();
