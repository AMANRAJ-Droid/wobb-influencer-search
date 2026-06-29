import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Check, Users, TrendingUp } from "lucide-react";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { formatFollowers, formatEngagementRate } from "@/utils/formatters";
import { useListStore } from "@/store/listStore";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
}

export const ProfileCard = memo(function ProfileCard({
  profile,
  platform,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const addToList = useListStore((s) => s.addToList);
  const removeFromList = useListStore((s) => s.removeFromList);
  const isInList = useListStore((s) => s.isInList);

  const inList = isInList(profile.user_id);

  const handleCardClick = useCallback(() => {
    navigate(`/profile/${profile.username}?platform=${platform}`);
  }, [navigate, profile.username, platform]);

  const handleListToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (inList) {
        removeFromList(profile.user_id);
      } else {
        addToList(profile, platform);
      }
    },
    [inList, addToList, removeFromList, profile, platform]
  );

  return (
    <div
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
      className="group flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-gray-100 hover:border-violet-200 hover:shadow-md transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
      aria-label={`View profile of ${profile.fullname}`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={profile.picture}
          alt={`${profile.fullname} avatar`}
          className="w-12 h-12 rounded-full object-cover bg-gray-100"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullname)}&background=random`;
          }}
        />
        {profile.is_verified && (
          <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center">
            <VerifiedBadge verified />
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 truncate">
          <span className="font-semibold text-sm text-gray-900 truncate">
            @{profile.username}
          </span>
        </div>
        <p className="text-xs text-gray-500 truncate">{profile.fullname}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Users size={11} />
            {formatFollowers(profile.followers)}
          </span>
          {profile.engagement_rate !== undefined && (
            <span className="flex items-center gap-1 text-xs text-emerald-600">
              <TrendingUp size={11} />
              {formatEngagementRate(profile.engagement_rate)}
            </span>
          )}
        </div>
      </div>

      {/* Add to list button */}
      <button
        onClick={handleListToggle}
        aria-label={inList ? "Remove from list" : "Add to list"}
        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-150 ${
          inList
            ? "bg-violet-50 border-violet-200 text-violet-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
            : "bg-white border-gray-200 text-gray-600 hover:bg-violet-600 hover:border-violet-600 hover:text-white group-hover:border-violet-300"
        }`}
      >
        {inList ? <Check size={12} /> : <Plus size={12} />}
        {inList ? "Added" : "Add"}
      </button>
    </div>
  );
});
