import { DayPicker, DayButtonProps } from "@daypicker/react";
import "@daypicker/react/style.css";
import { cn } from "@/lib/utils";
import { Info, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useSchedule, type Schedule, STATUS } from "./schedule-context";
import { getDateId } from "@/lib/dates";

export default function CalendarSchedular() {
    const {
        schedules, selectedDays, handleDaysChange, setExpandedId, triggerFocus,
        setSidebarOpen, statusFilter, setStatusFilter, monthFilter, setMonthFilter,
        tomorrow, yearFromTomorrow
    } = useSchedule();

    // Build a lookup map: dateId -> schedule for the custom day button
    const scheduleMap = new Map(schedules.map(s => [getDateId(s.date), s]));

    return (
        <div className="flex-1 p-6 overflow-y-auto">
            {/* Header section */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-lg font-bold text-foreground mb-1">Departure Dates</h2>
                    <p className="text-primary text-sm">Manage when this trek is available for booking.</p>
                </div>
            </div>

            {/* Calendar section */}
            <div className="bg-white rounded-2xl border border-border shadow-sm flex flex-col">
                <div className="">
                    <DayPicker
                        components={{
                            DayButton: (props) => (
                                <CustomDayButton
                                    {...props}
                                    scheduleMap={scheduleMap}
                                    onEditSchedule={(dateId) => {
                                        const target = schedules.find(s => getDateId(s.date) === dateId);
                                        if (target) {
                                            const itemStatus = target.status || STATUS.new.value;
                                            const itemMonth = target.date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
                                            let toastFired = false;

                                            if (statusFilter.length > 0 && !statusFilter.includes(itemStatus)) {
                                                setStatusFilter([]);
                                                toast.info("Filters cleared to reveal selected schedule");
                                                toastFired = true;
                                            }
                                            if (monthFilter.length > 0 && !monthFilter.includes(itemMonth)) {
                                                setMonthFilter([]);
                                                if (!toastFired) {
                                                    toast.info("Filters cleared to reveal selected schedule");
                                                }
                                            }
                                        }
                                        setExpandedId(dateId);
                                        triggerFocus();
                                        setSidebarOpen(true);
                                    }}
                                />
                            ),
                        }}
                        mode="multiple"
                        selected={selectedDays}
                        onSelect={handleDaysChange}
                        className="w-full"
                        disabled={{ before: tomorrow }}
                        startMonth={tomorrow}
                        endMonth={yearFromTomorrow}
                        classNames={{
                            months: "w-full",
                            month: "w-full relative overflow-hidden rounded-t-2xl",
                            month_caption: "flex justify-center items-center w-full h-[56px] bg-[#F6F8F6]",
                            caption_label: "text-base font-bold text-foreground m-auto ",
                            nav: "absolute w-full flex justify-between items-center top-0 left-0 h-[56px] z-10 rounded-t-2xl",
                            button_previous: "cursor-pointer h-8 w-8 ml-2 bg-transparent flex items-center justify-center rounded-md hover:bg-slate-100 text-[#0D1B12] aria-disabled:opacity-40 aria-disabled:cursor-not-allowed",
                            button_next: "cursor-pointer h-8 w-8 mr-2 bg-transparent flex items-center justify-center rounded-md hover:bg-slate-100 text-[#0D1B12] aria-disabled:opacity-40 aria-disabled:cursor-not-allowed",
                            chevron: "size-5 fill-current",
                            month_grid: "w-full table-fixed border-collapse mt-4",
                            weekdays: "w-full",
                            weekday: "text-slate-400 font-bold text-xs uppercase tracking-wider pb-6 font-normal",
                            week: "w-full",
                            day: "text-center p-1 align-middle",
                            day_button: "aspect-square relative overflow-hidden h-full w-full mx-auto rounded-xl transition-colors text-base font-medium text-slate-700 hover:bg-primary-100 hover:text-slate-900",
                            // selected: "[&>button]:bg-primary [&>button]:text-white [&>button:hover]:bg-primary [&>button:hover]:text-white",
                            today: "font-bold text-foreground",
                            outside: "text-slate-300 opacity-50",
                        }}
                    />
                </div>

                {/* Footer Legend */}
                <div className="bg-slate-50 border-t border-border p-4 px-6 flex items-center gap-6 mt-auto">
                    <div className="flex items-center gap-2.5">
                        <div className="w-3.5 h-3.5 rounded-full bg-primary"></div>
                        <span className="text-sm font-bold text-foreground">Selected Departure</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300"></div>
                        <span className="text-sm text-magic-green font-medium">Available</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

type CustomDayButtonProps = DayButtonProps & {
    scheduleMap: Map<string, Schedule>;
    onEditSchedule: (dateId: string) => void;
};

const CustomDayButton = (props: CustomDayButtonProps) => {
    // console.log(props);

    const { day, disabled, modifiers, className, scheduleMap, onEditSchedule, ...buttonProps } = props;
    const { selected: isButtonSelected } = modifiers;
    const schedule = scheduleMap.get(getDateId(day.date));
    const status = schedule?.status;
    let buttonBg = "";
    let dayColor = "";
    let priceColor = "";
    let editBtnColor = "";

    switch (status) {
        case STATUS.cancel_req.value:
            buttonBg = "bg-danger-red/10 border-2 border-danger-red hover:bg-danger-red/10 text-danger-red hover:text-danger-red!";
            dayColor = "text-foreground";
            editBtnColor = "text-danger-red";
            priceColor = "text-danger-red";
            break;
        case STATUS.cancelled.value:
            buttonBg = "bg-slate-200/80 hover:bg-slate-200/80";
            dayColor = "text-foreground/60";
            editBtnColor = "text-red-500";
            priceColor = "";
            break;
        case STATUS.available.value:
            buttonBg = "bg-magic-green/15 border-2 border-magic-green hover:bg-magic-green/15 hover:text-magic-green! text-magic-green"
            dayColor = "text-foreground";
            editBtnColor = "text-magic-green";
            priceColor = "text-magic-green";
            break;
        case STATUS.sold_out.value:
            buttonBg = "bg-[#EF7D00]/10 border-2 border-[#EF7D00] hover:bg-[#EF7D00]/10 text-[#EF7D00] hover:text-[#EF7D00]!"
            dayColor = "text-foreground";
            editBtnColor = "text-[#EF7D00]";
            priceColor = "text-[#EF7D00]";

            break;
        default:
            buttonBg = "bg-primary hover:bg-primary hover:text-white text-white"
            dayColor = "text-white";
            editBtnColor = "text-white";
            priceColor = "text-white";

            break;
    }
    return (
        <button
            {...buttonProps}
            className={cn("cursor-pointer relative font-semibold! flex flex-col p-2 items-center",
                className,
                isButtonSelected ? "justify-between " + buttonBg : "justify-center",
                disabled && "hover:bg-transparent! cursor-not-allowed"

            )}
        >
            <span className={cn("w-full leading-none", isButtonSelected ? "text-left pt-1 " + dayColor : "text-center")}>{day.date.getDate()}</span>

            {isButtonSelected && schedule &&
                <>
                    {status === STATUS.cancelled.value
                        ? <span className="w-full text-sm flex pb-1">
                            <span className="mx-auto text-center px-3 py-0.5 rounded-md border bg-slate-300/80 text-foreground/50">CANCELLED</span>
                        </span>
                        : <span className="text-left w-full">
                            {schedule.price && <><span className={cn("text-sm", priceColor)}>₹ {schedule.price}/-</span><br /></>}
                            {schedule.maxGroupSize && <span className={cn("text-sm", status ? "text-foreground/50" : "text-white/60")}>{schedule.maxGroupSize} spots</span>}
                            {!schedule.price && !schedule.maxGroupSize && <span className="text-sm opacity-60">No details</span>}
                        </span>
                    }

                    {status !== STATUS.cancelled.value && <span
                        onClick={(e) => {
                            e.stopPropagation();
                            onEditSchedule(getDateId(schedule.date));
                        }}
                        className="absolute p-1 hover:bg-transparent backdrop-blur-md rounded-md top-2 right-2 cursor-pointer"
                        role="button"
                    >
                        {status === STATUS.cancel_req.value ? <Info className={cn("size-4", editBtnColor)} /> : <Pencil className={cn("size-4", editBtnColor)} />}
                    </span>}
                </>
            }

        </button>
    );
}