"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const RegisterOrangTuaPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <Image
          src="/logo/logo-with-name.svg"
          alt="Adaptivin Logo"
          width={150}
          height={75}
          className="mx-auto mb-8"
        />
        <h1 className="poppins-bold text-2xl text-gray-800 mb-4">
          Daftar Sebagai Orang Tua
        </h1>
        <p className="text-gray-600 mb-8">
          Halaman pendaftaran orang tua sedang dalam pengembangan
        </p>
        <Link
          href="/login/orang-tua"
          className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg poppins-semibold hover:bg-purple-700 transition-colors"
        >
          Kembali ke Login
        </Link>
      </div>
    </div>
  );
};

export default RegisterOrangTuaPage;
