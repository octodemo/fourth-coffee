<script>
  let searchQuery = $state('');
  let activeRoast = $state('all'); // 'all', 'light', 'medium', 'dark'

  function applyFilters() {
    const query = searchQuery.toLowerCase().trim();
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
      const name = card.dataset.name || '';
      const origin = card.dataset.origin || '';
      const roast = card.dataset.roast || '';

      // Filter by roast level
      const roastMatch = activeRoast === 'all' || roast === activeRoast;

      // Filter by search query
      const searchMatch = query === '' ||
                         name.includes(query) ||
                         origin.includes(query) ||
                         roast.includes(query);

      card.style.display = (roastMatch && searchMatch) ? '' : 'none';
    });
  }

  function handleInput() {
    applyFilters();
  }

  function setRoast(roast) {
    activeRoast = roast;
    applyFilters();
  }

  function clearSearch() {
    searchQuery = '';
    activeRoast = 'all';
    applyFilters();
  }
</script>

<div class="product-search">
  <div class="search-input-group">
    <input
      type="text"
      bind:value={searchQuery}
      oninput={handleInput}
      placeholder="Search by name, origin, or roast..."
      class="search-input"
    />
    {#if searchQuery || activeRoast !== 'all'}
      <button class="clear-btn" onclick={clearSearch}>Clear</button>
    {/if}
  </div>

  <div class="roast-filters">
    <span class="filter-label">Roast:</span>
    <div class="filter-buttons">
      <button
        class:active={activeRoast === 'all'}
        onclick={() => setRoast('all')}
      >
        All
      </button>
      <button
        class:active={activeRoast === 'light'}
        onclick={() => setRoast('light')}
      >
        Light
      </button>
      <button
        class:active={activeRoast === 'medium'}
        onclick={() => setRoast('medium')}
      >
        Medium
      </button>
      <button
        class:active={activeRoast === 'dark'}
        onclick={() => setRoast('dark')}
      >
        Dark
      </button>
    </div>
  </div>
</div>

<style>
  .product-search {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: #fff;
    border: 1px solid #e0d6c8;
    border-radius: 8px;
  }

  .search-input-group {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .search-input {
    flex: 1;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border: 1px solid #e0d6c8;
    border-radius: 4px;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .search-input:focus {
    outline: none;
    border-color: #8b4513;
  }

  .clear-btn {
    padding: 0.75rem 1.5rem;
    background: #fff;
    border: 1px solid #e0d6c8;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.95rem;
    color: #2c1810;
    transition: all 0.15s;
    font-weight: 500;
  }

  .clear-btn:hover {
    border-color: #8b4513;
    background: #faf8f5;
  }

  .roast-filters {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .filter-label {
    font-weight: 600;
    color: #2c1810;
    font-size: 0.95rem;
  }

  .filter-buttons {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
  }

  .filter-buttons button {
    background: #fff;
    border: 1px solid #e0d6c8;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    color: #2c1810;
    transition: all 0.15s;
    font-weight: 500;
  }

  .filter-buttons button:hover {
    border-color: #8b4513;
  }

  .filter-buttons button.active {
    background: #2c1810;
    color: #f5f0e8;
    border-color: #2c1810;
  }
</style>
