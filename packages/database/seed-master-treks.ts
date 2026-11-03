import "dotenv/config";
import { randomUUID } from "node:crypto";
import { PrismaClient } from "./src/generated/prisma/client.js";

const prisma = new PrismaClient();

async function main() {
  const creator = await prisma.user.findFirst();
  if (!creator) {
    throw new Error(
      "No user found in the database. Create a user first (e.g. log in once via Google) before seeding treks.",
    );
  }

  const treks = [
    {
      name: "Kedarkantha Trek",
      slug: "kedarkantha-trek",
      shortDescription: "A classic winter summit trek in Uttarakhand with panoramic Himalayan views.",
      description:
        "Kedarkantha is one of the most popular winter treks in India, known for its snow-laden trails, pine and oak forests, and a 360-degree summit view of peaks like Swargarohini, Bandarpoonch, and Black Peak. Ideal for beginners wanting a taste of snow trekking.",
      tagline: "India's favorite snow trek",
      difficulty: "EASY" as const,
      durationDays: 6,
      maxAltitude: 3800,
      distanceKm: 20,
      baseLocation: "Sankri",
      state: "Uttarakhand",
      bestSeason: "December to April",
      beginnerFriendly: true,
      overview: "A gentle climb through snow-covered meadows and forests to a stunning summit.",
      howToReach: "Drive or take a shared cab from Dehradun to Sankri (approx. 10 hours).",
      fitnessInfo: "Basic fitness with 5km jogging capability is sufficient.",
      coverImageUrl: "https://images.unsplash.com/photo-1580130857209-7e7c395fdb52",
      status: "ACTIVE" as const,
    },
    {
      name: "Valley of Flowers Trek",
      slug: "valley-of-flowers-trek",
      shortDescription: "A UNESCO World Heritage trek through a vibrant alpine valley of flowers.",
      description:
        "The Valley of Flowers National Park bursts into color each monsoon, hosting hundreds of species of wildflowers against a backdrop of snow-capped peaks. Often combined with a visit to the Hemkund Sahib Gurudwara.",
      tagline: "Nature's own flower garden",
      difficulty: "MEDIUM" as const,
      durationDays: 7,
      maxAltitude: 4300,
      distanceKm: 38,
      baseLocation: "Govindghat",
      state: "Uttarakhand",
      bestSeason: "July to September",
      beginnerFriendly: true,
      overview: "A moderate trek along the Pushpawati river into a UNESCO-listed valley.",
      coverImageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      status: "ACTIVE" as const,
    },
    {
      name: "Hampta Pass Trek",
      slug: "hampta-pass-trek",
      shortDescription: "A dramatic crossover trek from the green Kullu valley to the arid Lahaul valley.",
      description:
        "Hampta Pass is famous for its stark landscape transition — lush green meadows on one side and the barren, moon-like terrain of Lahaul on the other. A short but visually dramatic trek often paired with a trip to Chandratal Lake.",
      tagline: "Two worlds, one pass",
      difficulty: "MEDIUM" as const,
      durationDays: 5,
      maxAltitude: 4270,
      distanceKm: 26,
      baseLocation: "Jobra (near Manali)",
      state: "Himachal Pradesh",
      bestSeason: "June to September",
      beginnerFriendly: false,
      overview: "A crossover trek through two contrasting valleys via a high mountain pass.",
      coverImageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23",
      status: "ACTIVE" as const,
    },
    {
      name: "Roopkund Trek",
      slug: "roopkund-trek",
      shortDescription: "A mysterious glacial lake trek famous for its ancient human skeletal remains.",
      description:
        "Roopkund, also known as the 'Mystery Lake' or 'Skeleton Lake', sits at the base of Trisul massif and is famed for the centuries-old human skeletons found in and around it. The trek passes through Bedni Bugyal, one of the largest meadows in Asia.",
      tagline: "The mystery lake",
      difficulty: "HARD" as const,
      durationDays: 8,
      maxAltitude: 5029,
      distanceKm: 53,
      baseLocation: "Lohajung",
      state: "Uttarakhand",
      bestSeason: "May to June, September to October",
      beginnerFriendly: false,
      overview: "A long high-altitude trek through alpine meadows to a glacial lake steeped in legend.",
      coverImageUrl: "https://images.unsplash.com/photo-1544198365-f5d60b6d8190",
      status: "ACTIVE" as const,
    },
    {
      name: "Brahmatal Trek",
      slug: "brahmatal-trek",
      shortDescription: "A winter trek offering close-up views of Mt. Trishul and Mt. Nanda Ghunti.",
      description:
        "Brahmatal is a serene winter trek through snow-laden oak and rhododendron forests, leading to a frozen high-altitude lake believed to be the meditation spot of Lord Brahma. Offers some of the closest views of Trishul and Nanda Ghunti.",
      tagline: "Where legends meet snow",
      difficulty: "EASY" as const,
      durationDays: 6,
      maxAltitude: 3734,
      distanceKm: 22,
      baseLocation: "Lohajung",
      state: "Uttarakhand",
      bestSeason: "December to March",
      beginnerFriendly: true,
      overview: "A beginner-friendly winter trek to a frozen lake with close mountain views.",
      coverImageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306",
      status: "ACTIVE" as const,
    },
    {
      name: "Sandakphu Trek",
      slug: "sandakphu-trek",
      shortDescription: "The highest point in West Bengal, with views of four of the world's five highest peaks.",
      description:
        "Sandakphu offers a unique vantage point from which Everest, Kanchenjunga, Lhotse, and Makalu can all be seen in a single frame at sunrise. The trail winds through rhododendron forests and charming Nepali-influenced villages.",
      tagline: "Sleeping Buddha sunrise",
      difficulty: "MEDIUM" as const,
      durationDays: 6,
      maxAltitude: 3636,
      distanceKm: 32,
      baseLocation: "Manebhanjan",
      state: "West Bengal",
      bestSeason: "October to December, March to May",
      beginnerFriendly: true,
      overview: "A ridge-line trek to the highest peak of West Bengal with views of four 8000m giants.",
      coverImageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa",
      status: "ACTIVE" as const,
    },
  ];

  for (const trek of treks) {
    const created = await prisma.masterTrek.upsert({
      where: { slug: trek.slug },
      update: {},
      create: {
        id: randomUUID(),
        createdById: creator.id,
        ...trek,
      },
    });
    console.log(`Seeded: ${created.name} (${created.slug})`);
  }

  console.log(`\nDone. Seeded ${treks.length} master treks using creator ${creator.email}.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
