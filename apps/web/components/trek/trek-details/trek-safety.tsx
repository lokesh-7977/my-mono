"use client";

import { CheckCircle2 } from "lucide-react";

const safetyRules = [
  {
    number: "01.",
    title: "AMS Awareness",
    description: "We monitor oxygen levels daily at every camp."
  },
  {
    number: "02.",
    title: "Hydration",
    description: "Drink 4L of water daily to combat altitude sickness."
  },
  {
    number: "03.",
    title: "Group Discipline",
    description: "Stick with the lead guide during the summit push."
  }
];

export function TrekSafety() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-16 pb-20 border-t border-zinc-100 pt-16">
      {/* Left Column: Safety & Discipline */}
      <div className="flex flex-col gap-8">
        <h2 className="text-[28px] font-bold text-[#0F3D3A] font-bricolage-grotesque">
          Safety & Discipline
        </h2>

        <div className="flex flex-col gap-6">
          {safetyRules.map((rule, index) => (
            <div key={index} className="flex items-start gap-4">
              <span className="text-[15px] font-black text-zinc-400 mt-0.5">
                {rule.number}
              </span>
              <p className="text-[15px] leading-relaxed">
                <span className="font-bold text-[#0F3D3A]">{rule.title}:</span>{" "}
                <span className="text-zinc-500 font-medium">{rule.description}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Permits & Guidelines */}
      <div className="bg-[#f0f9f4] border border-[#d1e9d9] rounded-[24px] p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h3 className="text-2xl font-bold text-[#0F3D3A] font-bricolage-grotesque">
            Permits & Guidelines
          </h3>
          <p className="text-[15px] text-zinc-600 font-medium leading-relaxed">
            The trek passes through Govind Pashu Vihar. All permits and forest entry fees are handled by our team. Please carry a valid Photo ID and a Medical Fitness Certificate.
          </p>
        </div>

        <div className="flex items-center gap-2.5 mt-2">
          <div className="size-6 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32]">
            <CheckCircle2 className="size-4" strokeWidth={3} />
          </div>
          <span className="text-[15px] font-bold text-[#2E7D32]">
            Government Approved Operator
          </span>
        </div>
      </div>
    </div>
  );
}
