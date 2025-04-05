import type {
  ArticleStoryblok,
  BlogCategoryStoryblok,
  WorkCategoryStoryblok,
  WorkStoryblok,
} from '@/types/storyblok';
import { useStoryblokApi, type ISbStoriesParams } from '@storyblok/astro';
import { type ISbStoryData, type ISbStories } from '@storyblok/astro';

const WORKS_PER_PAGE = 12;

async function getAllWorks() {
  const storyblokApi = useStoryblokApi();

  const articles = await storyblokApi.getAll('cdn/stories', {
    content_type: 'work',
    version: import.meta.env.STORYBLOK_ENV,
    resolve_relations: ['work.category', 'work.customer', 'work.services', 'work.technologies'],
  });

  return articles as ISbStoryData<WorkStoryblok>[];
}

async function getCategories() {
  const storyblokApi = useStoryblokApi();

  const { data } = await storyblokApi.get('cdn/stories', {
    content_type: 'workCategory',
    version: import.meta.env.STORYBLOK_ENV,
  });

  return data.stories as ISbStoryData<WorkCategoryStoryblok>[];
}

async function getCategoryBySlug(slug: string) {
  const storyblokApi = useStoryblokApi();

  const { data } = await storyblokApi.get(`cdn/stories/realisations/${slug}`, {
    content_type: 'workCategory',
    version: import.meta.env.STORYBLOK_ENV,
  });

  return data.story as ISbStoryData<WorkCategoryStoryblok>;
}

async function getLatest(category?: string) {
  const storyblokApi = useStoryblokApi();

  const params: ISbStoriesParams = {
    version: import.meta.env.STORYBLOK_ENV,
    content_type: 'work',
    per_page: 4,
    resolve_relations: ['work.category', 'work.customer', 'work.services', 'work.technologies'],
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

  return data.stories as ISbStoryData<WorkStoryblok>[];
}

async function getPaginated({ category, page = 1 }: { category?: string; page?: number }) {
  const storyblokApi = useStoryblokApi();

  const params: ISbStoriesParams = {
    version: import.meta.env.STORYBLOK_ENV,
    content_type: 'work',
    per_page: WORKS_PER_PAGE,
    resolve_relations: ['work.category', 'work.customer', 'work.services', 'work.technologies'],
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

  return data.stories as ISbStoryData<WorkStoryblok>[];
}

async function getTotal(category?: string) {
  const storyblokApi = useStoryblokApi();

  const params: ISbStoriesParams = {
    version: import.meta.env.STORYBLOK_ENV,
    content_type: 'work',
    per_page: WORKS_PER_PAGE,
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

const workService = {
  getAllWorks,
  getCategories,
  getCategoryBySlug,
  getLatest,
  getPaginated,
  getTotal,
};

export default workService;
