import {
  deleteItemsInDB,
  getItemsFromDB,
  insertItemIntoDB,
  updateItemSetDB,
} from '../repositories/itemsRepository'
import type {
  DeleteItemsParams,
  PostItemsBody,
  PutItemsBody,
  PutItemsParams,
} from '../schemas/types'

interface GetItemsQuery {
  name?: string
  categoryId?: string
  favorite?: boolean
  limit?: number
  offset?: number
}

// Funções lógicas de get Items
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

// Funções lógicas de post Items
export async function postItemsService(itemData: PostItemsBody) {
  // Verificar se já existe um item com o mesmo nome
  const existingItem = await getItemsFromDB({ name: itemData.name }, 1, 0)
  if (existingItem.Items.length > 0) {
    // Lança um erro se já existe um item com o mesmo nome
    throw new Error('An item with this name already exists.')
  }
  try {
    const resultItem = await insertItemIntoDB(itemData)
    return { resultItem }
  } catch (error) {
    console.error('Error in the item insertion service:', error)
    throw new Error('Failed to insert item into database')
  }
}

// Funções lógicas de put Items
export async function putItemsService(
  itemData: PutItemsBody,
  itemParam: PutItemsParams
) {
  try {
    const resultItem = await updateItemSetDB(itemData, itemParam)
    return resultItem
  } catch (error) {
    console.error('Error in item update service:', error)
    throw new Error('Failed to update item in database')
  }
}

// Funções lógicas de delete Items
export async function deleteItemsService(itemParam: DeleteItemsParams) {
  try {
    const resultItem = await deleteItemsInDB(itemParam)
    return resultItem
  } catch (error) {
    console.error('Error in the item deletion service:', error)
    throw new Error('Failed to delete item from database')
  }
}
