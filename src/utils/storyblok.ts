import { type MultilinkStoryblok, type AssetStoryblok } from '@/types/storyblok';

export function parseStoryblokBackgroundColor(backgroundColor: number | string) {
  switch (backgroundColor) {
    case 'white':
      return 'bg-gray-50';
    case 'gray':
      return 'bg-gray-100';
    case 'black':
      return 'bg-gray-950 dark';
    default:
      return 'bg-gray-50';
  }
}

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

    if (url === 'home') {
      return '/';
    }

    return `/${url}`.replace(/\/$/, '');
  }

  if (link?.linktype === 'url') {
    const url = link.cached_url || link.href || '';

    if (url === 'home') {
      return '/';
    }

    return url as string;
  }

  return '';
}

export function parseStoryblokMaxWidth(maxWidth: number | string) {
  switch (maxWidth) {
    case 'XS':
      return 'max-w-xs';
    case 'SM':
      return 'max-w-sm';
    case 'MD':
      return 'max-w-md';
    case 'LG':
      return 'max-w-lg';
    case 'XL':
      return 'max-w-xl';
    case '2XL':
      return 'max-w-2xl';
    case '3XL':
      return 'max-w-3xl';
    case '4XL':
      return 'max-w-4xl';
    case '5XL':
      return 'max-w-5xl';
    case '6XL':
      return 'max-w-6xl';
    case '7XL':
      return 'max-w-7xl';
    default:
      return 'max-w-none';
  }
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
