import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

interface PackageProviderProps {
  name: string;
  avatarUrl?: string | null;
  badges?: string[];
  experienceYears?: number | null;
  rating?: number | null;
  reviewCount?: number | null;
  quote?: string | null;
}

const BADGE_TONE: Record<string, string> = {
  "Eco Certified": "bg-emerald-50 text-emerald-700 border-emerald-100",
  "IMF Certified": "bg-orange-50 text-orange-700 border-orange-100",
};
const NEUTRAL_BADGE_TONE = "bg-zinc-50 text-zinc-600 border-zinc-100";

const compactNumber = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

export function PackageProvider({
  name,
  avatarUrl = null,
  badges = [],
  experienceYears = null,
  rating = null,
  reviewCount = null,
  quote = null,
}: PackageProviderProps) {
  const meta = [
    experienceYears != null ? <span key="years">{experienceYears} Yrs</span> : null,
    rating != null ? (
      <span key="rating" className="flex items-center gap-1">
        <Star className="size-3 fill-yellow-400 text-yellow-400" />
        {rating.toFixed(1)}
      </span>
    ) : null,
    reviewCount != null ? <span key="reviews">{compactNumber.format(reviewCount)} Reviews</span> : null,
  ].filter(Boolean);

  return (
    <section className="rounded-2xl border border-zinc-200 p-5 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-zinc-200">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={name} fill className="object-cover" />
          ) : (
            <span className="flex size-full items-center justify-center text-sm font-bold text-zinc-500">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <h3 className="text-base font-bold text-foreground leading-tight">{name}</h3>
          {(badges.length > 0 || meta.length > 0) && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className={cn("px-2.5 py-0.5 rounded-full border text-xs font-semibold", BADGE_TONE[badge] ?? NEUTRAL_BADGE_TONE)}
                >
                  {badge}
                </span>
              ))}
              {meta.length > 0 && (
                <div className="flex items-center gap-2 text-xs font-medium text-foreground/50">
                  {meta.map((item, index) => (
                    <span key={index} className="flex items-center gap-2">
                      {index > 0 && <span className="size-1 rounded-full bg-zinc-300" />}
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {quote && <p className="text-sm italic text-foreground/70 leading-relaxed">&quot;{quote}&quot;</p>}
    </section>
  );
}
