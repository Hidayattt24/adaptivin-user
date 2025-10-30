"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface CardItem {
  id: string;
  title: string;
  imagePath: string;
  link: string;
  displayTitle?: string; // Optional custom display title for overlay
}

interface CardCarouselProps {
  cards: CardItem[];
}

export default function CardCarousel({ cards }: CardCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle manual scroll only
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = 320 + 32; // card width + gap
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(newIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToCard = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = 320; // card width
    const gap = 32; // gap between cards
    const containerWidth = container.offsetWidth;

    // Calculate scroll position to center the card
    const scrollPosition =
      (cardWidth + gap) * index - containerWidth / 2 + cardWidth / 2;

    container.scrollTo({
      left: Math.max(0, scrollPosition),
      behavior: "smooth",
    });
  };

  return (
    <div className="relative pb-8">
      {/* Cards Container - Larger cards, modern spacing */}
      <div
        ref={scrollContainerRef}
        className="flex gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-10 px-8 scroll-smooth"
        style={{
          scrollSnapType: "x mandatory",
          scrollPaddingLeft: "calc(50% - 160px)",
        }}
      >
        {cards.map((card, index) => {
          const isCenter = index === activeIndex;
          return (
            <div
              key={card.id}
              className="flex-shrink-0 snap-center transition-all duration-500 ease-out"
              style={{
                transform: isCenter ? "scale(1.1)" : "scale(0.9)",
                opacity: isCenter ? 1 : 0.6,
                marginLeft: index === 0 ? "calc(50% - 160px)" : "0",
                marginRight:
                  index === cards.length - 1 ? "calc(50% - 160px)" : "0",
              }}
            >
              <Link href={card.link} className="block">
                <div className="relative w-[320px] h-[393px]">
                  <Image
                    src={card.imagePath}
                    alt={card.title}
                    width={320}
                    height={393}
                    style={{ width: '320px', height: 'auto' }}
                    className="object-contain transition-transform duration-300 hover:scale-105"
                    priority={index <= 2}
                  />
                  {/* Text Overlay */}
                  {card.displayTitle && (
                    <div
                      className="absolute text-right pointer-events-none"
                      style={{
                        top: '40px',
                        bottom: '300px',
                        right: '18px',
                        left: '40px'
                      }}
                    >
                      <div
                        className="press-start-2p-regular text-white text-[20px] leading-[32px]"
                        style={{
                          fontFamily: '"Press Start 2P", system-ui',
                          fontWeight: 400
                        }}
                      >
                        {card.displayTitle.split('\n').map((line, i) => (
                          <div key={i}>{line}</div>
                        ))}
                      </div>
                    </div>
                  )}
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
            className={`h-[5px] rounded-full transition-all duration-300 ${index === activeIndex
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
