"use client";

import React from "react";
import { TrendingDown, TrendingUp, Minus, AlertCircle } from "lucide-react";
import Image from "next/image";

interface Student {
  siswaId: string;
  nama: string;
  nis: string;
  foto_profil?: string;
  dominantLevel: number;
  accuracy: number;
  totalCorrect?: number;
  totalQuestions?: number;
}

interface ClusterData {
  belumMulai: Student[]; // Level 0 - Belum mengerjakan kuis
  kelompok1: Student[]; // Level 1-2
  kelompok2: Student[]; // Level 3-4
  kelompok3: Student[]; // Level 5-6
}

interface StudentClusterSectionProps {
  students: Student[];
  onStudentSelect: (siswaId: string) => void;
  selectedStudentId?: string | null;
  className?: string;
}

const StudentClusterSection: React.FC<StudentClusterSectionProps> = ({
  students,
  onStudentSelect,
  selectedStudentId,
  className = "",
}) => {
  // Cluster students based on dominant level
  const clusterData: ClusterData = React.useMemo(() => {
    return students.reduce(
      (acc, student) => {
        if (student.dominantLevel === 0) {
          acc.belumMulai.push(student);
        } else if (student.dominantLevel <= 2) {
          acc.kelompok1.push(student);
        } else if (student.dominantLevel <= 4) {
          acc.kelompok2.push(student);
        } else {
          acc.kelompok3.push(student);
        }
        return acc;
      },
      { belumMulai: [], kelompok1: [], kelompok2: [], kelompok3: [] } as ClusterData
    );
  }, [students]);

  const ClusterCard = ({
    title,
    description,
    students,
    bgColor,
    borderColor,
    icon: Icon,
  }: {
    title: string;
    description: string;
    students: Student[];
    bgColor: string;
    borderColor: string;
    icon: React.ElementType;
  }) => (
    <div className={`rounded-2xl shadow-lg overflow-hidden ${borderColor} border-2`}>
      {/* Header */}
      <div className={`${bgColor} p-4`}>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white text-lg poppins-bold">{title}</h3>
            <p className="text-white/90 text-xs poppins-regular">{description}</p>
          </div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 inline-block">
          <p className="text-white text-sm poppins-semibold">
            {students.length} Siswa
          </p>
        </div>
      </div>

      {/* Students Grid - Desk Layout */}
      <div className="p-4 bg-gradient-to-br from-gray-50 to-white">
        {students.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <p className="text-gray-400 poppins-regular text-sm">
              Tidak ada siswa di kelompok ini
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {students.map((student) => (
              <button
                key={student.siswaId}
                onClick={() => onStudentSelect(student.siswaId)}
                className={`
                  relative group
                  transform transition-all duration-200
                  hover:scale-105 hover:-translate-y-1
                  ${selectedStudentId === student.siswaId
                    ? "scale-105 -translate-y-1"
                    : ""
                  }
                `}
              >
                {/* Desk Background with 3D Effect */}
                <div
                  className={`
                    relative bg-gradient-to-b from-amber-100 via-amber-200 to-amber-300
                    rounded-2xl p-4 shadow-lg
                    border-4 transition-all
                    ${selectedStudentId === student.siswaId
                      ? `${borderColor} shadow-2xl`
                      : "border-amber-400/50 hover:border-amber-500/70"
                    }
                  `}
                  style={{
                    boxShadow: selectedStudentId === student.siswaId
                      ? '0 10px 30px rgba(0,0,0,0.3), inset 0 1px 3px rgba(255,255,255,0.5)'
                      : '0 6px 15px rgba(0,0,0,0.15), inset 0 1px 3px rgba(255,255,255,0.5)'
                  }}
                >
                  {/* Desk Top Highlight Edge */}
                  <div className="absolute top-0 left-3 right-3 h-3 bg-gradient-to-b from-white/40 to-transparent rounded-t-xl"></div>

                  {/* Desk Wood Grain Effect - Enhanced */}
                  <div className="absolute inset-0 opacity-20 rounded-2xl overflow-hidden">
                    <div className="h-full w-full" style={{
                      backgroundImage: `
                        repeating-linear-gradient(90deg, 
                          transparent, transparent 3px, 
                          rgba(139,69,19,0.15) 3px, rgba(139,69,19,0.15) 4px
                        ),
                        repeating-linear-gradient(0deg, 
                          transparent, transparent 40px, 
                          rgba(139,69,19,0.1) 40px, rgba(139,69,19,0.1) 42px
                        )
                      `
                    }}></div>
                  </div>

                  {/* Desk Shadow underneath */}
                  <div className="absolute inset-x-2 bottom-0 h-2 bg-gradient-to-t from-black/20 to-transparent rounded-b-xl"></div>

                  {/* Student Avatar */}
                  <div className="relative mb-2">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#336D82] to-[#4A8BA6] flex items-center justify-center text-white poppins-bold text-xl shadow-lg overflow-hidden border-3 border-white">
                      {student.foto_profil ? (
                        <Image
                          src={student.foto_profil}
                          alt={student.nama}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        student.nama.charAt(0).toUpperCase()
                      )}
                    </div>

                    {/* Level Badge */}
                    <div className={`absolute -top-1 -right-1 ${bgColor} rounded-full px-2 py-0.5 shadow-md border-2 border-white`}>
                      <p className="text-white text-[10px] poppins-bold">L{student.dominantLevel}</p>
                    </div>
                  </div>

                  {/* Student Info */}
                  <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-xl p-2.5 shadow-md border border-white/50">
                    <p className="text-gray-800 text-xs poppins-semibold truncate text-center mb-1">
                      {student.nama}
                    </p>
                    <p className="text-gray-500 text-[10px] poppins-regular text-center truncate mb-2">
                      {student.nis}
                    </p>

                    {/* Accuracy Bar */}
                    <div className="bg-gray-200 rounded-full h-2 overflow-hidden shadow-inner">
                      <div
                        className={`h-full ${bgColor} transition-all duration-300 shadow-sm`}
                        style={{ width: `${student.accuracy}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] poppins-bold text-gray-700 text-center mt-1.5">
                      {student.accuracy}% akurat
                    </p>
                  </div>

                  {/* Desk Legs (decorative) - Enhanced 3D look */}
                  <div className="absolute -bottom-3 left-4 right-4 flex justify-between px-2">
                    <div className="relative">
                      <div className="w-3 h-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-b-md shadow-md"
                        style={{ transform: 'perspective(100px) rotateX(-5deg)' }}>
                      </div>
                      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-r from-white/30 to-transparent"></div>
                    </div>
                    <div className="relative">
                      <div className="w-3 h-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-b-md shadow-md"
                        style={{ transform: 'perspective(100px) rotateX(-5deg)' }}>
                      </div>
                      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-r from-white/30 to-transparent"></div>
                    </div>
                  </div>
                </div>

                {/* Selection Indicator */}
                {selectedStudentId === student.siswaId && (
                  <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 shadow-lg animate-pulse">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Section Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl poppins-bold text-[#336D82] mb-2">
          Pengelompokan Siswa Berdasarkan Kemampuan
        </h2>
        <p className="text-gray-600 poppins-regular text-sm">
          Klik siswa untuk melihat laporan individual lengkap di halaman terpisah
        </p>
      </div>

      {/* Cluster Cards */}
      <div className="space-y-4">
        {/* Belum Mulai: Siswa belum mengerjakan kuis */}
        <ClusterCard
          title="Belum Memulai"
          description="Siswa belum mengerjakan kuis apapun"
          students={clusterData.belumMulai}
          bgColor="bg-gradient-to-r from-gray-400 to-gray-500"
          borderColor="border-gray-500"
          icon={AlertCircle}
        />

        {/* Kelompok 1: Perlu Pendampingan (Level 1-2) */}
        <ClusterCard
          title="Kelompok 1 - Perlu Pendampingan"
          description="Siswa dengan dominan di Level 1-2"
          students={clusterData.kelompok1}
          bgColor="bg-gradient-to-r from-orange-500 to-orange-600"
          borderColor="border-orange-500"
          icon={TrendingDown}
        />

        {/* Kelompok 2: Berkembang (Level 3-4) */}
        <ClusterCard
          title="Kelompok 2 - Berkembang"
          description="Siswa dengan dominan di Level 3-4"
          students={clusterData.kelompok2}
          bgColor="bg-gradient-to-r from-blue-500 to-blue-600"
          borderColor="border-blue-500"
          icon={Minus}
        />

        {/* Kelompok 3: Mahir (Level 5-6) */}
        <ClusterCard
          title="Kelompok 3 - Mahir"
          description="Siswa dengan dominan di Level 5-6"
          students={clusterData.kelompok3}
          bgColor="bg-gradient-to-r from-green-500 to-green-600"
          borderColor="border-green-500"
          icon={TrendingUp}
        />
      </div>
    </div>
  );
};

export default StudentClusterSection;
