"use client";
import {
  Star,
  MapPin,
  GitCompare,
  Share2,
  Heart,
  Image as ImageIcon,
  Map as MapIcon
} from "lucide-react";
import Gallery, { ImageEx } from "./gallery/image-expander";

interface TrekGalleryProps {
  title: string;
  rating: number;
  reviewsCount: string;
  location: string;
  images: string[];
  quote?: string;
  tag?: string;
}

export function TrekGallery({
  title = "Kashmir Great Lakes Trek",
  rating = 5.0,
  reviewsCount = "24K",
  // location = "Jammu & Kashmir",
  images = [
    "https://images.scoutripper.com/treks/hampta-pass-trek/beauty-of-hampta-pass-trek.jpg",
    "https://images.scoutripper.com/treks/kashmir-great-lake-trek/Kashmir Great Lakes-bg.png",
    "https://images.scoutripper.com/treks/triund-trek/camps-in-triund.png",
    "https://images.scoutripper.com/treks/kedarnath-dham/kedarnath-dham-view-of-kedarnath-temple.png",
    "https://images.scoutripper.com/treks/kareri-lake-trek/kareri-lake-trek-summer.webp",
    "https://images.scoutripper.com/treks/hampta-pass-trek/camps-in-hampta-pass-trek.jpg",
    "https://images.scoutripper.com/treks/hampta-pass-trek/day-1-drive-to-srinagar-to-gagangir.png",
    "https://images.scoutripper.com/treks/hampta-pass-trek/clear-sky-view-from-hampta-pass-trek.jpg",
    "https://images.scoutripper.com/treks/hampta-pass-trek/day-2-drive-from-gagangir-to-shitkadi-trek-to-nichnai.png",
    "https://images.scoutripper.com/treks/hampta-pass-trek/day-4-trek-from-vishnusar-to-gadsar-via-gadsar-pass.png",
    "https://images.scoutripper.com/treks/hampta-pass-trek/day-5-trek-from-gadsar-to-satsar.png",
    "https://images.scoutripper.com/treks/hampta-pass-trek/day-6-trek-from-satsar-to-gangabal-via-zaj-pass.png",
    "https://images.scoutripper.com/treks/hampta-pass-trek/day-7-trek-from-gangabal-to-naranag-and-drive-back-to-srinagar.png",
    "https://images.scoutripper.com/treks/hampta-pass-trek/ghangaria-to-govindghat.jpg",
    "https://images.scoutripper.com/treks/hampta-pass-trek/hampta-pass-cloudy-view.png",
    "https://images.scoutripper.com/treks/hampta-pass-trek/hampta-pass-greenery.png",
    "https://images.scoutripper.com/treks/hampta-pass-trek/hampta-pass-snow.png",
    "https://images.scoutripper.com/treks/hampta-pass-trek/hampta-pass-trek-mountain-view.jpg",
    "https://images.scoutripper.com/treks/hampta-pass-trek/hampta-pass-valley-view.png",
    "https://images.scoutripper.com/treks/hampta-pass-trek/hampta-pass-valley.png",
    "https://images.scoutripper.com/treks/hampta-pass-trek/hampta-pass-view.jpg",
    "https://images.scoutripper.com/treks/hampta-pass-trek/lake-in-hampta-pass-trek.jpg",

  ],
  quote = "A walking dream through heaven in Kashmir",
  tag = "Beginner Friendly"
}: Partial<TrekGalleryProps>) {
  return (
    <section className="w-full">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-1">
        {/* Header Title & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-[42px] font-bold text-foreground mb-4 font-bricolage-grotesque">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
              <div className="flex items-center gap-1.5">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                <span className="text-foreground">{rating.toFixed(1)}</span>
                <span className="text-zinc-400">• {reviewsCount} Reviews</span>
              </div>
              <div className="flex items-center gap-1.5 text-primary">
                <MapPin className="size-4" />
                <span>Uttarakhand, Himalayas</span>
              </div>
              <button className="flex items-center gap-1.5 text-zinc-400 hover:text-foreground transition-colors">
                <MapIcon className="size-4" />
                <span>Show on Map</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-bold text-foreground hover:bg-zinc-50 transition-colors bg-secondary/30">
              <GitCompare className="size-4" />
              Compare Trek
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-bold text-foreground hover:bg-zinc-50 transition-colors">
              <Share2 className="size-4" />
              Share
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-bold text-foreground hover:bg-zinc-50 transition-colors">
              <Heart className="size-4" />
              Save
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-4 md:aspect-16/7">
          {/* Main Large Image */}
          <Gallery images={images}>
            <ImageEx
              src={images[0]}
              alt={title}
              index={0}
              className="object-cover h-full col-span-2 md:row-span-2 relative rounded-3xl aspect-4/3 md:aspect-auto"
            />

            {/* Small Images */}
            {/* <div className="relative rounded-3xl overflow-hidden group aspect-4/3 md:aspect-auto"> */}
            <ImageEx
              src={images[1]}
              alt={`${title} view 2`}
              // fill
              index={1}
              className="h-full object-cover rounded-3xl aspect-4/3 md:aspect-auto"
            />
            {/* </div> */}

            {/* <div className="relative rounded-3xl overflow-hidden group aspect-4/3 md:aspect-auto"> */}
            <ImageEx
              src={images[2]}
              alt={`${title} view 3`}
              index={2}
              className="h-full object-cover aspect-4/3 md:aspect-auto rounded-3xl "
            />
            {/* </div> */}

            {/* <div className="relative rounded-3xl overflow-hidden group aspect-4/3 md:aspect-auto"> */}
            <ImageEx
              src={images[3]}
              alt={`${title} view 4`}
              index={3}
              className="h-full object-cover rounded-3xl aspect-4/3 md:aspect-auto"
            />
            {/* </div> */}

            <div className="relative rounded-3xl aspect-4/3 md:aspect-auto">
              <ImageEx
                src={images[14]}
                alt={`${title} view 5`}
                index={14}
                // fill
                className="object-cover aspect-4/3 md:aspect-auto h-full rounded-3xl "
              />
              <button>
                <span className="cursor-pointer absolute bottom-4 right-4 flex items-center gap-2 px-4 py-3 rounded-sm bg-white shadow-lg text-foreground text-sm font-bold hover:bg-zinc-50 transition-colors">
                  <ImageIcon className="size-4" />
                  View Photos
                </span>
              </button>
            </div>
          </Gallery>
        </div>
      </div>
    </section>
  );
}
