import { ImageResponse } from '@vercel/og';
import { createElement } from 'react';
import { join } from 'path';
import { readFile } from 'fs/promises';

export const prerender = false;

export async function GET({ url }: { url: string }) {
  const { searchParams } = new URL(url);
  const [badge, title] = [searchParams.get('badge'), searchParams.get('title')];

  const fontJetBrainsMono = await readFile(
    join(process.cwd(), 'src/fonts/JetBrainsMono-Regular.ttf')
  );

  const fontInter = await readFile(join(process.cwd(), 'src/fonts/Inter-SemiBold.ttf'));

  const backgroundImage = 'http://localhost:4321/images/og-background.png';

  const html = createElement(
    'div',
    {
      style: {
        background: `url(${backgroundImage})`,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '60px',
      },
    },
    [
      createElement(
        'div',
        {
          style: {
            fontSize: '25px',
            color: 'white',
            opacity: 0.8,
            fontFamily: 'JetBrains Mono',
            textTransform: 'uppercase',
          },
        },
        badge
      ),
      createElement(
        'div',
        {
          style: {
            fontSize: '60px',
            color: 'white',
            paddingTop: '20px',
            fontFamily: 'Inter',
          },
        },
        title
      ),
    ]
  );

  return new ImageResponse(html, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'JetBrains Mono',
        data: fontJetBrainsMono,
        style: 'normal',
        weight: 400,
      },
      {
        name: 'Inter',
        data: fontInter,
        style: 'normal',
        weight: 400,
      },
    ],
  });
}
