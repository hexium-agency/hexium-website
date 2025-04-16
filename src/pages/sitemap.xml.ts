import { type ISbStoryData } from '@storyblok/astro';
import storyblokService from '@/services/storyblok';
import blogService from '@/services/blog';
import type { ArticleStoryblok, BlogCategoryStoryblok } from '@/types/storyblok';

interface SitemapEntry {
  loc: string;
  lastmod: string;
}

export const prerender = true;

function createSitemapEntry(story: ISbStoryData<unknown>): SitemapEntry {
  return {
    loc: `${import.meta.env.WEBSITE_URL}/${story.full_slug}`,
    lastmod: story.published_at || story.created_at,
  };
}

export async function GET() {
  const entries: SitemapEntry[] = [];

  const articles = await storyblokService.getAllStories('article').then((articles) => {
    return articles.map((article) => {
      return createSitemapEntry({
        ...article,
        full_slug: `blog/${((article.content as ArticleStoryblok).category[0] as ISbStoryData<BlogCategoryStoryblok>).slug}/${article.slug}`,
      });
    });
  });

  const blogCategories = await storyblokService
    .getAllStories('blogCategory')
    .then((blogCategories) => {
      return blogCategories.map((blogCategory) => {
        return createSitemapEntry(blogCategory);
      });
    });

  const getTotalBlogHomePages = await blogService.getTotal();

  for (let i = 2; i <= getTotalBlogHomePages; i++) {
    const latestArticles = await blogService.getLatest();
    entries.push({
      loc: `${import.meta.env.WEBSITE_URL}/blog/page/${i}`,
      lastmod: latestArticles[0].published_at || latestArticles[0].created_at,
    });
  }

  const getAllBlogCategories = await blogService.getCategories();

  for (const blogCategory of getAllBlogCategories) {
    const categoryTotalPages = await blogService.getTotal(blogCategory.uuid);
    const latestArticles = await blogService.getLatest(blogCategory.uuid);

    for (let i = 2; i <= categoryTotalPages; i++) {
      entries.push({
        loc: `${import.meta.env.WEBSITE_URL}/${blogCategory.full_slug}/page/${i}`,
        lastmod: latestArticles[0].published_at || latestArticles[0].created_at,
      });
    }
  }

  const definitions = await storyblokService.getAllStories('definition').then((definitions) => {
    return definitions.map((definition) => {
      return createSitemapEntry(definition);
    });
  });

  const pages = await storyblokService.getAllStories('page').then((pages) => {
    return pages.map((page) => {
      if (page.full_slug === 'home') {
        page.full_slug = '';
      }
      return createSitemapEntry(page);
    });
  });

  const technologies = await storyblokService.getAllStories('technology').then((technologies) => {
    return technologies.map((technology) => {
      return createSitemapEntry(technology);
    });
  });

  const works = await storyblokService.getAllStories('work').then((works) => {
    return works
      .map((work) => {
        // @ts-ignore
        if (!!work.content.content.content?.[0]?.content) {
          return createSitemapEntry(work);
        }
        return null;
      })
      .filter((work) => work !== null);
  });

  const workCategories = await storyblokService
    .getAllStories('workCategory')
    .then((workCategories) => {
      return workCategories.map((workCategory) => {
        return createSitemapEntry(workCategory);
      });
    });

  entries.push(
    ...articles,
    ...blogCategories,
    ...definitions,
    ...pages,
    ...technologies,
    ...workCategories,
    ...works
  );

  entries.sort((a, b) => {
    const dateA = new Date(a.lastmod);
    const dateB = new Date(b.lastmod);
    return dateB.getTime() - dateA.getTime();
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${entries
      .map(
        (entry) => `
      <url>
        <loc>${entry.loc}</loc>
        <lastmod>${entry.lastmod}</lastmod>
      </url>
    `
      )
      .join('')}
  </urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
