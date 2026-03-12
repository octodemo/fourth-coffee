<script>
  import { filterReviewsByScore, countByRating } from '../lib/reviews';

  let activeFilter = $state(0); // 0 = all

  function applyFilter(rating) {
    activeFilter = rating;
    const reviews = document.querySelectorAll('.reviews-list .review');
    reviews.forEach(el => {
      const r = Number(el.dataset.rating);
      const visible = filterReviewsByScore([{ rating: r, comment: '', author: '' }], rating).length > 0;
      el.style.display = visible ? '' : 'none';
    });
  }
</script>

<div class="review-filter">
  <span class="filter-label">Filter by rating:</span>
  <div class="filter-buttons">
    <button class:active={activeFilter === 0} onclick={() => applyFilter(0)}>All</button>
    {#each [5, 4, 3, 2, 1] as star}
      <button class:active={activeFilter === star} onclick={() => applyFilter(star)}>
        {star}★
      </button>
    {/each}
  </div>
</div>
