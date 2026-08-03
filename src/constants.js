/**
 * Design System Constants
 * Single source of truth for colors, spacing, breakpoints
 */

export const COLORS = {
  // Text Colors - WCAG AAA Compliant
  TEXT: {
    PRIMARY: "#1F2937", // text-gray-900 (high contrast)
    SECONDARY: "#374151", // text-gray-700 (readable)
    TERTIARY: "#6B7280", // text-gray-500 (secondary info)
    LIGHT: "#D1D5DB", // text-gray-300 (disabled/placeholder)
    MUTED: "#9CA3AF", // text-gray-400 (captions)
  },
  
  // Background Colors
  BG: {
    PRIMARY: "#FFFFFF",
    SECONDARY: "#F9FAFB", // bg-gray-50
    TERTIARY: "#F3F4F6", // bg-gray-100
    CREAM: "#FFFAF0", // Nivesh brand (bg-amber-50)
    DARK: "#111827", // Dark mode support
  },

  // Accent Colors
  ACCENT: {
    BLUE: "#3B82F6",
    GREEN: "#10B981",
    RED: "#EF4444",
    AMBER: "#F59E0B",
  },
};

export const TYPOGRAPHY = {
  FONT_FAMILY: {
    SANS: "'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', sans-serif",
    MONO: "'JetBrains Mono', 'Fira Code', monospace",
  },
  
  FONT_SIZE: {
    XS: "12px", // 0.75rem
    SM: "14px", // 0.875rem
    BASE: "16px", // 1rem
    LG: "18px", // 1.125rem
    XL: "20px", // 1.25rem
    "2XL": "24px", // 1.5rem
    "3XL": "30px", // 1.875rem
  },

  LINE_HEIGHT: {
    TIGHT: 1.25,
    NORMAL: 1.5,
    RELAXED: 1.625,
    LOOSE: 1.75,
  },

  FONT_WEIGHT: {
    LIGHT: 300,
    NORMAL: 400,
    MEDIUM: 500,
    SEMIBOLD: 600,
    BOLD: 700,
  },
};

export const BREAKPOINTS = {
  MOBILE: 640,      // sm
  TABLET: 768,      // md
  LAPTOP: 1024,     // lg
  DESKTOP: 1280,    // xl
  WIDE: 1536,       // 2xl
};

export const Z_INDEX = {
  DROPDOWN: 40,
  STICKY: 40,
  MODAL: 50,
  TOOLTIP: 60,
  NOTIFICATION: 70,
};

export const SPACING = {
  XS: "4px",
  SM: "8px",
  MD: "12px",
  LG: "16px",
  XL: "24px",
  "2XL": "32px",
  "3XL": "48px",
};