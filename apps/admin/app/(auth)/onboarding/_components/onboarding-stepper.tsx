import { Check, Ban } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

import { STEPS, STEP_METADATA } from "../page";

interface OnboardingStepperProps {
    currentStep: number;
    skippedSteps?: number[];
}

const getTransitionDelay = (stepId: number, skippedSteps: number[], isActive: boolean, isSkipped: boolean) => {
    if (isActive) {
        if (!isSkipped) return "0ms";
        let count = 1;
        let temp = stepId - 1;
        while (skippedSteps.includes(temp)) {
            count++;
            temp--;
        }
        return `${count * 250}ms`;
    }

    let countAfter = 0;
    let tempAfter = stepId + 1;
    while (skippedSteps.includes(tempAfter)) {
        countAfter++;
        tempAfter++;
    }
    return `${countAfter * 250}ms`;
};

export default function OnboardingStepper({ currentStep, skippedSteps = [] }: OnboardingStepperProps) {
    const stepsArray = Object.values(STEPS);
    return (
        <div className="flex flex-col ml-2 mt-4">
            {stepsArray.map((stepId, index) => {
                const metadata = STEP_METADATA[stepId as keyof typeof STEP_METADATA];
                const isSkipped = skippedSteps.includes(stepId);
                const isCompleted = stepId < currentStep && !isSkipped;
                const isCurrent = stepId === currentStep;
                const isUpcoming = stepId > currentStep;
                const isLast = index === stepsArray.length - 1;

                const isActive = isCompleted || (isSkipped && stepId < currentStep);
                const currentDelay = getTransitionDelay(stepId, skippedSteps, isActive, isSkipped);

                return (
                    <div key={stepId} className="relative flex gap-4">
                        {/* Line connecting steps */}
                        {!isLast && (
                            <div className="absolute left-2.75 top-7 -bottom-1 w-0.5 py-1">
                                <div className="w-full h-full bg-slate-200 relative overflow-hidden rounded-full">
                                    <div
                                        style={{ transitionDelay: currentDelay }}
                                        className={cn(
                                            "absolute top-0 left-0 w-full transition-all duration-250 ease-in-out",
                                            isActive ? "h-full" : "h-0",
                                            isSkipped && stepId < currentStep ? "bg-danger-red" : "bg-magic-green"
                                        )}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step Indicator */}
                        <div className="relative z-10 flex flex-col items-center mt-1 shrink-0">
                            <div
                                className={cn(
                                    "flex size-6 items-center justify-center rounded-full text-xs font-semibold shrink-0 bg-white border transition-colors duration-300 ease-in-out",
                                    (isSkipped && stepId < currentStep)
                                        ? "bg-danger-red border-danger-red text-white"
                                        : isCompleted
                                            ? "bg-magic-green border-magic-green text-white"
                                            : isCurrent
                                                ? "border-magic-green text-primary"
                                                : "border-slate-300 text-slate-400"
                                )}
                            >
                                {(isSkipped && stepId < currentStep) ? (
                                    <Ban className="size-3.5 stroke-3 text-white" />
                                ) : isCompleted ? (
                                    <Check className="size-3.5 stroke-3" />
                                ) : (
                                    <span>{stepId}</span>
                                )}
                            </div>
                        </div>

                        {/* Step Content */}
                        <div className="flex flex-col pb-7">
                            <span
                                className={cn(
                                    "text-sm font-bold mt-0.75",
                                    isUpcoming || isSkipped ? "text-slate-400" : "text-foreground/80"
                                )}
                            >
                                {metadata.title}
                            </span>
                            <span className="text-xs text-foreground/40 font-medium">
                                {metadata.subtitle}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
