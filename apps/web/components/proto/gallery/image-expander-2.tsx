"use client";
import { cn } from "@repo/ui/lib/utils";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion, MotionConfig } from "motion/react";
import { createContext, useContext, useMemo, useState } from "react";

// Dispatch context — stable references, won't cause re-renders
const GalleryDispatchContext = createContext<{
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

// State context — changes on interaction, only Modal needs this
const GalleryStateContext = createContext<{
    images: string[];
    currentIndex: number;
    totalImages: number;
    isOpen: boolean;
} | null>(null);

export function GalleryContainer({ images, children }: { images: string[], children: React.ReactNode }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalImages = images.length;
    const [isOpen, setIsOpen] = useState(false);

    const dispatchValue = useMemo(() => ({ setCurrentIndex, setIsOpen }), [setCurrentIndex, setIsOpen]);

    return (
        <GalleryDispatchContext.Provider value={dispatchValue}>
            <GalleryStateContext.Provider value={{ images, currentIndex, totalImages, isOpen }}>
                <MotionConfig transition={{ type: "spring", stiffness: 225, damping: 25 }}>
                    <LayoutGroup id="trek-gallery">
                        {children}
                        <AnimatePresence>
                            {isOpen && (
                                <Modal onClose={() => setIsOpen(false)} />
                            )}
                        </AnimatePresence>
                    </LayoutGroup>
                </MotionConfig>
            </GalleryStateContext.Provider>
        </GalleryDispatchContext.Provider>
    );
}

export function ImageEx({ src, alt, className, index }: { src: string; alt: string, className?: string, index: number }) {
    const { setCurrentIndex, setIsOpen } = useContext(GalleryDispatchContext) || { setCurrentIndex: () => { }, setIsOpen: () => { } };

    return (
        <motion.div
            layoutId={`image-${index}`}
            className={cn(className, "cursor-pointer overflow-hidden")}
            style={{ borderRadius: 16 }}
            onClick={() => {
                setCurrentIndex(index);
                setIsOpen(true);
            }}
        >
            <motion.img
                className="w-full h-full object-cover block m-0"
                loading="eager"
                src={src}
                alt={alt}
                whileTap={{ scale: 0.98, transition: { duration: 0.15 } }}
            />
        </motion.div>
    );
}

function Modal({
    onClose,
}: {
    onClose: () => void;
}) {
    const { currentIndex, images } = useContext(GalleryStateContext) || { images: [], currentIndex: 0 };
    const { setCurrentIndex } = useContext(GalleryDispatchContext) || { setCurrentIndex: () => { } };

    return (
        <motion.div 
            className="fixed inset-0 z-999 min-h-dvh flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="z-10 absolute inset-0 bg-white"
            />
            <motion.button
                className="flex items-center text-black justify-center size-10 absolute top-5 right-5 z-200 rounded-full bg-white cursor-pointer"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ scale: 1, opacity: 1, transition: { delay: 0.25 } }}
                exit={{ opacity: 0, transition: { duration: 0.05 } }}
                transition={{ duration: 0.1 }}
                onClick={onClose}
            >
                <X />
            </motion.button>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full z-11 h-10 border border-red-500"
            />
            <div className="flex-1 border border-green-500 flex z-11 relative">
                <button 
                    onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)} 
                    className="rounded-full p-4 my-auto bg-secondary z-10"
                >
                    <ChevronLeft />
                </button>

                <div className="relative flex items-center justify-center flex-1">
                    <motion.div
                        className="relative overflow-hidden flex items-center justify-center max-h-[75vh] max-w-full"
                        layoutId={`image-${currentIndex}`}
                        style={{ borderRadius: 32 }}
                    >
                        <motion.img
                            className="block max-h-[75vh] max-w-full object-contain"
                            src={images[currentIndex]}
                            alt={images[currentIndex]}
                        />
                    </motion.div>
                </div>
                
                <button 
                    onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)} 
                    className="rounded-full p-4 my-auto bg-secondary z-10"
                >
                    <ChevronRight />
                </button>
            </div>
        </motion.div>
    );
}