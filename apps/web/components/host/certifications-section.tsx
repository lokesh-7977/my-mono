import { Award, Leaf, ShieldCheck, BriefcaseMedical } from "lucide-react";

const certifications = [
    {
        title: "IMF Accredited",
        description: "Indian Mountaineering Foundation certified operator since 2014.",
        icon: Award,
    },
    {
        title: "Eco-Trek Partner",
        description: "Commitment to leave-no-trace principles and sustainable tourism.",
        icon: Leaf,
    },
    {
        title: "ATOAI Member",
        description: "Proud member of the Adventure Tour Operators Association.",
        icon: ShieldCheck,
    },
    {
        title: "WFR Certified",
        description: "All guides hold Wilderness First Responder certification.",
        icon: BriefcaseMedical,
    },
];

export function CertificationsSection() {
    return (
        <section className="w-full bg-zinc-100 py-20 mt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-18">
                    <h2 className="text-3xl font-bold text-foreground mb-4">
                        Certifications & Accreditations
                    </h2>
                    <p className="text-lg text-foreground italic">
                        Internationally recognized standards of safety and sustainability.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {certifications.map((cert, index) => (
                        <div key={index} className="flex flex-col items-center text-center">
                            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                                <cert.icon className="size-8 text-primary" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-1">
                                {cert.title}
                            </h3>
                            <p className="text-sm text-foreground/50 leading-relaxed max-w-[240px] font-medium font-lato">
                                {cert.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
