import { cn } from "@repo/ui/lib/utils";

export default function StickySidebar({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("flex flex-col gap-6 lg:sticky lg:top-10", className)}>
      {children}
    </div>
  );
}
