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
import type {
  creaturesParams,
  getCreaturesQuerySchema,
  postCreaturesBodySchema,
  putCreaturesBodySchema,
} from './creaturesSchemas'
import type {
  creaturesDropsParams,
  getCreaturesDropsQuerySchema,
  postCreaturesDropsBodySchema,
  putCreaturesDropsBodySchema,
} from './creaturesDropsSchemas'
import type {
  getProfessionsQuerySchema,
  inputProfessionsBodySchema,
  professionsParams,
} from './professionsSchemas'
import type {
  getPurchasesQuerySchema,
  postPurchasesBodySchema,
  purchasesParams,
  putPurchasesBodySchema,
} from './purchasesSchemas'

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

// Creatures
export type GetCreaturesQuery = z.infer<typeof getCreaturesQuerySchema>
export type PostCreaturesBody = z.infer<typeof postCreaturesBodySchema>
export type PutCreaturesBody = z.infer<typeof putCreaturesBodySchema>
export type CreaturesParams = z.infer<typeof creaturesParams>

// Creatures Drops
export type GetCreaturesDropsQuery = z.infer<
  typeof getCreaturesDropsQuerySchema
>
export type PostCreaturesDropsBody = z.infer<
  typeof postCreaturesDropsBodySchema
>
export type PutCreaturesDropsBody = z.infer<typeof putCreaturesDropsBodySchema>
export type CreaturesDropsParams = z.infer<typeof creaturesDropsParams>

// Professions
export type GetProfessionsQuery = z.infer<typeof getProfessionsQuerySchema>
export type InputProfessionsBody = z.infer<typeof inputProfessionsBodySchema>
export type ProfessionsParams = z.infer<typeof professionsParams>

// Purchases
export type GetPurchasesQuery = z.infer<typeof getPurchasesQuerySchema>
export type PostPurchasesBody = z.infer<typeof postPurchasesBodySchema>
export type PutPurchasesBody = z.infer<typeof putPurchasesBodySchema>
export type PurchasesParams = z.infer<typeof purchasesParams>

/* Types */

/* Interfaces */
export interface ErrorHandlerType {
  code?: string
  message?: string
  detail?: string
}
/* Interfaces */
