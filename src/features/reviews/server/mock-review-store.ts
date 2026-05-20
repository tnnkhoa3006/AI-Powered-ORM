import { randomUUID } from "node:crypto";
import { mockReviews } from "../data/mock-reviews";
import type { CreateReviewInput } from "../schemas";
import type { CustomerReview } from "../types";
import { mapCreateReviewInputToCustomerReview } from "./review-mapper";

let reviewStore: CustomerReview[] = mockReviews.map((review) => ({
  ...review,
  externalReviewId: review.id
}));

export function listMockReviews(placeId?: string) {
  return filterAndSortReviews(reviewStore, placeId);
}

export function saveMockReviews(inputs: CreateReviewInput[]) {
  const savedReviews = inputs.map((input) => {
    const existingReview = findExistingReview(input);
    const review = mapCreateReviewInputToCustomerReview(
      input,
      existingReview?.id ?? randomUUID()
    );

    if (existingReview) {
      reviewStore = reviewStore.map((currentReview) =>
        currentReview.id === existingReview.id ? { ...currentReview, ...review } : currentReview
      );
    } else {
      reviewStore = [review, ...reviewStore];
    }

    return review;
  });

  return filterAndSortReviews(savedReviews);
}

function findExistingReview(input: CreateReviewInput) {
  return reviewStore.find((review) => {
    if (input.externalReviewId && review.externalReviewId === input.externalReviewId) {
      return review.placeId === input.placeId;
    }

    return review.placeId === input.placeId && review.content === input.content;
  });
}

function filterAndSortReviews(reviews: CustomerReview[], placeId?: string) {
  return reviews
    .filter((review) => (placeId ? review.placeId === placeId : true))
    .sort((firstReview, secondReview) =>
      secondReview.createdAt.localeCompare(firstReview.createdAt)
    );
}
