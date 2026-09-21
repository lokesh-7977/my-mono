import { useEffect, useRef, useState, useMemo } from "react";
import { Check, ChevronDown, X, Plus } from "lucide-react";

import { cn } from "@repo/ui/lib/utils";
import { Badge } from "@repo/ui/components/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@repo/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import FormLabel from "./form-label";

export interface FormMultiSelectOption {
  value: string;
  label: string;
  color?: string; // Optional hex color for the dot (e.g. "#EF7D00")
}

interface FormMultiSelectProps {
  label: React.ReactNode;
  values: string[];
  onChange: (values: string[]) => void;
  options: FormMultiSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  selectClassName?: string;
  onCreateNew?: () => void;
  createNewLabel?: string;
  error?: string;
}

export default function FormMultiSelect({
  label,
  values,
  onChange,
  options,
  placeholder = "Select options...",
  disabled,
  required,
  selectClassName,
  onCreateNew,
  createNewLabel = "Create new tag",
  error,
}: FormMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const targetScroll = useRef(0);
  const currentScroll = useRef(0);
  const isAnimating = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationFrameId: number;

    const smoothScroll = () => {
      currentScroll.current += (targetScroll.current - currentScroll.current) * 0.15;

      if (Math.abs(targetScroll.current - currentScroll.current) < 0.5) {
        currentScroll.current = targetScroll.current;
        el.scrollLeft = currentScroll.current;
        isAnimating.current = false;
      } else {
        el.scrollLeft = currentScroll.current;
        animationFrameId = requestAnimationFrame(smoothScroll);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (el.scrollWidth > el.clientWidth) {
        e.preventDefault();

        if (!isAnimating.current) {
          targetScroll.current = el.scrollLeft;
          currentScroll.current = el.scrollLeft;
          isAnimating.current = true;
          animationFrameId = requestAnimationFrame(smoothScroll);
        }

        targetScroll.current += e.deltaY;

        const maxScroll = el.scrollWidth - el.clientWidth;
        targetScroll.current = Math.max(0, Math.min(targetScroll.current, maxScroll));
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const selectedOptions = useMemo(
    () => options.filter((option) => values.includes(option.value)),
    [values, options]
  );

  const handleUnselect = (value: string) => {
    onChange(values.filter((v) => v !== value));
  };

  return (
    <div className="space-y-2">
      <FormLabel label={label} required={required} />
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <div
            ref={triggerRef}
            tabIndex={disabled ? -1 : 0}
            className={cn(
              "flex min-h-11 w-full items-center overflow-hidden justify-between rounded-xl border border-border/60 bg-[#F6F8F6] px-3 text-sm text-foreground",
              "focus:bg-white focus:ring-1 outline-none transition-all ",
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
              error ? "focus:border-danger-red focus:ring-danger-red" : "focus:border-primary focus:ring-primary",
              selectClassName
            )}
            onPointerDown={(e) => { e.preventDefault(); }}
            onClick={() => !disabled && setOpen(!open)}
            onKeyDown={(e) => {
              if (!disabled && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                setOpen((prev) => !prev);
              }
            }}
          >
            <div
              ref={scrollRef}
              className="flex overflow-x-auto scrollbar-none gap-1.5 w-full items-center"
            >
              {selectedOptions.length === 0 && (
                <span className="text-muted-foreground p-1 pl-1.5 text-base">{placeholder}</span>
              )}
              {selectedOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant="secondary"
                  className="rounded-full font-medium px-3 py-3 gap-1 flex items-center bg-[#2B3B48] text-white hover:bg-[#2B3B48]/90"
                  onClick={(e) => e.stopPropagation()}
                >
                  {option.color && (
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: option.color }}
                    />
                  )}
                  {option.label}
                  <button
                    className="ml-px cursor-pointer ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(option.value);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleUnselect(option.value);
                    }}
                  >
                    <X className="size-3.5 text-white/70 hover:text-white" />
                  </button>
                </Badge>
              ))}
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50 ml-2 text-foreground" />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-(--radix-popover-trigger-width) p-0 max-h-70"
          align="start"
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            triggerRef.current?.focus();
          }}
        >
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>

              {onCreateNew && (
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      onCreateNew();
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 text-primary cursor-pointer font-medium"
                  >
                    <Plus className="h-4 w-4" />
                    {createNewLabel}
                  </CommandItem>
                </CommandGroup>
              )}
              {onCreateNew && <CommandSeparator />}

              <CommandGroup>
                {options.map((option) => {
                  const isSelected = values.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        if (isSelected) {
                          onChange(values.filter((v) => v !== option.value));
                        } else {
                          onChange([...values, option.value]);
                        }
                      }}
                      className="cursor-pointer flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-2.5">
                        {option.color && (
                          <span
                            className="h-3.5 w-3.5 rounded-md"
                            style={{ backgroundColor: option.color }}
                          />
                        )}
                        <span>{option.label}</span>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-foreground/80" />}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="-mt-1.5 flex items-start h-4 pt-0.5">
        {error && <span className="text-danger-red text-xs max-w-full">
          {error}
        </span>}
      </div>
    </div>
  );
}
