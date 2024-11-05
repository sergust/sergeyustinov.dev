"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Code, Box, Circle, Triangle } from "lucide-react";
import CallToActionLink from "@/components/redesign/call-to-action-link";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  reset(): void;
  update(): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

interface Dimensions {
  width: number;
  height: number;
}

const CodeBlock: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div
    className={`
      code-block
      absolute font-mono text-sm 
      bg-blue-900/20 backdrop-blur-sm rounded-lg 
      px-4 py-3 shadow-lg
      cursor-pointer
      transition-transform
      hover:bg-blue-800/30
      ${className}
    `}
  >
    <div className="flex items-center gap-1.5 mb-2">
      <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
      <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
    </div>
    <div className="text-blue-200/90">{children}</div>
  </div>
);

const FloatingIcon: React.FC<{
  Icon: React.ComponentType<any>;
  className?: string;
}> = ({ Icon, className = "" }) => (
  <div className={`absolute ${className}`}>
    <Icon className="w-6 h-6 text-blue-300/40" />
  </div>
);

const ParticleSystem: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dimensionsRef = useRef<Dimensions>({ width: 0, height: 0 });
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    class ParticleClass implements Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = 0;
        this.y = 0;
        this.size = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.opacity = 0;
        this.reset();
      }

      reset() {
        const { width, height } = dimensionsRef.current;
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        const { width, height } = dimensionsRef.current;
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > width) this.reset();
        if (this.y < 0 || this.y > height) this.reset();
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 163, 184, ${this.opacity})`;
        ctx.fill();
      }
    }

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;

      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      dimensionsRef.current = {
        width: canvas.width,
        height: canvas.height,
      };

      // Reinitialize particles when canvas is resized
      initParticles();
    };

    const initParticles = () => {
      particlesRef.current = Array.from(
        { length: 50 },
        () => new ParticleClass()
      );
    };

    const animate = () => {
      ctx.clearRect(
        0,
        0,
        dimensionsRef.current.width,
        dimensionsRef.current.height
      );

      particlesRef.current.forEach((particle) => {
        particle.update();
        particle.draw(ctx);
      });

      // Draw connections
      particlesRef.current.forEach((particleA) => {
        particlesRef.current.forEach((particleB) => {
          const dx = particleA.x - particleB.x;
          const dy = particleA.y - particleB.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(148, 163, 184, ${
              0.1 * (1 - distance / 100)
            })`;
            ctx.lineWidth = 1;
            ctx.moveTo(particleA.x, particleA.y);
            ctx.lineTo(particleB.x, particleB.y);
            ctx.stroke();
          }
        });
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Initial setup
    resizeCanvas();
    initParticles();
    animate();

    // Add resize listener
    window.addEventListener("resize", resizeCanvas);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []); // Empty dependency array since we're using refs

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.3 }}
    />
  );
};

const AnimatedHero: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="z-0 relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white min-h-[600px] py-20 px-4">
      <ParticleSystem />

      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
      {/* Code snippets with improved positioning and animations */}
      {/* <CodeBlock className="top-[15%] left-[5%] animate-float">
        const mvp = {`{`}
        <br />
        &nbsp;&nbsp;stack: "Next.js + React",
        <br />
        &nbsp;&nbsp;timeline: "14 days"
        <br />
        {`}`};
      </CodeBlock>

      <CodeBlock className="top-[25%] right-[8%] animate-float-delayed">
        const deploy = async () => {`{`}
        <br />
        &nbsp;&nbsp;await buildMVP();
        <br />
        &nbsp;&nbsp;return success;
        <br />
        {`}`};
      </CodeBlock>

      <CodeBlock className="bottom-[20%] left-[12%] animate-float-slow">
        if (needMVP) {`{`}
        <br />
        &nbsp;&nbsp;contact.sergei();
        <br />
        {`}`};
      </CodeBlock> */}

      {/* <CodeBlock className="bottom-[30%] right-[15%] animate-float">
        // Your idea + My code
        <br />
        // = Success 🚀
      </CodeBlock> */}

      <FloatingIcon
        Icon={Code}
        className="top-1/4 left-1/4 animate-spin-slow"
      />
      <FloatingIcon
        Icon={Box}
        className="bottom-1/4 right-1/4 animate-bounce-slow"
      />
      <FloatingIcon Icon={Circle} className="top-1/3 right-1/3 animate-pulse" />
      <FloatingIcon
        Icon={Triangle}
        className="bottom-1/3 left-1/3 animate-float"
      />

      <div className="absolute top-1/4 -left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse-delayed" />

      <div className="container mx-auto text-center relative z-10">
        <div className="inline-block mb-6 animate-fadeIn">
          <div className="flex items-center bg-blue-700/30 rounded-full px-4 py-2 space-x-2 backdrop-blur-sm border border-blue-700/20">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
            <span className="text-sm font-medium">
              Available for New Projects
            </span>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          <span className="relative inline-block">
            Launch
            <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-400/40 -rotate-1 animate-expand" />
          </span>{" "}
          Your Startup in{" "}
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200 animate-gradient">
            14 Days
          </span>
        </h1>

        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-blue-100/80">
          Skip the agency overhead. Work directly with a senior developer who
          brings your vision to life.
        </p>

        <div
          className="relative inline-block group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <CallToActionLink>
            <Button
              size="lg"
              className={`
                relative z-10 bg-white text-blue-800 hover:bg-blue-50 
                transition-all duration-300 transform
                ${isHovered ? "scale-105" : "scale-100"}
              `}
            >
              Schedule Your Free Strategy Call
            </Button>
          </CallToActionLink>
          <div
            className={`
            absolute inset-0 bg-blue-300 filter blur-xl opacity-50 
            transition-all duration-300
            ${isHovered ? "scale-110" : "scale-90"}
          `}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes expand {
          0% {
            width: 0;
          }
          100% {
            width: 100%;
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 6s ease-in-out 2s infinite;
        }

        .animate-float-slow {
          animation: float 8s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }

        .animate-bounce-slow {
          animation: bounce 3s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse 6s ease-in-out infinite;
        }

        .animate-pulse-delayed {
          animation: pulse 6s ease-in-out 3s infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s linear infinite;
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes expand {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        @keyframes float-rotate {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(2deg);
          }
          100% {
            transform: translateY(0) rotate(0deg);
          }
        }

        .code-block {
          animation: float-rotate 10s ease-in-out infinite;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
        }

        .code-block:nth-child(odd) {
          animation-duration: 12s;
          animation-delay: -3s;
        }

        .code-block:nth-child(even) {
          animation-duration: 8s;
          animation-delay: -5s;
        }

        .code-block:hover {
          transform: scale(1.05) translateY(-10px);
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default AnimatedHero;
