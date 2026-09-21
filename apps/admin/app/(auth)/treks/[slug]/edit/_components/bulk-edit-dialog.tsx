"use client";
import { useState } from "react";
import { Users } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@repo/ui/components/dialog";
import { type Schedule } from "./schedule-context";

type BulkEditDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedCount: number;
    onSave: (updates: Partial<Schedule>) => void;
};

export default function BulkEditDialog({ open, onOpenChange, selectedCount, onSave }: BulkEditDialogProps) {
    const [price, setPrice] = useState("");
    const [maxSize, setMaxSize] = useState("");

    const handleSave = () => {
        const updates: Partial<Schedule> = {};
        if (price) updates.price = price;
        if (maxSize) updates.maxGroupSize = maxSize;

        if (Object.keys(updates).length > 0) {
            onSave(updates);
        }

        // Reset state and close
        setPrice("");
        setMaxSize("");
        onOpenChange(false);
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            // Reset state when closing via cancel/overlay click
            setPrice("");
            setMaxSize("");
        }
        onOpenChange(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>Edit {selectedCount} Schedules</DialogTitle>
                    <DialogDescription className="sr-only">
                        Bulk edit the price and max group size for the selected schedules.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-bold text-foreground">Price (Per Person)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                            <input
                                type="text"
                                className="w-full border border-border rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:border-primary bg-slate-50/30"
                                placeholder="Leave blank to keep existing"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-bold text-foreground">Group Size (Max. Participants)</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full border border-border rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:border-primary bg-slate-50/30"
                                placeholder="Leave blank to keep existing"
                                value={maxSize}
                                onChange={(e) => setMaxSize(e.target.value)}
                            />
                            <Users className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                            Cancel
                        </button>
                    </DialogClose>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Save Changes
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
