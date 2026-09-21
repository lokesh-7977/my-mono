"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PulseHeart } from "@/components/icons";
export function FitnessSafetySections() {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_490px] gap-12 items-start">
        {/* Left: Recommended Fitness */}
        <div className="flex flex-col">
          <h3 className="font-bricolage-grotesque font-bold leading-tight text-xl md:text-[26px] mb-4">
            <span className="text-primary">Recommended Fitness</span>
            {" "}
            <span className="text-foreground">for Kashmir Great Lakes Trek</span>
          </h3>

          <p className="text-base text-foreground leading-relaxed mb-6">
            This trek generally requires Easy fitness and is suitable for beginners or first-time trekkers. Expect shorter walking hours, gentle trails, and a comfortable pace.
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
                Trekking is about patience and enjoying the journey. With a positive mindset, most people can complete easy treks comfortably.
              </p>
            </div>
          </div>

          <Button className="h-11 flex items-center gap-2 bg-secondary text-foreground font-bold px-6 py-3 rounded-xl w-fit transition-all hover:bg-primary hover:text-primary-foreground group cursor-pointer text-sm">
            View Easy Trek Fitness Guide
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Right: Safety Protocol Card */}
        <div className="bg-zinc-100 h-full rounded-2xl p-7 flex flex-col">
          <div className="flex flex-col">
            <h3 className="font-bricolage-grotesque font-bold leading-tight text-xl md:text-[26px] mb-4">
              <span className="text-primary">Things to Carry</span>
              {" "}
              <span className="text-foreground">for Kashmir Great Lakes Trek</span>
            </h3>
          </div>
          <p className="text-base leading-relaxed font-bold mb-3">
            Be trek-ready with the right essentials
          </p>
          <p className="text-base font-medium mb-6">
            Every trek requires a basic set of gear to ensure safety, comfort, and enjoyment. Don’t worry — we’ve created a simple, difficulty-based checklist to help you pack smart.
          </p>

          <Button className="h-11 text-sm w-fit px-5 rounded-xl mt-auto">
            View Checklist <ArrowRight className="size-4.5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
