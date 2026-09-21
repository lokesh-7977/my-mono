"use client";
import { useState, useMemo } from "react";
import { Button } from "@repo/ui/components/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@repo/ui/components/dialog";
import { useSchedule } from "./schedule-context";
import { format } from "date-fns";
import { getDateId } from "@/lib/dates";
import MultiSelectFilter from "./multi-select-filter";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type BulkCancelModalProps = {
    children?: React.ReactNode;
};

export default function BulkCancelModal({ children }: BulkCancelModalProps) {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<1 | 2>(1);
    const [reason, setReason] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [monthFilter, setMonthFilter] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { schedules } = useSchedule();

    const validSchedules = useMemo(() => {
        return schedules.filter(s => s.status === 'available' || s.status === 'sold_out');
    }, [schedules]);

    const monthOptions = useMemo(() => {
        return Array.from(new Set(validSchedules.map(s => format(s.date, 'MMM yyyy'))))
            .map(monthStr => ({ label: monthStr, value: monthStr }));
    }, [validSchedules]);

    const filteredSchedules = useMemo(() => {
        return validSchedules.filter(s => {
            const scheduleMonth = format(s.date, 'MMM yyyy');
            return monthFilter.length === 0 || monthFilter.includes(scheduleMonth);
        });
    }, [validSchedules, monthFilter]);

    const allSelected = filteredSchedules.length > 0 &&
        filteredSchedules.every(s => selectedIds.includes(getDateId(s.date)));
    const someSelected = filteredSchedules.some(s => selectedIds.includes(getDateId(s.date))) && !allSelected;

    const handleSelectAll = () => {
        const selectableIds = filteredSchedules.map(s => getDateId(s.date));
        if (allSelected) {
            setSelectedIds(prev => prev.filter(id => !selectableIds.includes(id)));
        } else {
            setSelectedIds(prev => {
                const newSelection = new Set([...prev, ...selectableIds]);
                return Array.from(newSelection);
            });
        }
    };

    const toggleChecked = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleOpenChange = (value: boolean) => {
        if (!value) {
            setTimeout(() => {
                setStep(1);
                setReason("");
                setSelectedIds([]);
                setMonthFilter([]);
            }, 300); // Wait for transition before resetting
        }
        setOpen(value);
    };

    const handleSubmit = async () => {
        if (!reason.trim()) {
            toast.error("Please provide a valid reason.");
            return;
        }

        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsSubmitting(false);

        toast.success(`Request submitted!`, {
            description: `Your request to cancel ${selectedIds.length} schedules has been sent for approval.`
        });

        handleOpenChange(false);
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="transition-all duration-300 sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>
                        {step === 1 ? "Select Schedules to Cancel" : "Request Bulk Cancellation"}
                    </DialogTitle>
                    <DialogDescription>
                        {step === 1
                            ? "Select the saved schedules you want to request cancellation for."
                            : `Please provide a reason for cancelling the ${selectedIds.length} selected schedules.`
                        }
                    </DialogDescription>
                </DialogHeader>

                {step === 1 ? (
                    <div className="py-2">
                        <div className="mb-4">
                            <MultiSelectFilter
                                options={monthOptions}
                                selected={monthFilter}
                                onChange={setMonthFilter}
                                placeholder="All Months"
                            />
                        </div>

                        {filteredSchedules.length > 0 && (
                            <div className="px-4 py-2 flex items-center h-9 justify-between border-b border-border bg-slate-50/50 rounded-t-lg">
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        checked={allSelected ? true : someSelected ? "indeterminate" : false}
                                        onCheckedChange={handleSelectAll}
                                        className="w-4 h-4 border-gray-400 rounded data-[state=checked]:bg-primary data-[state=checked]:text-white data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:text-white"
                                    />
                                    <span className="text-sm font-medium text-slate-600">Select All</span>
                                </div>
                            </div>
                        )}

                        <div className="max-h-64 overflow-y-auto border border-t-0 border-border rounded-b-lg scrollbar-thin">
                            {filteredSchedules.length === 0 ? (
                                <div className="text-center py-8 text-slate-400 text-sm">
                                    No saved schedules match the selected filters.
                                </div>
                            ) : (
                                filteredSchedules.map((schedule) => (
                                    <div
                                        key={getDateId(schedule.date)}
                                        className="flex items-center gap-3 p-3 border-b border-border last:border-b-0 hover:bg-slate-50 cursor-pointer transition-colors"
                                        onClick={() => toggleChecked(getDateId(schedule.date))}
                                    >
                                        <Checkbox
                                            checked={selectedIds.includes(getDateId(schedule.date))}
                                            onCheckedChange={() => toggleChecked(getDateId(schedule.date))}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-4 h-4 border-gray-400 rounded data-[state=checked]:bg-primary data-[state=checked]:text-white"
                                        />
                                        <span className="text-sm font-medium text-foreground">
                                            {formatDate(schedule.date)}
                                        </span>
                                        <span className="ml-auto text-xs px-2 py-1 bg-slate-100 rounded-full text-slate-600 font-medium capitalize">
                                            {schedule.status?.replace("_", " ")}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="py-4">
                        <label className="text-sm font-bold text-foreground mb-2 block">Reason</label>
                        <textarea
                            className="w-full border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-primary bg-slate-50/30 min-h-25 resize-y"
                            placeholder="Enter a valid reason..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>
                )}

                <DialogFooter>
                    {step === 1 ? (
                        <>
                            <Button variant="outline" onClick={() => handleOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={() => setStep(2)}
                                disabled={selectedIds.length === 0}
                                className="bg-primary hover:bg-primary/90 text-white"
                            >
                                Next
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" onClick={() => setStep(1)} disabled={isSubmitting}>
                                Back
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !reason.trim()}
                                className="min-w-32"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    "Submit Request"
                                )}
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}