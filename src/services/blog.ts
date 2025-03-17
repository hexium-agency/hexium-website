import type { ArticleStoryblok, DefinitionStoryblok } from '@/types/storyblok';
import { useStoryblokApi, type ISbStoriesParams } from '@storyblok/astro';
import { type ISbStoryData } from '@storyblok/astro';

async function getLatest(category: string) {
  const storyblokApi = useStoryblokApi();

  const params: ISbStoriesParams = {
    version: import.meta.env.STORYBLOK_ENV,
    content_type: 'article',
    per_page: 4,
    sort_by: 'published_at:desc',
  };

  if (category) {
    params.filter_query = {
      categories: {
        in: category,
      },
    };
  }

  const { data } = await storyblokApi.get(`cdn/stories`, params);

  return data.stories as ISbStoryData<ArticleStoryblok>[];
}

const blogService = {
  getLatest,
};

export default blogService;
