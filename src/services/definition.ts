import type { DefinitionStoryblok } from '@/types/storyblok';
import { useStoryblokApi } from '@storyblok/astro';
import { type ISbStoryData } from '@storyblok/astro';

async function getAll() {
  const storyblokApi = useStoryblokApi();

  const definitions = await storyblokApi.getAll('cdn/stories', {
    version: import.meta.env.STORYBLOK_ENV,
    content_type: 'definition',
  });

  return definitions as ISbStoryData<DefinitionStoryblok>[];
}

const definitionService = {
  getAll,
};

export default definitionService;
