import type { Config } from 'tailwindcss';

import { skeleton } from '@skeletonlabs/tw-plugin';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { join } from 'path';

import { equippedTheme } from './equipped-theme';

const config = {
    content: [
        './src/**/*.{html,js,svelte,ts}',
        join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
    ],
    darkMode: 'class',
    mode: 'jit',

    plugins: [forms, typography, skeleton({ themes: { custom: [equippedTheme] } })],
    theme: {
        extend: {
            colors: {
                carnation: '#f4665e',
                'light-blue': '#03a9f4',
                'light-blue-50': '#e1f5fe',
                'light-blue-100': '#b3e5fc',
                'light-blue-100-accent': '#80d8ff',
                'light-blue-200': '#81d4fa',
                'light-blue-200-accent': '#40c4ff',
                'light-blue-300': '#4fc3f7',
                'light-blue-400': '#29b6f6',
                'light-blue-400-accent': '#00b0ff',
                'light-blue-500': '#03a9f4',
                'light-blue-600': '#039be5',
                'light-blue-700': '#0288d1',
                'light-blue-700-accent': '#0091ea',
                'light-blue-800': '#0277bd',
                'light-blue-900': '#01579b',
                'neon-carrot': '#ff922b',
                olivine: '#99b971',
                safron: '#ffc600'
            },
            screens: {
                xs: '414px'
            }
        }
    }
} satisfies Config;

export default config;
