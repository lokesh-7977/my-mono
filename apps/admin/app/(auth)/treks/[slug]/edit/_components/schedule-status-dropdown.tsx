"use client";
import { useState } from "react";
import { STATUS } from "./schedule-context";
import { MoreVertical, Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@repo/ui/components/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@repo/ui/components/dialog";

type ScheduleStatusDropdownProps = {
    status: string;
    scheduleId?: string;
    dateFormatted: string;
    dropdownOpen?: boolean;
    onDropdownOpenChange?: (open: boolean) => void;
};

export default function ScheduleStatusDropdown({ status, dateFormatted, scheduleId, dropdownOpen, onDropdownOpenChange }: ScheduleStatusDropdownProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [targetStatus, setTargetStatus] = useState<typeof STATUS.cancelled.value | typeof STATUS.available.value | null>(null);
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Use internal state if props are not provided
    const [internalDropdownOpen, setInternalDropdownOpen] = useState(false);
    const isDropdownOpen = dropdownOpen !== undefined ? dropdownOpen : internalDropdownOpen;
    const handleDropdownOpenChange = onDropdownOpenChange || setInternalDropdownOpen;

    const onOpenChangeIntercept = (open: boolean) => {
        if (open && !scheduleId) {
            toast.error("Please save this schedule before requesting a status change.");
            return;
        }
        handleDropdownOpenChange(open);
    };

    const handleMenuClick = (newStatus: typeof STATUS.cancelled.value | typeof STATUS.available.value) => {
        setTargetStatus(newStatus);
        setIsModalOpen(true);
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
            description: `Your request to change the status to ${targetStatus} has been sent for approval.`
        });

        setIsModalOpen(false);
        setTargetStatus(null);
        setReason("");

        // Here you would trigger a refetch or router.refresh() 
        // to get the latest saved dates from the DB.
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setReason("");
            setTargetStatus(null);
        }
        setIsModalOpen(isOpen);
    };

    if (status === STATUS.cancelled.value) return;

    return (
        <>
            <DropdownMenu open={isDropdownOpen} onOpenChange={onOpenChangeIntercept}>
                <DropdownMenuTrigger asChild>
                    <button
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                        {status === STATUS.cancel_req.value ? <Info className="w-4 h-4" /> : <MoreVertical className="w-4 h-4" />}
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-fit">
                    {(status === STATUS.available.value || status === STATUS.sold_out.value) ? (
                        <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleMenuClick(STATUS.cancelled.value);
                        }} className="text-red-600 focus:text-red-600 cursor-pointer">
                            Request Cancellation
                        </DropdownMenuItem>
                    ) : status === STATUS.cancel_req.value ? (
                        <div className="px-2 py-2 text-xs text-slate-500 leading-tight text-center">
                            Cancellation request is under review.
                        </div>
                    ) : null}
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
                <DialogContent className="sm:max-w-106.25" onClick={(e) => e.stopPropagation()}>
                    <DialogHeader>
                        <DialogTitle>
                            {targetStatus === STATUS.cancelled.value ? 'Request Cancellation' : 'Request Availability'}
                        </DialogTitle>
                        <DialogDescription>
                            Please provide a reason for requesting a status change for <strong>{dateFormatted}</strong>. This request will be sent to the administration for approval.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <label className="text-sm font-bold text-foreground mb-2 block">Reason</label>
                        <textarea
                            className="w-full border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-primary bg-slate-50/30 min-h-25 resize-y"
                            placeholder="Enter a valid reason..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <button
                                onClick={(e) => e.stopPropagation()}
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                        </DialogClose>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSubmit();
                            }}
                            disabled={isSubmitting}
                            className="flex items-center justify-center min-w-30 px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                "Submit Request"
                            )}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
