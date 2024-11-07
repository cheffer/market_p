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
} from '../schemas/types'
import type { FastifyReply } from 'fastify'

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
  offset: number,
  reply: FastifyReply
) {
  // Criar uma chave única para o cache
  const cacheKey = `items:${JSON.stringify(filters)}:${limit}:${offset}`
  // Verificar se a resposta está no cache
  const cached = await reply.server.redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }
  // Se não encontrado no cache, consultar o banco de dados
  const { Items, totalRecords } = await getItemsFromDB(filters, limit, offset)
  const fullPage = Math.ceil(totalRecords / limit)

  if (Items.length === 0) {
    throw new NotFoundError('The requested resource was not found.')
  }

  // Armazenar a resposta no cache (feito no middleware)
  await reply.sendCache({
    items: Items,
    pagination: {
      totalRecords,
      pagina: Math.floor(offset / limit) + 1,
      fullPage,
      limit,
      offset,
    },
  })

  // Lógica do serviço continua
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
  try {
    await insertItemIntoDB(itemData)

    const name = { name: itemData.name }
    const result = await getItemsFromDB(name, 1, 0)
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
  const itemName = { name: itemData.name }
  try {
    const resultCountItem = await getCountItems(itemId)
    if (resultCountItem === 0) {
      throw new NotFoundError('Item not found')
    }
    await updateItemSetDB(itemData, itemParams)
    const resultGetItems = await getItemsFromDB(itemName, 1, 0)

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
