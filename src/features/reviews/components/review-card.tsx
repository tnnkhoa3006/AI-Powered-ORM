import {
  CheckCircle2,
  Circle,
  ClipboardCheck,
  Loader2,
  MessageSquareText,
  Sparkles,
  Star
} from "lucide-react";
import { cn } from "@/lib/cn";
import { replyDescriptions, replyLabels } from "../constants";
import type { CustomerReview, ReplyTone } from "../types";
import { StatusBadge } from "./status-badge";

type ReviewCardProps = {
  review: CustomerReview;
  generating: boolean;
  onGenerateAi: (reviewId: string) => void;
  onSelectReply: (reviewId: string, tone: ReplyTone) => void;
  onApprove: (reviewId: string) => void;
};

export function ReviewCard({
  review,
  generating,
  onGenerateAi,
  onSelectReply,
  onApprove
}: ReviewCardProps) {
  const canApprove = Boolean(review.selectedReply) && review.status === "Pending";
  const aiReplies = review.aiReplies;

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-slate-950">{review.authorName}</h3>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
              {review.rating}/5
            </span>
            <StatusBadge status={review.status} />
          </div>

          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-700">{review.content}</p>
          <p className="mt-2 text-xs text-slate-400">
            Place ID: <span className="font-medium text-slate-500">{review.placeId}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => onGenerateAi(review.id)}
          disabled={generating || review.status === "Resolved"}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-teal-700 px-3 text-sm font-semibold text-teal-800 transition hover:bg-teal-50 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400"
        >
          {generating ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          )}
          Generate AI
        </button>
      </div>

      {aiReplies ? (
        <div className="mt-5 border-t border-slate-200 pt-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-950">
            <MessageSquareText className="h-4 w-4 text-teal-700" aria-hidden="true" />
            AI Suggestions
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            {(Object.keys(aiReplies) as ReplyTone[]).map((tone) => {
              const selected = review.selectedTone === tone;

              return (
                <button
                  type="button"
                  key={tone}
                  onClick={() => onSelectReply(review.id, tone)}
                  disabled={review.status === "Resolved"}
                  className={cn(
                    "flex min-h-[188px] flex-col rounded-lg border p-4 text-left transition",
                    selected
                      ? "border-teal-700 bg-teal-50"
                      : "border-slate-200 bg-white hover:border-slate-300",
                    review.status === "Resolved" && "cursor-not-allowed opacity-75"
                  )}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-950">{replyLabels[tone]}</span>
                    {selected ? (
                      <CheckCircle2 className="h-5 w-5 text-teal-700" aria-hidden="true" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-300" aria-hidden="true" />
                    )}
                  </span>
                  <span className="mt-1 text-xs font-medium text-slate-500">
                    {replyDescriptions[tone]}
                  </span>
                  <span className="mt-3 text-sm leading-6 text-slate-700">
                    {aiReplies[tone]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              {review.selectedReply
                ? "Selected reply is ready for approval."
                : "Choose one generated reply before approving."}
            </p>
            <button
              type="button"
              onClick={() => onApprove(review.id)}
              disabled={!canApprove}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
              Approve
            </button>
          </div>

          {review.selectedReply && review.status === "Resolved" ? (
            <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-950">
              <span className="font-semibold">Selected Reply:</span> {review.selectedReply}
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
