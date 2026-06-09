import { z } from 'zod';

/**
 * Validate prompt title
 */
export const titleSchema = z
  .string()
  .min(1, 'Title is required')
  .max(200, 'Title must be 200 characters or less');

/**
 * Validate prompt body
 */
export const bodySchema = z
  .string()
  .min(1, 'Prompt body is required')
  .max(50000, 'Body must be 50,000 characters or less');

/**
 * Validate rating (1-5)
 */
export const ratingSchema = z.number().min(1).max(5).optional();

/**
 * Validate category ID
 */
export const categoryIdSchema = z.string().min(1, 'Category is required');

/**
 * Full prompt validation
 */
export const promptSchema = z.object({
  title: titleSchema,
  body: bodySchema,
  description: z.string().max(500).optional(),
  categoryId: categoryIdSchema,
  model: z.string().optional(),
  useCase: z.string().max(500).optional(),
  notes: z.string().max(1000).optional(),
  rating: ratingSchema,
});

export type PromptValidation = z.infer<typeof promptSchema>;
