const openAiApiKey = process.env.OPENAI_API_KEY?.trim();
const openAiModel = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
const openAiChatCompletionsEndpoint =
  process.env.OPENAI_CHAT_COMPLETIONS_ENDPOINT?.trim() ||
  "https://api.openai.com/v1/chat/completions";

export function hasOpenAiServerConfig() {
  return Boolean(openAiApiKey);
}

export function getOpenAiModel() {
  return openAiModel;
}

export function getOpenAiChatCompletionsEndpoint() {
  return openAiChatCompletionsEndpoint;
}

export function getOpenAiApiKey() {
  if (!openAiApiKey) {
    throw new Error("Missing OPENAI_API_KEY.");
  }

  return openAiApiKey;
}
