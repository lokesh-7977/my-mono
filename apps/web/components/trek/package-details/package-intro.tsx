interface PackageIntroProps {
    description: string;
}

export default function PackageIntro({ description }: PackageIntroProps) {
    return (
        <section className="pb-6 border-b border-zinc-200">
            <h2 className="text-heading font-bold mb-2.5">Trek Intro</h2>
            <p className="text-base font-medium">{description}</p>
        </section>
    );
}
