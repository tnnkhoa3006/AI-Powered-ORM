export type ReviewStatus = "Pending" | "Resolved";

export type ReplyTone = "standard" | "friendly" | "solution";

export type AiReplies = Record<ReplyTone, string>;

export type ReviewStorage = "supabase" | "mock";

export type ReviewFetchSource = "serpapi" | "sample";

export type AiReplyProvider = "openai" | "mock";

export type CustomerReview = {
  id: string;
  externalReviewId?: string;
  placeId: string;
  authorName: string;
  rating: number;
  content: string;
  status: ReviewStatus;
  createdAt: string;
  aiReplies?: AiReplies;
  selectedTone?: ReplyTone;
  selectedReply?: string;
};
