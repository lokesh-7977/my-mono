import { logger } from "../utils/logger.js";
import * as OnboardingRepository from "../repositories/onboarding.repository.js";
import type {
  UpdateOnboardingProfileInput,
  OnboardingProfileResponse,
  CreateVendorProfileInput,
  VendorProfileResponse,
} from "../types/index.js";
import { CustomError } from "../utils/custom-error.js";

export const updateOnboardingProfileService = async (
  userId: string,
  data: UpdateOnboardingProfileInput,
): Promise<OnboardingProfileResponse> => {
  const user = await OnboardingRepository.findUserById(userId);

  if (!user) {
    logger.warn(
      { userId },
      "Onboarding profile update failed: user not found",
    );

    throw new CustomError("User not found", 404);
  }

  const { firstName, lastName, ...profileData } = data;

  const name = `${firstName} ${lastName}`.trim();

  const updatedUser = await OnboardingRepository.updateOnboardingProfile(
    userId,
    {
      name,
      ...profileData,
    },
  );

  logger.info(
    { userId },
    "User onboarding profile updated",
  );

  return updatedUser;
};

export const createVendorProfileService = async (
  userId: string,
  data: CreateVendorProfileInput,
): Promise<VendorProfileResponse> => {
  const existingProfile =
    await OnboardingRepository.findVendorProfileByUserId(userId);

  if (existingProfile) {
    logger.warn(
      { userId },
      "Vendor profile creation failed: vendor profile already exists",
    );

    throw new CustomError(
      "Vendor profile already exists",
      409,
    );
  }

  const profile = await OnboardingRepository.createVendorProfile(
    userId,
    data,
  );

  logger.info(
    { userId, vendorProfileId: profile.id },
    "Vendor profile created successfully",
  );

  return profile;
};


