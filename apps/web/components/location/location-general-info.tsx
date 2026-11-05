import type { LocationGeneralInfo } from "@/lib/location-mock";

interface LocationGeneralInfoProps {
  info: LocationGeneralInfo[];
}

export function LocationGeneralInfoSection({ info }: LocationGeneralInfoProps) {
  return (
    <section className="w-full max-w-360 mx-auto mt-10 mb-2 px-4 sm:px-6 lg:px-8 py-10 rounded-lg bg-zinc-50">
      <h2 className="text-title font-bold text-foreground font-bricolage-grotesque mb-8">General info</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
        {info.map((item) => (
          <div key={item.label} className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-primary">{item.label}</span>
            <h3 className="text-lead font-bold text-foreground">{item.title}</h3>
            <p className="text-sm text-zinc-500 font-medium leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
