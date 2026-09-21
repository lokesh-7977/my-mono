import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function FormFooter() {
    return (
        <div className="pt-15">
            <div className="border-t border-border w-full pt-4 flex items-center justify-between">
                <Button variant={"ghost"} className="h-11 px-4 cursor-pointer">Back</Button>
                <Button type="submit" className="h-11 px-4 cursor-pointer group transition-all duration-200">
                    Save and Continue
                    <ArrowRight className="size-4 stroke-3 group-hover:translate-x-1 transition-all duration-150 ease-out" />
                </Button>
            </div>
        </div>
    )
}