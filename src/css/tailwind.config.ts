import type { Config } from 'tailwindcss';
import path from 'path';

/**
 * Indigo Logic — Tailwind CSS Configuration
 * Location: src/css/tailwind.config.ts
 *
 * Wiring (choose one):
 *   Tailwind v4 (Vite):   import tailwind from '@tailwindcss/vite'
 *   Tailwind v3 (PostCSS): postcss.config.js → tailwindcss: { config: './src/css/tailwind.config.ts' }
 *
 * Entry CSS:
 *   @tailwind base;
 *   @tailwind components;
 *   @tailwind utilities;
 */

// ── Helpers ──────────────────────────────────────────────────────────────────
// Resolved from project root (this file lives two levels deep in src/css/)
const root = (...segments: string[]) =>
    path.resolve(__dirname, '../..', ...segments);

// ── Design Tokens ────────────────────────────────────────────────────────────
// Centralised so they can be imported by JS/TS runtime code if needed.

const RADIUS = {
    sm: '0.25rem',  // 4px
    DEFAULT: '0.5rem',   // 8px  — inputs, buttons, standard cards
    md: '0.75rem',  // 12px
    lg: '1rem',     // 16px
    xl: '1.5rem',   // 24px — hero cards, large containers
    full: '9999px',   // pill buttons, chips, status tags
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

// ── Config ────────────────────────────────────────────────────────────────────
const config: Config = {
    content: [
        root('index.html'),
        root('src/**/*.{ts,tsx,js,jsx}'),
    ],

    theme: {
        extend: {
            // ── Colors ──────────────────────────────────────────────────────────────
            colors: {
                // Surfaces
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

                // On-surface
                'on-surface': '#131b2e',
                'on-surface-variant': '#454652',

                // Inverse
                'inverse-surface': '#283044',
                'inverse-on-surface': '#eef0ff',

                // Outline
                outline: {
                    DEFAULT: '#757684',
                    variant: '#c5c5d4',
                },

                // Primary
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

                // Secondary
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

                // Tertiary
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

                // Error
                error: {
                    DEFAULT: '#ba1a1a',
                    container: '#ffdad6',
                },
                'on-error': '#ffffff',
                'on-error-container': '#93000a',

                // Background
                background: '#faf8ff',
                'on-background': '#131b2e',

                // Semantic / Accent
                'success-mint': '#ECFDF5',
                'accent-teal': '#0D9488',
                'border-subtle': '#E2E8F0',
            },

            // ── Typography ───────────────────────────────────────────────────────────
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
                mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
            },

            // Line-height and letter-spacing are bundled — no extra utility needed.
            fontSize: {
                'display-lg': ['56px', { lineHeight: '64px', letterSpacing: '-0.02em' }],
                'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em' }],
                'headline-md': ['24px', { lineHeight: '32px' }],
                'body-lg': ['18px', { lineHeight: '28px' }],
                'body-md': ['16px', { lineHeight: '24px' }],
                'label-lg': ['14px', { lineHeight: '20px', letterSpacing: '0.02em' }],
                'label-sm': ['12px', { lineHeight: '16px', letterSpacing: '0.04em' }],
                'code-md': ['14px', { lineHeight: '20px' }],
            },

            // ── Border Radius ────────────────────────────────────────────────────────
            borderRadius: RADIUS,

            // ── Spacing ──────────────────────────────────────────────────────────────
            // Extends (does not replace) Tailwind's default scale.
            spacing: {
                'stack-sm': '12px',  // Internal component gaps (label → input)
                'stack-md': '24px',  // Section sub-divisions
                'stack-lg': '48px',  // Major section separators
                gutter: '24px',  // Desktop column gutter
                'margin-d': '48px',  // Desktop page margin
                'margin-m': '16px',  // Mobile page margin
            },

            // ── Max Width ────────────────────────────────────────────────────────────
            maxWidth: {
                container: '1280px',
            },

            // ── Shadows ──────────────────────────────────────────────────────────────
            boxShadow: SHADOWS,

            // ── Animation ────────────────────────────────────────────────────────────
            keyframes: KEYFRAMES,
            animation: ANIMATIONS,
        },
    },

    plugins: [],
};

export default config;