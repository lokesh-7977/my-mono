"use client";

import { useId, useState, type FormEvent } from "react";
import { Check, Phone } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@repo/ui/components/dialog";
import WhatsApp from "@/components/icons/whatsapp";
import { submitPackageEnquiry } from "@/lib/package-enquiry-mock";
import { cn } from "@repo/ui/lib/utils";
import Divider from "@repo/ui/components/divider";

interface EnquiryModalProps {
    packageId: string;
}

const PHONE_PATTERN = /^\+?[0-9][0-9\s-]{7,14}$/;

const WHATSAPP_URL = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""}`;

interface FloatingFieldProps {
    label: string;
    name: string;
    type?: string;
    required?: boolean;
    autoComplete?: string;
    multiline?: boolean;
}

// Only transform properties animate (no layout work), so the label glides instead of jittering.
// The label is anchored at its floated spot (top-1.75); at rest it is pushed down to the field's middle
// (8.25px for one line, 9px for the textarea) and floats by returning to 0 while shrinking 15px -> 11px.
const FLOATED_LABEL =
    "peer-focus:translate-y-0 peer-focus:scale-[0.7333] " +
    "peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:scale-[0.7333] " +
    "peer-autofill:translate-y-0 peer-autofill:scale-[0.7333]";

// The label sits inside the field until it is focused or has a value, then shrinks to the top.
function FloatingField({ label, name, type = "text", required, autoComplete, multiline }: FloatingFieldProps) {
    const id = useId();
    const controlClass =
        "peer block w-full bg-transparent px-3 pt-5.25 pb-2 text-base font-semibold text-foreground outline-none placeholder:text-transparent";

    return (
        <div className="relative rounded-md border border-zinc-200 transition-colors focus-within:border-primary">
            {multiline ? (
                <textarea id={id} name={name} rows={4} placeholder=" " className={cn(controlClass, "resize-none")} />
            ) : (
                <input id={id} name={name} type={type} required={required} autoComplete={autoComplete} placeholder=" " className={controlClass} />
            )}
            <label
                htmlFor={id}
                className={cn(
                    "pointer-events-none absolute left-3 top-1.75 max-w-[calc(100%-2rem)] origin-top-left truncate text-body leading-normal font-medium text-foreground/50 transition-transform duration-200 ease-out",
                    multiline ? "translate-y-2.25" : "translate-y-[8.25px]",
                    FLOATED_LABEL,
                )}
            >
                {label}
            </label>
        </div>
    );
}

export function EnquiryModal({ packageId }: EnquiryModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState<{ firstName: string; email: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        // Reset on open, not close, so the confirmation stays visible while the dialog fades out.
        if (open) {
            setSubmitted(null);
            setError(null);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const firstName = String(form.get("firstName") ?? "").trim();
        const email = String(form.get("email") ?? "").trim();
        const phone = String(form.get("phone") ?? "").trim();
        const message = String(form.get("message") ?? "").trim();

        if (!PHONE_PATTERN.test(phone)) {
            setError("Enter a valid phone number.");
            return;
        }

        setError(null);
        setIsSubmitting(true);
        try {
            await submitPackageEnquiry({ packageId, firstName, email, phone, message });
            setSubmitted({ firstName, email });
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="w-full h-13.5 rounded-xl text-base font-bold cursor-pointer">
                    Send Enquiry
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-[95vw] gap-0 p-5 sm:max-w-115 rounded-2xl">
                {submitted ? (
                    <div className="flex flex-col gap-4">
                        <div className="mx-auto mt-2 flex size-16 items-center justify-center rounded-full border-4 border-primary text-primary">
                            <Check className="size-7" strokeWidth={3} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <DialogTitle className="text-lg font-bold text-foreground">
                                Enquiry submitted successfully, {submitted.firstName}!
                            </DialogTitle>
                            <DialogDescription className="text-sm leading-relaxed text-foreground/50">
                                We&apos;ve received your request and our team will reach out soon with the best available
                                options for your selected date.
                            </DialogDescription>
                        </div>

                        <div className="flex mt-1 items-center gap-2 text-xs font-medium text-foreground">
                            <Phone className="size-4.5 shrink-0" />
                            We may contact you on WhatsApp or phone if we need more details.
                        </div>
                        <Divider />
                        <div className="flex items-center justify-between gap-3 text-xs font-medium text-foreground/50">
                            <span>A confirmation has been sent to</span>
                            <span className="truncate font-semibold text-primary">{submitted.email}</span>
                        </div>

                        <Button asChild variant="secondary" className="h-11 w-full rounded-lg text-xs font-bold">
                            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                                <WhatsApp size="20px" />
                                Chat with Scoutripper on WhatsApp
                            </a>
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <div className="mb-2 flex flex-col gap-0.5 pr-6">
                            <DialogTitle className="text-lg font-bold text-foreground">Plan your trek with us</DialogTitle>
                            <DialogDescription className="text-xs text-foreground/50">
                                Share your preferred date and we&apos;ll suggest the best options.
                            </DialogDescription>
                        </div>

                        <FloatingField label="First name" name="firstName" required autoComplete="given-name" />
                        <FloatingField label="Email Address" name="email" type="email" required autoComplete="email" />
                        <FloatingField label="Phone Number" name="phone" type="tel" required autoComplete="tel" />
                        <FloatingField label="Any questions, group size, or special requirements?" name="message" multiline />

                        {error && <p className="text-xs font-medium text-destructive">{error}</p>}

                        <Button type="submit" disabled={isSubmitting} className="mt-1 h-12 w-full rounded-lg text-sm font-bold">
                            {isSubmitting ? "Submitting..." : "Submit Enquiry"}
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
