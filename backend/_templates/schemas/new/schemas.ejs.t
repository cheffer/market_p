---
to: src/schemas/<%= name %>Schemas.ts
---
import z from 'zod'

// Schema para consulta de <%= Name %> (GET /<%= Name %>)
export const get<%= Name %>QuerySchema = z.object({
  name: z.string().optional(),
  categoryId: z.string().optional(),
  favorite: z.enum(['true', 'false']).optional(),
  limit: z.string().optional().default('10').transform(Number),
  offset: z.string().optional().default('0').transform(Number),
})
