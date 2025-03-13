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
  image: {
    domains: ["a.storyblok.com"],
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
        'call-to-action': 'components/storyblok/sections/call-to-action',
        'definition-home': 'components/storyblok/sections/definition-home',
        'hero-home': 'components/storyblok/sections/hero-home',
        'hero-horizontal': 'components/storyblok/sections/hero-horizontal',
        'hero-vertical': 'components/storyblok/sections/hero-vertical',
        'section-horizontal': 'components/storyblok/sections/section-horizontal',
        'section-vertical': 'components/storyblok/sections/section-vertical',
        // UI
        'button': 'components/storyblok/ui/button',
        'footerAgency': 'components/ui/footer-agency',
        'footerLink': 'components/ui/footer-link',
        'footerLinkGroup': 'components/ui/footer-link-group',
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
