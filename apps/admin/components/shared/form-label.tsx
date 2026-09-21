import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

export default function FormLabel({
    label,
    className,
    required
}: {
    label: React.ReactNode | string;
    className?: string;
    required?: boolean;
}) {
    return (
        <Label className={cn("text-base font-medium text-foreground", className)}>
            {label}
            {required && <span className="text-red-500">*</span>}
        </Label>
    );
}