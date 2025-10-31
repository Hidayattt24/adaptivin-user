"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GantiPasswordPage() {
  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
  const [showPasswordLama, setShowPasswordLama] = useState(false);
  const [showPasswordBaru, setShowPasswordBaru] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!passwordLama || !passwordBaru || !konfirmasiPassword) {
      alert("Semua field harus diisi!");
      return;
    }

    if (passwordBaru.length < 6) {
      alert("Password baru minimal 6 karakter!");
      return;
    }

    if (passwordBaru !== konfirmasiPassword) {
      alert("Password baru dan konfirmasi password tidak cocok!");
      return;
    }

    setIsLoading(true);

    // TODO: Implement actual API call
    setTimeout(() => {
      setIsLoading(false);
      alert("Password berhasil diubah!");
      router.push("/siswa/profil");
    }, 1000);
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-gradient-to-b from-[#336d82] to-[#91c6d9]">
      {/* Header - Responsive */}
      <div className="relative pt-8 md:pt-12 pb-6 px-6 md:px-8 lg:px-12">
        <div className="max-w-2xl mx-auto relative">
          <button
            onClick={() => router.back()}
            className="absolute left-0 top-0 w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
          >
            <span className="material-symbols-outlined text-white text-[24px] md:text-[28px]">
              arrow_back
            </span>
          </button>
          <h1 className="text-[24px] md:text-3xl lg:text-4xl font-semibold text-white text-center">
            Ganti Password
          </h1>
        </div>
      </div>

      {/* Content - Responsive with max-width */}
      <div className="px-6 md:px-8 lg:px-12 mt-8 md:mt-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-8 lg:p-10 shadow-xl">
            <form onSubmit={handleSubmit}>
              {/* Password Lama */}
              <div className="mb-4 md:mb-6">
                <label
                  htmlFor="passwordLama"
                  className="block text-[14px] md:text-base font-medium text-[#336d82] mb-2 md:mb-3"
                >
                  Password Lama
                </label>
                <div className="relative">
                  <input
                    type={showPasswordLama ? "text" : "password"}
                    id="passwordLama"
                    value={passwordLama}
                    onChange={(e) => setPasswordLama(e.target.value)}
                    className="w-full px-4 md:px-5 py-3 md:py-4 pr-12 md:pr-14 border-2 border-[#91c6d9]/30 rounded-[16px] md:rounded-[20px] text-[16px] md:text-lg text-[#336d82] focus:outline-none focus:border-[#336d82] transition-all duration-300"
                    placeholder="Masukkan password lama"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordLama(!showPasswordLama)}
                    className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-[#91c6d9] hover:text-[#336d82] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[24px] md:text-[28px]">
                      {showPasswordLama ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Password Baru */}
              <div className="mb-4 md:mb-6">
                <label
                  htmlFor="passwordBaru"
                  className="block text-[14px] md:text-base font-medium text-[#336d82] mb-2 md:mb-3"
                >
                  Password Baru
                </label>
                <div className="relative">
                  <input
                    type={showPasswordBaru ? "text" : "password"}
                    id="passwordBaru"
                    value={passwordBaru}
                    onChange={(e) => setPasswordBaru(e.target.value)}
                    className="w-full px-4 md:px-5 py-3 md:py-4 pr-12 md:pr-14 border-2 border-[#91c6d9]/30 rounded-[16px] md:rounded-[20px] text-[16px] md:text-lg text-[#336d82] focus:outline-none focus:border-[#336d82] transition-all duration-300"
                    placeholder="Masukkan password baru"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordBaru(!showPasswordBaru)}
                    className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-[#91c6d9] hover:text-[#336d82] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[24px] md:text-[28px]">
                      {showPasswordBaru ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Konfirmasi Password */}
              <div className="mb-6 md:mb-8">
                <label
                  htmlFor="konfirmasiPassword"
                  className="block text-[14px] md:text-base font-medium text-[#336d82] mb-2 md:mb-3"
                >
                  Konfirmasi Password Baru
                </label>
                <div className="relative">
                  <input
                    type={showKonfirmasi ? "text" : "password"}
                    id="konfirmasiPassword"
                    value={konfirmasiPassword}
                    onChange={(e) => setKonfirmasiPassword(e.target.value)}
                    className="w-full px-4 md:px-5 py-3 md:py-4 pr-12 md:pr-14 border-2 border-[#91c6d9]/30 rounded-[16px] md:rounded-[20px] text-[16px] md:text-lg text-[#336d82] focus:outline-none focus:border-[#336d82] transition-all duration-300"
                    placeholder="Konfirmasi password baru"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowKonfirmasi(!showKonfirmasi)}
                    className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-[#91c6d9] hover:text-[#336d82] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[24px] md:text-[28px]">
                      {showKonfirmasi ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-[#E8F6FF] rounded-[16px] md:rounded-[20px] p-4 md:p-5 mb-6 md:mb-8">
                <div className="flex gap-2 md:gap-3">
                  <span className="material-symbols-outlined text-[#336d82] text-[20px] md:text-[24px] flex-shrink-0">
                    lock
                  </span>
                  <div className="text-[12px] md:text-sm text-[#336d82] leading-relaxed">
                    <p className="font-semibold mb-1 md:mb-2">Tips Password Aman:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Minimal 6 karakter</li>
                      <li>Gunakan kombinasi huruf dan angka</li>
                      <li>Jangan gunakan tanggal lahir</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-r from-[#336d82] to-[#5b9db5] text-white text-[16px] md:text-lg font-semibold py-3 md:py-4 rounded-[20px] md:rounded-[24px] shadow-lg transition-all duration-300 ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {isLoading ? "Menyimpan..." : "Simpan Password Baru"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Add Google Material Symbols */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
    </div>
  );
}
