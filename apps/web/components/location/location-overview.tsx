import { MapPin } from "lucide-react";

interface LocationOverviewProps {
  name: string;
  whatToKnow: string;
}

export function LocationOverview({ name, whatToKnow }: LocationOverviewProps) {
  const paragraphs = whatToKnow.split("\n\n");
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP;

  return (
    <section className="pt-10">
      <h2 className="text-title-lg font-bold text-foreground font-bricolage-grotesque mb-4">
        What to know before visiting {name}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-18 items-start">
        <div className="flex flex-col gap-4 pt-2">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-zinc-600 font-medium leading-relaxed">
              {p}
            </p>
          ))}
        </div>

        {mapsApiKey ? (
          // TEMPORARY: queries the Embed API by place name since Location has
          // no lat/lng yet (see apps/docs/checklists/location/location-ancestor-chain-checklist.md).
          // A name-only query can mismatch for an ambiguous/generic name; swap
          // for a coordinate-based query once Location exposes one.
          <iframe
            title={`Map of ${name}`}
            className="w-full h-72 lg:h-full min-h-72 rounded-2xl border border-zinc-200"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/place?key=${mapsApiKey}&q=${encodeURIComponent(name)}`}
          />
        ) : (
          <div className="relative w-full h-72 lg:h-full min-h-72 rounded-2xl bg-zinc-100 border border-zinc-200 flex flex-col items-center justify-center gap-2 text-zinc-400">
            <MapPin className="size-6" />
            <span className="text-xs font-semibold">Map unavailable</span>
          </div>
        )}
      </div>
    </section>
  );
}
