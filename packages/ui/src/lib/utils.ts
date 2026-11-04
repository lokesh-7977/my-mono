import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Tokens from packages/tailwind-config/shared-styles.css. tailwind-merge reads an
// unknown text-* class as a colour, so without this cn("text-caption text-primary")
// would drop the font size.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["micro", "caption", "meta", "body", "lead", "heading", "title", "title-lg", "display", "hero"],
      radius: ["base", "hero"],
      shadow: ["raised-sm", "raised", "raised-strong", "soft", "float", "overlay"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
