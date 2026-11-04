"use client";

import { useState } from "react";
import { ArrowRight, Sun } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@repo/ui/lib/utils";
import { monthLabel, type TrekWeatherData, type WeatherRiskLevel } from "@/lib/weather-mock";

interface WeatherModalProps {
  trekName: string;
  weather: TrekWeatherData;
}

const RISK_STYLES: Record<WeatherRiskLevel, string> = {
  LOW: "text-emerald-600",
  MODERATE: "text-amber-600",
  HIGH: "text-primary",
};

const RISK_LABEL: Record<WeatherRiskLevel, string> = {
  LOW: "Low",
  MODERATE: "Moderate",
  HIGH: "High",
};

// Expects data in the shape proposed in
// apps/docs/weather-conditions-modal-checklist.md — currently fed from a
// temporary mock (see apps/web/lib/weather-mock.ts) until that backend
// work ships. `climate` and `current` are both nullable in the real
// contract (unpublished trek / provider outage), handled below.
export function WeatherModal({ trekName, weather }: WeatherModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { climate, current } = weather;

  const highs = climate?.monthly.map((m) => m.avgHighC) ?? [];
  const minHigh = Math.min(...highs);
  const maxHigh = Math.max(...highs);
  const range = maxHigh - minHigh || 1;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mt-1 h-10 flex items-center gap-2 bg-secondary text-foreground font-bold px-5 py-2.5 rounded-xl w-fit transition-all hover:bg-primary hover:text-primary-foreground group cursor-pointer text-sm">
          Check Weather
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[95vw] sm:max-w-212.5 p-9 rounded-3xl gap-0 border-none shadow-2xl">
        <VisuallyHidden>
          <DialogTitle>Weather Conditions for {trekName}</DialogTitle>
        </VisuallyHidden>

        <div className="min-w-0">
          <h2 className="text-heading font-bold text-foreground mb-1">
            <span className="text-primary">Weather Conditions</span> for {trekName}
          </h2>
          <p className="text-base text-zinc-500 mb-6">
            Mountain weather shifts quickly — use this as a general seasonal guide, not a substitute for a live
            forecast closer to your trek date.
          </p>

          {!climate ? (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-center text-zinc-500">
              Climate data for this trek hasn&apos;t been published yet.
            </div>
          ) : (
            <div className="rounded-2xl bg-zinc-100/60 p-6">
              {/* Header row: title + ideal window on the left, risk badges on the right */}
              <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Climate &amp; Conditions</h3>
                  <p className="text-sm text-zinc-500 mt-0.5">Ideal window: {climate.idealWindow}</p>
                </div>
                <div className="flex items-start text-right divide-x divide-zinc-300">
                  <div className="pr-6">
                    <span className="block text-caption font-semibold text-zinc-400 uppercase tracking-wide">
                      Snow Risk
                    </span>
                    <span className={cn("text-sm font-bold", RISK_STYLES[climate.snowRisk])}>
                      {RISK_LABEL[climate.snowRisk]}
                    </span>
                  </div>
                  <div className="pl-6">
                    <span className="block text-caption font-semibold text-zinc-400 uppercase tracking-wide">
                      Rain Risk
                    </span>
                    <span className={cn("text-sm font-bold", RISK_STYLES[climate.rainRisk])}>
                      {RISK_LABEL[climate.rainRisk]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Chart sits on its own white card, distinct from the outer gray panel */}
              <div className="bg-white rounded-xl p-5">
                {/* Lightweight CSS bar chart — no charting dependency needed for this mockup.
                    Bar color opacity scales with relative value (heatmap-style), matching the
                    Figma reference, instead of a flat color for every bar. */}
                <div className="flex items-end gap-3 h-32">
                  {climate.monthly.map((m) => {
                    const normalized = (m.avgHighC - minHigh) / range;
                    const opacity = 0.35 + normalized * 0.65;

                    return (
                      <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <span className="text-xs font-semibold text-foreground">{m.avgHighC}°</span>
                        <div
                          className="w-full rounded-t-md bg-primary"
                          style={{
                            height: `${Math.max(normalized * 100, 12)}%`,
                            opacity,
                          }}
                        />
                        <span className="text-caption font-semibold text-zinc-400 uppercase">
                          {monthLabel(m.month)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-end justify-between gap-4 flex-wrap mt-5">
                <div className="max-w-md">
                  <p className="text-sm font-bold text-foreground">Prime Window: {climate.idealWindow}</p>
                  <p className="text-sm text-foreground mt-1">{climate.primeWindowNote}</p>
                </div>

                {current && (
                  <div className="flex items-center gap-2 bg-primary text-white rounded-full px-4 py-2 text-sm shrink-0">
                    <Sun className="size-4" />
                    Current: {current.temperatureC}°C {current.condition}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
