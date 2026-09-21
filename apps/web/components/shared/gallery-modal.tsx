"use client"

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Dialog, DialogDescription, DialogTitle, DialogContent, DialogClose } from "../ui/dialog"
import { ArrowLeft, ArrowRight, GalleryHorizontal, Grid2x2, X } from "lucide-react";
import { motion, useAnimation } from "motion/react";
import { useEffect, useState } from "react";
import Masonry from "./masonry-grid";

export function useGalleryModal(images: string[]) {
    const [open, setOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [gridMode, setGridMode] = useState(false);

    const openGallery = (index: number, mode = false) => {
        setGridMode(mode);
        setCurrentIndex(index);
        setOpen(true);
    };

    return {
        props: {
            images,
            open,
            onOpenChange: setOpen,
            currentIndex,
            onIndexChange: setCurrentIndex,
            gridMode,
            onGridModeChange: setGridMode,
        },
        openGallery,
    };
}

interface GalleryModalProps {
    images: string[];
    currentIndex: number;
    onIndexChange: (index: number) => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    gridMode: boolean;
    onGridModeChange: (mode: boolean) => void;
}

export default function GalleryModal({ images, currentIndex, onIndexChange, open, onOpenChange, title, gridMode, onGridModeChange }: GalleryModalProps) {
    const imgCount = images.length;
    const clipControls = useAnimation();
    const [hasNavigated, setHasNavigated] = useState(false);

    // Preload a single image URL into the browser cache
    const preloadImage = (src: string) => new Promise<void>((resolve) => {
        if (!src) return resolve();
        const img = new window.Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // resolve on error too — don't block the UI
        img.src = src;
    });

    // Background preload of adjacent images whenever the index changes
    useEffect(() => {
        if (imgCount === 0) return;
        const next = (currentIndex + 1) % imgCount;
        const prev = (currentIndex - 1 + imgCount) % imgCount;
        preloadImage(images[next]);
        preloadImage(images[prev]);
    }, [currentIndex, imgCount, images]);

    const navigate = async (direction: 'next' | 'prev') => {
        if (imgCount === 0) return;
        const nextIndex = direction === 'next'
            ? (currentIndex === imgCount - 1 ? 0 : currentIndex + 1)
            : (currentIndex === 0 ? imgCount - 1 : currentIndex - 1);

        // Phase 1: shrink clip-path (image is hidden — use this time to preload)
        await Promise.all([
            clipControls.start({ clipPath: "inset(2% round 24px)", transition: { duration: 0.15, ease: "easeIn" } }),
            preloadImage(images[nextIndex]), // guarantee image is cached before reveal
        ]);

        // Phase 2: swap image (already in cache — no flash)
        setHasNavigated(true);
        onIndexChange(nextIndex);

        // Phase 3: expand clip-path
        await clipControls.start({ clipPath: "inset(0% round 24px)", transition: { duration: 0.25, ease: "easeOut" } });
    };

    if (imgCount === 0) return null;

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            if (!isOpen) setHasNavigated(false);
            onOpenChange(isOpen);
        }}>
            <DialogContent showCloseButton={false} className="max-w-none! w-full! h-full! p-0! rounded-none bg-background overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable]">
                <VisuallyHidden>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>Gallery Modal for {title}</DialogDescription>
                </VisuallyHidden>

                <div className="flex flex-col h-full w-full relative">

                    <div className="h-20 shrink-0 w-full flex items-center justify-between px-4 sticky top-0 bg-background z-100">
                        <button onClick={() => onGridModeChange(!gridMode)} className="p-2 cursor-pointer rounded-full hover:bg-secondary transition-all duration-150">
                            {gridMode ? <GalleryHorizontal className="size-4.5" /> : <Grid2x2 className="size-4.5" />}
                        </button>
                        <div className="mx-auto text-base font-medium text-zinc-500/80">
                            {gridMode ? `Explore iconic sights of ${title}` : `${currentIndex + 1} of ${imgCount}`}
                        </div>
                        <DialogClose className="p-2 cursor-pointer rounded-full hover:bg-secondary transition-all duration-150">
                            <X className="size-4.5" />
                        </DialogClose>
                    </div>
                    {!gridMode
                        ? <>
                            <div className="w-full flex-1 flex relative overflow-hidden px-3">
                                <button
                                    disabled={imgCount === 0 || currentIndex === 0}
                                    onClick={() => navigate('prev')}
                                    className="disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent rounded-full cursor-pointer p-3 transition-all duration-150 my-auto hover:bg-secondary z-10">
                                    <ArrowLeft className="size-5" />
                                </button>

                                <div className="flex-1 flex items-center justify-center p-4 min-w-0 overflow-hidden">

                                    <div className="relative inline-flex">

                                        <motion.div
                                            className="overflow-hidden"
                                            initial={{ clipPath: "inset(0% round 24px)" }}
                                            animate={clipControls}
                                        >
                                            <motion.img
                                                key={currentIndex}
                                                src={images[currentIndex]}
                                                className="block max-h-[70vh] max-w-full object-contain"
                                                initial={{ scale: hasNavigated ? 1.05 : 1 }}
                                                animate={{ scale: 1 }}
                                                transition={{ duration: 0.4, ease: "easeOut" }}
                                                alt=""
                                            />
                                        </motion.div>

                                        {/* <div className="absolute inset-0 rounded-3xl pointer-events-none bg-red-100/50" /> */}

                                    </div>

                                </div>
                                <button
                                    disabled={imgCount === 0 || currentIndex === imgCount - 1}
                                    onClick={() => navigate('next')}
                                    className="disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent rounded-full cursor-pointer p-3 my-auto transition-all duration-150 hover:bg-secondary z-10">
                                    <ArrowRight className="size-5" />
                                </button>
                            </div>

                            <div className="h-20 shrink-0 w-full flex justify-end items-center px-6">

                            </div>
                        </>
                        : <div className="px-4 pb-4 pt-4">
                            <Masonry
                                items={images.map((img, i) => ({
                                    id: i,
                                    img: img,
                                }))}
                                ease="power3.out"
                                duration={0.6}
                                stagger={0.05}
                                animateFrom="bottom"
                                scaleOnHover
                                hoverScale={0.97}
                                blurToFocus={false}
                                colorShiftOnHover={false}
                                onImageClick={(e, i) => {
                                    e.stopPropagation();
                                    onIndexChange(i);
                                    onGridModeChange(false);
                                }}
                            />
                        </div>
                    }
                </div>



            </DialogContent>
        </Dialog>
    )
}