import { CircleCheck, CirclePlus, Clock, LayoutPanelLeft, MapPin, Signal, SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@repo/ui/components/button";

export function SuccessStep() {
  return (
    <div className="mt-17 flex justify-center items-center h-[calc(100dvh-68px)] text-foreground text-lg">
      <div className="flex flex-col items-center max-w-140 w-full">
        <span className="p-4 bg-magic-green/20 border-magic-green rounded-full mb-6">
          <CircleCheck className="size-12.5 text-primary" />
        </span>

        <p className="text-4xl font-bold mb-2">Trek Created Successfully!</p>
        <span className="text-base text-primary font-medium text-center max-w-[80%] mb-6">
          Great job! Your listing is now live. Travelers can view details and start booking immediately.
        </span>

        <div className="border bg-white rounded-md p-3 mb-6 w-full flex items-center gap-4">
          <div className="relative size-28">
            <Image
              fill
              alt="Hampta pass trek"
              className="rounded-md object-cover"
              src={"https://images.scoutripper.com/treks/nag-tibba-trek/nag-tibba-trek-mountains-view.png"}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold">Hampta Pass Trek</h1>
            <p className="text-primary text-medium text-sm mt-1">
              <MapPin className="size-3.5 inline-block align-middle mb-0.5 mr-1" />
              Himachal Pradesh
            </p>

            <div className="flex gap-2 mt-2">
              <span className="flex px-2 items-center gap-1 h-7 bg-gray-50 text-sm border w-fit rounded-md">
                <Clock className="size-3.5" /> 5 Days
              </span>
              <span className="flex px-2 items-center gap-1 h-7 bg-gray-50 text-sm border w-fit rounded-md">
                <Signal className="size-3.5" /> Moderate
              </span>
            </div>
          </div>
        </div>

        <Button className="h-12.5 w-full text-base gap-2">
          View Trek
          <SquareArrowOutUpRight className="size-4" />
        </Button>

        <div className="flex mt-4 gap-3 w-full">
          <Button variant={"outline"} className="h-12.5 flex-1 text-base gap-2">
            <LayoutPanelLeft className="size-4" />
            Go to Dashboard
          </Button>

          <Button variant={"outline"} className="h-12.5 flex-1 text-base gap-2">
            <CirclePlus className="size-4" />
            Add Another Trek
          </Button>
        </div>
      </div>
    </div>
  );
}
