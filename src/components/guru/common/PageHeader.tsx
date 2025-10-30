"use client";

import React from "react";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  actionLabel?: string;
  actionHref?: string;
  actionIcon?: React.ReactNode;
  onAction?: () => void;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  actionLabel,
  actionHref,
  actionIcon,
  onAction,
  className = "",
}) => {
  const ActionButton = () => (
    <button
      onClick={onAction}
      className="bg-white text-[#336d82] px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-[12px] sm:rounded-[16px] md:rounded-[20px] flex items-center justify-center sm:justify-start gap-2 sm:gap-3 hover:bg-gray-50 transition-all hover:shadow-md w-full sm:w-auto"
    >
      {actionIcon && (
        <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-[#336d82] rounded-full flex items-center justify-center flex-shrink-0">
          {actionIcon}
        </div>
      )}
      {actionLabel && (
        <span className="text-sm sm:text-base poppins-semibold">{actionLabel}</span>
      )}
    </button>
  );

  return (
    <div
      className={`relative bg-gradient-to-r from-[#336D82] to-[#ECF3F6] rounded-[12px] sm:rounded-[16px] md:rounded-[20px] min-h-[120px] sm:min-h-[140px] md:h-[183px] flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 md:px-10 lg:px-12 py-4 sm:py-5 md:py-6 gap-4 sm:gap-6 shadow-lg ${className}`}
    >
      <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl poppins-semibold tracking-wide leading-tight">
        {title}
      </h1>
      {(actionLabel || actionIcon) && (
        <>
          {actionHref ? (
            <Link href={actionHref} className="w-full sm:w-auto">
              <ActionButton />
            </Link>
          ) : (
            <ActionButton />
          )}
        </>
      )}
    </div>
  );
};

export default PageHeader;
