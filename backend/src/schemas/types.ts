import type { z } from 'zod'
import type {
  getItemsQuerySchema,
  postItemsQuerySchema,
  putItemsQuerySchemaBody,
  itemsQuerySchemaParams,
  favoriteItemsQuerySchemaBody,
  dependeciesItemsQuerySchemaBody,
  dependeciesItemsQuerySchema,
} from './itemsSchemas'

export type GetItemsQuery = z.infer<typeof getItemsQuerySchema>
export type PostItemsBody = z.infer<typeof postItemsQuerySchema>
export type PutItemsBody = z.infer<typeof putItemsQuerySchemaBody>
export type ItemsParams = z.infer<typeof itemsQuerySchemaParams>
export type FavoriteItemsBody = z.infer<typeof favoriteItemsQuerySchemaBody>
export type DependenciesItemsBody = z.infer<
  typeof dependeciesItemsQuerySchemaBody
>
export type DependenciesItemsQuery = z.infer<typeof dependeciesItemsQuerySchema>
