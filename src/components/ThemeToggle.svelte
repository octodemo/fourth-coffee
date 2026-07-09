<script>
  let isDark = $state(false);

  $effect(() => {
    // Sync with the theme already set by the inline script in BaseLayout
    isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  });

  function toggle() {
    isDark = !isDark;
    const theme = isDark ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }
</script>

<button onclick={toggle} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
  {isDark ? '☀️' : '🌙'}
</button>

<style>
  button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0.25rem;
    line-height: 1;
    transition: opacity 0.2s;
  }

  button:hover {
    opacity: 0.8;
  }
</style>
