import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";

import {
  PrismaClient,
  VendorType,
} from "../src/generated/prisma/client.js";

const prisma = new PrismaClient();

const CSV_PATH = path.resolve(
  process.cwd(),
  "../../apps/docs/treks_rows (1).csv",
);

const IMAGE_BASE = "https://images.scoutripper.com/";

// Dev/demo vendors owning the seeded packages. Names/avatars match the
// guides shown in the web app's package-card mock. MOUNTAINEER is required
// to own DIFFICULT treks (see apps/api/src/utils/vendor-capability.ts).
const VENDORS: {
  key: string;
  name: string;
  avatarUrl: string;
  vendorType: VendorType;
}[] = [
  { key: "rishabh-singh", name: "Rishabh Singh", avatarUrl: "https://i.pravatar.cc/100?img=12", vendorType: "MOUNTAINEER" },
  { key: "aditi-rao", name: "Aditi Rao", avatarUrl: "https://i.pravatar.cc/100?img=32", vendorType: "TREK_LEADER" },
  { key: "karan-mehta", name: "Karan Mehta", avatarUrl: "https://i.pravatar.cc/100?img=14", vendorType: "TREK_LEADER" },
  { key: "priya-nair", name: "Priya Nair", avatarUrl: "https://i.pravatar.cc/100?img=47", vendorType: "MOUNTAINEER" },
];

// master trek slug -> CSV slug (two differ) and the vendors running it.
// A trek can be run by several vendors, each with their own Package.
const TREK_PLAN: {
  masterSlug: string;
  csvSlug: string;
  vendors: [string, string];
}[] = [
  { masterSlug: "brahmatal-trek", csvSlug: "brahmatal-trek", vendors: ["aditi-rao", "karan-mehta"] },
  { masterSlug: "kedarkantha-trek", csvSlug: "kedarkantha-trek", vendors: ["karan-mehta", "rishabh-singh"] },
  { masterSlug: "hampta-pass-trek", csvSlug: "hampta-pass-trek", vendors: ["rishabh-singh", "aditi-rao"] },
  { masterSlug: "valley-of-flowers-trek", csvSlug: "valley-of-flowers", vendors: ["priya-nair", "aditi-rao"] },
  { masterSlug: "sandakphu-trek", csvSlug: "sandakphu-phalut-trek", vendors: ["karan-mehta", "priya-nair"] },
  { masterSlug: "roopkund-trek", csvSlug: "roopkund-trek", vendors: ["rishabh-singh", "priya-nair"] },
];

// Per-vendor price spread so price filters/sorts have something to show.
const PRICE_MULTIPLIER = [1, 1.08];
const SCHEDULES_PER_PACKAGE = 3;

type CsvRow = Record<string, string>;

const clean = (value: string) =>
  value.replace(/^[\s​-‍️]+/, "").trim();

function parseJsonList<T>(raw: string | undefined): T[] {
  if (!raw || raw === "NULL") return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

const toInt = (value: string | undefined) => {
  const n = Number.parseInt(value ?? "", 10);
  return Number.isFinite(n) ? n : null;
};

const addDays = (date: Date, days: number) =>
  new Date(date.getTime() + days * 24 * 60 * 60 * 1000);

// First Saturday at least `minDaysAhead` days from now, at 06:00 UTC.
function firstSaturdayAfter(minDaysAhead: number) {
  const d = addDays(new Date(), minDaysAhead);
  d.setUTCHours(6, 0, 0, 0);
  while (d.getUTCDay() !== 6) d.setUTCDate(d.getUTCDate() + 1);
  return d;
}

async function seedVendors() {
  const ids = new Map<string, string>();

  for (const vendor of VENDORS) {
    const userId = `seed-user-${vendor.key}`;

    await prisma.user.upsert({
      where: { id: userId },
      update: { name: vendor.name, avatarUrl: vendor.avatarUrl, role: "VENDOR" },
      create: {
        id: userId,
        googleId: `seed-google-${vendor.key}`,
        email: `seed.${vendor.key}@scoutripper.test`,
        name: vendor.name,
        avatarUrl: vendor.avatarUrl,
        role: "VENDOR",
      },
    });

    await prisma.vendorProfile.upsert({
      where: { userId },
      update: {
        vendorType: vendor.vendorType,
        verificationStatus: "APPROVED",
      },
      create: {
        id: `seed-vendor-profile-${vendor.key}`,
        userId,
        vendorType: vendor.vendorType,
        experienceYears: 6,
        treksLed: 40,
        regionsWorkedIn: ["Himachal Pradesh", "Uttarakhand"],
        isAgeEligible: true,
        hasRequiredExperience: true,
        hasFirstAidCertification: true,
        hasSmartphoneAndWhatsApp: true,
        agreesToInsuranceTerms: true,
        agreesToSafetyStandards: true,
        verificationStatus: "APPROVED",
        submittedAt: new Date(),
        verifiedAt: new Date(),
      },
    });

    ids.set(vendor.key, userId);
  }

  return ids;
}

async function main() {
  const rows = parse(fs.readFileSync(CSV_PATH, "utf8"), {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  }) as CsvRow[];
  const csvBySlug = new Map(rows.map((r) => [r.slug, r]));

  const vendorIds = await seedVendors();
  console.log(`Vendors ready: ${vendorIds.size}`);

  let packageCount = 0;
  let scheduleCount = 0;

  for (const plan of TREK_PLAN) {
    const masterTrek = await prisma.masterTrek.findUnique({
      where: { slug: plan.masterSlug },
      include: { location: { select: { name: true } } },
    });

    // A package can't exist without its master trek.
    if (!masterTrek) {
      console.warn(`Skipping ${plan.masterSlug}: master trek not found`);
      continue;
    }

    const csv = csvBySlug.get(plan.csvSlug);
    if (!csv) {
      console.warn(`Skipping ${plan.masterSlug}: no CSV row for ${plan.csvSlug}`);
      continue;
    }

    const inclusions = parseJsonList<{ title: string }>(csv.include).map((i) => clean(i.title));
    const exclusions = parseJsonList<{ title: string }>(csv.exclude).map((e) => clean(e.title));
    const itinerary = parseJsonList<{ title: string; desc: string; content: string; image_id?: string }>(csv.itinerary);

    const basePrice = toInt(csv.sale_price) ?? toInt(csv.price) ?? 9999;
    const minParticipants = toInt(csv.min_people) ?? 4;
    const maxParticipants = toInt(csv.max_people) ?? 20;

    for (const [vendorIndex, vendorKey] of plan.vendors.entries()) {
      const packageId = `seed-pkg-${plan.masterSlug}-${vendorKey}`;
      const createdByUserId = vendorIds.get(vendorKey)!;
      const vendor = VENDORS.find((v) => v.key === vendorKey)!;

      // Vendors name their own packages; keep them distinct from the master trek name.
      const title =
        vendorIndex === 0
          ? `${masterTrek.name} with ${vendor.name.split(" ")[0]}`
          : `${masterTrek.location.name}: ${masterTrek.name} with Travel Leaders`;

      const packageData = {
        locationId: masterTrek.locationId,
        difficulty: masterTrek.difficulty,
        distanceKm: masterTrek.distanceKm,
        masterTrekId: masterTrek.id,
        createdByUserId,
        teamId: null,
        galleryImages: [masterTrek.coverImageUrl, ...masterTrek.galleryImages].filter(
          (url): url is string => Boolean(url),
        ),
        scheduleType: "FIXED" as const,
        inclusions,
        exclusions,
        title,
        description: masterTrek.description,
        visibility: "PUBLIC" as const,
        status: "PUBLISHED" as const,
        durationDays: masterTrek.durationDays,
      };

      await prisma.package.upsert({
        where: { id: packageId },
        update: packageData,
        create: { id: packageId, ...packageData },
      });
      packageCount++;

      for (const [index, day] of itinerary.entries()) {
        const dayData = {
          packageId,
          dayNumber: index + 1,
          title: day.desc || day.title,
          description: day.content || null,
          imageUrls: day.image_id ? [`${IMAGE_BASE}${day.image_id}`] : [],
        };

        await prisma.packageItineraryDay.upsert({
          where: { id: `${packageId}-day-${index + 1}` },
          update: dayData,
          create: { id: `${packageId}-day-${index + 1}`, ...dayData },
        });
      }

      const price = Math.round((basePrice * PRICE_MULTIPLIER[vendorIndex]!) / 50) * 50;
      const firstStart = firstSaturdayAfter(21 + vendorIndex * 7);

      for (let s = 0; s < SCHEDULES_PER_PACKAGE; s++) {
        const startDate = addDays(firstStart, s * 14);
        const scheduleData = {
          packageId,
          startDate,
          endDate: addDays(startDate, masterTrek.durationDays - 1),
          bookingStartDate: new Date(),
          bookingEndDate: addDays(startDate, -3),
          currency: "INR",
          minParticipants,
          maxParticipants,
          availableSeats: maxParticipants,
          status: "OPEN" as const,
          publishedAt: new Date(),
          price,
          adultPrice: price,
          childPrice: Math.round((price * 0.85) / 50) * 50,
          allowPartialPayment: true,
          depositType: "PERCENTAGE" as const,
          depositValue: 20,
          balanceDueDaysBeforeStart: 15,
          cancellationPolicy:
            "Free cancellation up to 30 days before departure. 50% refund up to 15 days before departure. No refund after that.",
        };

        await prisma.packageSchedule.upsert({
          where: { id: `${packageId}-schedule-${s + 1}` },
          update: scheduleData,
          create: { id: `${packageId}-schedule-${s + 1}`, ...scheduleData },
        });
        scheduleCount++;
      }

      console.log(`Seeded ${packageId} (${itinerary.length} days, price ${price})`);
    }
  }

  console.log(`Done: ${packageCount} packages, ${scheduleCount} schedules.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
