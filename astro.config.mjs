// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import mkcert from 'vite-plugin-mkcert';

import { storyblok } from '@storyblok/astro';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

import expressiveCode from 'astro-expressive-code';

const env = loadEnv('', process.cwd(), 'STORYBLOK');

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  output: 'server',
  image: {
    domains: ['a.storyblok.com'],
    remotePatterns: [{ protocol: 'https' }],
  },
  integrations: [
    expressiveCode({
      defaultLocale: 'fr',
      styleOverrides: {
        codeBackground: '#191919',
        codeFontFamily:
          "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
      },
    }),
    react(),
    storyblok({
      accessToken: env.STORYBLOK_TOKEN,
      components: {
        // PAGES
        article: 'components/storyblok/pages/article',
        'blog-category': 'components/storyblok/pages/blog-category',
        definition: 'components/storyblok/pages/definition',
        page: 'components/storyblok/pages/page',
        technology: 'components/storyblok/pages/technology',
        'technology-category': 'components/storyblok/pages/technology-category',
        work: 'components/storyblok/pages/work',
        'work-category': 'components/storyblok/pages/work-category',
        // SECTIONS
        'blog-home': 'components/storyblok/sections/blog-home',
        'call-to-action': 'components/storyblok/sections/call-to-action',
        'contact-home': 'components/storyblok/sections/contact-home',
        'definition-home': 'components/storyblok/sections/definition-home',
        'hero-home': 'components/storyblok/sections/hero-home',
        'hero-horizontal': 'components/storyblok/sections/hero-horizontal',
        'hero-vertical': 'components/storyblok/sections/hero-vertical',
        section: 'components/storyblok/sections/section',
        'section-horizontal': 'components/storyblok/sections/section-horizontal',
        'section-vertical': 'components/storyblok/sections/section-vertical',
        'technology-home': 'components/storyblok/sections/technology-home',
        workHome: 'components/storyblok/sections/work-home',
        // UI
        'accordion-group': 'components/storyblok/ui/accordion-group',
        accordion: 'components/storyblok/ui/accordion',
        'agency-note': 'components/storyblok/ui/agency-note',
        button: 'components/storyblok/ui/button',
        'button-meeting': 'components/storyblok/ui/button-meeting',
        'button-group': 'components/storyblok/ui/button-group',
        'card-bento': 'components/storyblok/ui/card-bento',
        'card-icon-title-text-full': 'components/storyblok/ui/card-icon-title-text-full',
        'card-icon-title-text-light': 'components/storyblok/ui/card-icon-title-text-light',
        'card-icon-title-text-normal': 'components/storyblok/ui/card-icon-title-text-normal',
        'card-image-title-text': 'components/storyblok/ui/card-image-title-text',
        'code-block': 'components/storyblok/ui/code-block',
        'contact-widget': 'components/storyblok/ui/contact-widget',
        'featured-technologies': 'components/storyblok/ui/featured-technologies',
        'featured-testimonials': 'components/storyblok/ui/featured-testimonials',
        'featured-works': 'components/storyblok/ui/featured-works',
        grid: 'components/storyblok/ui/grid',
        'hero-aside-technology-logo': 'components/storyblok/ui/hero-aside-technology-logo',
        image: 'components/storyblok/ui/image',
        'latest-articles': 'components/storyblok/ui/latest-articles',
        'marquee-logos': 'components/storyblok/ui/marquee-logos',
        spacer: 'components/storyblok/ui/spacer',
        text: 'components/storyblok/ui/text',
        'navbar-dropdown': 'components/ui/navbar-dropdown',
        'navbar-column': 'components/ui/navbar-column',
        'navbar-link': 'components/ui/navbar-link',
        'navbar-sub-dropdown': 'components/ui/navbar-sub-dropdown',
        footerAgency: 'components/ui/footer-agency',
        footerLink: 'components/ui/footer-link',
        footerLinkGroup: 'components/ui/footer-link-group',
        // content
        'badge-title': 'components/storyblok/content/badge-title',
        'content-call-to-action': 'components/storyblok/content/content-call-to-action',
        'content-featured-testimonials':
          'components/storyblok/content/content-featured-testimonials',
      },
      apiOptions: {
        region: 'eu',
      },
    }),
  ],
  redirects: {
    '/blog/6-etapes-pour-developper-une-application-mobile':
      '/blog/application-mobile/6-etapes-pour-developper-une-application-mobile',
    '/blog/ameliorez-votre-seo-avec-les-donnees-structurees':
      '/blog/referencement-naturel/ameliorez-votre-seo-avec-les-donnees-structurees',
    '/blog/automatiser-la-prise-de-rendez-vous-en-ligne':
      '/blog/developpement-web/automatiser-la-prise-de-rendez-vous-en-ligne',
    '/blog/cms-headless': '/blog/developpement-web/cms-headless',
    '/blog/cms-strapi': '/blog/developpement-web/cms-strapi',
    '/blog/combien-coute-developpement-application-mobile':
      '/blog/application-mobile/combien-coute-developpement-application-mobile',
    '/blog/dette-technique-definition-et-impacts':
      '/blog/developpement-web/dette-technique-definition-et-impacts',
    '/blog/framework-php-definition-utilite-et-conseils':
      '/blog/developpement-web/framework-php-definition-utilite-et-conseils',
    '/blog/framework-sylius': '/blog/developpement-web/framework-sylius',
    '/blog/les-etapes-cles-de-la-creation-d-un-site-internet':
      '/blog/developpement-web/les-etapes-cles-de-la-creation-d-un-site-internet',
    '/blog/l-importance-du-sitemap-xml-en-seo':
      '/blog/referencement-naturel/l-importance-du-sitemap-xml-en-seo',
    '/blog/pourquoi-et-comment-developper-un-mvp':
      '/blog/developpement-web/pourquoi-et-comment-developper-un-mvp',
    '/blog/pourquoi-et-comment-faire-la-refonte-de-son-site-web':
      '/blog/developpement-web/pourquoi-et-comment-faire-la-refonte-de-son-site-web',
    '/blog/pourquoi-utiliser-le-framework-PHP-laravel':
      '/blog/developpement-web/pourquoi-utiliser-le-framework-PHP-laravel',
    '/blog/qu-est-ce-que-le-saas-definition-et-avantages':
      '/blog/developpement-web/qu-est-ce-que-le-saas-definition-et-avantages',
    '/blog/qu-est-ce-qu-une-agence-web': '/blog/marketing/qu-est-ce-qu-une-agence-web',
    '/blog/stripe-presentation-de-la-solution-de-paiement':
      '/blog/developpement-web/stripe-presentation-de-la-solution-de-paiement',
    '/creation-site-internet': '/site-internet',
    '/e-commerce': '/',
    '/realisations/garycorp': '/realisations',
    '/services/creation-site-internet': '/site-internet',
    '/services/developpement-mobile': '/application-mobile',
    '/services/developpement-web': '/developpement-web',
    '/technologies/adonijs': '/technologies',
    '/technologies/nestjs': '/technologies/nest-js',
    '/technologies/nextjs': '/technologies/next-js',
    '/technologies/nodejs': '/technologies/node-js',
    '/technologies/nuxtjs': '/technologies/nuxt-js',
    '/technologies/vue': '/technologies/vue-js',
    '/technologies/vuejs': '/technologies/vue-js',
  },
  vite: {
    plugins: [tailwindcss(), mkcert()],
  },
});
