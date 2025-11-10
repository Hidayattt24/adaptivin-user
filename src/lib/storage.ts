/**
 * Storage Utility untuk FE Adaptivin (User Platform)
 *
 * Menggunakan prefix dinamis berdasarkan role untuk menghindari collision
 * antara guru dan siswa yang login di browser yang sama
 *
 * Format: "adaptivin_{role}_" (contoh: "adaptivin_guru_", "adaptivin_siswa_")
 */

// Get current active role from URL path
const getCurrentRole = (): "guru" | "siswa" | "user" => {
  if (typeof window === "undefined") return "user";

  const path = window.location.pathname;
  if (path.includes("/guru")) return "guru";
  if (path.includes("/siswa")) return "siswa";

  return "user";
};

// Get dynamic prefix based on current role
const getStoragePrefix = (): string => {
  const role = getCurrentRole();
  return `adaptivin_${role}_`;
};

// These will be called each time to get fresh prefix
const getPrefix = () => getStoragePrefix();
const getCookiePrefix = () => getStoragePrefix();

// ==================== LocalStorage ====================

/**
 * Simpan data ke localStorage dengan prefix
 */
export const setStorage = (key: string, value: unknown): void => {
  try {
    const prefix = getPrefix();
    const prefixedKey = `${prefix}${key}`;
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(prefixedKey, serializedValue);
  } catch (error) {
    console.error(`Failed to save to localStorage (key: ${key}):`, error);
  }
};

/**
 * Ambil data dari localStorage dengan prefix
 */
export const getStorage = <T = unknown>(key: string): T | null => {
  try {
    const prefix = getPrefix();
    const prefixedKey = `${prefix}${key}`;
    const item = localStorage.getItem(prefixedKey);

    // Check if item exists and is not "undefined" string
    if (!item || item === "undefined" || item === "null") {
      return null;
    }

    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Failed to read from localStorage (key: ${key}):`, error);
    // Clear corrupted data
    try {
      const prefix = getPrefix();
      const prefixedKey = `${prefix}${key}`;
      localStorage.removeItem(prefixedKey);
    } catch (e) {
      // Ignore cleanup errors
    }
    return null;
  }
};

/**
 * Hapus item dari localStorage
 */
export const removeStorage = (key: string): void => {
  try {
    const prefix = getPrefix();
    const prefixedKey = `${prefix}${key}`;
    localStorage.removeItem(prefixedKey);
  } catch (error) {
    console.error(`Failed to remove from localStorage (key: ${key}):`, error);
  }
};

/**
 * Hapus semua item dengan prefix dari localStorage
 */
export const clearStorage = (): void => {
  try {
    const prefix = getPrefix();
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error("Failed to clear localStorage:", error);
  }
};

// ==================== Cookies ====================

/**
 * Simpan cookie dengan prefix
 */
export const setCookie = (
  name: string,
  value: string,
  options: {
    maxAge?: number; // in seconds
    path?: string;
    secure?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
  } = {}
): void => {
  try {
    const prefix = getCookiePrefix();
    const prefixedName = `${prefix}${name}`;
    const {
      maxAge = 86400, // 1 day default
      path = "/",
      secure = false,
      sameSite = "Lax",
    } = options;

    let cookieString = `${prefixedName}=${encodeURIComponent(value)}`;
    cookieString += `; path=${path}`;
    cookieString += `; max-age=${maxAge}`;
    cookieString += `; SameSite=${sameSite}`;

    if (secure) {
      cookieString += "; Secure";
    }

    document.cookie = cookieString;
  } catch (error) {
    console.error(`Failed to set cookie (name: ${name}):`, error);
  }
};

/**
 * Ambil cookie dengan prefix
 */
export const getCookie = (name: string): string | null => {
  try {
    const prefix = getCookiePrefix();
    const prefixedName = `${prefix}${name}`;
    const cookies = document.cookie.split("; ");

    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split("=");
      if (cookieName === prefixedName) {
        return decodeURIComponent(cookieValue);
      }
    }

    return null;
  } catch (error) {
    console.error(`Failed to read cookie (name: ${name}):`, error);
    return null;
  }
};

/**
 * Hapus cookie dengan prefix
 */
export const removeCookie = (name: string, path: string = "/"): void => {
  try {
    const prefix = getCookiePrefix();
    const prefixedName = `${prefix}${name}`;
    document.cookie = `${prefixedName}=; path=${path}; max-age=0`;
  } catch (error) {
    console.error(`Failed to remove cookie (name: ${name}):`, error);
  }
};

/**
 * Clear semua cookies dengan prefix adaptivin_user_
 */
export const clearCookies = (): void => {
  try {
    const prefix = getCookiePrefix();
    const cookies = document.cookie.split("; ");

    cookies.forEach((cookie) => {
      const [name] = cookie.split("=");
      if (name.startsWith(prefix)) {
        const cleanName = name.replace(prefix, "");
        removeCookie(cleanName);
      }
    });
  } catch (error) {
    console.error("Failed to clear cookies:", error);
  }
};

// ==================== Typed Storage Keys ====================

/**
 * Type-safe storage keys untuk aplikasi
 */
export const StorageKeys = {
  USER: "user",
  TOKEN: "token",
  THEME: "theme",
  LAST_VISITED_CLASS: "last_visited_class",
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];

// ==================== Helper Functions ====================

/**
 * Check apakah user sudah login
 */
export const isAuthenticated = (): boolean => {
  const token = getStorage<string>(StorageKeys.TOKEN);
  const user = getStorage(StorageKeys.USER);
  return !!(token && user);
};

/**
 * Get current user dari storage
 */
export const getCurrentUser = () => {
  return getStorage<{
    id: string;
    email: string;
    role: string;
    nama_lengkap: string;
    [key: string]: unknown;
  }>(StorageKeys.USER);
};

/**
 * Get current token dari storage
 */
export const getCurrentToken = (): string | null => {
  return getStorage<string>(StorageKeys.TOKEN);
};

/**
 * Clear semua data authentication
 */
export const clearAuth = (): void => {
  removeStorage(StorageKeys.USER);
  removeStorage(StorageKeys.TOKEN);
  removeCookie("token");
  removeCookie("role");
  removeCookie("hasSeenOnboarding"); // Clear onboarding status on logout
  removeCookie("hasSeenSplash"); // Clear splash status on logout
};

/**
 * Clean up corrupted localStorage data
 * Call this on app initialization
 */
export const cleanupCorruptedStorage = (): void => {
  try {
    const prefix = getPrefix();
    const keys = Object.keys(localStorage);

    keys.forEach((key) => {
      if (key.startsWith(prefix)) {
        try {
          const value = localStorage.getItem(key);
          // Remove if value is "undefined" or "null" string
          if (value === "undefined" || value === "null") {
            console.warn(`Removing corrupted localStorage key: ${key}`);
            localStorage.removeItem(key);
          }
        } catch {
          // If we can't read it, remove it
          console.warn(`Removing unreadable localStorage key: ${key}`);
          localStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    console.error("Failed to cleanup corrupted storage:", error);
  }
};
