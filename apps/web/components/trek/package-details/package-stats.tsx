import { Altitude, Descent, Elevation } from "@/components/icons";
import { getDifficultySVG } from "@/components/icons/get-difficulty-icon";
import { StatItem } from "@/components/trek/stat-item";
import type { TrekDifficulty } from "@/api/trek/trek.types";

interface StatLeg {
  distanceKm?: number | null;
  time?: string | null;
}

interface PackageStatsProps {
  maxAltitude: number | null;
  ascent: StatLeg | null;
  descent: StatLeg | null;
  difficulty?: TrekDifficulty;
}

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

const formatLeg = ({ distanceKm, time }: StatLeg) =>
  [distanceKm != null ? `${distanceKm.toLocaleString()} km` : null, time || null]
    .filter(Boolean)
    .join(" / ");

// Unpadded glyphs fill their box, so every stat icon shares one box size.
const ICON_SIZE = "30px";
const ICON_PROPS = { height: ICON_SIZE, width: ICON_SIZE, color: "var(--color-primary)", padded: false };

export function PackageStats({ maxAltitude, ascent, descent, difficulty }: PackageStatsProps) {
  const altitude = maxAltitude
    ? `${maxAltitude.toLocaleString()} mt. / ${Math.round(maxAltitude * 3.28084).toLocaleString()} ft`
    : "N/A";
  const ascentValue = ascent ? formatLeg(ascent) : "";
  const descentValue = descent ? formatLeg(descent) : "";

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-6 py-2 lg:grid-flow-col lg:auto-cols-fr">
      <StatItem icon={<Altitude {...ICON_PROPS} />} label="Altitude" value={altitude} />
      {ascentValue && <StatItem icon={<Elevation {...ICON_PROPS} />} label="Ascent" value={ascentValue} />}
      {descentValue && <StatItem icon={<Descent {...ICON_PROPS} />} label="Descent" value={descentValue} />}
      {difficulty && (
        <StatItem
          icon={getDifficultySVG(DIFFICULTY_ICON[difficulty], "34px", "38px")}
          label="Difficulty Level"
          value={DIFFICULTY_LABEL[difficulty]}
        />
      )}
    </div>
  );
}
