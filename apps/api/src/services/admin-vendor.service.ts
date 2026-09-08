import { logger } from "../utils/logger.js";
import * as AdminVendorRepository from "../repositories/admin-vendor.repository.js";
import type {
  PendingVendorApplicationResponse,
  VendorApplicationDetailsResponse,
} from "../types/index.js";
import { CustomError } from "../utils/custom-error.js";

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

export const getVendorApplicationByUserIdService = async (
  userId: string,
): Promise<VendorApplicationDetailsResponse> => {
  const application =
    await AdminVendorRepository.getVendorApplicationByUserId(userId);

  if (!application) {
    logger.warn(
      { userId },
      "Vendor application not found",
    );

    throw new CustomError("Vendor application not found", 404);
  }

  logger.info(
    { userId, vendorProfileId: application.id },
    "Vendor application details fetched successfully",
  );

  return application;
};
