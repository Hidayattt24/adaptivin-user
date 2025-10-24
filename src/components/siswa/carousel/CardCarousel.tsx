"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface CardItem {
  id: string;
  title: string;
  imagePath: string;
  link: string;
}

interface CardCarouselProps {
  cards: CardItem[];
}

export default function CardCarousel({ cards }: CardCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle manual scroll only (auto-scroll disabled)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = 263 + 24; // card width + gap
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(newIndex);
    };

    // Initial sync on mount - detect current scroll position
    handleScroll();

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [cards.length]);

  const scrollToCard = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = 263; // card width
    const gap = 24; // gap between cards
    const containerWidth = container.offsetWidth;

    // Calculate scroll position to center the card perfectly
    // Formula: position of card - half container width + half card width
    const cardPosition = (cardWidth + gap) * index;
    const scrollPosition = cardPosition - (containerWidth / 2) + (cardWidth / 2);

    container.scrollTo({
      left: Math.max(0, scrollPosition),
      behavior: "smooth",
    });
  };

  return (
    <div className="relative pb-8">
      {/* Cards Container - Extra padding to prevent cropping */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-8 px-6 scroll-smooth"
        style={{
          scrollSnapType: "x mandatory",
          scrollPaddingLeft: "calc(50% - 131.5px)",
        }}
      >
        {cards.map((card, index) => {
          const isCenter = index === activeIndex;
          return (
            <div
              key={card.id}
              className="flex-shrink-0 snap-center transition-all duration-500 ease-out"
              style={{
                transform: isCenter ? "scale(1.15)" : "scale(0.85)",
                opacity: isCenter ? 1 : 0.5,
                marginLeft: index === 0 ? "calc(50% - 131.5px)" : "0",
                marginRight:
                  index === cards.length - 1 ? "calc(50% - 131.5px)" : "0",
              }}
            >
              <Link href={card.link} className="block">
                <div className="relative">
                  <Image
                    src={card.imagePath}
                    alt={card.title}
                    width={263}
                    height={323}
                    className="object-contain transition-transform duration-300"
                    priority={index <= 2}
                  />
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Active Indicator Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToCard(index)}
            className={`h-[5px] rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "w-[52px] bg-[#336d82]"
                : "w-[32px] bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to card ${index + 1}`}
          />
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
