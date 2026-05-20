import { mockReviews } from "../data/mock-reviews";
import type { CreateReviewInput } from "../schemas";
import type { CustomerReview, ReviewStorage } from "../types";

type ReviewsApiResponse = {
  data: CustomerReview[];
  meta: {
    count: number;
    storage: ReviewStorage;
  };
};

export async function getReviewsByPlaceId(placeId: string) {
  const searchParams = new URLSearchParams();

  if (placeId.trim()) {
    searchParams.set("placeId", placeId.trim());
  }

  const response = await fetch(`/api/reviews?${searchParams.toString()}`, {
    cache: "no-store"
  });

  return parseReviewsResponse(response);
}

export async function saveSampleReviewsForPlace(placeId: string) {
  const response = await fetch("/api/reviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      reviews: buildSampleReviewInputs(placeId)
    })
  });

  return parseReviewsResponse(response);
}

function buildSampleReviewInputs(placeId: string): CreateReviewInput[] {
  return mockReviews.map((review) => ({
    externalReviewId: review.externalReviewId ?? review.id,
    placeId,
    authorName: review.authorName,
    rating: review.rating,
    content: review.content,
    status: review.status,
    createdAt: review.createdAt
  }));
}

async function parseReviewsResponse(response: Response): Promise<ReviewsApiResponse> {
  const payload: unknown = await response.json();

  if (!response.ok) {
    throw new Error(getApiErrorMessage(payload));
  }

  return payload as ReviewsApiResponse;
}

function getApiErrorMessage(payload: unknown) {
  if (
    payload &&
    typeof payload === "object" &&
    "error" in payload &&
    typeof payload.error === "string"
  ) {
    return payload.error;
  }

  return "Reviews request failed.";
}
