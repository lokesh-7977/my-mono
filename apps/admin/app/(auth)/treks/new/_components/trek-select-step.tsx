"use client"
import { useState } from "react";
import TrekSelectStepContent from "./trek-select-step-content";
import TrekSelectStepSidebar from "./trek-select-step-sidebar";

const REGISTERED_TREKS = [
    {
        id: "1",
        regionId: "1",
        title: "Chandratal Lake Trek",
        bannerImage: "https://images.scoutripper.com/treks/chandratal-lake-trek/chandratal-trek-beauty.png",
        distance: "15",
        duration: "4",
        maxAltitude: "14100",
        difficulty: "moderate",
        region: "Himachal Pradesh",
        isLocked: false,
        overview: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque hic, eos autem facilis reprehenderit, dolorem eum aliquam, libero quisquam omnis velit. Ullam eaque iure aliquam impedit tenetur sed laudantium minus. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero necessitatibus, nemo harum exercitationem nulla aperiam cumque fuga, amet iusto dolores a dolorem sit veniam ducimus quis eveniet blanditiis repellat ut.",
    },
    {
        id: "2",
        regionId: "2",
        title: "Kheerganga Trek",
        bannerImage: "https://images.scoutripper.com/treks/kheerganga-trek/kheerganga-mountain-vies.png",
        distance: "24",
        duration: "3",
        maxAltitude: "9600",
        difficulty: "easy",
        region: "Uttarakhand",
        isLocked: false,
        overview: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque hic, eos autem facilis reprehenderit, dolorem eum aliquam, libero quisquam omnis velit. Ullam eaque iure aliquam impedit tenetur sed laudantium minus. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero necessitatibus, nemo harum exercitationem nulla aperiam cumque fuga, amet iusto dolores a dolorem sit veniam ducimus quis eveniet blanditiis repellat ut.",
    },
    {
        id: "3",
        regionId: "3",
        title: "Kashmir Great Lakes Trek",
        bannerImage: "https://images.scoutripper.com/treks/kashmir-great-lake-trek/kashmir-great-lakes-trek-featured-image.png",
        distance: "72",
        duration: "8",
        maxAltitude: "13750",
        difficulty: "moderate",
        region: "Ladakh",
        isLocked: false,
        overview: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque hic, eos autem facilis reprehenderit, dolorem eum aliquam, libero quisquam omnis velit. Ullam eaque iure aliquam impedit tenetur sed laudantium minus. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero necessitatibus, nemo harum exercitationem nulla aperiam cumque fuga, amet iusto dolores a dolorem sit veniam ducimus quis eveniet blanditiis repellat ut.",
    },
    {
        id: "4",
        regionId: "1",
        title: "Deoriatal Chandrashila Trek",
        bannerImage: "https://images.scoutripper.com/treks/deoriatal-chandrashila-trek/chopta-tungnath-way-to-chandrashila.png",
        distance: "30",
        duration: "5",
        maxAltitude: "12083",
        difficulty: "easy",
        region: "Himachal Pradesh",
        isLocked: false,
        overview: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque hic, eos autem facilis reprehenderit, dolorem eum aliquam, libero quisquam omnis velit. Ullam eaque iure aliquam impedit tenetur sed laudantium minus. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero necessitatibus, nemo harum exercitationem nulla aperiam cumque fuga, amet iusto dolores a dolorem sit veniam ducimus quis eveniet blanditiis repellat ut.",
    },
    {
        id: "5",
        regionId: "2",
        title: "Bali Pass Trek",
        bannerImage: "https://images.scoutripper.com/treks/bali-pass-trek/bali-pass-summit-day.png",
        distance: "60",
        duration: "8",
        maxAltitude: "16207",
        difficulty: "difficult",
        region: "Uttarakhand",
        isLocked: false,
        overview: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque hic, eos autem facilis reprehenderit, dolorem eum aliquam, libero quisquam omnis velit. Ullam eaque iure aliquam impedit tenetur sed laudantium minus. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero necessitatibus, nemo harum exercitationem nulla aperiam cumque fuga, amet iusto dolores a dolorem sit veniam ducimus quis eveniet blanditiis repellat ut.",
    },
    {
        id: "6",
        regionId: "3",
        title: "Pangarchulla Peak Trek",
        bannerImage: "https://images.scoutripper.com/treks/pangarchulla-peak-trek/pangarchulla-peak-trek-kuari-top-views.png",
        distance: "40",
        duration: "6",
        maxAltitude: "15069",
        difficulty: "difficult",
        region: "Ladakh",
        isLocked: false,
        overview: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque hic, eos autem facilis reprehenderit, dolorem eum aliquam, libero quisquam omnis velit. Ullam eaque iure aliquam impedit tenetur sed laudantium minus. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero necessitatibus, nemo harum exercitationem nulla aperiam cumque fuga, amet iusto dolores a dolorem sit veniam ducimus quis eveniet blanditiis repellat ut.",
    },
    {
        id: "7",
        regionId: "1",
        title: "Chandratal Lake Trek",
        bannerImage: "https://images.scoutripper.com/treks/chandratal-lake-trek/chandratal-trek-beauty.png",
        distance: "15",
        duration: "4",
        maxAltitude: "14100",
        difficulty: "moderate",
        region: "Himachal Pradesh",
        isLocked: true,
        overview: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque hic, eos autem facilis reprehenderit, dolorem eum aliquam, libero quisquam omnis velit. Ullam eaque iure aliquam impedit tenetur sed laudantium minus. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero necessitatibus, nemo harum exercitationem nulla aperiam cumque fuga, amet iusto dolores a dolorem sit veniam ducimus quis eveniet blanditiis repellat ut.",
    },
    {
        id: "8",
        regionId: "2",
        title: "Kheerganga Trek",
        bannerImage: "https://images.scoutripper.com/treks/kheerganga-trek/kheerganga-mountain-vies.png",
        distance: "24",
        duration: "3",
        maxAltitude: "9600",
        difficulty: "easy",
        region: "Uttarakhand",
        isLocked: false,
        overview: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque hic, eos autem facilis reprehenderit, dolorem eum aliquam, libero quisquam omnis velit. Ullam eaque iure aliquam impedit tenetur sed laudantium minus. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero necessitatibus, nemo harum exercitationem nulla aperiam cumque fuga, amet iusto dolores a dolorem sit veniam ducimus quis eveniet blanditiis repellat ut.",
    },
    {
        id: "9",
        regionId: "3",
        title: "Kashmir Great Lakes Trek",
        bannerImage: "https://images.scoutripper.com/treks/kashmir-great-lake-trek/kashmir-great-lakes-trek-featured-image.png",
        distance: "72",
        duration: "8",
        maxAltitude: "13750",
        difficulty: "moderate",
        region: "Ladakh",
        isLocked: false,
        overview: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque hic, eos autem facilis reprehenderit, dolorem eum aliquam, libero quisquam omnis velit. Ullam eaque iure aliquam impedit tenetur sed laudantium minus. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero necessitatibus, nemo harum exercitationem nulla aperiam cumque fuga, amet iusto dolores a dolorem sit veniam ducimus quis eveniet blanditiis repellat ut.",
    },
    {
        id: "10",
        regionId: "1",
        title: "Deoriatal Chandrashila Trek",
        bannerImage: "https://images.scoutripper.com/treks/deoriatal-chandrashila-trek/chopta-tungnath-way-to-chandrashila.png",
        distance: "30",
        duration: "5",
        maxAltitude: "12083",
        difficulty: "easy",
        region: "Himachal Pradesh",
        isLocked: true,
        overview: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque hic, eos autem facilis reprehenderit, dolorem eum aliquam, libero quisquam omnis velit. Ullam eaque iure aliquam impedit tenetur sed laudantium minus. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero necessitatibus, nemo harum exercitationem nulla aperiam cumque fuga, amet iusto dolores a dolorem sit veniam ducimus quis eveniet blanditiis repellat ut.",
    },
    {
        id: "11",
        regionId: "2",
        title: "Bali Pass Trek",
        bannerImage: "https://images.scoutripper.com/treks/bali-pass-trek/bali-pass-summit-day.png",
        distance: "60",
        duration: "8",
        maxAltitude: "16207",
        difficulty: "difficult",
        region: "Uttarakhand",
        isLocked: false,
        overview: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque hic, eos autem facilis reprehenderit, dolorem eum aliquam, libero quisquam omnis velit. Ullam eaque iure aliquam impedit tenetur sed laudantium minus. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero necessitatibus, nemo harum exercitationem nulla aperiam cumque fuga, amet iusto dolores a dolorem sit veniam ducimus quis eveniet blanditiis repellat ut.",
    },
    {
        id: "12",
        regionId: "3",
        title: "Pangarchulla Peak Trek",
        bannerImage: "https://images.scoutripper.com/treks/pangarchulla-peak-trek/pangarchulla-peak-trek-kuari-top-views.png",
        distance: "40",
        duration: "6",
        maxAltitude: "15069",
        difficulty: "difficult",
        region: "Ladakh",
        isLocked: false,
        overview: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque hic, eos autem facilis reprehenderit, dolorem eum aliquam, libero quisquam omnis velit. Ullam eaque iure aliquam impedit tenetur sed laudantium minus. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero necessitatibus, nemo harum exercitationem nulla aperiam cumque fuga, amet iusto dolores a dolorem sit veniam ducimus quis eveniet blanditiis repellat ut.",
    },
    {
        id: "13",
        regionId: "1",
        title: "Chandratal Lake Trek",
        bannerImage: "https://images.scoutripper.com/treks/chandratal-lake-trek/chandratal-trek-beauty.png",
        distance: "15",
        duration: "4",
        maxAltitude: "14100",
        difficulty: "moderate",
        region: "Himachal Pradesh",
        isLocked: true,
        overview: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque hic, eos autem facilis reprehenderit, dolorem eum aliquam, libero quisquam omnis velit. Ullam eaque iure aliquam impedit tenetur sed laudantium minus. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero necessitatibus, nemo harum exercitationem nulla aperiam cumque fuga, amet iusto dolores a dolorem sit veniam ducimus quis eveniet blanditiis repellat ut.",
    },
    {
        id: "14",
        regionId: "2",
        title: "Kheerganga Trek",
        bannerImage: "https://images.scoutripper.com/treks/kheerganga-trek/kheerganga-mountain-vies.png",
        distance: "24",
        duration: "3",
        maxAltitude: "9600",
        difficulty: "easy",
        region: "Uttarakhand",
        isLocked: false,
        overview: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque hic, eos autem facilis reprehenderit, dolorem eum aliquam, libero quisquam omnis velit. Ullam eaque iure aliquam impedit tenetur sed laudantium minus. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero necessitatibus, nemo harum exercitationem nulla aperiam cumque fuga, amet iusto dolores a dolorem sit veniam ducimus quis eveniet blanditiis repellat ut.",
    },
    {
        id: "15",
        regionId: "3",
        title: "Kashmir Great Lakes Trek",
        bannerImage: "https://images.scoutripper.com/treks/kashmir-great-lake-trek/kashmir-great-lakes-trek-featured-image.png",
        distance: "72",
        duration: "8",
        maxAltitude: "13750",
        difficulty: "moderate",
        region: "Ladakh",
        isLocked: false,
        overview: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque hic, eos autem facilis reprehenderit, dolorem eum aliquam, libero quisquam omnis velit. Ullam eaque iure aliquam impedit tenetur sed laudantium minus. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero necessitatibus, nemo harum exercitationem nulla aperiam cumque fuga, amet iusto dolores a dolorem sit veniam ducimus quis eveniet blanditiis repellat ut.",
    },
    {
        id: "16",
        regionId: "1",
        title: "Deoriatal Chandrashila Trek",
        bannerImage: "https://images.scoutripper.com/treks/deoriatal-chandrashila-trek/chopta-tungnath-way-to-chandrashila.png",
        distance: "30",
        duration: "5",
        maxAltitude: "12083",
        difficulty: "easy",
        region: "Himachal Pradesh",
        isLocked: true,
        overview: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque hic, eos autem facilis reprehenderit, dolorem eum aliquam, libero quisquam omnis velit. Ullam eaque iure aliquam impedit tenetur sed laudantium minus. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero necessitatibus, nemo harum exercitationem nulla aperiam cumque fuga, amet iusto dolores a dolorem sit veniam ducimus quis eveniet blanditiis repellat ut.",
    },
    {
        id: "17",
        regionId: "2",
        title: "Bali Pass Trek",
        bannerImage: "https://images.scoutripper.com/treks/bali-pass-trek/bali-pass-summit-day.png",
        distance: "60",
        duration: "8",
        maxAltitude: "16207",
        difficulty: "difficult",
        region: "Uttarakhand",
        isLocked: false,
        overview: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque hic, eos autem facilis reprehenderit, dolorem eum aliquam, libero quisquam omnis velit. Ullam eaque iure aliquam impedit tenetur sed laudantium minus. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero necessitatibus, nemo harum exercitationem nulla aperiam cumque fuga, amet iusto dolores a dolorem sit veniam ducimus quis eveniet blanditiis repellat ut.",
    },
    {
        id: "18",
        regionId: "3",
        title: "Pangarchulla Peak Trek",
        bannerImage: "https://images.scoutripper.com/treks/pangarchulla-peak-trek/pangarchulla-peak-trek-kuari-top-views.png",
        distance: "40",
        duration: "6",
        maxAltitude: "15069",
        difficulty: "difficult",
        region: "Ladakh",
        isLocked: false,
        overview: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque hic, eos autem facilis reprehenderit, dolorem eum aliquam, libero quisquam omnis velit. Ullam eaque iure aliquam impedit tenetur sed laudantium minus. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero necessitatibus, nemo harum exercitationem nulla aperiam cumque fuga, amet iusto dolores a dolorem sit veniam ducimus quis eveniet blanditiis repellat ut.",
    },
    {
        id: "19",
        regionId: "1",
        title: "Chandratal Lake Trek",
        bannerImage: "https://images.scoutripper.com/treks/chandratal-lake-trek/chandratal-trek-beauty.png",
        distance: "15",
        duration: "4",
        maxAltitude: "14100",
        difficulty: "moderate",
        region: "Himachal Pradesh",
        isLocked: true,
        overview: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque hic, eos autem facilis reprehenderit, dolorem eum aliquam, libero quisquam omnis velit. Ullam eaque iure aliquam impedit tenetur sed laudantium minus. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero necessitatibus, nemo harum exercitationem nulla aperiam cumque fuga, amet iusto dolores a dolorem sit veniam ducimus quis eveniet blanditiis repellat ut.",
    },
    {
        id: "20",
        regionId: "2",
        title: "Kheerganga Trek",
        bannerImage: "https://images.scoutripper.com/treks/kheerganga-trek/kheerganga-mountain-vies.png",
        distance: "24",
        duration: "3",
        maxAltitude: "9600",
        difficulty: "easy",
        region: "Uttarakhand",
        isLocked: false,
        overview: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque hic, eos autem facilis reprehenderit, dolorem eum aliquam, libero quisquam omnis velit. Ullam eaque iure aliquam impedit tenetur sed laudantium minus. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero necessitatibus, nemo harum exercitationem nulla aperiam cumque fuga, amet iusto dolores a dolorem sit veniam ducimus quis eveniet blanditiis repellat ut.",
    }
]

export type TrekItems = {
    id: string;
    title: string;
    bannerImage: string;
    distance: string;
    duration: string;
    maxAltitude: string;
    region: string;
    regionId: string;
    isLocked: boolean;
    difficulty: string;
    overview: string;
}

export default function TrekSelectStep({ onConfirm }: { onConfirm: (trek: TrekItems) => void }) {
    const [selectedTrek, setSelectedTrek] = useState<TrekItems>(REGISTERED_TREKS[0]);
    const handleSelectTrek = (trek: TrekItems) => {
        setSelectedTrek(trek);
    }
    return (
        <div className="flex flex-1 w-full mx-auto">
            <TrekSelectStepSidebar
                registeredTreks={REGISTERED_TREKS}
                onSelectTrek={handleSelectTrek}
                selectedTrekId={selectedTrek?.id || null}
            />
            <TrekSelectStepContent selectedTrek={selectedTrek} onConfirm={onConfirm} />
        </div>
    );
}