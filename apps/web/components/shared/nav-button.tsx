import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavButtonProps {
    onClick?: () => void;
    disabled: boolean;
    ariaLabel: string;
    type?: "prev" | "next";
}

const NavButton = ({ onClick, type, disabled, ariaLabel }: NavButtonProps) => {
    const navBtnBase = "w-10 h-10 rounded-xl flex items-center justify-center transition-colors disabled:bg-secondary/80 disabled:text-foreground/20 disabled:cursor-not-allowed disabled:hover:bg-zinc-100 disabled:hover:text-zinc-300";

    return (<button
        onClick={onClick}
        disabled={disabled}
        className={cn(
            navBtnBase,
            "bg-secondary text-foreground cursor-pointer hover:bg-primary hover:text-primary-foreground",
        )}
        aria-label={ariaLabel}
    >
        {
            type === "prev" ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />
        }
    </button>)
}

export default NavButton;