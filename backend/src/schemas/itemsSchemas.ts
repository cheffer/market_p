import z from 'zod'

// Schema for searching itens (GET /items)
export const getItemsQuerySchema = z.object({
  name: z.string().optional(),
  categoryId: z.string().optional(),
  favorite: z.enum(['true', 'false']).optional(),
  limit: z.string().optional().default('10').transform(Number),
  offset: z.string().optional().default('0').transform(Number),
})

// Schema for creating items (POST /items)
export const postItemsBodySchema = z.object({
  name: z
    .string({ required_error: "The 'name' field is mandatory." })
    .min(1, { message: 'The name cannot be empty.' }),
  description: z.string().optional(),
  categoryId: z.string({
    required_error: "The 'categoryId' field is mandatory.",
  }),
  howToObtain: z.string().optional(),
  //favorite: z.enum(['true', 'false']).optional(),
  favorite: z.boolean().optional(),
  npcValue: z.number().optional(),
})

// Schema for updating items (PUT /items/:{itemId})
export const putItemsBodySchema = z.object({
  name: z
    .string({ required_error: "The 'name' field is mandatory." })
    .min(1, { message: 'The name cannot be empty.' }),
  description: z.string().optional(),
  categoryId: z.string({
    required_error: "The 'categoryId' field is mandatory.",
  }),
  howToObtain: z.string().optional(),
  favorite: z.boolean().optional(),
  npcValue: z
    .string()
    .optional()
    .refine(value => !value || !Number.isNaN(Number.parseFloat(value)), {
      message: 'npcValue must be a valid decimal string.',
    }),
})

// Schema for itemId params
export const itemsParamsSchema = z.object({
  itemId: z.string().min(1, { message: 'itemId cannot be empty.' }),
})

// Schema for itemName
export const itemNameSchema = z.object({
  itemName: z.string().min(1, { message: 'itemName cannot be empty.' }),
})

// Schema for favorite Items
export const favoriteItemsBodySchema = z.object({
  favorite: z.boolean(),
})

// Schema for dependency items
export const dependenciesItemsBodySchema = z.object({
  dependentItemId: z
    .string()
    .min(1, { message: 'dependent itemId cannot be empty.' }),
  quantity: z.number().min(1, { message: 'quantity cannot be empty.' }),
})
export const dependenciesItemsQuerySchema = z.object({
  dependentItemId: z.string().min(1, { message: 'itemId cannot be empty.' }),
})

// Schema for queries in items
export const countItemsSchema = z.object({
  itemId: z.string().optional(),
  itemName: z.string().optional(),
})
