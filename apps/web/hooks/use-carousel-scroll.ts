import { useState, useEffect, useRef, useCallback } from "react";

export function useCarouselScroll<T extends HTMLElement = HTMLDivElement>(scrollAmount: number = 300) {
  const scrollRef = useRef<T>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const checkScrollPosition = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    
    setIsAtStart(scrollLeft <= 0);
    // Use Math.ceil and add a 1px threshold to avoid floating point pixel rounding issues where scrollLeft + clientWidth is slightly less than scrollWidth
    setIsAtEnd(Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 1);
  }, []);

  // Check initial state once mounted
  useEffect(() => {
    checkScrollPosition();
    // Re-check on resize as container width might change
    window.addEventListener("resize", checkScrollPosition);
    return () => window.removeEventListener("resize", checkScrollPosition);
  }, [checkScrollPosition]);

  const scrollLeft = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  }, [scrollAmount]);

  const scrollRight = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  }, [scrollAmount]);

  return {
    scrollRef,
    isAtStart,
    isAtEnd,
    checkScrollPosition,
    scrollLeft,
    scrollRight,
  };
}
