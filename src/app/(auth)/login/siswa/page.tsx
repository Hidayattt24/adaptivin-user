"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const LoginSiswaPage = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/siswa/beranda");
    } catch (error) {
      setError("Login failed: " + error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Image
            src="/logo/logo-with-name.svg"
            alt="Adaptivin Logo"
            width={150}
            height={75}
            className="mx-auto mb-6"
          />
          <h1 className="poppins-bold text-2xl text-gray-800 mb-2">
            Masuk Sebagai Siswa
          </h1>
          <p className="text-gray-600">
            Selamat datang kembali! Yuk lanjutkan belajar matematika
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm poppins-semibold text-gray-700 mb-2"
              >
                Username atau Email
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-black/60 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Masukkan username atau email"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm poppins-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-black/60 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Masukkan password"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Ingat saya</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Lupa password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg poppins-semibold hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Masuk
            </button>
          </form>

          {error && (
            <div className="mt-4 text-red-600 text-sm text-center">
              {error}
            </div>
          )}
        </div>

        {/* Back to Role Selection */}
        <div className="mt-6 text-center">
          <Link
            href="/pick-role"
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Kembali ke pemilihan peran
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginSiswaPage;
