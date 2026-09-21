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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const itineraryDays = [
  {
    day: "DAY 01",
    title: "Drive from Srinagar to Gagangir",
    altitude: "9,800 FT",
    duration: "2 Hour Drive",
    distance: "5-6 KM",
    description: "Arrive at Shuru Homestay by 10:30 AM. After lunch, depart for Jobra (a 2-hour drive). The cab fare is Rs 3,000 per vehicle, which is not included in the trek fee.",
    image: "https://images.scoutripper.com/treks/kashmir-great-lake-trek/Kashmir Great Lakes-bg.png"
  },
  {
    day: "DAY 02",
    title: "Drive from Gagangir to Shitkadi. Trek to Nichnai",
    altitude: "9,800 FT",
    duration: "2 Hour Drive",
    distance: "5-6 KM",
    description: "Arrive at Shuru Homestay by 10:30 AM. After lunch, depart for Jobra (a 2-hour drive). The cab fare is Rs 3,000 per vehicle, which is not included in the trek fee.",
    image: "https://images.scoutripper.com/treks/hampta-pass-trek/beauty-of-hampta-pass-trek.jpg"
  },
];

const routes = [
  {
    id: 1,
    name: "Gallu Temple",
    distance: "9 KM",
    difficulty: "Easy - Moderate",
  },
  {
    id: 2,
    name: "Bhagsu Waterfall",
    distance: "9 KM",
    difficulty: "Easy - Moderate",
  },
  {
    id: 3,
    name: "Dharamkot Forest",
    distance: "9 KM",
    difficulty: "Easy - Moderate",
  },
]

export function TrekItinerary() {
  const [isRouteActive, setIsRouteActive] = useState<number>(1);

  return (
    <section className="border-t border-zinc-200 pt-6">
      <h2 className="text-[26px] font-bold text-foreground font-bricolage-grotesque mb-8">
        Kashmir Great Lakes Itinerary
      </h2>

      {/* Route Selection Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {
          routes.map((route) => (
            <div
              onClick={() => setIsRouteActive(route.id)}
              key={route.id}
              className={cn("px-4 py-3 rounded-xl gap-1 text-foreground flex flex-col items-center justify-center text-center cursor-pointer border border-primary",
                isRouteActive === route.id ? "bg-primary/10 border-primary" : "bg-zinc-100 border-zinc-100",
                "hover:bg-primary/10 transition-all duration-100"
              )}>
              <span className="text-xs font-semibold">Route 0{route.id}</span>
              <span className="text-sm font-bold font-bricolage-grotesque">{route.name}</span>
              <span className="text-xs font-medium opacity-70">
                {route.distance} <span className="mx-1">•</span> {route.difficulty}
              </span>
            </div>
          ))
        }
      </div>

      {/* Timeline Section */}
      <div className="relative flex flex-col gap-9.5 mt-10">
        {/* Continuous Vertical Line */}
        <div className="absolute left-[3px] top-0 w-[2px] bg-zinc-100 h-full" />

        {itineraryDays.map((day, index) => (
          <div key={index} className="relative pl-10 flex flex-col gap-10 md:flex-row pt-4">
            {/* Timeline Dot */}
            <div className="absolute -left-0.5 top-1 size-3 rounded-full bg-primary ring-4 ring-zinc-100 z-10 mt-1" />

            <div className="flex-1 flex flex-col">
              <div className="flex flex-col gap-1">
                <span className="text-base font-bold text-primary uppercase tracking-wide">
                  {day.day}
                </span>
                <h3 className="text-[20px] font-bold text-foreground leading-tight">
                  {day.title}
                </h3>
              </div>

              {/* Day Badges */}
              <div className="flex items-center gap-3 flex-wrap mt-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-100 text-xs font-bold text-zinc-500">
                  <Mountain className="size-3" />
                  {day.altitude}
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-100 text-xs font-bold text-zinc-500">
                  <Car className="size-3" />
                  {day.duration}
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-100 text-xs font-bold text-zinc-500">
                  <Route className="size-3" />
                  {day.distance}
                </div>
              </div>

              <p className="text-base mt-4 text-foreground leading-relaxed font-medium line-clamp-1">
                {day.description}
              </p>
            </div>

            <div className="shrink-0 size-[160px] relative rounded-2xl overflow-hidden shadow-sm group cursor-pointer">
              <Image
                src={day.image}
                alt={day.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              {/* <div className="absolute inset-0 group-hover:bg-black/0 transition-colors" /> */}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8">
        <Button className="w-full sm:w-auto px-6 h-12 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white cursor-pointer text-base font-semibold transition-all">
          View Full 5 Day Itinerary
          <ArrowRight className="size-4.5 ml-2" />
        </Button>
        <Button variant={"ghost"} className="cursor-pointer h-12 hover:bg-transparent hover:text-primary text-base font-semibold">
          <Download className="size-5 mr-2" />
          Download Itinerary
        </Button>
      </div>
    </section>
  );
}
