"use client";

import React, { useState } from "react";
import TrekkerIcon from "@/components/icons/trekker-icon";
import { Check } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

const roles = [
    {
        id: "trek_leader",
        title: "Trek Leader",
        description: "IMF / NIM certified. Leads groups on Himalayan trails. Creates and sells named trek packages.",
        tags: ["BMC/IMF certified", "2 Years Exp", "10% commission"],
        comingSoon: false,
    },
    {
        id: "local_trail_guide",
        title: "Local Trail Guide",
        description: "Deep local trail knowledge. Assists certified leaders or leads day treks on specific verified trails.",
        tags: ["Trail specialist", "Specific trails only", "10% commission"],
        comingSoon: false,
    },
    {
        id: "mountaineer",
        title: "Mountaineer",
        description: "Technical climber and expedition leader. High-altitude, technical routes, peak summits, glacier work.",
        tags: ["Technical routes", "Expedition leader", "IMF affiliation preferred"],
        comingSoon: false,
    },
    {
        id: "experience_organiser",
        title: "Experience Organiser",
        description: "Creates and hosts multi-day trips, weekend getaways, cultural treks, and curated Himalayan experiences.",
        tags: ["Multi-day trips", "Cultural experiences", "Trip planning required"],
        comingSoon: false,
    },
    {
        id: "activity_host",
        title: "Activity Host",
        description: "Hosts specific outdoor activities - rock climbing, rappelling, kayaking, camping, yoga retreats, bird watching.",
        tags: ["Day activities", "Skill-based hosting", "Activity insurance required"],
        comingSoon: false,
    },
    // {
    //     id: "camp_operator",
    //     title: "Camp Operator",
    //     description: "Run a basecamp, trek camp, or mountain homestay? This vendor type is coming soon.",
    //     tags: ["Coming Soon"],
    //     comingSoon: true,
    // }
];

export default function RoleStep() {
    const [selectedRole, setSelectedRole] = useState<string>("trek_leader");

    return (
        <div className="w-full">
            <h3 className="text-lg font-semibold text-foreground mb-6">
                Select Your Role <span className="text-destructive">*</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roles.map((role) => {
                    const isSelected = selectedRole === role.id;
                    const isComingSoon = role.comingSoon;

                    return (
                        <div
                            key={role.id}
                            onClick={() => !isComingSoon && setSelectedRole(role.id)}
                            className={cn(
                                "relative rounded-2xl p-4 border transition-all duration-200 flex flex-col h-full",
                                isComingSoon ? "border-transparent bg-[#F9F9F9] opacity-70 cursor-not-allowed" : "cursor-pointer",
                                isSelected ? "border-primary/50 bg-primary/10" : "border-transparent bg-[#F6F8F6F2] hover:border-border",
                                !isSelected && !isComingSoon && "hover:bg-[#f1f1f1]"
                            )}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <div className="size-10 rounded-[9px] bg-primary-900 flex items-center justify-center text-white shrink-0">
                                    <TrekkerIcon size={21} />
                                </div>
                                {!isComingSoon && (
                                    <div className={cn(
                                        "size-7 rounded-full flex items-center justify-center transition-colors",
                                        isSelected ? "border-[2.6px] border-primary text-primary" : "border border-border bg-white"
                                    )}>
                                        {isSelected && <Check className="w-4 h-4 stroke-3" />}
                                    </div>
                                )}
                            </div>

                            <h4 className={cn(
                                "text-base font-bold mb-2 transition-all",
                                isSelected ? "text-primary" : "text-foreground",
                                isComingSoon && "text-muted-foreground"
                            )}>
                                {role.title}
                            </h4>

                            <p className={cn(
                                "text-xs font-medium mb-4 leading-relaxed transition-all",
                                isSelected ? "text-foreground" : "text-foreground/80",
                                // isComingSoon ? "text-muted-foreground/80" : "text-foreground/80 font-medium"
                            )}>
                                {role.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-1">
                                {role.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className={cn(
                                            "text-xs font-medium px-2 py-1 rounded-md transition-all",
                                            tag === "Coming Soon"
                                                ? "bg-[#FFF0E6] text-[#F2994A]"
                                                : isSelected
                                                    ? "bg-[#D1F2E7] text-primary-600"
                                                    : "bg-primary-900/10 text-foreground"
                                        )}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}