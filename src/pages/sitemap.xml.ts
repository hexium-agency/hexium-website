interface SitemapEntry {
  loc: string;
  lastmod: string;
  priority: number;
}

function createSitemapEntry(
  path: string,
  date: string = new Date().toISOString(),
  priority: number = 0.8
): SitemapEntry {
  return {
    loc: `https://www.hexium.io${path}`,
    lastmod: date,
    priority,
  };
}

export async function GET() {
  // TODO: Add entries from storyblok
  const entries: SitemapEntry[] = [];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${entries
      .map(
        (entry) => `
      <url>
        <loc>${entry.loc}</loc>
        <lastmod>${entry.lastmod}</lastmod>
        <priority>${entry.priority}</priority>
      </url>
    `
      )
      .join('')}
  </urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
