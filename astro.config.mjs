// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import { storyblok } from '@storyblok/astro';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

const env = loadEnv("", process.cwd(), 'STORYBLOK');

// https://astro.build/config
export default defineConfig({
  experimental: {
    svg: true,
  },
  integrations: [
    react(),
    storyblok({
      accessToken: env.STORYBLOK_TOKEN,
      components: {
        // PAGES
        'article': 'components/storyblok/pages/article',
        'definition': 'components/storyblok/pages/definition',
        'page': 'components/storyblok/pages/page',
        'technology': 'components/storyblok/pages/technology',
        'work': 'components/storyblok/pages/work',
        // SECTIONS
        // UI
      },
      apiOptions: {
        region: 'eu',
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
