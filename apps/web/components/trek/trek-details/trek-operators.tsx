"use client";

import React from "react";
import Image from "next/image";
import { Star, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@repo/ui/components/button";

const operators = [
  {
    name: "Harish Dhanu",
    image: "https://i.pravatar.cc/300?u=harish",
    experience: "12 Yrs",
    rating: "5.0",
    reviews: "2K Reviews",
    badges: [
      { label: "Eco Certified", variant: "eco" },
      { label: "IMF Certified", variant: "imf" }
    ],
    price: "₹18,500/-"
  },
  {
    name: "Priya Thakur",
    image: "https://i.pravatar.cc/300?u=priya",
    experience: "12 Yrs",
    rating: "5.0",
    reviews: "2K Reviews",
    badges: [
      { label: "Eco Certified", variant: "eco" },
      { label: "Scout Shakti", variant: "shakti" }
    ],
    price: "₹18,500/-"
  },
  {
    name: "Rishabh Kumar",
    image: "https://i.pravatar.cc/300?u=rishabh",
    experience: "12 Yrs",
    rating: "5.0",
    reviews: "2K Reviews",
    badges: [
      { label: "Eco Certified", variant: "eco" },
      { label: "IMF Certified", variant: "imf" }
    ],
    price: "₹18,500/-"
  }
];

function OperatorCard({ operator }: { operator: typeof operators[0] }) {
  return (
    <div className="bg-white rounded-4xl border border-zinc-100 p-8 flex flex-col items-center text-center transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1">
      <div className="relative w-30 h-30 rounded-4xl overflow-hidden mb-6 shadow-sm">
        <Image
          src={operator.image}
          alt={operator.name}
          fill
          className="object-cover"
        />
      </div>

      <h3 className="text-[19px] font-black text-[#0F3D3A] mb-4 font-bricolage-grotesque">
        {operator.name}
      </h3>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex flex-col">
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{operator.experience}</span>
        </div>
        <div className="w-px h-3 bg-zinc-200" />
        <div className="flex items-center gap-1.5">
          <Star className="size-3 text-yellow-500 fill-yellow-500" />
          <span className="text-[12px] font-black text-[#0F3D3A]">{operator.rating}</span>
        </div>
        <div className="w-px h-3 bg-zinc-200" />
        <div className="flex flex-col">
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{operator.reviews}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-8">
        {operator.badges.map((badge, idx) => (
          <span
            key={idx}
            className={`px-4 py-1.5 rounded-full text-[11px] font-black tracking-tight ${badge.variant === 'eco' ? 'bg-[#E8F5E9] text-[#2E7D32]' :
              badge.variant === 'imf' ? 'bg-[#FFF3E0] text-[#EF6C00]' :
                'bg-[#E0F7FA] text-[#00838F]'
              }`}
          >
            {badge.label}
          </span>
        ))}
      </div>

      <div className="w-full h-px bg-zinc-50 mb-6" />

      <div className="w-full flex items-center justify-between">
        <span className="text-xl font-black text-[#0F3D3A]">{operator.price}</span>
        <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary/5 text-primary text-[13px] font-black hover:bg-primary/10 transition-all group">
          View Details
          <ChevronRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}

export function TrekOperators() {
  return (
    <div className="flex flex-col gap-10 border-t border-zinc-200 pt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-[26px] font-bold text-[#0F3D3A] font-bricolage-grotesque">
          Available Groups & Operators
        </h2>
        <Button className="h-12 rounded-xl bg-primary hover:bg-[#3ba4a2] text-white px-8 font-bold flex items-center gap-2">
          View All
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {operators.map((operator, index) => (
          <OperatorCard key={index} operator={operator} />
        ))}
      </div>
    </div>
  );
}
