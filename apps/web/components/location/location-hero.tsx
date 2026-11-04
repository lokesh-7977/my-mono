"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@repo/ui/lib/utils";
import { Compass, Footprints } from "lucide-react";

interface LocationHeroProps {
  name: string;
  tagline: string;
  heroImage: string;
}

const tabs = [
  { id: "trek", label: "Trek", icon: Footprints },
  { id: "experience", label: "Experience", icon: Compass },
] as const;

export function LocationHero({ name, tagline, heroImage }: LocationHeroProps) {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("trek");

  return (
    <section className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <div className="relative w-full h-70 md:h-90 rounded-3xl overflow-hidden">
        <Image src={heroImage} alt={name} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
          <h1 className="text-title md:text-display font-bold text-white font-bricolage-grotesque mb-2">
            Explore {name}
          </h1>
          <p className="text-white/85 font-medium max-w-2xl text-sm md:text-base">{tagline}</p>
        </div>
      </div>

      <div className="flex gap-4 mt-6 border-b border-zinc-100">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 -mb-px transition-colors cursor-pointer",
              active === id ? "border-primary text-primary" : "border-transparent text-zinc-400 hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}
