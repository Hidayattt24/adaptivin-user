"use client";

import React, { useState, useRef, useEffect } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PersonIcon from "@mui/icons-material/Person";

interface StudentOption {
  id: string;
  nama: string;
  nis: string;
}

interface StudentSelectorProps {
  studentList: StudentOption[];
  selectedStudent: string | null;
  onSelectStudent: (studentId: string) => void;
  className?: string;
}

const StudentSelector: React.FC<StudentSelectorProps> = ({
  studentList,
  selectedStudent,
  onSelectStudent,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedStudentData = studentList.find((s) => s.id === selectedStudent);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#336d82] rounded-[20px] h-[63px] w-full flex items-center justify-center gap-3 px-6 shadow-lg hover:bg-[#2a5a6a] transition-colors"
      >
        <div className="bg-white rounded-full w-[47px] h-[47px] flex items-center justify-center">
          <PersonIcon sx={{ fontSize: 28, color: "#336d82" }} />
        </div>
        <span className="text-white text-2xl poppins-semibold">
          Pilih Murid
        </span>
        <ArrowDropDownIcon
          className="text-white"
          sx={{ fontSize: 32 }}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[20px] shadow-xl border-2 border-[#336d82] max-h-[400px] overflow-y-auto z-50">
          {studentList.map((student) => (
            <button
              key={student.id}
              onClick={() => {
                onSelectStudent(student.id);
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
    </div>
  );
};

export default StudentSelector;
