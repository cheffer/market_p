import {
  deleteDependenciesItemsInDB,
  deleteItemsInDB,
  getItemsFromDB,
  insertDependenciesItemsIntoDB,
  insertItemIntoDB,
  updateItemSetDB,
  updateItemsFavoriteSetDB,
} from '../repositories/itemsRepository'
import type {
  DependenciesItemsBody,
  DependenciesItemsQuery,
  FavoriteItemsBody,
  ItemsParams,
  PostItemsBody,
  PutItemsBody,
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
  itemParam: ItemsParams
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
export async function deleteItemsService(itemParam: ItemsParams) {
  try {
    const resultItem = await deleteItemsInDB(itemParam)
    return resultItem
  } catch (error) {
    console.error('Error in the item deletion service:', error)
    throw new Error('Failed to delete item from database')
  }
}

// Funções lógicas de post favorite
export async function postItemsFavoriteService(
  itemParam: ItemsParams,
  favoriteItemBody: FavoriteItemsBody
) {
  try {
    const resultItem = await updateItemsFavoriteSetDB(
      itemParam,
      favoriteItemBody
    )
    return resultItem
  } catch (error) {
    console.error('Error in favorite item insertion service:', error)
    throw new Error('Failed to add item as favorite to database')
  }
}

//Funções lógicas de post dependencies items
export async function postDependenciesItemsService(
  itemParam: ItemsParams,
  dependeciesItemsBody: DependenciesItemsBody
) {
  try {
    const result = await insertDependenciesItemsIntoDB(
      itemParam,
      dependeciesItemsBody
    )
    return result
  } catch (error) {
    console.error('Error in the dependent item insertion service:', error)
    throw new Error('Failed to add dependent item to database')
  }
}

export async function deleteDepentenciesItemsService(
  itemParam: ItemsParams,
  itemData: DependenciesItemsQuery
) {
  try {
    const result = await deleteDependenciesItemsInDB(itemParam, itemData)
    return { result }
  } catch (error) {
    console.error('Error in the item deletion service:', error)
    throw new Error('Failed to delete item from database')
  }
}
