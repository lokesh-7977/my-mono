"use client";
import { cn } from "@/lib/utils";

interface TrekStepperProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TrekStepper = ({ tabs, activeTab, onTabChange }: TrekStepperProps) => {
  return (
    <div className="flex items-center gap-8 border-b border-border/50 mb-10 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={cn(
            "pb-4 text-sm font-bold transition-all relative whitespace-nowrap",
            activeTab === tab
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground/80"
          )}
        >
          {tab}
          {activeTab === tab && (
            <div className="absolute -bottom-px left-0 right-0 h-0.5 bg-primary rounded-t-full" />
          )}
        </button>
      ))}
    </div>
  );
};
