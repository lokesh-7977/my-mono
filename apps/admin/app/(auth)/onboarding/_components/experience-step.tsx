"use client";
import { useState } from "react";
import FormInput from "@/components/shared/form-input";
import FormMultiSelect from "@/components/shared/form-multi-select";
import FormTextArea from "@/components/shared/form-textarea";
import { RotateCcw, Trash2 } from "lucide-react";
import DragDropFileUpload from "@/components/shared/drag-drop-file-upload";
import FormLabel from "@/components/shared/form-label";
import { cn } from "@/lib/utils";
import TrekkerIcon from "@/components/icons/trekker-icon";
import { Button } from "@/components/ui/button";
import ImagePlusIcon from "@/components/icons/image-plus-icon";
const region = [
    { id: "1", title: "Himachal Pradesh" },
    { id: "2", title: "Uttarakhand" },
    { id: "3", title: "Ladakh" },
]
export default function ExperienceStep({ }) {
    const [regions, setRegions] = useState<string[]>([])
    const [latestExp, setLatestExp] = useState("");
    return (
        <>
            <div className={cn(
                "relative rounded-2xl p-4 border transition-all duration-200 flex flex-col h-auto",
                "border-primary/50 bg-primary/10"
            )}>
                <div className="flex justify-between items-center mb-4">
                    <div className="size-10 rounded-[9px] bg-primary-900 flex items-center justify-center text-white shrink-0">
                        <TrekkerIcon size={21} />
                    </div>

                    <Button
                        variant={"secondary"}
                        className="bg-[#F0F0F080] border border-border rounded-xl cursor-pointer"
                    >
                        <RotateCcw />
                        Change
                    </Button>
                </div>

                <h4 className={cn(
                    "text-base font-bold mb-2",
                    "text-primary",
                )}>
                    Trek Leader
                </h4>
                <p className={cn(
                    "text-xs font-medium mb-4 leading-relaxed",
                    "text-foreground",
                )}>
                    IMF / NIM certified. Leads groups on Himalayan trails. Creates and sells named trek packages.
                </p>
                <div className="flex flex-wrap gap-2 mb-1">
                    {["BMC/IMF certified", "2 Years Exp", "10% commission"].map((tag, idx) => (
                        <span
                            key={idx}
                            className={cn(
                                "text-xs font-medium px-2 py-1 rounded-md",
                                "bg-[#D1F2E7] text-primary-600"
                            )}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="space-y-1.5 pt-5">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                        label={"Years of experience"}
                        // value={data.distance || ""}
                        // onChange={(val) => onChange(prev => ({ ...prev, distance: val }))}
                        placeholder="Ex: 5"
                        type="number"
                        required
                    />

                    <FormInput
                        label={"Events Led/Organized"}
                        // value={data.distance || ""}
                        // onChange={(val) => onChange(prev => ({ ...prev, distance: val }))}
                        placeholder="Ex: 5 (Approx. count)"
                        type="number"
                        required
                    />
                </div>


                <FormMultiSelect
                    label={"Region you've worked in"}
                    values={regions}
                    onChange={setRegions}
                    placeholder="Select regions"
                    required
                    options={region.map(r => ({ value: r.id, label: r.title }))}
                />

                <FormTextArea
                    label={"Briefly describe your most recent adventure"}
                    value={latestExp}
                    onChange={(val) => setLatestExp(val)}
                    placeholder="Briefly describe your most recent adventure..."
                    maxLength={2500}
                    inputClassName="min-h-50 h-50 max-h-[600px] bg-[#F6F8F6]"
                    required
                />


                <div className="space-y-2">
                    <FormLabel label="Photos of your adventure" required />
                    <DragDropFileUpload
                        initialFiles={[]}
                        className="h-55!"
                        // size="small"
                        maxFiles={3}
                        headerIcon={ImagePlusIcon}
                    //   onFilesChange={(newFiles) => onChange(prev => ({ ...prev, gallery: newFiles }))}
                    >
                        {({ files, removeFile }) => (
                            <div className="flex gap-4 mt-4 overflow-x-auto">
                                {files.map((file, index) => (
                                    <div key={file.id} className="relative size-30 rounded-lg overflow-hidden shrink-0 flex items-center justify-center group after:absolute after:inset-0 after:bg-black/15 after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-200">
                                        {/* eslint-disable-next-line */}
                                        <img src={file.preview} className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-[background,color,opacity] duration-200 size-9.5 cursor-pointer opacity-0 absolute z-100 bg-white text-red-500 rounded-xl flex"
                                        >
                                            <Trash2 className="w-5 h-5 m-auto" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </DragDropFileUpload>
                </div>
            </div>
        </>

    );
}