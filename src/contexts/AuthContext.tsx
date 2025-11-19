"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  setStorage,
  getStorage,
  setCookie,
  clearAuth,
  cleanupCorruptedStorage,
  StorageKeys,
} from "@/lib/storage";

interface User {
  id: string;
  email: string;
  role: string;
  nama_lengkap: string;
  alamat?: string;
  jenis_kelamin?: string;
  tanggal_lahir?: string;
  nip?: string;
  nisn?: string;
  sekolah_id?: string;
  has_completed_onboarding?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, expectedRole?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const queryClient = useQueryClient();

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // Idle timeout - 30 minutes in milliseconds
  const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  const WARNING_BEFORE_TIMEOUT = 5 * 60 * 1000; // 5 minutes before timeout
  const ACTIVITY_STORAGE_KEY = "adaptivin_last_activity"; // Key for cross-tab sync
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [hasShownWarning, setHasShownWarning] = useState<boolean>(false);

  // Load user dari storage saat mount (hanya sekali)
  useEffect(() => {
    try {
      // Clean up any corrupted data first
      cleanupCorruptedStorage();

      const savedUser = getStorage<User>(StorageKeys.USER);
      if (savedUser && savedUser.role && savedUser.email) {
        setUser(savedUser);

        // Load last activity from localStorage for cross-tab sync
        const savedActivity = localStorage.getItem(ACTIVITY_STORAGE_KEY);
        if (savedActivity) {
          const activityTime = parseInt(savedActivity, 10);
          if (!isNaN(activityTime)) {
            setLastActivity(activityTime);
          }
        }
      } else if (savedUser) {
        // Data user tidak lengkap, clear storage
        console.warn("Incomplete user data in storage, clearing...");
        clearAuth();
      }
    } catch (error) {
      console.error("Error loading user from storage:", error);
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Session timeout management
  useEffect(() => {
    if (!user) return;

    let timeoutId: NodeJS.Timeout;

    const checkIdleTimeout = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;

      if (timeSinceLastActivity >= IDLE_TIMEOUT) {
        // Session expired
        handleSessionExpired();
      } else if (
        timeSinceLastActivity >= (IDLE_TIMEOUT - WARNING_BEFORE_TIMEOUT) &&
        !hasShownWarning
      ) {
        // Show warning 5 minutes before timeout
        setHasShownWarning(true);
        showIdleWarning();
        // Continue checking
        timeoutId = setTimeout(checkIdleTimeout, 60 * 1000);
      } else {
        // Check again in 1 minute
        timeoutId = setTimeout(checkIdleTimeout, 60 * 1000);
      }
    };

    const showIdleWarning = async () => {
      // Show warning toast - non-blocking
      const Toast = (await import("sweetalert2")).default.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Toast.stopTimer);
          toast.addEventListener("mouseleave", Toast.resumeTimer);
        },
      });

      Toast.fire({
        icon: "warning",
        title: "Sesi Akan Berakhir",
        text: "Sesi Anda akan berakhir dalam 5 menit karena tidak ada aktivitas. Lakukan aktivitas untuk tetap login.",
      });
    };

    const handleSessionExpired = async () => {
      // Clear user data
      setUser(null);
      queryClient.clear();
      clearAuth();

      // Clear activity storage for cross-tab sync
      try {
        localStorage.removeItem(ACTIVITY_STORAGE_KEY);
      } catch (error) {
        console.warn("Failed to clear activity storage:", error);
      }

      // Show session expired message
      await import("sweetalert2").then((Swal) => {
        Swal.default.fire({
          icon: "warning",
          title: "Sesi Berakhir",
          text: "Sesi Anda telah berakhir karena tidak aktif selama 30 menit. Silakan login kembali.",
          confirmButtonColor: "#336d82",
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then(() => {
          // Redirect to login page instead of splash
          router.push("/login");
        });
      });
    };

    const resetIdleTimer = () => {
      const now = Date.now();
      setLastActivity(now);

      // Sync to localStorage for cross-tab communication
      try {
        localStorage.setItem(ACTIVITY_STORAGE_KEY, now.toString());
      } catch (error) {
        console.warn("Failed to sync activity to localStorage:", error);
      }

      // Reset warning flag when user is active again
      if (hasShownWarning) {
        setHasShownWarning(false);
      }
    };

    // Cross-tab sync: Listen for activity updates from other tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === ACTIVITY_STORAGE_KEY && event.newValue) {
        const activityTime = parseInt(event.newValue, 10);
        if (!isNaN(activityTime)) {
          setLastActivity(activityTime);
          // Reset warning if activity detected from another tab
          if (hasShownWarning) {
            setHasShownWarning(false);
          }
        }
      }
    };

    // Activity listeners
    const events = ["mousedown", "keydown", "scroll", "touchstart", "click"];
    events.forEach((event) => {
      window.addEventListener(event, resetIdleTimer);
    });

    // Storage listener for cross-tab sync
    window.addEventListener("storage", handleStorageChange);

    // Start checking
    timeoutId = setTimeout(checkIdleTimeout, 60 * 1000);

    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => {
        window.removeEventListener(event, resetIdleTimer);
      });
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [user, lastActivity, hasShownWarning, router, queryClient]);

  const login = async (email: string, password: string, expectedRole?: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, expectedRole }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || errorData.message || "Login gagal");
      }

      const responseData = await res.json();

      // Backend response: { success: true, status: "success", data: { token, user }, message }
      // Validasi response structure
      if (!responseData.success || !responseData.data) {
        console.error("Response login tidak valid:", responseData);
        throw new Error(responseData.message || "Response login tidak valid");
      }

      const { token, user } = responseData.data;

      // Validasi user data
      if (!user || !user.role || !user.email || !token) {
        console.error("Data user tidak lengkap:", {
          hasUser: !!user,
          hasRole: !!user?.role,
          hasEmail: !!user?.email,
          hasToken: !!token,
        });
        throw new Error("Data user tidak lengkap");
      }

      // Validate role (hanya guru dan siswa)
      const allowedRoles = ["guru", "siswa"];
      if (!allowedRoles.includes(user.role)) {
        throw new Error("Akses ditolak: role tidak sesuai");
      }

      // PENTING: Clear semua cache dan storage sebelum login baru
      // Ini mencegah data user lama muncul di UI
      queryClient.clear(); // Clear semua React Query cache
      clearAuth(); // Clear localStorage dan cookies lama

      // Update state dengan user baru
      setUser(user);

      // Simpan data user baru dengan prefix untuk menghindari collision dengan admin
      setStorage(StorageKeys.USER, user);
      setStorage(StorageKeys.TOKEN, token);

      // Simpan ke cookie dengan prefix untuk middleware
      setCookie("token", token, { maxAge: 86400 }); // 1 day
      setCookie("role", user.role, { maxAge: 86400 });

      // Set onboarding cookie jika user sudah complete (untuk siswa)
      if (user.role === "siswa" && user.has_completed_onboarding) {
        setCookie("hasSeenOnboarding", "true", { maxAge: 365 * 24 * 60 * 60 }); // 1 year in seconds
      }

      // Initialize activity timestamp for cross-tab sync
      try {
        const now = Date.now();
        localStorage.setItem(ACTIVITY_STORAGE_KEY, now.toString());
        setLastActivity(now);
      } catch (error) {
        console.warn("Failed to initialize activity storage:", error);
      }

      // Note: Redirect dilakukan di halaman login, bukan di sini
      // Ini untuk menghindari race condition dengan cookie management
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login gagal";
      console.error("Login error:", errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call backend logout API
      const token = getStorage<string>(StorageKeys.TOKEN);
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }).catch((err) => console.warn("Logout API warning:", err));
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear client-side data
      setUser(null);
      queryClient.clear(); // Clear semua React Query cache
      clearAuth(); // Clear localStorage dan cookies dengan prefix adaptivin_user_

      // Clear activity storage for cross-tab sync
      try {
        localStorage.removeItem(ACTIVITY_STORAGE_KEY);
      } catch (error) {
        console.warn("Failed to clear activity storage:", error);
      }

      router.push("/splash");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
