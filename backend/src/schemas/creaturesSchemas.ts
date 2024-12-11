import z from 'zod'

// Schema for searching creatures (GET /creatures)
export const getCreaturesQuerySchema = z.object({
  name: z.string().optional(),
  type: z.string().optional(),
  location: z.string().optional(),
  limit: z.string().optional().default('10').transform(Number),
  offset: z.string().optional().default('0').transform(Number),
})

// Schema for creating creatures (POST /creatures)
export const postCreaturesBodySchema = z.object({
  name: z
    .string({ required_error: "The 'name' field is mandatory." })
    .min(1, { message: 'The name cannot be empty.' }),
  type: z.string().optional(),
  location: z.string().optional(),
})

// Schema for updating creatures (PUT /creatures/:{creatureId})
export const putCreaturesBodySchema = z.object({
  name: z
    .string({ required_error: "The 'name' field is mandatory." })
    .min(1, { message: 'The name cannot be empty.' }),
  type: z.string().optional(),
  location: z.string().optional(),
})

// Schema for creatureId params
export const creaturesParams = z.object({
  creatureId: z.string().min(1, { message: 'creatureId cannot be empty.' }),
})
