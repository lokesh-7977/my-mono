"use client";
import { createContext, useContext, useState, useCallback, useRef, useEffect, useMemo, type ReactNode } from "react";
import { toast } from "sonner";
import { getDateFromToday, getDateId } from "@/lib/dates";
export const STATUS = {
    new: { label: "New", value: "new" },
    available: { label: "Available", value: "available" },
    sold_out: { label: "Sold Out", value: "sold_out" },
    cancelled: { label: "Cancelled", value: "cancelled" },
    cancel_req: { label: "Cancel Requested", value: "cancel_req" },
} as const;

export type ScheduleStatus = keyof typeof STATUS;

export type Schedule = {
    id?: string;
    date: Date;
    price: string;
    maxGroupSize: string;
    status?: ScheduleStatus;
    isEdited?: boolean;
};

type ScheduleContextType = {
    selectedDays: Date[];
    schedules: Schedule[];
    expandedId: string;
    setExpandedId: (id: string) => void;
    focusTrigger: number;
    triggerFocus: () => void;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    handleDaysChange: (days: Date[] | undefined) => void;
    updateSchedule: (dateId: string, updates: Partial<Schedule>) => void;
    updateSchedules: (dateIds: string[], updates: Partial<Schedule>) => void;
    removeSchedule: (dateId: string) => void;
    removeSchedules: (dateIds: string[]) => void;
    checkedIds: string[];
    setCheckedIds: React.Dispatch<React.SetStateAction<string[]>>;
    statusFilter: string[];
    setStatusFilter: React.Dispatch<React.SetStateAction<string[]>>;
    monthFilter: string[];
    setMonthFilter: React.Dispatch<React.SetStateAction<string[]>>;
    toggleChecked: (dateId: string) => void;
    tomorrow: Date;
    yearFromTomorrow: Date;
};

const ScheduleContext = createContext<ScheduleContextType | null>(null);

export function useSchedule() {
    const ctx = useContext(ScheduleContext);
    if (!ctx) throw new Error("useSchedule must be used within a ScheduleProvider");
    return ctx;
}

type ScheduleProviderProps = {
    children: ReactNode;
    basePrice?: string;
    baseMaxGroupSize?: string;
    initialSchedules?: Schedule[];
};

export function ScheduleProvider({ children, basePrice = '', baseMaxGroupSize = '', initialSchedules = [] }: ScheduleProviderProps) {
    const tomorrow = useMemo(() => getDateFromToday(1), []);
    const yearFromTomorrow = useMemo(() => getDateFromToday(365), []);

    const initialValidSchedules = useMemo(() => {
        return initialSchedules.filter(schedule => schedule.date >= tomorrow);
    }, [initialSchedules, tomorrow]);

    const [selectedDays, setSelectedDays] = useState<Date[]>(initialValidSchedules.map(s => s.date));
    const [schedules, setSchedules] = useState<Schedule[]>(initialValidSchedules);
    const [expandedId, setExpandedId] = useState<string>('');
    const [focusTrigger, setFocusTrigger] = useState(0);
    const triggerFocus = useCallback(() => setFocusTrigger(p => p + 1), []);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [checkedIds, setCheckedIds] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [monthFilter, setMonthFilter] = useState<string[]>([]);

    const schedulesRef = useRef(schedules);
    useEffect(() => {
        schedulesRef.current = schedules;
    }, [schedules]);

    // Sync external backend updates into local state while preserving local edits
    useEffect(() => {
        const currentSchedules = schedulesRef.current;
        const currentMap = new Map(currentSchedules.map(s => [getDateId(s.date), s]));
        let hasChanges = false;

        const nextSchedules = initialValidSchedules.map(serverSchedule => {
            const serverDateId = getDateId(serverSchedule.date);
            const localSchedule = currentMap.get(serverDateId);
            // 1. New schedule from server
            if (!localSchedule) {
                hasChanges = true;
                return serverSchedule;
            }

            // 2. If status changed on server, force update it locally
            if (localSchedule.status !== serverSchedule.status) {
                hasChanges = true;
                return { ...localSchedule, status: serverSchedule.status };
            }

            // 3. If NOT edited locally, fully sync any other changes from server
            if (!localSchedule.isEdited) {
                if (
                    localSchedule.price !== serverSchedule.price ||
                    localSchedule.maxGroupSize !== serverSchedule.maxGroupSize ||
                    localSchedule.date.getTime() !== serverSchedule.date.getTime()
                ) {
                    hasChanges = true;
                    return serverSchedule;
                }
            }

            return localSchedule;
        });

        const serverIds = new Set(initialValidSchedules.map(s => getDateId(s.date)));
        // Keep new local schedules that haven't been saved to server yet
        const retainedLocals = currentSchedules.filter(s => !serverIds.has(getDateId(s.date)) && (!s.status || s.status === STATUS.new.value));
        
        if (currentSchedules.length !== nextSchedules.length + retainedLocals.length) {
            hasChanges = true;
        }

        if (hasChanges) {
            const newSchedules = [...nextSchedules, ...retainedLocals].sort((a, b) => a.date.getTime() - b.date.getTime());
            setSchedules(newSchedules);
            setSelectedDays(newSchedules.map(s => s.date));
        }
    }, [initialValidSchedules]);

    const handleDaysChange = useCallback((days: Date[] | undefined) => {
        const newDays = days ?? [];
        const selectedDateStrings = new Set(newDays.map(d => d.toDateString()));

        // Check if any saved (status != null) schedules were unselected
        const removedSaved = schedulesRef.current.some(s =>
            !selectedDateStrings.has(s.date.toDateString()) && s.status
        );

        if (removedSaved) {
            toast.warning("Saved dates cannot be removed from the calendar.", {
                description: "You can update their status in the sidebar instead."
            });
        }

        const existingDates = new Map(schedulesRef.current.map(s => [s.date.toDateString(), s]));

        const kept = schedulesRef.current.filter(s => {
            const isSelected = selectedDateStrings.has(s.date.toDateString());
            if (!isSelected && s.status) {
                return true;
            }
            return isSelected;
        });

        const nextDates = kept.map(s => s.date);
        const added = newDays
            .filter(d => !existingDates.has(d.toDateString()))
            .map(d => {
                nextDates.push(d);
                return {
                    date: d,
                    price: basePrice,
                    maxGroupSize: baseMaxGroupSize,
                };
            });

        // Set both states synchronously outside of updaters
        setSelectedDays(nextDates);
        setSchedules([...kept, ...added].sort((a, b) => a.date.getTime() - b.date.getTime()));
        setExpandedId('');
    }, [basePrice, baseMaxGroupSize]);

    const updateSchedule = useCallback((dateId: string, updates: Partial<Schedule>) => {
        setSchedules(prev => prev.map(s => getDateId(s.date) === dateId ? { ...s, ...updates, isEdited: true } : s));
    }, []);

    const updateSchedules = useCallback((dateIds: string[], updates: Partial<Schedule>) => {
        const idSet = new Set(dateIds);
        setSchedules(prev => prev.map(s => idSet.has(getDateId(s.date)) ? { ...s, ...updates, isEdited: true } : s));
    }, []);

    const removeSchedule = useCallback((dateId: string) => {
        const schedule = schedulesRef.current.find(s => getDateId(s.date) === dateId);
        if (schedule) {
            setSelectedDays(days => days.filter(d => d.toDateString() !== schedule.date.toDateString()));
        }
        setSchedules(prev => prev.filter(s => getDateId(s.date) !== dateId));
        setExpandedId(prev => prev === dateId ? '' : prev);
        setCheckedIds(prev => prev.filter(checkedId => checkedId !== dateId));
    }, []);

    const removeSchedules = useCallback((dateIds: string[]) => {
        const idSet = new Set(dateIds);
        const schedulesToRemove = schedulesRef.current.filter(s => idSet.has(getDateId(s.date)));
        if (schedulesToRemove.length > 0) {
            const datesToRemove = new Set(schedulesToRemove.map(s => s.date.toDateString()));
            setSelectedDays(days => days.filter(d => !datesToRemove.has(d.toDateString())));
        }
        setSchedules(prev => prev.filter(s => !idSet.has(getDateId(s.date))));
        setExpandedId(prev => idSet.has(prev) ? '' : prev);
        setCheckedIds(prev => prev.filter(checkedId => !idSet.has(checkedId)));
    }, []);

    const toggleChecked = useCallback((dateId: string) => {
        setCheckedIds(prev =>
            prev.includes(dateId) ? prev.filter(checkedId => checkedId !== dateId) : [...prev, dateId]
        );
    }, []);

    return (
        <ScheduleContext.Provider value={{
            selectedDays,
            schedules,
            expandedId,
            setExpandedId,
            focusTrigger,
            triggerFocus,
            sidebarOpen,
            setSidebarOpen,
            handleDaysChange,
            updateSchedule,
            updateSchedules,
            removeSchedule,
            removeSchedules,
            checkedIds,
            setCheckedIds,
            statusFilter,
            setStatusFilter,
            monthFilter,
            setMonthFilter,
            toggleChecked,
            tomorrow,
            yearFromTomorrow,
        }}>
            {children}
        </ScheduleContext.Provider>
    );
}
