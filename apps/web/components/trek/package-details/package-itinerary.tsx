import Image from "next/image";
import {
    Mountain,
    Car,
    Route,
} from "lucide-react";
import ItineraryModal from "../itinerary-modal";
import type { PackageItineraryDay } from "@/api/package/package.types";

interface PackageItineraryProps {
    packageTitle: string;
    days: PackageItineraryDay[];
    fallbackImage?: string;
}

const PREVIEW_DAY_COUNT = 2;

export default function PackageItinerary({ packageTitle, days, fallbackImage }: PackageItineraryProps) {
    if (days.length === 0) return null;

    const itineraryDays = [...days]
        .sort((a, b) => a.dayNumber - b.dayNumber)
        .map((day) => ({
            day: `DAY ${String(day.dayNumber).padStart(2, "0")}`,
            title: day.title,
            altitude: day.altitude ? `${day.altitude.toLocaleString()} FT` : "",
            duration: day.duration ?? "",
            distance: day.distanceKm ? `${day.distanceKm} KM` : "",
            description: day.description ?? "",
            image: day.imageUrls[0] ?? fallbackImage ?? "",
        }));

    const previewDays = itineraryDays.slice(0, PREVIEW_DAY_COUNT);

    return (
        <section className="border-b border-zinc-200 pb-6">
            <h2 className="text-heading font-bold mb-6">
                Itinerary for {packageTitle}
            </h2>

            {/* Timeline Section */}
            <div className="relative flex flex-col gap-9.5 mt-10">
                {/* Continuous Vertical Line */}
                <div className="absolute left-0.75 top-0 w-0.5 bg-zinc-100 h-full" />

                {previewDays.map((day) => (
                    <div key={day.day} className="relative pl-10 flex flex-col gap-10 md:flex-row pt-4">
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
                            {(day.altitude || day.duration || day.distance) && (
                                <div className="flex items-center gap-3 flex-wrap mt-2">
                                    {day.altitude && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-100 text-xs font-bold text-zinc-500">
                                            <Mountain className="size-3" />
                                            {day.altitude}
                                        </div>
                                    )}
                                    {day.duration && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-100 text-xs font-bold text-zinc-500">
                                            <Car className="size-3" />
                                            {day.duration}
                                        </div>
                                    )}
                                    {day.distance && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-100 text-xs font-bold text-zinc-500">
                                            <Route className="size-3" />
                                            {day.distance}
                                        </div>
                                    )}
                                </div>
                            )}

                            {day.description && (
                                <p className="text-base mt-4 text-foreground leading-relaxed font-medium line-clamp-1">
                                    {day.description}
                                </p>
                            )}
                        </div>

                        {day.image && (
                            <div className="shrink-0 size-40 relative rounded-2xl overflow-hidden shadow-sm group cursor-pointer">
                                <Image
                                    src={day.image}
                                    alt={day.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal trigger + dialog (client component) */}
            <ItineraryModal days={itineraryDays} trekName={packageTitle} />
        </section>
    );
}
