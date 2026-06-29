import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";
import { SearchX } from "lucide-react";

interface ProfileGridProps {
  profiles: UserProfileSummary[];
  platform: Platform;
}

export function ProfileGrid({ profiles, platform }: ProfileGridProps) {
  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <SearchX size={40} className="text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">No creators found</p>
        <p className="text-sm text-gray-400 mt-1">
          Try a different name or username
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.user_id}
          profile={profile}
          platform={platform}
        />
      ))}
    </div>
  );
}
