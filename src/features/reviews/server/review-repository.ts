import { createSupabaseServerClient, hasSupabaseServerConfig } from "@/lib/supabase/server";
import type { ReviewStorage } from "../types";
import type { CreateReviewInput } from "../schemas";
import { mapCreateReviewInputToInsert, mapReviewRowToCustomerReview } from "./review-mapper";
import { listMockReviews, saveMockReviews } from "./mock-review-store";

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
