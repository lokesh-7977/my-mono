"use client";
import { cn } from "@/lib/utils";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

// ─── Types ──────────────────────────────────────────────────────────────
interface SourceRect {
    top: number;
    left: number;
    width: number;
    height: number;
    borderRadius: number;
    naturalWidth: number;
    naturalHeight: number;
}

// ─── Context ────────────────────────────────────────────────────────────
const GalleryDispatchContext = createContext<{
    onImageClick: (index: number, rect: SourceRect, element: HTMLImageElement) => void;
} | null>(null);

// ─── Gallery (provider) ─────────────────────────────────────────────────
export default function Gallery({ children, images }: { children: React.ReactNode; images: string[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [sourceRect, setSourceRect] = useState<SourceRect | null>(null);
    // Direct DOM ref to the thumbnail element — for imperative hide/show
    const thumbnailRef = useRef<HTMLImageElement | null>(null);

    const onImageClick = useCallback((index: number, rect: SourceRect, element: HTMLImageElement) => {
        // Store ref — thumbnail stays visible until FLIP image has decoded
        thumbnailRef.current = element;
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

// ─── ImageEx (thumbnail) ────────────────────────────────────────────────
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
        ctx.onImageClick(index, {
            top: r.top,
            left: r.left,
            width: r.width,
            height: r.height,
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

// ─── FLIP Modal ─────────────────────────────────────────────────────────
//
// Thumbnail visibility is managed IMPERATIVELY via DOM:
//   Click → element.style.visibility = "hidden"  (instant, same tick)
//   Exit transition end → element.style.visibility = ""  (instant restore)
//
// No React state for visibility = no race conditions, no flashes.
//
type Phase = "entering" | "open" | "exiting" | "closed";

function FLIPModal({
    src,
    alt,
    isOpen,
    onClose,
    sourceRect,
    onExitComplete,
    thumbnailRef,
    onPrev,
    onNext,
}: {
    src: string;
    alt: string;
    isOpen: boolean;
    onClose: () => void;
    sourceRect: SourceRect | null;
    onExitComplete: () => void;
    thumbnailRef: React.RefObject<HTMLImageElement | null>;
    onPrev?: () => void;
    onNext?: () => void;
}) {
    const [mounted, setMounted] = useState(false);
    const [phase, setPhase] = useState<Phase>("closed");
    const savedRect = useRef<SourceRect | null>(null);
    const modalImageRef = useRef<HTMLImageElement | null>(null);

    // Mount on client side immediately after hydration to keep portal warm
    useEffect(() => {
        setMounted(true);
    }, []);

    // ── Display src and traversal state for next/prev transitions ──
    const [displaySrc, setDisplaySrc] = useState(src);
    const [traversePhase, setTraversePhase] = useState<"idle" | "shrinking" | "primed" | "expanding">("idle");
    const prevSrcRef = useRef(src);

    // ── Open / Close lifecycle ──
    useEffect(() => {
        if (isOpen && sourceRect) {
            savedRect.current = sourceRect;
            setPhase("entering");
            setDisplaySrc(src);
            prevSrcRef.current = src;
            setTraversePhase("idle");
        } else if (!isOpen && phase !== "closed" && phase !== "exiting") {
            setPhase("exiting");
        }
    }, [isOpen]);

    // ── Trigger entry FLIP transition once DOM image is mounted and decoded ──
    useEffect(() => {
        if (phase === "entering" && modalImageRef.current) {
            const imgEl = modalImageRef.current;

            const startTransition = () => {
                // Force layout reflow to flush the starting state styles to the browser
                imgEl.offsetHeight;

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        setPhase("open");
                    });
                });
            };

            // Use the DOM image element's decode API to ensure the GPU texture is uploaded
            if (typeof imgEl.decode === "function") {
                imgEl.decode()
                    .then(startTransition)
                    .catch(() => startTransition());
            } else {
                startTransition();
            }
        }
    }, [phase]);

    // ── Keep savedRect in sync with sourceRect prop when open ──
    useEffect(() => {
        if (isOpen) {
            savedRect.current = sourceRect;
        }
    }, [sourceRect, isOpen]);

    // ── Handle Next/Prev transition sequence on src changes ──
    useEffect(() => {
        if (src !== prevSrcRef.current) {
            prevSrcRef.current = src;
            if (phase === "open") {
                setTraversePhase("shrinking");

                const img = new window.Image();
                img.src = src;
                const decodePromise = typeof img.decode === "function"
                    ? img.decode().catch(() => { })
                    : Promise.resolve();

                let timer2: NodeJS.Timeout;
                const timer1 = setTimeout(() => {
                    decodePromise.then(() => {
                        setDisplaySrc(src);
                        setTraversePhase("primed");

                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                setTraversePhase("expanding");
                                timer2 = setTimeout(() => {
                                    setTraversePhase("idle");
                                }, 400); // scale transition takes 400ms
                            });
                        });
                    });
                }, 150);

                return () => {
                    clearTimeout(timer1);
                    if (timer2) clearTimeout(timer2);
                };
            } else {
                setDisplaySrc(src);
            }
        }
    }, [src, phase]);

    // ── After exit transition finishes → set phase to closed + unhide thumbnail ──
    const handleTransitionEnd = (e: React.TransitionEvent) => {
        if (phase === "exiting" && e.target === e.currentTarget) {
            setPhase("closed");
            onExitComplete();
        }
    };

    // ── Escape and Navigation keys ──
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            } else if ((e.key === "ArrowRight" || e.key === "Right") && onNext) {
                onNext();
            } else if ((e.key === "ArrowLeft" || e.key === "Left") && onPrev) {
                onPrev();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose, onPrev, onNext]);

    if (!mounted) return null;

    const rect = savedRect.current;
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;

    let wrapperTransform = "none";
    let wrapperClip = "none";
    let wrapperClipTransition = "none";
    let wrapperOpacity = 1;

    let imgScale = 1.0;
    let imgTransformTransition = "none";

    const overlayOpacity = phase === "open" ? 1 : 0;
    const targetRadius = 16;
    const atSource = phase === "entering" || phase === "exiting";

    if (rect) {
        // ── Target size (for FLIP math only) ──
        const natAspect = rect.naturalWidth / rect.naturalHeight;
        const maxW = Math.min(vw * 0.85, 900);
        const maxH = vh * 0.85;
        let targetW: number, targetH: number;
        if (natAspect > maxW / maxH) {
            targetW = maxW;
            targetH = maxW / natAspect;
        } else {
            targetH = maxH;
            targetW = maxH * natAspect;
        }

        // ── FLIP: uniform scale + clip-path ──
        const scaleX = rect.width / targetW;
        const scaleY = rect.height / targetH;
        const coverScale = Math.max(scaleX, scaleY);

        const dx = (rect.left + rect.width / 2) - vw / 2;
        const dy = (rect.top + rect.height / 2) - vh / 2;

        // ── Clip-path in PERCENTAGES (viewport-independent) ──
        const clipXPct = ((targetW - rect.width / coverScale) / targetW) * 50;
        const clipYPct = ((targetH - rect.height / coverScale) / targetH) * 50;
        const sourceRadiusLocal = rect.borderRadius / coverScale;

        const sourceClip = `inset(${clipYPct}% ${clipXPct}% ${clipYPct}% ${clipXPct}% round ${sourceRadiusLocal}px)`;
        const targetClip = `inset(0% 0% 0% 0% round ${targetRadius}px)`;

        wrapperTransform = atSource
            ? `translate(${dx}px, ${dy}px) scale(${coverScale})`
            : "none";

        const imageClipPath = atSource ? sourceClip : targetClip;

        const transitionTiming = "350ms cubic-bezier(0.4, 0, 0.2, 1)";
        const clipTransition = phase === "entering" ? "none" : `clip-path ${transitionTiming}`;

        // ── Traversal styles: separate clipPath on wrapper from scale on image ──
        wrapperClip = imageClipPath;
        wrapperClipTransition = clipTransition;

        if (phase === "open") {
            if (traversePhase === "shrinking") {
                wrapperClip = `inset(2% round ${targetRadius}px)`;
                wrapperClipTransition = `clip-path 150ms ease-in`;
                imgScale = 1.0;
                imgTransformTransition = `transform 150ms ease-in`;
            } else if (traversePhase === "primed") {
                wrapperClip = `inset(2% round ${targetRadius}px)`;
                wrapperClipTransition = `none`;
                imgScale = 1.05;
                imgTransformTransition = `none`;
            } else if (traversePhase === "expanding") {
                wrapperClip = `inset(0% round ${targetRadius}px)`;
                wrapperClipTransition = `clip-path 250ms ease-out`;
                imgScale = 1.0;
                imgTransformTransition = `transform 400ms ease-out`;
            } else {
                wrapperClip = `inset(0% round ${targetRadius}px)`;
                wrapperClipTransition = clipTransition;
                imgScale = 1.0;
                imgTransformTransition = `none`;
            }
        }
    } else {
        // No thumbnail rect: modal fades out and scales down on exit
        if (phase === "exiting") {
            wrapperTransform = "scale(0.95)";
            wrapperOpacity = 0;
        } else if (phase === "entering") {
            wrapperTransform = "scale(0.95)";
            wrapperOpacity = 0;
        } else {
            wrapperTransform = "none";
            wrapperOpacity = 1;
        }

        wrapperClip = `inset(0% round ${targetRadius}px)`;
        wrapperClipTransition = phase === "entering" ? "none" : `clip-path 350ms cubic-bezier(0.4, 0, 0.2, 1)`;

        if (phase === "open") {
            if (traversePhase === "shrinking") {
                wrapperClip = `inset(2% round ${targetRadius}px)`;
                wrapperClipTransition = `clip-path 150ms ease-in`;
                imgScale = 1.0;
                imgTransformTransition = `transform 150ms ease-in`;
            } else if (traversePhase === "primed") {
                wrapperClip = `inset(2% round ${targetRadius}px)`;
                wrapperClipTransition = `none`;
                imgScale = 1.05;
                imgTransformTransition = `none`;
            } else if (traversePhase === "expanding") {
                wrapperClip = `inset(0% round ${targetRadius}px)`;
                wrapperClipTransition = `clip-path 250ms ease-out`;
                imgScale = 1.0;
                imgTransformTransition = `transform 400ms ease-out`;
            } else {
                wrapperClip = `inset(0% round ${targetRadius}px)`;
                wrapperClipTransition = `clip-path 250ms ease-out`;
                imgScale = 1.0;
                imgTransformTransition = `none`;
            }
        }
    }

    // ── Build combined wrapper transition rules ──
    const wrapperTransitionList: string[] = [];
    if (rect) {
        const transitionTiming = "350ms cubic-bezier(0.4, 0, 0.2, 1)";
        if (phase !== "entering") {
            wrapperTransitionList.push(`transform ${transitionTiming}`);
        }
        if (wrapperClipTransition !== "none") {
            wrapperTransitionList.push(wrapperClipTransition);
        }
    } else {
        if (phase !== "entering") {
            wrapperTransitionList.push("transform 200ms ease-out");
            wrapperTransitionList.push("opacity 200ms ease-out");
        }
        if (wrapperClipTransition !== "none") {
            wrapperTransitionList.push(wrapperClipTransition);
        }
    }
    const combinedWrapperTransition = wrapperTransitionList.join(", ") || "none";

    return createPortal(
        <div
            className="fixed inset-0 z-999"
            role="dialog"
            aria-modal="true"
            style={{
                opacity: phase === "closed" ? 0 : 1,
                visibility: phase === "closed" ? "hidden" : "visible",
                pointerEvents: phase === "closed" ? "none" : "auto",
            }}
        >
            {/* ── Overlay ── */}
            <div
                onClick={onClose}
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(255, 255, 255, 1)",
                    opacity: overlayOpacity,
                    transition: "opacity 250ms ease-out",
                }}
            />

            {/* ── Flex centering container ── */}
            <div className="fixed inset-0 z-1000 flex items-center justify-center pointer-events-none">
                {/* ── Close button ── */}
                <button
                    onClick={onClose}
                    className="flex items-center text-black justify-center size-10 rounded-full bg-white shadow-lg cursor-pointer pointer-events-auto"
                    style={{
                        position: "absolute",
                        top: 24,
                        right: 24,
                        zIndex: 10,
                        opacity: phase === "open" ? 1 : 0,
                        transform: phase === "open" ? "scale(1)" : "scale(0.75)",
                        transition: "opacity 200ms ease-out, transform 200ms ease-out",
                        transitionDelay: phase === "open" ? "250ms" : "0ms",
                    }}
                >
                    <X />
                </button>

                {/* ── Navigation: Previous Button ── */}
                {onPrev && (
                    <button
                        onClick={onPrev}
                        className="fixed left-6 top-1/2 -translate-y-1/2 flex items-center text-black justify-center size-12 rounded-full bg-white shadow-lg cursor-pointer pointer-events-auto transition-[opacity,transform] duration-200 hover:scale-105 active:scale-95"
                        style={{
                            zIndex: 10,
                            opacity: phase === "open" ? 1 : 0,
                            transform: phase === "open" ? "translateY(-50%) scale(1)" : "translateY(-50%) scale(0.75)",
                        }}
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="size-6" />
                    </button>
                )}

                {/* ── Navigation: Next Button ── */}
                {onNext && (
                    <button
                        onClick={onNext}
                        className="fixed right-6 top-1/2 -translate-y-1/2 flex items-center text-black justify-center size-12 rounded-full bg-white shadow-lg cursor-pointer pointer-events-auto transition-[opacity,transform] duration-200 hover:scale-105 active:scale-95"
                        style={{
                            zIndex: 10,
                            opacity: phase === "open" ? 1 : 0,
                            transform: phase === "open" ? "translateY(-50%) scale(1)" : "translateY(-50%) scale(0.75)",
                        }}
                        aria-label="Next image"
                    >
                        <ChevronRight className="size-6" />
                    </button>
                )}

                {/* ── FLIP wrapper (receives transform & clip-path) ── */}
                <div
                    className="overflow-hidden"
                    onTransitionEnd={handleTransitionEnd}
                    style={{
                        position: "relative",
                        transform: wrapperTransform,
                        transformOrigin: "center center",
                        transition: combinedWrapperTransition,
                        willChange: "transform, opacity",
                        pointerEvents: "auto",
                        clipPath: wrapperClip,
                        opacity: wrapperOpacity,
                    }}
                >
                    {/* ── Image (responsive, clip-path morph) ── */}
                    <img
                        ref={modalImageRef}
                        key={displaySrc}
                        src={displaySrc}
                        alt={alt}
                        onLoad={() => {
                            // Hide thumbnail only AFTER this image has decoded —
                            // prevents the flash from decode latency
                            if (thumbnailRef.current) {
                                thumbnailRef.current.style.visibility = "hidden";
                            }
                        }}
                        style={{
                            display: "block",
                            maxWidth: "min(85vw, 900px)",
                            maxHeight: "85vh",
                            transform: `scale(${imgScale})`,
                            transformOrigin: "center center",
                            transition: imgTransformTransition,
                        }}
                    />
                </div>
            </div>
        </div>,
        document.body
    );
}