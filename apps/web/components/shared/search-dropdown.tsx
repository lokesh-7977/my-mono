"use client";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverAnchor, PopoverClose } from "../ui/popover";
import { useState, useRef } from "react";

type Props = {
    classname?: string;
    options: { id: string; label: string }[];
    children: React.ReactNode;
    value: string;
    onValueChange: (value: string) => void;
    disabled?: boolean;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
    sideOffset?: number;
    alignOffset?: number;
}
export default function SearchDropdown({ classname, options, children, value, onValueChange, disabled, side, align, sideOffset, alignOffset }: Props) {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const [lastValidOptions, setLastValidOptions] = useState(options);
    const [prevOptions, setPrevOptions] = useState(options);

    // Synchronously update lastValidOptions if options changed and are not empty
    if (options !== prevOptions) {
        setPrevOptions(options);
        if (options.length > 0) {
            setLastValidOptions(options);
        }
    }

    // Derive the open state: it's only truly open if we have options to show
    const isEffectiveOpen = open && options.length > 0;

    return (
        <Popover open={isEffectiveOpen} onOpenChange={setOpen}>
            <PopoverAnchor asChild>
                <div
                    ref={triggerRef}
                    onClick={(e) => {
                        if (disabled) return;
                        
                        // Focus the input so the user can start/continue typing
                        const input = e.currentTarget.querySelector('input');
                        if (input) input.focus();

                        // Always set open to true; isEffectiveOpen will handle 
                        // hiding it until there are actually options to show.
                        if (!open) setOpen(true);
                    }}
                    className={cn(
                        classname,
                        disabled ? "cursor-not-allowed pointer-events-none" : "cursor-pointer"
                    )}
                >
                    {children}
                </div>
            </PopoverAnchor>
            <PopoverContent
                side={side}
                align={align}
                sideOffset={sideOffset}
                alignOffset={alignOffset}
                onOpenAutoFocus={(e) => {
                    if (disabled) return;
                    e.preventDefault();
                }}
                onInteractOutside={(e) => {
                    // Prevent closing if the click is on the trigger
                    if (triggerRef.current?.contains(e.target as Node)) {
                        e.preventDefault();
                    }
                }}
                className="p-0 overflow-hidden"
            >
                <div className="size-full px-1 py-1 text-sm space-y-0.5 overflow-y-auto">
                    {/* Use lastValidOptions to ensure the list isn't empty during exit animation */}
                    {(options.length > 0 ? options : lastValidOptions).map((option) => (
                        <PopoverClose asChild key={option.id}>
                            <p
                                onClick={() => onValueChange(option.id)}
                                className={cn("py-1.5 px-2 cursor-pointer transition-all duration-150 hover:bg-zinc-100 rounded-lg", value === option.id && "bg-zinc-100")}>
                                {option.label}
                            </p>
                        </PopoverClose>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
