import { apiRequest, ApiError } from "../service/api-handler";
import { packageEndpoints } from "./package.endpoints";
import type { PackageDetail } from "./package.types";

export { ApiError };

/**
 * Fetches a single published package by id for public display.
 * Safe to call from a Server Component during SSR — returns null instead of
 * throwing on a 404 so the page can call notFound() itself.
 */
export async function getPackageById(id: string): Promise<PackageDetail | null> {
  try {
    return await apiRequest<PackageDetail>({
      url: packageEndpoints.byId(id).endpoint,
    });
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      return null;
    }

    throw error;
  }
}
