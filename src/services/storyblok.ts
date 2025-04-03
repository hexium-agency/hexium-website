import { useStoryblokApi, type ISbStories, type ISbStory } from '@storyblok/astro';

async function getAllStories<T>(
  contentType?:
    | 'article'
    | 'blogCategory'
    | 'definition'
    | 'page'
    | 'technology'
    | 'work'
    | 'workCategory'
) {
  const storyblokApi = useStoryblokApi();

  const stories = await storyblokApi.getAll('cdn/stories', {
    ...(contentType && { content_type: contentType }),
    version: import.meta.env.STORYBLOK_ENV,
  });

  return stories as ISbStories<T>['data']['stories'];
}

async function getStory<T>(slug: string) {
  const storyblokApi = useStoryblokApi();

  const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
    version: import.meta.env.STORYBLOK_ENV,
  });

  return data as ISbStory<T>['data'];
}

const storyblokService = {
  getAllStories,
  getStory,
};

export default storyblokService;
