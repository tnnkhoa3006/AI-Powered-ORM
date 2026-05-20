import { z } from "zod";

export const reviewStatusSchema = z.enum(["Pending", "Resolved"]);

export const replyToneSchema = z.enum(["standard", "friendly", "solution"]);

export const createReviewInputSchema = z.object({
  externalReviewId: z.string().trim().min(1).optional(),
  placeId: z.string().trim().min(1),
  authorName: z.string().trim().min(1).default("Anonymous"),
  rating: z.number().int().min(1).max(5).nullable().optional(),
  content: z.string().trim().min(1),
  status: reviewStatusSchema.default("Pending"),
  createdAt: z.string().datetime().optional()
});

export const saveReviewsRequestSchema = z.object({
  reviews: z.array(createReviewInputSchema).min(1).max(20)
});

export const fetchReviewsRequestSchema = z.object({
  placeId: z.string().trim().min(1)
});

export type CreateReviewInput = z.infer<typeof createReviewInputSchema>;
