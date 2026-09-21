"use client";

import { DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";
import { cn } from "@repo/ui/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components/popover";
import { DateRange } from "@daypicker/react";

interface DatePickerProps {
    className?: string;
    date: DateRange | undefined;
    setDate: (date: DateRange | undefined) => void;
    disabled?: boolean;
    children: React.ReactNode;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
    sideOffset?: number;
    alignOffset?: number;
}

export default function DatePicker({ className, date, setDate, disabled, children, side, align, sideOffset, alignOffset }: DatePickerProps) {
    return (
        <Popover>
            <PopoverTrigger asChild disabled={disabled}>
                <div className={cn(className)}>
                    {children}
                </div>
            </PopoverTrigger>
            <PopoverContent
                side={side}
                align={align}
                sideOffset={sideOffset}
                alignOffset={alignOffset}
                onOpenAutoFocus={(e) => {
                    if (disabled) return;
                    // If we want to keep focus on the trigger (like an input), we prevent default
                    e.preventDefault();
                }}
                className="overflow-hidden w-fit"
            >
                <style jsx global>{`
                    .rdp-root {
                        --rdp-accent-color: var(--color-primary);
                        --rdp-accent-background-color: var(--color-primary-50);
                    }
                `}</style>

                <DayPicker
                    animate
                    mode="range"
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                    disabled={{ before: new Date() }}
                />
            </PopoverContent>
        </Popover>
    )
}