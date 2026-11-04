import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { PrismaClient } from "./src/generated/prisma/client.js";

const prisma = new PrismaClient();

const CDN_BASE = "https://images.scoutripper.com";

interface RawTrekRow {
  title: string;
  slug: string;
  banner_image: string;
  feature_images: string;
  gallery: string;
  itinerary: string;
  faqs: string;
}

interface RawItineraryDay {
  desc: string; // short title, e.g. "Drive from Rishikesh to Lohajung"
  title: string; // "Day 1" / "Day 01"
  content: string; // long description
  image_id: string; // CDN-relative path, or sometimes a bare numeric id (skip those)
}

interface RawFaq {
  title: string;
  content: string;
}

// Maps our seeded slug -> the raw data file written by extract-images.ts
const SLUG_MAP: Record<string, string> = {
  "kedarkantha-trek": "kedarkantha.json",
  "valley-of-flowers-trek": "valley-of-flowers.json",
  "hampta-pass-trek": "hampta-pass.json",
  "roopkund-trek": "roopkund.json",
  "brahmatal-trek": "brahmatal.json",
  "sandakphu-trek": "sandakphu.json",
};

function cdnUrl(relativePath: string): string {
  return `${CDN_BASE}/${relativePath}`;
}

function isImagePath(value: string | undefined): value is string {
  return Boolean(value && value.includes("/"));
}

function parseDayNumber(label: string, fallback: number): number {
  const match = label.match(/\d+/);
  return match ? Number(match[0]) : fallback;
}

const MIN_GALLERY_IMAGES = 12;
const MAX_GALLERY_IMAGES = 15;

async function main() {
  const dataDir = path.join(process.cwd(), "trek-raw-data");

  // First pass: load every trek's raw row and build a shared pool of all
  // known-good image paths across all 6 treks, for padding out thin ones.
  const rawRows = new Map<string, RawTrekRow>();
  const ownImagePaths = new Map<string, string[]>();
  const allImagePathsPool = new Set<string>();

  for (const [ourSlug, fileName] of Object.entries(SLUG_MAP)) {
    const filePath = path.join(dataDir, fileName);
    if (!fs.existsSync(filePath)) {
      console.warn(`No raw data file found for ${ourSlug} (${filePath}), skipping`);
      continue;
    }

    const raw: RawTrekRow = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    rawRows.set(ourSlug, raw);

    const featureImages: string[] = JSON.parse(raw.feature_images || "[]");
    const galleryImages: string[] = JSON.parse(raw.gallery || "[]");
    const own = Array.from(
      new Set([raw.banner_image, ...featureImages, ...galleryImages].filter(Boolean)),
    );
    ownImagePaths.set(ourSlug, own);
    own.forEach((p) => allImagePathsPool.add(p));
  }

  for (const [ourSlug, raw] of rawRows) {
    const trek = await prisma.masterTrek.findUnique({ where: { slug: ourSlug } });
    if (!trek) {
      console.warn(`MasterTrek with slug ${ourSlug} not found in DB, skipping`);
      continue;
    }

    // --- Gallery images: own banner + feature_images + gallery first; if a
    // trek has fewer than MIN_GALLERY_IMAGES real images (staging data gap),
    // pad with other treks' real images for visual variety. Clearly a
    // staging-only shortcut — swap for per-trek shoots before prod. ---
    const own = ownImagePaths.get(ourSlug) ?? [];
    const padding = Array.from(allImagePathsPool).filter((p) => !own.includes(p));

    const uniqueImagePaths = [...own];
    let padIndex = 0;
    while (uniqueImagePaths.length < MIN_GALLERY_IMAGES && padIndex < padding.length) {
      uniqueImagePaths.push(padding[padIndex]!);
      padIndex += 1;
    }

    const galleryUrls = uniqueImagePaths.slice(0, MAX_GALLERY_IMAGES).map(cdnUrl);

    await prisma.masterTrek.update({
      where: { id: trek.id },
      data: {
        coverImageUrl: cdnUrl(raw.banner_image),
        galleryImages: galleryUrls,
      },
    });

    console.log(`${ourSlug}: set ${galleryUrls.length} gallery images`);

    // --- Itinerary: one "Standard Route" with real day-by-day data ---
    const rawDays: RawItineraryDay[] = JSON.parse(raw.itinerary || "[]");

    await prisma.trekRoute.deleteMany({ where: { masterTrekId: trek.id } });

    if (rawDays.length > 0) {
      const route = await prisma.trekRoute.create({
        data: {
          id: randomUUID(),
          masterTrekId: trek.id,
          name: "Standard Route",
          isDefault: true,
          isPopular: true,
        },
      });

      for (const [index, day] of rawDays.entries()) {
        await prisma.trekItineraryDay.create({
          data: {
            id: randomUUID(),
            routeId: route.id,
            dayNumber: parseDayNumber(day.title, index + 1),
            title: day.desc,
            description: day.content,
            imageUrls: isImagePath(day.image_id) ? [cdnUrl(day.image_id)] : [],
          },
        });
      }

      console.log(`${ourSlug}: seeded ${rawDays.length} itinerary days`);
    }

    // --- FAQs: cap at 8 most relevant (first 8 in source order) ---
    const rawFaqs: RawFaq[] = JSON.parse(raw.faqs || "[]").slice(0, 8);

    await prisma.masterTrekFaq.deleteMany({ where: { masterTrekId: trek.id } });

    for (const [index, faq] of rawFaqs.entries()) {
      await prisma.masterTrekFaq.create({
        data: {
          id: randomUUID(),
          masterTrekId: trek.id,
          question: faq.title,
          answer: faq.content,
          order: index,
        },
      });
    }

    console.log(`${ourSlug}: seeded ${rawFaqs.length} FAQs`);
  }

  console.log("\nDone enriching master treks with legacy images/itinerary/FAQs.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
