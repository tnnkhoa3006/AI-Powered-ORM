import type { ReplyTone } from "./types";

export const replyLabels: Record<ReplyTone, string> = {
  standard: "Standard",
  friendly: "Friendly",
  solution: "Solution"
};

export const replyDescriptions: Record<ReplyTone, string> = {
  standard: "Professional and neutral",
  friendly: "Warm and conversational",
  solution: "Apology with action plan"
};
