import type {
  TechnologyPlaceholderStoryblok,
  TechnologyStoryblok,
  TechnologyCategoryStoryblok,
} from '@/types/storyblok';
import { useStoryblokApi } from '@storyblok/astro';
import { type ISbStoryData } from '@storyblok/astro';

export const TECHNOLOGIES_PER_PAGE = 12;

export type TechnologyUnion = TechnologyPlaceholderStoryblok | TechnologyStoryblok;

function mergeTechnologies(
  technologies: ISbStoryData<TechnologyStoryblok>[],
  placeholderTechnologies: ISbStoryData<TechnologyPlaceholderStoryblok>[]
) {
  return [...technologies, ...placeholderTechnologies].sort((a, b) => a.name.localeCompare(b.name));
}

async function getAllTechnologies() {
  const storyblokApi = useStoryblokApi();

  const technologies = await storyblokApi.getAll('cdn/stories', {
    content_type: 'technology',
    version: import.meta.env.STORYBLOK_ENV,
    resolve_relations: ['technology.category'],
  });
  const placeholderTechonlogies = await storyblokApi.getAll('cdn/stories', {
    content_type: 'technologyPlaceholder',
    version: import.meta.env.STORYBLOK_ENV,
    resolve_relations: ['technologyPlaceholder.category'],
  });

  return mergeTechnologies(technologies, placeholderTechonlogies);
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

  const { data } = await storyblokApi.get(`cdn/stories/technologies/${slug}`, {
    content_type: 'technologyCategory',
    version: import.meta.env.STORYBLOK_ENV,
  });

  return data.story as ISbStoryData<TechnologyCategoryStoryblok>;
}

async function getCategoryTechnologies(category: string) {
  const storyblokApi = useStoryblokApi();

  const technologies = await storyblokApi.getAll('cdn/stories', {
    content_type: 'technology',
    version: import.meta.env.STORYBLOK_ENV,
    resolve_relations: ['technology.category'],
    filter_query: {
      category: {
        in: category,
      },
    },
  });

  const placeholderTechnologies = await storyblokApi.getAll('cdn/stories', {
    content_type: 'technologyPlaceholder',
    version: import.meta.env.STORYBLOK_ENV,
    resolve_relations: ['technologyPlaceholder.category'],
    filter_query: {
      category: {
        in: category,
      },
    },
  });

  return mergeTechnologies(technologies, placeholderTechnologies);
}

const technologyService = {
  getAllTechnologies,
  getCategories,
  getCategoryBySlug,
  getCategoryTechnologies,
};

export default technologyService;
