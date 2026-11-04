"use client";

import { useState } from "react";
import { Plus, Minus, MoveRight, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { MAIN_EMAIL } from "@/lib/constants";
import { Button } from "@repo/ui/components/button";

const defaultFaqs = [
  {
    question: "Who are we, and what is our mission?",
    answer: "Scoutripper is an adventure-focused travel platform dedicated to bringing unforgettable trekking and outdoor experiences to explorers of all levels. We specialize in organizing curated treks, expeditions, and nature-based adventures in some of the most breathtaking landscapes, primarily in the Indian Himalayas. Our mission is to connect adventurers with nature through guided experiences that are safe, eco-friendly, and authentic, helping people discover the joy of trekking and the beauty of the wilderness.\nWhether you're a first-time trekker or a seasoned adventurer, Scoutripper offers personalized itineraries and professional guidance to make every journey memorable.",
  },
  {
    question: "What sets us apart from others in the industry?",
    answer: "We focus on small batch sizes, strict Leave No Trace policies, and truly personalized attention to ensure every aspect of your journey is authentic and sustainable.",
  },
  {
    question: "How can I contact customer support?",
    answer: "You can reach us 24/7 via the 'Ask us Anything' button, or by email at support@scoutripper.com. We are always happy to help!",
  },
  {
    question: "Where are we located?",
    answer: "We operate across major Himalayan trails in India, with our base operations anchored near key trekking hubs in Himachal Pradesh and Uttarakhand.",
  },
  {
    question: "What is your refund or return policy?",
    answer: "You can cancel up to 30 days before the trek for a full refund. Cancellations between 15-30 days receive a 50% refund or a voucher for future use. Less than 15 days is non-refundable.",
  },
];

interface FaqMissionProps {
  heading?: string;
  faqs?: { question: string; answer: string }[];
}

export function FaqMission({
  heading = "Frequently Asked Questions",
  faqs = defaultFaqs,
}: FaqMissionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [isSeeMore, setIsSeeMore] = useState<boolean>(false);

  if (faqs.length === 0) {
    return null;
  }

  return (
    <section className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col gap-6 lg:gap-10 w-full mx-auto">
        <div className="w-full">
          <h2 className="text-title md:text-title-lg font-bold leading-tight text-foreground w-full text-center mb-3">{heading}</h2>
          <p className="text-sm text-zinc-400 w-full text-center">Didn’t find your answer? Write to us at <a href={`mailto:${MAIN_EMAIL}`}>{MAIN_EMAIL}</a> and we’ll be happy to help.</p>
        </div>

        {/* Right Side: FAQs */}
        <div className={cn("flex-1 flex flex-col max-w-212.5 mx-auto w-full")}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const isVisible = isSeeMore || index < 3;

            return (
              <div
                key={index}
                className={cn(
                  "grid transition-all duration-300 ease-in-out",
                  isVisible ? "grid-rows-[1fr] opacity-100 mb-3" : "grid-rows-[0fr] opacity-0 mb-0"
                )}
              >
                <div className="overflow-hidden">
                  <div
                    className={cn(
                      "border border-zinc-200/70 rounded-xl transition-colors duration-300",
                      isOpen ? "bg-zinc-50" : "bg-white"
                    )}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer transition-colors hover:bg-zinc-50"
                    >
                      <span className="font-bold text-foreground pr-4 text-body md:text-base">
                        {faq.question}
                      </span>
                      {isOpen ? (
                        <Minus className="w-5 h-5 text-foreground shrink-0" />
                      ) : (
                        <Plus className="w-5 h-5 text-foreground shrink-0" />
                      )}
                    </button>

                    <div
                      className={cn(`grid transition-all duration-300 ease-in-out`,
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 md:px-6 pb-6 text-slate-500 text-sm font-medium leading-[1.8] whitespace-pre-line">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div
            className={cn("border border-primary shadow-sm shadow-primary/20 rounded-xl overflow-hidden transition-all duration-300", "bg-white")}
          >
            <div
              className="w-full flex items-center justify-between p-4 px-5 md:px-6 text-left transition-colors"
            >
              <div>

                <p className="font-bold text-foreground pr-4 text-lg">
                  Frequently Asked Questions
                </p>
                <p className="text-gray-400 text-sm font-medium leading-[1.8] whitespace-pre-line">
                  We would be happy to help you with whatever questions you have
                </p>
              </div>

              <Button size={"lg"} className="flex items-center gap-2 py-6 px-4 text-sm hover:bg-primary-500 transition-all duration-200 cursor-pointer!">
                Ask us anything
                <MoveRight className="size-6 shrink-0" />
              </Button>
            </div>
          </div>

          <Button onClick={() => setIsSeeMore(prev => !prev)} variant={"ghost"} className="mt-2 mx-auto hover:bg-transparent cursor-pointer">
            See {isSeeMore ? "less" : "more"}
            {isSeeMore ? <ChevronUp className="size-5 shrink-0" /> : <ChevronDown className="size-5 shrink-0" />}
          </Button>
        </div>

      </div>
    </section>
  );
}
