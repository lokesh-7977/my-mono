import {prisma} from "../utils/prisma.js";

export const findMasterTrekById = async (trekId: string) => {
    console.log("trekId :",trekId );
  return prisma.masterTrek.findUnique({
    where: {
      id: trekId,
    },
  });
};

export const createActivity = async (
  id: string,
  name: string,
  description?: string,
  iconUrl?: string,
) => {
  return prisma.activity.upsert({
    where: {
      name,
    },

    update: {
      description,
      iconUrl,
    },

    create: {
      id,
      name,
      description,
      iconUrl,
      packageItineraryDayIds: [],
      trekIds: [],
      itineraryDayIds: [],
    },
  });
};

export const createMasterTrekRepo = async (data: any) => {
  return prisma.masterTrek.create({
    data,
  });
};

export const createNearbyPlace = async (
  data: {
    id: string;
    name: string;
    description?: string;
    locationId?: string;
    latitude?: number;
    longitude?: number;
    imageUrl?: string;
  },
) => {
  return prisma.nearbyPlace.create({
    data,
  });
};

export const createTrekNearbyPlace = async (
  data: {
    id: string;
    trekId: string;
    nearbyPlaceId: string;
    distanceFromTrek?: number;
    travelTime?: string;
  },
) => {
  return prisma.trekNearbyPlace.create({
    data,
  });
};

export const addTrekToActivities = async (
  activityIds: string[],
  trekId: string,
) => {
  return Promise.all(
    activityIds.map((activityId) =>
      prisma.activity.update({
        where: {
          id: activityId,
        },
        data: {
          trekIds: {
            push: trekId,
          },
        },
      }),
    ),
  );
};


export const findLocationById = async (
  locationId: string,
) => {
  return prisma.location.findUnique({
    where: {
      id: locationId,
    },
  });
};