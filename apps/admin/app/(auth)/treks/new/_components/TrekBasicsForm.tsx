"use client";
import { toast } from "sonner";
import { Info, ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";

import { PackageDetails } from "../page";
import FormTextArea from "@/components/shared/form-textarea";
import FormInput from "@/components/shared/form-input";
import FormSelect from "@/components/shared/form-select";
import { getDifficultySVG } from "@/components/icons/get-difficulty-icon";
import DragDropFileUpload from "@/components/shared/drag-drop-file-upload";
import FormLabel from "@/components/shared/form-label";
import ImagePlusIcon from "@/components/icons/image-plus-icon";

const DIFFICULTIES = ["Easy", "Moderate", "Difficult", "Pro"];

interface TrekBasicsFormProps {
  data: PackageDetails;
  requiredFields: string[];
  onChange: React.Dispatch<React.SetStateAction<PackageDetails>>;
  onNext: () => void;
  onBack: () => void;
}

const region = [
  { id: "1", title: "Himachal Pradesh" },
  { id: "2", title: "Uttarakhand" },
  { id: "3", title: "Ladakh" },
]

export const TrekBasicsForm = ({ data, requiredFields, onChange, onNext, onBack }: TrekBasicsFormProps) => {

  const handleNext = () => {
    const missingFields = requiredFields.filter(field => {
      const val = data[field as keyof PackageDetails];
      if (Array.isArray(val)) return val.length === 0;
      if (typeof val === "string") return val.trim() === "";
      return !val;
    });

    if (missingFields.length > 0) {
      toast.error("Please fill out all required fields before continuing.");
      return;
    }

    if (data.gallery.length < 5) {
      toast.error("Please upload at least 5 images for the gallery.");
      return;
    }

    onNext();
  };

  return (
    <div className="w-full pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bricolage-grotesque font-bold text-foreground mb-2">
          Trek Basics
        </h1>
        <p className="text-muted-foreground">
          Start by adding the fundamental details of your trek listing.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white border border-border/60 rounded-2xl p-8 shadow-sm mb-6">
        <div className="space-y-8">

          <FormInput
            label={"Trek Name"}
            value={data.name || ""}
            onChange={(val) => onChange(prev => ({ ...prev, name: val }))}
            placeholder="e.g. Hampta Pass Trek"
            maxLength={100}
            required={requiredFields.includes("name")}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSelect
              label="Region / State"
              value={data.region || ""}
              onChange={(val) => onChange(prev => ({ ...prev, region: val }))}
              required={requiredFields.includes("region")}
              disabled={data.ativity_type === "trek"}
              options={region.map(r => ({ value: r.id, label: r.title }))}
              placeholder="Select a region"
            />

            <FormInput
              label={"Distance"}
              value={data.distance || ""}
              onChange={(val) => onChange(prev => ({ ...prev, distance: val }))}
              placeholder="0"
              unit="KM"
              type="number"
              maxLength={6}
              required={requiredFields.includes("distance")}
            />
          </div>

          {/* Difficulty Level */}
          <div className="space-y-2">
            <FormLabel label="Difficulty Level" required={requiredFields.includes("difficulty")} />
            <div className="flex h-auto items-center gap-2 bg-[#F6F8F6] p-1 rounded-xl border border-border/60">
              {DIFFICULTIES.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => onChange(prev => ({ ...prev, difficulty: level }))}
                  className={cn(
                    "flex-1 rounded-lg text-base font-medium transition-all flex items-center justify-center gap-3 h-13 cursor-pointer",
                    data.difficulty === level
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {getDifficultySVG(level.toLowerCase(), "35px", "35px")} {level}
                </button>
              ))}
            </div>
          </div>

          {/* <div className="space-y-2"> */}
          <FormTextArea
            label={"Intro"}
            value={data.intro}
            onChange={(val) => onChange(prev => ({ ...prev, intro: val }))}
            placeholder="Describe the highlights of this trek..."
            maxLength={650}
            inputClassName="h-32.5 resize-none bg-[#F6F8F6]"
            required={requiredFields.includes("intro")}
          />

          <div className="space-y-2">
            <FormLabel label="Image Gallery" required={requiredFields.includes("gallery")} />
            <DragDropFileUpload
              initialFiles={data.gallery}
              maxFiles={10}
              headerIcon={ImagePlusIcon}
              onFilesChange={(newFiles) => onChange(prev => ({ ...prev, gallery: newFiles }))}
            >
              {/* The render prop pattern gives you direct access to the internal state */}
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

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-8 mt-8 border-t border-border/40">
          <Button onClick={onBack} variant="ghost" className="text-foreground font-bold rounded-xl px-6 h-11">
            Back
          </Button>
          <Button onClick={handleNext} className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-xl px-6 h-11 font-bold group">
            Next Step
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Pro Tip */}
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
};
