"use client";

import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import NavButton from "@/components/shared/nav-button";
import { useCarouselScroll } from "@/hooks/use-carousel-scroll";

interface CarouselSectionProps {
  title: string;
  subtitle?: string;
  scrollAmount?: number;
  children: ReactNode;
}

export function CarouselSection({ title, subtitle, scrollAmount = 350, children }: CarouselSectionProps) {
  const { scrollRef, isAtStart, isAtEnd, scrollLeft, scrollRight, checkScrollPosition } = useCarouselScroll(scrollAmount);

  return (
    <section className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-10 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <h2 className="text-2xl font-bold text-foreground font-bricolage-grotesque leading-tight">
              {title}
            </h2>
            {/* No listing route exists yet, so this has nowhere to navigate to. */}
            <Button className="h-9 px-4 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white cursor-pointer text-xs font-semibold transition-all group">
              View All
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
          {subtitle && <p className="text-sm text-zinc-400 font-medium mt-1">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <NavButton onClick={scrollLeft} type="prev" disabled={isAtStart} ariaLabel="Previous" />
          <NavButton onClick={scrollRight} type="next" disabled={isAtEnd} ariaLabel="Next" />
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={checkScrollPosition}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>
    </section>
  );
}
