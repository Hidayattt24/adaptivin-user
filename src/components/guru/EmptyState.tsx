"use client";

import React from "react";
import { motion } from "framer-motion";
import SearchOffIcon from "@mui/icons-material/SearchOff";

interface EmptyStateProps {
  type?: "search" | "empty";
  searchQuery?: string;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type = "empty",
  searchQuery = "",
  title,
  message,
  actionLabel,
  onAction,
}) => {
  const isSearchEmpty = type === "search";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="bg-gradient-to-r from-[#336D82] to-[#ECF3F6] rounded-[20px] p-12 text-center shadow-lg"
    >
      {isSearchEmpty ? (
        <>
          {/* Animated Search Off Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 0.2,
              duration: 0.6,
              ease: "easeOut",
            }}
            className="flex justify-center mb-6"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, -10, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              className="bg-white/20 rounded-full p-6"
            >
              <SearchOffIcon sx={{ fontSize: 80 }} className="text-white" />
            </motion.div>
          </motion.div>

          {/* Animated Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h3 className="text-white text-3xl poppins-semibold mb-3">
              {title || "Tidak Ada Hasil"}
            </h3>
            <p className="text-white/90 text-lg poppins-regular mb-6">
              {message ||
                `Tidak ditemukan materi dengan kata kunci "${searchQuery}"`}
            </p>
          </motion.div>

          {/* Animated Button */}
          {actionLabel && onAction && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAction}
              className="bg-white text-[#336d82] px-8 py-3 rounded-[15px] poppins-semibold hover:bg-gray-100 transition-colors shadow-md"
            >
              {actionLabel}
            </motion.button>
          )}
        </>
      ) : (
        <>
          <h3 className="text-white text-2xl poppins-semibold mb-2">
            {title || "Belum Ada Data"}
          </h3>
          <p className="text-white poppins-regular mb-6">
            {message || "Mulai tambahkan data pertama"}
          </p>
        </>
      )}
    </motion.div>
  );
};

export default EmptyState;
