"use client";

import React, { useEffect, useRef, useState } from "react";
import { RoughNotation } from "react-rough-notation";
import { usePathname } from 'next/navigation';
import HeroContent from "./HeroContent";

function HeroComponent() {
  const [show, setShow] = useState(false);
  const notationRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
        } else {
          setShow(false);
        }
      },
      { threshold: 0.1 }
    );

    if (notationRef.current) {
      observer.observe(notationRef.current);
    }

    // Reset animation when pathname changes
    setShow(false);
    setTimeout(() => setShow(true), 100);

    return () => {
      if (notationRef.current) {
        observer.unobserve(notationRef.current);
      }
      observer.disconnect();
    };
  }, [pathname]); // Re-run effect when pathname changes

  return (
    <HeroContent>
      <span ref={notationRef}>
        for{" "}
        <RoughNotation
          type="underline"
          show={show}
          color="#10b981"
          strokeWidth={2}
          padding={2}
        >
          startups
        </RoughNotation>
      </span>
    </HeroContent>
  );
}

export default HeroComponent;