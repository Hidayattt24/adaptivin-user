"use client";

import { useState, useEffect, useRef } from "react";
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
}

export default function InfiniteCarousel({
  items,
  onSelect,
  selectedId,
  onCenterChange,
}: InfiniteCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [clickedId, setClickedId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle manual scroll - detect center card
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = 263 + 24; // card width + gap
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(newIndex);
    };

    // Aggressively reset scroll and state
    const forceReset = () => {
      container.scrollLeft = 0;
      setActiveIndex(0);
      handleScroll();
    };

    // Immediate reset
    forceReset();

    // Multiple delayed resets to override browser scroll restoration
    const syncTimer1 = setTimeout(forceReset, 0);
    const syncTimer2 = setTimeout(forceReset, 50);
    const syncTimer3 = setTimeout(forceReset, 150);
    const syncTimer4 = setTimeout(forceReset, 300);
    const syncTimer5 = setTimeout(forceReset, 500);

    // Use requestAnimationFrame for immediate sync
    const rafId = requestAnimationFrame(forceReset);

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(syncTimer1);
      clearTimeout(syncTimer2);
      clearTimeout(syncTimer3);
      clearTimeout(syncTimer4);
      clearTimeout(syncTimer5);
      cancelAnimationFrame(rafId);
    };
  }, [items.length]);

  // Notify parent when center card changes
  useEffect(() => {
    onCenterChange(items[activeIndex].id);
  }, [activeIndex, items, onCenterChange]);

  // Navigate to specific card
  const scrollToCard = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = 263; // card width
    const gap = 24; // gap between cards
    const containerWidth = container.offsetWidth;

    // Calculate scroll position to center the card perfectly
    const cardPosition = (cardWidth + gap) * index;
    const scrollPosition = cardPosition - (containerWidth / 2) + (cardWidth / 2);

    container.scrollTo({
      left: Math.max(0, scrollPosition),
      behavior: "smooth",
    });
  };

  return (
    <div className="relative pb-8">
      {/* Carousel Container - Match beranda style exactly */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-8 px-6 scroll-smooth"
        style={{
          scrollSnapType: "x mandatory",
          scrollPaddingLeft: "calc(50% - 131.5px)",
        }}
      >
        {items.map((item, index) => {
          const isCenter = index === activeIndex;
          const isSelected = item.id === selectedId;

          return (
            <div
              key={item.id}
              className={`flex-shrink-0 snap-center transition-all duration-500 ease-out relative ${
                clickedId === item.id ? "animate-card-select" : ""
              }`}
              style={{
                transform: isCenter ? "scale(1.15)" : "scale(0.85)",
                opacity: 1,
                marginLeft: index === 0 ? "calc(50% - 131.5px)" : "0",
                marginRight: index === items.length - 1 ? "calc(50% - 131.5px)" : "0",
              }}
            >
              <button
                onClick={() => {
                  // Trigger animation
                  setClickedId(item.id);
                  setTimeout(() => setClickedId(null), 500);

                  // Only select, don't trigger movement
                  onSelect(item.id);
                }}
                className={`block relative group ${
                  isCenter ? "cursor-pointer" : "cursor-default"
                }`}
              >
                {/* Character Card with border indicator */}
                <div className="relative">
                  {/* Border frame untuk card yang dipilih - warna disesuaikan dengan karakter */}
                  {isSelected && (
                    <div
                      className="absolute -inset-1 rounded-[20px] animate-border-fade"
                      style={{
                        background: `linear-gradient(135deg, ${item.color}, ${item.color}dd, ${item.color})`,
                      }}
                    >
                      <div
                        className="absolute inset-0 rounded-[20px] animate-border-pulse"
                        style={{
                          background: `linear-gradient(135deg, ${item.color}, ${item.color}ff, ${item.color})`,
                        }}
                      ></div>
                    </div>
                  )}

                  {/* Card image container */}
                  <div className={`relative bg-transparent rounded-[18px] transition-all duration-300 ${
                    isSelected ? "p-1" : ""
                  }`}>
                    <Image
                      src={item.path}
                      alt={item.name}
                      width={263}
                      height={323}
                      className={`object-contain transition-all duration-300 rounded-[16px] ${
                        isCenter ? "group-hover:scale-105" : ""
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

      {/* Description Text */}
      <div className="mt-4 px-6">
        <EmojiText
          tag="p"
          className="text-[13px] font-medium text-[#c3c3c3] text-center leading-relaxed"
          size={16}
        >
          {items[activeIndex]?.description || "Pilih teman belajar favoritmu!"}
        </EmojiText>
      </div>

      {/* Progress Line Indicator - Match beranda style */}
      <div className="flex justify-center gap-2 mt-6">
        {items.map((_, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={index}
              onClick={() => scrollToCard(index)}
              className={`h-[5px] rounded-full transition-all duration-300 ${
                isActive
                  ? "w-[52px] bg-[#336d82]"
                  : "w-[32px] bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to character ${index + 1}`}
            />
          );
        })}
      </div>

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
          0%, 100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-border-pulse {
          animation: border-pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
