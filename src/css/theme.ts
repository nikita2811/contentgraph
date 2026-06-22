/**
 * Indigo Logic — Typed Theme Object
 * Generated from DESIGN.md
 *
 * Usage options:
 *   A) Pass as a prop:     <ThemeProvider theme={theme}>
 *   B) Import directly:    import { theme } from './theme'
 *   C) Use the type:       import type { Theme } from './theme'
 */

export const theme = {
    colors: {
        // Surface
        surface: '#faf8ff',
        surfaceDim: '#d2d9f4',
        surfaceBright: '#faf8ff',
        surfaceContainerLowest: '#ffffff',
        surfaceContainerLow: '#f2f3ff',
        surfaceContainer: '#eaedff',
        surfaceContainerHigh: '#e2e7ff',
        surfaceContainerHighest: '#dae2fd',

        // On-Surface
        onSurface: '#131b2e',
        onSurfaceVariant: '#454652',

        // Inverse
        inverseSurface: '#283044',
        inverseOnSurface: '#eef0ff',

        // Outline
        outline: '#757684',
        outlineVariant: '#c5c5d4',

        // Primary
        surfaceTint: '#4355b9',
        primary: '#24389c',
        onPrimary: '#ffffff',
        primaryContainer: '#3f51b5',
        onPrimaryContainer: '#cacfff',
        inversePrimary: '#bac3ff',

        // Primary Fixed
        primaryFixed: '#dee0ff',
        primaryFixedDim: '#bac3ff',
        onPrimaryFixed: '#00105c',
        onPrimaryFixedVariant: '#293ca0',

        // Secondary
        secondary: '#4858ab',
        onSecondary: '#ffffff',
        secondaryContainer: '#96a5ff',
        onSecondaryContainer: '#27378a',

        // Secondary Fixed
        secondaryFixed: '#dee0ff',
        secondaryFixedDim: '#bac3ff',
        onSecondaryFixed: '#00105b',
        onSecondaryFixedVariant: '#2f3f92',

        // Tertiary
        tertiary: '#2f3891',
        onTertiary: '#ffffff',
        tertiaryContainer: '#4851aa',
        onTertiaryContainer: '#cbceff',

        // Tertiary Fixed
        tertiaryFixed: '#e0e0ff',
        tertiaryFixedDim: '#bdc2ff',
        onTertiaryFixed: '#000767',
        onTertiaryFixedVariant: '#343d96',

        // Error
        error: '#ba1a1a',
        onError: '#ffffff',
        errorContainer: '#ffdad6',
        onErrorContainer: '#93000a',

        // Background
        background: '#faf8ff',
        onBackground: '#131b2e',

        // Surface Variant
        surfaceVariant: '#dae2fd',

        // Extended Semantic
        surfaceIndigo: '#F8FAFF',
        surfaceSlate: '#F1F5F9',
        successMint: '#ECFDF5',
        accentTeal: '#0D9488',
        borderSubtle: '#E2E8F0',
    },

    typography: {
        fontFamily: {
            sans: "'Plus Jakarta Sans', system-ui, sans-serif",
            mono: "'JetBrains Mono', 'Fira Code', monospace",
        },
        displayLg: {
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: '56px',
            fontWeight: 700,
            lineHeight: '64px',
            letterSpacing: '-0.02em',
        },
        headlineLg: {
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: '32px',
            fontWeight: 700,
            lineHeight: '40px',
            letterSpacing: '-0.01em',
        },
        headlineLgMobile: {
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: '28px',
            fontWeight: 700,
            lineHeight: '36px',
        },
        headlineMd: {
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: '24px',
            fontWeight: 600,
            lineHeight: '32px',
        },
        bodyLg: {
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: '18px',
            fontWeight: 400,
            lineHeight: '28px',
        },
        bodyMd: {
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '24px',
        },
        labelLg: {
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: '20px',
            letterSpacing: '0.02em',
        },
        labelSm: {
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: '12px',
            fontWeight: 500,
            lineHeight: '16px',
            letterSpacing: '0.04em',
        },
        codeMd: {
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '20px',
        },
    },

    borderRadius: {
        sm: '0.25rem',   // 4px
        base: '0.5rem',    // 8px
        md: '0.75rem',   // 12px
        lg: '1rem',      // 16px
        xl: '1.5rem',    // 24px
        full: '9999px',
    },

    spacing: {
        base: '8px',
        containerMax: '1280px',
        gutterDesktop: '24px',
        marginDesktop: '48px',
        marginMobile: '16px',
        stackSm: '12px',
        stackMd: '24px',
        stackLg: '48px',
    },

    shadows: {
        level0: 'none',
        level1: '0 1px 3px rgba(67, 85, 185, 0.04)',
        level2: '0 4px 20px rgba(63, 81, 181, 0.08)',
        level3: '0 8px 32px rgba(63, 81, 181, 0.14)',
    },
} as const;

// ─────────────────────────────────────────────
// Derived types — use these in components
// ─────────────────────────────────────────────

export type Theme = typeof theme;
export type ThemeColor = keyof typeof theme.colors;
export type ThemeSpacing = keyof typeof theme.spacing;
export type ThemeShadow = keyof typeof theme.shadows;
export type ThemeBorderRadius = keyof typeof theme.borderRadius;
export type ThemeTypography = keyof typeof theme.typography;