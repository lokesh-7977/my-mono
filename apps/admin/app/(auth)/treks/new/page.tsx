"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/shared/navbar";
import { TrekStepper } from "./_components/TrekStepper";
import { TrekBasicsForm } from "./_components/TrekBasicsForm";
import ItineraryEditor, { ItineraryItem, baseItem, isItemValid } from "./_components/itinerary-editor";
import TrekItineraryStep from "./_components/trek-itinerary-step";
import TrekInclusionStep from "./_components/trek-inclusion-step";
import { SuccessStep } from "./_components/success-step";
import TrekSelectStep, { TrekItems } from "./_components/trek-select-step";

export const TAB_NAMES = {
  SELECT_TREK: "Select Trek",
  BASICS: "Basics",
  ITINERARY: "Itinerary",
  INCLUSIONS: "Inclusions",
  SUCCESS: "Success",
} as const;

const TABS: string[] = [
  TAB_NAMES.BASICS,
  TAB_NAMES.ITINERARY,
  TAB_NAMES.INCLUSIONS
];

export type PackageDetails = {
  ativity_type: string;
  baseTrekId: string;
  baseTrekName: string;
  name: string;
  region: string;
  distance: string;
  difficulty: string;
  intro: string;
  gallery: File[];
  itinerary: ItineraryItem[];
  isMultiDayActivity: boolean;
  inclusions: { item: string; status: 'yes' | 'no' }[];
  pricing: string;
  group_size: string;
  fitness_description: string;
  requirements: string[];
};

const BASE_PACKAGE_STATE = {
  ativity_type: "trek",
  baseTrekId: "",
  baseTrekName: "",
  name: "",
  region: "2",
  distance: "",
  difficulty: "Easy",
  intro: "",
  gallery: [],
  itinerary: [],
  inclusions: [],
  requirements: [],
  isMultiDayActivity: true,
  pricing: "",
  group_size: "",
  fitness_description: "",
}

const requiredForBasics = ["name", "region", "distance", "difficulty", "intro", "gallery"];
const requiredForItinerary = ["itinerary", "isMultiDayActivity"];
const requiredForInclusions = ["inclusions", "pricing", "group_size", "fitness_description", "requirements"];

const validateBasics = (data: PackageDetails) => {
  const missingFields = requiredForBasics.filter(field => {
    const val = data[field as keyof PackageDetails];
    if (Array.isArray(val)) return val.length === 0;
    if (typeof val === "string") return val.trim() === "";
    return !val;
  });
  if (missingFields.length > 0) return "Please fill out all required fields before navigating away.";
  if (data.gallery.length < 5) return "Please upload at least 5 images for the gallery.";
  return null;
};

const validateItinerary = (data: PackageDetails) => {
  const missingFields = requiredForItinerary.filter(field => {
    const val = data[field as keyof PackageDetails];
    if (field === "itinerary") {
      const itinerary = val as ItineraryItem[];
      if (itinerary.length < 3) return true;
      return itinerary.some(item => !isItemValid(item, data.isMultiDayActivity ? 'multi' : 'single'));
    }
    if (typeof val === "string") return val.trim() === "";
    return val === undefined || val === null;
  });

  if (missingFields.length > 0) {
    if (missingFields.includes("itinerary")) {
      const hasInvalidItem = data.itinerary.length >= 3 && data.itinerary.some(item => !isItemValid(item, data.isMultiDayActivity ? 'multi' : 'single'));
      if (data.itinerary.length < 3) return "Please add at least 3 itinerary items before navigating away.";
      if (hasInvalidItem) return "Please complete all required fields for every itinerary item (title, photo, description).";
    }
    return "Please fill out all required fields before navigating away.";
  }
  return null;
};

const validateInclusions = (data: PackageDetails) => {
  const missingFields = requiredForInclusions.filter(field => {
    const val = data[field as keyof PackageDetails];
    if (field === "inclusions") {
      const incs = val as { item: string, status: 'yes' | 'no' }[];
      if (incs.length === 0) return true;
      return incs.some(inc => !inc.item.trim() || !inc.status);
    }
    if (field === "requirements") {
      const reqs = val as string[];
      if (reqs.length === 0) return true;
      return reqs.some(req => typeof req !== 'string' || !req.trim());
    }
    if (Array.isArray(val)) return val.length === 0;
    if (typeof val === "string") return val.trim() === "";
    return !val;
  });

  if (missingFields.length > 0) {
    if (missingFields.includes("inclusions") || missingFields.includes("requirements")) {
      return "Please ensure all added inclusions and requirements are fully filled out, or remove empty ones.";
    }
    return "Please fill out all required fields before finishing.";
  }
  return null;
};

export default function NewTrekPage() {
  const [activeTab, setActiveTab] = useState<string>(TAB_NAMES.SELECT_TREK);
  const [isItineraryEditorOpen, setIsItineraryEditorOpen] = useState(false);
  const [packageDetails, setPackageDetails] = useState<PackageDetails>(BASE_PACKAGE_STATE as PackageDetails);

  const handleSelectChange = (trek: TrekItems) => {
    setPackageDetails(prev => ({
      ...prev,
      baseTrekId: trek.id,
      baseTrekName: trek.title,
      region: trek.regionId,
    }));
    setActiveTab(TAB_NAMES.BASICS);
  }

  const handleTabChange = (targetTab: string) => {
    const currentIndex = TABS.indexOf(activeTab);
    const targetIndex = targetTab === TAB_NAMES.SUCCESS ? TABS.length : TABS.indexOf(targetTab);

    // Only block navigation if the user is trying to move forward
    if (targetIndex > currentIndex) {
      if (activeTab === TAB_NAMES.BASICS) {
        const error = validateBasics(packageDetails);
        if (error) return toast.error(error);
      }
      if (activeTab === TAB_NAMES.ITINERARY) {
        const error = validateItinerary(packageDetails);
        if (error) return toast.error(error);
      }
      if (activeTab === TAB_NAMES.INCLUSIONS) {
        const error = validateInclusions(packageDetails);
        if (error) return toast.error(error);
      }
    }

    if (targetTab === TAB_NAMES.ITINERARY && packageDetails.itinerary.length === 0) {
      setPackageDetails(prev => ({
        ...prev,
        itinerary: [baseItem(crypto.randomUUID(), prev.isMultiDayActivity ? 'multi' : 'single')]
      }));
      setIsItineraryEditorOpen(true);
    } else {
      setIsItineraryEditorOpen(false); // Default to not showing editor when just clicking the tab if it has items
    }

    setActiveTab(targetTab);
  };

  return (
    <main className="min-h-screen bg-[#F6F8F6F2]">

      {
        isItineraryEditorOpen && activeTab === TAB_NAMES.ITINERARY ? (
          <ItineraryEditor
            items={packageDetails.itinerary}
            setItems={(action) => {
              setPackageDetails(prev => ({
                ...prev,
                itinerary: typeof action === 'function' ? action(prev.itinerary) : action
              }))
            }}
            isMultiDayActivity={packageDetails.isMultiDayActivity}
            setIsMultiDayActivity={(val) => setPackageDetails(prev => ({ ...prev, isMultiDayActivity: val }))}
            onSave={() => setIsItineraryEditorOpen(false)}
            onBack={() => {
              // setPackageDetails(prev => ({ ...prev, itinerary: [] }));
              setIsItineraryEditorOpen(false);
            }}
          />
        ) : (
          <>
            <Navbar />
            {activeTab !== TAB_NAMES.SUCCESS &&
              activeTab === TAB_NAMES.SELECT_TREK
              ? <TrekSelectStep onConfirm={handleSelectChange} />
              : <div className="pt-11 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <TrekStepper
                  tabs={TABS}
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                />

                {activeTab === TAB_NAMES.BASICS && <TrekBasicsForm data={packageDetails} requiredFields={requiredForBasics} onChange={setPackageDetails} onBack={() => setActiveTab(TAB_NAMES.SELECT_TREK)} onNext={() => handleTabChange(TAB_NAMES.ITINERARY)} />}
                {activeTab === TAB_NAMES.ITINERARY && <TrekItineraryStep data={packageDetails} onBack={() => handleTabChange(TAB_NAMES.BASICS)} onNext={() => handleTabChange(TAB_NAMES.INCLUSIONS)} onOpenEditor={() => setIsItineraryEditorOpen(true)} />}
                {activeTab === TAB_NAMES.INCLUSIONS && <TrekInclusionStep data={packageDetails} requiredFields={requiredForInclusions} onChange={setPackageDetails} onNext={() => handleTabChange(TAB_NAMES.SUCCESS)} onBack={() => handleTabChange(TAB_NAMES.ITINERARY)} />}
              </div>}
            {activeTab === TAB_NAMES.SUCCESS && <SuccessStep />}
          </>
        )

      }
    </main>
  );
}

