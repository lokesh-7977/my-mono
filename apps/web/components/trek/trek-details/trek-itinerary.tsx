"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Mountain,
  ArrowRight,
  Car,
  Route,
  Download,
} from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import type { TrekRoute } from "@/api/trek/trek.types";

interface TrekItineraryProps {
  trekName?: string;
  routes?: TrekRoute[];
  fallbackImage?: string | null;
}

export function TrekItinerary({
  trekName = "Kashmir Great Lakes",
  routes = [],
  fallbackImage = null,
}: TrekItineraryProps) {
  const [activeRouteId, setActiveRouteId] = useState<string | undefined>(routes[0]?.id);

  if (routes.length === 0) {
    return (
      <section className="border-t border-zinc-200 pt-6">
        <h2 className="text-[26px] font-bold text-foreground font-bricolage-grotesque mb-4">
          {trekName} Itinerary
        </h2>
        <p className="text-base text-zinc-500">
          The day-by-day itinerary for this trek hasn&apos;t been published yet.
        </p>
      </section>
    );
  }

  const activeRoute = routes.find((route) => route.id === activeRouteId) ?? routes[0];
  const itineraryDays = activeRoute?.itineraryDays ?? [];

  return (
    <section className="border-t border-zinc-200 pt-6">
      <h2 className="text-[26px] font-bold text-foreground font-bricolage-grotesque mb-8">
        {trekName} Itinerary
      </h2>

      {/* Route Selection Tabs */}
      {routes.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {routes.map((route, index) => (
            <div
              onClick={() => setActiveRouteId(route.id)}
              key={route.id}
              className={cn("px-4 py-3 rounded-xl gap-1 text-foreground flex flex-col items-center justify-center text-center cursor-pointer border border-primary",
                activeRouteId === route.id ? "bg-primary/10 border-primary" : "bg-zinc-100 border-zinc-100",
                "hover:bg-primary/10 transition-all duration-100"
              )}>
              <span className="text-xs font-semibold">Route 0{index + 1}</span>
              <span className="text-sm font-bold font-bricolage-grotesque">{route.name}</span>
              <span className="text-xs font-medium opacity-70">
                {route.distanceKm ? `${route.distanceKm} KM` : "Distance N/A"}
                {route.difficulty && (
                  <>
                    <span className="mx-1">•</span> {route.difficulty}
                  </>
                )}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Timeline Section */}
      {itineraryDays.length > 0 ? (
        <div className="relative flex flex-col gap-9.5 mt-10">
          {/* Continuous Vertical Line */}
          <div className="absolute left-0.75 top-0 w-0.5 bg-zinc-100 h-full" />

          {itineraryDays.map((day) => {
            const image = day.imageUrls[0] ?? fallbackImage;

            return (
              <div key={day.id} className="relative pl-10 flex flex-col gap-10 md:flex-row pt-4">
                {/* Timeline Dot */}
                <div className="absolute -left-0.5 top-1 size-3 rounded-full bg-primary ring-4 ring-zinc-100 z-10 mt-1" />

                <div className="flex-1 flex flex-col">
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-bold text-primary uppercase tracking-wide">
                      DAY {String(day.dayNumber).padStart(2, "0")}
                    </span>
                    <h3 className="text-[20px] font-bold text-foreground leading-tight">
                      {day.title}
                    </h3>
                  </div>

                  {/* Day Badges */}
                  <div className="flex items-center gap-3 flex-wrap mt-2">
                    {day.altitude && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-100 text-xs font-bold text-zinc-500">
                        <Mountain className="size-3" />
                        {day.altitude.toLocaleString()} FT
                      </div>
                    )}
                    {day.duration && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-100 text-xs font-bold text-zinc-500">
                        <Car className="size-3" />
                        {day.duration}
                      </div>
                    )}
                    {day.distanceKm && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-100 text-xs font-bold text-zinc-500">
                        <Route className="size-3" />
                        {day.distanceKm} KM
                      </div>
                    )}
                  </div>

                  {day.description && (
                    <p className="text-base mt-4 text-foreground leading-relaxed font-medium line-clamp-1">
                      {day.description}
                    </p>
                  )}
                </div>

                {image && (
                  <div className="shrink-0 size-40 relative rounded-2xl overflow-hidden shadow-sm group cursor-pointer">
                    <Image
                      src={image}
                      alt={day.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-base text-zinc-500 mt-8">
          Day-by-day details for this route haven&apos;t been published yet.
        </p>
      )}

      {/* Footer Actions */}
      {itineraryDays.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8">
          <Button className="w-full sm:w-auto px-6 h-12 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white cursor-pointer text-base font-semibold transition-all">
            View Full {itineraryDays.length} Day Itinerary
            <ArrowRight className="size-4.5 ml-2" />
          </Button>
          <Button variant={"ghost"} className="cursor-pointer h-12 hover:bg-transparent hover:text-primary text-base font-semibold">
            <Download className="size-5 mr-2" />
            Download Itinerary
          </Button>
        </div>
      )}
    </section>
  );
}
