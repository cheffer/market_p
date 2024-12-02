import z from 'zod'

// Schema para consulta de Categories (GET /Categories)
export const getCategoriesQuerySchema = z.object({
  name: z.string().optional(),
  categoryId: z.string().optional(),
  favorite: z.enum(['true', 'false']).optional(),
  limit: z.string().optional().default('10').transform(Number),
  offset: z.string().optional().default('0').transform(Number),
})
