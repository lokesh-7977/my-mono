import { prisma } from "../utils/prisma.js";
import type { PendingVendorApplicationResponse } from "../types/index.js";

export const getPendingVendorApplications = async (): Promise<
  PendingVendorApplicationResponse[]
> => {
  return prisma.vendorProfile.findMany({
    where: {
      verificationStatus: "PENDING",
    },
    select: {
      id: true,
      userId: true,
      vendorType: true,
      verificationStatus: true,
      submittedAt: true,
      user: {
        select: {
          name: true,
          email: true,
          avatarUrl: true,
          city: true,
          state: true,
        },
      },
    },
    orderBy: {
      submittedAt: "asc",
    },
  });
};
