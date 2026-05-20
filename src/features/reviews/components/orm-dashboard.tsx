"use client";

import { useMemo, useState } from "react";
import { Loader2, MapPin, RefreshCw } from "lucide-react";
import { createMockReplies, demoPlaceId, mockReviews } from "../data/mock-reviews";
import type { CustomerReview, ReplyTone } from "../types";
import { MetricCard } from "./metric-card";
import { ReviewCard } from "./review-card";

export function OrmDashboard() {
  const [placeId, setPlaceId] = useState(demoPlaceId);
  const [reviews, setReviews] = useState<CustomerReview[]>(mockReviews);
  const [fetching, setFetching] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const pendingCount = useMemo(
    () => reviews.filter((review) => review.status === "Pending").length,
    [reviews]
  );

  const resolvedCount = reviews.length - pendingCount;

  function handleFetchReviews() {
    setFetching(true);

    window.setTimeout(() => {
      setReviews(mockReviews.map((review) => ({ ...review, placeId })));
      setFetching(false);
    }, 550);
  }

  function handleGenerateAi(reviewId: string) {
    setGeneratingId(reviewId);

    window.setTimeout(() => {
      setReviews((currentReviews) =>
        currentReviews.map((review) =>
          review.id === reviewId
            ? { ...review, aiReplies: createMockReplies(review), selectedTone: undefined }
            : review
        )
      );
      setGeneratingId(null);
    }, 650);
  }

  function handleSelectReply(reviewId: string, tone: ReplyTone) {
    setReviews((currentReviews) =>
      currentReviews.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              selectedTone: tone,
              selectedReply: review.aiReplies?.[tone]
            }
          : review
      )
    );
  }

  function handleApprove(reviewId: string) {
    setReviews((currentReviews) =>
      currentReviews.map((review) =>
        review.id === reviewId && review.selectedReply
          ? {
              ...review,
              status: "Resolved"
            }
          : review
      )
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f7f9]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-teal-700">
              AI-Powered ORM
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">
              UCOrm Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Manage Google reviews, generate AI response drafts, and approve the
              selected reply from one workspace.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm sm:min-w-[360px]">
            <MetricCard label="Total" value={reviews.length} />
            <MetricCard label="Pending" value={pendingCount} tone="amber" />
            <MetricCard label="Resolved" value={resolvedCount} tone="green" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="flex min-w-0 flex-1 items-center gap-3 rounded-md border border-slate-300 bg-white px-3 py-2.5 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100">
              <MapPin className="h-5 w-5 shrink-0 text-slate-500" aria-hidden="true" />
              <span className="sr-only">Google Place ID</span>
              <input
                value={placeId}
                onChange={(event) => setPlaceId(event.target.value)}
                className="min-w-0 flex-1 border-0 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400"
                placeholder="Enter Google Place ID"
              />
            </label>

            <button
              type="button"
              onClick={handleFetchReviews}
              disabled={fetching || placeId.trim().length === 0}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {fetching ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
              )}
              Fetch Reviews
            </button>
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Review Queue</h2>
              <p className="text-sm text-slate-500">
                Day 1 uses mock data. API and database wiring come next.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                generating={generatingId === review.id}
                onGenerateAi={handleGenerateAi}
                onSelectReply={handleSelectReply}
                onApprove={handleApprove}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
