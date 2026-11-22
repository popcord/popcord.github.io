(() => {
  const search = document.getElementById('faq-search');
  const items = [...document.querySelectorAll('.faq-item')];
  const empty = document.getElementById('faq-empty');
  if (!search || !items.length) return;
  search.addEventListener('input', () => {
    const query = search.value.trim().toLocaleLowerCase();
    let visible = 0;
    items.forEach(item => {
      const match = item.textContent.toLocaleLowerCase().includes(query);
      item.hidden = !match;
      if (query && match) item.open = true;
      visible += Number(match);
    });
    if (empty) empty.hidden = visible !== 0;
  });
})();
