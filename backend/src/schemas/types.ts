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
import type {
  categoriesParams,
  postCategoriesBodySchema,
  putCategoriesBodySchema,
} from './categoriesSchemas'
import type {
  craftsParams,
  getCraftsQuerySchema,
  postCraftsBodySchema,
  putCraftsBodySchema,
} from './craftsSchemas'

/* Types */
// Items
export type GetItemsQuery = z.infer<typeof getItemsQuerySchema>
export type PostItemsBody = z.infer<typeof postItemsBodySchema>
export type PutItemsBody = z.infer<typeof putItemsBodySchema>
export type ItemsParams = z.infer<typeof itemsParamsSchema>
export type ItemName = z.infer<typeof itemNameSchema>
export type CountItems = z.infer<typeof countItemsSchema>
// Favorite Items
export type FavoriteItemsBody = z.infer<typeof favoriteItemsBodySchema>
// Dependencies Items
export type DependenciesItemsBody = z.infer<typeof dependenciesItemsBodySchema>
export type DependenciesItemsQuery = z.infer<
  typeof dependenciesItemsQuerySchema
>

// Categories
export type PostCategoriesBody = z.infer<typeof postCategoriesBodySchema>
export type PutCategoriesBody = z.infer<typeof putCategoriesBodySchema>
export type CategoriesParams = z.infer<typeof categoriesParams>

// Crafts
export type GetCraftsQuery = z.infer<typeof getCraftsQuerySchema>
export type PostCraftsBody = z.infer<typeof postCraftsBodySchema>
export type PutCraftsBody = z.infer<typeof putCraftsBodySchema>
export type CraftsParams = z.infer<typeof craftsParams>
/* Types */

/* Interfaces */
export interface ErrorHandlerType {
  code?: string
  message?: string
  detail?: string
}
/* Interfaces */
