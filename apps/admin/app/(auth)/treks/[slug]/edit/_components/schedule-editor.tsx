"use client";
import { ScheduleProvider, type Schedule, STATUS } from "./schedule-context";
import AvailabilitySidebar from "./availaibity-sidebar";
import CalendarSchedular from "./calendar-schedular";
import { EditHeader } from "./edit-header";

export default function ScheduleEditor() {
    // In a real scenario, these base values would be fetched from the database for this specific trek
    const trekBasePrice = "12000";
    const trekBaseMaxGroupSize = "15";

    const savedDates: Schedule[] = [
        {
            id: "1",
            date: new Date("2026-07-20"),
            price: "14000",
            maxGroupSize: "15",
            status: STATUS.available.value,
        },
        {
            id: "2",
            date: new Date("2026-08-03"),
            price: "12000",
            maxGroupSize: "15",
            status: STATUS.sold_out.value,
        },
        {
            id: "3",
            date: new Date("2026-08-05"),
            price: "12000",
            maxGroupSize: "15",
            status: STATUS.cancelled.value,
        },
        {
            id: "4",
            date: new Date("2026-08-15"),
            price: "12000",
            maxGroupSize: "15",
            status: STATUS.cancel_req.value,
        },
        {
            id: "5",
            date: new Date("2026-08-18"),
            price: "12000",
            maxGroupSize: "15",
            status: STATUS.available.value,
        },
        {
            id: "6",
            date: new Date("2026-08-25"),
            price: "12000",
            maxGroupSize: "15",
            status: STATUS.sold_out.value,
        },
        {
            id: "7",
            date: new Date("2026-09-03"),
            price: "12000",
            maxGroupSize: "15",
            status: STATUS.cancelled.value,
        },
        {
            id: "8",
            date: new Date("2026-09-15"),
            price: "12000",
            maxGroupSize: "15",
            status: STATUS.cancel_req.value,
        },
        {
            id: "9",
            date: new Date("2026-09-18"),
            price: "12000",
            maxGroupSize: "15",
            status: STATUS.available.value,
        },
        {
            id: "10",
            date: new Date("2026-09-25"),
            price: "12000",
            maxGroupSize: "15",
            status: STATUS.sold_out.value,
        },
        {
            id: "11",
            date: new Date("2026-10-03"),
            price: "12000",
            maxGroupSize: "15",
            status: STATUS.cancelled.value,
        },
        {
            id: "12",
            date: new Date("2026-10-15"),
            price: "12000",
            maxGroupSize: "15",
            status: STATUS.cancel_req.value,
        },
        {
            id: "13",
            date: new Date("2026-10-18"),
            price: "12000",
            maxGroupSize: "15",
            status: STATUS.available.value,
        }
    ]

    return (
        <ScheduleProvider basePrice={trekBasePrice} baseMaxGroupSize={trekBaseMaxGroupSize} initialSchedules={savedDates}>
            <>
                <EditHeader />
                <div className="flex flex-1 bg-slate-50 mx-auto">
                    <AvailabilitySidebar />
                    <CalendarSchedular />
                </div>
            </>
        </ScheduleProvider>
    );
}