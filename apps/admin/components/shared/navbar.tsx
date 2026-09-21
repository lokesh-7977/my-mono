"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bell } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { Button } from "@repo/ui/components/button";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "bg-white sticky top-0 left-0 right-0 z-50 transition-all duration-300 px-5 lg:px-5 h-17 flex items-center border-b border-zinc-200",
        scrolled && "shadow-sm"
      )}
    >
      <div className="w-full max-w-385 mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/scoutripper-logo-dark.png" className="" alt="Logo" width={150} height={44} />
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <Button
            variant="outline"
            size="sm"
            className="h-10 px-6 text-sm rounded-xl border-primary/20 text-foreground font-bold hover:bg-primary/5 hover:border-primary/40 transition-all"
          >
            Save Draft
          </Button>

          <button className="text-primary hover:scale-110 transition-transform">
            <Bell className="size-6 fill-none stroke-[1.5px]" />
          </button>

          <div className="size-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-border/50 cursor-pointer hover:ring-primary/30 transition-all">
            {/* <Image
              src="https://avatar.iran.liara.run/public/30" // High quality placeholder avatar
              alt="User Avatar"
              width={40}
              height={40}
              className="object-cover"
            /> */}
          </div>
        </div>
      </div>
    </nav>
  );
};


