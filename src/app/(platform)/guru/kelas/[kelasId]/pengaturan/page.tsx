"use client";

import React, { useState, useEffect } from "react";
import { TeacherProfile } from "@/components/guru";
import { getMyProfile, updateMyProfile, updateMyPassword } from "@/lib/api/user";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import SaveIcon from "@mui/icons-material/Save";
import Swal from "sweetalert2";

const PengaturanGuruPage = () => {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    nip: "",
    jenis_kelamin: "",
    alamat: "",
    tanggal_lahir: "",
    passwordLama: "",
    passwordBaru: "",
    konfirmasiPassword: "",
  });

  const [activeSection, setActiveSection] = useState<string>("profil");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const profile = await getMyProfile();

        setFormData({
          nama: profile.nama_lengkap || "",
          email: profile.email || "",
          nip: profile.nip || "",
          jenis_kelamin: profile.jenis_kelamin || "",
          alamat: profile.alamat || "",
          tanggal_lahir: profile.tanggal_lahir || "",
          passwordLama: "",
          passwordBaru: "",
          konfirmasiPassword: "",
        });
      } catch (err) {
        const error = err as { response?: { data?: { error?: string } } };
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error.response?.data?.error || "Gagal memuat data profil",
          confirmButtonColor: "#336d82",
        });
        setError(error.response?.data?.error || "Gagal memuat data profil");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      // Validasi jika section keamanan (password)
      if (activeSection === "keamanan") {
        if (!formData.passwordLama || !formData.passwordBaru || !formData.konfirmasiPassword) {
          setError("Semua field password harus diisi");
          return;
        }

        if (formData.passwordBaru !== formData.konfirmasiPassword) {
          setError("Password baru dan konfirmasi password tidak cocok");
          return;
        }

        if (formData.passwordBaru.length < 8) {
          setError("Password baru minimal 8 karakter");
          return;
        }

        // Update password
        await updateMyPassword({
          currentPassword: formData.passwordLama,
          newPassword: formData.passwordBaru,
        });

        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Password berhasil diubah!",
          confirmButtonColor: "#336d82",
          timer: 2000,
        });

        // Clear password fields
        setFormData((prev) => ({
          ...prev,
          passwordLama: "",
          passwordBaru: "",
          konfirmasiPassword: "",
        }));

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);

        return;
      }

      // Update profil
      await updateMyProfile({
        nama_lengkap: formData.nama,
        jenis_kelamin: formData.jenis_kelamin,
        alamat: formData.alamat,
        tanggal_lahir: formData.tanggal_lahir,
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Profil berhasil diperbarui!",
        confirmButtonColor: "#336d82",
      });
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.response?.data?.error || "Gagal menyimpan perubahan",
        confirmButtonColor: "#336d82",
      });
      setError(error.response?.data?.error || "Gagal menyimpan perubahan");
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    { id: "profil", label: "Profil", icon: PersonIcon },
    { id: "keamanan", label: "Keamanan", icon: LockIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 rounded-4xl">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[25px] p-8 shadow-2xl">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-[#336d82]/30 border-t-[#336d82] rounded-full animate-spin"></div>
              <p className="text-[#336d82] poppins-semibold">Memuat data profil...</p>
            </div>
          </div>
        </div>
      )}

      {/* Outer Container with Rounded Corners and Gradient */}
      <div className="bg-gradient-to-br from-[#336D82] via-[#5a96a8] to-[#7bb3c4] rounded-[30px] shadow-2xl overflow-hidden">
        <div className="p-6">
          {/* Success/Error Messages */}
          {(successMessage || error) && (
            <div className="mb-6">
              {successMessage && (
                <div className="bg-green-50 border-2 border-green-200 text-green-700 px-6 py-4 rounded-[20px] flex items-center gap-3 poppins-medium">
                  <SaveIcon sx={{ fontSize: 24 }} />
                  <span>{successMessage}</span>
                </div>
              )}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-[20px] flex items-center gap-3 poppins-medium">
                  <LockIcon sx={{ fontSize: 24 }} />
                  <span>{error}</span>
                </div>
              )}
            </div>
          )}

          {/* Header Card with Enhanced Design */}
          <div className="relative mb-6 overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mt-12 -mr-12" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/5 rounded-full blur-2xl -mb-12 -ml-12" />

            {/* Content */}
            <div className="relative bg-white rounded-[25px] shadow-xl p-6 border-3 border-white/50">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-6">
                  <div className="transform transition-transform duration-300 scale-75">
                    <TeacherProfile profileImage="/guru/foto-profil/profil-guru.svg"
                    />
                  </div>
                  <div>
                    <h1 className="text-[#336d82] text-4xl poppins-bold mb-1 tracking-tight">
                      Pengaturan
                    </h1>
                    <p className="text-gray-600 text-base poppins-medium">
                      Kelola informasi akun Anda
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Sidebar Navigation with Modern Design */}
            <div className="lg:col-span-1">
              <div className="bg-white/95 backdrop-blur-lg rounded-[25px] shadow-xl p-4 sticky top-6 border-2 border-white/40">
                <div className="mb-3 pb-3 border-b-2 border-[#336d82]/20">
                  <h3 className="text-[#336d82] text-base poppins-bold">Menu</h3>
                </div>
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-[15px] transition-all duration-300 poppins-semibold text-sm ${activeSection === section.id
                          ? "bg-gradient-to-r from-[#336d82] to-[#5a96a8] text-white shadow-lg transform scale-105"
                          : "text-[#336d82] bg-white/50 hover:bg-white hover:shadow-md hover:transform hover:scale-102"
                          }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeSection === section.id ? "bg-white/20" : "bg-[#336d82]/10"
                          }`}>
                          <Icon sx={{ fontSize: 18 }} />
                        </div>
                        <span>{section.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Content Area with Enhanced Design */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-[25px] shadow-xl p-6 border-2 border-white/40">
                {/* Profil Section */}
                {activeSection === "profil" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b-2 border-[#336d82]/10">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#336d82] to-[#7bb3c4] rounded-[18px] flex items-center justify-center shadow-lg">
                        <PersonIcon sx={{ color: "white", fontSize: 24 }} />
                      </div>
                      <div>
                        <h2 className="text-[#336d82] text-3xl poppins-bold">
                          Informasi Profil
                        </h2>
                        <p className="text-gray-500 text-sm poppins-medium">
                          Data pribadi dan informasi kontak
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black/70">
                      <div className="space-y-2">
                        <label className="text-[#336d82] text-sm poppins-semibold">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          name="nama"
                          value={formData.nama}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-[#336d82]/20 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#336d82]/30 focus:border-[#336d82] poppins-medium text-base disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200 hover:border-[#336d82]/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[#336d82] text-sm poppins-semibold">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-[#336d82]/20 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#336d82]/30 focus:border-[#336d82] poppins-medium text-base disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200 hover:border-[#336d82]/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[#336d82] text-sm poppins-semibold">
                          NIP
                        </label>
                        <input
                          type="text"
                          name="nip"
                          value={formData.nip}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-[#336d82]/20 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#336d82]/30 focus:border-[#336d82] poppins-medium text-base bg-gray-50 cursor-not-allowed transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[#336d82] text-sm poppins-semibold">
                          Jenis Kelamin
                        </label>
                        <select
                          name="jenis_kelamin"
                          value={formData.jenis_kelamin}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-[#336d82]/20 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#336d82]/30 focus:border-[#336d82] poppins-medium text-base disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200 hover:border-[#336d82]/40"
                        >
                          <option value="">Pilih Jenis Kelamin</option>
                          <option value="Laki-laki">Laki-laki</option>
                          <option value="Perempuan">Perempuan</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[#336d82] text-sm poppins-semibold">
                          Tanggal Lahir
                        </label>
                        <input
                          type="date"
                          name="tanggal_lahir"
                          value={formData.tanggal_lahir}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-[#336d82]/20 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#336d82]/30 focus:border-[#336d82] poppins-medium text-base disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200 hover:border-[#336d82]/40"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 text-black/70">
                      <label className="text-[#336d82] text-sm poppins-semibold">
                        Alamat
                      </label>
                      <textarea
                        name="alamat"
                        value={formData.alamat}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-[#336d82]/20 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#336d82]/30 focus:border-[#336d82] poppins-medium text-base disabled:bg-gray-50 disabled:cursor-not-allowed resize-none transition-all duration-200 hover:border-[#336d82]/40"
                      />
                    </div>
                  </div>
                )}

                {/* Keamanan Section */}
                {activeSection === "keamanan" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b-2 border-[#336d82]/10">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#336d82] to-[#7bb3c4] rounded-[18px] flex items-center justify-center shadow-lg">
                        <LockIcon sx={{ color: "white", fontSize: 24 }} />
                      </div>
                      <div>
                        <h2 className="text-[#336d82] text-3xl poppins-bold">
                          Keamanan Akun
                        </h2>
                        <p className="text-gray-500 text-sm poppins-medium">
                          Kelola password dan keamanan akun
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-[#336d82]/10 via-[#5a96a8]/10 to-[#7bb3c4]/10 border-2 border-[#336d82]/20 rounded-[18px] p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#336d82] to-[#5a96a8] rounded-[15px] flex items-center justify-center flex-shrink-0 shadow-md">
                          <LockIcon sx={{ color: "white", fontSize: 20 }} />
                        </div>
                        <div>
                          <h3 className="text-[#336d82] text-base poppins-bold mb-2">
                            Tips Keamanan Password
                          </h3>
                          <ul className="text-[#336d82] text-sm poppins-medium space-y-1">
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-[#336d82] rounded-full"></span>
                              Minimal 8 karakter
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-[#336d82] rounded-full"></span>
                              Kombinasi huruf besar dan kecil
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-[#336d82] rounded-full"></span>
                              Gunakan angka dan simbol
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-[#336d82] rounded-full"></span>
                              Hindari kata-kata umum
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 text-black/70">
                      <div className="space-y-2">
                        <label className="text-[#336d82] text-sm poppins-semibold">
                          Password Lama
                        </label>
                        <input
                          type="password"
                          name="passwordLama"
                          value={formData.passwordLama}
                          onChange={handleInputChange}
                          placeholder="Masukkan password lama"
                          className="w-full px-4 py-3 border-2 border-[#336d82]/20 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#336d82]/30 focus:border-[#336d82] poppins-medium text-base transition-all duration-200 hover:border-[#336d82]/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[#336d82] text-sm poppins-semibold">
                          Password Baru
                        </label>
                        <input
                          type="password"
                          name="passwordBaru"
                          value={formData.passwordBaru}
                          onChange={handleInputChange}
                          placeholder="Masukkan password baru"
                          className="w-full px-4 py-3 border-2 border-[#336d82]/20 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#336d82]/30 focus:border-[#336d82] poppins-medium text-base transition-all duration-200 hover:border-[#336d82]/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[#336d82] text-sm poppins-semibold">
                          Konfirmasi Password Baru
                        </label>
                        <input
                          type="password"
                          name="konfirmasiPassword"
                          value={formData.konfirmasiPassword}
                          onChange={handleInputChange}
                          placeholder="Konfirmasi password baru"
                          className="w-full px-4 py-3 border-2 border-[#336d82]/20 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#336d82]/30 focus:border-[#336d82] poppins-medium text-base transition-all duration-200 hover:border-[#336d82]/40"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button with Enhanced Design */}
                <div className="mt-6 pt-6 border-t-2 border-[#336d82]/10">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full md:w-auto bg-gradient-to-r from-[#336d82] via-[#4a8199] to-[#5a96a8] hover:from-[#2a5a6a] hover:via-[#336d82] hover:to-[#4a8199] text-white px-8 py-3 rounded-[18px] flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 poppins-bold text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <SaveIcon sx={{ fontSize: 22 }} />
                        Simpan Perubahan
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PengaturanGuruPage;
