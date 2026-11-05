"use client";
import { TrekOverviewModal } from "./trek-overview-modal";

interface TrekContentProps {
  trekName?: string;
  description?: string;
  summary?: string | null;
}

export function TrekContent({
  summary = null,
  trekName = "Kashmir Great Lakes Trek",
  description = "Nestled at an altitude of 15,700 feet, Roopkund is perhaps the most debated and enigmatic trekking destination in India. Famous for the hundreds of human skeletons found at its edge, this high-altitude glacial lake offers more than just macabre mystery.",
}: TrekContentProps) {
  return (

    <section className="pt-6">
      <h2 className="text-heading font-bold text-foreground mb-4 font-bricolage-grotesque">
        {trekName} Overview
      </h2>
      <div className="prose prose-zinc prose-sm text-foreground max-w-none space-y-8 text-base mb-4">
        <p className="line-clamp-3 whitespace-pre-line">{description}</p>
      </div>
      <TrekOverviewModal trekName={trekName} description={description} summary={summary} />
    </section>

  );
}
