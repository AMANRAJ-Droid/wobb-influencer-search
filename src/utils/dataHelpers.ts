import instagramData from "@/assets/data/search/instagram.json";
import youtubeData from "@/assets/data/search/youtube.json";
import tiktokData from "@/assets/data/search/tiktok.json";
import type { Platform, SearchData, UserProfileSummary } from "@/types";

const platformData: Record<Platform, SearchData> = {
  instagram: instagramData as SearchData,
  youtube: youtubeData as SearchData,
  tiktok: tiktokData as SearchData,
};

export function getSearchData(platform: Platform): SearchData {
  return platformData[platform];
}

export function extractProfiles(platform: Platform): UserProfileSummary[] {
  const data = getSearchData(platform);
  return data.accounts.map((item) => item.account.user_profile);
}

/**
 * FIX: username comparison was case-sensitive (p.username.includes(query)).
 * Both username and fullname comparisons are now case-insensitive.
 */
export function filterProfiles(
  profiles: UserProfileSummary[],
  query: string
): UserProfileSummary[] {
  if (!query.trim()) return profiles;
  const q = query.toLowerCase();
  return profiles.filter(
    (p) =>
      p.username.toLowerCase().includes(q) ||
      p.fullname.toLowerCase().includes(q)
  );
}

export const PLATFORMS: Platform[] = ["instagram", "youtube", "tiktok"];

export const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
};

export function getPlatformLabel(platform: Platform): string {
  return PLATFORM_LABELS[platform];
}

export const PLATFORM_COLORS: Record<
  Platform,
  { bg: string; text: string; dot: string }
> = {
  instagram: {
    bg: "bg-pink-50 border-pink-200",
    text: "text-pink-700",
    dot: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400",
  },
  youtube: {
    bg: "bg-red-50 border-red-200",
    text: "text-red-700",
    dot: "bg-red-500",
  },
  tiktok: {
    bg: "bg-slate-50 border-slate-200",
    text: "text-slate-700",
    dot: "bg-slate-800",
  },
};
