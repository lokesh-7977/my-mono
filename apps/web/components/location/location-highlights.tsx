interface LocationHighlightsProps {
  highlights: { title: string; description: string }[];
}

export function LocationHighlights({ highlights }: LocationHighlightsProps) {
  return (
    <section className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-title font-bold text-foreground font-bricolage-grotesque mb-6">Highlight</h2>

      <div className="flex flex-col gap-4">
        {highlights.map((h) => (
          <p key={h.title} className="text-sm text-zinc-600 leading-relaxed">
            <span className="font-bold text-foreground">{h.title}: </span>
            {h.description}
          </p>
        ))}
      </div>
    </section>
  );
}
