import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@repo/ui/components/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import { cn } from "@repo/ui/lib/utils";
import { X } from "lucide-react";
type Props = {
    children: React.ReactNode
    activeTab: "Trekking" | "Experiences" | "Locations"
    onActiveTabChange: (tab: "Trekking" | "Experiences" | "Locations") => void
}

export default function SearchModalMobile({ children, activeTab, onActiveTabChange }: Props) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="w-full h-dvh max-w-full sm:max-w-full p-0 m-0 rounded-none" showCloseButton={false}>
                <VisuallyHidden>
                    <DialogTitle>Search Modal</DialogTitle>
                    <DialogDescription>Search for treks, experiences, or locations</DialogDescription>
                </VisuallyHidden>
                <div className="size-full overflow-y-auto">

                    <div className="relative w-full flex h-fit">
                        <div className={cn("flex flex-row items-stretch justify-center pb-0 mx-auto h-fit gap-3 mt-3")}>

                            <div onClick={() => onActiveTabChange("Trekking")} className={cn("flex-1 flex flex-col items-center justify-between pb-1.5 px-2 border-b-2 h-[62.25px]", activeTab === "Trekking" ? "border-primary" : "border-transparent")}>
                                <Image src={'/backpack.svg'} alt="backpack" width={30} height={30} className="my-auto" />
                                <span className="text-xs font-bold">Treks</span>
                            </div>

                            <div onClick={() => onActiveTabChange("Experiences")} className={cn("flex-1 cursor-pointer flex flex-col items-center justify-between pb-1.5 px-2 border-b-2 h-[62.25px]", activeTab === "Experiences" ? "border-primary" : "border-transparent")}>
                                <Image src={'/goggles.svg'} alt="backpack" width={30} height={30} className="my-auto" />
                                <span className="text-xs font-bold">Experiences</span>
                            </div>

                            <div onClick={() => onActiveTabChange("Locations")} className={cn("flex-1 cursor-pointer flex flex-col items-center justify-between pb-1.5 px-2 border-b-2 h-[62.25px]", activeTab === "Locations" ? "border-primary" : "border-transparent")}>
                                <Image src={'/map-pin.svg'} alt="backpack" width={30} height={30} className="my-auto" />
                                <span className="text-xs font-bold">Locations</span>
                            </div>
                        </div>
                        <DialogClose asChild>
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 border border-gray-500 text-gray-500 rounded-[10px] h-fit p-1.5">
                                <X className="size-4" />
                            </button>
                        </DialogClose>
                    </div>

                    <div className="pt-4 px-4 space-y-3">
                        <div className="w-full border border-gray-200 py-4 px-4 rounded-xl shadow-md space-y-1">
                            <p className="text-base font-semibold">Where are you going?</p>
                            <span className="text-sm font-medium">I&apos;m flexible</span>
                        </div>
                        <div className="w-full border border-gray-200 py-4 px-4 rounded-xl shadow-md space-y-1">
                            <p className="text-base font-semibold">What is your difficulty level?</p>
                            <span className="text-sm font-medium">Moderate</span>
                        </div>
                        <div className="w-full border border-gray-200 py-4 px-4 rounded-xl shadow-md space-y-1">
                            <p className="text-base font-semibold">When are you going?</p>
                            <span className="text-sm font-medium">24th - 31st April 2027</span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}