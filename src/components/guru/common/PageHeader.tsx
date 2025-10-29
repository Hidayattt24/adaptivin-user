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
      className="bg-white text-[#336d82] px-6 py-3 rounded-[20px] flex items-center gap-3 hover:bg-gray-50 transition-all hover:shadow-md"
    >
      {actionIcon && (
        <div className="w-9 h-9 bg-[#336d82] rounded-full flex items-center justify-center">
          {actionIcon}
        </div>
      )}
      {actionLabel && (
        <span className="text-base poppins-semibold">{actionLabel}</span>
      )}
    </button>
  );

  return (
    <div
      className={`relative bg-gradient-to-r from-[#336D82] to-[#ECF3F6] rounded-[20px] h-[183px] flex items-center justify-between px-12 shadow-lg ${className}`}
    >
      <h1 className="text-white text-5xl poppins-semibold tracking-wide">
        {title}
      </h1>
      {(actionLabel || actionIcon) && (
        <>
          {actionHref ? (
            <Link href={actionHref}>
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
