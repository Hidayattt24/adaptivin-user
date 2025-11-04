"use client";

import React, { useState, useRef, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";

interface Student {
  id: string;
  nama: string;
  nis: string;
}

interface StudentSearchBarProps {
  students: Student[];
  selectedStudent: string | null;
  onSelectStudent: (studentId: string) => void;
  className?: string;
}

const StudentSearchBar: React.FC<StudentSearchBarProps> = ({
  students,
  selectedStudent,
  onSelectStudent,
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const selectedStudentData = students.find(s => s.id === selectedStudent);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredStudents = students.filter(student =>
    student.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.nis.includes(searchQuery)
  );

  const displayValue = selectedStudentData
    ? `${selectedStudentData.nama} (${selectedStudentData.nis})`
    : "";

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
        <div className="flex-1 bg-white border-[3px] sm:border-[4px] lg:border-[5px] border-[#336d82] rounded-xl sm:rounded-2xl lg:rounded-[20px] h-[56px] sm:h-[60px] lg:h-[72px] flex items-center px-3 sm:px-4 lg:px-6 gap-2 sm:gap-3 lg:gap-4 shadow-md">
          <div className="w-[40px] h-[40px] sm:w-[46px] sm:h-[46px] lg:w-[54px] lg:h-[54px] bg-[#5a96a8] rounded-full flex items-center justify-center flex-shrink-0">
            <SearchIcon className="text-white" sx={{ fontSize: { xs: 18, sm: 20, lg: 24 } }} />
          </div>
          <input
            type="text"
            placeholder="Cari nama siswa atau NIS..."
            value={isOpen ? searchQuery : displayValue}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="flex-1 text-[#336d82] text-sm sm:text-base poppins-semibold placeholder:text-[#336d82]/70 placeholder:poppins-medium focus:outline-none bg-transparent"
          />
        </div>
      </div>

      {/* Dropdown Results */}
      {isOpen && filteredStudents.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl sm:rounded-2xl lg:rounded-[20px] shadow-xl border-2 border-[#336d82] max-h-[250px] sm:max-h-[300px] overflow-y-auto z-50">
          {filteredStudents.map((student) => (
            <button
              key={student.id}
              onClick={() => {
                onSelectStudent(student.id);
                setSearchQuery("");
                setIsOpen(false);
              }}
              className={`w-full px-4 sm:px-5 lg:px-6 py-3 sm:py-4 text-left hover:bg-[#336d82]/10 active:bg-[#336d82]/20 transition-colors first:rounded-t-xl first:sm:rounded-t-2xl first:lg:rounded-t-[20px] last:rounded-b-xl last:sm:rounded-b-2xl last:lg:rounded-b-[20px] ${
                selectedStudent === student.id
                  ? "bg-[#336d82]/20 text-[#336d82] poppins-semibold"
                  : "text-gray-700 poppins-medium"
              }`}
            >
              <div className="flex flex-col">
                <span className="text-base sm:text-lg">{student.nama}</span>
                <span className="text-xs sm:text-sm text-gray-500">NIS: {student.nis}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen && searchQuery && filteredStudents.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl sm:rounded-2xl lg:rounded-[20px] shadow-xl border-2 border-[#336d82] p-4 sm:p-5 lg:p-6 z-50">
          <p className="text-gray-500 text-center text-sm sm:text-base poppins-medium">
            Tidak ada siswa ditemukan
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentSearchBar;
