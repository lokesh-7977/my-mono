import { MapPin } from "lucide-react";

interface LocationOverviewProps {
  name: string;
  whatToKnow: string;
}

export function LocationOverview({ name, whatToKnow }: LocationOverviewProps) {
  const paragraphs = whatToKnow.split("\n\n");

  return (
    <section className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-title font-bold text-foreground font-bricolage-grotesque mb-6">
        What to know before visiting {name}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
        <div className="flex flex-col gap-4">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-zinc-600 text-sm font-medium leading-relaxed">
              {p}
            </p>
          ))}
        </div>

        {/* Map placeholder: no live map integration yet, see location-page-checklist.md */}
        <div className="relative w-full h-56 lg:h-full min-h-56 rounded-2xl bg-zinc-100 border border-zinc-200 flex flex-col items-center justify-center gap-2 text-zinc-400">
          <MapPin className="size-6" />
          <span className="text-xs font-semibold">Map coming soon</span>
        </div>
      </div>
    </section>
  );
}
