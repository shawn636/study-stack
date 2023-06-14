/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './src/**/*.{html,js,svelte,ts}',
        require('path').join(
            require.resolve('@skeletonlabs/skeleton'),
            '../**/*.{html,js,svelte,ts}'
        )
    ],

    theme: {
        extend: {
            screens: {
                xs: '414px'
            },
            colors: {
                'light-blue': '#03a9f4',
                'light-blue-50': '#e1f5fe',
                'light-blue-100': '#b3e5fc',
                'light-blue-200': '#81d4fa',
                'light-blue-300': '#4fc3f7',
                'light-blue-400': '#29b6f6',
                'light-blue-500': '#03a9f4',
                'light-blue-600': '#039be5',
                'light-blue-700': '#0288d1',
                'light-blue-800': '#0277bd',
                'light-blue-900': '#01579b',
                'light-blue-100-accent': '#80d8ff',
                'light-blue-200-accent': '#40c4ff',
                'light-blue-400-accent': '#00b0ff',
                'light-blue-700-accent': '#0091ea',
                carnation: '#f4665e',
                'neon-carrot': '#ff922b',
                safron: '#ffc600',
                olivine: '#99b971'
            }
        }
    },

    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        ...require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')()
    ]
};
