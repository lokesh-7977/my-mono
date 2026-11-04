
import Image from "next/image";
import {
    Mountain,
    Car,
    Route,
} from "lucide-react";
import ItineraryModal from "../itinerary-modal";

const itineraryDays = [
    {
        day: "DAY 01",
        title: "Drive from Srinagar to Gagangir",
        altitude: "9,800 FT",
        duration: "2 Hour Drive",
        distance: "5-6 KM",
        description: "Arrive at Shuru Homestay by 10:30 AM. After lunch, depart for Jobra (a 2-hour drive). The cab fare is Rs 3,000 per vehicle, which is not included in the trek fee.",
        image: "https://images.scoutripper.com/treks/kashmir-great-lake-trek/Kashmir Great Lakes-bg.png"
    },
    {
        day: "DAY 02",
        title: "Drive from Gagangir to Shitkadi. Trek to Nichnai",
        altitude: "9,800 FT",
        duration: "2 Hour Drive",
        distance: "5-6 KM",
        description: "Arrive at Shuru Homestay by 10:30 AM. After lunch, depart for Jobra (a 2-hour drive). The cab fare is Rs 3,000 per vehicle, which is not included in the trek fee.",
        image: "https://images.scoutripper.com/treks/hampta-pass-trek/beauty-of-hampta-pass-trek.jpg"
    },
    {
        day: "DAY 03",
        title: "Trek from Nichnai to Vishansar Lake",
        altitude: "12,000 FT",
        duration: "6-7 Hours",
        distance: "12 KM",
        description: "Begin an early morning trek crossing the Nichnai Pass at 13,500 ft. Descend through alpine meadows to the pristine Vishansar Lake, surrounded by snow-capped peaks and crystal-clear waters.",
        image: "https://images.scoutripper.com/treks/triund-trek/camps-in-triund.png"
    },
    {
        day: "DAY 04",
        title: "Trek from Vishansar to Gadsar Lake",
        altitude: "13,750 FT",
        duration: "5-6 Hours",
        distance: "10 KM",
        description: "Cross the Gadsar Pass, the highest point of the trek at 13,750 ft. Witness breathtaking panoramic views before descending to the stunning Gadsar Lake, also known as the 'Lake of Fish'.",
        image: "https://images.scoutripper.com/treks/kedarnath-dham/kedarnath-dham-view-of-kedarnath-temple.png"
    },
    {
        day: "DAY 05",
        title: "Trek from Gadsar to Satsar and drive to Srinagar",
        altitude: "12,000 FT",
        duration: "4-5 Hours",
        distance: "8 KM",
        description: "Trek through the beautiful Satsar meadows, passing by seven interconnected mountain lakes. After reaching the endpoint, board vehicles for the scenic drive back to Srinagar by evening.",
        image: "https://images.scoutripper.com/treks/kashmir-great-lake-trek/Kashmir Great Lakes-bg.png"
    },
    {
        day: "DAY 06",
        title: "Trek from Gadsar to Satsar and drive to Srinagar",
        altitude: "12,000 FT",
        duration: "4-5 Hours",
        distance: "8 KM",
        description: "Trek through the beautiful Satsar meadows, passing by seven interconnected mountain lakes. After reaching the endpoint, board vehicles for the scenic drive back to Srinagar by evening.",
        image: "https://images.scoutripper.com/treks/kareri-lake-trek/kareri-lake-trek-summer.webp"
    },
    {
        day: "DAY 07",
        title: "Trek from Gadsar to Satsar and drive to Srinagar",
        altitude: "12,000 FT",
        duration: "4-5 Hours",
        distance: "8 KM",
        description: "Trek through the beautiful Satsar meadows, passing by seven interconnected mountain lakes. After reaching the endpoint, board vehicles for the scenic drive back to Srinagar by evening.",
        image: "https://images.scoutripper.com/treks/kashmir-great-lake-trek/Kashmir Great Lakes-bg.png"
    },
];

// Only show the first 2 days in the preview
const previewDays = itineraryDays.slice(0, 2);

export default function PackageItinerary() {
    return (
        <section className="border-b border-zinc-200 pb-6">
            <h2 className="text-[26px] font-bold mb-6">
                Itinerary for Triund Trek by Gallu Temple
            </h2>

            {/* Timeline Section */}
            <div className="relative flex flex-col gap-9.5 mt-10">
                {/* Continuous Vertical Line */}
                <div className="absolute left-0.75 top-0 w-0.5 bg-zinc-100 h-full" />

                {previewDays.map((day, index) => (
                    <div key={index} className="relative pl-10 flex flex-col gap-10 md:flex-row pt-4">
                        {/* Timeline Dot */}
                        <div className="absolute -left-0.5 top-1 size-3 rounded-full bg-primary ring-4 ring-zinc-100 z-10 mt-1" />

                        <div className="flex-1 flex flex-col">
                            <div className="flex flex-col gap-1">
                                <span className="text-base font-bold text-primary uppercase tracking-wide">
                                    {day.day}
                                </span>
                                <h3 className="text-[20px] font-bold text-foreground leading-tight">
                                    {day.title}
                                </h3>
                            </div>

                            {/* Day Badges */}
                            <div className="flex items-center gap-3 flex-wrap mt-2">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-100 text-xs font-bold text-zinc-500">
                                    <Mountain className="size-3" />
                                    {day.altitude}
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-100 text-xs font-bold text-zinc-500">
                                    <Car className="size-3" />
                                    {day.duration}
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-100 text-xs font-bold text-zinc-500">
                                    <Route className="size-3" />
                                    {day.distance}
                                </div>
                            </div>

                            <p className="text-base mt-4 text-foreground leading-relaxed font-medium line-clamp-1">
                                {day.description}
                            </p>
                        </div>

                        <div className="shrink-0 size-40 relative rounded-2xl overflow-hidden shadow-sm group cursor-pointer">
                            <Image
                                src={day.image}
                                alt={day.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            {/* <div className="absolute inset-0 group-hover:bg-black/0 transition-colors" /> */}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal trigger + dialog (client component) */}
            <ItineraryModal days={itineraryDays} />
        </section>
    );
}