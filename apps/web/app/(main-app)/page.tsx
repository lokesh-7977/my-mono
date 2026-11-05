import { Navbar } from "@/components/shared/navbar";
import { SearchBarMobile } from "@/components/shared/search-bar-mobile";
import { SearchBar } from "@/components/shared/search-bar";
import { HeroSection } from "@/components/home/hero-section";
import { ExploreCategories } from "@/components/home/explore-categories";
import { FeaturedTreks } from "@/components/home/featured-treks";
import { FeaturedPackages } from "@/components/trek/trek-details/featured-packages";
import { Destinations } from "@/components/home/destinations";
import { DifficultySelector } from "@/components/home/difficulty-selector";
import { PromoBanners } from "@/components/home/promo-banners";
import { Testimonials } from "@/components/home/testimonials";
import { BlogInspiration } from "@/components/home/blog-inspiration";
import { FaqMission } from "@/components/home/faq-mission";
import { Footer } from "@/components/shared/footer";
import { CuratedExperiences } from "@/components/home/curated-experiences";

const slideitems = [
  {
    title: "Hampta Pass Trek",
    img: "https://images.scoutripper.com/treks/hampta-pass-trek/beauty-of-hampta-pass-trek.jpg",
    href: "/treks/hampta-pass-trek",
    subtext: "A dramatic crossover trek across the Himalayas",
  },
  {
    title: "Kashmir Great Lakes Trek",
    img: "https://images.scoutripper.com/treks/kashmir-great-lake-trek/Kashmir Great Lakes-bg.png",
    href: "/treks/kashmir-great-lakes-trek",
    subtext: "A walking dream through heaven",
  },
  {
    title: "Triund Trek",
    img: "https://images.scoutripper.com/treks/triund-trek/camps-in-triund.png",
    href: "/treks/triund-trek",
    subtext: "Your perfect first Himalayan trekking experience",
  },
  {
    title: "Kedarnath Dham",
    img: "https://images.scoutripper.com/treks/kedarnath-dham/kedarnath-dham-view-of-kedarnath-temple.png",
    href: "/treks/kedarnath-dham",
    subtext: "Spiritual journey through the Himalayas",
  },
  {
    title: "Kareri Lake Trek",
    img: "https://images.scoutripper.com/treks/kareri-lake-trek/kareri-lake-trek-summer.webp",
    href: "/treks/kareri-lake-trek",
    subtext: "Trek through pine forests to a pristine Himalayan lake",
  },
];

export default function Home() {
  return (
    <div>
      <Navbar />
      <main>
        <HeroSection slides={slideitems} />
        <SearchBarMobile className="-mt-14.5 hidden max-search:block" />
        <SearchBar className="-mt-9 max-search:hidden" />

        {/* Added spacing above the next section due to the overlapping search bar */}
        <div className="pt-20">
          <ExploreCategories />
        </div>
        <FeaturedTreks />
        <FeaturedPackages title="Popular Upcoming Departures" showMasterTrek />
        <Destinations />
        <DifficultySelector />
        <PromoBanners />
        <CuratedExperiences />
        <Testimonials />
        <BlogInspiration />
        <FaqMission />
      </main>
      <Footer />
    </div>
  );
}
