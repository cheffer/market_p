import z from 'zod'

// Schema for searching crafts (GET /crafts)
export const getCraftsQuerySchema = z.object({
  itemId: z.string().optional(),
  professionId: z.string().optional(),
  requiredRank: z
    .string()
    .length(1, "The 'requiredRank' must be a single character.")
    .regex(
      /^[a-eA-EsS]$/,
      'Only S, A, B, C, D, E and s, a, b, c, d, e are allowed.'
    )
    .optional(),
  requiredSkill: z.string().optional().transform(Number),
  sortBy: z.enum(['requiredRank', 'requiredSkill']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  limit: z.string().optional().default('10').transform(Number),
  offset: z.string().optional().default('0').transform(Number),
})

// Schema for creating crafts (POST /crafts)
export const postCraftsBodySchema = z.object({
  itemId: z.string({
    required_error: "The 'itemId' field is mandatory.",
  }),
  professionId: z.string({
    required_error: "The 'professionId' field is mandatory.",
  }),
  requiredRank: z
    .string()
    .length(1, "The 'requiredRank' must be a single character.")
    .regex(
      /^[a-eA-EsS]$/,
      'Only S, A, B, C, D, E and s, a, b, c, d, e are allowed.'
    )
    .optional(),
  requiredSkill: z.number().optional(),
  producedQuantity: z.number().optional(),
  creationTime: z
    .string()
    .regex(
      /^(\d{2}):(\d{2}):(\d{2})$/,
      'Invalid time format. Expected HH:mm:ss.'
    )
    .optional(),
})

// Schema for updating craft (PUT /crafts/:{craftId})
export const putCraftsBodySchema = z.object({
  itemId: z.string({
    required_error: "The 'itemId' field is mandatory.",
  }),
  professionId: z.string({
    required_error: "The 'professionId' field is mandatory.",
  }),
  requiredRank: z
    .string()
    .length(1, "The 'requiredRank' must be a single character.")
    .regex(
      /^[a-eA-EsS]$/,
      'Only S, A, B, C, D, E and s, a, b, c, d, e are allowed.'
    )
    .optional(),
  requiredSkill: z.number().optional(),
  producedQuantity: z.number().optional(),
  creationTime: z
    .string()
    .regex(
      /^(\d{2}):(\d{2}):(\d{2})$/,
      'Invalid time format. Expected HH:mm:ss.'
    )
    .optional(),
})

// Schema for craftId params
export const craftsParams = z.object({
  craftId: z.string().min(1, { message: 'craftId cannot be empty.' }),
})

// Schema for creating crafts (POST /crafts)
export const checkCraftsSchema = z.object({
  itemId: z.string({
    required_error: "The 'itemId' field is mandatory.",
  }),
  professionId: z.string({
    required_error: "The 'professionId' field is mandatory.",
  }),
})
