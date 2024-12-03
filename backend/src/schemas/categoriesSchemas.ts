import z from 'zod'

// Schema for creating Categories (POST /Categories)
export const postCategoriesBodySchema = z.object({
  name: z
    .string({ required_error: "The 'name' field is mandatory." })
    .min(1, { message: 'The name cannot be empty.' }),
  description: z.string().optional(),
})

// Schema for updating Categories (PUT /Categories)
export const putCategoriesBodySchema = z.object({
  name: z
    .string({ required_error: "The 'name' field is mandatory." })
    .min(1, { message: 'The name cannot be empty.' }),
  description: z.string().optional(),
})

// Schema for categoryId params
export const categoriesParams = z.object({
  categoryId: z.string().min(1, { message: 'categoryId cannot be empty.' }),
})
