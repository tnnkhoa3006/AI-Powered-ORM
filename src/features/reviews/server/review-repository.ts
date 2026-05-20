import { createSupabaseServerClient, hasSupabaseServerConfig } from "@/lib/supabase/server";
import type { AiReplies, ReviewStorage } from "../types";
import type { CreateReviewInput } from "../schemas";
import {
  mapAiRepliesToJson,
  mapCreateReviewInputToInsert,
  mapReviewRowToCustomerReview
} from "./review-mapper";
import {
  getMockReviewById,
  listMockReviews,
  saveMockReviews,
  updateMockReviewAiReplies
} from "./mock-review-store";

export async function listReviews(placeId?: string) {
  if (!hasSupabaseServerConfig()) {
    return {
      reviews: listMockReviews(placeId),
      storage: "mock" satisfies ReviewStorage
    };
  }

  const supabase = createSupabaseServerClient();
  let query = supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (placeId) {
    query = query.eq("place_id", placeId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return {
    reviews: data.map(mapReviewRowToCustomerReview),
    storage: "supabase" satisfies ReviewStorage
  };
}

export async function saveReviews(inputs: CreateReviewInput[]) {
  if (!hasSupabaseServerConfig()) {
    return {
      reviews: saveMockReviews(inputs),
      storage: "mock" satisfies ReviewStorage
    };
  }

  const supabase = createSupabaseServerClient();
  const rows = inputs.map(mapCreateReviewInputToInsert);

  const { data, error } = await supabase
    .from("reviews")
    .upsert(rows, {
      onConflict: "place_id,external_review_id"
    })
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return {
    reviews: data.map(mapReviewRowToCustomerReview),
    storage: "supabase" satisfies ReviewStorage
  };
}

export async function getReviewById(reviewId: string) {
  if (!hasSupabaseServerConfig()) {
    return {
      review: getMockReviewById(reviewId),
      storage: "mock" satisfies ReviewStorage
    };
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("id", reviewId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return {
    review: data ? mapReviewRowToCustomerReview(data) : null,
    storage: "supabase" satisfies ReviewStorage
  };
}

export async function updateReviewAiReplies(reviewId: string, aiReplies: AiReplies) {
  if (!hasSupabaseServerConfig()) {
    return {
      review: updateMockReviewAiReplies(reviewId, aiReplies),
      storage: "mock" satisfies ReviewStorage
    };
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("reviews")
    .update({
      ai_replies: mapAiRepliesToJson(aiReplies),
      selected_tone: null,
      selected_reply: null
    })
    .eq("id", reviewId)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return {
    review: data ? mapReviewRowToCustomerReview(data) : null,
    storage: "supabase" satisfies ReviewStorage
  };
}
