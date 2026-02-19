import { z } from "zod";

export const createLeadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(7, "Phone must be at least 7 characters").max(20),
  course: z.string().min(1, "Course is required").max(100),
  college: z.string().min(1, "College is required").max(200),
  year: z.string().min(1, "Year is required").max(20),
});

export const listLeadsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  course: z.string().optional(),
  status: z.enum(["NEW", "CONTACTED"]).optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED"]),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type ListLeadsQuery = z.infer<typeof listLeadsQuerySchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
