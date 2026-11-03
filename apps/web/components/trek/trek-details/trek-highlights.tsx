"use client";

import { CircleCheck } from "lucide-react";

const fallbackHighlights = [
    "Witness the hauntingly beautiful mystery of Skeleton Lake.",
    "360-degree views of Trishul and Nanda Ghunti peaks.",
    "Walk through the twin alpine meadows: Ali and Bedni Bugyal.",
    "Challenge yourself with high-altitude glacial terrain."
];

interface TrekHighlightsProps {
    trekName?: string;
    highlights?: string[];
}

export default function TrekHighlights({
    trekName = "Kashmir Great Lakes Trek",
    highlights = fallbackHighlights,
}: TrekHighlightsProps) {
    return (
        <section className="border-t border-zinc-200 pt-6">
            <h2 className="text-[26px] font-bold text-foreground mb-4 font-bricolage-grotesque">
                {trekName} Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {highlights.map((highlight, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-5 p-6 rounded-xl bg-zinc-100/60"
                    >
                        <div className="shrink-0">
                            <CircleCheck className="size-6 text-primary" strokeWidth={2.5} />

                        </div>
                        <p className="text-base font-semibold text-foreground leading-relaxed">
                            {highlight}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
