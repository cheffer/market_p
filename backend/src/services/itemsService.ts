import type { z } from 'zod'
import {
  getItemsFromDB,
  insertItemIntoDB,
} from '../repositories/itemsRepository'
import type { postItemsQuerySchema } from '../schemas/itemsSchemas'

type PostItemsBody = z.infer<typeof postItemsQuerySchema>

interface GetItemsQuery {
  name?: string
  categoryId?: string
  favorite?: boolean
  limit?: number
  offset?: number
}

export async function getItemsService(
  filters: GetItemsQuery,
  limit: number,
  offset: number
) {
  try {
    const { Items, totalRegistro } = await getItemsFromDB(
      filters,
      limit,
      offset
    )
    const pagTotal = Math.ceil(totalRegistro / limit)

    return {
      items: Items,
      pagination: {
        totalRegistro,
        pagina: Math.floor(offset / limit) + 1,
        pagTotal,
        limit,
        offset,
      },
    }
  } catch (error) {
    console.error('Error in the item retrieval service:', error)
    throw new Error('Failed to fetch items from database')
  }
}

export async function postItemsService(itemData: PostItemsBody) {
  try {
    const resultItem = await insertItemIntoDB(itemData)
    return { resultItem }
  } catch (error) {
    console.error('Error in the item insertion service:', error)
    throw new Error('Failed to insert item into database')
  }
}
