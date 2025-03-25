// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import { storyblok } from '@storyblok/astro';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import expressiveCode from 'astro-expressive-code';

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
    expressiveCode({
      defaultLocale: 'fr',
      styleOverrides: {
        codeBackground: "#191919",
        codeFontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
      }
    }),
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
        'accordion-group': 'components/storyblok/ui/accordion-group',
        'accordion': 'components/storyblok/ui/accordion',
        'button': 'components/storyblok/ui/button',
        'button-group': 'components/storyblok/ui/button-group',
        'card-bento': 'components/storyblok/ui/card-bento',
        'card-icon-title-text-light': 'components/storyblok/ui/card-icon-title-text-light',
        'card-image-title-text': 'components/storyblok/ui/card-image-title-text',
        'code-block': 'components/storyblok/ui/code-block',
        'featured-technologies': 'components/storyblok/ui/featured-technologies',
        'grid': 'components/storyblok/ui/grid',
        'latest-articles': 'components/storyblok/ui/latest-articles',
        'spacer': 'components/storyblok/ui/spacer',
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