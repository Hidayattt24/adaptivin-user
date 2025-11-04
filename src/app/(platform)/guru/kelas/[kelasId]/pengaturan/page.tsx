"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TeacherProfile } from "@/components/guru";
import {
  getMyProfile,
  updateMyProfile,
  updateMyPassword,
} from "@/lib/api/user";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Swal from "sweetalert2";

const PengaturanGuruPage = () => {
  const router = useRouter();

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
  const [showPasswordLama, setShowPasswordLama] = useState(false);
  const [showPasswordBaru, setShowPasswordBaru] = useState(false);
  const [showKonfirmasiPassword, setShowKonfirmasiPassword] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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
        if (
          !formData.passwordLama ||
          !formData.passwordBaru ||
          !formData.konfirmasiPassword
        ) {
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

  const handleBackClick = async () => {
    const result = await Swal.fire({
      title: "Kembali ke Dashboard?",
      text: "Apakah Anda yakin ingin kembali ke halaman dashboard?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#336d82",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Ya, Kembali",
      cancelButtonText: "Batal",
      background: "#ffffff",
      customClass: {
        popup: "rounded-[20px] shadow-2xl",
        title: "text-[#336d82] text-xl sm:text-2xl poppins-bold",
        htmlContainer: "text-gray-600 text-sm sm:text-base poppins-medium",
        confirmButton:
          "poppins-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-[12px]",
        cancelButton:
          "poppins-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-[12px]",
      },
    });

    if (result.isConfirmed) {
      router.push("/guru/dashboard");
    }
  };

  const sections = [
    { id: "profil", label: "Profil", icon: PersonIcon },
    { id: "keamanan", label: "Keamanan", icon: LockIcon },
    {
      id: "kembali",
      label: "Kembali",
      icon: KeyboardReturnIcon,
      action: handleBackClick,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 rounded-4xl">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[25px] p-8 shadow-2xl">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-[#336d82]/30 border-t-[#336d82] rounded-full animate-spin"></div>
              <p className="text-[#336d82] poppins-semibold">
                Memuat data profil...
              </p>
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
          <div className="relative mb-4 sm:mb-5 lg:mb-6 overflow-hidden">
            {/* Decorative Elements - Hidden on mobile */}
            <div className="hidden sm:block absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mt-12 -mr-12" />
            <div className="hidden sm:block absolute bottom-0 left-0 w-36 h-36 bg-white/5 rounded-full blur-2xl -mb-12 -ml-12" />

            {/* Content */}
            <div className="relative flex flex-row gap-8 bg-white rounded-[25px] shadow-xl p-6 border-3 border-white/50">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-6">
                  <div className="transform transition-transform duration-300 scale-75">
                    <TeacherProfile profileImage="/guru/foto-profil/profil-guru.svg" />
                  </div>
                </div>
              </div>

              {/* Desktop: Title & Edit Button */}
              <div className="hidden lg:flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-4 lg:gap-8 w-full sm:w-auto">
                  <div className="flex-1 min-w-0">
                    <h1 className="text-[#336d82] text-2xl sm:text-3xl lg:text-4xl poppins-bold mb-0.5 sm:mb-1 tracking-tight truncate">
                      Pengaturan
                    </h1>
                    <p className="text-gray-600 text-xs sm:text-sm lg:text-base poppins-medium truncate">
                      Kelola informasi akun Anda
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile: Edit Button */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="lg:hidden w-full bg-gradient-to-r from-[#336d82] to-[#5a96a8] hover:from-[#2a5a6a] hover:to-[#4a8199] active:scale-95 text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg poppins-semibold text-sm"
              >
                <EditIcon sx={{ fontSize: 18 }} />
                <span>{isEditing ? "Batal Edit" : "Edit Profil"}</span>
              </button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
            {/* Mobile: Dropdown Menu */}
            <div className="lg:hidden relative z-10">
              <div className="bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border-2 border-white/40">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-[#336d82] poppins-bold text-base"
                >
                  <div className="flex items-center gap-3">
                    {(() => {
                      const activeItem = sections.find(
                        (s) => s.id === activeSection
                      );
                      const Icon = activeItem?.icon || PersonIcon;
                      return (
                        <>
                          <div className="w-9 h-9 bg-gradient-to-br from-[#336d82] to-[#5a96a8] rounded-xl flex items-center justify-center shadow-md">
                            <Icon sx={{ fontSize: 18, color: "white" }} />
                          </div>
                          <span>{activeItem?.label || "Menu"}</span>
                        </>
                      );
                    })()}
                  </div>
                  <ArrowDropDownIcon
                    sx={{ fontSize: 28 }}
                    className={`transition-transform duration-300 ${isMenuOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>
              </div>

              {/* Dropdown Content - Outside parent to avoid overflow issues */}
              {isMenuOpen && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMenuOpen(false)}
                  />

                  {/* Dropdown Menu */}
                  <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border-2 border-[#336d82]/20 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      const isBackButton = section.id === "kembali";
                      const isActive = activeSection === section.id;

                      return (
                        <button
                          key={section.id}
                          onClick={() => {
                            if (isBackButton && section.action) {
                              section.action();
                            } else {
                              setActiveSection(section.id);
                              setIsMenuOpen(false);
                            }
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 poppins-semibold text-sm ${isActive && !isBackButton
                              ? "bg-gradient-to-r from-[#336d82] to-[#5a96a8] text-white"
                              : isBackButton
                                ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                                : "text-[#336d82] hover:bg-[#336d82]/5"
                            }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isActive && !isBackButton
                                ? "bg-white/20"
                                : isBackButton
                                  ? "bg-white/20"
                                  : "bg-[#336d82]/10"
                              }`}
                          >
                            <Icon sx={{ fontSize: 18 }} />
                          </div>
                          <span>{section.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Desktop: Sidebar Navigation */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="bg-white/95 backdrop-blur-lg rounded-xl sm:rounded-2xl lg:rounded-[25px] shadow-xl p-3 sm:p-4 lg:sticky lg:top-6 border-2 border-white/40">
                <div className="mb-2 sm:mb-3 pb-2 sm:pb-3 border-b-2 border-[#336d82]/20">
                  <h3 className="text-[#336d82] text-sm sm:text-base poppins-bold">
                    Menu
                  </h3>
                </div>
                <nav className="flex flex-col gap-2">
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
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${activeSection === section.id
                              ? "bg-white/20"
                              : "bg-[#336d82]/10"
                            }`}
                        >
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
              <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-[25px] shadow-xl p-4 sm:p-5 lg:p-6 border-2 border-white/40">
                {/* Profil Section */}
                {activeSection === "profil" && (
                  <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                    <div className="flex items-start sm:items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b-2 border-[#336d82]/10">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#336d82] to-[#7bb3c4] rounded-xl sm:rounded-[18px] flex items-center justify-center shadow-lg flex-shrink-0">
                        <PersonIcon
                          sx={{ color: "white", fontSize: { xs: 20, sm: 24 } }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-[#336d82] text-xl sm:text-2xl lg:text-3xl poppins-bold truncate">
                          Informasi Profil
                        </h2>
                        <p className="text-gray-500 text-xs sm:text-sm poppins-medium truncate">
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
                  <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                    <div className="flex items-start sm:items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b-2 border-[#336d82]/10">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#336d82] to-[#7bb3c4] rounded-xl sm:rounded-[18px] flex items-center justify-center shadow-lg flex-shrink-0">
                        <LockIcon
                          sx={{ color: "white", fontSize: { xs: 20, sm: 24 } }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-[#336d82] text-xl sm:text-2xl lg:text-3xl poppins-bold truncate">
                          Keamanan Akun
                        </h2>
                        <p className="text-gray-500 text-xs sm:text-sm poppins-medium truncate">
                          Kelola password dan keamanan akun
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-[#336d82]/10 via-[#5a96a8]/10 to-[#7bb3c4]/10 border-2 border-[#336d82]/20 rounded-xl sm:rounded-[18px] p-3 sm:p-4">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#336d82] to-[#5a96a8] rounded-xl sm:rounded-[15px] flex items-center justify-center flex-shrink-0 shadow-md">
                          <LockIcon
                            sx={{
                              color: "white",
                              fontSize: { xs: 18, sm: 20 },
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[#336d82] text-sm sm:text-base poppins-bold mb-1.5 sm:mb-2">
                            Tips Keamanan Password
                          </h3>
                          <ul className="text-[#336d82] text-xs sm:text-sm poppins-medium space-y-0.5 sm:space-y-1">
                            <li className="flex items-center gap-1.5 sm:gap-2">
                              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#336d82] rounded-full flex-shrink-0"></span>
                              <span>Minimal 8 karakter</span>
                            </li>
                            <li className="flex items-center gap-1.5 sm:gap-2">
                              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#336d82] rounded-full flex-shrink-0"></span>
                              <span>Kombinasi huruf besar dan kecil</span>
                            </li>
                            <li className="flex items-center gap-1.5 sm:gap-2">
                              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#336d82] rounded-full flex-shrink-0"></span>
                              <span>Gunakan angka dan simbol</span>
                            </li>
                            <li className="flex items-center gap-1.5 sm:gap-2">
                              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#336d82] rounded-full flex-shrink-0"></span>
                              <span>Hindari kata-kata umum</span>
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
                        <div className="relative group">
                          <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#336d82]/60 group-hover:text-[#336d82] transition-colors">
                            <LockIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                          </div>
                          <input
                            type={showPasswordLama ? "text" : "password"}
                            name="passwordLama"
                            value={formData.passwordLama}
                            onChange={handleInputChange}
                            placeholder="Masukkan password lama"
                            className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 border-2 border-[#336d82]/20 rounded-xl sm:rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#336d82]/30 focus:border-[#336d82] poppins-medium text-sm sm:text-base text-gray-900 placeholder:text-gray-400 transition-all duration-200 hover:border-[#336d82]/40 hover:shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPasswordLama(!showPasswordLama)
                            }
                            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-[#336d82]/60 hover:text-[#336d82] transition-colors active:scale-95"
                          >
                            {showPasswordLama ? (
                              <VisibilityOffIcon
                                sx={{ fontSize: { xs: 18, sm: 20 } }}
                              />
                            ) : (
                              <VisibilityIcon
                                sx={{ fontSize: { xs: 18, sm: 20 } }}
                              />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Password Baru */}
                      <div className="space-y-1.5 sm:space-y-2">
                        <label className="flex items-center gap-2 text-[#336d82] text-xs sm:text-sm poppins-semibold">
                          <LockIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
                          <span>Password Baru</span>
                        </label>
                        <div className="relative group">
                          <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#336d82]/60 group-hover:text-[#336d82] transition-colors">
                            <LockIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                          </div>
                          <input
                            type={showPasswordBaru ? "text" : "password"}
                            name="passwordBaru"
                            value={formData.passwordBaru}
                            onChange={handleInputChange}
                            placeholder="Masukkan password baru"
                            className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 border-2 border-[#336d82]/20 rounded-xl sm:rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#336d82]/30 focus:border-[#336d82] poppins-medium text-sm sm:text-base text-gray-900 placeholder:text-gray-400 transition-all duration-200 hover:border-[#336d82]/40 hover:shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPasswordBaru(!showPasswordBaru)
                            }
                            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-[#336d82]/60 hover:text-[#336d82] transition-colors active:scale-95"
                          >
                            {showPasswordBaru ? (
                              <VisibilityOffIcon
                                sx={{ fontSize: { xs: 18, sm: 20 } }}
                              />
                            ) : (
                              <VisibilityIcon
                                sx={{ fontSize: { xs: 18, sm: 20 } }}
                              />
                            )}
                          </button>
                        </div>
                        {/* Password Strength Indicator */}
                        {formData.passwordBaru && (
                          <div className="space-y-1.5">
                            <div className="flex gap-1">
                              {[1, 2, 3, 4].map((level) => (
                                <div
                                  key={level}
                                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${formData.passwordBaru.length >= level * 2
                                      ? formData.passwordBaru.length < 6
                                        ? "bg-red-500"
                                        : formData.passwordBaru.length < 10
                                          ? "bg-yellow-500"
                                          : "bg-green-500"
                                      : "bg-gray-200"
                                    }`}
                                />
                              ))}
                            </div>
                            <p
                              className={`text-xs poppins-medium ${formData.passwordBaru.length < 6
                                  ? "text-red-500"
                                  : formData.passwordBaru.length < 10
                                    ? "text-yellow-600"
                                    : "text-green-600"
                                }`}
                            >
                              {formData.passwordBaru.length < 6
                                ? "Password terlalu lemah"
                                : formData.passwordBaru.length < 10
                                  ? "Password cukup kuat"
                                  : "Password sangat kuat"}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Konfirmasi Password */}
                      <div className="space-y-1.5 sm:space-y-2">
                        <label className="flex items-center gap-2 text-[#336d82] text-xs sm:text-sm poppins-semibold">
                          <CheckCircleIcon
                            sx={{ fontSize: { xs: 16, sm: 18 } }}
                          />
                          <span>Konfirmasi Password Baru</span>
                        </label>
                        <div className="relative group">
                          <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#336d82]/60 group-hover:text-[#336d82] transition-colors">
                            <CheckCircleIcon
                              sx={{ fontSize: { xs: 18, sm: 20 } }}
                            />
                          </div>
                          <input
                            type={showKonfirmasiPassword ? "text" : "password"}
                            name="konfirmasiPassword"
                            value={formData.konfirmasiPassword}
                            onChange={handleInputChange}
                            placeholder="Konfirmasi password baru"
                            className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 border-2 border-[#336d82]/20 rounded-xl sm:rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#336d82]/30 focus:border-[#336d82] poppins-medium text-sm sm:text-base text-gray-900 placeholder:text-gray-400 transition-all duration-200 hover:border-[#336d82]/40 hover:shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowKonfirmasiPassword(!showKonfirmasiPassword)
                            }
                            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-[#336d82]/60 hover:text-[#336d82] transition-colors active:scale-95"
                          >
                            {showKonfirmasiPassword ? (
                              <VisibilityOffIcon
                                sx={{ fontSize: { xs: 18, sm: 20 } }}
                              />
                            ) : (
                              <VisibilityIcon
                                sx={{ fontSize: { xs: 18, sm: 20 } }}
                              />
                            )}
                          </button>
                        </div>
                        {/* Password Match Indicator */}
                        {formData.konfirmasiPassword && (
                          <div className="flex items-center gap-2">
                            {formData.passwordBaru ===
                              formData.konfirmasiPassword ? (
                              <>
                                <CheckCircleIcon
                                  sx={{ fontSize: 16, color: "#10b981" }}
                                />
                                <p className="text-xs text-green-600 poppins-medium">
                                  Password cocok
                                </p>
                              </>
                            ) : (
                              <>
                                <CheckCircleIcon
                                  sx={{ fontSize: 16, color: "#ef4444" }}
                                />
                                <p className="text-xs text-red-500 poppins-medium">
                                  Password tidak cocok
                                </p>
                              </>
                            )}
                          </div>
                        )}
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
