import { useSyncExternalStore, useCallback } from "react";

export function useIsMobile(breakpoint: number = 768) {
    const subscribe = useCallback((callback: () => void) => {
        const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
        mql.addEventListener("change", callback)
        return () => mql.removeEventListener("change", callback)
    }, [breakpoint])

    const getSnapshot = useCallback(() => {
        return window.innerWidth < breakpoint
    }, [breakpoint])

    const getServerSnapshot = () => false

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
