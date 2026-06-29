import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { X, ListChecks, Trash2, Users } from "lucide-react";
import { useListStore } from "@/store/listStore";
import { formatFollowers } from "@/utils/formatters";

const PLATFORM_DOT: Record<string, string> = {
  instagram: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400",
  youtube: "bg-red-500",
  tiktok: "bg-slate-800",
};

export function SelectedList() {
  const entries = useListStore((s) => s.entries);
  const removeFromList = useListStore((s) => s.removeFromList);
  const clearList = useListStore((s) => s.clearList);
  const navigate = useNavigate();

  const handleNavigate = useCallback(
    (username: string, platform: string) => {
      navigate(`/profile/${username}?platform=${platform}`);
    },
    [navigate]
  );

  return (
    <aside className="w-72 flex-shrink-0">
      <div className="sticky top-20 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ListChecks size={16} className="text-violet-600" />
            <span className="text-sm font-semibold text-gray-800">
              My List
            </span>
            {entries.length > 0 && (
              <span className="bg-violet-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                {entries.length}
              </span>
            )}
          </div>
          {entries.length > 0 && (
            <button
              onClick={clearList}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Clear all"
            >
              <Trash2 size={12} />
              Clear
            </button>
          )}
        </div>

        {/* Content */}
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-3">
              <Users size={18} className="text-gray-300" />
            </div>
            <p className="text-sm text-gray-400">No creators added yet</p>
            <p className="text-xs text-gray-300 mt-1">
              Hit &ldquo;Add&rdquo; on any profile
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50 max-h-[calc(100vh-14rem)] overflow-y-auto">
            {entries.map(({ profile, platform }) => (
              <li
                key={profile.user_id}
                className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 transition-colors group"
              >
                {/* Avatar + platform dot */}
                <div className="relative flex-shrink-0">
                  <button
                    onClick={() => handleNavigate(profile.username, platform)}
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-full"
                    aria-label={`View ${profile.username}`}
                  >
                    <img
                      src={profile.picture}
                      alt={profile.fullname}
                      className="w-9 h-9 rounded-full object-cover bg-gray-100 hover:opacity-90 transition-opacity"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullname)}&background=random&size=36`;
                      }}
                    />
                  </button>
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${PLATFORM_DOT[platform] ?? "bg-gray-400"}`}
                    title={platform}
                  />
                </div>

                {/* Name + followers */}
                <button
                  onClick={() => handleNavigate(profile.username, platform)}
                  className="flex-1 min-w-0 text-left focus-visible:outline-none"
                >
                  <p className="text-xs font-medium text-gray-800 truncate">
                    @{profile.username}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatFollowers(profile.followers)} followers
                  </p>
                </button>

                {/* Remove */}
                <button
                  onClick={() => removeFromList(profile.user_id)}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all"
                  aria-label={`Remove ${profile.username} from list`}
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Footer summary */}
        {entries.length > 0 && (
          <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-400">
              {entries.length} creator{entries.length !== 1 ? "s" : ""} ·{" "}
              {[...new Set(entries.map((e) => e.platform))].join(", ")}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
