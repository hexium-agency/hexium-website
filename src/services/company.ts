import { useStoryblokApi } from '@storyblok/astro';
import type { CompanyStoryblok, CustomerStoryblok } from '@/types/storyblok';
import type { ISbStoryData } from '@storyblok/astro';

async function getCompaniesByUuids(uuids: string[]) {
  const storyblokApi = useStoryblokApi();

  const companies = await storyblokApi.getAll('cdn/stories', {
    version: import.meta.env.STORYBLOK_ENV,
    by_uuids: uuids.join(','),
  });

  return companies as (ISbStoryData<CompanyStoryblok> | ISbStoryData<CustomerStoryblok>)[];
}

const companyService = {
  getCompaniesByUuids,
};

export default companyService;
