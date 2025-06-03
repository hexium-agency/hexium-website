import type {
  TechnologyPlaceholderStoryblok,
  TechnologyCategoryStoryblok,
} from '@/types/storyblok';
import { useStoryblokApi, type ISbStoriesParams } from '@storyblok/astro';
import { type ISbStoryData, type ISbStories } from '@storyblok/astro';

export const TECHNOLOGIES_PER_PAGE = 12;

async function getAllTechnologies() {
  const storyblokApi = useStoryblokApi();

  const technologies = await storyblokApi.getAll('cdn/stories', {
    content_type: 'technologyPlaceholder',
    version: import.meta.env.STORYBLOK_ENV,
    resolve_relations: ['technologyPlaceholder.category'],
  });

  return technologies as ISbStoryData<TechnologyPlaceholderStoryblok>[];
}

async function getCategories() {
  const storyblokApi = useStoryblokApi();

  const { data } = await storyblokApi.get('cdn/stories', {
    content_type: 'technologyCategory',
    version: import.meta.env.STORYBLOK_ENV,
  });

  return data.stories as ISbStoryData<TechnologyCategoryStoryblok>[];
}

async function getCategoryBySlug(slug: string) {
  const storyblokApi = useStoryblokApi();

  const { data } = await storyblokApi.get(`cdn/stories/technology/${slug}`, {
    content_type: 'technologyCategory',
    version: import.meta.env.STORYBLOK_ENV,
  });

  return data.story as ISbStoryData<TechnologyCategoryStoryblok>;
}

async function getLatest(category?: string) {
  const storyblokApi = useStoryblokApi();

  const params: ISbStoriesParams = {
    version: import.meta.env.STORYBLOK_ENV,
    content_type: 'technologyPlaceholder',
    per_page: 4,
    resolve_relations: ['technologyPlaceholder.category'],
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

  return data.stories as ISbStoryData<TechnologyPlaceholderStoryblok>[];
}

async function getPaginated({ category, page = 1 }: { category?: string; page?: number }) {
  const storyblokApi = useStoryblokApi();

  const params: ISbStoriesParams = {
    version: import.meta.env.STORYBLOK_ENV,
    content_type: 'technologyPlaceholder',
    per_page: TECHNOLOGIES_PER_PAGE,
    resolve_relations: ['technologyPlaceholder.category'],
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

  return data.stories as ISbStoryData<TechnologyPlaceholderStoryblok>[];
}

async function getTotal(category?: string) {
  const storyblokApi = useStoryblokApi();

  const params: ISbStoriesParams = {
    version: import.meta.env.STORYBLOK_ENV,
    content_type: 'technologyPlaceholder',
    per_page: TECHNOLOGIES_PER_PAGE,
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

const technologyService = {
  getAllTechnologies,
  getCategories,
  getCategoryBySlug,
  getLatest,
  getPaginated,
  getTotal,
};

export default technologyService;
