import { useEffect, useState, useCallback } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  TrendingUp,
  FileText,
  MessageCircle,
  Play,
  Heart,
  Plus,
  Check,
  ExternalLink,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile, ProfileDetailResponse, Platform } from "@/types";
import {
  formatFollowers,
  formatEngagementRate,
  formatEngagements,
} from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { useListStore } from "@/store/listStore";
import { getPlatformLabel } from "@/utils/dataHelpers";

// Stat card component
function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center gap-1.5 text-gray-400 mb-1">
        <Icon size={13} />
        <span className="text-xs">{label}</span>
      </div>
      <div className="text-lg font-bold text-gray-900">{value}</div>
    </div>
  );
}

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = (searchParams.get("platform") ?? "instagram") as Platform;

  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(null);
  const [loaded, setLoaded] = useState(false);

  const addToList = useListStore((s) => s.addToList);
  const removeFromList = useListStore((s) => s.removeFromList);
  const isInList = useListStore((s) => s.isInList);

  useEffect(() => {
    if (!username) return;
    setLoaded(false);
    loadProfileByUsername(username).then((data) => {
      setProfileData(data);
      setLoaded(true);
    });
  }, [username]);

  const handleListToggle = useCallback(() => {
    if (!profileData) return;
    const { user_profile } = profileData.data;
    if (isInList(user_profile.user_id)) {
      removeFromList(user_profile.user_id);
    } else {
      addToList(user_profile, platform);
    }
  }, [profileData, isInList, addToList, removeFromList, platform]);

  if (!username) {
    return (
      <Layout>
        <p className="text-red-500">Invalid profile URL.</p>
        <Link to="/" className="text-violet-600 text-sm mt-2 inline-block">
          ← Back to search
        </Link>
      </Layout>
    );
  }

  if (!loaded) {
    return (
      <Layout title={`@${username}`}>
        <div className="animate-pulse space-y-4 max-w-2xl">
          <div className="h-24 bg-gray-100 rounded-2xl" />
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout title={`@${username}`}>
        <div className="text-center py-16">
          <p className="text-gray-500 mb-3">
            No profile data found for{" "}
            <span className="font-mono text-sm">@{username}</span>
          </p>
          <Link to="/" className="text-violet-600 text-sm font-medium">
            ← Back to search
          </Link>
        </div>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;
  const inList = isInList(user.user_id);

  return (
    <Layout title={user.fullname}>
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to search
        </Link>

        {/* Profile hero card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <img
              src={user.picture}
              alt={`${user.fullname} avatar`}
              className="w-20 h-20 rounded-full object-cover bg-gray-100 flex-shrink-0 ring-2 ring-gray-100"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname)}&background=random&size=80`;
              }}
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-xl font-bold text-gray-900">
                  @{user.username}
                </h2>
                <VerifiedBadge verified={user.is_verified} />
                <span className="ml-1 text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                  {getPlatformLabel(platform)}
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-0.5">{user.fullname}</p>

              {user.description && (
                <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3">
                  {user.description}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <button
                  onClick={handleListToggle}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                    inList
                      ? "bg-violet-50 border-violet-200 text-violet-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                      : "bg-violet-600 border-violet-600 text-white hover:bg-violet-700"
                  }`}
                >
                  {inList ? <Check size={14} /> : <Plus size={14} />}
                  {inList ? "Added to List" : "Add to List"}
                </button>

                {user.url && (
                  <a
                    href={user.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-800 transition-all"
                  >
                    <ExternalLink size={14} />
                    View Profile
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard
            label="Followers"
            value={formatFollowers(user.followers)}
            icon={Users}
          />
          {/* FIX: was incorrectly multiplied by 10000. Now uses shared formatEngagementRate (×100). */}
          <StatCard
            label="Engagement Rate"
            value={formatEngagementRate(user.engagement_rate)}
            icon={TrendingUp}
          />
          {/* FIX: "Engagements" card was showing engagement_rate instead of raw engagement count. */}
          {user.engagements !== undefined && (
            <StatCard
              label="Engagements"
              value={formatEngagements(user.engagements)}
              icon={Heart}
            />
          )}
          {user.posts_count !== undefined && (
            <StatCard
              label="Posts"
              value={user.posts_count.toLocaleString()}
              icon={FileText}
            />
          )}
          {user.avg_likes !== undefined && (
            <StatCard
              label="Avg Likes"
              value={formatFollowers(user.avg_likes)}
              icon={Heart}
            />
          )}
          {user.avg_comments !== undefined && (
            <StatCard
              label="Avg Comments"
              value={formatFollowers(user.avg_comments)}
              icon={MessageCircle}
            />
          )}
          {user.avg_views !== undefined && user.avg_views > 0 && (
            <StatCard
              label="Avg Views"
              value={formatFollowers(user.avg_views)}
              icon={Play}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
