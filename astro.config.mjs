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
        'blog-home': 'components/storyblok/sections/blog-home',
        'call-to-action': 'components/storyblok/sections/call-to-action',
        'definition-home': 'components/storyblok/sections/definition-home',
        'hero-home': 'components/storyblok/sections/hero-home',
        'hero-horizontal': 'components/storyblok/sections/hero-horizontal',
        'hero-vertical': 'components/storyblok/sections/hero-vertical',
        'section': 'components/storyblok/sections/section',
        'section-horizontal': 'components/storyblok/sections/section-horizontal',
        'section-vertical': 'components/storyblok/sections/section-vertical',
        // UI
        'accordion-group': 'components/storyblok/ui/accordion-group',
        'accordion': 'components/storyblok/ui/accordion',
        'button': 'components/storyblok/ui/button',
        'button-group': 'components/storyblok/ui/button-group',
        'card-bento': 'components/storyblok/ui/card-bento',
        'card-icon-title-text-full': 'components/storyblok/ui/card-icon-title-text-full',
        'card-icon-title-text-light': 'components/storyblok/ui/card-icon-title-text-light',
        'card-icon-title-text-normal': 'components/storyblok/ui/card-icon-title-text-normal',
        'card-image-title-text': 'components/storyblok/ui/card-image-title-text',
        'code-block': 'components/storyblok/ui/code-block',
        'featured-technologies': 'components/storyblok/ui/featured-technologies',
        'grid': 'components/storyblok/ui/grid',
        'latest-articles': 'components/storyblok/ui/latest-articles',
        'spacer': 'components/storyblok/ui/spacer',
        'text': 'components/storyblok/ui/text',
        'footerAgency': 'components/ui/footer-agency',
        'footerLink': 'components/ui/footer-link',
        'footerLinkGroup': 'components/ui/footer-link-group',
      },
      apiOptions: {
        region: 'eu',
      },
    }),
  ],
  redirects: {
    '/creation-site-internet': '/site-internet',
    '/e-commerce': '/',
    '/services/creation-site-internet': '/site-internet',
    '/services/developpement-mobile': '/developpement-mobile',
    '/services/developpement-web': '/developpement-web',
    '/technologies/nestjs': '/technologies/nest-js',
    '/technologies/nextjs': '/technologies/next-js',
    '/technologies/nodejs': '/technologies/node-js',
    '/technologies/nuxtjs': '/technologies/nuxt-js',
    '/technologies/vue': '/technologies/vue-js',
    '/technologies/vuejs': '/technologies/vue-js',
  },
  vite: {
    plugins: [tailwindcss()]
  }
});