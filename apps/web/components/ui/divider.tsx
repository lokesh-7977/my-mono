import { cn } from "@/lib/utils"

const Divider = ({ className = '' }: { className?: string }) => (
    <div className={cn(`w-full h-[0.5px] bg-zinc-200`, className)} />
)

export default Divider;