import z from 'zod'

// Schema for searching professions (GET /professions)
export const getProfessionsQuerySchema = z.object({
  name: z.string().optional(),
  specialization: z.string().optional(),
  rank: z.string().optional(),
})

// Schema for creating and put professions (POST /professions)
export const inputProfessionsBodySchema = z.object({
  name: z
    .string({ required_error: "The 'Name' field is mandatory." })
    .min(1, { message: 'The name cannot be empty.' }),
  specialization: z
    .string({ required_error: "The 'Specialization' field is mandatory." })
    .min(1, { message: 'The specialization cannot be empty.' }),
  rank: z
    .string({ required_error: "The 'Rank' field is mandatory." })
    .min(1, { message: 'The rank cannot be empty.' }),
  skill: z
    .string({ required_error: "The 'Skill' field is mandatory." })
    .min(1, { message: 'The skill cannot be empty.' }),
})

// Schema for professionsId params
export const professionsParams = z.object({
  professionId: z.string().min(1, { message: 'professionId cannot be empty.' }),
})
