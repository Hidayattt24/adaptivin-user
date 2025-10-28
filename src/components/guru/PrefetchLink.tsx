"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";

interface PrefetchLinkProps {
  href: string;
  children: React.ReactNode;
  queryKey?: (string | number | object)[];
  queryFn?: () => Promise<unknown>;
  className?: string;
  [key: string]: unknown;
}

/**
 * PrefetchLink component that prefetches data on hover/focus
 * Combines Next.js Link with React Query prefetching for optimal UX
 */
export function PrefetchLink({
  href,
  children,
  queryKey,
  queryFn,
  className,
  ...props
}: PrefetchLinkProps) {
  const queryClient = useQueryClient();

  const handlePrefetch = () => {
    if (queryKey && queryFn) {
      queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }
  };

  return (
    <Link
      href={href}
      className={className}
      onMouseEnter={handlePrefetch}
      onFocus={handlePrefetch}
      {...props}
    >
      {children}
    </Link>
  );
}
