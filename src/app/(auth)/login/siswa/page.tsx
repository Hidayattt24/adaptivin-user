"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import swal from "sweetalert";

const LoginSiswaPage = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Hapus cookie onboarding sebelum login untuk memaksa tampil onboarding lagi
      document.cookie = "adaptivin_user_hasSeenOnboarding=; path=/; max-age=0";

      await login(email, password);

      // Success SweetAlert
      await swal({
        title: "Login Berhasil!",
        text: "Selamat datang di Adaptivin",
        icon: "success",
        buttons: {
          confirm: {
            text: "OK",
            className: "swal-button-custom",
          },
        },
        className: "swal-custom",
      });

      // Redirect ke onboarding dengan replace untuk menghindari history
      router.replace("/siswa/onboarding");
    } catch (error: unknown) {
      setIsLoading(false);

      let errorMessage =
        "Login gagal. Periksa kembali username dan password Anda.";
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }

      // Error SweetAlert
      swal({
        title: "Login Gagal!",
        text: errorMessage,
        icon: "error",
        buttons: {
          confirm: {
            text: "Coba Lagi",
            className: "swal-button-custom",
          },
        },
        className: "swal-custom",
      });
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #33A1E0 0.03%, #0A3D60 124.56%)",
      }}
    >
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md mx-auto">
          {/* Login Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm border border-white/50">
            {/* Logo inside form */}
            <div className="text-center mb-6">
              <Image
                src="/logo/logo-with-name.svg"
                alt="Adaptivin Logo"
                width={160}
                height={80}
                className="mx-auto mb-4"
              />
              <h1
                className="poppins-bold text-2xl mb-2"
                style={{ color: "#1C6EA4" }}
              >
                Masuk Sebagai Siswa
              </h1>
              <p className="text-gray-600 text-sm poppins-regular">
                Masukkan data yang diberikan sekolah
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Input */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm poppins-semibold mb-2"
                  style={{ color: "#1C6EA4" }}
                >
                  Username atau Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5"
                      style={{ color: "#1C6EA4" }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-gray-700 border border-gray-300 rounded-xl transition-all duration-200 poppins-regular focus-1c6ea4"
                    placeholder="Masukkan username atau email"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm poppins-semibold mb-2"
                  style={{ color: "#1C6EA4" }}
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5"
                      style={{ color: "#1C6EA4" }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 text-gray-700 border border-gray-300 rounded-xl transition-all duration-200 poppins-regular focus-1c6ea4"
                    placeholder="Masukkan password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 border-gray-300 rounded cursor-pointer checkbox-1c6ea4"
                    disabled={isLoading}
                  />
                  <span className="ml-2 text-sm text-gray-600 poppins-regular">
                    Ingat saya
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white py-3.5 rounded-xl poppins-bold transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-offset-2 shadow-lg hover:shadow-xl button-1c6ea4 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Memproses...</span>
                  </>
                ) : (
                  "Masuk"
                )}
              </button>
            </form>
          </div>

          {/* Back to Role Selection */}
          <div className="mt-6 text-center">
            <Link
              href="/pick-role"
              className="inline-flex items-center text-white/90 hover:text-white text-sm poppins-semibold hover:underline transition-colors"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Kembali ke pemilihan peran
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        :global(.focus-1c6ea4:focus) {
          outline: none;
          border-color: #1c6ea4;
          box-shadow: 0 0 0 3px rgba(28, 110, 164, 0.1);
        }

        :global(.button-1c6ea4) {
          background-color: #1c6ea4;
        }

        :global(.button-1c6ea4:hover:not(:disabled)) {
          background-color: #155a89;
        }

        :global(.checkbox-1c6ea4) {
          accent-color: #1c6ea4;
        }

        /* Custom SweetAlert Styling */
        :global(.swal-custom) {
          font-family: "Poppins", sans-serif;
          border-radius: 20px;
          padding: 20px;
        }

        :global(.swal-custom .swal-title) {
          font-family: "Poppins", sans-serif;
          font-weight: 700;
          color: #1c6ea4;
          font-size: 24px;
          margin-bottom: 10px;
        }

        :global(.swal-custom .swal-text) {
          font-family: "Poppins", sans-serif;
          font-weight: 400;
          color: #4a5568;
          font-size: 16px;
        }

        :global(.swal-button-custom) {
          background-color: #1c6ea4 !important;
          border-radius: 12px !important;
          padding: 12px 32px !important;
          font-family: "Poppins", sans-serif !important;
          font-weight: 600 !important;
          font-size: 16px !important;
          transition: all 0.2s ease !important;
        }

        :global(.swal-button-custom:hover) {
          background-color: #155a89 !important;
          transform: scale(1.02);
        }

        :global(.swal-button-custom:focus) {
          box-shadow: 0 0 0 3px rgba(28, 110, 164, 0.3) !important;
        }

        :global(.swal-icon--success__ring) {
          border-color: #1c6ea4 !important;
        }

        :global(.swal-icon--success__line) {
          background-color: #1c6ea4 !important;
        }

        :global(.swal-overlay) {
          background-color: rgba(10, 61, 96, 0.8);
          backdrop-filter: blur(4px);
        }
      `}</style>
    </div>
  );
};

export default LoginSiswaPage;
