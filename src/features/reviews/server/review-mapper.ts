import type { Json, Database } from "@/lib/supabase/database.types";
import type { AiReplies, CustomerReview, ReplyTone, ReviewStatus } from "../types";
import type { CreateReviewInput } from "../schemas";

type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];
type ReviewInsert = Database["public"]["Tables"]["reviews"]["Insert"];

const replyTones: ReplyTone[] = ["standard", "friendly", "solution"];

export function mapReviewRowToCustomerReview(row: ReviewRow): CustomerReview {
  return {
    id: row.id,
    externalReviewId: row.external_review_id ?? undefined,
    placeId: row.place_id,
    authorName: row.author_name ?? "Anonymous",
    rating: row.rating ?? 0,
    content: row.content,
    status: mapReviewStatus(row.status),
    createdAt: row.reviewed_at ?? row.created_at,
    aiReplies: mapAiReplies(row.ai_replies),
    selectedTone: mapReplyTone(row.selected_tone),
    selectedReply: row.selected_reply ?? undefined
  };
}

export function mapCreateReviewInputToInsert(input: CreateReviewInput): ReviewInsert {
  return {
    external_review_id: input.externalReviewId ?? null,
    place_id: input.placeId,
    author_name: input.authorName,
    rating: input.rating ?? null,
    content: input.content,
    status: input.status,
    reviewed_at: input.createdAt ?? null
  };
}

export function mapCreateReviewInputToCustomerReview(
  input: CreateReviewInput,
  id: string
): CustomerReview {
  return {
    id,
    externalReviewId: input.externalReviewId,
    placeId: input.placeId,
    authorName: input.authorName,
    rating: input.rating ?? 0,
    content: input.content,
    status: input.status,
    createdAt: input.createdAt ?? new Date().toISOString()
  };
}

function mapReviewStatus(status: string): ReviewStatus {
  return status === "Resolved" ? "Resolved" : "Pending";
}

function mapReplyTone(tone: string | null): ReplyTone | undefined {
  if (!tone) {
    return undefined;
  }

  return replyTones.includes(tone as ReplyTone) ? (tone as ReplyTone) : undefined;
}

function mapAiReplies(value: Json | null): AiReplies | undefined {
  if (!value || Array.isArray(value) || typeof value !== "object") {
    return undefined;
  }

  const candidate = value as Partial<Record<ReplyTone, unknown>>;
  const hasAllReplies = replyTones.every((tone) => typeof candidate[tone] === "string");

  if (!hasAllReplies) {
    return undefined;
  }

  return {
    standard: candidate.standard as string,
    friendly: candidate.friendly as string,
    solution: candidate.solution as string
  };
}
