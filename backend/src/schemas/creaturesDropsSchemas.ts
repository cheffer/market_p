import z from 'zod'

// Schema for searching creatures drop (GET /creatures/drops)
export const getCreaturesDropsQuerySchema = z.object({
  creatureId: z.string().optional(),
  itemId: z.string().optional(),
  limit: z.string().optional().default('10').transform(Number),
  offset: z.string().optional().default('0').transform(Number),
})

// Schema for creating creatures drop (POST /creatures/drops)
export const postCreaturesDropsBodySchema = z.object({
  creatureId: z.string(),
  itemId: z.string(),
  dropChance: z.number().optional(),
  dropAmount: z.string().optional(),
})

// Schema for updating creatures drop (PUT /creatures/drops/:{creatureDropId})
export const putCreaturesDropsBodySchema = z.object({
  creatureId: z.string(),
  itemId: z.string(),
  dropChance: z
    .string()
    .optional()
    .refine(value => !value || !Number.isNaN(Number.parseFloat(value)), {
      message: 'dropChance must be a valid decimal string.',
    }),
  dropAmount: z.string().optional(),
})

// Schema for creatureDropId params
export const creaturesDropsParams = z.object({
  creatureDropId: z
    .string()
    .min(1, { message: 'creatureDropId cannot be empty.' }),
})
