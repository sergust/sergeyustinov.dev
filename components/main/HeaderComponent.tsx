import React from "react";
import Image from "next/image";
import Link from "next/link";

function HeaderComponent() {
  return (
    <header className="sticky top-0 z-50 bg-slate-900 px-4 lg:px-6 h-auto py-4 lg:py-8 flex flex-col sm:flex-row sm:h-14 items-center">
      <div className="flex items-center space-x-4 mb-4 sm:mb-0">
        <Image
          src="https://avatars.githubusercontent.com/u/3471265?v=4"
          alt="Sergey"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex flex-col">
          <span className="font-medium text-slate-200">Sergey Developer</span>
          <div className="inline-flex items-center justify-between rounded-full bg-emerald-300 bg-opacity-20 px-2.5 py-0.5 text-sm font-light text-emerald-300">
            <div>Available now</div>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-300"></span>
            </span>
          </div>
        </div>
      </div>
      <nav className="flex gap-4 sm:gap-6 sm:ml-auto">
        <Link
          className="text-sm font-medium text-slate-400 hover:text-emerald-300 hover:underline underline-offset-4"
          href="#projects"
        >
          Projects
        </Link>
        <Link
          className="text-sm font-medium text-slate-400 hover:text-emerald-300 hover:underline underline-offset-4"
          href="#skills"
        >
          Skills
        </Link>
        <Link
          className="text-sm font-medium text-slate-400 hover:text-emerald-300 hover:underline underline-offset-4"
          href="#contact"
        >
          Contact
        </Link>
      </nav>
    </header>
  );
}

export default HeaderComponent;
