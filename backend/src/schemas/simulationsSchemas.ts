import z from 'zod'

// Schema for searching simulations (GET /simulations)
export const getSimulationsQuerySchema = z.object({
  itemId: z.string().optional(),
  limit: z.string().optional().default('10').transform(Number),
  offset: z.string().optional().default('0').transform(Number),
})

// Schema for creating simulations (POST /simulations)
export const postSimulationsBodySchema = z.object({
  itemId: z
    .string({ required_error: "The 'ItemID' field is mandatory." })
    .min(1, { message: 'The itemId cannot be empty.' }),
  quantity: z
    .number({ required_error: "The 'Quantity' field is mandatory." })
    .min(1, { message: 'The quantity cannot be empty.' }),
  currentSellProfit: z
    .string()
    .refine(value => !value || !Number.isNaN(Number.parseFloat(value)), {
      message: 'currentSellProfit must be a valid decimal string.',
    }),
  currentBuyCost: z
    .string()
    .refine(value => !value || !Number.isNaN(Number.parseFloat(value)), {
      message: 'currentBuyCost must be a valid decimal string.',
    }),
})

// Schema for updating simulations (PUT /simulations)
export const putSimulationsBodySchema = z.object({
  quantity: z
    .number({ required_error: "The 'Quantity' field is mandatory." })
    .min(1, { message: 'The quantity cannot be empty.' }),
  currentSellProfit: z
    .string()
    .refine(value => !value || !Number.isNaN(Number.parseFloat(value)), {
      message: 'currentSellProfit must be a valid decimal string.',
    }),
  currentBuyCost: z
    .string()
    .refine(value => !value || !Number.isNaN(Number.parseFloat(value)), {
      message: 'currentBuyCost must be a valid decimal string.',
    }),
})

// Schema for simulationId params
export const simulationsParams = z.object({
  simulationId: z.string().min(1, { message: 'simulationId cannot be empty.' }),
})
