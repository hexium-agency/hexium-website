import type { ArticleStoryblok, BlogCategoryStoryblok } from '@/types/storyblok';
import { useStoryblokApi, type ISbStoriesParams } from '@storyblok/astro';
import { type ISbStoryData, type ISbStories } from '@storyblok/astro';

const ARTICLES_PER_PAGE = 12;

async function getAllArticles() {
  const storyblokApi = useStoryblokApi();

  const articles = await storyblokApi.getAll('cdn/stories', {
    content_type: 'article',
    version: import.meta.env.STORYBLOK_ENV,
    resolve_relations: ['article.category'],
  });

  return articles as ISbStoryData<ArticleStoryblok>[];
}

async function getCategories() {
  const storyblokApi = useStoryblokApi();

  const { data } = await storyblokApi.get('cdn/stories', {
    content_type: 'blogCategory',
    version: import.meta.env.STORYBLOK_ENV,
  });

  return data.stories as ISbStoryData<BlogCategoryStoryblok>[];
}

async function getCategoryBySlug(slug: string) {
  const storyblokApi = useStoryblokApi();

  const { data } = await storyblokApi.get(`cdn/stories/blog/${slug}`, {
    content_type: 'blogCategory',
    version: import.meta.env.STORYBLOK_ENV,
  });

  return data.story as ISbStoryData<BlogCategoryStoryblok>;
}

async function getLatest(category?: string) {
  const storyblokApi = useStoryblokApi();

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

async function getPaginated({ category, page = 1 }: { category?: string; page?: number }) {
  const storyblokApi = useStoryblokApi();

  const params: ISbStoriesParams = {
    version: import.meta.env.STORYBLOK_ENV,
    content_type: 'article',
    per_page: ARTICLES_PER_PAGE,
    resolve_relations: ['article.category'],
    sort_by: 'published_at:desc',
    page,
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

async function getTotal(category?: string) {
  const storyblokApi = useStoryblokApi();

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

const blogService = {
  getAllArticles,
  getCategories,
  getCategoryBySlug,
  getLatest,
  getPaginated,
  getTotal,
};

export default blogService;
