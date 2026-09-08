import { logger } from "../utils/logger.js";
import * as AdminVendorRepository from "../repositories/admin-vendor.repository.js";
import type { PendingVendorApplicationResponse } from "../types/index.js";

export const getPendingVendorApplicationsService = async (): Promise<
  PendingVendorApplicationResponse[]
> => {
  const applications =
    await AdminVendorRepository.getPendingVendorApplications();

  logger.info(
    { count: applications.length },
    "Pending vendor applications fetched successfully",
  );

  return applications;
};
