import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  industry: z.string().min(1, "Please select an industry"),
});

export const respondSchema = z.object({
  reviewId: z.string().optional(),
  businessId: z.string().optional(),
  reviewText: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  authorName: z.string().min(1),
  brandVoice: z.string().optional(),
  businessName: z.string().optional(),
});

export const escalateSchema = z.object({
  reviewId: z.string().min(1),
  businessId: z.string().min(1),
});

export const reportSchema = z.object({
  businessId: z.string().min(1),
});

export const settingsSchema = z.object({
  businessName: z.string().min(2),
  industry: z.string().min(1),
  googlePlaceId: z.string().optional(),
  facebookPageId: z.string().optional(),
  brandVoice: z.string().min(10, "Brand voice description must be at least 10 characters"),
  autoRespond: z.boolean(),
  escalationThreshold: z.number().int().min(1).max(5),
  emailNotifications: z.boolean(),
  escalationAlerts: z.boolean(),
  weeklyDigest: z.boolean(),
});
