<script>
  let activeSort = $state('name');
  let ascending = $state(true);
  let minStars = $state(0);
  let maxStars = $state(5);

  function getCards() {
    const grid = document.querySelector('.product-grid');
    if (!grid) return { grid: null, cards: [] };
    return { grid, cards: [...grid.querySelectorAll('.product-card')] };
  }

  function applySort(sort) {
    activeSort = sort;
    reorder();
  }

  function toggleOrder() {
    ascending = !ascending;
    reorder();
  }

  function reorder() {
    const { grid, cards } = getCards();
    if (!grid) return;
    cards.sort((a, b) => {
      let cmp;
      if (activeSort === 'rating') {
        cmp = Number(a.dataset.rating) - Number(b.dataset.rating);
      } else {
        cmp = a.dataset.name.localeCompare(b.dataset.name);
      }
      return ascending ? cmp : -cmp;
    });
    cards.forEach(card => grid.appendChild(card));
  }

  function applyFilter() {
    const { cards } = getCards();
    cards.forEach(card => {
      const rating = Math.round(Number(card.dataset.rating));
      card.style.display = (rating >= minStars && rating <= maxStars) ? '' : 'none';
    });
  }

  function setMin(val) {
    minStars = val;
    if (maxStars < minStars) maxStars = minStars;
    applyFilter();
  }

  function setMax(val) {
    maxStars = val;
    if (minStars > maxStars) minStars = maxStars;
    applyFilter();
  }
</script>

<div class="product-controls">
  <div class="product-sort">
    <label for="sort-select">Sort by:</label>
    <select id="sort-select" value={activeSort} onchange={(e) => applySort(e.target.value)}>
      <option value="name">Name</option>
      <option value="rating">Rating</option>
    </select>
    <button class="order-toggle" onclick={toggleOrder} title={ascending ? 'Ascending' : 'Descending'}>
      {ascending ? '↑' : '↓'}
    </button>
  </div>

  <div class="product-filter">
    <span class="filter-label">Rating:</span>
    <select value={minStars} onchange={(e) => setMin(Number(e.target.value))}>
      {#each [0, 1, 2, 3, 4, 5] as s}
        <option value={s}>{s}★</option>
      {/each}
    </select>
    <span>to</span>
    <select value={maxStars} onchange={(e) => setMax(Number(e.target.value))}>
      {#each [0, 1, 2, 3, 4, 5] as s}
        <option value={s}>{s}★</option>
      {/each}
    </select>
  </div>
</div>

<style>
  .product-controls {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .product-sort,
  .product-filter {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  label, .filter-label {
    font-weight: 600;
    color: var(--text-secondary, #666);
  }

  select {
    padding: 0.4rem 0.6rem;
    border: 1px solid var(--border-color, #ddd);
    border-radius: 6px;
    font-size: 0.95rem;
    background: white;
    cursor: pointer;
  }

  .order-toggle {
    padding: 0.4rem 0.6rem;
    border: 1px solid var(--border-color, #ddd);
    border-radius: 6px;
    font-size: 1rem;
    background: white;
    cursor: pointer;
    line-height: 1;
  }

  .order-toggle:hover {
    background: var(--bg-hover, #f0f0f0);
  }
</style>
