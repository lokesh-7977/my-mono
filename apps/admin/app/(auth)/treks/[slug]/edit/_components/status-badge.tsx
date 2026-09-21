import { cn } from "@repo/ui/lib/utils";
import { STATUS } from "./schedule-context";

const statusVariants: Record<string, string> = {
    [STATUS.available.value]: "bg-magic-green/10 text-magic-green",
    [STATUS.sold_out.value]: "bg-warn-orange/10 text-warn-orange",
    [STATUS.cancel_req.value]: "bg-danger-red/10 text-danger-red",
    [STATUS.cancelled.value]: "bg-slate-100 text-slate-600",
    [STATUS.new.value]: "bg-primary/10 text-primary",
};

interface StatusBadgeProps {
    status?: string | null;
    label: string;
    className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
    const activeStatus = status || STATUS.new.value;
    const variantClass = statusVariants[activeStatus] || "bg-slate-100 text-slate-600";

    return (
        <span className={cn(
            "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm",
            variantClass,
            className
        )}>
            {label}
        </span>
    )
}

