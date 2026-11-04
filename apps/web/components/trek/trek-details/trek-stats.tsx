"use client";

import React from "react";
import { Clock, Elevation, Route } from "@/components/icons";
import { getDifficultySVG } from "@/components/icons/get-difficulty-icon";
import type { TrekDifficulty } from "@/api/trek/trek.types";

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export const StatCard = ({ icon, label, value }: StatItemProps) => (
  <div className="flex flex-col p-4 border border-primary/25 rounded-xl h-full ">
    <div className="mb-3">
      {icon}
    </div>
    <span className="text-xs uppercase">{label}</span>
    <span className="text-base font-bold text-foreground leading-tight">{value}</span>
  </div>
);

export const GradeCard = ({ label = "Grade", value = "Moderate to Difficult" }: { label?: string; value?: string }) => (
  <div className="flex flex-col p-4 border border-magic-green rounded-xl h-full bg-magic-green/5">
    <div className="relative w-12 h-12 mb-2">
      {getDifficultySVG("easy", "44px", "50px")}
    </div>
    <span className="text-xs uppercase ">{label}</span>
    <span className="text-base font-bold text-foreground leading-tight">{value}</span>
  </div>
);

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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <StatCard icon={<Clock height="44px" width="44px" bg="var(--color-primary)" color="white" />} label="Duration" value={`${durationDays} Days`} />
      <StatCard icon={<Route height="44px" width="44px" bg="var(--color-primary)" color="white" />} label="Distinct Routes" value={String(distinctRoutes)} />
      <StatCard icon={<Elevation height="44px" width="44px" bg="var(--color-primary)" color="white" />} label="Altitude" value={altitudeValue} />
      <div className="flex flex-col p-4 border border-magic-green rounded-xl h-full bg-magic-green/5">
        <div className="relative w-12 h-12 mb-2">
          {getDifficultySVG(DIFFICULTY_ICON[difficulty], "44px", "50px")}
        </div>
        <span className="text-xs uppercase">Grade</span>
        <span className="text-base font-bold text-foreground leading-tight">{DIFFICULTY_LABEL[difficulty]}</span>
      </div>
    </div>
  );
}
