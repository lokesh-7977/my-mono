"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { PulseHeart } from "@/components/icons";
import { ThingsToCarryModal } from "@/components/trek/things-to-carry-modal";
import type { TrekDifficulty } from "@/api/trek/trek.types";

const DIFFICULTY_LABEL: Record<TrekDifficulty, string> = {
  EASY: "Easy",
  MODERATE: "Moderate",
  DIFFICULT: "Difficult",
  PRO: "Pro",
};

const fitnessGuideUrl = (difficulty: TrekDifficulty) =>
  `https://blog.scoutripper.com/trek-difficulty-level-${difficulty.toLowerCase()}/`;

interface FitnessSafetySectionsProps {
  trekName: string;
  fitnessInfo?: string | null;
  difficulty?: TrekDifficulty;
}

export function FitnessSafetySections({
  trekName,
  fitnessInfo = null,
  difficulty,
}: FitnessSafetySectionsProps) {
  return (
    <section className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_490px] gap-12 items-start">
        {/* Left: Recommended Fitness */}
        <div className="flex flex-col">
          <h3 className="font-bricolage-grotesque font-bold leading-tight text-xl md:text-heading mb-4">
            <span className="text-primary">Recommended Fitness</span>
            {" "}
            <span className="text-foreground">for {trekName}</span>
          </h3>

          <p className="text-base text-foreground leading-relaxed mb-6">
            {fitnessInfo ?? "Basic cardiovascular fitness is recommended — expect several hours of walking a day on varied terrain."}
          </p>

          {/* Mindset Box */}
          <div className="bg-[#FFF5F1] rounded-2xl p-6 flex items-center gap-5 mb-6">
            <div className="shrink-0">
              <div className="bg-white rounded-full size-18.5 flex items-center justify-center">
                <PulseHeart className="size-10" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[#FA8232] font-bold text-lg">Mindset Matters</span>
              <p className="text-[#FA8232] text-base leading-relaxed font-medium">
                Trekking is about patience and enjoying the journey. With a positive mindset, most people can complete this trek comfortably.
              </p>
            </div>
          </div>

          {difficulty && (
            <Button asChild variant="secondary" className="h-11 flex items-center gap-2 bg-secondary text-foreground font-bold px-6 py-3 rounded-xl w-fit transition-all hover:bg-primary hover:text-primary-foreground group cursor-pointer text-sm">
              <a href={fitnessGuideUrl(difficulty)} target="_blank" rel="noopener noreferrer">
                View {DIFFICULTY_LABEL[difficulty]} Trek Fitness Guide
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          )}
        </div>

        {/* Right: Safety Protocol Card */}
        <div className="bg-zinc-100 h-full rounded-2xl p-7 flex flex-col">
          <div className="flex flex-col">
            <h3 className="font-bricolage-grotesque font-bold leading-tight text-xl md:text-heading mb-4">
              <span className="text-primary">Things to Carry</span>
              {" "}
              <span className="text-foreground">for {trekName}</span>
            </h3>
          </div>
          <p className="text-base leading-relaxed font-bold mb-3">
            Be trek-ready with the right essentials
          </p>
          <p className="text-base font-medium mb-6">
            Every trek requires a basic set of gear to ensure safety, comfort, and enjoyment. Don’t worry — we’ve created a simple, difficulty-based checklist to help you pack smart.
          </p>

          {difficulty && (
            <div className="mt-auto">
              <ThingsToCarryModal btnVariant={"default"} trekName={trekName} difficulty={difficulty} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
