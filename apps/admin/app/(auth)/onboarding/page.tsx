"use client";

import { useState } from "react";
import { Navbar } from "@/components/shared/navbar";
import Sidebar from "./_components/sidebar";
import { Button } from "@/components/ui/button";
import IdentityStep from "./_components/identity-step";
import FormFooter from "./_components/form-footer";
import RoleStep from "./_components/role-step";
import ExperienceStep from "./_components/experience-step";
import CertificateStep from "./_components/certificate-step";

export const STEPS = {
    IDENTITY: 1,
    ROLE: 2,
    // EXPERTISE: 3,
    EXPERIENCE: 3,
    UPLOAD_CERTIFICATE: 4,
} as const;

export const STEP_METADATA = {
    [STEPS.IDENTITY]: {
        title: "Identity",
        subtitle: "Tell us about yourself",
        heading: "Let's get to know you",
        subheading: "Your profile helps trekkers verify who you are. This information builds trust in the Scoutripper community.",
    },
    [STEPS.ROLE]: {
        title: " Choose the role",
        subtitle: "Tell us about yourself",
        heading: "What best describes your role?",
        subheading: "Choose the role that best fits how you'll work with Scoutripper. Your onboarding, certification requirements, and profile type will be tailored to your selection.",
    },
    // [STEPS.EXPERTISE]: {
    //     title: "Expertise",
    //     subtitle: "Tell us about yourself",
    //     heading: "What is your Philosophy",
    //     subheading: "Share your core beliefs and approach to trekking and guiding.",
    // },
    [STEPS.EXPERIENCE]: {
        title: "Share Experience",
        subtitle: "Tell us about yourself",
        heading: "Share Experience",
        subheading: "This information helps trekkers understand your experience level and builds trust in your leadership on the trail.",
    },
    [STEPS.UPLOAD_CERTIFICATE]: {
        title: "Upload Certificate",
        subtitle: "Tell us about yourself",
        heading: "Certifications & Training",
        subheading: "Showcase your expertise to build trust with trekkers.",
    }
};

export default function Page() {
    const [currentStep, setCurrentStep] = useState<number>(STEPS.IDENTITY);
    const [skippedSteps,] = useState<number[]>([]);

    const handlePrevious = () => {
        setCurrentStep(prev => {
            let next = prev - 1;
            while (skippedSteps.includes(next) && next > 0) next--;
            return next;
        });
    };

    const handleNext = () => {
        setCurrentStep(prev => {
            let next = prev + 1;
            while (skippedSteps.includes(next) && next <= Object.keys(STEPS).length) next++;
            return next;
        });
    };

    return <main className="min-h-screen bg-[#F6F8F6F2] flex flex-col">
        <Navbar />
        <div className="flex flex-1 w-full mx-auto">
            <Sidebar currentStep={currentStep} skippedSteps={skippedSteps} />
            <div className="flex flex-col flex-1 p-5">
                <div>
                    <h2 className="text-3xl font-bold">
                        {STEP_METADATA[currentStep as keyof typeof STEP_METADATA].heading}
                    </h2>
                    <p className="text-base mb-5 max-w-235">
                        {STEP_METADATA[currentStep as keyof typeof STEP_METADATA].subheading}
                    </p>
                    <div className="bg-white rounded-md max-w-226 w-full p-8 border border-border">

                        {currentStep === STEPS.IDENTITY && <IdentityStep />}
                        {currentStep === STEPS.ROLE && <RoleStep />}
                        {currentStep === STEPS.EXPERIENCE && <ExperienceStep />}
                        {currentStep === STEPS.UPLOAD_CERTIFICATE && <CertificateStep />}
                        <FormFooter />

                    </div>
                </div>
                <div className="flex items-center gap-4 mt-10">
                    <Button
                        variant="outline"
                        disabled={currentStep === STEPS.IDENTITY}
                        onClick={handlePrevious}
                    >
                        Previous
                    </Button>
                    <Button
                        disabled={currentStep === STEPS.UPLOAD_CERTIFICATE}
                        onClick={handleNext}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    </main>
}