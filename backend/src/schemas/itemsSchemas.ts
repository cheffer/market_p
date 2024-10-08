import z from 'zod'

// Schema para consulta de itens (GET /items)
export const getItemsQuerySchema = z.object({
  name: z.string().optional(),
  categoryId: z.string().optional(),
  favorite: z.enum(['true', 'false']).optional(),
  //favorite: z.boolean().optional(),
  limit: z.string().optional().default('10').transform(Number),
  offset: z.string().optional().default('0').transform(Number),
})

// Schema para criação de itens (POST /items)
export const postItemsBodySchema = z.object({
  name: z
    .string({ required_error: "The 'name' field is mandatory." })
    .min(1, { message: 'The name cannot be empty.' }),
  description: z.string().optional(),
  categoryId: z.string({
    required_error: "The 'categoryId' field is mandatory.",
  }),
  howToObtain: z.string().optional(),
  favorite: z.enum(['true', 'false']).optional(),
  //favorite: z.boolean().optional(),
  npcValue: z.number().optional(),
})

// Schema para atualização de itens (PUT /items/:{itemId})
export const putItemsBodySchema = z.object({
  name: z
    .string({ required_error: "The 'name' field is mandatory." })
    .min(1, { message: 'The name cannot be empty.' }),
  description: z.string().optional(),
  categoryId: z.string({
    required_error: "The 'categoryId' field is mandatory.",
  }),
  howToObtain: z.string().optional(),
  favorite: z.enum(['true', 'false']).optional(),
  //favorite: z.boolean().optional(),
  npcValue: z
    .string()
    .optional()
    .refine(value => !value || !Number.isNaN(Number.parseFloat(value)), {
      message: 'npcValue must be a valid decimal string.',
    }),
})

// Schema para params itemId
export const itemsParamsSchema = z.object({
  itemId: z.string().min(1, { message: 'itemId cannot be empty.' }),
})

// Schema para favorite Items
export const favoriteItemsBodySchema = z.object({
  favorite: z.boolean(),
})

// Schema para items dependency
export const dependeciesItemsBodySchema = z.object({
  dependentItemId: z
    .string()
    .min(1, { message: 'dependent itemId cannot be empty.' }),
  quantity: z.number().min(1, { message: 'quantity cannot be empty.' }),
})
export const dependeciesItemsQuerySchema = z.object({
  dependentItemId: z.string().min(1, { message: 'itemId cannot be empty.' }),
})
