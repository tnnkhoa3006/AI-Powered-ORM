import type { CustomerReview, ReviewFetchSource, ReviewStorage } from "../types";

type ReviewsApiResponse = {
  data: CustomerReview[];
  meta: {
    count: number;
    storage: ReviewStorage;
    source?: ReviewFetchSource;
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

export async function fetchReviewsForPlace(placeId: string) {
  const response = await fetch("/api/reviews/fetch", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      placeId
    })
  });

  return parseReviewsResponse(response);
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
