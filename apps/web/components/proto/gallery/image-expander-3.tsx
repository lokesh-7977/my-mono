"use client";
import { cn } from "@repo/ui/lib/utils";
import { X } from "lucide-react";
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
}: {
    src: string;
    alt: string;
    isOpen: boolean;
    onClose: () => void;
    sourceRect: SourceRect | null;
    onExitComplete: () => void;
    thumbnailRef: React.RefObject<HTMLImageElement | null>;
}) {
    const [mounted, setMounted] = useState(false);
    const [phase, setPhase] = useState<Phase>("closed");
    const savedRect = useRef<SourceRect | null>(null);

    // ── Open / Close lifecycle ──
    useEffect(() => {
        if (isOpen && sourceRect) {
            savedRect.current = sourceRect;
            setMounted(true);
            setPhase("entering");
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setPhase("open");
                });
            });
        } else if (!isOpen && phase !== "closed") {
            setPhase("exiting");
        }
    }, [isOpen]);

    // ── After exit transition finishes → unmount + unhide thumbnail ──
    const handleTransitionEnd = (e: React.TransitionEvent) => {
        if (phase === "exiting" && e.target === e.currentTarget) {
            setMounted(false);
            setPhase("closed");
            onExitComplete();
        }
    };

    // ── Escape key ──
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);

    if (!mounted || !savedRect.current) return null;

    const rect = savedRect.current;
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;

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

    const atSource = phase === "entering" || phase === "exiting";

    // ── Clip-path in PERCENTAGES (viewport-independent) ──
    const clipXPct = ((targetW - rect.width / coverScale) / targetW) * 50;
    const clipYPct = ((targetH - rect.height / coverScale) / targetH) * 50;
    const sourceRadiusLocal = rect.borderRadius / coverScale;
    const targetRadius = 16;

    const sourceClip = `inset(${clipYPct}% ${clipXPct}% ${clipYPct}% ${clipXPct}% round ${sourceRadiusLocal}px)`;
    const targetClip = `inset(0% 0% 0% 0% round ${targetRadius}px)`;

    const wrapperTransform = atSource
        ? `translate(${dx}px, ${dy}px) scale(${coverScale})`
        : "none";

    const imageClipPath = atSource ? sourceClip : targetClip;

    const transitionTiming = "350ms cubic-bezier(0.4, 0, 0.2, 1)";
    const wrapperTransition = phase === "entering" ? "none" : `transform ${transitionTiming}`;
    const clipTransition = phase === "entering" ? "none" : `clip-path ${transitionTiming}`;

    const overlayOpacity = phase === "open" ? 1 : 0;

    return createPortal(
        <div className="fixed inset-0 z-999" role="dialog" aria-modal="true">
            {/* ── Overlay ── */}
            <div
                onClick={onClose}
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgb(255, 255, 255)",
                    backdropFilter: "blur(4px)",
                    opacity: overlayOpacity,
                    transition: "opacity 250ms ease-out",
                }}
            />

            {/* ── Flex centering container ── */}
            <div className="fixed inset-0 z-1000 flex items-center justify-center pointer-events-none">
                <button
                    onClick={onClose}
                    className="flex items-center text-black justify-center size-10 rounded-full bg-white shadow-lg cursor-pointer"
                    style={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        zIndex: 1,
                        opacity: phase === "open" ? 1 : 0,
                        transform: phase === "open" ? "scale(1)" : "scale(0.75)",
                        transition: "opacity 200ms ease-out, transform 200ms ease-out",
                        transitionDelay: phase === "open" ? "250ms" : "0ms",
                    }}
                >
                    <X />
                </button>
                {/* ── FLIP wrapper (receives transform) ── */}
                <div
                    onTransitionEnd={handleTransitionEnd}
                    style={{
                        position: "relative",
                        transform: wrapperTransform,
                        transformOrigin: "center center",
                        transition: wrapperTransition,
                        willChange: "transform",
                        pointerEvents: "auto",
                    }}
                >
                    {/* ── Close button ── */}


                    {/* ── Image (responsive, clip-path morph) ── */}
                    <img
                        src={src}
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
                            clipPath: imageClipPath,
                            transition: clipTransition,
                            boxShadow: atSource ? "none" : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                        }}
                    />
                </div>
            </div>
        </div>,
        document.body
    );
}