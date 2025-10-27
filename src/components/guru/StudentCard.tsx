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
    <div className="relative bg-[#336d82] rounded-[20px] min-h-[211px] flex items-center gap-8 p-8 shadow-lg hover:shadow-xl transition-shadow">
      {/* Student Name Section */}
      <div className="flex-shrink-0">
        <h2 className="text-white text-6xl poppins-semibold leading-tight uppercase">
          {nama}
        </h2>
        {/* Gender Badge */}
        <div className="flex items-center gap-2 mt-4 bg-white/90 rounded-full px-6 py-2 w-fit">
          {jenisKelamin === "Laki-laki" ? (
            <MaleIcon className="text-[#336d82]" sx={{ fontSize: 20 }} />
          ) : (
            <FemaleIcon className="text-[#336d82]" sx={{ fontSize: 20 }} />
          )}
          <span className="text-[#336d82] text-xl poppins-semibold">
            {jenisKelamin === "Laki-laki" ? "Laki Laki" : "Perempuan"}
          </span>
        </div>
      </div>

      {/* Student Details Card */}
      <div className="flex-1 bg-white rounded-[20px] p-6 min-h-[163px] flex flex-col justify-center relative">
        <div className="space-y-2">
          <div className="flex items-center gap-3 group">
            <p className="text-[#336d82] text-3xl poppins-semibold leading-tight flex-1">
              {nama.toLowerCase()}
            </p>
            <button
              onClick={() => handleCopyToClipboard(nama, "nama")}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[#336d82]/10 rounded-full"
              aria-label="Copy name"
            >
              <ContentCopyIcon
                className="text-[#336d82]"
                sx={{ fontSize: 20 }}
              />
            </button>
          </div>
          <div className="flex items-center gap-3 group">
            <p className="text-[#336d82] text-3xl poppins-semibold leading-tight flex-1">
              {nis}
            </p>
            <button
              onClick={() => handleCopyToClipboard(nis, "nis")}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[#336d82]/10 rounded-full"
              aria-label="Copy NIS"
            >
              <ContentCopyIcon
                className="text-[#336d82]"
                sx={{ fontSize: 20 }}
              />
            </button>
          </div>
          <div className="flex items-center gap-3 group">
            <p className="text-[#336d82] text-3xl poppins-semibold leading-tight flex-1">
              {tanggalLahir}
            </p>
            <button
              onClick={() => handleCopyToClipboard(tanggalLahir, "tanggalLahir")}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[#336d82]/10 rounded-full"
              aria-label="Copy birth date"
            >
              <ContentCopyIcon
                className="text-[#336d82]"
                sx={{ fontSize: 20 }}
              />
            </button>
          </div>
          <div className="flex items-center gap-3 group">
            <p className="text-[#336d82] text-3xl poppins-semibold leading-tight flex-1">
              {tempatLahir}
            </p>
            <button
              onClick={() => handleCopyToClipboard(tempatLahir, "tempatLahir")}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[#336d82]/10 rounded-full"
              aria-label="Copy birth place"
            >
              <ContentCopyIcon
                className="text-[#336d82]"
                sx={{ fontSize: 20 }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 flex-shrink-0">
        <button
          onClick={onEdit}
          className="w-[73px] h-[73px] bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-all hover:shadow-lg shadow-md"
          aria-label="Edit student"
        >
          <EditIcon className="text-[#336d82]" sx={{ fontSize: 32 }} />
        </button>
        <button
          onClick={onDelete}
          className="w-[73px] h-[73px] bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-all hover:shadow-lg shadow-md"
          aria-label="Delete student"
        >
          <DeleteIcon className="text-[#336d82]" sx={{ fontSize: 32 }} />
        </button>
      </div>
    </div>
  );
};

export default StudentCard;
