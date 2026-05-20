import { NextResponse, type NextRequest } from "next/server";
import {
  generateAiRepliesForReview,
  ReviewNotFoundError
} from "@/features/reviews/server/generate-ai-service";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    reviewId: string;
  }>;
};

export async function POST(_request: NextRequest, context: RouteContext) {
  try {
    const { reviewId } = await context.params;
    const result = await generateAiRepliesForReview(reviewId);

    return NextResponse.json({
      data: result.review,
      meta: {
        storage: result.storage,
        provider: result.provider,
        fallbackReason: result.fallbackReason
      }
    });
  } catch (error) {
    if (error instanceof ReviewNotFoundError) {
      return NextResponse.json(
        {
          error: error.message
        },
        {
          status: 404
        }
      );
    }

    return NextResponse.json(
      {
        error: getErrorMessage(error)
      },
      {
        status: 500
      }
    );
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unexpected server error.";
}
