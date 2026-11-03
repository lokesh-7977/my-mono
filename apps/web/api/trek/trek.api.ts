import { apiRequest, ApiError } from "../service/api-handler";
import { trekEndpoints } from "./trek.endpoints";
import type { Trek } from "./trek.types";

export { ApiError };

/**
 * Fetches a single master trek by slug for public display.
 * Safe to call from a Server Component during SSR — returns null instead of
 * throwing on a 404 so the page can call notFound() itself.
 */
export async function getTrekBySlug(slug: string): Promise<Trek | null> {
  try {
    return await apiRequest<Trek>({
      url: trekEndpoints.bySlug(slug).endpoint,
    });
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      return null;
    }

    throw error;
  }
}
