// TEMPORARY: the public trek response embeds packages with only `createdByUserId`
// (no guide name or avatar) — see
// apps/docs/checklists/master-trek/trek-packages-listing-checklist.md. These entries
// map the four seeded demo vendors' user ids to their name and avatar.
//
// Swap-out plan: once each embedded package (or the dedicated package list endpoint)
// returns `trekLeader`, delete this file. getTrekPackageCards already prefers the real
// `trekLeader`, so nothing else changes.
export interface MockVendor {
  name: string;
  avatarUrl: string;
}

const MOCK_VENDORS_BY_USER_ID: Record<string, MockVendor> = {
  "seed-user-rishabh-singh": { name: "Rishabh Singh", avatarUrl: "https://i.pravatar.cc/100?img=12" },
  "seed-user-aditi-rao": { name: "Aditi Rao", avatarUrl: "https://i.pravatar.cc/100?img=32" },
  "seed-user-karan-mehta": { name: "Karan Mehta", avatarUrl: "https://i.pravatar.cc/100?img=14" },
  "seed-user-priya-nair": { name: "Priya Nair", avatarUrl: "https://i.pravatar.cc/100?img=47" },
};

export function getMockVendor(userId: string | undefined): MockVendor | null {
  return (userId && MOCK_VENDORS_BY_USER_ID[userId]) || null;
}
