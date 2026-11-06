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
  "Eco Certified": "bg-magic-green/15 text-emerald-700",
  "IMF Certified": "bg-orange-50 text-orange-600",
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
    <section className="w-full px-2">
      <div className="rounded-2xl border border-zinc-200 p-6 flex flex-col gap-4 shadow-lg shadow-black/3">
        <div className="flex items-center gap-5">
          <div className="relative size-16.5 shrink-0 overflow-hidden rounded-lg bg-zinc-200">
            {avatarUrl ? (
              <Image src={avatarUrl} alt={name} fill className="object-cover" />
            ) : (
              <span className="flex size-full items-center justify-center text-sm font-bold text-zinc-500">
                {name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-2">
            <h3 className="text-lg font-bold text-foreground leading-tight">{name}</h3>
            {(badges.length > 0 || meta.length > 0) && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                {badges.map((badge) => (
                  <span
                    key={badge}
                    className={cn("px-2.5 py-0.5 h-6 flex items-center rounded-full text-xs font-semibold", BADGE_TONE[badge] ?? NEUTRAL_BADGE_TONE)}
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

        {quote && <p className="text-base font-lato italic text-foreground/80">&quot;{quote}&quot;</p>}
      </div>
    </section>

  );
}
