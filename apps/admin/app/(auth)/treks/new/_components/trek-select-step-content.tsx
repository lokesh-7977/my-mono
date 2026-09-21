import { LockKeyhole, MapPin } from "lucide-react";
import Clock from "@/components/icons/clock";
import Elevation from "@/components/icons/elevation";
import { getDifficultySVG } from "@/components/icons/get-difficulty-icon";
import { Button } from "@/components/ui/button";
import { TrekItems } from "./trek-select-step";

type StepContentProps = {
    selectedTrek: TrekItems | null;
    onConfirm: (trek: TrekItems) => void
}

export default function TrekSelectStepContent({ selectedTrek, onConfirm }: StepContentProps) {
    const {
        title,
        bannerImage,
        region,
        isLocked: isTrekLocked,
        difficulty,
        maxAltitude,
        duration,
        overview,

    } = selectedTrek || {};
    return (
        <div className="flex-1 flex flex-col px-4 pt-4">
            {/* <div className="flex-1 h-[calc(100dvh-68px)] overflow-y-auto flex flex-col px-4 pt-4"> */}
            <div className="flex-1 shrink-0 w-full bg-white rounded-lg border border-border flex flex-col justify-between gap-20 mb-4">
                <div className="p-8 pb-0">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold flex items-center gap-4">
                            {title}
                            {isTrekLocked && <span className="text-[10px] opacity-60 font-medium flex items-center gap-1 uppercase white rounded-full py-[1.5px] px-2 bg-black w-fit text-white">
                                <LockKeyhole className="size-3 shrink-0" />
                                <span className="pt-px">
                                    Locked
                                </span>
                            </span>}
                        </h2>
                        <p className="text-sm text-primary flex items-center gap-1 min-w-0">
                            <MapPin className="size-3.5 text-primary shrink-0" />
                            <span className="truncate">{region}</span>
                        </p>
                    </div>
                    {/* eslint-disable-next-line */}
                    <img
                        className="w-full object-cover object-center rounded-lg mt-3 h-70"
                        src={bannerImage}
                        alt={title}
                    />

                    <div className="mt-4 grid grid-cols-3 gap-5 border-b pb-4">
                        {
                            [
                                {
                                    icon: <Clock width="36px" height="36px" color={"var(--color-primary)"} />,
                                    label: "Duration",
                                    value: duration,
                                    unit: "days"
                                },
                                {
                                    icon: <Elevation width="36px" height="36px" color={"var(--color-primary)"} />,
                                    label: "Altitude",
                                    value: maxAltitude,
                                    unit: "m"
                                },
                                {
                                    icon: getDifficultySVG(difficulty || "easy", "36px", "36px"),
                                    label: "Difficulty Level",
                                    value: difficulty,
                                }
                            ].map((item, index) => {
                                return <div key={index} className="group flex justify-between pl-2">
                                    <div>
                                        {item.icon}
                                        <p className="flex flex-col mt-2">
                                            <span className="uppercase font-medium text-xs">{item.label}</span>
                                            <span className="text-base font-semibold capitalize">{item.value}{item.unit}</span>
                                        </p>
                                    </div>

                                    <div className="border h-1/2 my-auto group-last:hidden" />
                                </div>
                            })
                        }
                    </div>

                    <div className="mt-4">
                        <h4 className="text-xl font-bold">Overview</h4>
                        <p className="text-base mt-1">{overview}</p>
                    </div>
                </div>

                <div className="sticky bottom-0 z-10 bg-white px-8 pb-6 rounded-b-lg mt-auto">
                    {
                        !isTrekLocked
                            ? <div className="pt-4 border-t flex">
                                <Button disabled={!selectedTrek || selectedTrek?.isLocked}
                                    onClick={() => selectedTrek && !selectedTrek.isLocked && onConfirm(selectedTrek)}
                                    className="ml-auto h-11 px-4 cursor-pointer hover:bg-primary-300">
                                    Select & Continue
                                </Button>
                            </div>
                            : <div className="border rounded-2xl px-5 py-4 mt-4 shadow-lg">
                                <div className="flex justify-between">
                                    <div className="flex flex-col justify-center">
                                        <span className="uppercase text-xs tracking-[1.2px]">Current Progression</span>
                                        <span className="font-semibold text-[28px] leading-10">Trek Guide</span>
                                    </div>
                                    <div className="flex flex-col justify-center text-right">
                                        <p>
                                            <span className="text-3xl font-semibold">08</span> / 14
                                        </p>
                                        <p className="text-primary text-sm text-medium ">
                                            <span className="text-foreground text-medium">Next Level:</span> Trek Leader
                                        </p>
                                    </div>
                                </div>
                                <progress className="w-full h-4 mt-2.5 rounded-full [&::-webkit-progress-bar]:bg-[#D5E3FD80] [&::-webkit-progress-value]:bg-primary [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-primary" value={8} max={14}></progress>
                            </div>
                    }
                </div>
            </div>

        </div>
    )
}