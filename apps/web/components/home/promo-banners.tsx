import React from "react";
import Link from "next/link";
import { MessageCircle, Compass } from "lucide-react";

export function PromoBanners() {
  return (
    <section className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Banner 1 */}
        <div className="flex-1 bg-[#F5F9FD] rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center min-h-70">
          <div className="absolute top-0 right-0 p-8 text-[#E2EEF8]">
            <MessageCircle className="w-48 h-48 -mr-16 -mt-16" />
          </div>
          
          <h3 className="text-3xl font-bold text-zinc-900 font-bricolage-grotesque mb-3 relative z-10 max-w-sm">
            Not Sure Which Trek to Choose?
          </h3>
          <p className="text-zinc-600 mb-6 relative z-10 max-w-sm">
            Talk to our experts and get personalized trek recommendations based on your experience and fitness level.
          </p>
          
          <Link href="/contact" className="relative z-10 w-max">
            <button className="bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-50 rounded-xl px-6 py-3 text-sm font-bold transition-colors">
              Chat with an Expert
            </button>
          </Link>
        </div>

        {/* Banner 2 */}
        <div className="flex-1 bg-[#F0FDF4] rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center min-h-70">
          <div className="absolute top-0 right-0 p-8 text-[#DCFCE7]">
            <Compass className="w-48 h-48 -mr-16 -mt-16" />
          </div>
          
          <h3 className="text-3xl font-bold text-zinc-900 font-bricolage-grotesque mb-3 relative z-10 max-w-sm">
            Curated Experiences
          </h3>
          <p className="text-zinc-600 mb-6 relative z-10 max-w-sm">
            Beyond standard trekking. Join our thematic expeditions, photography tours, and yoga retreats in the mountains.
          </p>
          
          <Link href="/experiences" className="relative z-10 w-max">
            <button className="bg-[#4EC5C1] text-white hover:bg-[#3EB0AD] rounded-xl px-6 py-3 text-sm font-bold transition-colors">
              Explore Experiences
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
