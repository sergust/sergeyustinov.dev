import Link from "next/link";
import { Button } from "../ui/button";
import MobileMenu from "./mobile-menu";
import { Logo } from "./logo";
import React from "react";

export const HeaderComponent: React.FC = () => {
  return (
    <header className="w-full py-4 px-6 flex justify-between items-center bg-slate-50 shadow-sm sticky top-0 z-10">
      <a href="/" className="flex items-center group">
        <Logo />
      </a>

      <nav className="hidden md:flex items-center space-x-6">
        <Link
          href="/portfolio"
          className="text-gray-700 hover:text-indigo-600 transition-colors"
        >
          Portfolio
        </Link>
        <a
          href="/#process"
          className="text-gray-700 hover:text-indigo-600 transition-colors"
        >
          How I Work
        </a>
        <a
          href="/#pricing"
          className="text-gray-700 hover:text-indigo-600 transition-colors"
        >
          Packages
        </a>
        <Link
          href="https://cal.com/sergustinov/15-minutes-chat"
          target="_blank"
          rel="noopener noreferrer"
          referrerPolicy="no-referrer"
        >
          <Button
            variant="outline"
            className="border-indigo-600 text-indigo-600 hover:bg-indigo-600 bg-white"
          >
            Book a Call 📞
          </Button>
        </Link>
      </nav>
      <MobileMenu />
    </header>
  );
};
