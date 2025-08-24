"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const RegisterSiswaPage = () => {
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
          Daftar Sebagai Siswa
        </h1>
        <p className="text-gray-600 mb-8">
          Halaman pendaftaran siswa sedang dalam pengembangan
        </p>
        <Link
          href="/login/siswa"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg poppins-semibold hover:bg-blue-700 transition-colors"
        >
          Kembali ke Login
        </Link>
      </div>
    </div>
  );
};

export default RegisterSiswaPage;
