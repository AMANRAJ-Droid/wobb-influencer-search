import { BadgeCheck } from "lucide-react";

interface VerifiedBadgeProps {
  verified: boolean;
}

export function VerifiedBadge({ verified }: VerifiedBadgeProps) {
  if (!verified) return null;
  return (
    <BadgeCheck
      size={14}
      className="inline-block ml-1 text-blue-500 fill-blue-500 stroke-white"
      aria-label="Verified"
    />
  );
}
