"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from "@repo/ui/components/dialog";
import { Button } from "@repo/ui/components/button";
import { Check, Edit2, ArrowRight } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@repo/ui/lib/utils";
import { motion, AnimatePresence } from "motion/react";


// Month abbreviation to full name map
const MONTH_MAP: Record<string, string> = {
    Jan: "January", Feb: "February", Mar: "March", Apr: "April",
    May: "May", Jun: "June", Jul: "July", Aug: "August",
    Sep: "September", Oct: "October", Nov: "November", Dec: "December",
};

/** Parses "Thu 21 Jan, 2025" → { monthYear: "January 2025", ... } */
function parseMonthYear(dateStr: string): string {
    // Handles formats like "Thu 21 Jan, 2025" or "Thu 1 Mar, 2025"
    const parts = dateStr.replace(",", "").split(" ");
    // parts: ["Thu", "21", "Jan", "2025"]
    const monthAbbr = parts[2];
    const year = parts[3];
    return `${MONTH_MAP[monthAbbr] ?? monthAbbr} ${year}`;
}

interface ScheduleGroup {
    monthYear: string;
    items: typeof schedules;
}

function groupByMonth(items: typeof schedules): ScheduleGroup[] {
    const groups: ScheduleGroup[] = [];
    let currentKey = "";

    for (const item of items) {
        const key = parseMonthYear(item.date);
        if (key !== currentKey) {
            currentKey = key;
            groups.push({ monthYear: key, items: [] });
        }
        groups[groups.length - 1].items.push(item);
    }

    return groups;
}

const schedules = [
    {
        id: 1,
        date: "Thu 21 Jan, 2025",
        price: "₹ 999/- person",
        type: "Group Pricing",
        status: "Available",
        statusColor: "text-emerald-500",
    },
    {
        id: 2,
        date: "Thu 21 Jan, 2025",
        price: "₹ 999/- person",
        type: "Group Pricing",
        status: "Limited seats left",
        statusColor: "text-red-400",
    },
    {
        id: 3,
        date: "Thu 21 Jan, 2025",
        price: "₹ 999/- person",
        type: "Group Pricing",
        status: "Available",
        statusColor: "text-emerald-500",
    },
    {
        id: 4,
        date: "Thu 21 Jan, 2025",
        price: "₹ 999/- person",
        type: "Group Pricing",
        status: "Available",
        statusColor: "text-emerald-500",
    },
    {
        id: 5,
        date: "Thu 30 Jan, 2025",
        price: "₹ 999/- person",
        type: "Group Pricing",
        status: "Limited seats left",
        statusColor: "text-red-400",
    },
    {
        id: 6,
        date: "Thu 1 Feb, 2025",
        price: "₹ 999/- person",
        type: "Group Pricing",
        status: "Limited seats left",
        statusColor: "text-red-400",
    },
    {
        id: 7,
        date: "Thu 15 Feb, 2025",
        price: "₹ 999/- person",
        type: "Group Pricing",
        status: "Limited seats left",
        statusColor: "text-red-400",
    },
    {
        id: 8,
        date: "Thu 20 Feb, 2025",
        price: "₹ 999/- person",
        type: "Group Pricing",
        status: "Limited seats left",
        statusColor: "text-red-400",
    },
    {
        id: 9,
        date: "Thu 25 Feb, 2025",
        price: "₹ 999/- person",
        type: "Group Pricing",
        status: "Limited seats left",
        statusColor: "text-red-400",
    },
    {
        id: 10,
        date: "Thu 28 Feb, 2025",
        price: "₹ 999/- person",
        type: "Group Pricing",
        status: "Limited seats left",
        statusColor: "text-red-400",
    },
    {
        id: 11,
        date: "Thu 30 Feb, 2025",
        price: "₹ 999/- person",
        type: "Group Pricing",
        status: "Limited seats left",
        statusColor: "text-red-400",
    },
    {
        id: 12,
        date: "Thu 1 Mar, 2025",
        price: "₹ 999/- person",
        type: "Group Pricing",
        status: "Limited seats left",
        statusColor: "text-red-400",
    },
    {
        id: 13,
        date: "Thu 5 Mar, 2025",
        price: "₹ 999/- person",
        type: "Group Pricing",
        status: "Limited seats left",
        statusColor: "text-red-400",
    },
    {
        id: 14,
        date: "Thu 10 Mar, 2025",
        price: "₹ 999/- person",
        type: "Group Pricing",
        status: "Limited seats left",
        statusColor: "text-red-400",
    },
    {
        id: 15,
        date: "Thu 15 Mar, 2025",
        price: "₹ 999/- person",
        type: "Group Pricing",
        status: "Limited seats left",
        statusColor: "text-red-400",
    },
    {
        id: 16,
        date: "Thu 20 Mar, 2025",
        price: "₹ 999/- person",
        type: "Group Pricing",
        status: "Limited seats left",
        statusColor: "text-red-400",
    },
    {
        id: 17,
        date: "Thu 25 Mar, 2025",
        price: "₹ 999/- person",
        type: "Group Pricing",
        status: "Limited seats left",
        statusColor: "text-red-400",
    },
    {
        id: 18,
        date: "Thu 28 Mar, 2025",
        price: "₹ 999/- person",
        type: "Group Pricing",
        status: "Limited seats left",
        statusColor: "text-red-400",
    },
    {
        id: 19,
        date: "Thu 30 Mar, 2025",
        price: "₹ 999/- person",
        type: "Group Pricing",
        status: "Limited seats left",
        statusColor: "text-red-400",
    },
    {
        id: 20,
        date: "Thu 1 Apr, 2025",
        price: "₹ 999/- person",
        type: "Group Pricing",
        status: "Limited seats left",
        statusColor: "text-red-400",
    },
    {
        id: 21,
        date: "Thu 5 Apr, 2025",
        price: "₹ 999/- person",
        type: "Group Pricing",
        status: "Limited seats left",
        statusColor: "text-red-400",
    }
];

export function BookingDatesModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(3);
    const [isScrolled, setIsScrolled] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const grouped = useMemo(() => groupByMonth(schedules), []);
    const [visibleMonth, setVisibleMonth] = useState(grouped[0]?.monthYear ?? "");

    // Determine visible month from scroll position
    const handleScroll = useCallback(() => {
        const container = scrollRef.current;
        if (!container) return;

        const groupEls = container.querySelectorAll<HTMLElement>("[data-month]");
        let current = grouped[0]?.monthYear ?? "";

        for (const el of groupEls) {
            if (el.offsetTop <= container.scrollTop + 300) {
                current = el.getAttribute("data-month") ?? current;
            } else {
                break;
            }
        }

        setVisibleMonth(current);
        setIsScrolled(container.scrollTop > 5);
    }, [grouped]);

    // Reset month label when modal opens
    const handleOpenChange = useCallback((open: boolean) => {
        setIsOpen(open);
        if (open) {
            setVisibleMonth(grouped[0]?.monthYear ?? "");
            setIsScrolled(false);
        }
    }, [grouped]);

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="w-full h-13.5 rounded-xl text-base font-bold cursor-pointer">
                    Show Dates
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] gap-0 sm:max-w-[480px] p-0 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                <VisuallyHidden>
                    <DialogTitle>Select a Schedule</DialogTitle>
                    <DialogDescription>Choose your preferred trek date.</DialogDescription>
                </VisuallyHidden>

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 shrink-0">
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">Select a Schedule</h2>
                </div>

                {/* Fixed Trekkers Info */}
                <div className="px-5 py-3 border-b border-zinc-200 shrink-0">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-medium text-foreground/50">No. of Trekkers</span>
                            <div className="text-base font-bold text-foreground">
                                1 Adult <span className="mx-1 text-foreground/50">•</span> 0 Children
                            </div>
                        </div>
                        <button className="p-1.5 rounded-md hover:bg-zinc-100 transition-colors text-slate-600">
                            <Edit2 className="size-4" />
                        </button>
                    </div>
                    <p className="text-xs text-primary italic font-medium mt-1">
                        Price & availability may change based on your update.
                    </p>
                </div>

                <div className={cn(
                    "sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-zinc-200 shrink-0 transition-shadow duration-300",
                    isScrolled && "shadow-[0_10px_10px_rgba(0,0,0,0.1)]"
                )}>
                    <span className="text-sm font-bold text-slate-700 overflow-hidden relative inline-flex h-5 items-center">
                        <AnimatePresence mode="popLayout" initial={false}>
                            <motion.span
                                key={visibleMonth}
                                initial={{ y: 15, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                            >
                                {visibleMonth}
                            </motion.span>
                        </AnimatePresence>
                    </span>
                    {/* <Calendar className="size-4 text-zinc-400" /> */}
                </div>

                {/* Scrollable Schedule List */}
                <div ref={scrollRef} onScroll={handleScroll} className="overflow-y-auto flex-1 custom-scrollbar">
                    <div className="p-5 space-y-6">
                        {grouped.map((group) => (
                            <div key={group.monthYear} data-month={group.monthYear} className="space-y-3">

                                {/* Schedule Cards */}
                                {group.items.map((schedule) => {
                                    const isSelected = selectedId === schedule.id;

                                    return (
                                        <div key={schedule.id} className="flex flex-col gap-2">
                                            <div
                                                onClick={() => setSelectedId(schedule.id)}
                                                className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all duration-200
                                                    ${isSelected
                                                        ? 'border-primary bg-primary/5 shadow-[0_0_0_1px_rgba(45,212,191,0.2)]'
                                                        : 'border-zinc-200 hover:border-zinc-300 bg-white'
                                                    }
                                                `}
                                            >
                                                {/* Radio Button */}
                                                <div className="shrink-0">
                                                    <div className={`size-[18px] rounded-full border flex items-center justify-center transition-colors
                                                        ${isSelected ? 'bg-primary border-primary' : 'border-zinc-300 bg-white'}
                                                    `}>
                                                        {isSelected && <Check className="size-3 text-white" strokeWidth={3} />}
                                                    </div>
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 flex flex-col">
                                                    <span className="text-[15px] font-bold text-slate-800 leading-tight">
                                                        {schedule.date}
                                                    </span>
                                                    <span className="text-[13px] font-bold text-[#f97316] mt-0.5">
                                                        {schedule.price}
                                                    </span>
                                                    <span className="text-[11px] font-medium text-zinc-400 mt-0.5">
                                                        {schedule.type}
                                                    </span>
                                                </div>

                                                {/* Status */}
                                                <div className="shrink-0 text-right">
                                                    <span className={`text-[12px] font-semibold ${schedule.statusColor}`}>
                                                        {schedule.status}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Selected Warning Text */}
                                            {/* {isSelected && (
                                                <div className="text-center text-[12px] italic text-slate-500 font-medium pb-1">
                                                    Selected slot will be reserved for 15 minutes
                                                </div>
                                            )} */}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sticky Footer */}
                <div className="p-4 bg-white border-t border-zinc-100 flex items-center justify-between shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.15)]">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-[22px] font-bold text-slate-800">₹1,998</span>
                        <span className="text-[13px] font-medium text-zinc-400">for 2 person</span>
                    </div>
                    <Button className="h-10 px-6 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 flex items-center gap-1.5 shadow-sm shadow-primary/20">
                        Next
                        <ArrowRight className="size-4" strokeWidth={2.5} />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
