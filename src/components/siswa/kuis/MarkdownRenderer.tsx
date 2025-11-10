"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * MarkdownRenderer - Komponen untuk render Markdown dengan styling yang bagus
 *
 * Fitur:
 * - Render Markdown dari AI (bold, italic, list, heading, dll)
 * - Styling yang user-friendly dan mudah dibaca
 * - Support emoji dan formatting khusus
 * - Responsive design
 * - Convert \n literal dari database menjadi actual line breaks
 */
export function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  // Debug: log content untuk melihat format aslinya
  console.log("MarkdownRenderer - Original content:", content);

  // PENTING: String dari database mengandung literal "\n" (backslash + n)
  // Kita perlu mengkonversinya menjadi actual newline character agar ReactMarkdown bisa process
  // Contoh: "text\n\nmore" menjadi "text[newline][newline]more"
  const formattedContent = content
    .replace(/\\n/g, "\n") // Convert \n literal menjadi actual newline
    .trim();

  console.log("MarkdownRenderer - Formatted content:", formattedContent);

  return (
    <div className={`prose prose-sm md:prose-base max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Heading styles
          h1: ({ children }) => (
            <h1 className="text-xl md:text-2xl font-bold text-[#336D82] mb-4 mt-6 pb-2 border-b-2 border-[#336D82]/30">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg md:text-xl font-bold text-[#336D82] mb-3 mt-5 pb-2 border-b border-[#336D82]/20">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base md:text-lg font-semibold text-[#336D82] mb-2 mt-4">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm md:text-base font-semibold text-[#336D82] mb-2 mt-3">
              {children}
            </h4>
          ),

          // Paragraph
          p: ({ children }) => {
            // Check if paragraph contains heading-like content with emoji
            const content = String(children);
            const isHeadingLike = /^[\u{1F300}-\u{1F9FF}].*[A-Z\s:]+/u.test(
              content
            );

            if (isHeadingLike) {
              return (
                <p className="text-base md:text-lg font-bold text-[#336D82] leading-relaxed mb-4 mt-4 bg-gradient-to-r from-[#F0F7F9] to-transparent py-2 px-3 rounded-lg border-l-4 border-[#336D82]">
                  {children}
                </p>
              );
            }

            return (
              <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-3">
                {children}
              </p>
            );
          },

          // Lists - Unordered
          ul: ({ children }) => (
            <ul className="list-none space-y-2.5 mb-4 ml-2">{children}</ul>
          ),

          // Lists - Ordered
          ol: ({ children }) => (
            <ol className="list-none space-y-2.5 mb-4 ml-2">{children}</ol>
          ),

          // List items
          li: ({ children }) => {
            // Detect if the line starts with emoji or special character
            const content = String(children);
            const hasLeadingEmoji =
              /^[\u{1F300}-\u{1F9FF}]|^[•▪▫◦‣⁃⭐📚🎯💪📖🤝✨]/u.test(content);

            return (
              <li className="flex items-start gap-3 text-sm md:text-base text-gray-700 leading-relaxed py-1">
                {!hasLeadingEmoji && (
                  <span className="flex-shrink-0 text-[#336D82] font-bold mt-1.5 text-lg">
                    •
                  </span>
                )}
                <span className="flex-1">{children}</span>
              </li>
            );
          },

          // Bold text
          strong: ({ children }) => {
            // Check if bold text looks like a heading (ALL CAPS or Title Case)
            const content = String(children);
            const isAllCaps =
              content === content.toUpperCase() && content.length > 3;

            if (isAllCaps) {
              return (
                <strong className="font-extrabold text-[#336D82] text-base tracking-wide">
                  {children}
                </strong>
              );
            }

            return (
              <strong className="font-bold text-[#336D82]">{children}</strong>
            );
          },

          // Italic text
          em: ({ children }) => (
            <em className="italic text-gray-800">{children}</em>
          ),

          // Code blocks
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-gray-100 text-[#336D82] px-1.5 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              );
            }
            return (
              <code className="block bg-gray-100 text-gray-800 p-3 rounded-lg text-sm font-mono overflow-x-auto mb-3">
                {children}
              </code>
            );
          },

          // Blockquote
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#336D82] pl-4 py-2 my-3 bg-[#F0F7F9] rounded-r-lg">
              {children}
            </blockquote>
          ),

          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#336D82] hover:text-[#7AB0C4] underline font-medium"
            >
              {children}
            </a>
          ),

          // Horizontal rule
          hr: () => <hr className="border-t-2 border-gray-200 my-4" />,

          // Table
          table: ({ children }) => (
            <div className="overflow-x-auto mb-3">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#336D82] text-white">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="bg-white divide-y divide-gray-200">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-gray-50">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-sm text-gray-700">{children}</td>
          ),
        }}
      >
        {formattedContent}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownRenderer;
