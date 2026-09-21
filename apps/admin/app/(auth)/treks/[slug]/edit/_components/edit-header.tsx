import { Ban } from "lucide-react";
import BulkCancelModal from "./bulk-cancel-modal";
import { Button } from "@repo/ui/components/button";

export function EditHeader() {
    return (
        <header className="bg-white border-b h-fit w-full border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Roopkund Trek</h1>
                <div className="flex items-center text-sm text-slate-500 mt-1 gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                    <span>Itinerary Draft • 8 Days • 45km Total</span>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    Back
                </button>
                <BulkCancelModal>
                    <Button variant="outline" className="h-9 px-4 text-sm font-bold text-slate-600 rounded-lg gap-2 cursor-pointer">
                        <Ban className="w-4 h-4" />
                        Bulk Cancel
                    </Button>
                </BulkCancelModal>
                <Button className="h-9 px-4 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors duration-200 cursor-pointer">
                    Save
                </Button>
            </div>
        </header>
    );
}
