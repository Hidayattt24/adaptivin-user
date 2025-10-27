"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import TeacherProfile from "@/components/guru/TeacherProfile";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";

const PengaturanGuruPage = () => {
  const params = useParams();
  const kelasId = params.kelasId;

  // State for form inputs
  const [formData, setFormData] = useState({
    nama: "Isabella",
    email: "isabella@adaptivin.com",
    nip: "1234567890",
    telepon: "+62 812-3456-7890",
    alamat: "Jl. Pendidikan No. 123, Jakarta",
    passwordLama: "",
    passwordBaru: "",
    konfirmasiPassword: "",
  });

  const [activeSection, setActiveSection] = useState<string>("profil");
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saving settings:", formData);
    setIsEditing(false);
    // TODO: Implement API call to save settings
  };

  const sections = [
    { id: "profil", label: "Profil", icon: PersonIcon },
    { id: "keamanan", label: "Keamanan", icon: LockIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Outer Container with Rounded Corners and Gradient */}
      <div className="bg-gradient-to-br from-[#336D82] via-[#5a96a8] to-[#7bb3c4] rounded-[30px] shadow-2xl overflow-hidden">
        <div className="p-6">
          {/* Header Card with Enhanced Design */}
          <div className="relative mb-6 overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mt-12 -mr-12" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/5 rounded-full blur-2xl -mb-12 -ml-12" />

            {/* Content */}
            <div className="relative bg-white rounded-[25px] shadow-xl p-6 border-3 border-white/50">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-6">
                  <div className="transform hover:scale-105 transition-transform duration-300 scale-75">
                    <TeacherProfile
                      profileImage="/guru/foto-profil/profil-guru.svg"
                      teacherName={formData.nama}
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
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-gradient-to-r from-[#336d82] to-[#5a96a8] hover:from-[#2a5a6a] hover:to-[#4a8199] text-white px-6 py-3 rounded-[20px] flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 poppins-semibold text-sm"
                >
                  <EditIcon sx={{ fontSize: 20 }} />
                  {isEditing ? "Batal Edit" : "Edit Profil"}
                </button>
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
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-[15px] transition-all duration-300 poppins-semibold text-sm ${
                          activeSection === section.id
                            ? "bg-gradient-to-r from-[#336d82] to-[#5a96a8] text-white shadow-lg transform scale-105"
                            : "text-[#336d82] bg-white/50 hover:bg-white hover:shadow-md hover:transform hover:scale-102"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activeSection === section.id ? "bg-white/20" : "bg-[#336d82]/10"
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[#336d82] text-sm poppins-semibold">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          name="nama"
                          value={formData.nama}
                          onChange={handleInputChange}
                          disabled={!isEditing}
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
                          disabled={!isEditing}
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
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border-2 border-[#336d82]/20 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#336d82]/30 focus:border-[#336d82] poppins-medium text-base disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200 hover:border-[#336d82]/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[#336d82] text-sm poppins-semibold">
                          Nomor Telepon
                        </label>
                        <input
                          type="tel"
                          name="telepon"
                          value={formData.telepon}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border-2 border-[#336d82]/20 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#336d82]/30 focus:border-[#336d82] poppins-medium text-base disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200 hover:border-[#336d82]/40"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[#336d82] text-sm poppins-semibold">
                        Alamat
                      </label>
                      <textarea
                        name="alamat"
                        value={formData.alamat}
                        onChange={handleInputChange}
                        disabled={!isEditing}
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

                    <div className="space-y-4">
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
                    className="w-full md:w-auto bg-gradient-to-r from-[#336d82] via-[#4a8199] to-[#5a96a8] hover:from-[#2a5a6a] hover:via-[#336d82] hover:to-[#4a8199] text-white px-8 py-3 rounded-[18px] flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 poppins-bold text-base"
                  >
                    <SaveIcon sx={{ fontSize: 22 }} />
                    Simpan Perubahan
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
