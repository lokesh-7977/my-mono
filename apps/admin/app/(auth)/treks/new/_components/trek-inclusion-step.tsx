"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Info, CircleCheck, XCircle, CirclePlus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import FormInput from "@/components/shared/form-input";
import FormTextArea from "@/components/shared/form-textarea";

type InclusionStatus = 'yes' | 'no' | null;

interface InclusionItem {
    id: string;
    text: string;
    status: InclusionStatus;
}

interface RequirementItem {
    id: string;
    text: string;
}

function InclusionRow({
    item,
    onChange,
    onDelete,
    onEnter,
    inputRef
}: {
    item: InclusionItem,
    onChange: (updates: Partial<InclusionItem>) => void,
    onDelete: () => void,
    onEnter: () => void,
    inputRef: (el: HTMLTextAreaElement | null) => void
}) {
    const [isActive, setIsActive] = useState(!item.text);
    const containerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const handleRef = (el: HTMLTextAreaElement | null) => {
        // Auto-focus on initial mount if the item is empty
        if (el && !textareaRef.current && !item.text) {
            el.focus();
        }
        textareaRef.current = el;
        inputRef(el);
    };

    const handleBlur = (e: React.FocusEvent) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
            setIsActive(false);
        }
    };

    const handleFocus = () => {
        setIsActive(true);
    };

    return (
        <div
            className="flex items-start gap-3"
            ref={containerRef}
            onBlur={handleBlur}
            onFocus={handleFocus}
            tabIndex={-1}
        >
            <div className="flex-1 -mb-1.5 relative">
                <textarea
                    ref={handleRef}
                    rows={1}
                    value={item.text}
                    onChange={(e) => onChange({ text: e.target.value })}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            onEnter();
                        }
                    }}
                    placeholder="E.g., Accommodation, Transport, Meals..."
                    className={cn(
                        "w-full border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed overflow-hidden field-sizing-content transition-colors",
                        (item.text || isActive) && item.status === 'yes' ? "border-magic-green" :
                            (item.text || isActive) && item.status === 'no' ? "border-red-400" :
                                "border-border"
                    )}
                />
            </div>


            <div className="flex items-center gap-1 shrink-0 border h-9.5 px-1 rounded-full">
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => { onChange({ status: 'yes' }); textareaRef.current?.focus(); }}
                    className={cn(
                        "flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-full font-bold text-sm transition-colors",
                        item.status === 'yes' ? "bg-magic-green w-16.5 text-white shadow-sm" :
                            item.status === 'no' ? "bg-white border border-transparent hover:bg-slate-50" :
                                "bg-white border border-border text-foreground hover:bg-slate-50"
                    )}
                >
                    <CircleCheck className={cn("w-4 h-4", item.status === 'yes' ? "text-white" : item.status === 'no' ? "text-magic-green" : "text-magic-green")} /> {item.status === "yes" && "Yes"}
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => { onChange({ status: 'no' }); textareaRef.current?.focus(); }}
                    className={cn(
                        "flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-full font-bold text-sm transition-colors",
                        item.status === 'no' ? "bg-red-500 w-16.5 text-white shadow-sm" :
                            item.status === 'yes' ? "bg-white border border-transparent text-foreground hover:bg-slate-50" :
                                "bg-white border border-border text-foreground hover:bg-slate-50"
                    )}
                >
                    <XCircle className={cn("w-4 h-4", item.status === 'no' ? "" : "text-red-500")} /> {item.status === "no" && "No"}
                </button>
            </div>

            <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={onDelete}
                className="p-2.5 h-9.5 flex items-center rounded-lg bg-white border border-red-100 text-red-500 hover:bg-red-50 transition-colors shrink-0"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
}

function RequirementRow({
    text,
    onChange,
    onDelete,
    onEnter,
    inputRef
}: {
    id: string,
    text: string,
    onChange: (text: string) => void,
    onDelete: () => void,
    onEnter: () => void,
    inputRef: (el: HTMLTextAreaElement | null) => void
}) {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const handleRef = (el: HTMLTextAreaElement | null) => {
        // Auto-focus on initial mount if the item is empty
        if (el && !textareaRef.current && !text) {
            el.focus();
        }
        textareaRef.current = el;
        inputRef(el);
    };

    return (
        <div className="flex items-start gap-3">
            <textarea
                ref={handleRef}
                rows={1}
                value={text}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        onEnter();
                    }
                }}
                placeholder="Item name (e.g. Trekking shoes, Water bottle)"
                className="flex-1 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary resize-none leading-relaxed overflow-hidden field-sizing-content transition-colors"
            />
            <button
                type="button"
                onClick={onDelete}
                className="p-2.5 rounded-lg bg-white border border-red-100 text-red-500 hover:bg-red-50 transition-colors shrink-0"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
}

import { PackageDetails } from "../page";

interface TrekInclusionStepProps {
    data: PackageDetails;
    onChange: React.Dispatch<React.SetStateAction<PackageDetails>>;
    requiredFields: string[];
    onNext: () => void;
    onBack: () => void;
}

export default function TrekInclusionStep({ data, requiredFields, onChange, onNext, onBack }: TrekInclusionStepProps) {
    const [inclusions, setInclusions] = useState<InclusionItem[]>(
        data.inclusions.map(inc => ({ id: crypto.randomUUID(), text: inc.item, status: inc.status as InclusionStatus }))
    );
    const [requirements, setRequirements] = useState<RequirementItem[]>(
        data.requirements.map(req => ({ id: crypto.randomUUID(), text: req }))
    );

    // Sync inclusions back to parent state
    useEffect(() => {
        onChange(prev => ({
            ...prev,
            inclusions: inclusions.map(inc => ({ item: inc.text, status: inc.status as 'yes' | 'no' }))
        }));
    }, [inclusions, onChange]);

    // Sync requirements back to parent state
    useEffect(() => {
        onChange(prev => ({
            ...prev,
            requirements: requirements.map(req => req.text)
        }));
    }, [requirements, onChange]);

    const inclusionRefs = useRef<Map<string, HTMLTextAreaElement>>(new Map());
    const requirementRefs = useRef<Map<string, HTMLTextAreaElement>>(new Map());

    const addInclusion = () => {
        const emptyItem = inclusions.find(inc => inc.text.trim() === '');
        if (emptyItem) {
            inclusionRefs.current.get(emptyItem.id)?.focus();
            return;
        }
        setInclusions([...inclusions, { id: Date.now().toString(), text: '', status: 'yes' }]);
    };

    const updateInclusion = (id: string, updates: Partial<InclusionItem>) => {
        setInclusions(inclusions.map(inc => inc.id === id ? { ...inc, ...updates } : inc));
    };

    const deleteInclusion = (id: string) => {
        setInclusions(inclusions.filter(inc => inc.id !== id));
    };

    const addRequirement = () => {
        const emptyReq = requirements.find(req => req.text.trim() === '');
        if (emptyReq) {
            requirementRefs.current.get(emptyReq.id)?.focus();
            return;
        }
        setRequirements([...requirements, { id: Date.now().toString(), text: '' }]);
    };

    const updateRequirement = (id: string, text: string) => {
        setRequirements(requirements.map(req => req.id === id ? { ...req, text } : req));
    };

    const deleteRequirement = (id: string) => {
        setRequirements(requirements.filter(req => req.id !== id));
    };

    return (
        <div className="w-full pb-24">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bricolage-grotesque font-bold text-foreground mb-2">
                        Inclusion & Requirements
                    </h1>
                    <p className="text-muted-foreground">
                        Define what is covered in the package and what trekkers need to prepare.
                    </p>
                </div>
            </div>

            <div className="bg-white border border-border/60 rounded-2xl p-8 shadow-sm mb-6">
                {/* Package Details Section */}
                <div className="mb-12">
                    <h2 className="text-[22px] font-bold text-foreground mb-2 font-bricolage-grotesque">
                        Package Details
                    </h2>
                    <div className="border-b border-border/40 w-full mb-6" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                        <FormInput
                            label={<span>Base price {requiredFields.includes("pricing") && <span className="text-red-500">*</span>}</span>}
                            value={data.pricing || ""}
                            onChange={(val) => onChange(prev => ({ ...prev, pricing: val }))}
                            placeholder="Add Base price"
                            type="number"
                        />

                        <FormInput
                            label={<span>Approx. Group Size {requiredFields.includes("group_size") && <span className="text-red-500">*</span>}</span>}
                            value={data.group_size || ""}
                            onChange={(val) => onChange(prev => ({ ...prev, group_size: val }))}
                            placeholder="Add Approx. capacity of your Groups"
                            type="number"
                        />
                    </div>


                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <CircleCheck className="w-5 h-5 text-primary" />
                            <h3 className="font-bold text-foreground">What&apos;s Included or Excluded?</h3>
                        </div>
                        <button
                            onClick={addInclusion}
                            className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-colors"
                        >
                            <CirclePlus className="size-4" />
                        </button>
                    </div>

                    {inclusions.length === 0 ?
                        <p className="p-4 text-center w-full border border-border rounded-xl text-foreground/50">No inclusions added yet</p>
                        :
                        <div className="bg-white rounded-xl border border-border p-4 space-y-3">
                            {inclusions.map((item, index) => (
                                <InclusionRow
                                    key={item.id}
                                    item={item}
                                    onChange={(updates) => updateInclusion(item.id, updates)}
                                    onDelete={() => deleteInclusion(item.id)}
                                    inputRef={(el) => {
                                        if (el) inclusionRefs.current.set(item.id, el);
                                        else inclusionRefs.current.delete(item.id);
                                    }}
                                    onEnter={() => {
                                        if (index === inclusions.length - 1) {
                                            addInclusion();
                                        } else {
                                            const nextId = inclusions[index + 1].id;
                                            inclusionRefs.current.get(nextId)?.focus();
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    }
                </div>


                {/* Trekker Requirements Section */}
                <div>
                    <h2 className="text-[22px] font-bold text-foreground mb-2 font-bricolage-grotesque">
                        Trekker Requirements
                    </h2>

                    <div className="border-b border-border/40 w-full mb-6"></div>


                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-foreground mb-1">Things to Carry / Packing List</h3>
                                <p className="text-sm text-primary">Provide a comprehensive list of gear the trekker must bring.</p>
                            </div>
                            <button
                                onClick={addRequirement}
                                className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-colors"
                            >
                                <CirclePlus className="size-4" />
                            </button>
                        </div>

                        {requirements.length === 0
                            ? <p className="p-4 text-center w-full border border-border rounded-xl text-foreground/50">
                                No requirements added yet
                            </p>
                            :
                            <div className="bg-white rounded-xl border border-border p-4 space-y-3">
                                {requirements.map((req, index) => (
                                    <RequirementRow
                                        key={req.id}
                                        id={req.id}
                                        text={req.text}
                                        onChange={(text) => updateRequirement(req.id, text)}
                                        onDelete={() => deleteRequirement(req.id)}
                                        inputRef={(el) => {
                                            if (el) requirementRefs.current.set(req.id, el);
                                            else requirementRefs.current.delete(req.id);
                                        }}
                                        onEnter={() => {
                                            if (index === requirements.length - 1) {
                                                addRequirement();
                                            } else {
                                                const nextId = requirements[index + 1].id;
                                                requirementRefs.current.get(nextId)?.focus();
                                            }
                                        }}
                                    />
                                ))}
                            </div>}
                    </div>

                    <div>
                        <FormTextArea
                            label={<span>Physical Fitness & Experience Required {requiredFields.includes("fitness_description") && <span className="text-red-500">*</span>}</span>}
                            value={data.fitness_description || ""}
                            onChange={(val) => onChange(prev => ({ ...prev, fitness_description: val }))}
                            placeholder="Describe the fitness level required. e.g., 'Participants must be able to jog 5km in 30 minutes. Previous high-altitude experience is recommended but not mandatory.'"
                            inputClassName="h-32 resize-none bg-secondary/10"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-8 mt-8 border-t border-border/40">
                    <Button variant="ghost" onClick={onBack} className="text-foreground font-bold rounded-xl px-6 h-11">
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