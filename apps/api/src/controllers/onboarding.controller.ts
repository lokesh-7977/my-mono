import type { Context } from "hono";
import type { UpdateOnboardingProfileInput } from "../types/index.js";
import * as OnboardingService from "../services/onboarding.service.js";
import ApiResponse from "../utils/api-response.js";
import { CustomError } from "../utils/custom-error.js";
import { logger } from "../utils/logger.js";

export const updateOnboardingProfile = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.get("userId") as string;

    const body = await c.req.json<UpdateOnboardingProfileInput>();

    const result = await OnboardingService.updateOnboardingProfileService(
      userId,
      body,
    );

    logger.info(
      { userId },
      "Onboarding profile updated successfully",
    );

    return ApiResponse.success(
      "Onboarding profile updated successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error({ error }, "Failed to update onboarding profile");

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to update onboarding profile",
      500,
    ).send(c);
  }
};

