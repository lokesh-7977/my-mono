import { cn } from "@repo/ui/lib/utils"
import FormLabel from "./form-label"

type Props = {
    maxLength?: number,
    value: string,
    onChange: (value: string) => void,
    label?: React.ReactNode,
    className?: string,
    placeholder?: string,
    rows?: number,
    isResizable?: boolean,
    labelClassName?: string,
    inputClassName?: string,
    required?: boolean,
    error?: boolean,
}
export default function FormTextArea({ label,
    inputClassName,
    labelClassName,
    maxLength,
    onChange,
    value,
    className,
    placeholder,
    rows = 5,
    isResizable = true,
    required = false,
    error,
}: Props) {
    return (<div className={cn(className, "space-y-2")}>
        <div className="flex items-center justify-between">
            {label && <FormLabel label={label} className={labelClassName} required={required} />}
            {maxLength && <span className={cn(
                "text-xs font-medium",
                (value.length) >= maxLength ? "text-red-500" : "text-slate-400"
            )}>
                {value.length} / {maxLength} characters
            </span>}
        </div>
        <style>{`
            .custom-textarea-resizer::-webkit-resizer {
                background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 15L15 21M21 8L8 21'/%3E%3C/svg%3E") right 1px bottom 1px no-repeat transparent !important;
            }
        `}</style>
        <textarea
            rows={rows}
            placeholder={placeholder}
            maxLength={maxLength}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={cn(
                inputClassName,
                "w-full border border-slate-200 rounded-2xl px-5 py-3 text-foreground text-base leading-relaxed",
                "focus:bg-white focus:ring-1 outline-none transition-all",
                error ? "focus:border-danger-red focus:ring-danger-red" : "focus:border-primary focus:ring-primary",
                isResizable ? "" : "resize-none",
                "custom-textarea-resizer",
            )}
        />
        <div className="-mt-3.5 flex items-start h-4 pt-0.5">
            {error && <span className="text-danger-red text-xs max-w-full">
                {error}
            </span>}
        </div>
    </div>)
}