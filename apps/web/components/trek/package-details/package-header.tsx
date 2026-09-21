import { Button } from "@/components/ui/button";
import { GitCompare, Heart, Share2 } from "lucide-react";

export default function PackageHeader() {
    return (
        <div className="flex justify-between items-center pb-8 border-b border-zinc-200">
            <div>
                <h1 className="text-[34px] font-semibold">
                    Kashmir Great Lakes Trek with Rishabh
                </h1>

                <div className="space-x-3">
                    <span className="p-1 px-3 text-white font-medium bg-[#FA8232] rounded-xl text-xs">Most Popular</span>
                    <span className="p-1 px-3 text-secondary-foreground font-medium bg-secondary rounded-xl text-xs">Beginner Friendly</span>
                    <span className="p-1 px-3 text-secondary-foreground font-medium bg-secondary rounded-xl text-xs">2 days</span>
                    <span className="p-1 px-3 text-secondary-foreground font-medium bg-secondary rounded-xl text-xs">Himachal</span>
                </div>
            </div>

            <div className="space-x-3">
                <Button variant={"secondary"} className="h-10">
                    <GitCompare className="size-4" />
                    Compare
                </Button>
                <Button size={"icon"} variant={"secondary"} className="size-10">
                    <Share2 className="size-4" />
                </Button>
                <Button size={"icon"} variant={"secondary"} className="size-10">
                    <Heart className="size-4" />
                </Button>
            </div>
        </div>
    )
}