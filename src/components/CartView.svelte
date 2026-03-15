<script>
  import { cart } from '../lib/cart.svelte';
</script>

{#if cart.items.length === 0}
  <div class="cart-empty">
    <p>Your cart is empty.</p>
    <a href="/products" class="btn">Browse Coffees</a>
  </div>
{:else}
  <div class="cart-items">
    {#each cart.items as item (item.slug)}
      <div class="cart-item">
        <div class="cart-item-info">
          <a href={`/products/${item.slug}`} class="cart-item-name">{item.name}</a>
          <p class="cart-item-price">${item.price.toFixed(2)} each</p>
        </div>
        <div class="cart-item-controls">
          <label>
            Qty:
            <select
              value={item.quantity}
              onchange={(e) => cart.updateQuantity(item.slug, Number(e.currentTarget.value))}
            >
              {#each [1,2,3,4,5,6,7,8,9,10] as n}
                <option value={n}>{n}</option>
              {/each}
            </select>
          </label>
          <span class="cart-item-subtotal">${(item.price * item.quantity).toFixed(2)}</span>
          <button class="cart-remove" onclick={() => cart.remove(item.slug)}>✕</button>
        </div>
      </div>
    {/each}
  </div>

  <div class="cart-footer">
    <div class="cart-total">
      <span>Total:</span>
      <span class="total-price">${cart.totalPrice.toFixed(2)}</span>
    </div>
    <div class="cart-actions">
      <button class="btn-clear" onclick={() => cart.clear()}>Clear Cart</button>
      <a href="/products" class="btn">Continue Shopping</a>
    </div>
  </div>
{/if}
