"use client";

import React from "react";

interface TeacherProfileProps {
  profileImage: string;
  teacherName?: string;
}

export default function TeacherProfile({
  profileImage,
  teacherName = "Isabella",
}: TeacherProfileProps) {
  return (
    <div className="relative">
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-60"
        style={{
          background: "linear-gradient(135deg, #FFFFFF 0%, #E0E0E0 100%)",
          transform: "scale(1.1)",
        }}
      />
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
        <img
          src={profileImage}
          alt={`Profile ${teacherName}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          style={{
            transform: "scale(1.3)",
            transformOrigin: "center center",
          }}
        />
      </div>
    </div>
  );
}
