import { CheckCircle2, XCircle } from 'lucide-react';

interface SectionProps {
  title: string;
  items: string[];
  type: 'inclusion' | 'exclusion' | 'highlight';
}

const InfoSection = ({ title, items, type }: SectionProps) => {
  const Icon = type === 'exclusion' ? XCircle : CheckCircle2;
  const iconColor = type === 'exclusion' ? 'text-red-500' : 'text-emerald-500';

  return (
    <div className="pb-6 border-b border-zinc-200 last:border-b-0 last:pb-0">
      <div className="grid grid-cols-1 md:grid-cols-[198px_1fr] gap-6 md:gap-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColor}`} strokeWidth={1.5} />
              <span className="text-zinc-700 text-base leading-relaxed font-medium">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const PackageInfoSections = () => {
  const inclusions = [
    "Accommodation",
    "Meals",
    "Permit Charges",
    "Trek Equipments",
    "Certified trek leader",
    "Emergency oxygen & first aid"
  ];

  const exclusions = [
    "Anything apart from inclusions",
    "The cab fare is not included in the package.",
    "Offloading charges are not included",
    "Food during the travel to and from the base camp is in your expense."
  ];

  const highlights = [
    "Visit the Museum of Modern Art in Manhattan",
    "See amazing works of contemporary art, including Vincent van Gogh's The Starry Night",
    "Check out Campbell's Soup Cans by Warhol and The Dance (I) by Matisse",
    "Behold masterpieces by Gauguin, Dali, Picasso, and Pollock",
    "Enjoy free audio guides available in English, French, German, Italian, Spanish, Portuguese."
  ];

  return (
    <>
      <InfoSection title="Inclusions" items={inclusions} type="inclusion" />
      <InfoSection title="Exclusions" items={exclusions} type="exclusion" />
      <InfoSection title="Highlights" items={highlights} type="highlight" />
    </>
  );
};
