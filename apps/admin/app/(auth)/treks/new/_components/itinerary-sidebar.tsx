import { Plus, Tent, TreePine, CheckCircle2, Trash, AlertTriangle } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { format } from "date-fns";
import { ItineraryItem, isItemValid } from "./itinerary-editor";

interface ItinerarySidebarProps {
    items: ItineraryItem[];
    activeItemId: string;
    trekType: 'single' | 'multi';
    onItemSelect: (id: string) => void;
    onItemRemove: (id: string) => void;
    onItemAdd: () => void;
    onTrekTypeChange: (type: 'single' | 'multi') => void;
}

export default function ItinerarySidebar({
    items,
    activeItemId,
    trekType,
    onItemSelect,
    onItemRemove,
    onItemAdd,
    onTrekTypeChange
}: ItinerarySidebarProps) {
    return (
        <div className="w-92.5 border-r border-slate-200 bg-slate-50/50 flex flex-col h-[calc(100dvh-88.79px)] sticky top-[88.79px]">
            <div className="w-full">
                <div className="px-5 py-3 flex items-center justify-between border-b mb-1">
                    <h2 className="font-bold text-foreground text-lg">Itinerary Items</h2>
                    <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2.5 py-1 rounded-full">{items.length} Items</span>
                </div>

                <div className="px-5 pb-5 pt-3">
                    <label className="text-[13px] font-bold text-slate-600 mb-2.5 block">Select Type of Trek</label>
                    <div className="flex gap-3">
                        {[
                            { id: 'multi', label: 'Multi Day', icon: Tent },
                            { id: 'single', label: 'Single Day', icon: TreePine }
                        ].map((type) => {
                            const Icon = type.icon;
                            return (
                                <button
                                    key={type.id}
                                    onClick={() => onTrekTypeChange(type.id as 'single' | 'multi')}
                                    className={cn(
                                        "cursor-pointer flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all",
                                        trekType === type.id ? "bg-primary text-white shadow-sm" : "bg-[#D5DCE4] text-white hover:bg-slate-300"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {type.label}
                                </button>
                            );
                        })}

                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 pt-0 space-y-3">
                {items.map((item, index) => {
                    const isActive = activeItemId === item.id;
                    return (
                        <div
                            key={item.id}
                            onClick={() => onItemSelect(item.id)}
                            className={cn(
                                "p-3 rounded-xl cursor-pointer transition-colors group relative overflow-hidden",
                                isActive
                                    ? "border-2 border-primary bg-white shadow-sm"
                                    : "border-2 border-slate-200 bg-white hover:border-primary"
                            )}
                        >
                            <div className="flex justify-between items-center gap-1">
                                <div>
                                    <h3 className="font-medium text-foreground/60 text-xs">
                                        {trekType === 'multi' ? `Day ${index + 1}: ` : `Checkpoint ${index + 1}${item?.time?.length === 5 ? " - " + format(new Date(`2000-01-01T${item.time}`), 'hh:mm a') : ""}:`}
                                    </h3>
                                    <p className={cn("text-foreground text-sm line-clamp-1",
                                        !item?.title || item?.title?.trim() === "" ? "opacity-50 font-medium italic" : "font-bold")}>
                                        {item?.title?.trim() || (trekType === 'multi' ? `Untitled day` : `Untitled checkpoint`)}
                                    </p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    {isItemValid(item, trekType) ? (
                                        <CheckCircle2 className="size-4 my-auto shrink-0 text-emerald-500" />
                                    ) : (
                                        <AlertTriangle className="size-4 my-auto shrink-0 text-amber-500" />
                                    )}
                                    <button className="cursor-pointer" onClick={(e) => { e.stopPropagation(); onItemRemove(item.id); }}>
                                        <Trash className="size-4 shrink-0 text-slate-600 hover:text-red-500" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}

            </div>
            <div className="p-5 bg-white border-t border-slate-200 mt-auto">
                <button
                    onClick={onItemAdd}
                    className="w-full py-3.5 border-2 border-dashed border-slate-300 text-slate-500 rounded-xl hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 font-bold text-sm bg-slate-50/50"
                >
                    <Plus className="w-4 h-4" />
                    Add Item
                </button>
            </div>
        </div>
    );
}
