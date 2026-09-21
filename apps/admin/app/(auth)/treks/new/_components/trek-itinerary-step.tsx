import { Button } from "@repo/ui/components/button";
import { ArrowRight, Info, Mountain, Car, Clock, Route, AlertCircle, Pencil } from "lucide-react";
import Image from "next/image";

import { PackageDetails } from "../page";
import { isItemValid } from "./itinerary-editor";

interface TrekItineraryStepProps {
    data: PackageDetails;
    onNext: () => void;
    onOpenEditor: () => void;
    onBack: () => void;
}

export default function TrekItineraryStep({ data, onNext, onOpenEditor, onBack }: TrekItineraryStepProps) {
    const hasInvalidItems = data.itinerary.length > 0 && data.itinerary.some(item => !isItemValid(item, data.isMultiDayActivity ? 'multi' : 'single'));

    return (
        <div className="w-full pb-24">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bricolage-grotesque font-bold text-foreground mb-2">
                        Itinerary Setup
                    </h1>
                    <p className="text-muted-foreground">
                        Define the day-by-day schedule for your trek or import an existing itinerary.
                    </p>
                </div>
                {!hasInvalidItems && data.itinerary.length > 0 && <Button onClick={onOpenEditor} className="h-10 bg-[#F1F5F9] text-foreground font-medium text-sm">
                    <Pencil />
                    <span> Edit </span>
                </Button>}
            </div>

            <div className="bg-white border border-border/60 rounded-2xl p-8 shadow-sm mb-6">
                <div className="space-y-5">

                    {data.itinerary.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-border/60 rounded-2xl bg-slate-50/50">
                            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                                <Route className="w-8 h-8 text-primary/60" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">No Itinerary Added</h3>
                            <p className="text-muted-foreground text-sm max-w-[320px] mb-6">
                                Outline the daily schedule to show travelers exactly what they will experience.
                            </p>
                            <Button onClick={onOpenEditor} className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-xl px-6 h-11 font-bold">
                                Create Itinerary
                            </Button>
                        </div>
                    ) : hasInvalidItems ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-amber-500/40 rounded-2xl bg-amber-50/50">
                            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                                <AlertCircle className="w-8 h-8 text-amber-500" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">Itinerary is Incomplete</h3>
                            <p className="text-muted-foreground text-sm max-w-[320px] mb-6">
                                Some itinerary days are missing required details (title, description, or photos). Please finish filling them out.
                            </p>
                            <Button onClick={onOpenEditor} className="bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 rounded-xl px-6 h-11 font-bold">
                                Continue Editing
                            </Button>
                        </div>
                    ) : (
                        data.itinerary.map((item, index) => (
                            <div key={item.id} className="flex flex-col md:flex-row gap-6">
                                {/* Left Image */}
                                <div className="relative shrink-0 h-50 w-55 rounded-[20px] overflow-hidden">
                                    <Image fill src={item.image?.url || ""} alt={item.title || `Day ${index + 1}`} className="w-full h-full object-cover" />
                                    <div className="absolute top-4 left-4 bg-primary text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                        Day {String(index + 1).padStart(2, '0')}
                                    </div>
                                </div>

                                {/* Right Content */}
                                <div className="flex flex-col justify-center w-full">
                                    <h3 className="text-[22px] font-bold text-foreground mb-3 font-bricolage-grotesque">
                                        {item.title || "Untitled Day"}
                                    </h3>

                                    <div className="flex flex-wrap items-center gap-2 mb-4">
                                        {item.altitude && (
                                            <div className="flex items-center gap-1.5 bg-slate-100/80 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg">
                                                <Mountain className="w-3.5 h-3.5 text-slate-500" />
                                                {item.altitude}
                                            </div>
                                        )}
                                        {item.time && (
                                            <div className="flex items-center gap-1.5 bg-slate-100/80 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg">
                                                <Car className="w-3.5 h-3.5 text-slate-500" />
                                                {item.time}
                                            </div>
                                        )}
                                        {item.duration && (
                                            <div className="flex items-center gap-1.5 bg-slate-100/80 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg">
                                                <Clock className="w-3.5 h-3.5 text-slate-500" />
                                                {item.duration}
                                            </div>
                                        )}
                                        {item.distance && (
                                            <div className="flex items-center gap-1.5 bg-slate-100/80 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg">
                                                <Route className="w-3.5 h-3.5 text-slate-500" />
                                                {item.distance}
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-slate-600 text-[15px] leading-relaxed line-clamp-3">
                                        {item.description || "No description provided."}
                                    </p>
                                </div>
                            </div>
                        )))}
                </div>

                <div className="flex items-center justify-between pt-8 mt-8 border-t border-border/40">
                    <Button onClick={onBack} variant="ghost" className="text-foreground font-bold rounded-xl px-6 h-11">
                        Back
                    </Button>
                    <Button onClick={onNext} className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-xl px-6 h-11 font-bold group">
                        Next Step
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-2xl p-5 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-sm font-bold text-blue-900 mb-1">Pro Tip</h4>
                    <p className="text-sm text-blue-800/80">
                        Use high-quality landscape images for your cover photo. Treks with clear, vibrant photos get 40% more booking inquiries.
                    </p>
                </div>
            </div>
        </div>
    );
}   