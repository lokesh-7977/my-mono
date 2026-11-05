// TEMPORARY placeholder data for the "Weather Conditions" modal.
//
// See apps/docs/checklists/master-trek/weather-conditions-modal-checklist.md — apps/api has no
// weather integration yet. This file stands in until that lands.
//
// Swap-out plan: once GET /api/master-trek/public/slug/{slug}/weather
// exists, replace this mock with a real fetch triggered on modal open
// (not on page load — see the checklist doc for why), matching this same
// shape. WeatherModal already expects exactly this shape, so no component
// changes should be needed.

export type WeatherRiskLevel = "LOW" | "MODERATE" | "HIGH";

export interface MonthlyClimate {
  month: number; // 1-12
  avgHighC: number;
  avgLowC: number;
}

export interface TrekWeatherData {
  climate: {
    idealWindow: string;
    primeWindowNote: string;
    snowRisk: WeatherRiskLevel;
    rainRisk: WeatherRiskLevel;
    monthly: MonthlyClimate[];
  } | null;
  current: {
    temperatureC: number;
    condition: string;
  } | null;
}

export const MOCK_TREK_WEATHER: TrekWeatherData = {
  climate: {
    idealWindow: "March to June & September to November",
    primeWindowNote:
      "Day temperatures hover around 15°C to 25°C. Nights can drop to 5°C. Monsoon (July-August) is risky due to slippery trails.",
    snowRisk: "HIGH",
    rainRisk: "MODERATE",
    monthly: [
      { month: 3, avgHighC: 14, avgLowC: 3 },
      { month: 4, avgHighC: 18, avgLowC: 6 },
      { month: 5, avgHighC: 22, avgLowC: 9 },
      { month: 6, avgHighC: 24, avgLowC: 11 },
      { month: 7, avgHighC: 20, avgLowC: 12 },
      { month: 8, avgHighC: 19, avgLowC: 11 },
      { month: 9, avgHighC: 20, avgLowC: 8 },
      { month: 10, avgHighC: 17, avgLowC: 4 },
    ],
  },
  current: {
    temperatureC: 18,
    condition: "Sunny",
  },
};

const MONTH_LABELS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export const monthLabel = (month: number): string => MONTH_LABELS[month - 1] ?? "";
