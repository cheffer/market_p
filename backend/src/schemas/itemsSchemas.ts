import z from 'zod'

// Schema para consulta de itens (GET /items)
export const getItemsQuerySchema = z.object({
  name: z.string().optional(),
  categoryId: z.string().optional(),
  favorite: z.enum(['true', 'false']).optional(),
  limit: z.string().optional().default('10').transform(Number),
  offset: z.string().optional().default('0').transform(Number),
})

// Schema para criação de itens (POST /items)
export const postItemsQuerySchema = z.object({
  name: z
    .string({ required_error: "The 'name' field is mandatory." })
    .min(1, { message: 'The name cannot be empty.' }),
  description: z.string().optional(),
  categoryId: z.string({
    required_error: "The 'categoryId' field is mandatory.",
  }),
  howToObtain: z.string().optional(),
  favorite: z.enum(['true', 'false']).optional(),
  npcValue: z.number().optional(),
})
