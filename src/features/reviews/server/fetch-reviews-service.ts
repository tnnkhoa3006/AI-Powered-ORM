import { buildSampleReviewInputs } from "../data/mock-reviews";
import type { ReviewFetchSource } from "../types";
import { saveReviews } from "./review-repository";

type FetchAndStoreReviewsResult = Awaited<ReturnType<typeof saveReviews>> & {
  source: ReviewFetchSource;
};

export async function fetchAndStoreReviews(placeId: string): Promise<FetchAndStoreReviewsResult> {
  const targetPlaceId = placeId.trim();
  const reviewsToSave = buildSampleReviewInputs(targetPlaceId, {
    count: 5,
    batchId: crypto.randomUUID()
  });
  const savedResult = await saveReviews(reviewsToSave);

  return {
    ...savedResult,
    source: "sample"
  };
}
