import type { ProfileDetailResponse } from "@/types";

const profileModules = import.meta.glob<{ default: ProfileDetailResponse }>(
  "../assets/data/profiles/*.json"
);

export async function loadProfileByUsername(
  username: string
): Promise<ProfileDetailResponse | null> {
  const path = `../assets/data/profiles/${username}.json`;
  const loader = profileModules[path];
  if (!loader) return null;

  const mod = await loader();
  return mod.default ?? (mod as unknown as ProfileDetailResponse);
}
