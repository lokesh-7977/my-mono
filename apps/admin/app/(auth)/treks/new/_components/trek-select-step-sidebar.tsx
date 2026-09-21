"use client"
import { cn } from "@repo/ui/lib/utils";
import { Circle, Info, LockKeyhole, MapPin, Search } from "lucide-react";
import { TrekItems } from "./trek-select-step";

type SidebarProps = {
    registeredTreks: TrekItems[];
    onSelectTrek: (trek: TrekItems) => void;
    selectedTrekId: string | null;
}

export default function TrekSelectStepSidebar({
    registeredTreks,
    onSelectTrek,
    selectedTrekId,
}: SidebarProps) {
    return (
        <div className="w-92.5 border-r border-slate-200 bg-slate-50/50 flex flex-col h-[calc(100dvh-68px)] sticky top-17">
            {/* header */}
            <div className="w-full px-3 py-4 border-b border-border flex justify-between items-center">
                <h3 className="font-bold text-base ">Select a Trek</h3>
                <div className="rounded-full p-1 bg-white border-border border flex items-center">
                    <span className="text-xs font-medium px-3 py-1.5 rounded-full text-white bg-magic-green">12 Active</span>
                    <span className="text-xs font-medium px-3 py-1.5 rounded-full text-foreground/60 flex items-center gap-2">98 Inactive <Info className="size-3.5 text-foreground cursor-pointer" /></span>
                </div>
            </div>

            <div className="w-full pt-4 flex-1 flex flex-col overflow-hidden">
                <div className="px-4 mb-3 shrink-0">
                    <div className="w-full h-11 rounded-full border border-border bg-white flex items-center gap-2 px-4 focus-within:border-primary transition-border duration-200">
                        <Search className="size-4 text-foreground/50" />
                        <input type="text" placeholder="Search for treks" className="w-full h-full bg-transparent outline-none text-sm placeholder:text-foreground/60 text-foreground" />
                    </div>
                </div>

                <ul className="overflow-y-auto px-4 space-y-3 flex-1 pb-4 pt-1 m-0 list-none">
                    {registeredTreks.map((trek) => (
                        <TrekItemCard
                            key={trek.id}
                            id={trek.id}
                            title={trek.title}
                            bannerImage={trek.bannerImage} distance={trek.distance} duration={trek.duration} maxAltitude={trek.maxAltitude}
                            region={trek.region}
                            isLocked={trek.isLocked}
                            isSelected={trek.id === selectedTrekId}
                            onSelect={() => onSelectTrek(trek)} />
                    ))}
                </ul>
            </div>
        </div>
    )
}

type TrekItemCardProps = {
    id: string;
    title: string;
    bannerImage: string;
    distance: string;
    duration: string;
    maxAltitude: string;
    region: string;
    isLocked: boolean;
    isSelected: boolean;
    onSelect: () => void;
}
const TrekItemCard = ({
    title,
    bannerImage,
    distance,
    duration,
    maxAltitude,
    region,
    isLocked,
    isSelected,
    onSelect
}: TrekItemCardProps) => {
    return (
        <li
            role="button"
            tabIndex={0}
            onClick={onSelect}
            onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onSelect();
                }
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const next = e.currentTarget.nextElementSibling as HTMLElement;
                    if (next) next.focus();
                }
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prev = e.currentTarget.previousElementSibling as HTMLElement;
                    if (prev) prev.focus();
                }
            }}
            className={cn(
                "w-full text-left border transition-all duration-200 border-border rounded-md overflow-hidden outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary list-none",
                "cursor-pointer hover:border-primary hover:ring-2 hover:ring-primary",
                isSelected && "border-primary ring-1 ring-primary"
            )}
        >
            <div className={cn(
                "h-27.5 p-2 flex items-center gap-2.5 rounded-md w-full shrink-0 bg-white",
                isLocked && "opacity-60"
            )}>
                {/* eslint-disable-next-line */}
                <img className="h-full w-26 rounded-md" src={bannerImage} alt={title} />

                <div className="flex-1 h-full flex flex-col justify-between min-w-0">
                    <div className="w-full my-auto space-y-px">
                        <div className="flex items-center gap-1.5 text-xs text-foreground/60">
                            <span >{distance}km </span>
                            <Circle className="size-1 fill-current text-foreground/60" />
                            <span>{duration}days</span>
                            <Circle className="size-1 fill-current text-foreground/60" />
                            <span> {maxAltitude}ft</span>
                        </div>
                        <h4 className="text-sm font-semibold truncate">{title}</h4>
                        <p className="text-xs text-primary flex items-center gap-1 min-w-0">
                            <MapPin className="size-3.5 text-primary shrink-0" />
                            <span className="truncate">{region}</span>
                        </p>
                    </div>

                    {isLocked && <span className="text-[10px] mt-auto font-medium flex items-center gap-1 uppercase white rounded-full py-[1.5px] px-2 bg-black w-fit text-white">
                        <LockKeyhole className="size-3 shrink-0" />
                        <span className="pt-px">
                            Locked
                        </span>
                    </span>}
                </div>
            </div>
        </li>
    )
}