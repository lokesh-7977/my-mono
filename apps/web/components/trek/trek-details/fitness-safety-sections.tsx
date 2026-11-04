"use client";

import { FileText, Shield, ArrowRight } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { PulseHeart, MedicalBriefcase } from "@/components/icons";
import type { TrekDifficulty } from "@/api/trek/trek.types";

const FITNESS_GUIDE_SLUG: Record<TrekDifficulty, string> = {
  EASY: "easy",
  MODERATE: "moderate",
  DIFFICULT: "difficult",
  PRO: "pro",
};

const fitnessGuideUrl = (difficulty: TrekDifficulty) =>
  `https://blog.scoutripper.com/trek-difficulty-level-${FITNESS_GUIDE_SLUG[difficulty]}/`;

interface FitnessSafetySectionsProps {
  trekName?: string;
  fitnessInfo?: string | null;
  safetyInfo?: string | null;
  difficulty?: TrekDifficulty;
}

export function FitnessSafetySections({
  trekName = "Kashmir Great Lakes Trek",
  fitnessInfo = null,
  safetyInfo = null,
  difficulty = "MODERATE",
}: FitnessSafetySectionsProps) {
  return (
    <section className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_590px] gap-12 items-start">
        {/* Left: Recommended Fitness */}
        <div className="flex flex-col">
          <h3 className="font-bricolage-grotesque font-bold leading-tight text-xl md:text-[26px] mb-4">
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

          <Button asChild variant="secondary" className="h-11 flex items-center gap-2 bg-secondary text-foreground font-bold px-6 py-3 rounded-xl w-fit transition-all hover:bg-primary hover:text-primary-foreground group cursor-pointer text-sm">
            <a href={fitnessGuideUrl(difficulty)} target="_blank" rel="noopener noreferrer">
              View Trek Fitness Guide
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>

        {/* Right: Safety Protocol Card */}
        <div className="bg-[#FF5C5C] h-full rounded-2xl p-6 flex flex-col text-white shadow-lg shadow-red-500/10">
          <div className="flex items-center gap-3 mb-4">
            <MedicalBriefcase className="size-6 text-white" />
            <h3 className="text-2xl font-bold">Safety Protocol</h3>
          </div>

          <p className="text-white text-sm mb-5 leading-relaxed">
            {safetyInfo ?? "Follow your trek leader's guidance closely and report any symptoms of altitude sickness immediately."}
          </p>

          <div className="flex flex-col gap-3">
            <div className="bg-black/10 rounded-xl p-5 flex items-center gap-3 cursor-pointer">
              <FileText className="size-4 text-white/80" />
              <span className="text-xs font-semibold leading-none">Forest Permit & Entry Guidelines</span>
            </div>
            <div className="bg-black/10 rounded-xl p-5 flex items-center gap-3 cursor-pointer">
              <Shield className="size-4 text-white/80" />
              <span className="text-xs font-semibold leading-none">High Altitude Rescue Insurance</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
