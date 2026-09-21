import { useState } from "react";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import EditorHeader from "@/components/shared/editor-header";
import ItinerarySidebar from "./itinerary-sidebar";
import ItineraryItemEditor from "./itinerary-item-editor";

interface ItineraryEditorProps {
    items: ItineraryItem[];
    setItems: React.Dispatch<React.SetStateAction<ItineraryItem[]>>;
    isMultiDayActivity: boolean;
    setIsMultiDayActivity: (val: boolean) => void;
    onSave: () => void;
    onBack: () => void;
}

export type ItineraryItem = {
    id: string;
    title: string;
    description?: string;
    distance?: string;
    duration?: string;
    altitude?: string;
    time?: string;
    image?: { url: string; name: string; size: number };
};

export const baseItem = (id: string, type: 'single' | 'multi' = 'multi') => {
    return {
        id: id,
        title: '',
        description: '',
        distance: '',
        duration: '',
        altitude: '',
        ...(type === 'single' && { time: '' })
    }
};

export const isItemValid = (item: ItineraryItem, type: 'single' | 'multi') => {
    if (!item.title?.trim()) return false;
    if (!item.description?.trim()) return false;
    if (!item.image) return false;
    if (type === 'single' && !item.time?.trim()) return false;
    return true;
};

export default function ItineraryEditor({ items, setItems, isMultiDayActivity, setIsMultiDayActivity, onSave, onBack }: ItineraryEditorProps) {
    const trekType = isMultiDayActivity ? 'multi' : 'single';
    const [activeItemId, setActiveItemId] = useState<string>('');

    // Derive active ID (fallback to first item if current is invalid or empty)
    const currentActiveId = activeItemId && items.some(i => i.id === activeItemId)
        ? activeItemId
        : (items.length > 0 ? items[0].id : '');

    const activeItem = items.find(d => d.id === currentActiveId);
    const activeItemIndex = items.findIndex(d => d.id === currentActiveId);

    const updateItem = (id: string, updates: Partial<ItineraryItem>) => {
        setItems(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
    };

    const removeItem = (id: string) => {
        setItems(prev => {
            const next = prev.filter(d => d.id !== id);
            return next;
        });
    };

    const handleTrekTypeChange = (newType: 'single' | 'multi') => {
        if (trekType !== newType) {
            setIsMultiDayActivity(newType === 'multi');
            const newItem = baseItem(crypto.randomUUID(), newType);
            setItems([newItem]);
            setActiveItemId(newItem.id);
        }
    };

    const addItem = () => {
        const newId = crypto.randomUUID();
        const newItem = baseItem(newId, trekType);
        setItems(prev => [...prev, newItem]);
        setActiveItemId(newId);
    };

    const handleSave = () => {
        const isAllValid = items.every(item => isItemValid(item, trekType));
        if (!isAllValid) {
            toast.error("Please complete all required fields (title, photo, description, and time if applicable) for every itinerary item.");
            return;
        }
        onSave();
    };

    return (
        <>
            {/* Header */}
            <EditorHeader
                title="Roopkund Trek"
                subTitle="Itinerary Draft • 8 Days • 45km Total"
                actions={<>
                    <button onClick={onBack} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        Back
                    </button>
                    <button className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 bg-white rounded-lg flex items-center gap-2 transition-colors">
                        <Eye className="w-4 h-4" />
                        Preview
                    </button>
                    <button onClick={handleSave} className="px-6 py-2 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-sm">
                        Save
                    </button>
                </>}
            />

            {/* Content Grid */}
            <div className="flex flex-1 w-full mx-auto bg-slate-50">
                <ItinerarySidebar
                    items={items}
                    activeItemId={currentActiveId}
                    trekType={trekType}
                    onItemSelect={setActiveItemId}
                    onItemRemove={removeItem}
                    onItemAdd={addItem}
                    onTrekTypeChange={handleTrekTypeChange}
                />

                {/* Main Edit Area */}
                <div className="flex-1 pt-2 pb-4 bg-slate-50">
                    <ItineraryItemEditor
                        item={activeItem as ItineraryItem}
                        itemIndex={activeItemIndex}
                        trekType={trekType}
                        onUpdate={updateItem}
                        onRemove={removeItem}
                    />
                </div>
            </div>
        </>
    );
}