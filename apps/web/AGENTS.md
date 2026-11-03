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

## Why SSR matters here (not just a style preference)

`apps/web` is the public, client-facing, SEO-critical surface of this product — it's the reason this app is on Next.js instead of a plain SPA. SSR/RSC isn't an implementation detail we can relax for convenience; it's the point. Concretely, that means:

- Treat "does this need to be a Client Component?" as the default question for every new piece of UI, not an afterthought. If a component only renders data and has no interactivity, it should be a Server Component, full stop.
- Anything that affects what crawlers/social previews see (page content, metadata, auth-gated content, canonical state) must be resolvable on the server at request time, not discovered via a client-side `useEffect` fetch after mount.
- A client-side-only fetch for "is this logged in" / "what does this page show" isn't just a UX flash (see below) — it also means crawlers and anything reading the raw HTML response never see the real content at all.
- Use the `seo-audit` skill when touching anything structural (routes, metadata, page content) — don't just eyeball it.

### Reference pattern: SSR-resolved auth state

We hit a concrete case of this: the navbar's Login/Logout CTA used to be resolved entirely client-side (`useEffect` → call `/api/auth/refresh` → call `/api/auth/me`), which caused a visible flash of the wrong CTA on every page load (briefly showed "Login" even for logged-in users) and meant the server-rendered HTML never reflected the real auth state.

Fixed by resolving the session **server-side**, during the request, before anything is sent to the browser:

- [lib/auth/server-session.ts](lib/auth/server-session.ts) — `server-only` module. Reads the `refreshToken` httpOnly cookie via `next/headers` and forwards it manually (as a `Cookie` header) to the backend's `GET /api/auth/session` endpoint, since a server-side `fetch` has no browser cookie jar to rely on.
- [app/layout.tsx](app/layout.tsx) — the root layout is an `async` Server Component that calls `getServerSession()` and passes the resolved `user`/`accessToken` into `AuthProvider` as initial props.
- [lib/auth/auth-context.tsx](lib/auth/auth-context.tsx) — `AuthProvider` just seeds its state from those server-resolved props; there's no client-side "restore session on mount" round trip anymore, no loading flicker, no flash of the wrong state.
- Backend-side prerequisite: the `refreshToken` cookie's `Path` had to be widened from `/api/auth/refresh` to `/` (see `apps/api/src/helper/jwt.helper.ts`) — otherwise the browser never attaches it to requests for the Next.js app's own pages, and SSR can't read it at all. A separate **non-rotating** `GET /api/auth/session` endpoint was added on the backend specifically so this check is safe to call on every single page load without churning refresh tokens (unlike the rotating `/api/auth/refresh`).

**Use this as the template** for any other "what should this page/component show based on server state" problem: resolve it in a Server Component via a `server-only` helper, pass it down as props, and keep Client Components dumb/reactive to state rather than responsible for fetching it on mount.

## API layer structure: `/api/<module>/` + `/api/service/`

All networking code lives in a dedicated `api/` directory at the same level as `app/` and `components/` — not scattered inside `lib/` or colocated with the components that happen to use it.

```
api/
  service/
    axios-instance.ts      -- the single shared axios.create() client (baseURL, withCredentials, etc.)
    api-handler.ts          -- apiRequest<T>() wrapper + ApiError + the shared ApiEnvelope<T> type.
                                Every module's *.api.ts calls through this instead of touching
                                axios directly or re-implementing error handling.
  <module>/
    <module>.endpoints.ts   -- endpoint path constants (always present)
    <module>.types.ts       -- request/response TypeScript types (always present)
    <module>.api.ts         -- the actual calls, built on api/service/ + the two files above (always present)
    <module>.services.ts    -- custom hooks wrapping the api.ts functions, ONLY if a consumer
                                actually needs one (e.g. useSomething() returning
                                { data, isLoading, error }). Skip this file entirely if nothing
                                needs it — don't create it speculatively.
```

Anything generic/cross-cutting (the axios instance, the request wrapper, shared response envelope types) belongs in `api/service/`, not duplicated per module or left inline in a module's `*.api.ts`. A module's `*.api.ts` file should contain *only* that module's endpoint-calling functions — never its own axios setup.

Concrete example — `api/auth/`:
- [api/auth/auth.endpoints.ts](api/auth/auth.endpoints.ts) — endpoint keys/paths as a single `as const` object (`authEndpoints.google.endpoint`, etc.), not scattered string literals.
- [api/auth/auth.types.ts](api/auth/auth.types.ts) — `AuthUser`, `AuthSession`, raw response shapes. (The shared `ApiEnvelope<T>` wrapper type lives in `api/service/api-handler.ts`, not here — it's not auth-specific.)
- [api/auth/auth.api.ts](api/auth/auth.api.ts) — imports `apiRequest`/`ApiError` from `api/service/api-handler.ts` and exposes the functions consumers actually call (`googleLogin`, `getSession`, etc.). No axios import, no error-handling logic of its own.
- No `auth.services.ts` — auth doesn't need one because `useAuth()` already exists as the consumption hook on `AuthProvider` (see [lib/auth/auth-context.tsx](lib/auth/auth-context.tsx)). Don't add a parallel hooks file just to match the shape; only add `services.ts` when an api module needs its *own* hook that isn't already covered by something like a context.

**Why `api/` is separate from `lib/auth/`:** `api/` holds pure, framework-agnostic networking code (no React, no Next.js APIs) — it could be dropped into any app. `lib/auth/` holds the React/Next.js-specific orchestration that *consumes* the api layer: `auth-context.tsx` (the `AuthProvider`/`useAuth()` context) and `server-session.ts` (the `server-only` SSR helper). Keep that boundary: if a file imports `react`, `next/headers`, or similar, it belongs in `lib/`, not `api/`.

We intentionally did **not** use TanStack Query naming (`queries.ts`/`useQuery`) here — this app is SSR-first (see above), so most data fetching happens in Server Components via plain `await`, not client-side query hooks. `endpoints.ts` replaces what would otherwise be a `queries.ts` file holding query-key/URL definitions, since "queries" implies a client-fetching library we're deliberately not reaching for by default.

When adding a new module, mirror this exact layout (renaming only `auth` → the new module name, e.g. `api/treks/treks.api.ts`), skip `services.ts` unless something genuinely needs a hook, and move any existing one-off `fetch`/`axios` calls into this structure rather than leaving them inline in components or pages.
