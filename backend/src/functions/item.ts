import { and, eq, like, sql } from 'drizzle-orm'
import { db } from '../db'
import { category, item, itemDependency } from '../db/schema'

export async function getItems({
  name,
  categoryFilter,
  favorite,
  limit = 10,
  offset = 0,
}: {
  name?: string
  categoryFilter?: string
  favorite?: boolean
  limit?: number
  offset?: number
}) {
  const filters = { name, categoryFilter, favorite }
  try {
    const getItems = db.$with('get_items').as(
      db
        .select({
          itemId: item.itemId,
          name: item.name,
          categoryId: item.categoryId,
          howToObtain: item.howToObtain,
          npcValue: item.npcValue,
        })
        .from(item)
        .where(
          and(
            filters.name ? like(item.name, `%${filters.name}%`) : undefined,
            filters.categoryFilter
              ? eq(item.categoryId, filters.categoryFilter)
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
        count: sql`COUNT(*)`.as('count'),
      })
      .from(item)
      .where(
        and(
          filters.name ? like(item.name, `%${filters.name}%`) : undefined,
          filters.categoryFilter
            ? eq(item.categoryId, filters.categoryFilter)
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
        category: sql`JSON_BUILD_OBJECT(
          'categoryId', ${getCategories.categoryId},
          'name', ${getCategories.name} 
        )`.as('category'),
        npcValue: getItems.npcValue,
        howToObtain: getItems.howToObtain,
        dependecies: sql`COALESCE(
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
        getItems.howToObtain
      )

    return {
      Items,
      pagination: {
        totalRegistro,
        pagina: Math.floor(offset / limit) + 1,
        pagTotal,
        limit,
        offset,
      },
    }
  } catch (error) {
    console.error('Database query error:', error)
    throw new Error('Failed to fetch items from the database')
  }
}
