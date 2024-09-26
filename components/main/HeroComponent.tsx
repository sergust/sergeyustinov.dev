import React from "react";
import { Button } from "@/components/ui/button";
import { RoughNotation } from "react-rough-notation";

function HeroComponent() {
  return (
    <section className="w-full flex items-center justify-center md:min-h-[calc(100vh-22rem)]">
      <div className="container px-4 md:px-6 py-12 md:py-24">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2 flex flex-col gap-12 items-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-slate-200 leading-relaxed">
              👋 Hi, I&apos;m Sergey <br className="hidden sm:inline" />
              <span className="block my-2">a Front End Developer</span>
              <span className="block">
                for{" "}
                <RoughNotation
                  type="underline"
                  show={true}
                  color="#10b981"
                  strokeWidth={2}
                  padding={2}
                >
                  startups
                </RoughNotation>
              </span>
            </h1>
            <p className="mx-auto max-w-[700px] text-slate-400 md:text-xl mt-8">
              I help startups build their products and bring them to market on a
              one-time or retainer basis.
            </p>
          </div>
          <div className="mt-8">
            <Button
              className="bg-emerald-300 text-slate-900 hover:bg-emerald-400"
              size="lg"
            >
              Book a call <span className="ml-2">📞</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroComponent;
