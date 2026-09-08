import type { z } from "@hono/zod-openapi";
import type { UpdateOnboardingProfileSchema } from "../validators/onboarding.validator.js";

export type UpdateOnboardingProfileInput =
  z.infer<typeof UpdateOnboardingProfileSchema>;

export type OnboardingProfileResponse = {
  id: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  pinCode: string | null;
  languages: string[];
  avatarUrl: string | null;
};

export type UpdateUserProfileData = {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  languages: string[];
  avatarUrl?: string;
};
