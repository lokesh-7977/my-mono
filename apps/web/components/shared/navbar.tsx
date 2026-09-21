"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { MagicMountainIcon } from "../icons";

const navLinks = [
  { name: "Trek", href: "/treks" },
  { name: "Experience", href: "/experiences" },
  { name: "Cleanup Drive", href: "/cleanup-drive" },
  { name: "Memories", href: "/memories" },
  { name: "Trekking Gears", href: "/gears" },
  { name: "Resources", href: "/resources" },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white w-full">
      <div className="w-full max-w-[1540px] mx-auto px-5 lg:px-5 flex items-center justify-between h-22.5">
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center">
            <Image src="/scoutripper-logo-dark.png" className="" alt="Logo" width={150} height={44} />
          </Link>
          <button
            className="hidden lg:flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-magic-green transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              border: '2.4px solid transparent',
              background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #4EC5C1 0%, #28BF70 100%) border-box',
            }}
          >
            <MagicMountainIcon className="size-5 text-magic-green" />
            Ask Genie
          </button>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/community"
            className="bg-primary hover:bg-primary-500 text-white rounded-lg px-6 py-2.5 text-sm font-semibold transition-colors duration-200"
          >
            Join a Community
          </Link>
          <Link
            href="/login"
            className="border border-primary text-primary rounded-lg px-6 py-2.5 text-sm font-semibold hover:bg-primary hover:text-white transition-colors duration-200"
          >
            Login
          </Link>
        </div>

        {/* Mobile */}
        <div className="lg:hidden flex items-center gap-3">
          <button
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-bold text-zinc-800 transition-all active:scale-[0.95]"
            style={{
              border: '2.4px solid transparent',
              background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #4EC5C1 0%, #28BF70 100%) border-box',
            }}
          >
            {/* <Sparkles className="w-3.5 h-3.5 text-[#4EC5C1]" /> */}
            <MagicMountainIcon className="w-3.5 h-3.5 text-[#4EC5C1]" />
            Genie
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 text-zinc-700"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-zinc-100 p-5 shadow-lg">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-base font-medium text-zinc-700 py-2.5 px-3 rounded-lg hover:bg-zinc-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-zinc-100">
            <Link
              href="/community"
              className="bg-[#4EC5C1] text-white text-center rounded-lg py-3 text-base font-semibold"
            >
              Join a Community
            </Link>
            <Link
              href="/login"
              className="border border-zinc-300 text-zinc-700 text-center rounded-lg py-3 text-base font-semibold"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
