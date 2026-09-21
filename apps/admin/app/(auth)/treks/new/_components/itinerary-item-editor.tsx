import { Eye, Trash2, Image as ImageIcon, Ruler, Mountain, CloudUpload, Timer, TrashIcon } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { Label } from "@repo/ui/components/label";
import { toast } from "sonner";
import { ItineraryItem } from "./itinerary-editor";

interface ItineraryItemEditorProps {
    item: ItineraryItem;
    itemIndex: number;
    trekType: 'single' | 'multi';
    onUpdate: (id: string, updates: Partial<ItineraryItem>) => void;
    onRemove: (id: string) => void;
}

export default function ItineraryItemEditor({
    item: activeItem,
    itemIndex: activeItemIndex,
    trekType,
    onUpdate: updateItem,
    onRemove: removeItem
}: ItineraryItemEditorProps) {
    if (!activeItem) {
        return (
            <div className="flex flex-col items-center justify-center h-full pt-32 text-slate-400">
                <Mountain className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-medium">No item selected</p>
            </div>
        );
    }

    return (
        <div className="mx-auto px-5 max-w-6xl">
            <div className="flex items-center justify-between mb-3 ">
                <h2 className="text-xs font-bold text-slate-400 uppercase">
                    Editing {trekType === 'multi' ? `Day ${activeItemIndex + 1}` : `Checkpoint ${activeItemIndex + 1}`}
                </h2>
                <button
                    onClick={() => removeItem(activeItem.id)}
                    className="text-slate-400 hover:text-red-500 bg-white border border-slate-200 p-2 rounded-lg transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                <div className="mb-6">
                    {trekType === 'multi' ? (
                        <span className="text-sm font-bold text-foreground mb-3 block h-[21.6px]">
                            Day {(activeItemIndex + 1).toString().padStart(2, '0')}
                        </span>
                    ) :
                        (
                            <div className="flex items-start gap-2 mb-3 h-[21.6px]">
                                <Label className="text-sm font-bold text-foreground block w-max">Checkpoint</Label>
                                <input
                                    type="time"
                                    value={activeItem?.time || ''}
                                    onChange={(e) => updateItem(activeItem.id, { time: e.target.value })}
                                    // className="text-sm pb-0 font-bold text-foreground w-max [&::-webkit-calendar-picker-indicator]:hidden border-b-2 border-slate-100 focus:border-primary outline-none"
                                    className="text-sm pb-0 font-bold text-foreground w-max border-b-2 border-slate-100 focus:border-primary outline-none"
                                    placeholder="HH:MM"
                                />
                            </div>
                        )
                    }
                    <input
                        type="text"
                        value={activeItem.title}
                        onChange={(e) => updateItem(activeItem.id, { title: e.target.value })}
                        placeholder="Enter day title"
                        className="w-full text-2xl font-bold text-foreground placeholder:text-foreground/40 border-b-2 border-slate-100 focus:border-primary outline-none pb-1 bg-transparent transition-colors"
                    />
                </div>

                <div className="flex items-center justify-between mb-8 border px-4 py-3 group rounded-lg">
                    <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                        <ImageIcon className="w-5 h-5 text-primary" />
                        {trekType === 'multi' ? 'Day' : 'Checkpoint'} Photo
                    </div>
                    {!activeItem.image ? (
                        <label className="px-7 py-2 border border-slate-200 cursor-pointer rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-100 bg-slate-50 flex items-center gap-3 transition-colors duration-150">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        if (file.size > 5 * 1024 * 1024) {
                                            toast.error("Image size must be less than 5MB");
                                            return;
                                        }
                                        const url = URL.createObjectURL(file);
                                        updateItem(activeItem.id, { image: { url, name: `roopkund-trek-package-item-${(activeItemIndex + 1).toString().padStart(2, '0')}-${Date.now()}`, size: file.size } });
                                    }
                                }}
                            />
                            <CloudUpload className="w-4 h-9 text-slate-400" />
                            Add Photo
                        </label>
                    ) : (
                        <div className="border border-slate-200 flex gap-2.5 p-2 rounded-lg bg-white min-w-[320px] shadow-md shadow-foreground/5">
                            {/* eslint-disable-next-line */}
                            <img
                                src={activeItem.image.url}
                                alt={`${trekType === 'multi' ? 'day-' + (activeItemIndex + 1).toString().padStart(2, '0') : 'checkpoint-' + (activeItemIndex + 1).toString().padStart(2, '0')} photo`}
                                className="size-9 object-cover rounded-md"
                            />
                            <div title={activeItem.image.name} className="flex gap-4 justify-between w-full items-center">
                                <div className="flex flex-col text-sm font-semibold overflow-hidden">
                                    <span className="truncate max-w-40 text-foreground" >
                                        {activeItem.image.name}
                                    </span>
                                    <span className="text-[10px] font-medium text-slate-400">
                                        {(activeItem.image.size / (1024 * 1024)).toFixed(2)} MB
                                    </span>
                                </div>

                                <div className="flex items-center gap-0.5">
                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(activeItem.image!.url, '_blank'); }}
                                        className="p-2 rounded-md hover:bg-foreground/5 cursor-pointer transition-all duration-150"
                                    >
                                        <Eye className="w-4 h-4 text-slate-400" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateItem(activeItem.id, { image: undefined }); }}
                                        className="p-2 rounded-md hover:bg-red-50 cursor-pointer transition-all duration-150"
                                    >
                                        <TrashIcon className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 ">
                    {[
                        { id: 'distance', label: 'Distance', icon: Ruler, unit: 'km', value: activeItem.distance, max: 15 },
                        { id: 'duration', label: 'Duration', icon: Timer, unit: 'hrs', value: activeItem.duration, max: 23 },
                        { id: 'altitude', label: 'Max Altitude', icon: Mountain, unit: 'ft', value: activeItem.altitude, max: 20000 }
                    ].map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.id}>
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 tracking-wider uppercase mb-3">
                                    <Icon className="w-4 h-4" /> {stat.label}
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={stat.value || ''}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === '') {
                                                updateItem(activeItem.id, { [stat.id]: '' });
                                                return;
                                            }
                                            if (/^\d*\.?\d*$/.test(val)) {
                                                const num = parseFloat(val);
                                                if (!isNaN(num) && num <= stat.max) {
                                                    updateItem(activeItem.id, { [stat.id]: val });
                                                } else if (val === '.') {
                                                    updateItem(activeItem.id, { [stat.id]: '0.' });
                                                }
                                            }
                                        }}
                                        className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-4 h-11.5 text-base text-foreground font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-shadow"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">{stat.unit}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="">
                    <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-bold text-foreground">Detailed Description</label>
                        <span className={cn(
                            "text-xs font-medium",
                            (activeItem.description?.length || 0) >= 650 ? "text-red-500" : "text-slate-400"
                        )}>
                            {activeItem.description?.length || 0} / 650 characters
                        </span>
                    </div>
                    <textarea
                        rows={5}
                        maxLength={650}
                        value={activeItem.description || ''}
                        onChange={(e) => updateItem(activeItem.id, { description: e.target.value })}
                        className="w-full border border-slate-200 rounded-2xl px-5 py-3 text-slate-600 text-base leading-relaxed focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-shadow resize-none bg-slate-50/30"
                    />
                </div>
            </div>
        </div>
    );
}
