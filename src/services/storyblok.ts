import { useStoryblokApi } from '@storyblok/astro';
import { type ISbStory } from '@storyblok/astro';

async function getStory<T>(slug: string) {
  const storyblokApi = useStoryblokApi();

  const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
    version: import.meta.env.STORYBLOK_ENV,
  });

  return data as ISbStory<T>['data'];
}

const storyblokService = {
  getStory,
};

export default storyblokService;
