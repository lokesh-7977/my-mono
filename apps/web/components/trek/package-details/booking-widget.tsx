import { Button } from "@/components/ui/button";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import { BookingDatesModal } from "./booking-dates-modal";

export default function BookingWidget() {
    return (
        <div className="rounded-2xl border border-zinc-200 shadow-[0_8px_40px_rgba(0,0,0,0.03)] p-8">
            <div className="flex flex-col gap-5">
                {/* Pricing Row */}
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <span className="text-xs text-foreground/50 font-medium mb-1">Starting From</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-[24px] text-foreground font-bold leading-none">₹16,500</span>
                            <span className="text-foreground/50 text-sm font-medium">/ trekker</span>
                        </div>
                        <span className="text-[#FF4D4D] text-sm font-bold line-through ml-1 mt-1">₹19,299</span>
                    </div>
                    <ul className="text-xs text-foreground/50 font-medium space-y-1 text-right mt-1">
                        <li>• GST Included</li>
                        <li>• Insurance added</li>
                        <li>• Pay 20% Partially to book</li>
                    </ul>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                    <BookingDatesModal />
                    <Button variant={"secondary"} className="w-full h-13.5 rounded-xl text-base font-bold cursor-pointer">
                        Send Enquiry
                    </Button>
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BadgeCheck className="size-3" />
                        <span className="text-xs font-medium leading-none">Verified Trek Leaders</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="size-3" />
                        <span className="text-xs font-medium leading-none">Safety First</span>
                    </div>
                </div>

                <p className="text-xs text-[#D96E70] font-semibold text-center">
                    No hidden fees. Free cancellation up to 30 days prior.
                </p>
            </div>
        </div>
    )
}