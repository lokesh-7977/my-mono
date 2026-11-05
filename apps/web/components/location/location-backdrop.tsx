interface LocationBackdropProps {
  title: string;
  description: string;
}

export function LocationBackdrop({ title, description }: LocationBackdropProps) {
  return (
    <section className="py-2">
      <h2 className="text-heading font-bold text-foreground font-bricolage-grotesque mb-4">{title}</h2>
      <p className="text-zinc-600 font-medium leading-relaxed max-w-5xl">{description}</p>
    </section>
  );
}
