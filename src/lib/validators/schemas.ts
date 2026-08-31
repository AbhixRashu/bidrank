import { z } from "zod";

export const createBidSchema = z.object({
  listingId: z.string().cuid("Invalid listing ID"),
  amount: z.number().int().positive("Bid amount must be positive"),
  idempotencyKey: z.string().min(1, "Idempotency key is required"),
});

export const createListingSchema = z.object({
  name: z.string().min(2).max(100),
  url: z.string().url("Invalid URL"),
  tagline: z.string().min(10).max(200),
  description: z.string().min(50).max(5000),
  logoUrl: z.string().url().optional().nullable(),
  categorySlug: z.string().min(1),
  founderName: z.string().max(100).optional().nullable(),
  gstin: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Invalid GSTIN format"
    )
    .optional()
    .nullable(),
  contactEmail: z.string().email("Invalid email"),
  contactPhone: z.string().optional().nullable(),
});

export const clickTrackingSchema = z.object({
  listingId: z.string().cuid("Invalid listing ID"),
  referrer: z.string().optional().nullable(),
});

export type CreateBidInput = z.infer<typeof createBidSchema>;
export type CreateListingInput = z.infer<typeof createListingSchema>;
export type ClickTrackingInput = z.infer<typeof clickTrackingSchema>;
