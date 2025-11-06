"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  setStorage,
  getStorage,
  setCookie,
  clearAuth,
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
  login: (email: string, password: string) => Promise<void>;
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
    const savedUser = getStorage<User>(StorageKeys.USER);
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || errorData.message || "Login gagal");
      }

      const data = await res.json();

      // Validate role (hanya guru dan siswa)
      const allowedRoles = ["guru", "siswa"];
      if (!allowedRoles.includes(data.user.role)) {
        throw new Error("Akses ditolak: role tidak sesuai");
      }

      // PENTING: Clear semua cache dan storage sebelum login baru
      // Ini mencegah data user lama muncul di UI
      queryClient.clear(); // Clear semua React Query cache
      clearAuth(); // Clear localStorage dan cookies lama

      // Update state dengan user baru
      setUser(data.user);

      // Simpan data user baru dengan prefix untuk menghindari collision dengan admin
      setStorage(StorageKeys.USER, data.user);
      setStorage(StorageKeys.TOKEN, data.token);

      // Simpan ke cookie dengan prefix untuk middleware
      setCookie("token", data.token, { maxAge: 86400 }); // 1 day
      setCookie("role", data.user.role, { maxAge: 86400 });

      // Redirect berdasarkan role
      if (data.user.role === "guru") {
        router.push("/guru/dashboard");
      } else if (data.user.role === "siswa") {
        router.push("/siswa/beranda");
      }
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
