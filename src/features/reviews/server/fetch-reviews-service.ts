import { buildSampleReviewInputs } from "../data/mock-reviews";
import type { CreateReviewInput } from "../schemas";
import type { ReviewFetchSource } from "../types";
import { saveReviews } from "./review-repository";
import { fetchSerpApiReviews, hasSerpApiReviewsConfig } from "./serpapi-reviews-client";

type FetchAndStoreReviewsResult = Awaited<ReturnType<typeof saveReviews>> & {
  source: ReviewFetchSource;
  fallbackReason?: string;
};

export async function fetchAndStoreReviews(placeId: string): Promise<FetchAndStoreReviewsResult> {
  const targetPlaceId = placeId.trim();
  const serpApiResult = await tryFetchSerpApiReviews(targetPlaceId);
  const source = serpApiResult.reviews.length > 0 ? "serpapi" : "sample";
  const reviewsToSave =
    source === "serpapi"
      ? serpApiResult.reviews
      : buildSampleReviewInputs(targetPlaceId, {
          count: 5,
          batchId: crypto.randomUUID()
        });
  const savedResult = await saveReviews(reviewsToSave);

  return {
    ...savedResult,
    source,
    fallbackReason: source === "sample" ? serpApiResult.fallbackReason : undefined
  };
}

async function tryFetchSerpApiReviews(placeId: string): Promise<{
  reviews: CreateReviewInput[];
  fallbackReason?: string;
}> {
  if (!hasSerpApiReviewsConfig()) {
    return {
      reviews: [],
      fallbackReason: "SERPAPI_API_KEY is not configured."
    };
  }

  try {
    const reviews = await fetchSerpApiReviews(placeId);

    if (reviews.length === 0) {
      return {
        reviews: [],
        fallbackReason: "SerpApi returned no text reviews for this place."
      };
    }

    return { reviews };
  } catch (error) {
    return {
      reviews: [],
      fallbackReason: error instanceof Error ? error.message : "SerpApi request failed."
    };
  }
}
