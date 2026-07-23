// ============================================
// utils.js
// This file just stores some fixed data
// (constants) that we reuse in App.jsx.
// Keeping it separate keeps App.jsx clean.
// ============================================

// This object stores the character limit for each platform.
// We use it like: CHARACTER_LIMITS["twitter"] -> 280
export const CHARACTER_LIMITS = {
  twitter: 280,
  linkedin: 3000,
  instagram: 2200,
};

// This array is used to fill the <select> dropdown options.
// Each item has a "value" (used in code) and a "label" (shown to user).
export const PLATFORMS = [
  { value: "twitter", label: "Twitter (280 characters)" },
  { value: "linkedin", label: "LinkedIn (3000 characters)" },
  { value: "instagram", label: "Instagram (2200 characters)" },
];
