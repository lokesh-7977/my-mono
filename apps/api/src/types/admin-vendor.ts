export type PendingVendorApplicationResponse = {
  id: string;
  userId: string;
  vendorType:
    | "TREK_LEADER"
    | "LOCAL_TRAIL_GUIDE"
    | "MOUNTAINEER"
    | "EXPERIENCE_ORGANIZER"
    | "ACTIVITY_HOST"
    | "CAMP_OPERATOR"
    | null;
  verificationStatus:
    | "DRAFT"
    | "PENDING"
    | "APPROVED"
    | "REJECTED";
  submittedAt: Date | null;
  user: {
    name: string | null;
    email: string;
    avatarUrl: string | null;
    city: string | null;
    state: string | null;
  };
};
