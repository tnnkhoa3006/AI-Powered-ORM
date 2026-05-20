import {
  getOpenAiApiKey,
  getOpenAiChatCompletionsEndpoint,
  getOpenAiModel,
  hasOpenAiServerConfig
} from "@/lib/openai/server";
import { aiRepliesResponseSchema } from "../schemas";
import type { AiReplies, CustomerReview } from "../types";
import {
  buildReviewReplyUserPrompt,
  reviewReplyJsonSchema,
  reviewReplySystemPrompt
} from "./ai-reply-prompts";

type OpenAiChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  error?: {
    message?: string;
  };
};

export function hasAiProviderConfig() {
  return hasOpenAiServerConfig();
}

export async function generateOpenAiReplies(review: CustomerReview): Promise<AiReplies> {
  const response = await fetch(getOpenAiChatCompletionsEndpoint(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getOpenAiApiKey()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: getOpenAiModel(),
      messages: [
        {
          role: "system",
          content: reviewReplySystemPrompt
        },
        {
          role: "user",
          content: buildReviewReplyUserPrompt(review)
        }
      ],
      temperature: 0.7,
      response_format: {
        type: "json_schema",
        json_schema: reviewReplyJsonSchema
      }
    })
  });

  const payload = (await response.json()) as OpenAiChatCompletionResponse;

  if (!response.ok || payload.error) {
    throw new Error(payload.error?.message ?? "OpenAI request failed.");
  }

  const content = payload.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI returned an empty response.");
  }

  return aiRepliesResponseSchema.parse(JSON.parse(content));
}
