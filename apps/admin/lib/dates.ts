import { addDays, startOfDay, format } from "date-fns";

export const getDateFromToday = (days: number) => {
    return addDays(startOfDay(new Date()), days);
}

export const getDateId = (date: Date) => {
    return format(date, 'yyyy-MM-dd');
}
