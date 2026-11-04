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
import type { TransportOption } from "@/lib/how-to-reach-mock";

interface HowToReachModalProps {
  trekName: string;
  options: TransportOption[];
}

// Expects options in the { mode, description }[] shape proposed in
// apps/docs/how-to-reach-data-structure-checklist.md — currently fed from a
// temporary mock (see apps/web/lib/how-to-reach-mock.ts) until the backend
// field is restructured to match.
export function HowToReachModal({ trekName, options }: HowToReachModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mt-1 h-10 flex items-center gap-2 bg-secondary text-foreground font-bold px-5 py-2.5 rounded-xl w-fit transition-all hover:bg-primary hover:text-primary-foreground group cursor-pointer text-sm">
          View Routes
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[95vw] sm:max-w-212.5 p-9 rounded-3xl gap-0 border-none shadow-2xl">
        <VisuallyHidden>
          <DialogTitle>How to Reach {trekName}</DialogTitle>
        </VisuallyHidden>

        <div className="min-w-0">
          <h2 className="text-heading font-bold text-foreground mb-4">
            <span className="text-primary">How to Reach</span> {trekName}
          </h2>

          <div className="space-y-4 text-base text-foreground leading-relaxed">
            {options.length > 0 ? (
              options.map((option, index) => (
                <p key={index}>
                  <span className="font-bold">{option.mode}:</span> {option.description}
                </p>
              ))
            ) : (
              <p className="text-zinc-500">
                Reach-route details for this trek haven&apos;t been published yet.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
