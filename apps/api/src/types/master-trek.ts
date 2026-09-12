import {CreateMasterTrekSchema,UpdateMasterTrekSchema} from "../validators/master-trek.validator.js";
import {Prisma} from "@mono/database";
import z from "zod";

export type CreateMasterTrekRequest = z.infer<
  typeof CreateMasterTrekSchema
>;

export const masterTrekAdminInclude = {
  location: true,
  createdBy: true,
  activities: true,

  routes: {
    include: {
      itineraryDays: {
        include: {
          activities: true,
        },
      },
    },
  },

  nearbyPlaces: {
    include: {
      nearbyPlace: {
        include: {
          location: true,
        },
      },
    },
  },

  packages: true,
} satisfies Prisma.MasterTrekInclude;

export type UpdateMasterTrekRequest = z.infer<
  typeof UpdateMasterTrekSchema
>;

export type MasterTrekByIdResponse =
  Prisma.MasterTrekGetPayload<{
    include: typeof masterTrekAdminInclude;
  }>;

export type MasterTrekListItemResponse =
  Prisma.MasterTrekGetPayload<{
    include: {
      location: true;
    };
  }>;

export type GetAllMasterTreksResponse = {
  treks: MasterTrekListItemResponse[];
  nextCursor: string | null;
  hasNextPage: boolean;
};