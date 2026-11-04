interface LocationBackdropProps {
  title: string;
  description: string;
}

export function LocationBackdrop({ title, description }: LocationBackdropProps) {
  return (
    <section className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-zinc-50">
      <h2 className="text-title font-bold text-foreground font-bricolage-grotesque mb-6">{title}</h2>
      <p className="text-zinc-600 text-sm font-medium leading-relaxed max-w-4xl">{description}</p>
    </section>
  );
}
