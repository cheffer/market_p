import {
  deleteDependenciesItemsInDB,
  deleteItemsInDB,
  getCountDependentItem,
  getCountItems,
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

// Funções lógicas Items
// Get
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

// Post
export async function postItemsService(itemData: PostItemsBody) {
  // Verifica se já existe item com esse nome
  const itemName = { itemName: itemData.name }
  const resultCount = await getCountItems(itemName)

  try {
    if (resultCount > 0) {
      throw new Error('item already exists')
    }
    const resultItem = (await insertItemIntoDB(itemData)).result.Items[0]
    return resultItem
  } catch (error) {
    console.error('Error in the item insertion service:', error)
    throw new Error('Failed to insert item into database')
  }
}

// Put
export async function putItemsService(
  itemData: PutItemsBody,
  itemParam: ItemsParams
) {
  // Verifica se existe esse item
  const itemId = { itemId: itemParam.itemId }
  const resultCount = await getCountItems(itemId)
  try {
    if (resultCount === 0) {
      throw new Error('Item not found')
    }
    await updateItemSetDB(itemData, itemParam)
    const itemName = { name: itemData.name }
    const resultItems = await getItemsFromDB(itemName, 1, 0)

    return resultItems.Items[0]
  } catch (error) {
    console.error('Error in item update service:', error)
    throw new Error('Failed to update item in database')
  }
}

// Delete
export async function deleteItemsService(itemParam: ItemsParams) {
  // Verifica existem esse item
  const itemId = { itemId: itemParam.itemId }
  const resultCount = await getCountItems(itemId)

  try {
    if (resultCount === 0) {
      throw new Error('Item not found')
    }
    await deleteItemsInDB(itemParam)
  } catch (error) {
    console.error('Error in the item deletion service:', error)
    throw new Error('Failed to delete item from database')
  }
}

// Funções lógicas de favorite
// Put
export async function putItemsFavoriteService(
  itemParam: ItemsParams,
  favoriteItemBody: FavoriteItemsBody
) {
  // Verifica existe esse item
  const itemId = { itemId: itemParam.itemId }
  const resultCount = await getCountItems(itemId)
  try {
    if (resultCount === 0) {
      throw new Error('Item not found')
    }
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

//Funções lógicas de dependencies items
// Post
export async function postDependenciesItemsService(
  itemParam: ItemsParams,
  dependeciesItemsBody: DependenciesItemsBody
) {
  if (itemParam.itemId === dependeciesItemsBody.dependentItemId) {
    throw new Error('The item cannot be dependent on itself')
  }
  const resultCount = await getCountDependentItem(
    itemParam,
    dependeciesItemsBody
  )
  try {
    if (resultCount > 0) {
      throw new Error('item already exists')
    }
    const result = await insertDependenciesItemsIntoDB(
      itemParam,
      dependeciesItemsBody
    )
    return result[0]
  } catch (error) {
    console.error('Error in the dependent item insertion service:', error)
    throw new Error('Failed to add dependent item to database')
  }
}

// Delete
export async function deleteDepentenciesItemsService(
  itemParam: ItemsParams,
  itemData: DependenciesItemsQuery
) {
  const dependentItemId = { dependentItemId: itemData.dependentItemId }
  const resultCount = await getCountDependentItem(itemParam, dependentItemId)
  try {
    if (resultCount === 0) {
      throw new Error('Item not found')
    }
    const result = await deleteDependenciesItemsInDB(itemParam, itemData)
    return { result }
  } catch (error) {
    console.error('Error in the item deletion service:', error)
    throw new Error('Failed to delete item from database')
  }
}
