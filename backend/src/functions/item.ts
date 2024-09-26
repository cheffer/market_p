import { and, eq, like, sql } from 'drizzle-orm'
import { db } from '../db'
import { category, item, itemDependency } from '../db/schema'

export async function getItems({
  name,
  categoryFilter,
  favorite,
}: { name?: string; categoryFilter?: string; favorite?: boolean }) {
  const filters = { name, categoryFilter, favorite }
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
          filters.name ? like(item.name, `%${filters.name}%`) : undefined, // Filtro por nome
          filters.categoryFilter
            ? eq(item.categoryId, filters.categoryFilter)
            : undefined, // Filtro por categoria
          filters.favorite !== undefined
            ? eq(item.favorite, filters.favorite)
            : undefined // Filtro por favorito
        )
      )
  )
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
      category: sql /*sql*/`      
        JSON_BUILD_OBJECT(
        'categoryId', ${getCategories.categoryId},
        'name', ${getCategories.name} 
        )     
      `.as('category'),
      npcValue: getItems.npcValue,
      howToObtain: getItems.howToObtain,
      dependecies: sql /*sql*/`
        COALESCE(
            JSON_AGG(
                CASE 
                  WHEN ${getDependency.itemDependecyId} IS NOT NULL THEN
                    JSON_BUILD_OBJECT(
                      'itemId', ${getDependency.dependentItemId}
                    )
                  ELSE NULL
                END
            ) FILTER (WHERE ${getDependency.itemDependecyId} IS NOT NULL),
            '[]'  -- Retorna array vazio quando não há dependências
          )
        `.as('itemDependecies'),
    })
    .from(getItems)
    .innerJoin(getCategories, eq(getItems.categoryId, getCategories.categoryId))
    .leftJoin(getDependency, eq(getItems.itemId, getDependency.itemId))
    .groupBy(
      getItems.itemId,
      getItems.name,
      getCategories.categoryId,
      getCategories.name,
      getItems.npcValue,
      getItems.howToObtain
    )

  console.log('categoryId do banco:', item.categoryId)
  console.log('categoryFilter do filtro:', filters.categoryFilter)
  return { Items }
}
