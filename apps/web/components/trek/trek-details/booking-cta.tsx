import { Button } from "@repo/ui/components/button";
import { BadgeCheck, ShieldCheck } from "lucide-react";

interface BookingCTAProps {
    startingPrice?: number | null;
    currency?: string | null;
}

const CURRENCY_SYMBOL: Record<string, string> = {
    INR: "₹",
    USD: "$",
};

export default function BookingCTA({ startingPrice = null, currency = null }: BookingCTAProps) {
    const symbol = currency ? (CURRENCY_SYMBOL[currency] ?? `${currency} `) : "₹";

    return (
        <div className="rounded-2xl border border-zinc-200 shadow-soft p-8">
            <div className="flex flex-col gap-5">
                {/* Pricing Row */}
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <span className="text-xs text-foreground/50 font-medium mb-1">Starting From</span>
                        {startingPrice !== null ? (
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl text-foreground font-bold leading-none">{symbol}{startingPrice.toLocaleString()}</span>
                                <span className="text-foreground/50 text-sm font-medium">/ trekker</span>
                            </div>
                        ) : (
                            <span className="text-base text-foreground/60 font-semibold">Packages coming soon</span>
                        )}
                    </div>
                    <ul className="text-xs text-foreground/50 font-medium space-y-1 text-right mt-1">
                        <li>• GST Included</li>
                        <li>• Insurance added</li>
                        <li>• Pay 20% Partially to book</li>
                    </ul>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                    <Button disabled={startingPrice === null} className="w-full h-13.5 rounded-xl text-base font-bold cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">
                        Check All Options
                    </Button>
                    <Button disabled={startingPrice === null} variant="ghost" className="w-full h-11 rounded-xl text-base font-bold hover:bg-transparent text-primary cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">
                        Check Popular Options
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
