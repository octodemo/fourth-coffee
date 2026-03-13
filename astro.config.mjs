// @ts-check
import { defineConfig } from 'astro/config';

import db from '@astrojs/db';

import node from '@astrojs/node';

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  site: 'https://fourthcoffee.com',
  integrations: [db(), svelte()],

  adapter: node({
    mode: 'standalone'
  })
});