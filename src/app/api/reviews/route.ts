import { NextResponse, type NextRequest } from "next/server";
import { ZodError } from "zod";
import { listReviews, saveReviews } from "@/features/reviews/server/review-repository";
import { saveReviewsRequestSchema } from "@/features/reviews/schemas";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const placeId = request.nextUrl.searchParams.get("placeId")?.trim() || undefined;
    const result = await listReviews(placeId);

    return NextResponse.json({
      data: result.reviews,
      meta: {
        count: result.reviews.length,
        storage: result.storage
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      {
        status: 500
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const payload = saveReviewsRequestSchema.parse(body);
    const result = await saveReviews(payload.reviews);

    return NextResponse.json(
      {
        data: result.reviews,
        meta: {
          count: result.reviews.length,
          storage: result.storage
        }
      },
      {
        status: 201
      }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Invalid review payload.",
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
