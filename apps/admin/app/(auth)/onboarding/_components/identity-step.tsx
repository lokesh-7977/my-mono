"use client";
import CameraPlus from "@/components/icons/camera-plus";
import FormInput from "@/components/shared/form-input";
import FormSelect from "@/components/shared/form-select";
import { Button } from "@repo/ui/components/button";
import { LockKeyhole, Plus } from "lucide-react";
import FormTextArea from "@/components/shared/form-textarea";
import { Checkbox } from "@repo/ui/components/checkbox";
import { useState } from "react";
import FormMultiSelect from "@/components/shared/form-multi-select";

const region = [
    { id: "1", title: "Himachal Pradesh" },
    { id: "2", title: "Uttarakhand" },
    { id: "3", title: "Ladakh" },
]

export default function IdentityStep() {
    const [isAddSame, setIsAddSame] = useState(false);
    const [selectedLanguages, setSelectedLaguages] = useState<string[]>([]);
    return (
        <>
            <div className="border-b border-border pb-6 flex items-center">
                <div className="size-28 mr-5 relative">
                    <span className="size-full border-dashed border-2 border-[#8E9EAB] flex items-center justify-center bg-[#F2F2F2] rounded-full">
                        <CameraPlus className="size-8 text-[#8E9EAB]" />
                    </span>
                    <Button size={"icon-sm"} className="rounded-full absolute bottom-0 right-0.5 size-8 hover:bg-primary-300 cursor-pointer transition-all duration-200 ">
                        <Plus className="size-4 stroke-4" />
                    </Button>
                </div>
                <div>
                    <h5 className="text-lg font-semibold">Profile Photo*</h5>
                    <p className="text-sm text-foreground/50">Upload a clear photo of yourself. This builds trust with travelers.</p>
                </div>
            </div>

            <div className="pt-4 pb-3 space-y-1.5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                        label={"First Name"}
                        // value={data.distance || ""}
                        // onChange={(val) => onChange(prev => ({ ...prev, distance: val }))}
                        placeholder="First Name"
                        type="text"
                        required
                    />


                    <FormInput
                        label={"Last Name"}
                        // value={data.distance || ""}
                        // onChange={(val) => onChange(prev => ({ ...prev, distance: val }))}
                        placeholder="Last Name"
                        type="text"
                        required
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                        label={"Mobile Number"}
                        // value={data.distance || ""}
                        // onChange={(val) => onChange(prev => ({ ...prev, distance: val }))}
                        placeholder="Mobile Number"
                        type="text"
                        required
                    />


                    <FormInput
                        label={"Email"}
                        // value={data.distance || ""}
                        // onChange={(val) => onChange(prev => ({ ...prev, distance: val }))}
                        placeholder="Email"
                        type="text"
                        required
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormSelect
                        label="Region / State"
                        // value={data.region || ""}
                        // onChange={(val) => onChange(prev => ({ ...prev, region: val }))}
                        required
                        options={region.map(r => ({ value: r.id, label: r.title }))}
                        placeholder="Select a region"
                    />


                    <FormMultiSelect
                        label={"Languages spoken"}
                        values={selectedLanguages}
                        onChange={setSelectedLaguages}
                        placeholder="Languages spoken"
                        required
                        options={[
                            { label: "English", value: "en" },
                            { label: "Hindi", value: "hi" },
                            { label: "French", value: "fr" },
                            { label: "Spanish", value: "es" },
                            { label: "German", value: "de" },
                            { label: "Chinese", value: "zh" },
                            { label: "Japanese", value: "ja" },
                            { label: "Korean", value: "ko" },
                            { label: "Russian", value: "ru" },
                            { label: "Italian", value: "it" },
                        ]}
                    />
                </div>

                <FormTextArea
                    label={"Current Address"}
                    value={""}
                    // onChange={(val) => onChange(prev => ({ ...prev, intro: val }))}
                    placeholder="Your current address where you live..."
                    maxLength={500}
                    inputClassName="h-32.5 resize-none bg-[#F6F8F6]"
                    required
                />

                <div className="flex items-center gap-2 pb-3">
                    <Checkbox
                        checked={isAddSame}
                        onCheckedChange={(checked) => setIsAddSame(checked === true)}
                        id="isSame" className="cursor-pointer bg-[#F6F8F6]"
                    />
                    <label htmlFor="isSame">Permanent Address is same as current address.</label>
                </div>

                {!isAddSame &&
                    <FormTextArea
                        label={"Permanent Address"}
                        value={""}
                        // onChange={(val) => onChange(prev => ({ ...prev, intro: val }))}
                        placeholder="Your permanent address..."
                        maxLength={500}
                        inputClassName="h-32.5 resize-none bg-[#F6F8F6]"
                        required
                    />
                }
            </div>

            <div className="w-full text-xs font-semibold rounded-xl p-4 border border-[#EF7D00] bg-[#EF7D00]/10">
                <LockKeyhole className="size-3.5 inline mr-2 mb-0.5 shrink-0" />
                Your data is securely stored and encrypted. We only share your contact details with confirmed trekkers for coordination purposes.
            </div>

        </>
    );
}