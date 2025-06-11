import { type ISbStories, type ISbStoryData } from '@storyblok/astro';
import type { StoryblokClient } from '@storyblok/js';
import { ARTICLES_PER_PAGE } from '@/services/blog';
import type { ISbStoriesParams } from '@storyblok/astro';
import type { ArticleStoryblok, BlogCategoryStoryblok } from '@/types/storyblok';

// @ts-ignore
import { storyblokApiInstance } from 'virtual:storyblok-init';

async function getAllStories<T>(
  contentType?:
    | 'article'
    | 'blogCategory'
    | 'definition'
    | 'page'
    | 'technology'
    | 'technologyCategory'
    | 'work'
    | 'workCategory'
) {
  const storyblokApi = storyblokApiInstance as StoryblokClient;

  const stories = await storyblokApi.getAll('cdn/stories', {
    ...(contentType && { content_type: contentType }),
    version: import.meta.env.STORYBLOK_ENV,
    resolve_relations: ['article.category'],
  });

  return stories as ISbStories<T>['data']['stories'];
}

async function getBlogCategories() {
  const storyblokApi = storyblokApiInstance as StoryblokClient;

  const { data } = await storyblokApi.get('cdn/stories', {
    content_type: 'blogCategory',
    version: import.meta.env.STORYBLOK_ENV,
  });

  return data.stories as ISbStoryData<BlogCategoryStoryblok>[];
}

async function getLatestArticles(category?: string) {
  const storyblokApi = storyblokApiInstance as StoryblokClient;

  const params: ISbStoriesParams = {
    version: import.meta.env.STORYBLOK_ENV,
    content_type: 'article',
    per_page: 4,
    resolve_relations: ['article.category'],
    sort_by: 'published_at:desc',
  };

  if (category) {
    params.filter_query = {
      category: {
        in: category,
      },
    };
  }

  const { data } = await storyblokApi.get(`cdn/stories`, params);

  return data.stories as ISbStoryData<ArticleStoryblok>[];
}

async function getTotalBlogPages(category?: string) {
  const storyblokApi = storyblokApiInstance as StoryblokClient;

  const params: ISbStoriesParams = {
    version: import.meta.env.STORYBLOK_ENV,
    content_type: 'article',
    per_page: ARTICLES_PER_PAGE,
    sort_by: 'published_at:desc',
  };

  if (category) {
    params.filter_query = {
      category: {
        in: category,
      },
    };
  }

  const data = (await storyblokApi.get(`cdn/stories`, params)) as ISbStories;

  return Math.ceil(data.total / data.perPage);
}

const storyblokSSRService = {
  getAllStories,
  getBlogCategories,
  getLatestArticles,
  getTotalBlogPages,
};

export default storyblokSSRService;
