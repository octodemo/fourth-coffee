<script>
  import { actions } from 'astro:actions';

  let { products } = $props();

  let customerName = $state('');
  let customerEmail = $state('');
  let roastPreference = $state('Any');
  let productSlug = $state('');
  let frequency = $state('monthly');
  let bagSize = $state('12oz');
  let submitting = $state(false);
  let error = $state('');
  let subscription = $state(null);

  const bagSizeOptions = [
    { value: '12oz', label: '12 oz', priceMultiplier: 1.0 },
    { value: '1lb', label: '1 lb', priceMultiplier: 1.3 },
    { value: '2lb', label: '2 lb', priceMultiplier: 2.4 },
  ];

  const frequencyOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'bi-weekly', label: 'Every 2 Weeks' },
  ];

  let filteredProducts = $derived(
    roastPreference === 'Any'
      ? products
      : products.filter(p => p.roast === roastPreference)
  );

  let selectedProduct = $derived(
    products.find(p => p.slug === productSlug)
  );

  let selectedBagOption = $derived(
    bagSizeOptions.find(b => b.value === bagSize)
  );

  let estimatedPrice = $derived(
    selectedProduct && selectedBagOption
      ? (selectedProduct.price * selectedBagOption.priceMultiplier).toFixed(2)
      : null
  );

  // Reset product selection when roast filter changes and current selection is filtered out
  $effect(() => {
    if (productSlug && !filteredProducts.find(p => p.slug === productSlug)) {
      productSlug = '';
    }
  });

  async function handleSubmit() {
    error = '';
    submitting = true;
    try {
      const result = await actions.createSubscription({
        customerName,
        customerEmail,
        productSlug,
        roastPreference,
        frequency,
        bagSize,
      });
      if (result.error) {
        error = result.error.message || 'Something went wrong. Please try again.';
      } else {
        subscription = result.data;
      }
    } catch (err) {
      error = 'Something went wrong. Please try again.';
    } finally {
      submitting = false;
    }
  }
</script>

{#if subscription}
  <div class="subscription-confirmation">
    <div class="confirmation-icon">🎉</div>
    <h2>Subscription Confirmed!</h2>
    <p>Thanks, <strong>{subscription.customerName}</strong>! Your coffee subscription is all set.</p>

    <div class="confirmation-details">
      <h3>Subscription Details</h3>
      <dl>
        <dt>Coffee</dt>
        <dd>{selectedProduct?.name ?? subscription.productSlug}</dd>
        <dt>Roast Preference</dt>
        <dd>{subscription.roastPreference}</dd>
        <dt>Bag Size</dt>
        <dd>{bagSizeOptions.find(b => b.value === subscription.bagSize)?.label ?? subscription.bagSize}</dd>
        <dt>Delivery</dt>
        <dd>{frequencyOptions.find(f => f.value === subscription.frequency)?.label ?? subscription.frequency}</dd>
        <dt>Email</dt>
        <dd>{subscription.customerEmail}</dd>
        {#if estimatedPrice}
          <dt>Estimated Price</dt>
          <dd>${estimatedPrice} per delivery</dd>
        {/if}
      </dl>
    </div>

    <p class="confirmation-note">
      A confirmation email will be sent to <strong>{subscription.customerEmail}</strong>.
      Your first delivery will arrive within 5-7 business days.
    </p>
    <a href="/products" class="btn-subscribe">Browse More Coffees</a>
  </div>
{:else}
  <form class="subscription-form" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
    <h2>Set Up Your Subscription</h2>

    {#if error}
      <div class="subscription-error">{error}</div>
    {/if}

    <fieldset>
      <legend>Your Information</legend>
      <label>
        Name
        <input type="text" bind:value={customerName} required placeholder="Your full name" />
      </label>
      <label>
        Email
        <input type="email" bind:value={customerEmail} required placeholder="you@example.com" />
      </label>
    </fieldset>

    <fieldset>
      <legend>Choose Your Coffee</legend>
      <label>
        Roast Preference
        <select bind:value={roastPreference}>
          <option value="Any">Any Roast</option>
          <option value="Light">Light</option>
          <option value="Medium">Medium</option>
          <option value="Dark">Dark</option>
        </select>
      </label>

      <label>
        Coffee Selection
        <select bind:value={productSlug} required>
          <option value="" disabled>Select a coffee...</option>
          {#each filteredProducts as product}
            <option value={product.slug}>
              {product.name} — ${product.price.toFixed(2)}
            </option>
          {/each}
        </select>
      </label>
      {#if filteredProducts.length === 0}
        <p class="form-hint">No coffees match this roast. Try a different preference.</p>
      {/if}
    </fieldset>

    <fieldset>
      <legend>Delivery Options</legend>
      <label>
        Frequency
        <select bind:value={frequency}>
          {#each frequencyOptions as opt}
            <option value={opt.value}>{opt.label}</option>
          {/each}
        </select>
      </label>

      <label>
        Bag Size
        <div class="bag-size-options">
          {#each bagSizeOptions as opt}
            <label class="bag-size-option" class:selected={bagSize === opt.value}>
              <input type="radio" name="bagSize" value={opt.value} bind:group={bagSize} />
              <span class="bag-size-label">{opt.label}</span>
            </label>
          {/each}
        </div>
      </label>
    </fieldset>

    {#if selectedProduct && estimatedPrice}
      <div class="price-summary">
        <strong>{selectedProduct.name}</strong> • {bagSizeOptions.find(b => b.value === bagSize)?.label} •
        {frequencyOptions.find(f => f.value === frequency)?.label}
        <span class="price-amount">${estimatedPrice} / delivery</span>
      </div>
    {/if}

    <button type="submit" class="btn-subscribe" disabled={submitting || !productSlug}>
      {submitting ? 'Setting up...' : 'Start My Subscription'}
    </button>
  </form>
{/if}
