import type { Config } from 'tailwindcss';

import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    darkMode: ['class'],
    safelist: ['dark'],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            animation: {
                'infinite-scroll': 'infinite-scroll linear 25s infinite',
                'rotate-glow': 'rotate-glow 3s linear infinite'
            },

            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            colors: {
                accent: {
                    DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
                    foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
                },
                background: 'hsl(var(--background) / <alpha-value>)',
                border: 'hsl(var(--border) / <alpha-value>)',
                card: {
                    DEFAULT: 'hsl(var(--card) / <alpha-value>)',
                    foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
                    foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
                },
                'equipped-blue': {
                    DEFAULT: '#2678BD'
                },
                foreground: 'hsl(var(--foreground) / <alpha-value>)',
                input: 'hsl(var(--input) / <alpha-value>)',
                muted: {
                    DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
                    foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
                    foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
                    foreground: 'hsl(var(--primary-foreground) / <alpha-value>)'
                },
                ring: 'hsl(var(--ring) / <alpha-value>)',
                secondary: {
                    DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
                    foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)'
                }
            },
            fontFamily: {
                sans: [...fontFamily.sans]
            },
            keyframes: {
                'infinite-scroll': {
                    from: { transform: 'translateX(0)' },
                    to: { transform: 'translateX(-100%)' }
                },
                'rotate-glow': {
                    '0%': { boxShadow: '0 0 15px 3px rgba(59, 130, 246, 0.5)' },
                    '50%': { boxShadow: '0 0 20px 5px rgba(139, 92, 246, 0.8)' },
                    '100%': { boxShadow: '0 0 15px 3px rgba(59, 130, 246, 0.5)' }
                }
            },
            screens: {
                xs: '380px'
            }
        }
    }
};

export default config;
