/**
 * Format a follower count into a human-readable abbreviated string.
 * e.g. 678546942 → "678.5M", 125000 → "125.0K"
 */
export function formatFollowers(count: number): string {
  if (count >= 1_000_000) return (count / 1_000_000).toFixed(1) + "M";
  if (count >= 1_000) return (count / 1_000).toFixed(1) + "K";
  return count.toString();
}

/**
 * Format an engagement rate decimal into a percentage string.
 * e.g. 0.00024 → "0.02%"
 * FIX: was incorrectly multiplied by 10000 in ProfileDetailPage, should be 100.
 */
export function formatEngagementRate(rate: number | undefined): string {
  if (rate === undefined || rate === null) return "N/A";
  return (rate * 100).toFixed(2) + "%";
}

/**
 * Format a raw engagement count into abbreviated form.
 * e.g. 167378 → "167.4K"
 */
export function formatEngagements(count: number | undefined): string {
  if (count === undefined) return "N/A";
  return formatFollowers(count);
}
