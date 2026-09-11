import { prisma } from "../utils/prisma.js";

export const searchLocations = async (
  search: string,
  limit: number = 10,
) => {
  return prisma.location.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
    take: limit,
    orderBy: {
      name: "asc",
    },
  });
};


export const findLocationByIdRepo = async (
  locationId: string,
) => {
  return prisma.location.findUnique({
    where: {
      id: locationId,
    },
  });
};
