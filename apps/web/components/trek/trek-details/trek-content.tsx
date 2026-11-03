"use client";
import { TrekOverviewModal } from "./trek-overview-modal";

interface TrekContentProps {
  trekName?: string;
  description?: string;
  howToReach?: string | null;
}

export function TrekContent({
  trekName = "Kashmir Great Lakes Trek",
  description = "Nestled at an altitude of 15,700 feet, Roopkund is perhaps the most debated and enigmatic trekking destination in India. Famous for the hundreds of human skeletons found at its edge, this high-altitude glacial lake offers more than just macabre mystery.",
  howToReach = null,
}: TrekContentProps) {
  return (

    <section className="border-t border-zinc-200 pt-6">
      <h2 className="text-[26px] font-bold text-foreground mb-4 font-bricolage-grotesque">
        {trekName} Overview
      </h2>
      <div className="prose prose-zinc prose-sm text-foreground max-w-none space-y-8 text-base mb-4">
        <p>{description}</p>
      </div>
      <TrekOverviewModal trekName={trekName} description={description} howToReach={howToReach} />
    </section>

  );
}
