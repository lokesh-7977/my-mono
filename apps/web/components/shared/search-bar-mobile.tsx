"use client";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import SearchModalMobile from "./search-modal-mobile";

interface SearchBarProps {
  className?: string;
}



export function SearchBarMobile({ className }: SearchBarProps) {
  const [activeTab, setActiveTab] = useState<"Trekking" | "Experiences" | "Locations" | undefined>(undefined);
  const isActive = activeTab !== undefined;
  const containerRef = useRef<HTMLDivElement>(null);

  // Use refs instead of state for values that don't affect the UI to prevent cascading re-renders
  const lastScrollPos = useRef(0);
  const isScrollReady = useRef(false);

  // Record scroll position when tab becomes active and wait for layout shifts to settle
  useEffect(() => {
    if (isActive) {
      lastScrollPos.current = window.scrollY;
      const timer = setTimeout(() => {
        isScrollReady.current = true;
      }, 150);
      return () => clearTimeout(timer);
    } else {
      isScrollReady.current = false;
    }
  }, [isActive]);

  useEffect(() => {
    const handleScroll = () => {
      if (isActive && isScrollReady.current) {
        // Only collapse if the user has scrolled more than 20px
        const currentScroll = window.scrollY;
        if (Math.abs(currentScroll - lastScrollPos.current) > 20) {
          setActiveTab(undefined);
        }
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      // Ignore clicks inside Radix Dialogs or Portals so it doesn't accidentally unmount active state
      if (target.closest('[role="dialog"]') || target.closest('[data-radix-portal]')) {
        return;
      }

      if (containerRef.current && !containerRef.current.contains(target)) {
        setActiveTab(undefined);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isActive]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "sticky top-0 z-40 w-full max-w-[1100px] mx-auto py-2 max-[800px]:w-[85%] max-sm:w-[92%]",
        className,
        isActive ? "max-sm:w-full pt-0" : "max-sm:w-[92%]"
      )}
    >
      <div className={cn("shadow-[0_8px_40px_rgba(0,0,0,0.12)] overflow-hidden", isActive ? "rounded-none py-5 bg-gray-100" : "bg-white rounded-[35px]")}>
        {isActive && <div className="w-[90%] mx-auto">
          <SearchModalMobile activeTab={activeTab} onActiveTabChange={setActiveTab}>
            <button className={cn("w-full border text-left px-4 text-foreground/50 leading-none py-3 rounded-full bg-white")}>
              <Search className="inline-block size-5 mr-2" />
              Search trek
            </button>
          </SearchModalMobile>
        </div>}
        <div className={cn("flex flex-row items-stretch pb-0 mx-auto", isActive ? "w-[92%]" : "w-full")}>


          <div onClick={() => setActiveTab("Trekking")} className={cn("flex-1 py-5 flex flex-col items-center justify-between", activeTab === "Trekking" && "border-b-2 border-primary")}>
            <Image src={'/backpack.svg'} alt="backpack" width={30} height={30} className="my-auto" />
            <span className="text-xs font-bold">Treks</span>
          </div>

          <div onClick={() => setActiveTab("Experiences")} className={cn("flex-1 cursor-pointer py-5 flex flex-col items-center justify-between", activeTab === "Experiences" && "border-b-2 border-primary")}>
            <Image src={'/goggles.svg'} alt="backpack" width={30} height={30} className="my-auto" />
            <span className="text-xs font-bold">Experiences</span>
          </div>

          <div onClick={() => setActiveTab("Locations")} className={cn("flex-1 cursor-pointer py-5 flex flex-col items-center justify-between", activeTab === "Locations" && "border-b-2 border-primary")}>
            <Image src={'/map-pin.svg'} alt="backpack" width={30} height={36} className="my-auto" />
            <span className="text-xs font-bold">Destinations</span>
          </div>

        </div>
      </div>
    </div>
  );
}
