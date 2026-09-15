"use client";

import React, { forwardRef } from "react";

export interface CharacterRevealLine {
  words: string[];
}

export interface CharacterRevealProps {
  lines: CharacterRevealLine[];
  className?: string;
  wordClassName?: string;
  charClassName?: string;
}

/**
 * CharacterReveal
 * Progressive typewriter / character-glow reveal.
 * Wraps words to maintain natural line wrapping without breaking words in half.
 */
export const CharacterReveal = forwardRef<HTMLHeadingElement, CharacterRevealProps>(
  ({ lines, className = "", wordClassName = "", charClassName = "" }, ref) => {
    return (
      <h2 ref={ref} className={className}>
        {lines.map((line, lineIdx) => (
          <span key={lineIdx} className="block">
            {line.words.map((word, wordIdx) => (
              <span
                key={wordIdx}
                className={`inline-block whitespace-nowrap ${wordClassName}`}
              >
                {word.split("").map((char, charIdx) => (
                  <span
                    key={charIdx}
                    className={`char-item inline-block ${charClassName}`}
                  >
                    {char}
                  </span>
                ))}
                {wordIdx < line.words.length - 1 && (
                  <span
                    className={`char-item inline-block ${charClassName}`}
                  >
                    &nbsp;
                  </span>
                )}
              </span>
            ))}
          </span>
        ))}
      </h2>
    );
  }
);

CharacterReveal.displayName = "CharacterReveal";

export default CharacterReveal;
