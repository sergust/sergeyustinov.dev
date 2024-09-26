import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import TestimonialsAvatars from "../TestimonialsAvatars";

function HeroContent({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full flex items-center justify-center md:min-h-[calc(100vh-22rem)]">
      <div className="container px-4 md:px-6 py-12 md:py-24">
        <div className="flex flex-col gap-8 items-center justify-center space-y-4 text-center">
          <div className="space-y-2 flex flex-col gap-12 items-center">
            <h1 className="text-3xl font-extrabold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-slate-200 leading-relaxed">
              👋 Hi, I&apos;m Sergey <br className="hidden sm:inline" />
              <span className="block my-2">a Front End Developer</span>
              <span className="block">{children}</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-slate-400 md:text-xl mt-8">
              I help startups build their products and bring them to market on a
              one-time or retainer basis.
            </p>
          </div>
          <div className="mt-8">
            <Button
              asChild
              className="bg-emerald-300 text-slate-900 hover:bg-emerald-400"
              size="lg"
            >
              <Link href="https://cal.com/sergustinov/15-minutes-chat">
                Book a call <span className="ml-2">📞</span>
              </Link>
            </Button>
          </div>
          {/* Remove until come up with a label */}
          {/* <TestimonialsAvatars /> */}
        </div>
      </div>
    </section>
  );
}

export default HeroContent;
