"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface TrekOverviewModalProps {
  trekName: string;
  description?: string;
  summary?: string | null;
}

export function TrekOverviewModal({ trekName, description, summary }: TrekOverviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"secondary"} className="h-9 text-xs font-semibold cursor-pointer group">
          Show More <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-212.5 p-9 rounded-3xl gap-0 border-none shadow-2xl">
        <VisuallyHidden>
          <DialogTitle>{trekName} Overview</DialogTitle>
        </VisuallyHidden>

        <div>
          {/* Header */}
          <h2 className="text-heading font-bold text-foreground mb-4">
            <span className="text-primary">Overview</span> for {trekName}
          </h2>

          {/* Content: scrolls inside the dialog so long overviews never run off-screen */}
          <div className="max-h-[calc(90vh-12rem)] overflow-y-auto pr-2 text-foreground leading-relaxed text-base whitespace-pre-line wrap-anywhere">
            <p>
              {description ??
                "Nestled high in the Himalayas, this trek offers some of the most rewarding mountain views in India."}
            </p>

            {summary && (
              <div className="relative mt-5 p-6 bg-primary-50/40 border-l-6 border-primary">
                <p className="text-foreground font-bold italic text-lg sm:text-xl leading-relaxed">{summary}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
