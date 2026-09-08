import { prisma } from "../utils/prisma.js";
import type {
  UpdateUserProfileData,
  OnboardingProfileResponse,
} from "../types/index.js";

export const updateOnboardingProfile = async (
  userId: string,
  data: UpdateUserProfileData,
): Promise<OnboardingProfileResponse> => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data,
    select: {
      id: true,
      name: true,
      phone: true,
      address: true,
      city: true,
      state: true,
      country: true,
      pinCode: true,
      languages: true,
      avatarUrl: true,
    },
  });
};

export const findUserById = async (userId: string) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
};

