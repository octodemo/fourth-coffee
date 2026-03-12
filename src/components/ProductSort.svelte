<script>
  import { sortProducts, filterByRoast, getUniqueRoasts } from '../lib/product-sort';

  let { products } = $props();
  let sortBy = $state('name');
  let roastFilter = $state('All');

  let roasts = $derived(getUniqueRoasts(products));
  let filtered = $derived(filterByRoast(products, roastFilter));
  let sorted = $derived(sortProducts(filtered, sortBy));
</script>

<div class="filter-sort-bar">
  <div class="filter-control">
    <span>Roast:</span>
    <button class:active={roastFilter === 'All'} onclick={() => roastFilter = 'All'}>All</button>
    {#each roasts as roast}
      <button class:active={roastFilter === roast} onclick={() => roastFilter = roast}>{roast}</button>
    {/each}
  </div>
  <div class="sort-control">
    <span>Sort by:</span>
    <button class:active={sortBy === 'name'} onclick={() => sortBy = 'name'}>Name</button>
    <button class:active={sortBy === 'rating'} onclick={() => sortBy = 'rating'}>Star Rating</button>
  </div>
</div>

<div class="product-grid">
  {#each sorted as p (p.slug)}
    <article class="product-card">
      <span class="roast-badge" data-roast={p.roast.toLowerCase()}>{p.roast}</span>
      <h2>{p.name}</h2>
      <div class="card-rating">
        <span class="stars">{'★'.repeat(Math.round(p.avgRating))}{'☆'.repeat(5 - Math.round(p.avgRating))}</span>
        <span class="rating-value">{p.avgRating > 0 ? p.avgRating.toFixed(1) : 'No reviews'}</span>
      </div>
      <p class="price">${p.price.toFixed(2)}</p>
      <a class="btn" href={`/products/${p.slug}`}>View Details</a>
    </article>
  {/each}
</div>

<style>
  .filter-sort-bar {
    margin-bottom: 1.5rem;
  }
  .filter-control button,
  .sort-control button {
    color: #8b4513;
    background: none;
    border: 1px solid transparent;
    padding: 0.3rem 0.7rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.95rem;
  }
  .filter-control button.active,
  .sort-control button.active {
    background: #2c1810;
    color: #f5f0e8;
  }
  .filter-control button:hover:not(.active),
  .sort-control button:hover:not(.active) {
    border-color: #e0d6c8;
  }
</style>
