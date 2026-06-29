import { Camera, PlayCircle, Music2, Search, X } from "lucide-react";
import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const PlatformIcon: Record<Platform, React.ComponentType<{ size?: number; className?: string }>> = {
  instagram: Camera,
  youtube: PlayCircle,
  tiktok: Music2,
};

const activeStyles: Record<Platform, string> = {
  instagram: "bg-pink-600 text-white border-pink-600 shadow-pink-200",
  youtube: "bg-red-600 text-white border-red-600 shadow-red-200",
  tiktok: "bg-slate-800 text-white border-slate-800 shadow-slate-200",
};

export function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Platform tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
        {PLATFORMS.map((p) => {
          const Icon = PlatformIcon[p];
          const isSelected = selected === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-150 ${
                isSelected
                  ? `${activeStyles[p]} shadow-md`
                  : "bg-transparent text-gray-500 border-transparent hover:text-gray-800 hover:bg-white"
              }`}
              aria-pressed={isSelected}
            >
              <Icon size={14} />
              {getPlatformLabel(p)}
            </button>
          );
        })}
      </div>

      {/* Search input */}
      <div className="relative flex-1 max-w-sm">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by username or name…"
          className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow"
          aria-label="Search influencers"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
