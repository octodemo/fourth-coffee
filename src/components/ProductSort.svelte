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
    <span class="control-label">Sort by:</span>
    <div class="sort-buttons">
      <button class:active={activeSort === 'name'} aria-pressed={activeSort === 'name'} onclick={() => applySort('name')}>Name</button>
      <button class:active={activeSort === 'rating'} aria-pressed={activeSort === 'rating'} onclick={() => applySort('rating')}>Highest Rated</button>
    </div>
    <button class="order-toggle" class:active={!ascending} onclick={toggleOrder} aria-label={ascending ? 'Sort ascending. Click to sort descending' : 'Sort descending. Click to sort ascending'}>
      {ascending ? '↑' : '↓'}
    </button>
  </div>

  <div class="divider"></div>

  <div class="product-filter">
    <span class="control-label">⭐ Rating:</span>
    <div class="star-range">
      <select value={minStars} onchange={(e) => setMin(Number(e.target.value))}>
        {#each [0, 1, 2, 3, 4, 5] as s}
          <option value={s}>{s}★</option>
        {/each}
      </select>
      <span class="range-sep">to</span>
      <select value={maxStars} onchange={(e) => setMax(Number(e.target.value))}>
        {#each [0, 1, 2, 3, 4, 5] as s}
          <option value={s}>{s}★</option>
        {/each}
      </select>
    </div>
  </div>
</div>

<style>
  .product-controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    background: #fff8f0;
    border: 1px solid #e0d6c8;
    border-radius: 10px;
    padding: 0.6rem 1rem;
  }

  .product-sort,
  .product-filter {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .control-label {
    font-weight: 700;
    font-size: 0.9rem;
    color: #2c1810;
    white-space: nowrap;
  }

  .sort-buttons {
    display: flex;
    gap: 0.25rem;
  }

  .sort-buttons button,
  .order-toggle {
    background: #fff;
    border: 1px solid #e0d6c8;
    color: #2c1810;
    padding: 0.35rem 0.75rem;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    line-height: 1.2;
  }

  .sort-buttons button:hover,
  .order-toggle:hover {
    border-color: #8b4513;
    color: #8b4513;
  }

  .sort-buttons button.active {
    background: #2c1810;
    color: #f5f0e8;
    border-color: #2c1810;
  }

  .order-toggle {
    font-size: 1rem;
    padding: 0.35rem 0.6rem;
  }

  .order-toggle.active {
    background: #8b4513;
    color: #f5f0e8;
    border-color: #8b4513;
  }

  .divider {
    width: 1px;
    height: 1.6rem;
    background: #e0d6c8;
    flex-shrink: 0;
  }

  .star-range {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .star-range select {
    padding: 0.35rem 0.5rem;
    border: 1px solid #e0d6c8;
    border-radius: 6px;
    font-size: 0.9rem;
    background: #fff;
    color: #2c1810;
    cursor: pointer;
    font-weight: 500;
    transition: border-color 0.15s;
  }

  .star-range select:hover,
  .star-range select:focus {
    border-color: #8b4513;
    outline: none;
  }

  .range-sep {
    font-size: 0.85rem;
    color: #555;
    font-weight: 500;
  }
</style>
