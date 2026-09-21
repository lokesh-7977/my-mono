// ─── Pure style computation for the FLIP modal ─────────────────────────
//
// All FLIP math, clip-path generation, traversal overrides, and transition
// string building live here — zero React, zero DOM, fully testable.

import type { Phase, SourceRect, TraversePhase } from "./types";

export interface FLIPStyles {
    wrapperTransform: string;
    wrapperClip: string;
    wrapperOpacity: number;
    combinedWrapperTransition: string;
    overlayOpacity: number;
    imgScale: number;
    imgTransformTransition: string;
    atSource: boolean;
}

const TARGET_RADIUS = 16;
const FLIP_TIMING = "350ms cubic-bezier(0.4, 0, 0.2, 1)";

export function computeFLIPStyles(
    phase: Phase,
    traversePhase: TraversePhase,
    rect: SourceRect | null,
    vw: number,
    vh: number,
): FLIPStyles {
    let wrapperTransform = "none";
    let wrapperClip = "none";
    let wrapperClipTransition = "none";
    let wrapperOpacity = 1;

    let imgScale = 1.0;
    let imgTransformTransition = "none";

    const overlayOpacity = phase === "open" ? 1 : 0;
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
        const scaleX = (rect.width) / targetW;
        const scaleY = rect.height / targetH;
        const coverScale = Math.max(scaleX, scaleY);

        const dx = (rect.left + rect.width / 2) - vw / 2;
        const dy = (rect.top + rect.height / 2) - vh / 2;

        // ── Clip-path in PERCENTAGES (viewport-independent) ──
        const clipXPct = ((targetW - (rect.width + 0) / coverScale) / targetW) * 50;
        const clipYPct = ((targetH - (rect.height + 0) / coverScale) / targetH) * 50;
        const sourceRadiusLocal = rect.borderRadius / coverScale;

        const sourceClip = `inset(${clipYPct}% ${clipXPct}% ${clipYPct}% ${clipXPct}% round ${sourceRadiusLocal}px)`;
        const targetClip = `inset(0% 0% 0% 0% round ${TARGET_RADIUS}px)`;

        wrapperTransform = atSource
            ? `translate(${dx}px, ${dy}px) scale(${coverScale})`
            : "none";

        const imageClipPath = atSource ? sourceClip : targetClip;
        const clipTransition = phase === "entering" ? "none" : `clip-path ${FLIP_TIMING}`;

        // ── Traversal styles: separate clipPath on wrapper from scale on image ──
        wrapperClip = imageClipPath;
        wrapperClipTransition = clipTransition;

        if (phase === "open") {
            ({ wrapperClip, wrapperClipTransition, imgScale, imgTransformTransition } =
                applyTraverseOverrides(traversePhase, clipTransition));
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

        wrapperClip = `inset(0% round ${TARGET_RADIUS}px)`;
        wrapperClipTransition = phase === "entering" ? "none" : `clip-path ${FLIP_TIMING}`;

        if (phase === "open") {
            ({ wrapperClip, wrapperClipTransition, imgScale, imgTransformTransition } =
                applyTraverseOverrides(traversePhase, `clip-path 250ms ease-out`));
        }
    }

    // ── Build combined wrapper transition ──
    const transitionParts: string[] = [];
    if (rect) {
        if (phase !== "entering") {
            transitionParts.push(`transform ${FLIP_TIMING}`);
        }
        if (wrapperClipTransition !== "none") {
            transitionParts.push(wrapperClipTransition);
        }
    } else {
        if (phase !== "entering") {
            transitionParts.push("transform 200ms ease-out");
            transitionParts.push("opacity 200ms ease-out");
        }
        if (wrapperClipTransition !== "none") {
            transitionParts.push(wrapperClipTransition);
        }
    }
    const combinedWrapperTransition = transitionParts.join(", ") || "none";

    return {
        wrapperTransform,
        wrapperClip,
        wrapperOpacity,
        combinedWrapperTransition,
        overlayOpacity,
        imgScale,
        imgTransformTransition,
        atSource,
    };
}

// ── Traversal overrides (shared by both rect and no-rect branches) ──
function applyTraverseOverrides(
    traversePhase: TraversePhase,
    defaultClipTransition: string,
) {
    let wrapperClip: string;
    let wrapperClipTransition: string;
    let imgScale = 1.0;
    let imgTransformTransition = "none";

    if (traversePhase === "shrinking") {
        wrapperClip = `inset(2% round ${TARGET_RADIUS}px)`;
        wrapperClipTransition = `clip-path 150ms ease-in`;
        imgScale = 1.0;
        imgTransformTransition = `transform 150ms ease-in`;
    } else if (traversePhase === "primed") {
        wrapperClip = `inset(2% round ${TARGET_RADIUS}px)`;
        wrapperClipTransition = `none`;
        imgScale = 1.05;
        imgTransformTransition = `none`;
    } else if (traversePhase === "expanding") {
        wrapperClip = `inset(0% round ${TARGET_RADIUS}px)`;
        wrapperClipTransition = `clip-path 250ms ease-out`;
        imgScale = 1.0;
        imgTransformTransition = `transform 400ms ease-out`;
    } else {
        wrapperClip = `inset(0% round ${TARGET_RADIUS}px)`;
        wrapperClipTransition = defaultClipTransition;
        imgScale = 1.0;
        imgTransformTransition = `none`;
    }

    return { wrapperClip, wrapperClipTransition, imgScale, imgTransformTransition };
}
