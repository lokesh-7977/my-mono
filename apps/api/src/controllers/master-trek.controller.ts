import type { Context } from "hono";
import ApiResponse from "../utils/api-response.js";
import { CustomError } from "../utils/custom-error.js";
import * as MasterTrekService from "../services/master-trek.service.js"
import { logger } from "../utils/logger.js";
import type { CreateMasterTrekRequest } from "../types/index.js";


export const createMasterTrek = async (
    c: Context,
): Promise<Response> => {
    try {
        const body = await c.req.json<CreateMasterTrekRequest>();

        const userId = c.get("userId");

        const result = await MasterTrekService.createMasterTrek(
            body,
            userId,
        );

        logger.info(
            { trekId: result.id, userId },
            "Master trek created successfully",
        );

        return ApiResponse.success(
            "Trek created successfully",
            result,
            201,
        ).send(c);
    } catch (error) {
        logger.error(
            { error },
            "Failed to create master trek",
        );

        if (error instanceof CustomError) {
            return ApiResponse.error(
                error.message,
                error.statusCode,
            ).send(c);
        }

        return ApiResponse.error(
            "Failed to create trek",
            500,
        ).send(c);
    }
};