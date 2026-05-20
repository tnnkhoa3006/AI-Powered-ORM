import { NextResponse, type NextRequest } from "next/server";
import { ZodError } from "zod";
import { fetchAndStoreReviews } from "@/features/reviews/server/fetch-reviews-service";
import { fetchReviewsRequestSchema } from "@/features/reviews/schemas";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const payload = fetchReviewsRequestSchema.parse(body);
    const result = await fetchAndStoreReviews(payload.placeId);

    return NextResponse.json({
      data: result.reviews,
      meta: {
        count: result.reviews.length,
        storage: result.storage,
        source: result.source
      }
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Invalid fetch reviews payload.",
          details: error.flatten()
        },
        {
          status: 400
        }
      );
    }

    return NextResponse.json(
      { error: getErrorMessage(error) },
      {
        status: 500
      }
    );
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unexpected server error.";
}
