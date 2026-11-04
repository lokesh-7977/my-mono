# Weather Conditions modal — backend checklist

**Status:** Proposal, pending backend review. Frontend is unblocked by a temporary mock data file so UI work isn't waiting on this (see "Frontend workaround" below).

**Audience:** Backend team, before building anything for the "Check Weather" feature.

---

## 1. Current situation

`apps/api` has **no weather integration of any kind** today — no route, no external API client, no stored weather data. What already exists on `MasterTrek` that's relevant:

```prisma
model MasterTrek {
  // ...
  latitude    Float?
  longitude   Float?
  bestSeason  String?   // free text, e.g. "December to April" — already populated on all 6 seeded treks
}
```

So coordinates exist (a hard requirement for any weather API call), but there's nothing structured for monthly climate data, risk scoring, or live conditions.

## 2. The core design decision: this feature is two different kinds of data, not one

The requested UI (see reference screenshot in the original conversation) shows, in one card:

| Element | What it actually is | How often it changes |
|---|---|---|
| "Ideal window: late May–June, Sept–Oct" | Historical climate pattern | Effectively never |
| Monthly bar chart (avg temps) | Multi-year historical average | Effectively never |
| "Snow Risk: High" / "Rain Risk: Moderate" | A derived score from historical data | Effectively never |
| "Current: 18°C Sunny" | Live conditions right now | Every few minutes |

**Treating all four as "fetch live from a weather API on every click" is wasteful and slow.** The first three are historical averages — the same answer today as in six months. Recomputing them from a historical-archive API on every page view burns an external API call (and adds latency) to re-derive a number that hasn't changed.

**Recommendation: split into two concerns.**

1. **Climate profile** (ideal window, monthly chart, risk scores) — **precomputed once, stored, served as a plain DB read.** No external API call at request time at all.
2. **Live snapshot** (current temp/conditions) — the only part that's genuinely time-sensitive. This is the one piece that should actually be "fetched on click," and even then, cached server-side for ~30–60 minutes so concurrent users checking the same trek don't each trigger a separate upstream call.

## 3. Proposed data model

Following the same reasoning as the `howToReach` proposal (see `apps/docs/how-to-reach-data-structure-checklist.md`): this data has no independent existence outside its parent trek, is always read/written together with it, and is a natural fit for a MongoDB composite type rather than a separate collection + relation.

```prisma
type MonthlyClimate {
  month        Int      // 1-12
  avgHighC     Float
  avgLowC      Float
  precipMm     Float?   // monthly average precipitation, for rain-risk display if needed
}

enum WeatherRiskLevel {
  LOW
  MODERATE
  HIGH
}

type ClimateProfile {
  idealWindow   String            // e.g. "late May to June and September to October" — human-written or templated from the computed data, backend's call
  snowRisk      WeatherRiskLevel
  rainRisk      WeatherRiskLevel
  monthly       MonthlyClimate[]
  computedAt    DateTime          // so staleness is visible/auditable
  sourceYears   Int[]             // which years' historical data this was computed from, for transparency
}

model MasterTrek {
  // ...
  climateProfile ClimateProfile?   // null = not yet computed for this trek
}
```

The live snapshot is **not** stored on `MasterTrek` — it's fetched fresh (subject to the cache below) and never persisted long-term, since persisting "current weather" as trek data makes no sense once it's stale.

## 4. API surface

```
GET /api/master-trek/public/slug/{slug}/weather
```

Response:

```ts
{
  climate: {
    idealWindow: string;
    snowRisk: "LOW" | "MODERATE" | "HIGH";
    rainRisk: "LOW" | "MODERATE" | "HIGH";
    monthly: { month: number; avgHighC: number; avgLowC: number }[];
  } | null;   // null if this trek's climate profile hasn't been computed yet
  current: {
    temperatureC: number;
    condition: string;      // e.g. "Sunny", "Light Snow" — map from provider's weather code
    fetchedAt: string;      // ISO timestamp, so frontend can show "as of HH:MM" if the cache is serving a slightly stale value
  } | null;   // null if the live provider call failed — see error handling below
}
```

Triggered only when the user opens the modal (lazy — matches the "don't fetch what might be unused" instinct this started from). `climate` is a cheap DB read; `current` is the only part that calls out to a live provider, subject to caching.

**Recomputing the climate profile** (admin-triggered, not user-triggered):

```
POST /api/master-trek/{id}/climate-profile/recompute
```

Admin-only. Calls the historical-archive API for that trek's coordinates, computes monthly averages + risk scores, writes the result to `climateProfile`. Run once when a trek is created/coordinates are set, and re-run if coordinates change. An annual cron as a backstop is a reasonable nice-to-have, not a launch blocker.

## 5. Provider: Open-Meteo

- **Historical Weather API** (`archive-api.open-meteo.com`) for the one-time/admin-triggered climate-profile computation — reanalysis data back to 1940, no API key required.
- **Weather Forecast API** (`api.open-meteo.com`) for the live snapshot — also no API key required.
- **⚠️ License check needed before this goes live:** Open-Meteo's free hosted API is licensed for **non-commercial use**. If Scoutripper is a commercial product, confirm whether that's acceptable or whether their commercial tier (or an alternative provider — Meteostat, WeatherAPI, Visual Crossing) is needed. This is a config/provider swap, not a redesign, as long as the provider call stays isolated in one backend module — but it needs a decision before shipping, not after.

## 6. Open questions for backend to decide

1. **Risk-scoring formula.** E.g. "% of historical days in that month with measurable precipitation" → bucketed into Low/Moderate/High. Needs an actual threshold decision, not just "high/moderate/low" vibes.
2. **Live-snapshot cache location.** In-memory is fine for a single instance but won't be shared across horizontally-scaled API instances — if `apps/api` ever runs more than one instance, this needs a shared cache (Mongo collection with a TTL index, or Redis if that's already in the stack). Not a blocker for a first version, but worth deciding now rather than discovering it in production.
3. **Error handling when the provider is down or rate-limited.** The endpoint should return `current: null` gracefully (frontend already has a "weather unavailable" state planned — see mockup), not 500.
4. **Who/what triggers the first `climate-profile/recompute` for each of the 6 already-seeded treks?** They currently have `climateProfile: null`. Needs either a one-off backfill script (I can write this once the schema lands, mirroring how I backfilled images/itinerary/FAQs/howToReach) or an admin UI action.
5. **Elevation/multi-point consideration (lower priority):** a trek's base village and its highest pass can have meaningfully different weather. Fine to use a single trek-level coordinate for v1 — flagging so it's a deliberate "good enough for now" call, not an oversight, if routes/itinerary days later want per-point conditions.

## 7. Frontend workaround (temporary, until this ships)

The "Check Weather" modal is wired to a local mock file, not a real API call, exactly matching the pattern already used for `howToReach`:

- `apps/web/lib/weather-mock.ts` — hardcoded data matching the response shape in §4.
- `WeatherModal` component expects exactly that shape, so swapping the mock for a real `getTrekWeather(slug)` API call (fetched on click, not on page load) is a contained change once this endpoint exists — no component redesign needed.
