"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { Button } from "@repo/ui/components/button";
import { ThingsToCarryModal } from "@/components/trek/things-to-carry-modal";
import { HowToReachModal } from "@/components/trek/how-to-reach-modal";
import { MOCK_HOW_TO_REACH } from "@/lib/how-to-reach-mock";
import { WeatherModal } from "@/components/trek/weather-modal";
import { MOCK_TREK_WEATHER } from "@/lib/weather-mock";
import type { TrekDifficulty } from "@/api/trek/trek.types";

interface InfoCardProps {
  heading: string;
  title: string;
  description: string;
  buttonText: string;
  onClick?: () => void;
  trigger?: React.ReactNode;
  className?: string;
}

const InfoCard = ({ heading, title, description, buttonText, onClick, trigger, className }: InfoCardProps) => {
  return (
    <div className={cn("flex flex-col gap-5 p-6 md:px-8 md:border-r border-zinc-200 last:border-r-0", className)}>
      <div className="flex flex-col gap-2">
        <span className="text-primary font-bold text-xl md:text-[26px] leading-none">
          {heading}
        </span>
        <h3 className="text-[26px] font-bold text-foreground leading-none font-bricolage-grotesque">
          {title}
        </h3>
      </div>
      <p className="text-base text-foreground leading-relaxed max-w-[95%] line-clamp-2 -mt-1.5">
        {description}
      </p>
      {trigger ?? (
        <Button
          onClick={onClick}
          className="mt-1 h-10 flex items-center gap-2 bg-secondary text-foreground font-bold px-5 py-2.5 rounded-xl w-fit transition-all hover:bg-primary hover:text-primary-foreground group cursor-pointer text-[14px]"
        >
          {buttonText}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Button>
      )}
    </div>
  );
};

interface TrekInfoSectionsProps {
  trekName?: string;
  howToReach?: string | null;
  permitInfo?: string | null;
  difficulty?: TrekDifficulty;
}

export function TrekInfoSections({
  trekName = "Kashmir Great Lakes Trek",
  howToReach = null,
  permitInfo = null,
  difficulty = "MODERATE",
}: TrekInfoSectionsProps) {
  return (
    <section className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
      <div className="grid grid-cols-1 md:grid-cols-3">
        <InfoCard
          heading="Weather Conditions"
          title={`for ${trekName}`}
          description="Check seasonal weather patterns before you set out, since conditions in the Himalayas can shift quickly."
          buttonText="Check Weather"
          trigger={<WeatherModal trekName={trekName} weather={MOCK_TREK_WEATHER} />}
        />
        <InfoCard
          heading="How to Reach"
          title={trekName}
          description={howToReach ?? "Reach-route details for this trek haven't been published yet."}
          buttonText="View Routes"
          trigger={<HowToReachModal trekName={trekName} options={MOCK_HOW_TO_REACH} />}
        />
        <InfoCard
          heading="Things to Carry"
          title={`for ${trekName}`}
          description={permitInfo ?? "A standard packing checklist applies — warm layers, sturdy boots, and rain protection."}
          buttonText="View Checklist"
          trigger={<ThingsToCarryModal trekName={trekName} difficulty={difficulty} />}
        />
      </div>
    </section>
  );
}
