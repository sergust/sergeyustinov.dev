"use client";

import React, { useEffect, useRef, useState } from "react";
import { RoughNotation, RoughNotationProps } from "react-rough-notation";

interface HighlightedTextProps {
  text: string;
  color?: string;
  animationDuration?: number;
  type?: RoughNotationProps["type"];
  strokeWidth?: number;
  padding?: number;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  color = "#10b981",
  animationDuration = 800,
  type = "highlight",
  strokeWidth = 2,
  padding = 2,
}) => {
  const [show, setShow] = useState(false);
  const notationRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShow(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (notationRef.current) {
      observer.observe(notationRef.current);
    }

    return () => {
      if (notationRef.current) {
        observer.unobserve(notationRef.current);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <span ref={notationRef}>
      <RoughNotation
        type={type}
        show={show}
        color={color}
        animationDuration={animationDuration}
        strokeWidth={strokeWidth}
        padding={padding}
      >
        {text}
      </RoughNotation>
    </span>
  );
};

export default HighlightedText;
