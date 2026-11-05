import { Altitude, Clock, Route } from "@/components/icons";
import { getDifficultySVG } from "@/components/icons/get-difficulty-icon";
import { StatItem } from "@/components/trek/stat-item";
import type { TrekDifficulty } from "@/api/trek/trek.types";

const DIFFICULTY_LABEL: Record<TrekDifficulty, string> = {
  EASY: "Easy",
  MODERATE: "Moderate",
  DIFFICULT: "Difficult",
  PRO: "Pro",
};

const DIFFICULTY_ICON: Record<TrekDifficulty, "easy" | "moderate" | "difficult" | "pro"> = {
  EASY: "easy",
  MODERATE: "moderate",
  DIFFICULT: "difficult",
  PRO: "pro",
};

// Unpadded glyphs fill their box, so every stat icon shares one box size.
const ICON_SIZE = "30px";
const ICON_PROPS = { height: ICON_SIZE, width: ICON_SIZE, color: "var(--color-primary)", padded: false };

interface TrekStatsProps {
  durationDays?: number;
  distinctRoutes?: number;
  maxAltitude?: number | null;
  difficulty?: TrekDifficulty;
}

export function TrekStats({
  durationDays = 5,
  distinctRoutes = 2,
  maxAltitude = null,
  difficulty = "MODERATE",
}: TrekStatsProps) {
  const altitudeValue = maxAltitude
    ? `${maxAltitude.toLocaleString()} mt. / ${Math.round(maxAltitude * 3.28084).toLocaleString()} ft`
    : "N/A";

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-6 lg:grid-cols-4 lg:items-center">
      <StatItem icon={<Clock {...ICON_PROPS} />} label="Duration" value={`${durationDays} Days`} />
      <StatItem icon={<Route {...ICON_PROPS} />} label="Distinct Routes" value={String(distinctRoutes)} />
      <StatItem icon={<Altitude {...ICON_PROPS} />} label="Altitude" value={altitudeValue} />
      <div className="flex flex-col gap-3 py-3 px-4 border border-magic-green rounded-xl bg-magic-green/3">
        <div className="h-9 flex items-center">{getDifficultySVG(DIFFICULTY_ICON[difficulty], "40px", "46px")}</div>
        <div className="flex flex-col gap-0.5">
          <span className="text-caption font-lato font-medium uppercase tracking-wide text-foreground/80">Difficulty Level</span>
          <span className="text-base font-bold text-foreground leading-tight">{DIFFICULTY_LABEL[difficulty]}</span>
        </div>
      </div>
    </div>
  );
}
