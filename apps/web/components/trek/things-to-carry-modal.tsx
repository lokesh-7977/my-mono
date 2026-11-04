"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@repo/ui/lib/utils";
import NavButton from "../shared/nav-button";
import { useCarouselScroll } from "@/hooks/use-carousel-scroll";
import { GEAR_CATEGORIES, SEASONS, seasonToEmoji, getTrekGear, type GearCategoryId } from "@/lib/trek-gear-constants";
import type { TrekDifficulty } from "@/api/trek/trek.types";

interface ThingsToCarryModalProps {
  trekName: string;
  difficulty: TrekDifficulty;
}

export function ThingsToCarryModal({ trekName, difficulty }: ThingsToCarryModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const gear = getTrekGear(difficulty);
  const categories = GEAR_CATEGORIES.filter((category) => (gear[category.id]?.length ?? 0) > 0);
  const [activeCategoryId, setActiveCategoryId] = useState<GearCategoryId | undefined>(categories[0]?.id);

  const { scrollRef, isAtStart, isAtEnd, scrollLeft, scrollRight, checkScrollPosition } = useCarouselScroll(220);
  // Tabs can overflow horizontally once a trek has ~6+ categories (see the
  // legacy app's ThingsToCarryTile) — only show nav arrows when they're
  // actually needed, same pattern as PopularPackages' carousel.
  const hasOverflow = !(isAtStart && isAtEnd);

  const activeItems = activeCategoryId ? (gear[activeCategoryId] ?? []) : [];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mt-1 h-10 flex items-center gap-2 bg-secondary text-foreground font-bold px-5 py-2.5 rounded-xl w-fit transition-all hover:bg-primary hover:text-primary-foreground group cursor-pointer text-[14px]">
          View Checklist
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[95vw] sm:max-w-230 p-9 rounded-3xl gap-0 border-none shadow-2xl">
        <VisuallyHidden>
          <DialogTitle>Things to Carry for {trekName}</DialogTitle>
        </VisuallyHidden>

        {/*
          DialogContent is `display: grid`, and grid/flex items default to
          `min-width: auto` — they refuse to shrink below their content's
          natural width. Without this wrapper (and `min-w-0` on the
          horizontally-scrolling children below), the tabs row and table
          render at their full intrinsic width and spill outside the dialog
          instead of scrolling inside it.
        */}
        <div className="min-w-0">
          <h2 className="text-[26px] font-bold text-foreground mb-1">
            <span className="text-primary">Things to Carry</span> for {trekName}
          </h2>
          <p className="text-base text-zinc-500 mb-6">
            Every trek requires a basic set of gear to ensure safety, comfort, and enjoyment. Here&apos;s a
            difficulty-based checklist to help you pack smart.
          </p>

          {/* Category tabs — horizontally scrollable, with nav arrows only when overflowing */}
          <div className="flex items-center gap-2 mb-5">
            {hasOverflow && (
              <NavButton type="prev" onClick={scrollLeft} disabled={isAtStart} ariaLabel="Scroll categories left" />
            )}

            <div
              ref={scrollRef}
              onScroll={checkScrollPosition}
              className="flex min-w-0 flex-1 gap-2 overflow-x-auto no-scrollbar scroll-smooth"
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategoryId(category.id)}
                  className={cn(
                    "shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer",
                    activeCategoryId === category.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-zinc-100 text-foreground hover:bg-zinc-200",
                  )}
                >
                  <span>{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>

            {hasOverflow && (
              <NavButton type="next" onClick={scrollRight} disabled={isAtEnd} ariaLabel="Scroll categories right" />
            )}
          </div>

          {/* Checklist table */}
          <div className="min-w-0 overflow-x-auto rounded-xl border border-zinc-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Item</th>
                  <th className="px-4 py-3 font-semibold">Quantity</th>
                  <th className="px-4 py-3 font-semibold">Season</th>
                  <th className="px-4 py-3 font-semibold">Why this matters?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {activeItems.map((row, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 font-semibold text-foreground align-top">
                      {row.item}
                      {row.optional && (
                        <span className="ml-2 text-xs font-medium text-zinc-400">Optional</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-foreground align-top">{row.quantity}</td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex gap-1">
                        {row.seasons.map((season) => (
                          <span key={season} title={SEASONS[season].label} className="text-sm">
                            {seasonToEmoji(season)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-600 align-top">{row.whyMatters}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Season legend */}
          <div className="flex items-center gap-3 mt-5 flex-wrap">
            <span className="text-sm font-semibold text-zinc-500">Season tags:</span>
            {Object.values(SEASONS).map((season) => (
              <div
                key={season.key}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full border"
                style={{ borderColor: season.color }}
              >
                <span className="text-xs">{seasonToEmoji(season.key)}</span>
                <span className="text-xs font-medium text-foreground">{season.label}</span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
