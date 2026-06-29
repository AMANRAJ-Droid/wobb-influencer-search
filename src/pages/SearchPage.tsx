import { useState, useMemo, useCallback } from "react";
import type { Platform } from "@/types";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileGrid } from "@/components/ProfileGrid";
import { SelectedList } from "@/components/SelectedList";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");

  // Memoize expensive data extraction
  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);
  const filtered = useMemo(
    () => filterProfiles(allProfiles, searchQuery),
    [allProfiles, searchQuery]
  );

  const handlePlatformChange = useCallback((p: Platform) => {
    setPlatform(p);
    setSearchQuery(""); // reset search when switching platforms
  }, []);

  return (
    <Layout title="Find Creators">
      <div className="flex gap-6">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Page heading */}
          <div className="mb-5">
            <h1 className="text-xl font-bold text-gray-900">
              Discover Creators
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Find and shortlist influencers across platforms
            </p>
          </div>

          <PlatformFilter
            selected={platform}
            onChange={handlePlatformChange}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Results count */}
          <p className="text-xs text-gray-400 mb-3">
            {filtered.length === allProfiles.length
              ? `${allProfiles.length} creators`
              : `${filtered.length} of ${allProfiles.length} creators`}
          </p>

          <ProfileGrid profiles={filtered} platform={platform} />
        </div>

        {/* List sidebar — hidden on small screens */}
        <div className="hidden lg:block">
          <SelectedList />
        </div>
      </div>
    </Layout>
  );
}
