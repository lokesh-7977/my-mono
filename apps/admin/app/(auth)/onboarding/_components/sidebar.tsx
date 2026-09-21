import AwardBadge from "@/components/icons/award-badge";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import OnboardingStepper from "./onboarding-stepper";

export default function Sidebar({ 
    currentStep = 1, 
    skippedSteps = [] 
}: { 
    currentStep?: number;
    skippedSteps?: number[];
}) {
    return (
        <div className="w-68 border-r border-slate-200 bg-slate-50/50 flex flex-col h-[calc(100dvh-68px)] sticky top-17">
            <div className="size-full flex flex-col justify-between px-4 py-6">
                <OnboardingStepper currentStep={currentStep} skippedSteps={skippedSteps} />
                <div>
                    <p className="text-xs font-bold mb-2">Having trouble?</p>
                    <p className="text-xs text-foreground/50 mb-3">Feel free to contact us and we will always help you through the process.</p>
                    <Button className="h-8 px-4 font-medium text-sm rounded-md mb-4.5 hover:bg-primary-300 cursor-pointer">Contact us</Button>
                    <div className="flex justify-between">
                        <span className="text-foreground/50 flex gap-1 items-center text-xs"><Shield className="h-3.5 w-3 pb-[1.5px] shrink-0" />Secure Data</span>
                        <span className="text-foreground/50 flex gap-1 items-center text-xs"><AwardBadge className="h-3.5 w-3 pb-[1.5px] shrink-0" />ISO Certified</span>
                    </div>
                </div>
            </div>
        </div>
    )
}