import Image from "next/image";
import { Star } from "lucide-react";

export function PackageProvider() {
  return (
    <div className="rounded-2xl border border-zinc-200 p-6 flex items-center gap-5 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.03)]">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl">
        <Image
          src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200"
          alt="Harish Dhanu"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-xl font-bold text-primary leading-tight">Harish Dhanu</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100 ">
            Eco Certified
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 text-xs font-semibold border border-orange-100 ">
            IMF Certified
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-foreground/50 mt-0.5">
          <span>12 Yrs</span>
          <span className="size-1 rounded-full bg-zinc-300" />
          <div className="flex items-center gap-1">
            <Star className="size-3 fill-yellow-400 text-yellow-400" />
            <span>5.0</span>
          </div>
          <span className="size-1 rounded-full bg-zinc-300" />
          <span>2K Reviews</span>
        </div>
      </div>
    </div>
  );
}
