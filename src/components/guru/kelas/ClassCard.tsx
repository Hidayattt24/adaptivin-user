"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface ClassCardProps {
  id: string;
  nama: string;
  jumlahSiswa: number;
  jumlahMateri?: number;
  color: {
    bg: string;
    gradient: string;
  };
  studentProfiles: string[];
  index?: number;
}

export default function ClassCard({
  id,
  nama,
  jumlahSiswa,
  jumlahMateri = 0,
  color,
  studentProfiles,
  index = 0,
}: ClassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <Link href={`/guru/kelas/${id}`}>
      <div
        ref={cardRef}
        className="rounded-[32px] p-8 relative cursor-pointer transition-all duration-500 group overflow-hidden"
        style={{
          background: color.gradient,
          width: "100%",
          maxWidth: "369px",
          height: "320px",
          boxShadow:
            "0 10px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)",
          transform: "translateY(0) scale(1)",
          opacity: isVisible ? 1 : 0,
          animation: isVisible
            ? `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`
            : "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-12px) scale(1.03)";
          e.currentTarget.style.boxShadow =
            "0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
          e.currentTarget.style.boxShadow =
            "0 10px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)";
        }}
      >
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(40px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}</style>
        {/* Decorative gradient overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(circle at top right, rgba(255, 255, 255, 0.2) 0%, transparent 70%)",
          }}
        />

        {/* Top decorative element */}
        <div className="absolute top-6 right-6 w-20 h-20 rounded-full bg-white/10 blur-2xl" />

        {/* Class Name with enhanced typography */}
        <div className="relative z-10">
          {(() => {
            const [kelas, rombel] = nama.split(" ");
            return (
              <h3
                className="montserrat-bold text-white mb-4 leading-tight"
                style={{
                  fontSize: "clamp(28px, 3vw, 40px)",
                  letterSpacing: "-0.02em",
                }}
              >
                Kelas {kelas}
                <br />
                <span className="text-white/90">Rombel {rombel}</span>
              </h3>
            );
          })()}

          {/* Stats Section */}
          <div className="flex items-center gap-2 mb-3">
            <div className="inline-block px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
              <span className="montserrat-bold text-white text-xs">Aktif</span>
            </div>
            <div className="inline-block px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
              <span className="montserrat-bold text-white text-xs">
                📚 {jumlahMateri} Materi
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Section - Student Avatars and Arrow */}
        <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between z-10">
          {/* Student Avatars with enhanced styling */}
          <div className="flex items-center">
            {studentProfiles.slice(0, 3).map((profile, index) => (
              <div
                key={index}
                className="rounded-full overflow-hidden flex items-center justify-center bg-white transition-all duration-300 hover:z-50"
                style={{
                  width: "56px",
                  height: "56px",
                  marginLeft: index > 0 ? "-18px" : "0",
                  zIndex: 3 - index,
                  boxShadow:
                    "0 6px 20px rgba(0, 0, 0, 0.3), 0 0 0 3px rgba(255, 255, 255, 0.2)",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.15) translateY(-4px)";
                  e.currentTarget.style.zIndex = "50";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.zIndex = String(3 - index);
                }}
              >
                <Image
                  src={profile}
                  alt={`Student ${index + 1}`}
                  width={44}
                  height={44}
                  className="w-[80%] h-[80%] object-contain"
                />
              </div>
            ))}
            <p
              className="montserrat-bold text-white ml-6"
              style={{
                fontSize: "18px",
              }}
            >
              +{jumlahSiswa} Siswa
            </p>
          </div>

          {/* Arrow Button with enhanced animation */}
          <div
            className="rounded-full bg-white flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg hover:shadow-2xl"
            style={{
              width: "58px",
              height: "58px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.15) rotate(45deg)";
              e.currentTarget.style.backgroundColor = "#F8F9FA";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1) rotate(0deg)";
              e.currentTarget.style.backgroundColor = "#FFFFFF";
            }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                transition: "all 0.3s ease",
              }}
            >
              <path
                d="M7 17L17 7M17 7H7M17 7V17"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
