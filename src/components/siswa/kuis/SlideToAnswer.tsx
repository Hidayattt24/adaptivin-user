"use client";

import { useState, useRef, useEffect } from "react";

interface SlideToAnswerProps {
  onSlideComplete: () => void;
  disabled?: boolean;
}

/**
 * Slide to Answer Component
 *
 * Button slide untuk submit jawaban kuis
 * - User harus slide dari kiri ke kanan
 * - Full width untuk mobile-friendly
 * - Visual feedback saat slide
 * - Auto reset jika tidak complete
 */
export default function SlideToAnswer({
  onSlideComplete,
  disabled = false,
}: SlideToAnswerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const SLIDER_WIDTH = 60; // Width of the slider button
  const COMPLETE_THRESHOLD = 0.9; // 90% to complete

  useEffect(() => {
    if (disabled) {
      setSliderPosition(0);
      setIsComplete(false);
    }
  }, [disabled]);

  const handleStart = (clientX: number) => {
    if (disabled || isComplete) return;
    setIsDragging(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || !containerRef.current || disabled || isComplete) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const maxPosition = containerRect.width - SLIDER_WIDTH;
    const newPosition = Math.min(
      Math.max(0, clientX - containerRect.left - SLIDER_WIDTH / 2),
      maxPosition
    );

    setSliderPosition(newPosition);

    // Check if slide is complete
    if (newPosition / maxPosition >= COMPLETE_THRESHOLD) {
      setIsComplete(true);
      setIsDragging(false);
      setSliderPosition(maxPosition);

      // Trigger callback after animation
      setTimeout(() => {
        onSlideComplete();
        // Reset after completion
        setTimeout(() => {
          setSliderPosition(0);
          setIsComplete(false);
        }, 300);
      }, 200);
    }
  };

  const handleEnd = () => {
    if (isComplete) return;
    setIsDragging(false);

    // Reset if not complete
    if (!isComplete) {
      setSliderPosition(0);
    }
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isDragging]);

  const progressPercentage = containerRef.current
    ? (sliderPosition / (containerRef.current.getBoundingClientRect().width - SLIDER_WIDTH)) * 100
    : 0;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[60px] rounded-[30px] overflow-hidden shadow-xl ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
      style={{
        background: "linear-gradient(90deg, #336D82 0%, #4A8FA5 100%)",
      }}
    >
      {/* Progress Background */}
      <div
        className="absolute left-0 top-0 h-full transition-all duration-200 ease-out rounded-[30px]"
        style={{
          width: `${progressPercentage}%`,
          background: "linear-gradient(90deg, #2EA062 0%, #3BC97A 100%)",
        }}
      />

      {/* Instruction Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <p
          className={`text-white font-semibold text-[14px] transition-opacity duration-200 ${
            isDragging || isComplete ? "opacity-0" : "opacity-100"
          }`}
        >
          {disabled ? "Isi jawaban dulu yaa..." : "Geser untuk Jawab →"}
        </p>
      </div>

      {/* Slider Button */}
      <div
        ref={sliderRef}
        className={`absolute top-[5px] h-[50px] bg-white rounded-[25px] shadow-2xl flex items-center justify-center transition-transform ${
          isDragging ? "scale-105" : "scale-100"
        } ${disabled ? "pointer-events-none" : ""}`}
        style={{
          width: `${SLIDER_WIDTH}px`,
          left: `${sliderPosition}px`,
          transform: isDragging ? "scale(1.05)" : "scale(1)",
          transition: isDragging ? "none" : "left 0.3s ease-out, transform 0.2s ease",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Icon */}
        <span
          className="material-symbols-outlined text-[28px] font-bold transition-colors"
          style={{
            color: isComplete ? "#2EA062" : "#336D82",
          }}
        >
          {isComplete ? "check_circle" : "arrow_forward"}
        </span>
      </div>

      {/* Completion Text */}
      {isComplete && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-white font-bold text-[16px] animate-pulse">
            Mantap! ✨
          </p>
        </div>
      )}
    </div>
  );
}
