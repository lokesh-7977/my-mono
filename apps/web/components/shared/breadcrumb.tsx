import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
    Breadcrumb as BreadcrumbRoot,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "@repo/ui/components/breadcrumb";

interface Crumb {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: Crumb[];
    backHref?: string;
    backLabel?: string;
}

export default function Breadcrumb({ items, backHref, backLabel = "Back" }: BreadcrumbProps) {
    return (
        <div className="bg-zinc-50">
            <div className="flex items-center justify-between max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <BreadcrumbRoot>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/">Home</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {items.map((crumb, index) => {
                            const isLast = index === items.length - 1;
                            return (
                                <span key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        {!isLast && crumb.href ? (
                                            <BreadcrumbLink asChild>
                                                <Link href={crumb.href}>{crumb.label}</Link>
                                            </BreadcrumbLink>
                                        ) : (
                                            <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                        )}
                                    </BreadcrumbItem>
                                </span>
                            );
                        })}
                    </BreadcrumbList>
                </BreadcrumbRoot>

                {backHref && (
                    <Link
                        href={backHref}
                        className="group flex items-center gap-2 text-primary font-bold text-sm hover:text-primary-500 transition-all duration-200"
                    >
                        <ArrowLeft className="size-4 group-hover:translate-x-1 transition-all duration-200" />
                        <span className="underline underline-offset-4">
                            {backLabel}
                        </span>
                    </Link>
                )}
            </div>
        </div>
    );
}
