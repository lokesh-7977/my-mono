"use client";

import React from "react";

const arrivalInfo = [
  {
    label: "Nearest airport",
    detail: "Gaggal Airport (Kangra), 14 km • Taxis to McLeod Ganj ₹400-600"
  },
  {
    label: "Nearest railway",
    detail: "Pathankot Junction (90 km) • Pathankot-Kangra toy train to Dharamshala, then taxi"
  },
  {
    label: "By road from Delhi",
    detail: "485 km • 9-10 hrs by car or overnight Volvo bus (₹700-1,400)"
  },
  {
    label: "By road from Chandigarh",
    detail: "240 km • 5 hrs • HRTC buses from ISBT 43 available"
  },
  {
    label: "Trek start point",
    detail: "Gallu Devi Temple • 1,457m altitude • 7 km from McLeod Ganj by taxi (₹150)"
  },
  {
    label: "Parking",
    detail: "Available at Dharamkot, limited. Hire taxi from McLeod Ganj to trailhead."
  }
];

export function TrekArrival() {
  return (
    <div className="flex flex-col gap-8 mt-16 mb-20">
      <div className="flex flex-col gap-4">
        <h2 className="text-[28px] font-bold text-[#0F3D3A] font-bricolage-grotesque">
          How to Reach Kashmir Great Lakes Trek Basecamp
        </h2>
        <p className="text-[15px] text-zinc-500 font-medium leading-[1.7]">
          Triund sits above McLeod Ganj in the Kangra district of Himachal Pradesh. The trek begins either from Dharamkot village (7 km from McLeod Ganj) or directly from Gallu Devi Temple — both are a short taxi ride from McLeod Ganj market.
        </p>
      </div>

      <div className="overflow-hidden border border-primary/20 rounded-[20px] shadow-sm">
        {arrivalInfo.map((item, index) => (
          <div 
            key={index} 
            className={`flex flex-col md:flex-row border-b last:border-b-0 border-primary/10`}
          >
            <div className="w-full md:w-[240px] bg-[#F3FAF9] py-5 px-8 shrink-0">
              <span className="text-[14px] font-bold text-primary">
                {item.label}
              </span>
            </div>
            <div className="flex-1 bg-white py-5 px-8 flex items-center">
              <span className="text-[14px] text-zinc-600 font-medium leading-relaxed">
                {item.detail}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
