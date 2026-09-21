import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";

const blogPosts = [
  {
    id: "1",
    title: "10 Essential Gear Items for Your First Himalayan Trek",
    category: "Trekking Guides",
    date: "12 Mar, 2026",
    img: "https://images.scoutripper.com/treks/triund-trek/camps-in-triund.png",
    slug: "essential-himalayan-trek-gear",
    description: "Trekking Expeditions are the journeys that help us learn and unlearn, make us value our lives, peace and happiness, they nurture our souls...",
  },
  {
    id: "2",
    title: "How to Prepare Physically for High Altitude Treks",
    category: "Fitness & Health",
    date: "05 Mar, 2026",
    img: "https://images.scoutripper.com/treks/hampta-pass-trek/beauty-of-hampta-pass-trek.jpg",
    slug: "physical-preparation-high-altitude",
    description: "Proper physical preparation is key. Learn the cardiovascular routines and stamina-building exercises that will empower you on the trail.",
  },
  {
    id: "3",
    title: "The Ultimate Guide to Conquering Kedarnath Dham",
    category: "Destinations",
    date: "28 Feb, 2026",
    img: "https://images.scoutripper.com/treks/kedarnath-dham/kedarnath-dham-view-of-kedarnath-temple.png",
    slug: "ultimate-kedarnath-guide",
    description: "A deeply spiritual and physically demanding yatra. Discover everything you need to know to safely navigate this sacred Himalayan destination.",
  },
];

export function BlogInspiration() {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
      <SectionHeader
        title="Get inspiration for your next trip"
        subtitle="Read our latest articles and travel guides"
        actionType="button"
        buttonText="View all posts"
        buttonHref="/blog"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col">
            <div className="relative w-full aspect-16/10 rounded-2xl overflow-hidden mb-5">
              <Image
                src={post.img}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-zinc-800 text-xs font-bold px-3 py-1.5 rounded-full">
                {post.category}
              </div>
            </div>

            {/* <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium mb-3">
              <Calendar className="w-3.5 h-3.5" />
              <span className="leading-0">{post.date}</span>
            </div> */}

            <h3 className="text-xl font-bold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h3>

            <p className="text-sm text-zinc-400 font-medium leading-relaxed mb-4 line-clamp-2">
              {post.description}
            </p>

            <div className="mt-auto flex items-center gap-2 text-primary text-xs font-medium transition-colors group-hover:text-primary">
              Read More
              <ArrowRight className="size-3.5  ml-[-2px] group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
