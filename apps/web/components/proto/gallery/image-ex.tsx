"use client";
import { cn } from "@repo/ui/lib/utils";
import { useContext, useRef } from "react";
import { GalleryDispatchContext } from "./gallery-context";

// ─── ImageEx (thumbnail) ────────────────────────────────────────────────
// A gallery-aware image that measures its own rect on click and dispatches
// the FLIP-open event to the Gallery provider.

export function ImageEx({
    index,
    src,
    alt,
    className,
}: {
    index: number;
    src: string;
    alt: string;
    className?: string;
}) {
    const ctx = useContext(GalleryDispatchContext);
    const imgRef = useRef<HTMLImageElement>(null);

    const handleClick = () => {
        if (!imgRef.current || !ctx) return;
        const el = imgRef.current;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);

        // offsetWidth/Height return layout dimensions IGNORING CSS transforms
        // (like active:scale-[0.98]), so the FLIP image matches the resting size.
        const layoutW = el.offsetWidth;
        const layoutH = el.offsetHeight;

        // The rect center is stable under uniform center-origin scaling,
        // so we can derive the un-transformed top/left from it.
        const centerX = r.left + r.width / 2;
        const centerY = r.top + r.height / 2;

        ctx.onImageClick(index, {
            top: centerY - layoutH / 2,
            left: centerX - layoutW / 2,
            width: layoutW,
            height: layoutH,
            borderRadius: parseFloat(cs.borderRadius) || 16,
            naturalWidth: el.naturalWidth,
            naturalHeight: el.naturalHeight,
        }, el);
    };

    return (
        <img
            ref={imgRef}
            data-gallery-index={index}
            className={cn(
                className,
                "w-full m-0 block cursor-pointer",
                "transition-transform duration-150 active:scale-[0.98]"
            )}
            onClick={handleClick}
            src={src}
            alt={alt}
        />
    );
}
