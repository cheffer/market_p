import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../errors/customErrors'
import {
  deleteDependenciesItemsInDB,
  deleteItemsInDB,
  getCountDependentItem,
  getCountItems,
  getItemsFromDB,
  insertDependenciesItemsIntoDB,
  insertItemIntoDB,
  updateItemSetDB,
  updateFavoriteItemSetDB,
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
  const { Items, totalRecords } = await getItemsFromDB(filters, limit, offset)
  const fullPage = Math.ceil(totalRecords / limit)
  if (Items.length === 0) {
    throw new NotFoundError('The requested resource was not found.')
  }
  return {
    items: Items,
    pagination: {
      totalRecords,
      pagina: Math.floor(offset / limit) + 1,
      fullPage,
      limit,
      offset,
    },
  }
}

// Post
export async function postItemsService(itemData: PostItemsBody) {
  // Verifica se já existe item com esse nome
  const itemName = { itemName: itemData.name }
  const resultCount = await getCountItems(itemName)

  if (resultCount > 0) {
    throw new ValidationError('item already exists')
  }
  const resultInsertItem = (await insertItemIntoDB(itemData)).result.Items[0]
  return resultInsertItem
}

// Put
export async function putItemsService(
  itemData: PutItemsBody,
  itemParams: ItemsParams
) {
  // Verifica se existe esse item
  const itemId = { itemId: itemParams.itemId }
  const itemName = { name: itemData.name }
  /*const itemIdentify = { itemId: itemParams.itemId, itemName: itemData.name }*/
  const resultCountItem = await getCountItems(itemId)
  if (resultCountItem === 0) {
    throw new NotFoundError('Item not found')
  }
  //ajustar verificação
  /*const resultIdentifyItem = await getCountItems(itemIdentify)
  if (resultIdentifyItem === 0) {
    throw new ConflictError('An item with that name already exists')
  }*/
  await updateItemSetDB(itemData, itemParams)
  const resultGetItems = await getItemsFromDB(itemName, 1, 0)

  return resultGetItems.Items[0]
}

// Delete
export async function deleteItemsService(itemParams: ItemsParams) {
  // Verifica existem esse item
  const itemId = { itemId: itemParams.itemId }
  const resultCountItem = await getCountItems(itemId)

  if (resultCountItem === 0) {
    throw new NotFoundError('Item not found')
  }
  await deleteItemsInDB(itemParams)
}

// Funções lógicas de favorite
// Put
export async function putFavoriteItemService(
  itemParams: ItemsParams,
  favoriteItemBody: FavoriteItemsBody
) {
  // Verifica existe esse item
  const itemId = { itemId: itemParams.itemId }
  const resultCountItem = await getCountItems(itemId)
  if (resultCountItem === 0) {
    throw new NotFoundError('Item not found')
  }
  const resultUpdateItem = await updateFavoriteItemSetDB(
    itemParams,
    favoriteItemBody
  )
  return resultUpdateItem
}

//Funções lógicas de dependencies items
// Post
export async function postDependenciesItemsService(
  itemParams: ItemsParams,
  dependeciesItemsBody: DependenciesItemsBody
) {
  if (itemParams.itemId === dependeciesItemsBody.dependentItemId) {
    throw new ConflictError('The item cannot be dependent on itself')
  }
  const resultCountDependentItem = await getCountDependentItem(
    itemParams,
    dependeciesItemsBody
  )
  if (resultCountDependentItem > 0) {
    throw new ValidationError('item already exists')
  }
  const result = await insertDependenciesItemsIntoDB(
    itemParams,
    dependeciesItemsBody
  )
  return result[0]
}

// Delete
export async function deleteDepentenciesItemsService(
  itemParams: ItemsParams,
  itemData: DependenciesItemsQuery
) {
  const dependentItemId = { dependentItemId: itemData.dependentItemId }
  const resultCountDependentItem = await getCountDependentItem(
    itemParams,
    dependentItemId
  )
  if (resultCountDependentItem === 0) {
    throw new NotFoundError('Item not found')
  }
  await deleteDependenciesItemsInDB(itemParams, itemData)
}
