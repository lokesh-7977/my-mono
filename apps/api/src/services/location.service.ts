import { searchLocations} from "../repositories/location.repository.js";
import type { Location } from "@mono/database";

export const searchLocationsService = async (
  search: string,
): Promise<Location[]> => {
  const locations =
    await searchLocations(search, 10);

  return locations;
};