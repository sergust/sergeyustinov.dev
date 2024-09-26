import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CTAComponentClient from "./CTAComponentClient";

function CTAComponent() {
  return (
    <section
      className="w-full py-12 md:py-24 lg:py-32 bg-slate-900 flex justify-center items-center"
      id="contact"
    >
      <div className="container flex flex-col gap-12 items-center justify-center">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-5xl text-slate-200">
          <CTAComponentClient /> a website or app 👨🏻‍💻
        </h2>
        <p className="mx-auto max-w-[700px] text-slate-400 md:text-xl">
          Feel free to book a call with me to discuss your project or ideas
        </p>

        <div className="flex flex-col gap-4 items-center">
          <Button
            asChild
            className="bg-emerald-300 text-slate-900 hover:bg-emerald-400"
            size="lg"
          >
            <Link href="https://cal.com/sergustinov/15-minutes-chat">
              Book a call <span className="ml-2">📞</span>
            </Link>
          </Button>

          <div className="inline-flex w-fit gap-4 items-center justify-center rounded-full bg-emerald-300 bg-opacity-20 px-2.5 py-0.5 text-sm font-light text-emerald-300">
            <div>Available </div>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-300"></span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTAComponent;
