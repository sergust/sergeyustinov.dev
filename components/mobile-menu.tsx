"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { href: "#our-work", label: "Portfolio" },
    { href: "#process", label: "How I Work" },
    { href: "#pricing", label: "Packages" },
  ];

  return (
    <div className="md:hidden">
      <button
        className="relative z-50 p-2 -mr-2 transition-colors hover:bg-gray-100 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-blue-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-black/20 backdrop-blur-sm z-40
          transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setIsOpen(false)}
      />

      {/* Menu */}
      <div
        className={`
          absolute top-full left-0 right-0 z-40 
          p-4 mt-2 mx-4 bg-white rounded-lg shadow-lg border border-gray-100
          transition-all duration-300 transform
          ${
            isOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }
        `}
      >
        <div className="flex flex-col space-y-4">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:translate-x-1"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}

          <div className="pt-2">
            <Link
              href="https://cal.com/sergustinov/15-minutes-chat"
              target="_blank"
            >
              <Button
                variant="outline"
                className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-600 bg-white"
                onClick={() => setIsOpen(false)}
              >
                Book a Call 📞
              </Button>
            </Link>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center">
              Let's build something amazing together
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
