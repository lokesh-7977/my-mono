"use client";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { computeFLIPStyles } from "./compute-styles";
import type { Phase, SourceRect, TraversePhase } from "./types";

// ─── FLIP Modal ─────────────────────────────────────────────────────────
//
// Thumbnail visibility is managed IMPERATIVELY via DOM:
//   Click → element.style.visibility = "hidden"  (instant, same tick)
//   Exit transition end → element.style.visibility = ""  (instant restore)
//
// No React state for visibility = no race conditions, no flashes.

export function FLIPModal({
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
    const [traversePhase, setTraversePhase] = useState<TraversePhase>("idle");
    const prevSrcRef = useRef(src);

    // ── Open / Close lifecycle ──
    // useLayoutEffect so phase transitions before paint — prevents a frame gap
    // where the thumbnail is already hidden but the portal is still invisible.
    useLayoutEffect(() => {
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
    // useLayoutEffect fires synchronously after DOM mutation but BEFORE paint,
    // so the decode pipeline starts earlier and the GPU texture is ready sooner.
    useLayoutEffect(() => {
        if (phase === "entering" && modalImageRef.current) {
            const imgEl = modalImageRef.current;

            const startTransition = () => {
                requestAnimationFrame(() => {
                    // Force layout reflow inside the animation frame
                    // to commit entering-state styles to the compositor
                    imgEl.offsetHeight;

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

    // ── Compute all FLIP styles via the pure helper ──
    const rect = savedRect.current;
    // clientWidth/Height excludes the scrollbar — this matches the coordinate
    // system of "fixed inset-0 flex justify-center" where the modal is centered.
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;

    const styles = computeFLIPStyles(phase, traversePhase, rect, vw, vh);

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
                    opacity: styles.overlayOpacity,
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
                        transform: styles.wrapperTransform,
                        transformOrigin: "center center",
                        transition: styles.combinedWrapperTransition,
                        willChange: "transform, opacity",
                        pointerEvents: "auto",
                        clipPath: styles.wrapperClip,
                        opacity: styles.wrapperOpacity,
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
                            maxWidth: Math.min(vw * 0.85, 900),
                            maxHeight: vh * 0.85,
                            transform: `scale(${styles.imgScale})`,
                            transformOrigin: "center center",
                            transition: styles.imgTransformTransition,
                        }}
                    />
                </div>
            </div>
        </div>,
        document.body
    );
}
