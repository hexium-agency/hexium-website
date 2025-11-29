import {
  type AssetStoryblok,
  type MultilinkStoryblok,
  type RichtextStoryblok,
} from '@/types/storyblok';
import type { ISbStoryData } from '@storyblok/astro';
import slugify from 'slugify';

export function extractBadgeTitleFromRichText(richText: RichtextStoryblok) {
  if (!richText || !richText.content) return [];

  return richText.content
    .filter((item) => item.type === 'blok' && item.attrs?.body?.[0]?.component === 'badgeTitle')
    .map((heading) => ({
      level: 2,
      text: parseStoryblokYear(heading.attrs?.body?.[0]?.badge || heading.attrs?.content?.[0]?.title || ''),
      id: slugify(parseStoryblokYear(heading.attrs?.body?.[0]?.badge || heading.attrs?.content?.[0]?.title || ''), {
        lower: true,
      }),
    }));
}

export function extractHeadingsFromRichText(richText: RichtextStoryblok) {
  if (!richText || !richText.content) return [];

  return richText.content
    .filter((item) => item.type === 'heading')
    .map((heading) => ({
      level: heading.attrs.level,
      text: parseStoryblokYear(heading.content?.[0].text || ''),
      id: slugify(parseStoryblokYear(heading.content?.[0].text || ''), {
        lower: true,
      }),
    }));
}

export function getReadingTime(richText: RichtextStoryblok) {
  if (!richText || !richText.content) return 0;

  const WORDS_PER_MINUTE = 200;

  let totalWords = 0;

  richText.content.forEach((node) => {
    if (node.type === 'paragraph' && node.content) {
      node.content.forEach((content) => {
        if (content.text) {
          totalWords += content.text.trim().split(/\s+/).length;
        }
      });
    }
  });

  const minutes = totalWords / WORDS_PER_MINUTE;
  return Math.max(1, Math.round(minutes));
}

export function getWordsCount(richText: RichtextStoryblok) {
  if (!richText || !richText.content) return 0;

  let totalWords = 0;

  richText.content.forEach((node) => {
    if (node.type === 'paragraph' && node.content) {
      node.content.forEach((content) => {
        if (content.text) {
          totalWords += content.text.trim().split(/\s+/).length;
        }
      });
    }
  });

  return totalWords;
}

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

export function parseStoryblokBackgroundColorToTailwind(backgroundColor: number | string) {
  switch (backgroundColor) {
    case 'white':
      return 'var(--color-gray-50)';
    case 'gray':
      return 'var(--color-gray-100)';
    case 'black':
      return 'var(--color-gray-950)';
    default:
      return 'var(--color-gray-50)';
  }
}

export function parseStoryblokImage(image: AssetStoryblok, widths?: number[]) {
  const dimensions = image.filename?.match(/\/(\d+)x(\d+)\//);

  return {
    src: image.filename as string,
    alt: image.alt as string,
    width: parseInt(dimensions![1]),
    height: parseInt(dimensions![2]),
    widths: widths || [320, 640, 750, 828, 1080, 1200, 1920],
  };
}

export function parseStoryblokLink(link: MultilinkStoryblok | undefined): string {
  if (link?.linktype === 'story') {
    const url = link.cached_url || link.href || '';

    if (url === 'home' || url === '/home') {
      return '/';
    }

    return (url.startsWith('/') ? url : `/${url}`).replace(/\/$/, '');
  }

  if (link?.linktype === 'url') {
    const url = link.cached_url || link.href || '';

    if (url === 'home' || url === '/home') {
      return '/';
    }

    return url as string;
  }

  return '';
}

export function parseStoryblokStoryToLink(story: ISbStoryData) {
  return `/${story.full_slug}`.replace(/\/$/, '');
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

export function parseStoryblokYear(text: string): string {
  if (!text) return text;
  const currentYear = new Date().getFullYear();
  return text.replace(/#YEAR#/g, currentYear.toString());
}

export function parseStoryblokYearInRichText(
  richText: RichtextStoryblok
): RichtextStoryblok {
  // Create a deep copy to avoid mutating the original
  const processedRichText = { ...richText };

  // Process text property if it exists
  if (processedRichText.text) {
    processedRichText.text = parseStoryblokYear(processedRichText.text);
  }

  // Recursively process content array if it exists
  if (processedRichText.content && Array.isArray(processedRichText.content)) {
    processedRichText.content = processedRichText.content.map((item) =>
      parseStoryblokYearInRichText(item)
    );
  }

  // Recursively process marks array if it exists
  if (processedRichText.marks && Array.isArray(processedRichText.marks)) {
    processedRichText.marks = processedRichText.marks.map((item) =>
      parseStoryblokYearInRichText(item)
    );
  }

  return processedRichText;
}
