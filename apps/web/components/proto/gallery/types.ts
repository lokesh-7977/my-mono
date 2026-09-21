// ─── Shared types for the gallery system ────────────────────────────────

export interface SourceRect {
    top: number;
    left: number;
    width: number;
    height: number;
    borderRadius: number;
    naturalWidth: number;
    naturalHeight: number;
}

export type Phase = "entering" | "open" | "exiting" | "closed";
export type TraversePhase = "idle" | "shrinking" | "primed" | "expanding";
