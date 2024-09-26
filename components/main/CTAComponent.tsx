import React from "react";
import { Button } from "@/components/ui/button";
function CTAComponent() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-800">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-5xl text-slate-200">
              Let&apos;s build a website or app
            </h2>
            <p className="mx-auto max-w-[700px] text-slate-400 md:text-xl">
              Feel free to book a call with me to discuss your project or ideas.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2 flex flex-col items-center gap-4">
            <Button
              type="submit"
              className="bg-emerald-300 text-slate-900 hover:bg-emerald-400"
            >
              Book a call
            </Button>

            <div className="inline-flex w-fit gap-4 align-middle items-center justify-between rounded-full bg-emerald-300 bg-opacity-20 px-2.5 py-0.5 text-sm font-light text-emerald-300">
              <div>Available </div>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-300"></span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTAComponent;
