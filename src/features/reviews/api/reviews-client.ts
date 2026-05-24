import type {
  AiReplyProvider,
  CustomerReview,
  ReviewFetchSource,
  ReviewStorage
} from "../types";

type ReviewsApiResponse = {
  data: CustomerReview[];
  meta: {
    count: number;
    storage: ReviewStorage;
    source?: ReviewFetchSource;
    fallbackReason?: string;
  };
};

type GenerateAiApiResponse = {
  data: CustomerReview;
  meta: {
    storage: ReviewStorage;
    provider: AiReplyProvider;
    fallbackReason?: string;
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

export async function generateAiReplies(reviewId: string) {
  const response = await fetch(`/api/reviews/${reviewId}/generate-ai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  });

  return parseGenerateAiResponse(response);
}

async function parseReviewsResponse(response: Response): Promise<ReviewsApiResponse> {
  const payload: unknown = await response.json();

  if (!response.ok) {
    throw new Error(getApiErrorMessage(payload));
  }

  return payload as ReviewsApiResponse;
}

async function parseGenerateAiResponse(response: Response): Promise<GenerateAiApiResponse> {
  const payload: unknown = await response.json();

  if (!response.ok) {
    throw new Error(getApiErrorMessage(payload));
  }

  return payload as GenerateAiApiResponse;
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
