"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface InfoCardProps {
  heading: string;
  title: string;
  description: string;
  buttonText: string;
  onClick?: () => void;
  className?: string;
}

const InfoCard = ({ heading, title, description, buttonText, onClick, className }: InfoCardProps) => {
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
      <Button
        onClick={onClick}
        className="mt-1 h-10 flex items-center gap-2 bg-secondary text-foreground font-bold px-5 py-2.5 rounded-xl w-fit transition-all hover:bg-primary hover:text-primary-foreground group cursor-pointer text-[14px]"
      >
        {buttonText}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </div>
  );
};

export function TrekInfoSections() {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
      <div className="grid grid-cols-1 md:grid-cols-3">
        <InfoCard
          heading="Weather Conditions"
          title="for Kashmir Great Lakes Trek"
          description="Triund sits above McLeod Ganj in the Kangra district of Himachal Pradesh. The trek begins either from Dharamkot"
          buttonText="Check Weather"
        />
        <InfoCard
          heading="How to Reach"
          title="Kashmir Great Lakes Trek"
          description="Triund sits above McLeod Ganj in the Kangra district of Himachal Pradesh. The trek begins either from Dharamkot"
          buttonText="View Routes"
        />
        <InfoCard
          heading="Things to Carry"
          title="for Kashmir Great Lakes Trek"
          description="Triund sits above McLeod Ganj in the Kangra district of Himachal Pradesh. The trek begins either from Dharamkot"
          buttonText="View Checklist"
        />
      </div>
    </section>
  );
}
