"use client";
import { TrekOverviewModal } from "./trek-overview-modal";

export function TrekContent() {
  return (

    <section className="border-t border-zinc-200 pt-6">
      <h2 className="text-[26px] font-bold text-foreground mb-4 font-bricolage-grotesque">
        Kashmir Great Lakes Trek Overview
      </h2>
      <div className="prose prose-zinc prose-sm text-foreground max-w-none space-y-8 text-base mb-4">
        <p>
          Nestled at an altitude of 15,700 feet, Roopkund is perhaps the most debated and enigmatic trekking destination in India.
          Famous for the hundreds of human skeletons found at its edge, this high-altitude glacial lake offers more than just macabre mystery.
        </p>
        {/* <p>
          Your journey begins through ancient oak forests and opens up into the sprawling meadows of Ali and Bedni Bugyal—some of the
          largest alpine meadows in Asia. As the air thins, the landscape transforms from vibrant green to a stark, celestial white,
          culminating in a climb that tests your resolve and rewards you with panoramic views of Trishul and Nanda Ghunti.
          </p> */}
      </div>
      <TrekOverviewModal trekName="Kashmir Great Lakes Trek" />
    </section>

  );
}
