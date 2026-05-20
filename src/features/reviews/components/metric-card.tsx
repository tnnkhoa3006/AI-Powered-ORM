import { cn } from "@/lib/cn";

type MetricCardProps = {
  label: string;
  value: number;
  tone?: "slate" | "amber" | "green";
};

export function MetricCard({ label, value, tone = "slate" }: MetricCardProps) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 text-2xl font-semibold",
          tone === "slate" && "text-slate-950",
          tone === "amber" && "text-amber-700",
          tone === "green" && "text-emerald-700"
        )}
      >
        {value}
      </p>
    </div>
  );
}
