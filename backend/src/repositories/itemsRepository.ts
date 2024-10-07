import { db } from '../db'
import { and, eq, like, sql } from 'drizzle-orm'
import { category, item, itemDependency } from '../db/schema'
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

// Consulta de items
export async function getItemsFromDB(
  filters: GetItemsQuery,
  limit: number,
  offset: number
) {
  try {
    const getItems = db.$with('get_items').as(
      db
        .select({
          itemId: item.itemId,
          name: item.name,
          categoryId: item.categoryId,
          howToObtain: item.howToObtain,
          npcValue: item.npcValue,
          description: item.description,
          favorite: item.favorite,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })
        .from(item)
        .where(
          and(
            filters.name ? like(item.name, `%${filters.name}%`) : undefined,
            filters.categoryId
              ? eq(item.categoryId, filters.categoryId)
              : undefined,
            filters.favorite !== undefined
              ? eq(item.favorite, filters.favorite)
              : undefined
          )
        )
        .limit(limit)
        .offset(offset)
    )

    // Consulta para contar o total de registros
    const totalCount = await db
      .select({
        count: sql /*sql*/`COUNT(*)`.as('count'),
      })
      .from(item)
      .where(
        and(
          filters.name ? like(item.name, `%${filters.name}%`) : undefined,
          filters.categoryId
            ? eq(item.categoryId, filters.categoryId)
            : undefined,
          filters.favorite !== undefined
            ? eq(item.favorite, filters.favorite)
            : undefined
        )
      )

    const totalRegistro = Number(totalCount[0]?.count) || 0
    const pagTotal = Math.ceil(totalRegistro / limit) // Total de páginas

    const getCategories = db.$with('get_categories').as(
      db
        .select({
          categoryId: category.categoryId,
          name: category.name,
        })
        .from(category)
    )

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
      .with(getItems, getCategories, getDependency)
      .select({
        itemId: getItems.itemId,
        name: getItems.name,
        category: sql /*sql*/`JSON_BUILD_OBJECT(
              'categoryId', ${getCategories.categoryId},
              'name', ${getCategories.name} 
            )`.as('category'),
        npcValue: getItems.npcValue,
        howToObtain: getItems.howToObtain,
        description: getItems.description,
        favorite: getItems.favorite,
        createdAt: sql /*sql*/`DATE(${getItems.createdAt})`.as('createdAt'),
        updatedAt: sql /*sql*/`DATE(${getItems.updatedAt})`.as('updatedAt'),
        dependecies: sql /*sql*/`COALESCE(
                JSON_AGG(
                    CASE 
                      WHEN ${getDependency.itemDependecyId} IS NOT NULL THEN
                        JSON_BUILD_OBJECT(
                          'itemId', ${getDependency.dependentItemId}
                        )
                      ELSE NULL
                    END
                ) FILTER (WHERE ${getDependency.itemDependecyId} IS NOT NULL),
                '[]'  
              )`.as('itemDependecies'),
      })
      .from(getItems)
      .innerJoin(
        getCategories,
        eq(getItems.categoryId, getCategories.categoryId)
      )
      .leftJoin(getDependency, eq(getItems.itemId, getDependency.itemId))
      .groupBy(
        getItems.itemId,
        getItems.name,
        getCategories.categoryId,
        getCategories.name,
        getItems.npcValue,
        getItems.howToObtain,
        getItems.description,
        getItems.favorite,
        sql /*sql*/`DATE(${getItems.createdAt})`,
        sql /*sql*/`DATE(${getItems.updatedAt})`
      )

    return {
      Items,
      totalRegistro,
    }
  } catch (error) {
    console.error('Database query error:', error)
    throw new Error('Failed to fetch items from the database')
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
    const idInsert = {
      name: resultInsert[0].name,
    }
    const result = await getItemsFromDB(idInsert, 1, 0)
    return { result }
  } catch (error) {
    console.error('Database query error:', error)
    throw new Error('Failed to insert items into the database')
  }
}

// Atualização de items
export async function updateItemSetDB(
  itemData: PutItemsBody,
  itemParam: ItemsParams
) {
  try {
    const result = await db
      .update(item)
      .set({
        name: itemData.name,
        description: itemData.description,
        categoryId: itemData.categoryId,
        howToObtain: itemData.howToObtain,
        favorite:
          itemData.favorite === 'true'
            ? true
            : itemData.favorite === 'false'
              ? false
              : undefined,
        npcValue: itemData.npcValue
          ? Number.parseFloat(itemData.npcValue).toString()
          : null,
        updatedAt: new Date(),
      })
      .where(eq(item.itemId, itemParam.itemId))
      .returning()
    return { result }
  } catch (error) {
    console.error('Database query error:', error)
    throw new Error('Failed to update items in the database')
  }
}

// Delete de items
export async function deleteItemsInDB(itemParam: ItemsParams) {
  try {
    const result = await db
      .delete(item)
      .where(eq(item.itemId, itemParam.itemId))
      .returning()
    return result
  } catch (error) {
    console.error('Database query error:', error)
    throw new Error('Failed to delete items in the database')
  }
}

// Update items favorite
export async function updateItemsFavoriteSetDB(
  itemParam: ItemsParams,
  favoriteItemBody: FavoriteItemsBody
) {
  try {
    const result = await db
      .update(item)
      .set({ favorite: favoriteItemBody.favorite, updatedAt: new Date() })
      .where(eq(item.itemId, itemParam.itemId))
      .returning()
    return { result }
  } catch (error) {
    console.error('Database query error:', error)
    throw new Error('Failed to update favorite item from database')
  }
}

// Insert dependencies items
export async function insertDependenciesItemsIntoDB(
  itemParam: ItemsParams,
  dependeciesItemsBody: DependenciesItemsBody
) {
  try {
    const result = await db
      .insert(itemDependency)
      .values({
        itemId: itemParam.itemId,
        dependentItemId: dependeciesItemsBody.dependentItemId,
        quantity: dependeciesItemsBody.quantity,
        updatedAt: new Date(),
      })
      .returning()
    return { result }
  } catch (error) {
    console.error('Database query error:', error)
    throw new Error('Failed to insert database dependent item')
  }
}

// Delete dependencies items
export async function deleteDependenciesItemsInDB(
  itemParam: ItemsParams,
  itemData: DependenciesItemsQuery
) {
  try {
    const result = await db
      .delete(itemDependency)
      .where(
        and(
          eq(itemDependency.itemId, itemParam.itemId),
          eq(itemDependency.dependentItemId, itemData.dependentItemId)
        )
      )
      .returning()
    return result
  } catch (error) {
    console.error('Database query error:', error)
    throw new Error('Failed to delete items in the database')
  }
}
