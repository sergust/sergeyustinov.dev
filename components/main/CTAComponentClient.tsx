"use client";

import React, { useEffect, useRef, useState } from "react";
import { RoughNotation } from "react-rough-notation";

const CTAComponentClient = () => {
  const [show, setShow] = useState(false);
  const notationRef = useRef(null);

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
        type="highlight"
        show={show}
        color="#10b981"
        animationDuration={800}
      >
        Let&apos;s build
      </RoughNotation>
    </span>
  );
};

export default CTAComponentClient;
