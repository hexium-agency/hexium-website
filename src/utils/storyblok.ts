import { type MultilinkStoryblok, type AssetStoryblok } from '@/types/storyblok';

export function parseStoryblokImage(image: AssetStoryblok) {
  const dimensions = image.filename.match(/\/(\d+)x(\d+)\//);

  return {
    src: image.filename,
    alt: image.alt,
    width: dimensions![1],
    height: dimensions![2],
  };
}

export function parseStoryblokLink(link: MultilinkStoryblok | undefined): string {
  if (link?.linktype === 'story') {
    const url = link.cached_url || link.href || '';
    return `/${url}`.replace(/\/$/, '');
  }

  if (link?.linktype === 'url') {
    const url = link.cached_url || link.href || '';
    return url as string;
  }

  return '';
}

export function parseStoryblokRichTextImage(image: any) {
  const dimensions = image.src.match(/\/(\d+)x(\d+)\//);

  return {
    src: image.src,
    alt: image.alt,
    width: dimensions![1],
    height: dimensions![2],
  };
}
