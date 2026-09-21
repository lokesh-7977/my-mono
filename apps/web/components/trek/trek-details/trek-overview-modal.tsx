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
}

export function TrekOverviewModal({ trekName }: TrekOverviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="h-8 text-xs rounded-xl text-primary bg-primary-50 font-semibold hover:bg-primary hover:text-white cursor-pointer transition-colors group">
          Show More <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[850px] p-9 rounded-3xl gap-0 border-none shadow-2xl">
        <VisuallyHidden>
          <DialogTitle>{trekName} Overview</DialogTitle>
        </VisuallyHidden>

        <div>
          {/* Header */}
          <h2 className="text-[26px] font-bold text-forefround mb-4">
            <span className="text-primary">Overview</span> for {trekName}
          </h2>

          {/* Content */}
          <div className="space-y-4 text-foreground leading-relaxed text-base">
            <p>
              Nestled at an altitude of 15,700 feet, Roopkund is perhaps the most debated and enigmatic trekking destination in India.
              Famous for the hundreds of human skeletons found at its edge, this high-altitude glacial lake offers more than just macabre mystery.
            </p>
            <p>
              Your journey begins through ancient oak forests and opens up into the sprawling meadows of Ali and Bedni Bugyal—some of the largest alpine meadows in Asia. As the air thins, the landscape transforms from vibrant green to a stark, celestial white, culminating in a climb that tests your resolve and rewards you with panoramic views of Trishul and Nanda Ghunti.
            </p>

            {/* Highlighted Info Box */}
            <div className="relative mt-5 p-6 bg-primary-50/40 border-l-[6px] border-primary">
              <p className="text-foreground font-bold italic text-lg sm:text-xl leading-relaxed">
                The trail is 9 km one way. A fit walker completes the ascent in 3-4 hours; a relaxed pace with stops takes 5-6 hours. Descent is typically 2-3 hours.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
