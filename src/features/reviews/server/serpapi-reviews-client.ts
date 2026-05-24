import {
  getSerpApiApiKey,
  getSerpApiLanguage,
  getSerpApiSearchEndpoint,
  hasSerpApiServerConfig
} from "@/lib/serpapi/server";
import type { CreateReviewInput } from "../schemas";

const requestTimeoutMs = 10000;

type SerpApiReviewsResponse = {
  error?: string;
  reviews?: SerpApiReview[];
  search_metadata?: {
    status?: string;
  };
  serpapi_pagination?: {
    next_page_token?: string;
  };
};

type SerpApiReview = {
  review_id?: string;
  link?: string;
  rating?: number;
  iso_date?: string;
  date?: string;
  snippet?: string;
  extracted_snippet?: {
    original?: string;
    translated?: string;
  };
  user?: {
    name?: string;
  };
};

export function hasSerpApiReviewsConfig() {
  return hasSerpApiServerConfig();
}

export async function fetchSerpApiReviews(placeIdOrDataId: string): Promise<CreateReviewInput[]> {
  const collectedReviews: SerpApiReview[] = [];
  let nextPageToken: string | undefined;

  for (let page = 0; page < 3; page += 1) {
    const payload = await fetchSerpApiReviewsPage(placeIdOrDataId, nextPageToken);
    collectedReviews.push(...(payload.reviews ?? []));

    const mappedReviews = mapSerpApiReviewsToInputs(placeIdOrDataId, collectedReviews);

    if (mappedReviews.length >= 5) {
      return mappedReviews;
    }

    nextPageToken = payload.serpapi_pagination?.next_page_token;

    if (!nextPageToken) {
      return mappedReviews;
    }
  }

  return mapSerpApiReviewsToInputs(placeIdOrDataId, collectedReviews);
}

async function fetchSerpApiReviewsPage(
  placeIdOrDataId: string,
  nextPageToken?: string
): Promise<SerpApiReviewsResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const response = await fetch(buildSerpApiReviewsUrl(placeIdOrDataId, nextPageToken), {
      signal: controller.signal,
      cache: "no-store"
    });

    const payload = (await response.json()) as SerpApiReviewsResponse;

    if (!response.ok || payload.error) {
      throw new Error(payload.error ?? `SerpApi request failed with status ${response.status}.`);
    }

    return payload;
  } finally {
    clearTimeout(timeout);
  }
}

function buildSerpApiReviewsUrl(placeIdOrDataId: string, nextPageToken?: string) {
  const url = new URL(getSerpApiSearchEndpoint());
  url.searchParams.set("engine", "google_maps_reviews");
  url.searchParams.set("api_key", getSerpApiApiKey());
  url.searchParams.set("hl", getSerpApiLanguage());
  url.searchParams.set("sort_by", "newestFirst");
  url.searchParams.set("output", "json");

  if (isSerpApiDataId(placeIdOrDataId)) {
    url.searchParams.set("data_id", placeIdOrDataId);
  } else {
    url.searchParams.set("place_id", placeIdOrDataId);
  }

  if (nextPageToken) {
    url.searchParams.set("next_page_token", nextPageToken);
    url.searchParams.set("num", "20");
  }

  return url;
}

function mapSerpApiReviewsToInputs(
  placeIdOrDataId: string,
  reviews: SerpApiReview[]
): CreateReviewInput[] {
  return reviews
    .map((review, index) => {
      const content = getReviewContent(review);

      return {
        externalReviewId:
          review.review_id ?? review.link ?? `${placeIdOrDataId}-serpapi-review-${index}`,
        placeId: placeIdOrDataId,
        authorName: review.user?.name ?? "Google user",
        rating: normalizeRating(review.rating),
        content,
        status: "Pending" as const,
        createdAt: review.iso_date
      };
    })
    .filter((review) => review.content.trim().length > 0)
    .slice(0, 5);
}

function getReviewContent(review: SerpApiReview) {
  return (
    review.extracted_snippet?.original ??
    review.extracted_snippet?.translated ??
    review.snippet ??
    ""
  );
}

function normalizeRating(rating: number | undefined) {
  if (!rating) {
    return null;
  }

  return Math.min(5, Math.max(1, Math.round(rating)));
}

function isSerpApiDataId(value: string) {
  return /^0x[a-f0-9]+:0x[a-f0-9]+$/i.test(value.trim());
}
