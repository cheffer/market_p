import {
  ConflictError,
  handleDatabaseError,
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
  ErrorHandlerType,
  DependenciesItemsBody,
  DependenciesItemsQuery,
  FavoriteItemsBody,
  ItemsParams,
  PostItemsBody,
  PutItemsBody,
  GetItemsQuery,
} from '../schemas/types'
import type { FastifyReply } from 'fastify'

// Function to format the name
function formatItemName(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export async function getItemsService(
  filters: GetItemsQuery,
  reply: FastifyReply
) {
  // Criar uma chave única para o cache
  const cacheKey = `items:${JSON.stringify(filters)}:${filters.limit}:${filters.offset}`
  // Verificar se a resposta está no cache
  const cached = await reply.server.redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }
  // Se não encontrado no cache, consultar o banco de dados
  const { Items, totalRecords } = await getItemsFromDB(filters)
  const fullPage = Math.ceil(totalRecords / filters.limit)

  if (Items.length === 0) {
    throw new NotFoundError('The requested resource was not found.')
  }

  // Format the name of each item
  const formattedItems = Items.map(item => ({
    ...item,
    name: formatItemName(item.name),
  }))

  // Armazenar a resposta no cache (feito no middleware)
  await reply.sendCache({
    items: Items,
    pagination: {
      totalRecords,
      pagina: Math.floor(filters.offset / filters.limit) + 1,
      fullPage,
    },
  })

  // Lógica do serviço continua
  return {
    items: Items,
    pagination: {
      totalRecords,
      pagina: Math.floor(filters.offset / filters.limit) + 1,
      fullPage,
    },
  }
}

// Post
export async function postItemsService(itemData: PostItemsBody) {
  try {
    // Format item name before inserting
    const formattedName = formatItemName(itemData.name)
    const formattedItemData = { ...itemData, name: formattedName }

    await insertItemIntoDB(formattedItemData)

    const name = { name: formattedName, limit: 1, offset: 0 }
    const result = await getItemsFromDB(name)
    return result.Items[0]
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

// Put
export async function putItemsService(
  itemData: PutItemsBody,
  itemParams: ItemsParams
) {
  const itemId = { itemId: itemParams.itemId }
  const formattedName = formatItemName(itemData.name)
  const itemName = { name: formattedName, limit: 1, offset: 0 }
  try {
    const resultCountItem = await getCountItems(itemId)
    if (resultCountItem === 0) {
      throw new NotFoundError('Item not found')
    }
    await updateItemSetDB({ ...itemData, name: formattedName }, itemParams)
    const resultGetItems = await getItemsFromDB(itemName)

    return resultGetItems.Items[0]
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

// Delete
export async function deleteItemsService(itemParams: ItemsParams) {
  const itemId = { itemId: itemParams.itemId }
  try {
    const resultCountItem = await getCountItems(itemId)

    if (resultCountItem === 0) {
      throw new NotFoundError('Item not found')
    }
    await deleteItemsInDB(itemParams)
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

// Funções lógicas de favorite
// Put
export async function putFavoriteItemService(
  itemParams: ItemsParams,
  favoriteItemBody: FavoriteItemsBody
) {
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
  dependenciesItemsBody: DependenciesItemsBody
) {
  if (itemParams.itemId === dependenciesItemsBody.dependentItemId) {
    throw new ConflictError('The item cannot be dependent on itself')
  }
  try {
    const resultCountDependentItem = await getCountDependentItem(
      itemParams,
      dependenciesItemsBody
    )
    if (resultCountDependentItem > 0) {
      throw new ValidationError('item already exists')
    }
    const result = await insertDependenciesItemsIntoDB(
      itemParams,
      dependenciesItemsBody
    )
    return result[0]
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

// Delete
export async function deleteDepentenciesItemsService(
  itemParams: ItemsParams,
  itemData: DependenciesItemsQuery
) {
  const dependentItemId = { dependentItemId: itemData.dependentItemId }
  try {
    const resultCountDependentItem = await getCountDependentItem(
      itemParams,
      dependentItemId
    )
    if (resultCountDependentItem === 0) {
      throw new NotFoundError('Item not found')
    }
    await deleteDependenciesItemsInDB(itemParams, itemData)
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}
