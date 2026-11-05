import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, Footprints } from "lucide-react";

interface LocationHeroProps {
  slug: string;
  name: string;
  tagline: string;
  heroImage: string;
}

// Redirect buttons, not tabs: neither has an active state. The filtered listing
// routes don't exist yet, so these links currently lead to a 404.
const links = [
  { id: "trek", label: "Trek", icon: Footprints, getDescription: (name: string) => `Explore treks in ${name}` },
  { id: "experience", label: "Experience", icon: Compass, getDescription: (name: string) => `Discover experiences in ${name}` },
] as const;

export function LocationHero({ slug, name, tagline, heroImage }: LocationHeroProps) {
  return (
    <section>
      <div className="relative w-full h-70 md:h-98 rounded-3xl overflow-hidden">
        <Image src={heroImage} alt={name} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
          <h1 className="text-title md:text-display font-bold text-white font-bricolage-grotesque mb-2">
            Explore {name}
          </h1>
          <p className="text-white/85 font-medium max-w-2xl text-sm md:text-base">{tagline}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {links.map(({ id, label, icon: Icon, getDescription }) => (
          <Link
            key={id}
            href={`/${id}?location=${slug}`}
            className="group flex items-center gap-4 p-4 md:p-5 bg-white rounded-2xl border border-zinc-100 shadow-raised-sm hover:shadow-lg hover:border-primary/40 transition-all duration-300"
          >
            <span className="flex items-center justify-center size-12 md:size-14 shrink-0 rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
              <Icon className="size-6" />
            </span>

            <span className="flex flex-col gap-0.5 min-w-0">
              <span className="text-lg font-bold text-foreground leading-tight">{label}</span>
              <span className="text-sm font-medium text-zinc-400 truncate">{getDescription(name)}</span>
            </span>

            <ArrowRight className="size-5 ml-auto shrink-0 text-zinc-300 transition-all duration-300 group-hover:text-primary group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </section>
  );
}
