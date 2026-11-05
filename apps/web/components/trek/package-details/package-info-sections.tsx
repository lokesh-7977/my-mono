import { CheckCircle2, XCircle } from 'lucide-react';

interface SectionProps {
  title: string;
  items: string[];
  type: 'inclusion' | 'exclusion';
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

interface PackageInfoSectionsProps {
  inclusions: string[];
  exclusions: string[];
}

export const PackageInfoSections = ({ inclusions, exclusions }: PackageInfoSectionsProps) => {
  return (
    <>
      {inclusions.length > 0 && <InfoSection title="Inclusions" items={inclusions} type="inclusion" />}
      {exclusions.length > 0 && <InfoSection title="Exclusions" items={exclusions} type="exclusion" />}
    </>
  );
};
