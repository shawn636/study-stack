import type { Config } from 'tailwindcss';

import { fontFamily } from 'tailwindcss/defaultTheme';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    darkMode: ['class'],
    safelist: ['dark'],
    future: {
        hoverOnlyWhenSupported: true
    },
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
                glow: 'glow 3s linear infinite',
                'infinite-scroll': 'infinite-scroll linear 25s infinite',
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'caret-blink': 'caret-blink 1.25s ease-out infinite',
                'fade-in-out': 'fade-in-out 4s ease-in-out',
                progress: 'progress 8s linear'
            },

            borderRadius: {
                xl: 'calc(var(--radius) + 4px)',
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            colors: {
                border: 'hsl(var(--border) / <alpha-value>)',
                input: 'hsl(var(--input) / <alpha-value>)',
                ring: 'hsl(var(--ring) / <alpha-value>)',
                background: 'hsl(var(--background) / <alpha-value>)',
                foreground: 'hsl(var(--foreground) / <alpha-value>)',
                primary: {
                    DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
                    foreground: 'hsl(var(--primary-foreground) / <alpha-value>)'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
                    foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
                    foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
                },
                'equipped-blue': {
                    DEFAULT: '#2678BD'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
                    foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
                    foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
                    foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
                },
                card: {
                    DEFAULT: 'hsl(var(--card) / <alpha-value>)',
                    foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
                },
                // Shadcnblocks.com
                muted2: {
                    DEFAULT: 'hsl(var(--muted2))',
                    foreground: 'hsl(var(--muted2-foreground))'
                },
                sidebar: {
                    DEFAULT: 'hsl(var(--sidebar-background))',
                    foreground: 'hsl(var(--sidebar-foreground))',
                    primary: 'hsl(var(--sidebar-primary))',
                    'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
                    accent: 'hsl(var(--sidebar-accent))',
                    'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
                    border: 'hsl(var(--sidebar-border))',
                    ring: 'hsl(var(--sidebar-ring))'
                }
            },
            fontFamily: {
                sans: ['Inter Variable', 'Inter', ...fontFamily.sans],
                mono: ['SFMono-Regular', ...fontFamily.mono]
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--bits-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--bits-accordion-content-height)' },
                    to: { height: '0' }
                },
                'caret-blink': {
                    '0%,70%,100%': { opacity: '1' },
                    '20%,50%': { opacity: '0' }
                },
                glow: {
                    '0%': { boxShadow: '0 0 15px 3px rgba(168, 85, 247, 0.5)' },
                    '50%': { boxShadow: '0 0 20px 5px rgba(59, 130, 246, 0.8)' },
                    '100%': { boxShadow: '0 0 15px 3px rgba(168, 85, 247, 0.5)' }
                },
                'fade-in-out': {
                    '0%': { opacity: '0' },
                    '20%': { opacity: '1' },
                    '80%': { opacity: '1' },
                    '100%': { opacity: '0' }
                },
                progress: {
                    from: { width: '0%' },
                    to: { width: '100%' }
                },
                'infinite-scroll': {
                    from: { transform: 'translateX(0)' },
                    to: { transform: 'translateX(-100%)' }
                }
            },
            screens: {
                xs: '380px'
            }
        }
    },
    plugins: [tailwindcssAnimate]
};

export default config;
