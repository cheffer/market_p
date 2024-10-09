import type { z } from 'zod'
import type {
  getItemsQuerySchema,
  postItemsBodySchema,
  putItemsBodySchema,
  itemsParamsSchema,
  favoriteItemsBodySchema,
  dependeciesItemsBodySchema,
  dependeciesItemsQuerySchema,
  itemNameSchema,
  countItemsSchema,
} from './itemsSchemas'

export type GetItemsQuery = z.infer<typeof getItemsQuerySchema>
export type PostItemsBody = z.infer<typeof postItemsBodySchema>
export type PutItemsBody = z.infer<typeof putItemsBodySchema>
export type ItemsParams = z.infer<typeof itemsParamsSchema>
export type ItemName = z.infer<typeof itemNameSchema>
export type FavoriteItemsBody = z.infer<typeof favoriteItemsBodySchema>
export type DependenciesItemsBody = z.infer<typeof dependeciesItemsBodySchema>
export type DependenciesItemsQuery = z.infer<typeof dependeciesItemsQuerySchema>
export type CountItems = z.infer<typeof countItemsSchema>
