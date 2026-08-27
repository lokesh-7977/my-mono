import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

interface ApiResponseData<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data?: T;
}

class ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    statusCode: number;

    constructor(success: boolean, message: string, statusCode: number, data?: T) {
        this.success = success;
        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
    }

    static success<T>(
        message: string,
        data?: T,
        statusCode = 200,
    ): ApiResponse<T> {
        return new ApiResponse(true, message, statusCode, data);
    }

    static error(message: string, statusCode = 500): ApiResponse<null> {
        return new ApiResponse(false, message, statusCode, null);
    }

    send(c: Context): Response {
        return c.json(this.toJSON(), this.statusCode as ContentfulStatusCode);
    }

    toJSON(): ApiResponseData<T> {
        return {
            statusCode: this.statusCode,
            success: this.success,
            message: this.message,
            ...(this.data !== undefined && { data: this.data }),
        };
    }
}

export default ApiResponse;