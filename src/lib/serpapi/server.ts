const serpApiApiKey = process.env.SERPAPI_API_KEY?.trim();
const serpApiSearchEndpoint =
  process.env.SERPAPI_SEARCH_ENDPOINT?.trim() || "https://serpapi.com/search";
const serpApiLanguage = process.env.SERPAPI_HL?.trim() || "vi";

export function hasSerpApiServerConfig() {
  return Boolean(serpApiApiKey);
}

export function getSerpApiApiKey() {
  if (!serpApiApiKey) {
    throw new Error("Missing SERPAPI_API_KEY.");
  }

  return serpApiApiKey;
}

export function getSerpApiSearchEndpoint() {
  return serpApiSearchEndpoint;
}

export function getSerpApiLanguage() {
  return serpApiLanguage;
}
