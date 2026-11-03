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

interface BreadcrumbProps {
    trekName?: string;
    locationName?: string;
}

export default function Breadcrumb({
    trekName = "Kashmir Great Lakes Trek",
    locationName = "Jammu & Kashmir",
}: BreadcrumbProps) {
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
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/treks">Treks</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{locationName}</BreadcrumbPage>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{trekName}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </BreadcrumbRoot>

                <Link
                    href="/treks"
                    className="group flex items-center gap-2 text-primary font-bold text-sm hover:text-primary-500 transition-all duration-200"
                >
                    <ArrowLeft className="size-4 group-hover:translate-x-1 transition-all duration-200" />
                    <span className="underline underline-offset-4">
                        All Treks
                    </span>
                </Link>
            </div>
        </div>
    );
}
