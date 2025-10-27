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
      <div className="flex items-center gap-4">
        <div className="flex-1 bg-white border-[5px] border-[#336d82] rounded-[20px] h-[72px] flex items-center px-6 gap-4 shadow-md">
          <div className="w-[54px] h-[54px] bg-[#5a96a8] rounded-full flex items-center justify-center flex-shrink-0">
            <SearchIcon className="text-white" sx={{ fontSize: 24 }} />
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
            className="flex-1 text-[#336d82] text-base poppins-semibold placeholder:text-[#336d82]/70 placeholder:poppins-medium focus:outline-none bg-transparent"
          />
        </div>
      </div>

      {/* Dropdown Results */}
      {isOpen && filteredStudents.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[20px] shadow-xl border-2 border-[#336d82] max-h-[300px] overflow-y-auto z-50">
          {filteredStudents.map((student) => (
            <button
              key={student.id}
              onClick={() => {
                onSelectStudent(student.id);
                setSearchQuery("");
                setIsOpen(false);
              }}
              className={`w-full px-6 py-4 text-left hover:bg-[#336d82]/10 transition-colors first:rounded-t-[20px] last:rounded-b-[20px] ${
                selectedStudent === student.id
                  ? "bg-[#336d82]/20 text-[#336d82] poppins-semibold"
                  : "text-gray-700 poppins-medium"
              }`}
            >
              <div className="flex flex-col">
                <span className="text-lg">{student.nama}</span>
                <span className="text-sm text-gray-500">NIS: {student.nis}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen && searchQuery && filteredStudents.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[20px] shadow-xl border-2 border-[#336d82] p-6 z-50">
          <p className="text-gray-500 text-center poppins-medium">
            Tidak ada siswa ditemukan
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentSearchBar;
