import { cn } from "@/lib/cn";
import type { ReviewStatus } from "../types";

type StatusBadgeProps = {
  status: ReviewStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const resolved = status === "Resolved";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold",
        resolved ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
      )}
    >
      {status}
    </span>
  );
}
