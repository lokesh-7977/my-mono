"use client";
import { useState, useRef, useEffect } from "react";
import { Pencil, Trash, Users, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@repo/ui/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@repo/ui/components/sheet";
import { Checkbox } from "@repo/ui/components/checkbox";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMounted } from "@/hooks/use-mounted";
import { useSchedule, type Schedule } from "./schedule-context";
import BulkEditDialog from "./bulk-edit-dialog";
import ScheduleStatusDropdown from "./schedule-status-dropdown";
import MultiSelectFilter from "./multi-select-filter";
import { StatusBadge } from "./status-badge";
import { format } from "date-fns";
import { getDateId } from "@/lib/dates";

export default function AvailabilitySidebar() {
    const isMobile = useIsMobile(1400);
    const mounted = useMounted();

    const {
        schedules, expandedId, setExpandedId, updateSchedule, removeSchedule,
        sidebarOpen, setSidebarOpen, checkedIds, setCheckedIds, toggleChecked, removeSchedules, updateSchedules,
        statusFilter, setStatusFilter, monthFilter, setMonthFilter, focusTrigger
    } = useSchedule();
    const [bulkEditOpen, setBulkEditOpen] = useState(false);

    const handleBulkSave = (updates: Partial<Schedule>) => {
        updateSchedules(checkedIds, updates);
        setCheckedIds([]);
        setSidebarOpen(false);
    };

    const STATUS_OPTIONS = [
        { label: "New", value: "new" },
        { label: "Available", value: "available" },
        { label: "Sold Out", value: "sold_out" },
        { label: "Cancelled", value: "cancelled" },
        { label: "Cancel Requested", value: "cancel_req" },
    ];

    const getFormattedStatus = (camelStatus: string) => { return STATUS_OPTIONS.find(stsItem => stsItem.value === camelStatus)?.label || "new" }

    const monthOptions = Array.from(new Set(schedules.map(s => {
        return format(s.date, 'MMM yyyy');
    }))).map(monthStr => ({ label: monthStr, value: monthStr }));

    const filteredSchedules = schedules.filter(s => {
        const passStatus = statusFilter.length === 0 || statusFilter.includes(s.status || 'new');
        const scheduleMonth = format(s.date, 'MMM yyyy');
        const passMonth = monthFilter.length === 0 || monthFilter.includes(scheduleMonth);
        return passStatus && passMonth;
    });

    const selectableSchedules = filteredSchedules.filter(s => s.status !== 'cancelled' && s.status !== 'cancel_req');

    const allSelected = selectableSchedules.length > 0 &&
        selectableSchedules.every(s => checkedIds.includes(getDateId(s.date)));
    const someSelected = checkedIds.length > 0 && !allSelected;

    const handleSelectAll = () => {
        const selectableIds = selectableSchedules.map(s => getDateId(s.date));

        if (allSelected) {
            // Deselect ONLY the currently filtered and selectable items
            setCheckedIds(prev => prev.filter(id => !selectableIds.includes(id)));
        } else {
            // Select ALL currently filtered and selectable items
            setCheckedIds(prev => {
                const newSelection = new Set([...prev, ...selectableIds]);
                return Array.from(newSelection);
            });
        }
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const content =
        <div
            className={cn(
                "w-92.5 sticky border-r border-slate-200 bg-slate-50/50 flex flex-col shrink-0",
                isMobile ? "top-0 h-full" : "h-[calc(100dvh-88.79px)] top-[88.79px]"
            )}
            onClick={() => setExpandedId('')}
        >
            <div className="p-5 flex items-center justify-between">
                <h2 className="font-bold text-foreground text-lg">Pricing & Availability</h2>
                <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2.5 py-1 rounded-full">{filteredSchedules.length} Schedules</span>
            </div>
            <div className="px-5 pb-4 grid grid-cols-2 gap-2">
                <MultiSelectFilter
                    options={STATUS_OPTIONS}
                    selected={statusFilter}
                    onChange={setStatusFilter}
                    placeholder="All Slots"
                />
                <MultiSelectFilter
                    options={monthOptions}
                    selected={monthFilter}
                    onChange={setMonthFilter}
                    placeholder="All Months"
                />
            </div>
            {/* Global Checkbox */}
            {schedules.length > 0 && (
                <div className="px-5 pb-3 flex items-center h-9 justify-between">
                    <div className="flex items-center gap-3">
                        <Checkbox
                            checked={allSelected ? true : someSelected ? "indeterminate" : false}
                            onCheckedChange={handleSelectAll}
                            className="w-4 h-4 border-gray-400 rounded data-[state=checked]:bg-primary data-[state=checked]:text-white data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:text-white"
                        />
                        <span className="text-sm font-medium text-slate-600">Select All</span>
                    </div>
                    {checkedIds.length > 0 && (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setBulkEditOpen(true);
                                }}
                                className="text-slate-400 hover:text-primary transition-colors p-1"
                                title="Edit selected schedules"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const savedSelected = checkedIds.filter(id => schedules.find(s => getDateId(s.date) === id)?.status);
                                    if (savedSelected.length > 0) {
                                        toast.warning("Saved dates cannot be removed.", { description: "Please unselect them first." });
                                        return;
                                    }
                                    removeSchedules(checkedIds);
                                }}
                                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                title="Remove selected schedules"
                            >
                                <Trash className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            <BulkEditDialog
                open={bulkEditOpen}
                onOpenChange={setBulkEditOpen}
                selectedCount={checkedIds.length}
                onSave={handleBulkSave}
            />
            <div className="flex-1 overflow-y-auto p-5 pt-0 space-y-3">
                {filteredSchedules.length === 0 && (
                    <div className="text-center py-10 text-slate-400 text-sm">
                        {schedules.length === 0 ? "Select dates on the calendar to create schedules." : "No schedules match the selected filters."}
                    </div>
                )}
                {filteredSchedules.map((schedule) => (
                    <ScheduleCard
                        key={getDateId(schedule.date)}
                        schedule={schedule}
                        isExpanded={expandedId === getDateId(schedule.date)}
                        focusTrigger={expandedId === getDateId(schedule.date) ? focusTrigger : 0}
                        isChecked={checkedIds.includes(getDateId(schedule.date))}
                        onToggleCheck={() => toggleChecked(getDateId(schedule.date))}
                        onExpand={() => setExpandedId(getDateId(schedule.date))}
                        onCollapse={() => setExpandedId('')}
                        onUpdate={(updates) => updateSchedule(getDateId(schedule.date), updates)}
                        onRemove={() => removeSchedule(getDateId(schedule.date))}
                        formatDate={formatDate}
                        getFormattedStatus={getFormattedStatus}
                    />
                ))}
            </div>
        </div>
    if (!mounted) {
        return <div className="hidden min-[1400px]:block h-full">{content}</div>;
    }

    return isMobile ? (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="p-0! w-fit! shadow-none!">
                <SheetHeader className="sr-only">
                    <SheetTitle>Pricing & Availability</SheetTitle>
                    <SheetDescription>Manage schedules and pricing.</SheetDescription>
                </SheetHeader>
                {content}
            </SheetContent>
        </Sheet>

    ) : content;
}

type ScheduleCardProps = {
    schedule: Schedule;
    isExpanded: boolean;
    focusTrigger: number;
    isChecked: boolean;
    onToggleCheck: () => void;
    onExpand: () => void;
    onCollapse: () => void;
    onUpdate: (updates: Partial<Schedule>) => void;
    onRemove: (status?: string) => void;
    formatDate: (date: Date) => string;
    getFormattedStatus: (status: string) => string;
};

function ScheduleCard({ schedule, isExpanded, focusTrigger, isChecked, onToggleCheck, onExpand, onCollapse, onUpdate, onRemove, formatDate, getFormattedStatus }: ScheduleCardProps) {
    const priceInputRef = useRef<HTMLInputElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const isCancelled = schedule.status === 'cancelled';
    const isCancelReq = schedule.status === "cancel_req";
    // Focus price input when card expands
    useEffect(() => {
        if (isExpanded) {
            // Give DOM time to expand before scrolling/focusing
            setTimeout(() => {
                cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                if (!isCancelled && !isCancelReq) {
                    priceInputRef.current?.focus({ preventScroll: true });
                } else {
                    setDropdownOpen(true);
                }
            }, 50);
        }
    }, [isExpanded, isCancelled, isCancelReq, focusTrigger]);

    const onCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (isCancelled) return;
        if (isCancelReq) {
            setDropdownOpen(true);
            return;
        }
        if (isExpanded) {
            onCollapse();
        } else {
            onExpand();
        }
    };

    return (
        <div
            className={cn(
                "p-4 rounded-xl transition-colors bg-white",
                isCancelled || isCancelReq ? "border border-border" :
                    isExpanded ? "border border-border shadow-sm" : "border border-border cursor-pointer hover:border-primary group"
            )}
            ref={cardRef}
            onClick={onCardClick}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Checkbox
                        checked={isChecked}
                        onCheckedChange={onToggleCheck}
                        disabled={isCancelled || isCancelReq}
                        className="w-4 h-4 border-gray-400 rounded data-[state=checked]:bg-primary data-[state=checked]:text-white disabled:bg-gray-100"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex items-center gap-2">
                        <h3 className={cn(
                            "font-bold text-sm",
                            isCancelled || isCancelReq ? "text-foreground/60" : "text-foreground")}>
                            {formatDate(schedule.date)}
                        </h3>
                        <div className="flex gap-1">
                            <StatusBadge
                                status={schedule.status || 'new'}
                                label={!schedule.status ? 'New' : getFormattedStatus(schedule.status)}
                            />
                            {schedule.isEdited && (
                                <span className="bg-blue-100 text-blue-700 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm">Edited</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {!schedule.status ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove(schedule.status);
                            }}
                            className="w-4 h-4 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    ) : (
                        <ScheduleStatusDropdown
                            status={schedule.status}
                            scheduleId={schedule.id}
                            dateFormatted={formatDate(schedule.date)}
                            dropdownOpen={dropdownOpen}
                            onDropdownOpenChange={setDropdownOpen}
                        />
                    )}
                </div>
            </div>

            {isExpanded && !isCancelled && !isCancelReq && (
                <div className="mt-4 space-y-4" onClick={(e) => e.stopPropagation()}>
                    <div>
                        <label className="block text-xs font-bold text-foreground mb-1.5">Price (Per Person)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                            <input
                                ref={priceInputRef}
                                type="text"
                                className="w-full border border-border rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:border-primary bg-slate-50/30"
                                placeholder="00.0"
                                value={schedule.price}
                                onChange={(e) => onUpdate({ price: e.target.value })}
                            />
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">Includes 5% platform fee automatically.</p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-foreground mb-1.5">Group Size (Max. Participants)</label>
                        <div className="">
                            <div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full border border-border rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:border-primary bg-slate-50/30"
                                        value={schedule.maxGroupSize}
                                        onChange={(e) => onUpdate({ maxGroupSize: e.target.value })}
                                    />
                                    <Users className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}