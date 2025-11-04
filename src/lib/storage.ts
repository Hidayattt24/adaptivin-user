/**
 * Storage Utility untuk FE Adaptivin (User Platform)
 *
 * Menggunakan prefix "adaptivin_user_" untuk menghindari collision
 * dengan aplikasi admin yang menggunakan "adaptivin_admin_"
 *
 * Ini memastikan localStorage dan cookies tidak tercampur
 * meskipun berjalan di localhost dengan port berbeda
 */

const STORAGE_PREFIX = "adaptivin_user_";
const COOKIE_PREFIX = "adaptivin_user_";

// ==================== LocalStorage ====================

/**
 * Simpan data ke localStorage dengan prefix
 */
export const setStorage = (key: string, value: unknown): void => {
  try {
    const prefixedKey = `${STORAGE_PREFIX}${key}`;
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
    const prefixedKey = `${STORAGE_PREFIX}${key}`;
    const item = localStorage.getItem(prefixedKey);

    if (!item) return null;

    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Failed to read from localStorage (key: ${key}):`, error);
    return null;
  }
};

/**
 * Hapus data dari localStorage dengan prefix
 */
export const removeStorage = (key: string): void => {
  try {
    const prefixedKey = `${STORAGE_PREFIX}${key}`;
    localStorage.removeItem(prefixedKey);
  } catch (error) {
    console.error(`Failed to remove from localStorage (key: ${key}):`, error);
  }
};

/**
 * Clear semua data dengan prefix adaptivin_user_
 */
export const clearStorage = (): void => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
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
    const prefixedName = `${COOKIE_PREFIX}${name}`;
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
    const prefixedName = `${COOKIE_PREFIX}${name}`;
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
    const prefixedName = `${COOKIE_PREFIX}${name}`;
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
    const cookies = document.cookie.split("; ");

    cookies.forEach((cookie) => {
      const [name] = cookie.split("=");
      if (name.startsWith(COOKIE_PREFIX)) {
        const cleanName = name.replace(COOKIE_PREFIX, "");
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
};
