"use client";
import { ChevronDown, X } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";

interface Option {
    label: string;
    value: string;
}

interface MultiSelectFilterProps {
    options: Option[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
}

export default function MultiSelectFilter({ options, selected, onChange, placeholder = "All" }: MultiSelectFilterProps) {
    const handleToggle = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((item) => item !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    const getDisplayText = () => {
        if (selected.length === 0) return placeholder;
        return selected
            .map(v => options.find(o => o.value === v)?.label)
            .filter(Boolean)
            .join(", ");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-white px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring text-left text-slate-600 shadow-sm">
                    <span className="truncate">{getDisplayText()}</span>
                    {selected.length > 0 ? (
                        <div
                            role="button"
                            tabIndex={0}
                            className="hover:bg-slate-100 p-0.5 rounded-sm transition-colors"
                            onPointerDown={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                onChange([]);
                            }}
                        >
                            <X className="h-3.5 w-3.5 opacity-60 shrink-0" />
                        </div>
                    ) : (
                        <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-(--radix-dropdown-menu-trigger-width)">
                {options.map((option) => (
                    <DropdownMenuCheckboxItem
                        key={option.value}
                        checked={selected.includes(option.value)}
                        onCheckedChange={() => handleToggle(option.value)}
                        className="text-[13.5px] cursor-pointer"
                    >
                        {option.label}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
