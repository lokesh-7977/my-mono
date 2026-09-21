<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know (Next 15+/16)

This version follows the latest Next.js App Router conventions with a heavy emphasis on **Server Components (SSR)** by default:
- **SSR-First**: Use Server Components for all structural and data-fetching logic. Mark components with `"use client"` only for interactivity, state, or animations. This is mandatory for SEO and Performance.
- **Performance & SEO Excellence**: Prioritize Core Web Vitals (LCP, CLS, INP). Use `next/image` with proper priority/loading strategies. Perform regular SEO audits using the `seo-audit` skill.
- **Motion Convention**: Use the `motion` package ([motion.dev](https://motion.dev/)) for animations. Ensure the initial state is SSR-friendly to prevent layout shifts.
- **Tailwind CSS v4**: Follow the CSS-first theme configuration in `globals.css` using `@theme inline`.
- **Responsive Strategies**: Prioritize desktop layouts while ensuring flexible, stacked, or hidden components on mobile viewports.

Heed deprecation notices and read the `node_modules/next/dist/docs/` for breaking changes.
<!-- END:nextjs-agent-rules -->
