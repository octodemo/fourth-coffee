<script>
  import { actions } from 'astro:actions';
  
  let { slug, productName, price } = $props();
  let quantity = $state(1);
  let added = $state(false);
  let total = $derived(price * quantity);

  async function addToCart() {
    const data = await actions.addToCart.orThrow({ 
      slug, productName, quantity 
    });
    console.log(data.message);
    added = true;
    setTimeout(() => added = false, 2000);
  }
</script>

<div class="add-to-cart">
  <label>Qty: <select bind:value={quantity}>
    {#each [1,2,3,4,5] as n}<option value={n}>{n}</option>{/each}
  </select></label>
  <button class:added onclick={addToCart}>
    {added ? '✓ Added!' : `Add to Cart - $${total.toFixed(2)}`}
  </button>
</div>