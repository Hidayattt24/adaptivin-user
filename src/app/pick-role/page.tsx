"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const PickRolePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startX = useRef(0);
  const currentX = useRef(0);

  const roles = [
    {
      id: "guru",
      title: "Guru",
      description:
        "Pantau kemajuan kelas dan berikan dukungan dengan yang mebutuhkan",
      image: "/pick-role/guru.svg",
      href: "/login/guru",
    },
    {
      id: "siswa",
      title: "Siswa",
      description:
        "Belajar dasar matematika yang seru dan menarik serta belajar dengan",
      image: "/pick-role/siswa.svg",
      href: "/login/siswa",
    },
    {
      id: "orang-tua",
      title: "Orang Tua",
      description:
        "Dampingi dan pantau perkembangan belajar anak Anda dengan mudah",
      image: "/pick-role/orang-tua.svg",
      href: "/login/orang-tua",
    },
  ];

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startX.current = e.touches[0].clientX;
    currentX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const diff = currentX.current - startX.current;
    const threshold = 100; // minimum swipe distance

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentIndex > 0) {
        // Swipe right - previous card
        setCurrentIndex(currentIndex - 1);
      } else if (diff < 0 && currentIndex < roles.length - 1) {
        // Swipe left - next card
        setCurrentIndex(currentIndex + 1);
      }
    }

    setDragOffset(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startX.current = e.clientX;
    currentX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    currentX.current = e.clientX;
    const diff = currentX.current - startX.current;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const diff = currentX.current - startX.current;
    const threshold = 100;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else if (diff < 0 && currentIndex < roles.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }

    setDragOffset(0);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{
        background: "linear-gradient(181deg, #2887C2 0.78%, #FFF 97.79%)",
      }}
    >
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="mb-3 text-2xl md:text-3xl lg:text-4xl"
            style={{
              color: "#FFF",
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontWeight: "600",
              lineHeight: "normal",
            }}
          >
            Belajar Matematika, Sesuai Ritmemu
          </h1>
          <p
            className="max-w-4xl mx-auto text-base md:text-lg lg:text-xl px-2"
            style={{
              color: "#FFF",
              textAlign: "center",
              fontFamily: "Poppins",
              fontStyle: "italic",
              fontWeight: "500",
              lineHeight: "1.4",
            }}
          >
            Selamat datang di Adaptivin! Pilih peran untuk memulai pengalaman
            belajar yang dirancang spesial untuk Anda.
          </p>
        </div>

        {/* Main Content */}
        <main>
          {/* Desktop Layout */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8 justify-items-center">
            {roles.map((role) => (
              <Link key={role.id} href={role.href}>
                <div className="role-card group cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl shadow-lg">
                    <Image
                      src={role.image}
                      alt={`${role.title} Card`}
                      width={320}
                      height={420}
                      className="role-card-image w-full h-auto object-contain"
                      priority
                    />
                    <div className="role-card-overlay absolute inset-0 opacity-0 rounded-2xl" />
                    <div
                      className="absolute inset-0 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                      style={{
                        boxShadow: "0 0 30px rgba(40, 135, 194, 0.4)",
                      }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile Tinder-style Swipe Cards */}
          <div className="md:hidden">
            <div className="relative w-full h-96 flex items-center justify-center">
              <div className="relative w-80 h-full">
                {roles.map((role, index) => {
                  const isActive = index === currentIndex;
                  const isPrev = index === currentIndex - 1;
                  const isNext = index === currentIndex + 1;

                  if (!isActive && !isPrev && !isNext) return null;

                  let transform = "";
                  let zIndex = 1;
                  let opacity = 0.3;

                  if (isActive) {
                    const offset = isDragging ? dragOffset : 0;
                    transform = `translateX(${offset}px) rotate(${
                      offset * 0.1
                    }deg)`;
                    zIndex = 10;
                    opacity = 1;
                  } else if (isPrev) {
                    transform = "translateX(-20px) scale(0.95)";
                    zIndex = 5;
                    opacity = 0.6;
                  } else if (isNext) {
                    transform = "translateX(20px) scale(0.95)";
                    zIndex = 5;
                    opacity = 0.6;
                  }

                  return (
                    <div
                      key={role.id}
                      className="absolute inset-0 transition-all duration-300 cursor-pointer"
                      style={{
                        transform,
                        zIndex,
                        opacity,
                      }}
                      onTouchStart={isActive ? handleTouchStart : undefined}
                      onTouchMove={isActive ? handleTouchMove : undefined}
                      onTouchEnd={isActive ? handleTouchEnd : undefined}
                      onMouseDown={isActive ? handleMouseDown : undefined}
                      onMouseMove={isActive ? handleMouseMove : undefined}
                      onMouseUp={isActive ? handleMouseUp : undefined}
                      onMouseLeave={isActive ? handleMouseUp : undefined}
                    >
                      <Link href={role.href}>
                        <div className="w-full h-full overflow-hidden transform transition-transform duration-200 hover:scale-105">
                          <Image
                            src={role.image}
                            alt={`${role.title} Card`}
                            width={320}
                            height={384}
                            className="w-full h-full object-contain"
                            priority={isActive}
                          />
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation dots and instructions */}
            <div className="flex flex-col items-center mt-4 space-y-2">
              <div className="flex space-x-2">
                {roles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "bg-white scale-125"
                        : "bg-white/60 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
              <p className="text-white/80 text-sm text-center px-4">
                Geser kartu ke kiri/kanan atau tap dot untuk memilih
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PickRolePage;
