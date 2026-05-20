import { createMockReplies } from "../data/mock-reviews";
import type { AiReplyProvider, CustomerReview } from "../types";
import { generateOpenAiReplies, hasAiProviderConfig } from "./openai-reply-client";
import { getReviewById, updateReviewAiReplies } from "./review-repository";

export class ReviewNotFoundError extends Error {
  constructor(reviewId: string) {
    super(`Review not found: ${reviewId}`);
    this.name = "ReviewNotFoundError";
  }
}

type GenerateAiRepliesResult = Awaited<ReturnType<typeof updateReviewAiReplies>> & {
  provider: AiReplyProvider;
  fallbackReason?: string;
};

export async function generateAiRepliesForReview(
  reviewId: string
): Promise<GenerateAiRepliesResult> {
  const { review } = await getReviewById(reviewId);

  if (!review) {
    throw new ReviewNotFoundError(reviewId);
  }

  const generationResult = await generateReplies(review);
  const updatedResult = await updateReviewAiReplies(review.id, generationResult.replies);

  if (!updatedResult.review) {
    throw new ReviewNotFoundError(reviewId);
  }

  return {
    ...updatedResult,
    provider: generationResult.provider,
    fallbackReason: generationResult.fallbackReason
  };
}

async function generateReplies(review: CustomerReview) {
  if (!hasAiProviderConfig()) {
    return {
      replies: createMockReplies(review),
      provider: "mock" as const,
      fallbackReason: "OPENAI_API_KEY is not configured."
    };
  }

  try {
    return {
      replies: await generateOpenAiReplies(review),
      provider: "openai" as const
    };
  } catch (error) {
    return {
      replies: createMockReplies(review),
      provider: "mock" as const,
      fallbackReason: error instanceof Error ? error.message : "OpenAI request failed."
    };
  }
}
