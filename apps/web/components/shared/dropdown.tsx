import { cn } from "@repo/ui/lib/utils";
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from "@repo/ui/components/popover";

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
export default function Dropdown({ classname, options, children, value, onValueChange, disabled, side, align, sideOffset, alignOffset }: Props) {
    return (
        <Popover>
            <PopoverTrigger asChild disabled={disabled}>
                <div className={cn(
                    classname,
                    disabled ? "cursor-not-allowed pointer-events-none" : "cursor-pointer"
                )}>
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
                className="p-0 overflow-hidden"
            >
                <div className="size-full px-1 py-1 text-sm space-y-0.5 overflow-y-auto">
                    {options.map((option) => (
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