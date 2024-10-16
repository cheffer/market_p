import type { z } from 'zod'
import type {
  getItemsQuerySchema,
  postItemsBodySchema,
  putItemsBodySchema,
  itemsParamsSchema,
  favoriteItemsBodySchema,
  dependenciesItemsBodySchema,
  dependenciesItemsQuerySchema,
  itemNameSchema,
  countItemsSchema,
} from './itemsSchemas'

export type GetItemsQuery = z.infer<typeof getItemsQuerySchema>
export type PostItemsBody = z.infer<typeof postItemsBodySchema>
export type PutItemsBody = z.infer<typeof putItemsBodySchema>
export type ItemsParams = z.infer<typeof itemsParamsSchema>
export type ItemName = z.infer<typeof itemNameSchema>
export type FavoriteItemsBody = z.infer<typeof favoriteItemsBodySchema>
export type DependenciesItemsBody = z.infer<typeof dependenciesItemsBodySchema>
export type DependenciesItemsQuery = z.infer<
  typeof dependenciesItemsQuerySchema
>
export type CountItems = z.infer<typeof countItemsSchema>

// Interfaces
export interface ErrorHandlerType {
  code?: string
  message?: string
  detail?: string
}
