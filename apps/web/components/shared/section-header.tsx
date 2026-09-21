import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import NavButton from "./nav-button";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionType?: "arrows" | "button" | "none";
  buttonText?: string;
  buttonHref?: string;
  onPrev?: () => void;
  onNext?: () => void;
  isPrevDisabled?: boolean;
  isNextDisabled?: boolean;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  actionType = "none",
  buttonText = "View all",
  buttonHref = "#",
  onPrev,
  onNext,
  isPrevDisabled = false,
  isNextDisabled = false,
  className = "",
}: SectionHeaderProps) {

  return (
    <div className={cn("flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4", className)}>
      <div>
        <h2 className="text-[28px] md:text-[32px] font-bold text-foreground font-bricolage-grotesque leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-zinc-400 mt-2 text-[15px] font-medium">
            {subtitle}
          </p>
        )}
      </div>

      {actionType === "arrows" && (
        <div className="flex items-center gap-3">
          <NavButton
            onClick={onPrev}
            type="prev"
            disabled={isPrevDisabled}
            ariaLabel="Previous"
          />
          <NavButton
            onClick={onNext}
            type="next"
            disabled={isNextDisabled}
            ariaLabel="Next"
          />
        </div>
      )}

      {actionType === "button" && (
        <Link
          href={buttonHref}
          className="bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors whitespace-nowrap md:w-auto w-fit"
        >
          {buttonText}
          <ExternalLink className="size-4" />
        </Link>
      )}
    </div>
  );
}