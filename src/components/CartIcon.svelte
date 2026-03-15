<script>
  import { cart } from '../lib/cart.svelte';
</script>

<a href="/cart" class="cart-link">
  🛒
  {#if cart.totalItems > 0}
    <span class="cart-count">{cart.totalItems}</span>
  {/if}
</a>

<style>
  .cart-link {
    color: #f5f0e8;
    text-decoration: none;
    font-size: 1.25rem;
    position: relative;
  }

  .cart-count {
    position: absolute;
    top: -8px;
    right: -10px;
    background: #d4a017;
    color: #2c1810;
    font-size: 0.7rem;
    font-weight: 700;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
