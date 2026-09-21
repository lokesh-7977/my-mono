"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GalleryDispatchContext } from "./gallery-context";
import { FLIPModal } from "./flip-modal";
import type { SourceRect } from "./types";

// Re-export ImageEx so consumers can still do:
//   import Gallery, { ImageEx } from "./gallery/image-expander";
export { ImageEx } from "./image-ex";

// ─── Gallery (provider) ─────────────────────────────────────────────────
// Manages open/close state, current index, thumbnail visibility, and
// next/prev navigation. Renders the FLIPModal portal.

export default function Gallery({ children, images }: { children: React.ReactNode; images: string[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [sourceRect, setSourceRect] = useState<SourceRect | null>(null);
    // Direct DOM ref to the thumbnail element — for imperative hide/show
    const thumbnailRef = useRef<HTMLImageElement | null>(null);

    const onImageClick = useCallback((index: number, rect: SourceRect, element: HTMLImageElement) => {
        // Hide thumbnail immediately — can't rely on modal's onLoad because
        // the <img> DOM node is reused when reopening with the same src,
        // and onLoad won't fire again for an already-loaded image.
        thumbnailRef.current = element;
        element.style.visibility = "hidden";
        setCurrentIndex(index);
        setSourceRect(rect);
        setIsOpen(true);
    }, []);

    const handleExitComplete = useCallback(() => {
        // Unhide thumbnail via DOM when FLIP image lands back
        if (thumbnailRef.current) {
            thumbnailRef.current.style.visibility = "";
            thumbnailRef.current = null;
        }
    }, []);

    const navigateTo = useCallback((newIndex: number) => {
        if (newIndex < 0 || newIndex >= images.length) return;

        // 1. Restore visibility of the old thumbnail
        if (thumbnailRef.current) {
            thumbnailRef.current.style.visibility = "";
        }

        // 2. Find the new thumbnail in the DOM
        const newEl = document.querySelector(`img[data-gallery-index="${newIndex}"]`) as HTMLImageElement | null;
        if (newEl) {
            const r = newEl.getBoundingClientRect();
            const cs = getComputedStyle(newEl);
            const rect: SourceRect = {
                top: r.top,
                left: r.left,
                width: r.width,
                height: r.height,
                borderRadius: parseFloat(cs.borderRadius) || 16,
                naturalWidth: newEl.naturalWidth || r.width,
                naturalHeight: newEl.naturalHeight || r.height,
            };
            thumbnailRef.current = newEl;
            // Hide the new thumbnail so it doesn't show behind/double
            newEl.style.visibility = "hidden";
            setSourceRect(rect);
        } else {
            thumbnailRef.current = null;
            setSourceRect(null);
        }

        setCurrentIndex(newIndex);
    }, [images]);

    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < images.length - 1;

    const onPrev = useMemo(() => hasPrev ? () => navigateTo(currentIndex - 1) : undefined, [hasPrev, currentIndex, navigateTo]);
    const onNext = useMemo(() => hasNext ? () => navigateTo(currentIndex + 1) : undefined, [hasNext, currentIndex, navigateTo]);

    // Preload next and previous images dynamically in the background when the modal is open
    useEffect(() => {
        if (!isOpen) return;

        const preloadImage = (src: string) => {
            const img = new window.Image();
            img.src = src;
        };

        const next = (currentIndex + 1) % images.length;
        const prev = (currentIndex - 1 + images.length) % images.length;

        preloadImage(images[next]);
        preloadImage(images[prev]);
    }, [currentIndex, isOpen, images]);

    const dispatch = useMemo(() => ({ onImageClick }), [onImageClick]);

    return (
        <GalleryDispatchContext.Provider value={dispatch}>
            {children}
            <FLIPModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                src={images[currentIndex]}
                alt={images[currentIndex]}
                sourceRect={sourceRect}
                onExitComplete={handleExitComplete}
                thumbnailRef={thumbnailRef}
                onPrev={onPrev}
                onNext={onNext}
            />
        </GalleryDispatchContext.Provider>
    );
}