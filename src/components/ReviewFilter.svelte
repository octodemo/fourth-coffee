<script>
  let activeFilter = $state(0); // 0 = all

  function applyFilter(rating) {
    activeFilter = rating;
    const reviews = document.querySelectorAll('.reviews-list .review');
    reviews.forEach(el => {
      const r = Number(el.dataset.rating);
      el.style.display = (rating === 0 || r === rating) ? '' : 'none';
    });
  }
</script>

<div class="review-filter">
  <span class="filter-label">Filter by rating:</span>
  <div class="filter-buttons">
    <button class:active={activeFilter === 0} aria-pressed={activeFilter === 0} onclick={() => applyFilter(0)}>All</button>
    {#each [5, 4, 3, 2, 1] as star}
      <button class:active={activeFilter === star} aria-pressed={activeFilter === star} onclick={() => applyFilter(star)}>
        {star}★
      </button>
    {/each}
  </div>
</div>
