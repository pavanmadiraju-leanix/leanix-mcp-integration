import { z } from 'zod';

const dynamicQueryParamsSchema = z.object({
  question: z.string().min(1, "Question is required")
});

export { dynamicQueryParamsSchema }; 