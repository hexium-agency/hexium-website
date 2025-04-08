// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import { storyblok } from '@storyblok/astro';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';
import vercel from '@astrojs/vercel';


import expressiveCode from 'astro-expressive-code';

const env = loadEnv("", process.cwd(), 'STORYBLOK');

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  output: 'server',
  experimental: {
    svg: true,
  },
  image: {
    domains: ["a.storyblok.com"],
    remotePatterns: [{ protocol: "https" }],
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
        'blog-category': 'components/storyblok/pages/blog-category',
        'definition': 'components/storyblok/pages/definition',
        'page': 'components/storyblok/pages/page',
        'technology': 'components/storyblok/pages/technology',
        'work': 'components/storyblok/pages/work',
        'work-category': 'components/storyblok/pages/work-category',
        // SECTIONS
        'blog-home': 'components/storyblok/sections/blog-home',
        'call-to-action': 'components/storyblok/sections/call-to-action',
        'contact-home': 'components/storyblok/sections/contact-home',
        'definition-home': 'components/storyblok/sections/definition-home',
        'hero-home': 'components/storyblok/sections/hero-home',
        'hero-horizontal': 'components/storyblok/sections/hero-horizontal',
        'hero-vertical': 'components/storyblok/sections/hero-vertical',
        'section': 'components/storyblok/sections/section',
        'section-horizontal': 'components/storyblok/sections/section-horizontal',
        'section-vertical': 'components/storyblok/sections/section-vertical',
        'workHome': 'components/storyblok/sections/work-home',
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
        'navbar-dropdown': 'components/ui/navbar-dropdown',
        'navbar-column': 'components/ui/navbar-column',
        'navbar-link': 'components/ui/navbar-link',
        'navbar-sub-dropdown': 'components/ui/navbar-sub-dropdown',
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