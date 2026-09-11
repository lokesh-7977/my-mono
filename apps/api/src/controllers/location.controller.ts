import { type Context } from "hono";

import * as LocationService from "../services/location.service.js";
import ApiResponse from "../utils/api-response.js";
import { CustomError } from "../utils/custom-error.js";
import { logger } from "../utils/logger.js";


export const searchLocations = async (
  c: Context,
): Promise<Response> => {
  try {
    const search =
      c.req.query("search")?.trim() || "";

    if (!search) {
      logger.warn(
        "Location search attempted without search query",
      );

      return ApiResponse.error(
        "Search query is required",
        400,
      ).send(c);
    }

    const result =
      await LocationService.searchLocationsService(
        search,
      );

    logger.info(
      { search, count: result.length },
      "Locations fetched successfully",
    );

    return ApiResponse.success(
      "Locations fetched successfully",
      result,
      200,
    ).send(c);
  } catch (error) {
    logger.error(
      { error },
      "Failed to fetch locations",
    );

    if (error instanceof CustomError) {
      return ApiResponse.error(
        error.message,
        error.statusCode,
      ).send(c);
    }

    return ApiResponse.error(
      "Failed to fetch locations",
      500,
    ).send(c);
  }
};