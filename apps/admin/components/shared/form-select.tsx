import { cn } from "@repo/ui/lib/utils";
import FormLabel from "./form-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";

export interface FormSelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: FormSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  selectClassName?: string;
  error?: string;
}

export default function FormSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  disabled,
  required,
  selectClassName,
  error,
}: FormSelectProps) {
  return (
    <div className="space-y-2">
      <FormLabel label={label} required={required} />
      <Select value={value || ""} onValueChange={onChange}>
        <SelectTrigger
          disabled={disabled}
          className={cn(
            "w-full text-base h-11! mb-0 px-4 rounded-xl border border-border/60 text-foreground",
            "bg-[#F6F8F6] focus:bg-white outline-none transition-all  focus:ring-1!",
            error ? "focus:border-primary! focus:ring-primary!" : "focus:border-primary! focus:ring-primary!",
            selectClassName
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent position="popper" className="w-(--radix-select-trigger-width) max-h-70">
          {options.map((opt) => (
            <SelectItem key={opt.value} className="h-11 px-4" value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex items-start h-4 pt-1">
        {error && <span className="text-danger-red text-xs max-w-full">
          {error}
        </span>}
      </div>
    </div>
  );
}
