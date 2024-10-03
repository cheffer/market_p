import type { z } from 'zod'
import type {
  getItemsQuerySchema,
  postItemsQuerySchema,
  putItemsQuerySchemaBody,
  putItemsQuerySchemaParams,
  deleteItemsQuerySchemaParams,
} from './itemsSchemas'

export type GetItemsQuery = z.infer<typeof getItemsQuerySchema>
export type PostItemsBody = z.infer<typeof postItemsQuerySchema>
export type PutItemsBody = z.infer<typeof putItemsQuerySchemaBody>
export type PutItemsParams = z.infer<typeof putItemsQuerySchemaParams>
export type DeleteItemsParams = z.infer<typeof deleteItemsQuerySchemaParams>
