import Link from "next/link";
import React from "react";
import { GithubIcon, Twitter } from "lucide-react";

function FooterComponent() {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-slate-800">
      <p className="text-xs text-slate-400 text-center sm:text-left">
        © 2024 Sergey Ustinov. All rights reserved.
      </p>
      <nav className="flex gap-4 sm:gap-6 sm:ml-auto justify-center sm:justify-start mt-2 sm:mt-0">
        <Link
          className="text-xs text-slate-400 hover:text-emerald-300 hover:underline underline-offset-4"
          href="https://x.com/brokkoli_borsch"
        >
          <Twitter size={16} />
        </Link>
        <Link
          className="text-xs text-slate-400 hover:text-emerald-300 hover:underline underline-offset-4"
          href="https://github.com/sergust"
        >
          <GithubIcon size={16} />
        </Link>
      </nav>
    </footer>
  );
}

export default FooterComponent;
