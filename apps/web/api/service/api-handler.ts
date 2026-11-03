import { AxiosError, type AxiosRequestConfig } from "axios";

import { axiosInstance } from "./axios-instance";

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data?: T;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Shared request wrapper for every api/<module>/<module>.api.ts file.
 * Unwraps the backend's { success, message, data } envelope and normalizes
 * any failure into ApiError, so individual modules never touch axios
 * directly or re-implement error handling.
 */
export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const res = await axiosInstance.request<ApiEnvelope<T>>(config);
    return res.data.data as T;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new ApiError(
        err.response?.data?.message ?? "Request failed",
        err.response?.status ?? 500,
      );
    }

    throw err;
  }
}
