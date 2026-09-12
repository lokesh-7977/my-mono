import {
    findLocationById,
    createActivity,
    createMasterTrekRepo,
    createNearbyPlace,
    createTrekNearbyPlace,
    addTrekToActivities,
} from "../repositories/master-trek.repository.js";

import type {CreateMasterTrekRequest} from "../types/index.js";
import {CustomError} from "../utils/custom-error.js";
import type { MasterTrek } from "@mono/database";
import {  uuidv7 } from "uuidv7";


export const createMasterTrek = async (
  data: CreateMasterTrekRequest,
  userId: string,
): Promise<MasterTrek> => {
  try {
    const location = await findLocationById(
      data.locationId,
    );

    if (!location) {
      throw new CustomError(
        "Invalid trek location",
        400,
      );
    }

    const trekActivities = await Promise.all(
      data.activities.map((activity) =>
        createActivity(
          uuidv7(),
          activity.name,
          activity.description,
          activity.iconUrl,
        ),
      ),
    );

    const trekActivityIds = trekActivities.map(
      (activity) => activity.id,
    );

    const routes = await Promise.all(
      data.routes.map(async (route) => {
        const itineraryDays = await Promise.all(
          route.itineraryDays.map(
            async (day) => {
              const activities =
                await Promise.all(
                  day.activities.map(
                    (activity) =>
                      createActivity(
                        uuidv7(),
                        activity.name,
                        activity.description,
                        activity.iconUrl,
                      ),
                  ),
                );

              return {
                id: uuidv7(),
                dayNumber: day.dayNumber,
                title: day.title,
                description:
                  day.description,
                startLocation:
                  day.startLocation,
                endLocation:
                  day.endLocation,
                distanceKm:
                  day.distanceKm,
                duration: day.duration,
                altitude: day.altitude,
                activityIds:
                  activities.map(
                    (activity) =>
                      activity.id,
                  ),
              };
            },
          ),
        );

        return {
          id: uuidv7(),
          name: route.name,
          description:
            route.description,
          distanceKm:
            route.distanceKm,
          difficulty:
            route.difficulty,
          elevationGain:
            route.elevationGain,
          ascentTime:
            route.ascentTime,
          descentTime:
            route.descentTime,
          startPoint:
            route.startPoint,
          endPoint:
            route.endPoint,
          isPopular:
            route.isPopular,
          isDefault:
            route.isDefault,

          itineraryDays: {
            create: itineraryDays,
          },
        };
      }),
    );

    const trek =
      await createMasterTrekRepo({
        id: uuidv7(),

        name: data.name,

        slug: data.name
          .toLowerCase()
          .trim()
          .replace(
            /[^a-z0-9]+/g,
            "-",
          )
          .replace(
            /^-|-$/g,
            "",
          ),

        shortDescription:
          data.shortDescription,
        description:
          data.description,
        tagline: data.tagline,

        difficulty:
          data.difficulty,
        durationDays:
          data.durationDays,
        maxAltitude:
          data.maxAltitude,
        distanceKm:
          data.distanceKm,
        distinctRoutes:
          data.distinctRoutes,

        locationId:
          data.locationId,

        latitude:
          data.latitude,
        longitude:
          data.longitude,

        bestSeason:
          data.bestSeason,
        beginnerFriendly:
          data.beginnerFriendly,

        overview:
          data.overview,
        howToReach:
          data.howToReach,
        fitnessInfo:
          data.fitnessInfo,
        safetyInfo:
          data.safetyInfo,
        permitInfo:
          data.permitInfo,
        sustainabilityInfo:
          data.sustainabilityInfo,

        coverImageUrl:
          data.coverImageUrl,
        videoUrl:
          data.videoUrl,
        galleryImages:
          data.galleryImages,

        status:
          data.status,

        createdById:
          userId,

        activityIds:
          trekActivityIds,

        routes: {
          create: routes,
        },
      });

    await addTrekToActivities(
      trekActivityIds,
      trek.id,
    );

    for (const place of data.nearbyPlaces) {
      const nearbyPlace =
        await createNearbyPlace({
          id: uuidv7(),
          name: place.name,
          description:
            place.description,
          locationId:
            place.locationId,
          latitude:
            place.latitude,
          longitude:
            place.longitude,
          imageUrl:
            place.imageUrl,
        });

      await createTrekNearbyPlace({
        id: uuidv7(),
        trekId: trek.id,
        nearbyPlaceId:
          nearbyPlace.id,
        distanceFromTrek:
          place.distanceFromTrek,
        travelTime:
          place.travelTime,
      });
    }

    return trek;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }

    throw new CustomError(
      "Failed to create trek",
      500,
    );
  }
};