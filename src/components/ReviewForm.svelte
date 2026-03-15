<script>
  import { actions } from 'astro:actions';
  import StarPicker from './StarRating.svelte';
  let { slug } = $props();
  let author = $state('');
  let rating = $state(0);
  let comment = $state('');
  let submitted = $state(false);

  async function submitReview() {
    await actions.addReview({ slug, author, rating, comment });
    console.log(`Review for ${slug}: ${author} gives ${rating} stars — "${comment}"`);
    submitted = true;
  }
</script>

{#if submitted}
  <div class="review your-review">
    <span class="your-review-badge">Thanks for your review!</span>
    <p class="stars" role="img" aria-label={`${rating} out of 5 stars`}>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</p>
    <p class="review-comment">"{comment}"</p>
    <p class="review-author">— {author}</p>
  </div>
{:else}
  <form class="review-form" onsubmit={(e) => { e.preventDefault(); submitReview(); }}>
    <h4>Leave a Review</h4>
    <label>Name<input type="text" bind:value={author} required /></label>
    <StarPicker bind:rating />
    <label>Your thoughts<textarea bind:value={comment} rows="3" required></textarea></label>
    <button type="submit" disabled={rating === 0}>Submit Review</button>
  </form>
{/if}