"use client";

import React from "react";
import Image from "next/image";
import { useTeacherProfile } from "@/hooks/guru/useTeacherProfile";

interface TeacherProfileProps {
  profileImage?: string;
}

export default function TeacherProfile({
  profileImage = "/guru/foto-profil/profil-guru.svg",
}: TeacherProfileProps) {
  const { data: teacher, isLoading } = useTeacherProfile();

  // Loading state
  if (isLoading) {
    return (
      <div className="relative">
        <div
          className="rounded-full border-white border-[6px] overflow-hidden flex-shrink-0 animate-pulse bg-white/20"
          style={{
            width: "130px",
            height: "130px",
          }}
        />
      </div>
    );
  }

  const teacherName = teacher?.nama_lengkap || "Guru";

  return (
    <div className="relative group">
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-60 transition-opacity duration-300 group-hover:opacity-80"
        style={{
          background: "linear-gradient(135deg, #FFFFFF 0%, #E0E0E0 100%)",
          transform: "scale(1.1)",
        }}
      />

      {/* Profile Image */}
      <div
        className="relative rounded-full border-white border-[6px] overflow-hidden flex-shrink-0 transition-all duration-300 hover:scale-110 hover:rotate-6"
        style={{
          width: "130px",
          height: "130px",
          boxShadow:
            "0 15px 50px rgba(0, 0, 0, 0.3), 0 0 0 3px rgba(255, 255, 255, 0.15), inset 0 0 20px rgba(255, 255, 255, 0.1)",
          background: "rgba(255, 255, 255, 0.05)",
        }}
      >
        <Image
          src={profileImage}
          alt={`Profile ${teacherName}`}
          width={130}
          height={130}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          style={{
            transform: "scale(1.3)",
            transformOrigin: "center center",
          }}
        />
      </div>

      {/* Optional: Tooltip with full name on hover */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg whitespace-nowrap">
          <p className="text-sm font-semibold text-gray-800">{teacherName}</p>
          {teacher?.nip && (
            <p className="text-xs text-gray-600">NIP: {teacher.nip}</p>
          )}
        </div>
      </div>
    </div>
  );
}
