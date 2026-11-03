"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@repo/ui/lib/utils";
// import { SearchBar } from "@/components/shared/search-bar";

/* ── Types ── */
interface SlideItem {
  title: string;
  img: string;
  href: string;
  subtext: string;
}

interface HeroSectionProps {
  slides: SlideItem[];
}

/* ── Component ── */
export function HeroSection({ slides }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("Treks");
  const shouldReduceMotion = useReducedMotion();

  const slideCount = slides.length;

  const imageVariants = useMemo((): Variants => {
    if (shouldReduceMotion) {
      return {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      };
    }
    return {
      enter: { opacity: 0, scale: 0.98 },
      center: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.02 },
    };
  }, [shouldReduceMotion]);

  const paginate = (newDirection: number) => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) return slideCount - 1;
      if (nextIndex >= slideCount) return 0;
      return nextIndex;
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowLeft": {
        event.preventDefault();
        paginate(-1);
        break;
      }
      case "ArrowRight": {
        event.preventDefault();
        paginate(1);
        break;
      }
      default:
        break;
    }
  };

  return (
    <section className="relative w-full max-w-360 mx-auto px-0 sm:px-6 lg:px-8">
      {/* ─── Hero Banner ─── */}
      <div
        className="relative w-full h-130 md:h-155 overflow-hidden md:rounded-3xl rounded-b-[14px]"
        role="group"
        aria-roledescription="carousel"
        aria-label="Hero image carousel"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {/* Background Image */}
        <AnimatePresence initial={false}>
          <motion.div
            key={currentIndex}
            variants={imageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: shouldReduceMotion ? 0 : 0.5,
              ease: "easeInOut",
            }}
            className="absolute inset-0 w-full"
          >
            <Image
              src={slides[currentIndex].img}
              alt={slides[currentIndex].title}
              fill
              className="object-cover md:rounded-3xl rounded-b-[14px]"
              priority={currentIndex === 0}
              quality={90}
              sizes="100vw"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/20" />
          </motion.div>
        </AnimatePresence>

        {/* ─── Center Content ─── */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
              className="flex flex-col items-center"
            >
              <p className="text-white/85 text-base md:text-lg font-normal mb-2 tracking-wide">
                {slides[currentIndex].subtext}
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-bold text-white mb-6 max-w-4xl leading-tight">
                {slides[currentIndex].title}
              </h1>
              <Link href={slides[currentIndex].href}>
                <button className="flex items-center font-semibold gap-2 border-2 cursor-pointer border-white text-white rounded-xl px-8 py-3 text-base hover:bg-white hover:text-foreground transition-colors duration-150">
                  View Trek
                  <ExternalLink className="size-4" />
                </button>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ─── Prev / Next Arrows ─── */}
        {[
          {
            dir: -1,
            label: "Previous slide",
            icon: ChevronLeft,
            pos: "left-6 md:left-10",
          },
          {
            dir: 1,
            label: "Next slide",
            icon: ChevronRight,
            pos: "right-6 md:right-10",
          },
        ].map(({ dir, label, icon: Icon, pos }) => (
          <button
            key={label}
            type="button"
            onClick={() => paginate(dir)}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/25 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white hover:text-foreground cursor-pointer transition-colors duration-150",
              pos
            )}
            aria-label={label}
          >
            <Icon className="w-6 h-6" aria-hidden="true" />
          </button>
        ))}

        <span className="sr-only" role="status">
          Slide {currentIndex + 1} of {slideCount}
        </span>

        {/* ─── Category Tabs (inside hero, above search bar) ─── */}
        <div className="absolute bottom-18 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center gap-8">
          {["Treks", "Experiences", "Places To Visit"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "text-base font-semibold relative pb-2 transition-colors whitespace-nowrap",
                activeTab === tab
                  ? "text-white"
                  : "text-white/60 hover:text-white/80"
              )}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

    </section>
  );
}
