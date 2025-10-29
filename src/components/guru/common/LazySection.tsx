"use client";

import React, { Suspense } from "react";
import { useIntersectionObserver } from "@/hooks/guru/useIntersectionObserver";

interface LazySectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  className?: string;
}

/**
 * LazySection component that only renders children when visible in viewport
 * Uses IntersectionObserver to detect when component enters viewport
 * Perfect for below-the-fold content like charts, heavy widgets, etc.
 */
export function LazySection({
  children,
  fallback,
  rootMargin = "200px",
  className,
}: LazySectionProps) {
  const { targetRef, isIntersecting } = useIntersectionObserver({
    rootMargin,
    triggerOnce: true, // Only trigger once when first visible
  });

  return (
    <div ref={targetRef} className={className}>
      {isIntersecting ? (
        <Suspense fallback={fallback || null}>{children}</Suspense>
      ) : (
        fallback || <div style={{ minHeight: "200px" }} aria-hidden="true" />
      )}
    </div>
  );
}
