"use client";
import { createContext } from "react";
import type { SourceRect } from "./types";

// ─── Gallery dispatch context ───────────────────────────────────────────
// Shared between Gallery (provider) and ImageEx (consumer).

export interface GalleryDispatch {
    onImageClick: (index: number, rect: SourceRect, element: HTMLImageElement) => void;
}

export const GalleryDispatchContext = createContext<GalleryDispatch | null>(null);
