"use client";

import React from "react";
import applemojis from "applemojis";
import Image from "next/image";

interface EmojiTextProps {
  children: string;
  className?: string;
  tag?: React.ElementType;
  size?: number;
}

// Emoji unicode code mapping
const emojiCodeMap: Record<string, string> = {
  "🐾": "U+1F43E",
  "🍊": "U+1F34A",
  "👑": "U+1F451",
  "🦝": "U+1F99D",
  "✨": "U+2728",
  "🐸": "U+1F438",
  "💚": "U+1F49A",
  "🐴": "U+1F434",
  "💪": "U+1F4AA",
  "🐷": "U+1F437",
  "💰": "U+1F4B0",
  "🦉": "U+1F989",
  "📚": "U+1F4DA",
  "🐰": "U+1F430",
  "⚡": "U+26A1",
};

export default function EmojiText({
  children,
  className = "",
  tag = "span",
  size = 20,
}: EmojiTextProps) {
  const Tag = tag;

  // Split text by emoji and create array of text/emoji parts
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  // Regex to match all emojis
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;

  let match;
  while ((match = emojiRegex.exec(children)) !== null) {
    // Add text before emoji
    if (match.index > lastIndex) {
      parts.push(children.slice(lastIndex, match.index));
    }

    // Add emoji as Apple emoji image
    const emojiChar = match[0];
    const emojiCode = emojiCodeMap[emojiChar];

    if (emojiCode) {
      const emojiData = applemojis.getOneByCode(emojiCode);

      if (emojiData && emojiData.emoji) {
        parts.push(
          <Image
            key={`${emojiChar}-${match.index}`}
            src={emojiData.emoji}
            alt={emojiData.CLDRShortName || emojiChar}
            width={size}
            height={size}
            style={{
              display: "inline-block",
              margin: "0 0.1em",
              verticalAlign: "-0.2em",
              width: `${size}px`,
              height: `${size}px`
            }}
            unoptimized
          />
        );
      } else {
        // Fallback to native emoji
        parts.push(emojiChar);
      }
    } else {
      // Fallback to native emoji if not in map
      parts.push(emojiChar);
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < children.length) {
    parts.push(children.slice(lastIndex));
  }

  return (
    <Tag className={className}>
      {parts.length > 0 ? parts : children}
    </Tag>
  );
}
