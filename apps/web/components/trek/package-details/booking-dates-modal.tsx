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
import { formatPrice } from "@/lib/format-price";
import type { PackageSchedule } from "@/api/package/package.types";


const TIME_ZONE = "Asia/Kolkata";
const LIMITED_SEATS_THRESHOLD = 5;

interface ScheduleOption {
    id: string;
    monthYear: string;
    date: string;
    price: string;
    amount: number | null;
    currency: string;
    type: string;
    status: string;
    statusColor: string;
}

interface ScheduleGroup {
    monthYear: string;
    items: ScheduleOption[];
}

function formatDate(iso: string): string {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: TIME_ZONE,
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
    }).formatToParts(new Date(iso));
    const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
    return `${get("weekday")} ${get("day")} ${get("month")}, ${get("year")}`;
}

function formatMonthYear(iso: string): string {
    return new Intl.DateTimeFormat("en-US", {
        timeZone: TIME_ZONE,
        month: "long",
        year: "numeric",
    }).format(new Date(iso));
}

function toOption(schedule: PackageSchedule): ScheduleOption {
    const amount = schedule.adultPrice ?? schedule.price;
    const limited = schedule.availableSeats <= LIMITED_SEATS_THRESHOLD;

    return {
        id: schedule.id,
        monthYear: formatMonthYear(schedule.startDate),
        date: formatDate(schedule.startDate),
        amount,
        currency: schedule.currency,
        price: amount !== null ? `${formatPrice(amount, schedule.currency)}/- person` : "Price on request",
        type: "Group Pricing",
        status: limited ? "Limited seats left" : "Available",
        statusColor: limited ? "text-red-400" : "text-emerald-500",
    };
}

function groupByMonth(items: ScheduleOption[]): ScheduleGroup[] {
    const groups: ScheduleGroup[] = [];

    for (const item of items) {
        const last = groups[groups.length - 1];
        if (last && last.monthYear === item.monthYear) {
            last.items.push(item);
        } else {
            groups.push({ monthYear: item.monthYear, items: [item] });
        }
    }

    return groups;
}

interface BookingDatesModalProps {
    schedules: PackageSchedule[];
}

export function BookingDatesModal({ schedules }: BookingDatesModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const options = useMemo(
        () => [...schedules].sort((a, b) => a.startDate.localeCompare(b.startDate)).map(toOption),
        [schedules],
    );
    const [selectedId, setSelectedId] = useState<string | null>(options[0]?.id ?? null);
    const selected = options.find((option) => option.id === selectedId) ?? null;
    const [isScrolled, setIsScrolled] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const grouped = useMemo(() => groupByMonth(options), [options]);
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
            <DialogContent className="max-w-[95vw] gap-0 sm:max-w-120 p-0 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
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
                                                    <div className={`size-4.5 rounded-full border flex items-center justify-center transition-colors
                                                        ${isSelected ? 'bg-primary border-primary' : 'border-zinc-300 bg-white'}
                                                    `}>
                                                        {isSelected && <Check className="size-3 text-white" strokeWidth={3} />}
                                                    </div>
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 flex flex-col">
                                                    <span className="text-body font-bold text-slate-800 leading-tight">
                                                        {schedule.date}
                                                    </span>
                                                    <span className="text-meta font-bold text-[#f97316] mt-0.5">
                                                        {schedule.price}
                                                    </span>
                                                    <span className="text-caption font-medium text-zinc-400 mt-0.5">
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
                        <span className="text-[22px] font-bold text-slate-800">
                            {selected?.amount != null ? formatPrice(selected.amount, selected.currency) : "—"}
                        </span>
                        <span className="text-meta font-medium text-zinc-400">for 1 person</span>
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
