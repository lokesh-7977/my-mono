import { cn } from "@repo/ui/lib/utils";
import FormLabel from "./form-label";

interface FormInputProps {
    label: React.ReactNode;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    inputClassName?: string;
    maxLength?: number;
    type?: "text" | "number";
    unit?: string;
    required?: boolean;
    error?: string;
}

export default function FormInput({ label, value, onChange, placeholder, inputClassName, maxLength, type = "text", unit, required, error }: FormInputProps) {
    return (
        <div className="space-y-2">
            <FormLabel label={label} required={required} />
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <input
                        required={required}
                        type={"text"}
                        value={value}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (type === "number") {
                                if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                    onChange(val);
                                }
                            } else {
                                onChange(val);
                            }
                        }}
                        placeholder={placeholder}
                        className={cn(
                            "w-full h-11! rounded-xl border border-border/60 bg-[#F6F8F6] focus:bg-white focus:ring-1 outline-none transition-all text-foreground",
                            error ? "focus:border-danger-red focus:ring-danger-red" : "focus:border-primary focus:ring-primary ",
                            unit ? "pl-4 pr-12" : "px-4",
                            inputClassName
                        )}
                        maxLength={maxLength}
                    />
                    {unit && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground uppercase pointer-events-none">
                        {unit}
                    </span>}
                </div>
            </div>
            <div className="-mt-1.5 flex items-start h-4 pt-0.5">
                {error && <span className="text-danger-red text-xs max-w-full">
                    {error}
                </span>}
            </div>
        </div>
    );
}