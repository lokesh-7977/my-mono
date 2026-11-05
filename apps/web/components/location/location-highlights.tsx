interface LocationHighlightsProps {
  highlights: { title: string; description: string }[];
}

export function LocationHighlights({ highlights }: LocationHighlightsProps) {
  return (
    <section className="py-2">
      <h2 className="text-heading font-bold text-foreground font-bricolage-grotesque mb-4">Highlight</h2>

      <div className="space-y-1">
        {highlights.map((h) => (
          <p key={h.title} className="text-zinc-600 leading-relaxed">
            <span className="font-semibold text-foreground">{h.title}: </span>
            {h.description}
          </p>
        ))}
      </div>
    </section>
  );
}
