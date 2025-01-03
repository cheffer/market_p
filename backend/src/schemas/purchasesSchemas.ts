import z from 'zod'

// Schema for searching purchases (GET /purchases)
export const getPurchasesQuerySchema = z.object({
  itemId: z.string().optional(),
  limit: z.string().optional().default('10').transform(Number),
  offset: z.string().optional().default('0').transform(Number),
})

// Schema for creating purchases (POST /purchases)
export const postPurchasesBodySchema = z.object({
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

// Schema for updating purchases (PUT /purchases)
export const putPurchasesBodySchema = z.object({
  quantity: z
    .number({ required_error: "The 'Quantity' field is mandatory." })
    .min(1, { message: 'The quantity cannot be empty.' }),
  unitPrice: z
    .string()
    .refine(value => !value || !Number.isNaN(Number.parseFloat(value)), {
      message: 'unitPrice must be a valid decimal string.',
    }),
})

// Schema for purchaseId params
export const purchasesParams = z.object({
  purchaseId: z.string().min(1, { message: 'pruchaseId cannot be empty.' }),
})
