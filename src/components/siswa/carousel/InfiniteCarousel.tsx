"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import EmojiText from "@/components/common/EmojiText";

interface CarouselItem {
  id: string;
  name: string;
  path: string;
  description: string;
  color: string;
}

interface InfiniteCarouselProps {
  items: CarouselItem[];
  onSelect: (id: string) => void;
  selectedId: string;
  onCenterChange: (id: string) => void;
  showNavigationButtons?: boolean;
}

export default function InfiniteCarousel({
  items,
  onSelect,
  selectedId,
  onCenterChange,
  showNavigationButtons = false,
}: InfiniteCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [clickedId, setClickedId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Set mounted state after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle manual scroll - detect center card
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const getCardWidth = () => {
      // Responsive card width based on screen size
      if (window.innerWidth >= 1024) return 320 + 32; // lg: larger cards
      if (window.innerWidth >= 768) return 290 + 28; // md: medium cards
      return 263 + 24; // mobile: default cards
    };

    const handleScroll = () => {
      // Hide scroll hint after first scroll
      if (showScrollHint) {
        setShowScrollHint(false);
      }

      const scrollLeft = container.scrollLeft;
      const containerWidth = container.offsetWidth;
      const cardWidth = getCardWidth();
      const maxScroll = container.scrollWidth - containerWidth;

      // Calculate center of viewport
      const viewportCenter = scrollLeft + containerWidth / 2;

      // Find which card is closest to center
      let closestIndex = 0;
      let closestDistance = Infinity;

      for (let i = 0; i < items.length; i++) {
        // Calculate card center position
        let cardCenter;
        if (i === 0) {
          // First card starts at center
          cardCenter = containerWidth / 2;
        } else if (i === items.length - 1) {
          // Last card ends at center from the right
          cardCenter = maxScroll + containerWidth / 2;
        } else {
          // Middle cards
          cardCenter = containerWidth / 2 + cardWidth * i;
        }

        const distance = Math.abs(viewportCenter - cardCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      }

      setActiveIndex(closestIndex);
    };

    // Initial setup - don't force reset on mount if user navigated back
    const initialTimer = setTimeout(() => {
      handleScroll();
    }, 100);

    container.addEventListener("scroll", handleScroll, { passive: true });

    // Handle window resize
    window.addEventListener("resize", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      clearTimeout(initialTimer);
    };
  }, [items.length, showScrollHint]);

  // Notify parent when center card changes
  useEffect(() => {
    onCenterChange(items[activeIndex].id);
  }, [activeIndex, items, onCenterChange]);

  // Navigate to specific card
  const scrollToCard = useCallback(
    (index: number) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      // Responsive card dimensions
      let cardWidth = 263;
      let gap = 24;

      if (window.innerWidth >= 1024) {
        cardWidth = 320;
        gap = 32;
      } else if (window.innerWidth >= 768) {
        cardWidth = 290;
        gap = 28;
      }

      const containerWidth = container.offsetWidth;
      const totalCardWidth = cardWidth + gap;

      // Calculate scroll position to center the card perfectly
      let scrollLeft = 0;

      if (index === 0) {
        scrollLeft = 0;
      } else if (index === items.length - 1) {
        scrollLeft = container.scrollWidth - containerWidth;
      } else {
        // For middle cards, center them
        const cardPosition = totalCardWidth * index;
        scrollLeft = cardPosition - containerWidth / 2 + cardWidth / 2;
      }

      // Scroll to position
      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    },
    [items.length]
  );

  // Navigation button handlers
  const handlePrevious = () => {
    if (activeIndex > 0) {
      const newIndex = activeIndex - 1;
      setActiveIndex(newIndex);
      scrollToCard(newIndex);
    }
  };

  const handleNext = () => {
    if (activeIndex < items.length - 1) {
      const newIndex = activeIndex + 1;
      setActiveIndex(newIndex);
      scrollToCard(newIndex);
    }
  };

  return (
    <div className="relative pb-8">
      {/* Scroll Hint Overlay - Desktop/Tablet only */}
      {showScrollHint && (
        <div className="hidden md:block absolute inset-0 z-30 pointer-events-none">
          {/* Instruction Text at Top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12">
            <div className="bg-gradient-to-r from-[#33A1E0] to-[#2B7A9E] text-white px-6 py-3 rounded-full shadow-2xl animate-bounce-slow">
              <div className="flex items-center gap-3">
                <span className="text-2xl">👆</span>
                <p className="font-bold text-sm lg:text-base">
                  Geser ke kanan & kiri untuk lihat karakter lainnya!
                </p>
                <span className="text-2xl">👆</span>
              </div>
            </div>
          </div>

          {/* Animated Left Arrow */}
          {activeIndex > 0 && (
            <div className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 animate-slide-left">
              <div className="flex items-center gap-2">
                <div className="text-4xl lg:text-5xl drop-shadow-lg animate-pulse">
                  👈
                </div>
                <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-xl">
                  <p className="font-bold text-[#33A1E0] text-xs lg:text-sm">
                    Geser
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Animated Right Arrow */}
          {activeIndex < items.length - 1 && (
            <div className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 animate-slide-right">
              <div className="flex items-center gap-2">
                <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-xl">
                  <p className="font-bold text-[#FF6B9D] text-xs lg:text-sm">
                    Geser
                  </p>
                </div>
                <div className="text-4xl lg:text-5xl drop-shadow-lg animate-pulse">
                  👉
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Gradient Fade Edges to indicate more content */}
      <div className="hidden md:block absolute left-0 top-0 bottom-8 w-20 lg:w-32 bg-gradient-to-r from-white via-white/50 to-transparent z-10 pointer-events-none"></div>
      <div className="hidden md:block absolute right-0 top-0 bottom-8 w-20 lg:w-32 bg-gradient-to-l from-white via-white/50 to-transparent z-10 pointer-events-none"></div>

      {/* Carousel Container - Responsive sizing - Optimized for iPhone */}
      <div
        ref={scrollContainerRef}
        className="flex gap-5 sm:gap-6 md:gap-7 lg:gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-6 sm:py-8 md:py-10 lg:py-12 px-4 sm:px-6 md:px-8 scroll-smooth"
        style={{
          scrollSnapType: "x mandatory",
        }}
      >
        {items.map((item, index) => {
          const isCenter = index === activeIndex;
          const isSelected = item.id === selectedId;

          // Calculate responsive margins for first and last cards - only after mount
          const getMargins = () => {
            if (!isMounted) {
              // Default margins for SSR
              const halfCard = 131.5; // 263 / 2 (mobile default)
              return {
                left: index === 0 ? `calc(50% - ${halfCard}px)` : "0",
                right:
                  index === items.length - 1
                    ? `calc(50% - ${halfCard}px)`
                    : "0",
              };
            }

            let cardWidth = 263;
            if (window.innerWidth >= 1024) cardWidth = 320;
            else if (window.innerWidth >= 768) cardWidth = 290;

            const halfCard = cardWidth / 2;
            return {
              left: index === 0 ? `calc(50% - ${halfCard}px)` : "0",
              right:
                index === items.length - 1 ? `calc(50% - ${halfCard}px)` : "0",
            };
          };

          const margins = getMargins();

          return (
            <div
              key={item.id}
              className={`flex-shrink-0 snap-center transition-all duration-500 ease-out relative ${
                clickedId === item.id ? "animate-card-select" : ""
              }`}
              style={{
                transform: isCenter ? "scale(1.15)" : "scale(0.85)",
                opacity: 1,
                marginLeft: margins.left,
                marginRight: margins.right,
              }}
            >
              <button
                onClick={() => {
                  if (isCenter) {
                    // Only allow selection if card is in center
                    setClickedId(item.id);
                    setTimeout(() => setClickedId(null), 500);
                    onSelect(item.id);
                  } else {
                    // If not center, scroll to center this card
                    scrollToCard(index);
                  }
                }}
                className={`block relative group ${
                  isCenter ? "cursor-pointer" : "cursor-pointer"
                }`}
              >
                {/* Character Card with border indicator */}
                <div className="relative">
                  {/* Border frame untuk card yang dipilih - warna disesuaikan dengan karakter */}
                  {isSelected && (
                    <div
                      className="absolute -inset-1 md:-inset-1.5 lg:-inset-2 rounded-[20px] md:rounded-[24px] lg:rounded-[28px] animate-border-fade"
                      style={{
                        background: `linear-gradient(135deg, ${item.color}, ${item.color}dd, ${item.color})`,
                      }}
                    >
                      <div
                        className="absolute inset-0 rounded-[20px] md:rounded-[24px] lg:rounded-[28px] animate-border-pulse"
                        style={{
                          background: `linear-gradient(135deg, ${item.color}, ${item.color}ff, ${item.color})`,
                        }}
                      ></div>
                    </div>
                  )}

                  {/* Center indicator - Show when card is in center - Inside card bottom */}
                  {isCenter && !isSelected && (
                    <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-10 w-max max-w-[90%]">
                      <div className="bg-gradient-to-r from-[#FFB347] to-[#FF8C42] text-white text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full shadow-lg animate-bounce whitespace-nowrap">
                        👆 Klik untuk pilih!
                      </div>
                    </div>
                  )}

                  {/* Selected badge - Inside card bottom */}
                  {isSelected && (
                    <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-10 w-max">
                      <div className="bg-gradient-to-r from-green-400 to-green-500 text-white text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                        ✓ Terpilih
                      </div>
                    </div>
                  )}

                  {/* Card image container - Responsive sizing */}
                  <div
                    className={`relative bg-transparent rounded-[18px] md:rounded-[22px] lg:rounded-[26px] transition-all duration-300 ${
                      isSelected ? "p-1" : ""
                    } ${!isCenter ? "opacity-60" : "opacity-100"}`}
                  >
                    <Image
                      src={item.path}
                      alt={item.name}
                      width={320}
                      height={393}
                      className={`object-contain transition-all duration-300 rounded-[16px] md:rounded-[20px] lg:rounded-[24px] w-[263px] md:w-[290px] lg:w-[320px] h-auto ${
                        isCenter
                          ? "group-hover:scale-105"
                          : "group-hover:scale-95"
                      }`}
                      priority={index <= 2}
                    />
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Description Text - Responsive sizing - Compact for iPhone */}
      <div className="mt-3 sm:mt-4 md:mt-6 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-2xl mx-auto">
          <EmojiText
            tag="p"
            className="text-xs sm:text-[13px] md:text-sm lg:text-base font-medium text-[#c3c3c3] text-center leading-relaxed"
            size={14}
          >
            {items[activeIndex]?.description ||
              "Pilih teman belajar favoritmu!"}
          </EmojiText>
        </div>
      </div>

      {/* Progress Line Indicator - Responsive sizing - Compact for iPhone */}
      <div className="flex justify-center gap-1.5 sm:gap-2 md:gap-2.5 mt-4 sm:mt-6 md:mt-8">
        {items.map((_, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={index}
              onClick={() => scrollToCard(index)}
              className={`h-[4px] sm:h-[5px] md:h-[6px] rounded-full transition-all duration-300 ${
                isActive
                  ? "w-[44px] sm:w-[52px] md:w-[64px] lg:w-[72px] bg-[#336d82]"
                  : "w-[28px] sm:w-[32px] md:w-[40px] lg:w-[44px] bg-gray-300 active:bg-gray-400"
              }`}
              aria-label={`Go to character ${index + 1}`}
            />
          );
        })}
      </div>

      {/* Navigation Buttons - Desktop only - Below carousel for easy access */}
      {showNavigationButtons && (
        <div className="hidden md:flex justify-center gap-4 lg:gap-6 mt-6 lg:mt-8 relative z-30">
          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrevious}
            disabled={activeIndex === 0}
            className={`group flex items-center gap-2 lg:gap-3 px-6 lg:px-8 py-3 lg:py-4 rounded-2xl font-bold text-sm lg:text-base transition-all duration-300 shadow-lg ${
              activeIndex === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "text-white hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
            }`}
            style={
              activeIndex === 0
                ? {}
                : {
                    background:
                      "linear-gradient(180deg, #33A1E0 0.03%, #0A3D60 124.56%)",
                  }
            }
            aria-label="Previous character"
          >
            <svg
              className={`w-5 h-5 lg:w-6 lg:h-6 transition-transform duration-300 ${
                activeIndex === 0 ? "" : "group-hover:-translate-x-1"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Sebelumnya</span>
          </button>

          {/* Current Position Indicator */}
          <div
            className="flex items-center justify-center px-4 lg:px-6 py-3 lg:py-4 rounded-2xl shadow-md"
            style={{
              background:
                "linear-gradient(180deg, #33A1E0 0.03%, #0A3D60 124.56%)",
            }}
          >
            <span className="font-bold text-white text-sm lg:text-base">
              {activeIndex + 1} / {items.length}
            </span>
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            disabled={activeIndex === items.length - 1}
            className={`group flex items-center gap-2 lg:gap-3 px-6 lg:px-8 py-3 lg:py-4 rounded-2xl font-bold text-sm lg:text-base transition-all duration-300 shadow-lg ${
              activeIndex === items.length - 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "text-white hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
            }`}
            style={
              activeIndex === items.length - 1
                ? {}
                : {
                    background:
                      "linear-gradient(180deg, #33A1E0 0.03%, #0A3D60 124.56%)",
                  }
            }
            aria-label="Next character"
          >
            <span>Selanjutnya</span>
            <svg
              className={`w-5 h-5 lg:w-6 lg:h-6 transition-transform duration-300 ${
                activeIndex === items.length - 1
                  ? ""
                  : "group-hover:translate-x-1"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Scrollbar Hide CSS + Animations */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Card Select Animation - Smooth bounce */
        @keyframes card-select {
          0% {
            transform: scale(1);
          }
          40% {
            transform: scale(1.1);
          }
          70% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-card-select {
          animation: card-select 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* Border fade in animation */
        @keyframes border-fade {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-border-fade {
          animation: border-fade 0.3s ease-out;
        }

        /* Border pulse animation - subtle breathing effect */
        @keyframes border-pulse {
          0%,
          100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-border-pulse {
          animation: border-pulse 2s ease-in-out infinite;
        }

        /* Scroll hint animations */
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0) translateX(-50%);
          }
          50% {
            transform: translateY(-10px) translateX(-50%);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        @keyframes slide-left {
          0%,
          100% {
            transform: translateX(0) translateY(-50%);
            opacity: 1;
          }
          50% {
            transform: translateX(-10px) translateY(-50%);
            opacity: 0.7;
          }
        }

        .animate-slide-left {
          animation: slide-left 1.5s ease-in-out infinite;
        }

        @keyframes slide-right {
          0%,
          100% {
            transform: translateX(0) translateY(-50%);
            opacity: 1;
          }
          50% {
            transform: translateX(10px) translateY(-50%);
            opacity: 0.7;
          }
        }

        .animate-slide-right {
          animation: slide-right 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
