import z from 'zod'

// Schema for searching sales (GET /sales)
export const getSalesQuerySchema = z.object({
  itemId: z.string().optional(),
  limit: z.string().optional().default('10').transform(Number),
  offset: z.string().optional().default('0').transform(Number),
})

// Schema for creating sales (POST /sales)
export const postSalesBodySchema = z.object({
  itemId: z
    .string({ required_error: "The 'ItemID' field is mandatory." })
    .min(1, { message: 'The itemId cannot be empty.' }),
  quantity: z
    .number({ required_error: "The 'Quantity' field is mandatory." })
    .min(1, { message: 'The quantity cannot be empty.' }),
  unitPrice: z
    .string()
    .refine(value => !value || !Number.isNaN(Number.parseFloat(value)), {
      message: 'unitPrice must be a valid decimal string.',
    }),
})

// Schema for updating sales (PUT /sales)
export const putSalesBodySchema = z.object({
  quantity: z
    .number({ required_error: "The 'Quantity' field is mandatory." })
    .min(1, { message: 'The quantity cannot be empty.' }),
  unitPrice: z
    .string()
    .refine(value => !value || !Number.isNaN(Number.parseFloat(value)), {
      message: 'unitPrice must be a valid decimal string.',
    }),
})

// Schema for saleId params
export const salesParams = z.object({
  saleId: z.string().min(1, { message: 'saleId cannot be empty.' }),
})
