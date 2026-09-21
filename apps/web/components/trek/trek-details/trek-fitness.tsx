"use client";

import React from "react";
import { Heart, ArrowRight } from "lucide-react";
import { Button } from "@repo/ui/components/button";

export function TrekFitness() {
  return (
    <div className="flex flex-col gap-8 mt-16 mb-20">
      <div className="flex flex-col gap-4">
        <h2 className="text-[28px] font-bold text-[#0F3D3A] font-bricolage-grotesque">
          Recommended Fitness for Kashmir Great Lakes Trek
        </h2>
        <p className="text-[15px] text-zinc-500 font-medium leading-[1.7]">
          This trek generally requires <span className="text-[#0F3D3A] font-bold">Easy fitness</span> and is suitable for beginners or first-time trekkers. Expect shorter walking hours, gentle trails, and a comfortable pace.
        </p>
      </div>

      <div className="p-8 rounded-[24px] bg-[#F3FAF9] border border-primary/20 flex items-start gap-6 shadow-sm">
        <div className="shrink-0 mt-1">
          <Heart className="size-8 text-primary fill-primary/10" />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-[#0F3D3A] font-bricolage-grotesque">
            Mindset Matters
          </h3>
          <p className="text-[14px] text-zinc-600 font-medium leading-relaxed">
            Trekking is about patience and enjoying the journey. With a positive mindset, most people can complete easy treks comfortably.
          </p>
        </div>
      </div>

      <Button className="w-fit h-14 rounded-2xl bg-primary hover:bg-[#3ba4a2] text-white px-10 text-base font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
        View Easy Treks Fitness Guide
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}
