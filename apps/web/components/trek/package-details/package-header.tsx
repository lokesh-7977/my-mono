import { Button } from "@repo/ui/components/button";
import { GitCompare, Heart, Share2 } from "lucide-react";

interface PackageHeaderProps {
    title: string;
    badges: string[];
}

export default function PackageHeader({ title, badges }: PackageHeaderProps) {
    return (
        <div className="flex justify-between items-center pb-8 border-b border-zinc-200">
            <div>
                <h1 className="text-[34px] font-semibold">{title}</h1>

                <div className="space-x-3">
                    {badges.map((badge) => (
                        <span key={badge} className="p-1 px-3 text-secondary-foreground font-medium bg-secondary rounded-xl text-xs">
                            {badge}
                        </span>
                    ))}
                </div>
            </div>

            <div className="space-x-3">
                <Button variant={"secondary"} className="h-10">
                    <GitCompare className="size-4" />
                    Compare
                </Button>
                <Button size={"icon"} variant={"outline"} className="size-10">
                    <Share2 className="size-4" />
                </Button>
                <Button size={"icon"} variant={"outline"} className="size-10">
                    <Heart className="size-4" />
                </Button>
            </div>
        </div>
    )
}
