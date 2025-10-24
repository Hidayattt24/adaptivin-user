/**
 * Class Theme Configuration
 *
 * This file contains all theme configurations for different class levels.
 * Easy to extend for new classes when admin adds them.
 *
 * Usage:
 * - Import `getClassTheme(classId)` to get theme for a specific class
 * - Add new class themes here when needed
 * - All colors, gradients, and styling tokens in one place
 */

export interface ClassTheme {
  id: string;
  name: string;
  romanNumeral: string;
  pixelArt: {
    left: string; // Path to left pixel art image
    right: string; // Path to right pixel art image
  };
  colors: {
    primary: string;
    primaryDark: string;
    secondary: string;
    light: string;
    text: {
      primary: string;
      secondary: string;
      light: string;
    };
    badge: string;
    iconBg: string;
  };
  gradients: {
    background: string;
    badge: string | null;
    badgeLabel: string; // New: gradient for "Materi Pembelajaran" badge
    card: string | null;
  };
}

export const CLASS_THEMES: Record<string, ClassTheme> = {
  "4": {
    id: "4",
    name: "Kelas 4",
    romanNumeral: "IV",
    pixelArt: {
      left: "/siswa/pixel/pixel-bintang-hijau-kelas4.svg",
      right: "/siswa/pixel/pixel-komputer-hijau-kelas4.svg",
    },
    colors: {
      primary: "#2ea062",
      primaryDark: "#113a23",
      secondary: "#2ea062",
      light: "#2ea062",
      text: {
        primary: "#113a23",
        secondary: "#2ea062",
        light: "#ffffff",
      },
      badge: "transparent",
      iconBg: "#2ea062",
    },
    gradients: {
      background: "linear-gradient(180deg, #2EA062 0%, #FFF 100%)",
      badge: "linear-gradient(91deg, #67C090 -13.49%, #305A44 114.35%)",
      badgeLabel: "linear-gradient(91deg, #67C090 -13.49%, #305A44 114.35%)",
      card: null,
    },
  },
  "5": {
    id: "5",
    name: "Kelas 5",
    romanNumeral: "V",
    pixelArt: {
      left: "/siswa/pixel/pixel-music-kuning-kelas5.svg",
      right: "/siswa/pixel/pixel-orang-kuning-kelas5.svg",
    },
    colors: {
      primary: "#daa705",
      primaryDark: "#daa705",
      secondary: "#fcc61d",
      light: "#fcc61d",
      text: {
        primary: "#daa705",
        secondary: "#fcc61d",
        light: "#ffffff",
      },
      badge: "#fcc61d",
      iconBg: "#fcc61d",
    },
    gradients: {
      background: "linear-gradient(180deg, #DAA705 0%, #FFF 100%)",
      badge: "linear-gradient(91deg, #FCC61D -13.49%, #DAA705 114.35%)",
      badgeLabel: "linear-gradient(91deg, #FCC61D -13.49%, #DAA705 114.35%)",
      card: null,
    },
  },
  "6": {
    id: "6",
    name: "Kelas 6",
    romanNumeral: "VI",
    pixelArt: {
      left: "/siswa/pixel/pixel-bintang-ungu-kelas6.svg",
      right: "/siswa/pixel/pixel-roket-ungu-kelas6.svg",
    },
    colors: {
      primary: "#640d5f",
      primaryDark: "#640d5f",
      secondary: "#cf67c9",
      light: "#cf67c9",
      text: {
        primary: "#640d5f",
        secondary: "#cf67c9",
        light: "#ffffff",
      },
      badge: "transparent",
      iconBg: "#cf67c9",
    },
    gradients: {
      background: "linear-gradient(180deg, #640D5F 0%, #FFF 100%)",
      badge: "linear-gradient(91deg, #CF67C9 -13.49%, #640D5F 114.35%)",
      badgeLabel: "linear-gradient(91deg, #CF67C9 -13.49%, #640D5F 114.35%)",
      card: null,
    },
  },
};

/**
 * Get theme configuration for a specific class
 * @param classId - The class ID (e.g., '4', '5', '6')
 * @returns ClassTheme object or default theme if not found
 */
export function getClassTheme(classId: string): ClassTheme {
  const theme = CLASS_THEMES[classId];

  if (!theme) {
    console.warn(
      `Theme for class ${classId} not found, using default (class 4)`
    );
    return CLASS_THEMES["4"];
  }

  return theme;
}

/**
 * Get all available class themes
 * Useful for admin panel or class selection
 */
export function getAllClassThemes(): ClassTheme[] {
  return Object.values(CLASS_THEMES);
}

/**
 * Check if a class theme exists
 */
export function hasClassTheme(classId: string): boolean {
  return classId in CLASS_THEMES;
}

/**
 * Get class IDs that have themes configured
 */
export function getAvailableClassIds(): string[] {
  return Object.keys(CLASS_THEMES);
}
