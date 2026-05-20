import type { CustomerReview } from "../types";

export const reviewReplySystemPrompt =
  "You write concise, professional customer review replies for online reputation management. Return only valid JSON with exactly these top-level keys: standard, friendly, solution.";

export const reviewReplyJsonSchema = {
  name: "review_reply_suggestions",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["standard", "friendly", "solution"],
    properties: {
      standard: {
        type: "string",
        description: "A formal and balanced business reply. No slang."
      },
      friendly: {
        type: "string",
        description: "A warmer reply using a human team voice."
      },
      solution: {
        type: "string",
        description: "An apology-focused reply naming a concrete next step."
      }
    }
  }
} as const;

export function buildReviewReplyUserPrompt(review: CustomerReview) {
  return [
    "Generate three reply options for this customer review.",
    "Write in Vietnamese unless the review is clearly in another language.",
    "Keep each reply between 35 and 80 words.",
    "The three replies must be clearly different in tone, opening sentence, and structure.",
    "standard: professional, calm, and concise.",
    "friendly: warm, conversational, and appreciative.",
    "solution: direct apology plus one concrete operational action related to the review.",
    "Do not mention AI, internal systems, policies, or unsupported compensation.",
    "",
    `Author: ${review.authorName}`,
    `Rating: ${review.rating}/5`,
    `Review: ${review.content}`
  ].join("\n");
}
