import type { Config } from 'tailwindcss';

/**
 * Indigo Logic — Tailwind CSS Configuration
 * Location: src/css/tailwind.config.ts
 */

// ── Design Tokens ────────────────────────────────────────────────────────────

const RADIUS = {
    sm: '0.25rem',
    DEFAULT: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
} as const;

const SHADOWS = {
    'level-0': 'none',
    'level-1': '0 1px 3px rgba(67, 85, 185, 0.04)',
    'level-2': '0 4px 20px rgba(63, 81, 181, 0.08)',
    'level-3': '0 8px 32px rgba(63, 81, 181, 0.14)',
} as const;

const KEYFRAMES = {
    'result-pulse': {
        '0%, 100%': { opacity: '1' },
        '50%': { opacity: '0.7' },
    },
    'input-dim': {
        '0%, 100%': { opacity: '1' },
        '50%': { opacity: '0.6' },
    },
} as const;

const ANIMATIONS = {
    'result-pulse': 'result-pulse 1.5s ease-in-out infinite',
    'input-dim': 'input-dim 1.5s ease-in-out infinite',
} as const;

// ── Tailwind Config ──────────────────────────────────────────────────────────

const config: Config = {
    content: [
        './index.html',
        './src/**/*.{ts,tsx,js,jsx}',
    ],

    theme: {
        extend: {
            colors: {
                surface: {
                    DEFAULT: '#faf8ff',
                    dim: '#d2d9f4',
                    bright: '#faf8ff',
                    indigo: '#F8FAFF',
                    slate: '#F1F5F9',
                    variant: '#dae2fd',
                    tint: '#4355b9',
                    'container-lowest': '#ffffff',
                    'container-low': '#f2f3ff',
                    container: '#eaedff',
                    'container-high': '#e2e7ff',
                    'container-highest': '#dae2fd',
                },

                'on-surface': '#131b2e',
                'on-surface-variant': '#454652',

                'inverse-surface': '#283044',
                'inverse-on-surface': '#eef0ff',

                outline: {
                    DEFAULT: '#757684',
                    variant: '#c5c5d4',
                },

                primary: {
                    DEFAULT: '#24389c',
                    container: '#3f51b5',
                    fixed: '#dee0ff',
                    'fixed-dim': '#bac3ff',
                },

                'on-primary': '#ffffff',
                'on-primary-container': '#cacfff',
                'inverse-primary': '#bac3ff',
                'on-primary-fixed': '#00105c',
                'on-primary-fixed-variant': '#293ca0',

                secondary: {
                    DEFAULT: '#4858ab',
                    container: '#96a5ff',
                    fixed: '#dee0ff',
                    'fixed-dim': '#bac3ff',
                },

                'on-secondary': '#ffffff',
                'on-secondary-container': '#27378a',
                'on-secondary-fixed': '#00105b',
                'on-secondary-fixed-variant': '#2f3f92',

                tertiary: {
                    DEFAULT: '#2f3891',
                    container: '#4851aa',
                    fixed: '#e0e0ff',
                    'fixed-dim': '#bdc2ff',
                },

                'on-tertiary': '#ffffff',
                'on-tertiary-container': '#cbceff',
                'on-tertiary-fixed': '#000767',
                'on-tertiary-fixed-variant': '#343d96',

                error: {
                    DEFAULT: '#ba1a1a',
                    container: '#ffdad6',
                },

                'on-error': '#ffffff',
                'on-error-container': '#93000a',

                background: '#faf8ff',
                'on-background': '#131b2e',

                'success-mint': '#ECFDF5',
                'accent-teal': '#0D9488',
                'border-subtle': '#E2E8F0',
            },

            fontFamily: {
                sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },

            fontSize: {
                'display-lg': [
                    '56px',
                    {
                        lineHeight: '64px',
                        letterSpacing: '-0.02em',
                    },
                ],
                'headline-lg': [
                    '32px',
                    {
                        lineHeight: '40px',
                        letterSpacing: '-0.01em',
                    },
                ],
                'headline-md': [
                    '24px',
                    {
                        lineHeight: '32px',
                    },
                ],
                'body-lg': [
                    '18px',
                    {
                        lineHeight: '28px',
                    },
                ],
                'body-md': [
                    '16px',
                    {
                        lineHeight: '24px',
                    },
                ],
                'label-lg': [
                    '14px',
                    {
                        lineHeight: '20px',
                        letterSpacing: '0.02em',
                    },
                ],
                'label-sm': [
                    '12px',
                    {
                        lineHeight: '16px',
                        letterSpacing: '0.04em',
                    },
                ],
                'code-md': [
                    '14px',
                    {
                        lineHeight: '20px',
                    },
                ],
            },

            borderRadius: RADIUS,

            spacing: {
                'stack-sm': '12px',
                'stack-md': '24px',
                'stack-lg': '48px',
                gutter: '24px',
                'margin-d': '48px',
                'margin-m': '16px',
            },

            maxWidth: {
                container: '1280px',
            },

            boxShadow: SHADOWS,

            keyframes: KEYFRAMES,

            animation: ANIMATIONS,
        },
    },

    plugins: [],
};

export default config;