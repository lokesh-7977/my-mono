import type { Context } from "hono";
import * as AdminVendorService from "../services/admin-vendor.service.js";
import ApiResponse from "../utils/api-response.js";
import { CustomError } from "../utils/custom-error.js";
import { logger } from "../utils/logger.js";

export const getPendingVendorApplications = async (
  c: Context,
): Promise<Response> => {
  try {
    const result =
      await AdminVendorService.getPendingVendorApplicationsService();

    logger.info("Pending vendor applications fetched successfully");

    return ApiResponse.success(
      "Pending vendor applications fetched successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to fetch pending vendor applications",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to fetch pending vendor applications",
      500,
    ).send(c);
  }
};

export const getVendorApplicationByUserId = async (
  c: Context,
): Promise<Response> => {
  try {
    const userId = c.req.param("userId") as string;

    const result =
      await AdminVendorService.getVendorApplicationByUserIdService(userId);

    logger.info(
      { userId },
      "Vendor application fetched successfully",
    );

    return ApiResponse.success(
      "Vendor application fetched successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to fetch vendor application",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to fetch vendor application",
      500,
    ).send(c);
  }
};
