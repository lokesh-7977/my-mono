import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { animate } from 'motion/react';

export interface MasonryItem {
    id: string | number;
    url?: string;
    img: string;
    height?: number;
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    intrinsicWidth?: number;
    intrinsicHeight?: number;
}

export interface MasonryProps {
    items: MasonryItem[];
    ease?: string;
    duration?: number;
    stagger?: number;
    animateFrom?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'random';
    scaleOnHover?: boolean;
    hoverScale?: number;
    blurToFocus?: boolean;
    colorShiftOnHover?: boolean;
    onImageClick?: (e: React.MouseEvent<HTMLDivElement>, index: number) => void;
}

const useMedia = <T,>(queries: string[], values: T[], defaultValue: T): T => {
    const get = () => {
        if (typeof window === 'undefined') return defaultValue;
        const index = queries.findIndex(q => window.matchMedia(q).matches);
        return index !== -1 ? values[index] : defaultValue;
    };

    const [value, setValue] = useState<T>(get);

    useEffect(() => {
        const handler = () => setValue(get());
        queries.forEach(q => window.matchMedia(q).addEventListener('change', handler));
        return () => queries.forEach(q => window.matchMedia(q).removeEventListener('change', handler));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queries]);

    return value;
};

const useMeasure = (): [React.MutableRefObject<HTMLDivElement | null>, { width: number; height: number }] => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
        if (!ref.current) return;
        const ro = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            setSize({ width, height });
        });
        ro.observe(ref.current);
        return () => ro.disconnect();
    }, []);

    return [ref, size];
};

const preloadImages = async (items: MasonryItem[]): Promise<MasonryItem[]> => {
    return await Promise.all(
        items.map(
            item =>
                new Promise<MasonryItem>(resolve => {
                    const img = new window.Image();
                    img.src = item.img;
                    img.onload = () => resolve({ ...item, intrinsicWidth: img.width, intrinsicHeight: img.height });
                    img.onerror = () => resolve({ ...item, intrinsicWidth: 1, intrinsicHeight: 1 });
                })
        )
    );
};

// Map GSAP ease names → motion easing
const easeMap: Record<string, [number, number, number, number]> = {
    'power3.out': [0.215, 0.61, 0.355, 1],
    'power2.out': [0.25, 1, 0.5, 1],
    'power1.out': [0.25, 0.46, 0.45, 0.94],
};

const Masonry = ({
    items,
    ease = 'power3.out',
    duration = 0.6,
    stagger = 0.05,
    animateFrom = 'bottom',
    // scaleOnHover = true,
    // hoverScale = 0.95,
    blurToFocus = true,
    colorShiftOnHover = false,
    onImageClick,
}: MasonryProps) => {
    const columns = useMedia<number>(
        ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)'],
        [4, 4, 3, 2],
        1
    );

    const [containerRef, { width, height }] = useMeasure();
    const [imagesReady, setImagesReady] = useState(false);
    const [loadedItems, setLoadedItems] = useState<MasonryItem[]>([]);
    const hasMounted = useRef(false);
    const isAnimatingIn = useRef(false);
    const cubicEase = easeMap[ease] ?? easeMap['power3.out'];

    useEffect(() => {
        setImagesReady(false);
        hasMounted.current = false;
        isAnimatingIn.current = false;
        preloadImages(items).then(loaded => {
            setLoadedItems(loaded);
            setImagesReady(true);
        });
    }, [items]);

    const getInitialPosition = (item: MasonryItem, index: number, containerW: number, containerH: number) => {
        const ix = item.x ?? 0;
        const iy = item.y ?? 0;

        let direction = animateFrom;
        if (animateFrom === 'random') {
            const dirs: ('top' | 'bottom' | 'left' | 'right')[] = ['top', 'bottom', 'left', 'right'];
            direction = dirs[(index * 7) % dirs.length];
        }

        switch (direction) {
            case 'top': return { x: ix, y: -200 };
            case 'bottom': return { x: ix, y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 200 };
            case 'left': return { x: -200, y: iy };
            case 'right': return { x: (typeof window !== 'undefined' ? window.innerWidth : 1200) + 200, y: iy };
            case 'center': return { x: containerW / 2 - (item.w ?? 0) / 2, y: containerH / 2 - (item.h ?? 0) / 2 };
            default: return { x: ix, y: iy + 100 };
        }
    };

    const { gridItems, maxColHeight } = useMemo(() => {
        if (!width || !imagesReady) return { gridItems: [], maxColHeight: 0 };

        const colHeights = new Array(columns).fill(0);
        const gap = 16;
        const columnWidth = (width - (columns - 1) * gap) / columns;

        const gridItems = loadedItems.map(child => {
            const col = colHeights.indexOf(Math.min(...colHeights));
            const x = col * (columnWidth + gap);

            let itemHeight = child.height ?? 0;
            if (child.intrinsicWidth && child.intrinsicHeight) {
                itemHeight = (child.intrinsicHeight / child.intrinsicWidth) * columnWidth;
            } else if (itemHeight === 0) {
                itemHeight = columnWidth;
            }

            const y = colHeights[col];
            colHeights[col] += itemHeight + gap;
            return { ...child, x, y, w: columnWidth, h: itemHeight };
        });

        return { gridItems, maxColHeight: Math.max(...colHeights) };
    }, [columns, loadedItems, width, imagesReady]);

    // Imperative animation using motion's animate() — identical semantics to gsap.fromTo / gsap.to.
    // We can't use motion component's `initial`/`animate` props here because `initial` only fires
    // on the very first mount, not on grid reflows (column count / width changes).
    useLayoutEffect(() => {
        if (!imagesReady || gridItems.length === 0) return;
        // If entrance animation is already running (e.g. ResizeObserver fired mid-stagger), bail out
        if (isAnimatingIn.current) return;

        if (!hasMounted.current) isAnimatingIn.current = true;

        gridItems.forEach((item, index) => {
            const el = document.querySelector<HTMLElement>(`[data-key="${item.id}"]`);
            if (!el) return;

            const target = {
                x: item.x ?? 0,
                y: item.y ?? 0,
                width: item.w!,
                height: item.h!,
            };

            if (!hasMounted.current) {
                // ── ENTRANCE: fromTo with stagger ────────────────────────────
                const start = getInitialPosition(item, index, width, height);

                // Set start state SYNCHRONOUSLY (gsap.set equivalent)
                el.style.opacity = '0';
                el.style.width = `${target.width}px`;
                el.style.height = `${target.height}px`;
                el.style.transform = `translateX(${start.x}px) translateY(${start.y}px)`;
                if (blurToFocus) el.style.filter = 'blur(10px)';

                const isLastItem = index === gridItems.length - 1;
                const entranceDuration = 0.8;

                // Single animate() call for the actual entrance tween
                animate(el, {
                    opacity: 1,
                    x: target.x,
                    y: target.y,
                    width: target.width,
                    height: target.height,
                    ...(blurToFocus && { filter: 'blur(0px)' }),
                }, {
                    duration: entranceDuration,
                    ease: cubicEase,
                    delay: index * stagger,
                    onComplete: isLastItem ? () => {
                        hasMounted.current = true;
                        isAnimatingIn.current = false;
                    } : undefined,
                });
            } else {
                // ── REFLOW: smooth positional tween, no stagger ──────────────
                animate(el, {
                    x: target.x,
                    y: target.y,
                    width: target.width,
                    height: target.height,
                }, {
                    duration,
                    ease: cubicEase,
                });
            }
        });

        // hasMounted is now set via the last item's onComplete callback
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gridItems, imagesReady]);

    return (
        <div ref={containerRef} className="relative w-full" style={{ height: maxColHeight || '100%' }}>
            {imagesReady && gridItems.map(item => (
                <div
                    key={item.id}
                    data-key={item.id}
                    className="absolute box-content cursor-pointer"
                    style={{ willChange: 'transform, width, height, opacity' }}
                    onClick={() => item.url && window.open(item.url, '_blank', 'noopener')}
                // onMouseEnter={e => {
                //     const el = e.currentTarget as HTMLElement;
                //     if (scaleOnHover) {
                //         animate(el, { scale: hoverScale }, { duration: 0.3, ease: easeMap['power2.out'] });
                //     }
                //     if (colorShiftOnHover) {
                //         const overlay = el.querySelector<HTMLElement>('.color-overlay');
                //         if (overlay) animate(overlay, { opacity: 0.3 }, { duration: 0.3 });
                //     }
                // }}
                // onMouseLeave={e => {
                //     const el = e.currentTarget as HTMLElement;
                //     if (scaleOnHover) {
                //         animate(el, { scale: 1 }, { duration: 0.3, ease: easeMap['power2.out'] });
                //     }
                //     if (colorShiftOnHover) {
                //         const overlay = el.querySelector<HTMLElement>('.color-overlay');
                //         if (overlay) animate(overlay, { opacity: 0 }, { duration: 0.3 });
                //     }
                // }}
                >
                    <div
                        onClick={(e) => onImageClick?.(e, Number(item.id))}
                        // className="relative w-full h-full bg-cover bg-center rounded-base shadow-overlay"
                        className="relative w-full h-full bg-cover bg-center rounded-base "
                        style={{ backgroundImage: `url("${item.img}")` }}
                    >
                        {colorShiftOnHover && (
                            <div
                                className="color-overlay absolute inset-0 rounded-base bg-linear-to-tr from-pink-500/50 to-sky-500/50 pointer-events-none"
                                style={{ opacity: 0 }}
                            />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Masonry;
