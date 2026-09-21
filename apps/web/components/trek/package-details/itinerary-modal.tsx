"use client";

import Image from "next/image";
import { Mountain, Car, Route, ArrowRight, Download, ArrowLeft, Check } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@repo/ui/components/dialog";
import { useState, Fragment } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { motion, AnimatePresence } from "motion/react";

interface ItineraryDay {
    day: string;
    title: string;
    altitude: string;
    duration: string;
    distance: string;
    description: string;
    image: string;
}

interface ItineraryModalProps {
    days: ItineraryDay[];
}

export default function ItineraryModal({ days }: ItineraryModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);

    const nextDay = () => {
        if (selectedDayIndex < days.length - 1) setSelectedDayIndex(prev => prev + 1);
    };

    const prevDay = () => {
        if (selectedDayIndex > 0) setSelectedDayIndex(prev => prev - 1);
    };

    const selectedDay = days[selectedDayIndex];

    return (
        <>
            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8">
                <Button
                    onClick={() => {
                        setSelectedDayIndex(0);
                        setIsOpen(true);
                    }}
                    className="w-full sm:w-auto px-6 h-12 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white cursor-pointer text-base font-semibold transition-all"
                >
                    View Full {days.length} Day Itinerary
                    <ArrowRight className="size-4.5 ml-2" />
                </Button>
                <Button
                    variant={"ghost"}
                    className="cursor-pointer h-12 hover:bg-transparent hover:text-primary text-base font-semibold"
                >
                    <Download className="size-5 mr-2" />
                    Download Itinerary
                </Button>
            </div>

            {/* Full Itinerary Modal */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-[95vw] sm:max-w-[1020px] p-9 rounded-3xl gap-0">
                    <VisuallyHidden>
                        <DialogTitle>Full Itinerary</DialogTitle>
                        <DialogDescription>Detailed day-by-day breakdown</DialogDescription>
                    </VisuallyHidden>

                    {/* Header */}
                    <div className="mb-6">
                        <h2 className="text-[26px] font-bold text-foreground">
                            <span className="text-primary">Itinerary</span> for Kashmir Great Lakes Trek
                        </h2>
                        <h3 className="text-base font-bold text-foreground mt-4 mb-2">Be trek-ready with the right essentials</h3>
                        <p className="text-base text-muted-foreground max-w-4xl leading-relaxed">
                            Every trek requires a basic set of gear to ensure safety, comfort, and enjoyment. Don&#39;t worry — we&#39;ve created a simple, difficulty-based checklist to help you pack smart.
                        </p>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-4 mb-9">
                        <button
                            onClick={prevDay}
                            disabled={selectedDayIndex === 0}
                            className="shrink-0 flex items-center justify-center size-10 rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                            <ArrowLeft className="size-5" />
                        </button>

                        <div className="flex-1 flex items-center justify-between relative px-2">
                            {/* Continuous Background Line */}
                            <div className="absolute left-[24px] right-[24px] top-1/2 -translate-y-1/2 h-[2px] z-0">
                                <div className="w-full h-full bg-zinc-100 absolute left-0 top-0" />
                                <div
                                    className="h-full bg-primary absolute left-0 top-0 transition-all duration-700 ease-in-out"
                                    style={{ width: `${(selectedDayIndex / (days.length - 1)) * 100}%` }}
                                />
                            </div>

                            {days.map((day, idx) => {
                                const isCompleted = idx < selectedDayIndex;
                                const isActive = idx === selectedDayIndex;
                                const isUpcoming = idx > selectedDayIndex;

                                return (
                                    <div key={idx} className="relative flex flex-col items-center cursor-pointer group z-10" onClick={() => setSelectedDayIndex(idx)}>
                                        <div className="bg-white p-1 rounded-full">
                                            <div className={`size-6 rounded-full border-[2.5px] flex items-center justify-center transition-all duration-300
                                                ${isCompleted ? 'border-primary bg-primary text-white' : ''}
                                                ${isActive ? 'border-primary ring-4 ring-primary/20' : ''}
                                                ${isUpcoming ? 'border-zinc-200 group-hover:border-zinc-300' : ''}
                                            `}>
                                                {isCompleted && <Check className="size-3.5" strokeWidth={3} />}
                                                {isActive && <span className="rounded-full bg-primary size-full border-3 border-white" />}
                                            </div>
                                        </div>
                                        <span className={`absolute top-9.5 text-xs font-bold whitespace-nowrap transition-colors duration-300
                                            ${isActive ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-zinc-400'}
                                        `}>
                                            Day {String(idx + 1).padStart(2, '0')}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            onClick={nextDay}
                            disabled={selectedDayIndex === days.length - 1}
                            className="shrink-0 flex items-center justify-center size-10 rounded-full bg-primary text-white hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                            <ArrowRight className="size-5" />
                        </button>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col md:flex-row gap-6 mt-4">
                        {/* Image Carousel */}
                        <div className="relative w-full md:w-[42%] aspect-12/9 rounded-2xl overflow-hidden shrink-0 bg-zinc-100">
                            <AnimatePresence initial={false}>
                                <motion.div
                                    key={selectedDayIndex}
                                    initial={{ opacity: 0, scale: 1.08 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                    className="absolute inset-0 w-full h-full"
                                >
                                    <Image
                                        src={selectedDay.image}
                                        alt={selectedDay.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </motion.div>
                            </AnimatePresence>

                            <div className="absolute top-4 left-4 px-3 py-1.5 bg-primary/90 backdrop-blur-sm text-white text-xs tracking-wider font-semibold rounded-xl z-10 overflow-hidden flex items-center justify-center min-w-[74px]">
                                <span className="mr-1">STEP</span>
                                <AnimatePresence mode="popLayout" initial={false}>
                                    <motion.span
                                        key={selectedDayIndex}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -15 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="block whitespace-nowrap tabular-nums"
                                    >
                                        {String(selectedDayIndex + 1).padStart(2, '0')}
                                    </motion.span>
                                </AnimatePresence>
                            </div>

                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-center py-2 overflow-hidden">
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={selectedDayIndex}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="flex flex-col"
                                >
                                    <h3 className="text-[24px] font-bold text-foreground mb-4 leading-snug">
                                        {selectedDay.title}
                                    </h3>

                                    <div className="flex items-center gap-3 flex-wrap mb-4">
                                        {selectedDay.altitude && (
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-100 text-xs font-bold text-zinc-600">
                                                <Mountain className="size-3.5" />
                                                {selectedDay.altitude}
                                            </div>
                                        )}
                                        {selectedDay.duration && (
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-100 text-xs font-bold text-zinc-600">
                                                <Car className="size-3.5" />
                                                {selectedDay.duration}
                                            </div>
                                        )}
                                        {selectedDay.distance && (
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-100 text-xs font-bold text-zinc-600">
                                                <Route className="size-3.5" />
                                                {selectedDay.distance}
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-base text-foreground">
                                        {selectedDay.description}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
