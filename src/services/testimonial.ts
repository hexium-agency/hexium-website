import { useStoryblokApi } from '@storyblok/astro';
import type { TestimonialStoryblok } from '@/types/storyblok';
import type { ISbStoryData } from '@storyblok/astro';

async function getTestimonialsByUuids(uuids: string[]) {
  const storyblokApi = useStoryblokApi();

  const testimonials = await storyblokApi.getAll('cdn/stories', {
    version: import.meta.env.STORYBLOK_ENV,
    by_uuids: uuids.join(','),
    resolve_relations: ['testimonial.customer'],
  });

  return testimonials as ISbStoryData<TestimonialStoryblok>[];
}

const testimonialService = {
  getTestimonialsByUuids,
};

export default testimonialService;
