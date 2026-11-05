import type { ReactNode } from "react";
import { cn } from "@repo/ui/lib/utils";

interface StatItemProps {
  icon: ReactNode;
  label: string;
  value: string;
  className?: string;
}

// Flat stat for the trek and package stat rows; a thin divider separates it from the previous item on wide screens.
export function StatItem({ icon, label, value, className }: StatItemProps) {
  return (
    <div className={cn("flex flex-col gap-2 lg:border-l lg:border-zinc-200 lg:pl-8 lg:first:border-l-0 lg:first:pl-0", className)}>
      <div className="h-9 flex items-center">{icon}</div>
      <div className="flex flex-col gap-0.5">
        <span className="text-caption uppercase font-lato font-medium tracking-wide text-foreground/80">{label}</span>
        <span className="text-base font-bold text-foreground leading-tight">{value}</span>
      </div>
    </div>
  );
}
