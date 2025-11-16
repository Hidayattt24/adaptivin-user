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

  // Load user dari storage saat mount (hanya sekali)
  useEffect(() => {
    try {
      // Clean up any corrupted data first
      cleanupCorruptedStorage();

      const savedUser = getStorage<User>(StorageKeys.USER);
      if (savedUser && savedUser.role && savedUser.email) {
        setUser(savedUser);
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
