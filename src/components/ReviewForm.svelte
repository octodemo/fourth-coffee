<script>
  import { actions } from 'astro:actions';
  import StarPicker from './StarRating.svelte';
  let { slug } = $props();
  let author = $state('');
  let rating = $state(0);
  let comment = $state('');
  let formError = $state('');
  let fieldErrors = $state({ author: '', rating: '', comment: '' });
  let submitting = $state(false);
  let submitted = $state(false);

  function resetErrors() {
    formError = '';
    fieldErrors = { author: '', rating: '', comment: '' };
  }

  async function submitReview() {
    if (submitting) return;
    submitted = false;
    resetErrors();
    submitting = true;

    try {
      const result = await actions.addReview({ slug, author, rating, comment });

      if (result.error) {
        const fields = result.error.fields ?? {};
        fieldErrors = {
          author: fields.author?.[0] ?? '',
          rating: fields.rating?.[0] ?? '',
          comment: fields.comment?.[0] ?? '',
        };
        const hasFieldErrors = Object.values(fieldErrors).some(Boolean);
        formError = hasFieldErrors
          ? 'Please fix the highlighted fields.'
          : result.error.message ?? 'Unable to submit your review right now.';
        return;
      }

      console.log(`Review for ${slug}: ${author} gives ${rating} stars — "${comment}"`);
      submitted = true;
    } catch (err) {
      formError = 'Unable to submit your review right now. Please try again.';
    } finally {
      submitting = false;
    }
  }
</script>

{#if submitted}
  <div class="review your-review">
    <span class="your-review-badge">Thanks for your review!</span>
    <p class="stars">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</p>
    <p class="review-comment">"{comment}"</p>
    <p class="review-author">— {author}</p>
  </div>
{:else}
  <form class="review-form" onsubmit={async (e) => { e.preventDefault(); await submitReview(); }}>
    <h4>Leave a Review</h4>
    {#if formError}
      <div class="form-error" role="alert">{formError}</div>
    {/if}
    <label class:error={Boolean(fieldErrors.author)}>
      Name
      <input
        type="text"
        bind:value={author}
        aria-invalid={Boolean(fieldErrors.author)}
        required
      />
      {#if fieldErrors.author}<p class="error-text">{fieldErrors.author}</p>{/if}
    </label>
    <div class="rating-field" class:error={Boolean(fieldErrors.rating)} aria-invalid={Boolean(fieldErrors.rating)}>
      <span class="rating-label">Rating</span>
      <StarPicker bind:rating />
      {#if fieldErrors.rating}<p class="error-text">{fieldErrors.rating}</p>{/if}
    </div>
    <label class:error={Boolean(fieldErrors.comment)}>
      Your thoughts
      <textarea
        bind:value={comment}
        rows="3"
        aria-invalid={Boolean(fieldErrors.comment)}
        required
      ></textarea>
      {#if fieldErrors.comment}<p class="error-text">{fieldErrors.comment}</p>{/if}
    </label>
    <button type="submit" disabled={rating === 0 || submitting}>
      {submitting ? 'Submitting...' : 'Submit Review'}
    </button>
  </form>
{/if}
