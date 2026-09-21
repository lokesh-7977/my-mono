"use client";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { cloneElement, ReactElement, HTMLAttributes, useId, useState } from "react";

export default function ImageExpander({ children }: { children: ReactElement<HTMLAttributes<HTMLElement>> }) {
    const { props } = children;

    const onClickHandler = () => {
        console.log("Image clicked!");
    };

    return (
        <>
            {cloneElement(children, {
                ...props,
                onClick: onClickHandler // Pass the handler to the child
            })}
        </>
    );
}


export function ImageEx({ src, alt, className }: { src: string; alt: string, className?: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const id = useId();

    return (
        <MotionConfig transition={{ type: "spring", stiffness: 225, damping: 25 }}>
            {/* <div> */}
            <motion.img
                className={cn(className, "w-full m-0 block cursor-pointer")}
                layoutId={id}
                onClick={() => setIsOpen(true)}
                style={{ borderRadius: 16 }}
                src={src}
                alt={alt}
                // whileHover={{ scale: 1.01, transition: { duration: 0.1 } }}
                whileTap={{ scale: 0.98, transition: { duration: 0.15 } }}
            />
            {/* </div> */}

            <Modal
                id={id}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                src={src}
                alt={alt}
            />
        </MotionConfig>
    );
}

function Modal({
    src,
    alt,
    isOpen,
    onClose,
    id,
}: {
    src: string;
    id: string;
    alt: string;
    isOpen: boolean;
    onClose: () => void;
}) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className={"fixed inset-0 z-999 min-h-dvh py-[200px] flex items-center justify-center "}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={"z-10 absolute inset-0 bg-white "}
                    // onClick={onClose}
                    />
                    <div className={"z-11 w-[min(500px,min(80vw,80vh))] relative"}>
                        <motion.button
                            className="flex items-center text-black justify-center size-10 absolute top-5 right-5 z-200 rounded-full bg-white cursor-pointer "
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ scale: 1, opacity: 1, transition: { delay: 0.25 } }}
                            exit={{ opacity: 0, transition: { duration: 0.05 } }}
                            transition={{ duration: 0.1 }}
                            onClick={onClose}
                        >
                            <X />
                        </motion.button>

                        <motion.img
                            className="block w-full"
                            layoutId={id}
                            src={src}
                            alt={alt}
                            style={{ borderRadius: 32 }}
                        />
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
}