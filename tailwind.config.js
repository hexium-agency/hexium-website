// Always prefer to use the global.css with Tailwind v4 new logic instead of this file
// Use this config file only when needed

/** @type {import('tailwindcss').Config} */
export default {
	theme: {
    extend: {
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            'img': {
              borderRadius: '.5rem',
              marginTop: '2.5rem',
              marginBottom: '2.5rem',
              boxShadow: '0 0 0 1px rgba(19, 19, 22, .05)',
              backgroundColor: 'rgba(94, 95, 110, .05)',
            },
            'h1 a, h2 a, h3 a, h4 a, h5 a, h6 a': {
              color: 'inherit',
              textDecoration: 'inherit',
              fontWeight: 'inherit'
            },
            'ol > li::marker': {
              fontWeight: '700',
              fontFamily: 'var(--font-sans)',
              color: 'var(--tw-prose-counters)',
            },
            '--tw-prose-counters': 'var(--color-gray-700)',
            '--tw-prose-bullets': 'var(--color-gray-700)',
            '--tw-prose-headings': 'var(--color-gray-950)',
          },
        },
      }),
    }
  }
}
