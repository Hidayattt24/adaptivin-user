"use client";

import React, { useState } from "react";
import ClassCard from "@/components/guru/ClassCard";
import TeacherProfile from "@/components/guru/TeacherProfile";
import { getCardColor } from "@/constants/guru/cardColors";
import { Kelas } from "@/types/guru";
import { Highlighter } from "@/components/ui/highlighter";

const DashboardGuruPage = () => {
  const [kelasList] = useState<Kelas[]>([
    // Data dummy - nanti akan diambil dari API
    // Backend bisa mengirim data dengan format:
    // { id, nama, jumlahSiswa, colorIndex (optional) }
    {
      id: "1",
      nama: "Matematika Kelas IV A",
      jumlahSiswa: 28,
    },
    {
      id: "2",
      nama: "Matematika Kelas IV B",
      jumlahSiswa: 30,
    },
    {
      id: "3",
      nama: "Matematika Kelas V A",
      jumlahSiswa: 25,
    },
    {
      id: "4",
      nama: "Matematika Kelas V B",
      jumlahSiswa: 27,
    },
    {
      id: "5",
      nama: "Matematika Kelas VI A",
      jumlahSiswa: 26,
    },
    {
      id: "6",
      nama: "Matematika Kelas VI B",
      jumlahSiswa: 29,
    },
    {
      id: "7",
      nama: "Matematika Kelas IV C",
      jumlahSiswa: 31,
    },
    {
      id: "8",
      nama: "Matematika Kelas V C",
      jumlahSiswa: 28,
    },
    {
      id: "9",
      nama: "Matematika Kelas VI C",
      jumlahSiswa: 30,
    },
    {
      id: "10",
      nama: "Matematika Kelas IV D",
      jumlahSiswa: 27,
    },
  ]);

  // Student profile images (first 3)
  const studentProfiles = [
    "/siswa/foto-profil/kocheng-oren.svg",
    "/siswa/foto-profil/bro-kerbuz.svg",
    "/siswa/foto-profil/sin-bunbun.svg",
  ];

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background: "linear-gradient(180deg, #336D82 0%, #FFFFFF 100%)",
      }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 right-10 w-72 h-72 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #FFFFFF 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-40 left-20 w-96 h-96 rounded-full opacity-5"
          style={{
            background: "radial-gradient(circle, #FFFFFF 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Header Section */}
      <div className="container mx-auto px-6 md:px-12 lg:px-[135px] pt-16 md:pt-24 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 md:mb-20 gap-6">
          {/* Greeting Text */}
          <div className="flex-1">
            <h1
              className="montserrat-medium text-white mb-4 animate-fade-in"
              style={{
                fontSize: "clamp(32px, 5vw, 50px)",
                lineHeight: "1.3",
              }}
            >
              Hi Isabella,
            </h1>
            <p
              className="montserrat-regular text-white/95 mb-8"
              style={{
                fontSize: "clamp(18px, 2.5vw, 24px)",
                lineHeight: "1.5",
              }}
            >
              Semoga Sehat Selalu
            </p>
            <h2
              className="montserrat-bold text-white tracking-wide"
              style={{
                fontSize: "clamp(28px, 4vw, 48px)",
                lineHeight: "1.2",
                letterSpacing: "0.05em",
              }}
            >
              <Highlighter action="underline" color="#00d9ff" isView>
                RUANG KERJA
              </Highlighter>
            </h2>
          </div>

          {/* Profile Image */}
          <TeacherProfile
            profileImage="/guru/foto-profil/profil-guru.svg"
            teacherName="Isabella"
          />
        </div>

        {/* Class Cards - Enhanced with gradient and modern styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
          {kelasList.map((kelas, cardIndex) => (
            <ClassCard
              key={kelas.id}
              id={kelas.id}
              nama={kelas.nama}
              jumlahSiswa={kelas.jumlahSiswa}
              color={getCardColor(cardIndex)}
              studentProfiles={studentProfiles}
              index={cardIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardGuruPage;
