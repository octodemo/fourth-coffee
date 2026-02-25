<script>
  let { rating = $bindable(0) } = $props();
  let hoverRating = $state(0);
</script>

<div class="star-picker" role="radiogroup" aria-label="Rating" tabindex="0" onmouseleave={() => hoverRating = 0}>
  {#each [1, 2, 3, 4, 5] as star}
    <span
      class="star"
      role="radio"
      tabindex="0"
      aria-checked={rating === star}
      aria-label="{star} star{star > 1 ? 's' : ''}"
      class:filled={star <= (hoverRating || rating)}
      onmouseenter={() => hoverRating = star}
      onclick={() => rating = star}
      onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); rating = star; } }}
    >★</span>
  {/each}
</div>