"use client";

import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface StudentCardProps {
  id: string;
  nama: string;
  nis: string;
  tanggalLahir: string;
  tempatLahir: string;
  jenisKelamin: "Laki-laki" | "Perempuan";
  onEdit?: () => void;
  onDelete?: () => void;
}

const StudentCard: React.FC<StudentCardProps> = ({
  nama,
  nis,
  tanggalLahir,
  tempatLahir,
  jenisKelamin,
  onEdit,
  onDelete,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="relative bg-[#336d82] rounded-xl sm:rounded-2xl md:rounded-[18px] min-h-[140px] sm:min-h-[150px] lg:min-h-[140px] flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3 lg:gap-5 p-3 sm:p-3.5 lg:p-5 shadow-lg hover:shadow-xl transition-shadow">
      {/* Student Name Section */}
      <div className="flex-shrink-0 sm:min-w-[140px] lg:min-w-[200px]">
        <h2 className="text-white text-xl sm:text-xl lg:text-3xl xl:text-4xl poppins-semibold leading-tight uppercase">
          {nama}
        </h2>
        {/* Gender Badge */}
        <div className="flex items-center gap-1 sm:gap-1.5 mt-1.5 sm:mt-2 bg-white/90 rounded-full px-2.5 sm:px-2.5 lg:px-4 py-0.5 sm:py-1 w-fit">
          {jenisKelamin === "Laki-laki" ? (
            <MaleIcon className="text-[#336d82]" sx={{ fontSize: { xs: 14, sm: 14, lg: 16 } }} />
          ) : (
            <FemaleIcon className="text-[#336d82]" sx={{ fontSize: { xs: 14, sm: 14, lg: 16 } }} />
          )}
          <span className="text-[#336d82] text-xs sm:text-xs lg:text-sm poppins-semibold">
            {jenisKelamin === "Laki-laki" ? "Laki Laki" : "Perempuan"}
          </span>
        </div>
      </div>

      {/* Student Details Card */}
      <div className="flex-1 bg-white rounded-xl sm:rounded-2xl md:rounded-[18px] p-3 sm:p-3 lg:p-4 min-h-[110px] sm:min-h-[110px] lg:min-h-[110px] flex flex-col justify-center relative">
        <div className="space-y-1 sm:space-y-1.5 lg:space-y-1.5">
          <div className="flex items-center gap-1.5 sm:gap-2 group">
            <p className="text-[#336d82] text-sm sm:text-sm lg:text-lg xl:text-xl poppins-semibold leading-tight flex-1 truncate">
              {nama.toLowerCase()}
            </p>
            <button
              onClick={() => handleCopyToClipboard(nama, "nama")}
              className="opacity-0 sm:opacity-100 sm:group-hover:opacity-100 transition-opacity p-1 sm:p-1 lg:p-1.5 hover:bg-[#336d82]/10 rounded-full flex-shrink-0"
              aria-label="Copy name"
            >
              <ContentCopyIcon
                className="text-[#336d82]"
                sx={{ fontSize: { xs: 14, sm: 14, lg: 16 } }}
              />
            </button>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 group">
            <p className="text-[#336d82] text-sm sm:text-sm lg:text-lg xl:text-xl poppins-semibold leading-tight flex-1 truncate">
              {nis}
            </p>
            <button
              onClick={() => handleCopyToClipboard(nis, "nis")}
              className="opacity-0 sm:opacity-100 sm:group-hover:opacity-100 transition-opacity p-1 sm:p-1 lg:p-1.5 hover:bg-[#336d82]/10 rounded-full flex-shrink-0"
              aria-label="Copy NIS"
            >
              <ContentCopyIcon
                className="text-[#336d82]"
                sx={{ fontSize: { xs: 14, sm: 14, lg: 16 } }}
              />
            </button>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 group">
            <p className="text-[#336d82] text-sm sm:text-sm lg:text-lg xl:text-xl poppins-semibold leading-tight flex-1 truncate">
              {tanggalLahir}
            </p>
            <button
              onClick={() => handleCopyToClipboard(tanggalLahir, "tanggalLahir")}
              className="opacity-0 sm:opacity-100 sm:group-hover:opacity-100 transition-opacity p-1 sm:p-1 lg:p-1.5 hover:bg-[#336d82]/10 rounded-full flex-shrink-0"
              aria-label="Copy birth date"
            >
              <ContentCopyIcon
                className="text-[#336d82]"
                sx={{ fontSize: { xs: 14, sm: 14, lg: 16 } }}
              />
            </button>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 group">
            <p className="text-[#336d82] text-sm sm:text-sm lg:text-lg xl:text-xl poppins-semibold leading-tight flex-1 truncate">
              {tempatLahir}
            </p>
            <button
              onClick={() => handleCopyToClipboard(tempatLahir, "tempatLahir")}
              className="opacity-0 sm:opacity-100 sm:group-hover:opacity-100 transition-opacity p-1 sm:p-1 lg:p-1.5 hover:bg-[#336d82]/10 rounded-full flex-shrink-0"
              aria-label="Copy birth place"
            >
              <ContentCopyIcon
                className="text-[#336d82]"
                sx={{ fontSize: { xs: 14, sm: 14, lg: 16 } }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons - Mobile: Horizontal Row, Tablet+: Vertical Column */}
      <div className="flex flex-row sm:flex-col gap-2 sm:gap-2.5 lg:gap-3 flex-shrink-0 justify-center sm:justify-center">
        <button
          onClick={onEdit}
          className="w-10 h-10 sm:w-11 sm:h-11 lg:w-[50px] lg:h-[50px] bg-white rounded-full flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-all hover:shadow-lg shadow-md"
          aria-label="Edit student"
        >
          <EditIcon className="text-[#336d82]" sx={{ fontSize: { xs: 20, sm: 22, lg: 24 } }} />
        </button>
        <button
          onClick={onDelete}
          className="w-10 h-10 sm:w-11 sm:h-11 lg:w-[50px] lg:h-[50px] bg-white rounded-full flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-all hover:shadow-lg shadow-md"
          aria-label="Delete student"
        >
          <DeleteIcon className="text-[#336d82]" sx={{ fontSize: { xs: 20, sm: 22, lg: 24 } }} />
        </button>
      </div>
    </div>
  );
};

export default StudentCard;
