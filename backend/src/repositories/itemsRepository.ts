import { db } from '../db'
import { and, eq, like, sql, asc, desc } from 'drizzle-orm'
import { category, item, itemDependency } from '../db/schema'
import type {
  CountItems,
  ErrorHandlerType,
  DependenciesItemsBody,
  DependenciesItemsQuery,
  FavoriteItemsBody,
  ItemsParams,
  PostItemsBody,
  PutItemsBody,
  GetItemsQuery,
} from '../schemas/types'
import { DatabaseError, handleDatabaseError } from '../errors/customErrors'
import type { Column, SQL } from 'drizzle-orm'

// Consultas de validação
// Items
export async function getCountItems(itemsData: CountItems) {
  try {
    const query = db
      .select({
        count: sql /*sql*/`COUNT(*)`.as('count'),
      })
      .from(item)
    const conditions = []

    // Adiciona condição por nome se fornecido
    if (itemsData.itemName) {
      conditions.push(
        sql`LOWER(${item.name}) LIKE ${`%${itemsData.itemName.toLowerCase()}%`}`
      )
    }

    // Adiciona condição por ID se fornecido
    if (itemsData.itemId) {
      conditions.push(eq(item.itemId, itemsData.itemId))
    }

    // Se houver condições, aplica ao query
    if (conditions.length > 0) {
      query.where(and(...conditions))
    }

    const resultCountItems = await query
    const result = Number(resultCountItems[0].count)
    return result
  } catch (error) {
    console.error('Database query error:', error)
    throw new DatabaseError('Failed to fetch items from the database')
  }
}

// Item Depedente
export async function getCountDependentItem(
  itemParams: ItemsParams,
  dependenciesItems: DependenciesItemsQuery
) {
  try {
    const resultCount = await db
      .select({
        count: sql /*sql*/`COUNT(*)`.as('count'),
      })
      .from(itemDependency)
      .where(
        and(
          eq(itemDependency.itemId, itemParams.itemId),
          eq(itemDependency.dependentItemId, dependenciesItems.dependentItemId)
        )
      )
    const result = Number(resultCount[0].count)
    return result
  } catch (error) {
    console.error('Database query error:', error)
    throw new DatabaseError('Failed to fetch items from the database')
  }
}

// Consulta de items
export async function getItemsFromDB(filters: GetItemsQuery) {
  // Definir a função de ordenação de forma dinâmica
  const getSortMethod = (
    column: Column | SQL.Aliased,
    order: 'asc' | 'desc'
  ) => {
    return order === 'desc' ? desc(column) : asc(column)
  }
  const sortOrder: 'asc' | 'desc' = filters.sortOrder ?? 'asc'
  try {
    const getItems = db.$with('get_items').as(
      db
        .select({
          itemId: item.itemId,
          name: item.name,
          categoryId: item.categoryId,
          categoryName: sql`${category.name}`.as('categoryName'),
          howToObtain: item.howToObtain,
          npcValue: item.npcValue,
          description: item.description,
          favorite: item.favorite,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })
        .from(item)
        .leftJoin(category, eq(category.categoryId, item.categoryId))
        .where(
          and(
            filters.name
              ? sql`LOWER(${item.name}) LIKE ${`%${filters.name.toLowerCase()}%`}`
              : undefined,
            filters.categoryId
              ? eq(item.categoryId, filters.categoryId)
              : undefined,
            filters.favorite === 'true'
              ? eq(item.favorite, true)
              : filters.favorite === 'false'
                ? eq(item.favorite, false)
                : undefined
          )
        )
        .orderBy(
          filters.sortBy === 'favorite'
            ? getSortMethod(item.favorite, sortOrder)
            : filters.sortBy === 'category'
              ? getSortMethod(category.name, sortOrder)
              : getSortMethod(item.name, sortOrder)
        )
        .limit(filters.limit)
        .offset(filters.offset)
    )

    // Consulta para contar o total de registros
    const totalCount = await db
      .select({
        count: sql /*sql*/`COUNT(*)`.as('count'),
      })
      .from(item)
      .where(
        and(
          filters.name
            ? sql`LOWER(${item.name}) LIKE ${`%${filters.name.toLowerCase()}%`}`
            : undefined,
          filters.categoryId
            ? eq(item.categoryId, filters.categoryId)
            : undefined,
          filters.favorite === 'true'
            ? eq(item.favorite, true)
            : filters.favorite === 'false'
              ? eq(item.favorite, false)
              : undefined
        )
      )

    const totalRecords = Number(totalCount[0]?.count) || 0

    const getDependency = db.$with('get_dependency').as(
      db
        .select({
          itemDependecyId: itemDependency.itemDependecyId,
          itemId: itemDependency.itemId,
          dependentItemId: itemDependency.dependentItemId,
          quantity: itemDependency.quantity,
        })
        .from(itemDependency)
    )

    const Items = await db
      .with(getItems, getDependency)
      .select({
        itemId: getItems.itemId,
        name: getItems.name,
        category: sql /*sql*/`JSON_BUILD_OBJECT(
              'categoryId', ${getItems.categoryId},
              'categoryName', ${getItems.categoryName} 
            )`.as('category'),
        npcValue: getItems.npcValue,
        howToObtain: getItems.howToObtain,
        description: getItems.description,
        favorite: getItems.favorite,
        createdAt: sql /*sql*/`DATE(${getItems.createdAt})`.as('createdAt'),
        updatedAt: sql /*sql*/`DATE(${getItems.updatedAt})`.as('updatedAt'),
        dependencies: sql /*sql*/`COALESCE(
                JSON_AGG(
                    CASE 
                      WHEN ${getDependency.itemDependecyId} IS NOT NULL THEN
                        JSON_BUILD_OBJECT(
                          'dependentItemId', ${getDependency.dependentItemId},
                          'quantity', ${getDependency.quantity}
                        )
                      ELSE NULL
                    END
                ) FILTER (WHERE ${getDependency.itemDependecyId} IS NOT NULL),
                '[]'  
              )`.as('itemDependencies'),
      })
      .from(getItems)
      .leftJoin(getDependency, eq(getItems.itemId, getDependency.itemId))
      .groupBy(
        getItems.itemId,
        getItems.name,
        getItems.categoryId,
        getItems.categoryName,
        getItems.npcValue,
        getItems.howToObtain,
        getItems.description,
        getItems.favorite,
        sql /*sql*/`DATE(${getItems.createdAt})`,
        sql /*sql*/`DATE(${getItems.updatedAt})`
      )
      .orderBy(
        filters.sortBy === 'favorite'
          ? getSortMethod(getItems.favorite, sortOrder)
          : filters.sortBy === 'category'
            ? getSortMethod(getItems.categoryName, sortOrder)
            : getSortMethod(getItems.name, sortOrder)
      )

    return {
      Items,
      totalRecords,
    }
  } catch (error) {
    console.error('Database query error:', error)
    throw new DatabaseError('Failed to fetch items from the database')
  }
}

// Criação de items
export async function insertItemIntoDB(itemData: PostItemsBody) {
  try {
    const resultInsert = await db
      .insert(item)
      .values({
        name: itemData.name,
        description: itemData.description,
        categoryId: itemData.categoryId,
        howToObtain: itemData.howToObtain,
        favorite: itemData.favorite,
        npcValue: itemData.npcValue,
      })
      .returning()
    return resultInsert
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

// Atualização de items
export async function updateItemSetDB(
  itemData: PutItemsBody,
  itemParams: ItemsParams
) {
  try {
    const result = await db
      .update(item)
      .set({
        name: itemData.name,
        description: itemData.description,
        categoryId: itemData.categoryId,
        howToObtain: itemData.howToObtain,
        favorite: itemData.favorite,
        npcValue: itemData.npcValue
          ? Number.parseFloat(itemData.npcValue).toString()
          : null,
        updatedAt: new Date(),
      })
      .where(eq(item.itemId, itemParams.itemId))
      .returning()
    return { result }
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

// Delete de items
export async function deleteItemsInDB(itemParams: ItemsParams) {
  try {
    const result = await db
      .delete(item)
      .where(eq(item.itemId, itemParams.itemId))
      .returning()
    return result
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}

// Update items favorite
export async function updateFavoriteItemSetDB(
  itemParams: ItemsParams,
  favoriteItemBody: FavoriteItemsBody
) {
  try {
    const result = await db
      .update(item)
      .set({ favorite: favoriteItemBody.favorite, updatedAt: new Date() })
      .where(eq(item.itemId, itemParams.itemId))
      .returning()
    return { result }
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
    throw new DatabaseError('Error while updating item in the database')
  }
}

// Insert dependencies items
export async function insertDependenciesItemsIntoDB(
  itemParams: ItemsParams,
  dependenciesItemsBody: DependenciesItemsBody
) {
  try {
    const result = await db
      .insert(itemDependency)
      .values({
        itemId: itemParams.itemId,
        dependentItemId: dependenciesItemsBody.dependentItemId,
        quantity: dependenciesItemsBody.quantity,
        updatedAt: new Date(),
      })
      .returning()
    return result
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
    throw new DatabaseError('Error while inserting item into the database')
  }
}

// Delete dependencies items
export async function deleteDependenciesItemsInDB(
  itemParams: ItemsParams,
  itemData: DependenciesItemsQuery
) {
  try {
    const result = await db
      .delete(itemDependency)
      .where(
        and(
          eq(itemDependency.itemId, itemParams.itemId),
          eq(itemDependency.dependentItemId, itemData.dependentItemId)
        )
      )
      .returning()
    return result
  } catch (error) {
    handleDatabaseError(error as ErrorHandlerType)
  }
}
