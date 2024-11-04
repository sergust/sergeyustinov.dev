import React from "react";
import { Logo } from "./logo";

function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-8 px-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <Logo />
        </div>
        <p className="text-center md:text-left text-sm">
          Turning visionary ideas into market-ready products in 14 days or less.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
