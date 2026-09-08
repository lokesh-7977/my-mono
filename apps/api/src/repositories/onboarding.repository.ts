import { prisma } from "../utils/prisma.js";
import { uuidv7 } from "uuidv7";
import type {
  UpdateUserProfileData,
  OnboardingProfileResponse,
  CreateVendorProfileInput,
  VendorProfileResponse,
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

export const createVendorProfile = async (
  userId: string,
  data: CreateVendorProfileInput,
): Promise<VendorProfileResponse> => {
  return prisma.vendorProfile.create({
    data: {
      id: uuidv7(),
      userId,
      vendorType: data.vendorType,
    },
    select: {
      id: true,
      userId: true,
      vendorType: true,
      verificationStatus: true,
    },
  });
};

export const findVendorProfileByUserId = async (userId: string) => {
  return prisma.vendorProfile.findUnique({
    where: {
      userId,
    },
  });
};


